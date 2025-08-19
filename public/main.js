// Create cursor dot element
const cursorDot = document.createElement('div');
cursorDot.className = 'cursor-dot';
document.body.appendChild(cursorDot);

// Create sound icons
const soundIconContainer = document.createElement('div');
soundIconContainer.className = 'sound-icon';
cursorDot.appendChild(soundIconContainer);

// Update cursor position
document.addEventListener('mousemove', (e) => {
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
});

// Native HTML5 video player for showreel
const video = document.getElementById('player');
let soundEnabled = false;

// Update sound icon based on state
function updateSoundIcon() {
    soundIconContainer.innerHTML = soundEnabled 
        ? '<img src="/sound-on.svg" alt="Sound On" width="6" height="6">'
        : '<img src="/sound-off.svg" alt="Sound Off" width="6" height="6">';
}

// Initialize with muted state icon
updateSoundIcon();

// Handle showreel hover
video.addEventListener('mouseenter', () => {
    cursorDot.classList.add('expanded');
});

video.addEventListener('mouseleave', () => {
    cursorDot.classList.remove('expanded');
});

// Toggle sound on click
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
    updateSoundIcon();
});

// Prevent pausing - auto-resume if paused
video.addEventListener('pause', () => {
    video.play();
});

window.player = video;


