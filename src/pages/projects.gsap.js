import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { shouldReduceMotion } from '../gsap.js';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);

export function buildProjectsIntroTimeline() {
    // Skip animations if user prefers reduced motion or is on mobile
    if (shouldReduceMotion()) {
        gsap.set(".projects_header h2", { yPercent: 0, opacity: 1 });
        return;
    }

    // Create timeline for page entrance animations
    const tl = gsap.timeline();

    // Split text for the header title
    const headerTitle = new SplitText(".projects_header h2", {
        type: "chars",
        visibility: "clip",
        mask: "chars",
    });

    // Animate header title characters
    tl.from(headerTitle.chars, {
        duration: 0.8,
        yPercent: 400,
        opacity: 1,
        stagger: 0.05,
        ease: "power3.out",
    }, 0.2);

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
