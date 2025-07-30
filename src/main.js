// Native HTML5 video player for showreel
const video = document.getElementById('player');

// Toggle sound on click
let soundEnabled = false;

video.addEventListener('click', () => {
    if (!soundEnabled) {
        // Turn sound on
        video.muted = false;
        video.volume = 1.0;
        soundEnabled = true;
        console.log('Sound enabled!');

        // Force play to ensure audio context is activated
        video.play().catch(e => console.log('Play error:', e));
    } else {
        // Turn sound off
        video.muted = true;
        soundEnabled = false;
        console.log('Sound disabled!');
    }
});

// Prevent pausing - auto-resume if paused
video.addEventListener('pause', () => {
    video.play();
});

window.player = video;

