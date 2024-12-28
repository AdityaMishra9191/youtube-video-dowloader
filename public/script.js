async function downloadVideo() {
    const videoUrl = document.getElementById('videoUrl').value;
    const statusDiv = document.getElementById('status');
    const downloadLinkDiv = document.getElementById('download-link');
    const loadingSpinner = document.getElementById('loading-spinner');
    const previewDiv = document.getElementById('preview');
    
    if (!videoUrl) {
        showStatus('Please enter a YouTube URL', 'error');
        return;
    }

    // Reset UI
    downloadLinkDiv.innerHTML = '';
    previewDiv.innerHTML = '';
    showStatus('Starting download...', 'info');
    loadingSpinner.style.display = 'flex';

    try {
        const response = await fetch('/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: videoUrl })
        });

        const data = await response.json();

        if (response.ok) {
            showStatus('✅ ' + data.message, 'success');
            downloadLinkDiv.innerHTML = `
                <a href="/download/${encodeURIComponent(data.fileName)}" download>
                    <i class="fas fa-download"></i> Download ${data.title}
                </a>
            `;

            // Try to get video thumbnail from YouTube
            const videoId = extractVideoId(videoUrl);
            if (videoId) {
                previewDiv.innerHTML = `
                    <img src="https://img.youtube.com/vi/${videoId}/maxresdefault.jpg" 
                         alt="Video thumbnail" 
                         onerror="this.src='https://img.youtube.com/vi/${videoId}/0.jpg'">
                `;
            }
        } else {
            showStatus('❌ ' + (data.error || 'Download failed'), 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showStatus('❌ An error occurred while downloading', 'error');
    } finally {
        loadingSpinner.style.display = 'none';
    }
}

function showStatus(message, type) {
    const statusDiv = document.getElementById('status');
    statusDiv.innerHTML = message;
    statusDiv.className = 'status ' + type;
}

function extractVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}