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
            const videoUrl = res.hd_video || res.sd_video;

            // DIRECT DOWNLOAD ACTION
            dlBtn.onclick = async () => {
                const originalContent = dlBtn.innerHTML;
                dlBtn.innerHTML = `<i class="fas fa-spinner animate-spin"></i> Saving...`;
                dlBtn.disabled = true;

                try {
                    await startDirectDownload(videoUrl, `FB_Video_${Date.now()}.mp4`);
                    dlBtn.innerHTML = `<i class="fas fa-check"></i> Saved!`;
                } catch (e) {
                    // Fallback: If security blocks the silent download, use a hidden link
                    const link = document.createElement('a');
                    link.href = videoUrl;
                    link.download = "video.mp4";
                    link.click();
                    dlBtn.innerHTML = originalContent;
                } finally {
                    setTimeout(() => {
                        dlBtn.innerHTML = originalContent;
                        dlBtn.disabled = false;
                    }, 3000);
                }
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

/**
 * Downloads the video data into memory first
 * to ensure sound is kept and it saves directly to Files.
 */
async function startDirectDownload(url, filename) {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Clean up memory
    setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
    }, 1000);
}
