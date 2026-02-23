window.fetchFB = async () => {
    const urlInput = document.getElementById('fbUrl').value;
    const btnText = document.getElementById('btnText');
    const loader = document.getElementById('loader');
    const resultCard = document.getElementById('resultCard');

    if (!urlInput) return;

    btnText.disabled = true;
    loader.classList.remove('hidden');
    resultCard.classList.add('hidden');

    try {
        const apiUrl = `https://api.giftedtech.co.ke/api/download/facebook?apikey=gifted&url=${encodeURIComponent(urlInput)}`;
        const { data } = await axios.get(apiUrl);

        if (data.success && data.result) {
            const res = data.result;
            
            document.getElementById('thumb').src = res.thumbnail;
            document.getElementById('title').innerText = res.title || "Facebook Video";

            const dlBtn = document.getElementById('dlHD');
            
            // USE HD VIDEO LINK (It's usually the best quality with sound)
            const videoUrl = res.hd_video || res.sd_video;

            dlBtn.onclick = () => {
                // Method 1: Direct Link Trigger (Best for Sound + Files Folder)
                const link = document.createElement('a');
                link.href = videoUrl;
                link.download = `FB_Video_${Date.now()}.mp4`;
                link.target = '_blank'; // Opens in new tab to force browser downloader
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };

            resultCard.classList.remove('hidden');
        }
    } catch (e) {
        alert("Error fetching video.");
    } finally {
        btnText.disabled = false;
        loader.classList.add('hidden');
    }
};
