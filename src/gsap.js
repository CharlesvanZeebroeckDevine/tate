import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const tl = gsap.timeline();

// Check if animations should be disabled
export function shouldReduceMotion() {
    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Check if mobile (viewport width <= 767px based on CSS breakpoint)
    const isMobile = window.innerWidth <= 767;

    return prefersReducedMotion || isMobile;
}
