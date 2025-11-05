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
        const selector = 'a, button, [role="button"], input[type="submit"], input[type="button"], .filter-btn, .nav-btn, .project-card, .service_category';
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(selector)) {
                this.cursorDot.classList.add('hovering');
            }
        });
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(selector)) {
                this.cursorDot.classList.remove('hovering');
            }
        });
    }

    // Method to add showreel-specific functionality
    initShowreel(videoElement) {
        if (!videoElement) return;

        let soundEnabled = false;

        // Update sound icon based on state
        const updateSoundIcon = () => {
            this.soundIconContainer.innerHTML = soundEnabled
                ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="https://www.w3.org/2000/svg">
                    <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="#F2F2F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M15.54 8.46C16.4774 9.39764 17.004 10.6692 17.004 12C17.004 13.3308 16.4774 14.6024 15.54 15.54" stroke="#F2F2F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M19.07 4.93C20.9447 6.80528 21.9979 9.34836 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07" stroke="#F2F2F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                   </svg>`
                : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="https://www.w3.org/2000/svg">
                    <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="#F2F2F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M23 9L17 15" stroke="#F2F2F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M17 9L23 15" stroke="#F2F2F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                   </svg>`;
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
