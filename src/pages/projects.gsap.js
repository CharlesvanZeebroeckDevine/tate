import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { shouldReduceMotion } from '../gsap.js';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);

export function buildProjectsIntroTimeline() {
    console.log('buildProjectsIntroTimeline called');

    // Always hide the mask when on projects page (in case user navigated directly here)
    gsap.set(".mask", { display: "none" });

    // Skip animations if user prefers reduced motion or is on mobile
    if (shouldReduceMotion()) {
        console.log('Reduced motion detected, skipping animations');
        gsap.set(".projects_header h2", { opacity: 1, clearProps: "all" });
        gsap.set(".filter-btn", { opacity: 1, clearProps: "all" });
        return;
    }

    // Set initial visible state for title before splitting
    gsap.set(".projects_header h2", { opacity: 1 });

    // Create timeline for page entrance animations
    const tl = gsap.timeline({
        onStart: () => console.log('Timeline started'),
        onComplete: () => console.log('Timeline completed')
    });

    // Split text for the header title
    const headerTitle = new SplitText(".projects_header h2", {
        type: "chars",
        visibility: "clip",
        mask: "chars",
    });
    console.log('Header title split into:', headerTitle.chars.length, 'chars');

    // Animate header title characters
    tl.from(headerTitle.chars, {
        duration: 0.8,
        yPercent: 400,
        opacity: 1,
        stagger: 0.05,
        ease: "power3.out",
    }, 0.2);

    // Check if filter buttons exist
    const filterButtons = document.querySelectorAll('.filter-btn');
    console.log('Filter buttons found:', filterButtons.length);

    // Animate filter buttons with blur and slide effect
    tl.fromTo(".filter-btn",
        {
            x: -50,
            y: 100,
            filter: "blur(10px)",
            scale: 0,
            opacity: 0
        },
        {
            duration: 0.5,
            y: 0,
            x: 0,
            filter: "blur(0px)",
            scale: 1,
            opacity: 1,
            stagger: 0.15,
            ease: "power4.out",
            clearProps: "x,y,filter,scale" // Clear transform styles but keep opacity
        },
        0.5); // Start slightly after the title animation begins

    console.log('Timeline created, duration:', tl.duration());
    return tl;
}

export function animateProjectCards() {
    // Skip animations if user prefers reduced motion or is on mobile
    if (shouldReduceMotion()) {
        gsap.set(".project-card", { y: 0, opacity: 1 });
        return;
    }

    // Animate project cards once they're loaded
    gsap.from(".project-card", {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.8
    });
}

export function createProjectsScrollTriggers() {

}
