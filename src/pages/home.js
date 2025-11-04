import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { buildIntroTimeline, createScrollTriggers } from './home.gsap.js';

let videoRef = null;
let introTl = null;
let scrollTriggers = [];
let isFirstLoad = true;

export async function init(rootEl) {
    const video = rootEl.querySelector('#player');
    if (!video) return;

    videoRef = video;
    // Ensure autoplay-friendly state
    try {
        video.muted = true;
        video.playsInline = true;
        video.autoplay = true;
        // Reload to apply attributes reliably after dynamic insertion
        video.load();
    } catch (_) { }

    // Try to start playback with a couple of schedules
    const tryPlay = () => {
        try {
            const p = video.play();
            if (p && typeof p.catch === 'function') p.catch(() => { });
        } catch (_) { }
    };

    // Immediate and delayed attempts + on canplay
    tryPlay();
    setTimeout(tryPlay, 60);
    video.addEventListener('canplay', tryPlay, { once: true });
    if (document.visibilityState === 'visible') setTimeout(tryPlay, 150);

    // User interaction fallback (Safari/iOS edge cases)
    const resumeOnUser = () => tryPlay();
    document.addEventListener('click', resumeOnUser, { once: true });
    document.addEventListener('touchstart', resumeOnUser, { once: true });
    document.addEventListener('keydown', resumeOnUser, { once: true });

    // Cursor behavior
    if (window.cursor) {
        window.cursor.initShowreel(video);
    }

    // Prepare GSAP intro and scroll triggers (do not play yet)
    introTl = buildIntroTimeline(isFirstLoad);
    scrollTriggers = createScrollTriggers(rootEl);

    // Mark as no longer first load
    if (isFirstLoad) {
        isFirstLoad = false;
    }
}

export async function destroy() {
    // Clean up GSAP animations and reset header elements
    if (introTl) {
        introTl.kill();
        introTl = null;
    }

    // Kill all ScrollTriggers
    ScrollTrigger.getAll().forEach(trigger => {
        trigger.kill();
    });
    scrollTriggers = [];

    // Clear any GSAP inline styles from header elements AFTER animations are killed
    // Note: We don't clear mask/showreel because they persist across pages
    try {
        const logo = document.querySelector('.logo');
        const navItems = document.querySelectorAll('.nav_item');

        // Set logo to black after clearing to maintain correct color on other pages
        if (logo) {
            gsap.set(logo, { clearProps: "all" });
            gsap.set(logo, { color: "#1B1D1D" });
        }
        if (navItems.length) navItems.forEach(item => gsap.set(item, { clearProps: "all" }));
    } catch (_) { }

    if (!videoRef) return;
    try { videoRef.pause(); } catch (_) { }
    try {
        // Abort any network activity to avoid background downloads
        videoRef.removeAttribute('src');
        const sources = videoRef.querySelectorAll('source');
        sources.forEach(s => s.remove());
        videoRef.load();
    } catch (_) { }
    videoRef = null;
}
