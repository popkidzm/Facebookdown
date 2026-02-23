async function fetchFBVideo() {
    const urlInput = document.getElementById('fbUrl').value;
    const fetchBtn = document.getElementById('fetchBtn');
    const loader = document.getElementById('loader');
    const resultCard = document.getElementById('resultCard');

    if (!urlInput) return alert("Paste a link first!");

    fetchBtn.disabled = true;
    loader.classList.remove('hidden');
    resultCard.classList.add('hidden');

    try {
        const apiUrl = `https://api.giftedtech.co.ke/api/download/facebook?apikey=gifted&url=${encodeURIComponent(urlInput)}`;
        const { data } = await axios.get(apiUrl);

        if (data.success && data.result) {
            const res = data.result;
            
            // Set basic info
            document.getElementById('fbThumb').src = res.thumbnail;
            document.getElementById('fbTitle').innerText = res.title || "Facebook Video";
            document.getElementById('fbDuration').innerText = "Duration: " + (res.duration || "N/A");

            // Setup HD Button
            const btnHD = document.getElementById('btnHD');
            const txtHD = document.getElementById('txtHD');
            btnHD.onclick = () => startImmediateDownload(res.hd_video, "HD_Video.mp4", txtHD);

            // Setup SD Button
            const btnSD = document.getElementById('btnSD');
            const txtSD = document.getElementById('txtSD');
            btnSD.onclick = () => startImmediateDownload(res.sd_video, "SD_Video.mp4", txtSD);

            resultCard.classList.remove('hidden');
        } else {
            alert("No video found. Check if the post is public.");
        }
    } catch (error) {
        alert("API Error. Try again later.");
    } finally {
        fetchBtn.disabled = false;
        loader.classList.add('hidden');
    }
}

async function startImmediateDownload(videoUrl, filename, textElement) {
    if (!videoUrl) return alert("Quality not available.");
    
    const originalText = textElement.innerText;
    textElement.innerText = "Saving...";

    try {
        const response = await fetch(videoUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        textElement.innerText = "Done!";
    } catch (e) {
        // If blob fails, use standard download as fallback
        window.open(videoUrl, '_blank');
        textElement.innerText = "Redirecting...";
    }

    setTimeout(() => { textElement.innerText = originalText; }, 3000);
}
