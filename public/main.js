// Home page specific functionality - showreel video handling
document.addEventListener('DOMContentLoaded', () => {
    // Get the showreel video element
    const video = document.getElementById('player');

    if (video && window.cursor) {
        // Initialize showreel functionality with the cursor
        window.cursor.initShowreel(video);
    }
});


