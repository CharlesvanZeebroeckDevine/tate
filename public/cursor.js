// Cursor functionality - reusable across all pages
class CustomCursor {
    constructor() {
        this.cursorDot = null;
        this.soundIconContainer = null;
        this.init();
    }

    init() {
        // Create cursor dot element
        this.cursorDot = document.createElement('div');
        this.cursorDot.className = 'cursor-dot';
        document.body.appendChild(this.cursorDot);

        // Create sound icons container
        this.soundIconContainer = document.createElement('div');
        this.soundIconContainer.className = 'sound-icon';
        this.cursorDot.appendChild(this.soundIconContainer);

        // Update cursor position
        document.addEventListener('mousemove', (e) => {
            this.cursorDot.style.left = e.clientX + 'px';
            this.cursorDot.style.top = e.clientY + 'px';
        });

        // Initialize clickable elements hover
        this.initClickableHover();
    }

    initClickableHover() {
        // Handle hover on all clickable elements
        const clickableElements = document.querySelectorAll('a, button, [role="button"], input[type="submit"], input[type="button"], .filter-btn, .nav-btn, .project-card, .service_category');

        clickableElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.cursorDot.classList.add('hovering');
            });

            element.addEventListener('mouseleave', () => {
                this.cursorDot.classList.remove('hovering');
            });
        });
    }

    // Method to add showreel-specific functionality
    initShowreel(videoElement) {
        if (!videoElement) return;

        let soundEnabled = false;

        // Update sound icon based on state
        const updateSoundIcon = () => {
            this.soundIconContainer.innerHTML = soundEnabled
                ? '<img src="/sound-on.svg" alt="Sound On" width="6" height="6">'
                : '<img src="/sound-off.svg" alt="Sound Off" width="6" height="6">';
        };

        // Initialize with muted state icon
        updateSoundIcon();

        // Handle showreel hover
        videoElement.addEventListener('mouseenter', () => {
            this.cursorDot.classList.add('expanded');
        });

        videoElement.addEventListener('mouseleave', () => {
            this.cursorDot.classList.remove('expanded');
        });

        // Toggle sound on click
        videoElement.addEventListener('click', () => {
            if (!soundEnabled) {
                // Turn sound on
                videoElement.muted = false;
                videoElement.volume = 1.0;
                soundEnabled = true;
                console.log('Sound enabled!');

                // Force play to ensure audio context is activated
                videoElement.play().catch(e => console.log('Play error:', e));
            } else {
                // Turn sound off
                videoElement.muted = true;
                soundEnabled = false;
                console.log('Sound disabled!');
            }
            updateSoundIcon();
        });

        // Prevent pausing - auto-resume if paused
        videoElement.addEventListener('pause', () => {
            videoElement.play();
        });

        // Make video globally accessible
        window.player = videoElement;
    }
}

// Initialize cursor on all pages
const cursor = new CustomCursor();

// Export for use in other modules
window.CustomCursor = CustomCursor;
window.cursor = cursor;
