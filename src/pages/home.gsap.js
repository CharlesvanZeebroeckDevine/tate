import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import { shouldReduceMotion } from '../gsap.js';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText)
gsap.registerPlugin(CustomEase)


export function buildIntroTimeline(isFirstLoad = true) {
    // Skip animations if user prefers reduced motion or is on mobile
    if (shouldReduceMotion()) {
        // Set final states without animation
        gsap.set(".logo", { x: 0, y: 0, color: "#1B1D1D" });
        gsap.set(".mask", { display: "none" });
        gsap.set(".nav_item", { scale: 1, opacity: 1 });
        gsap.set(".showreel", { opacity: 1, scale: 1, filter: "blur(0px)" });
        return;
    }

    // Only animate mask on first load
    if (isFirstLoad) {
        gsap.set(".logo", { x: 0, y: 300, color: "#F2F2F2" });
        // Clear CSS transform and set mask to starting position
        gsap.set(".mask", { clearProps: "transform" });
        gsap.set(".mask", { y: 0 });
    } else {
        // On subsequent loads, just reset logo color for animation
        gsap.set(".logo", { color: "#F2F2F2" });
    }

    const tl = gsap.timeline();

    if (isFirstLoad) {
        const splitText = new SplitText(".logo", {
            type: "chars", visibility: "clip", mask: "chars",
        });

        tl.to(".mask", {
            duration: 1.6,
            y: "-100vh",
            ease: "expo.out",
        }, 0.9);

        tl.to(".logo", {
            duration: 0.5,
            x: 0,
            y: 0,
            ease: "expo.out",
        }, 0.9);

        tl.to(".logo", {
            color: "#1B1D1D",
        }, 1.6);

        tl.from(splitText.chars, {
            duration: 0.5,
            yPercent: 400,
            opacity: 1,
            stagger: 0.05,
            ease: "power3.out",
        }, 0.2);

        tl.from(".nav_item", {
            scale: 0,
            opacity: 0,
            stagger: 0.15,
            ease: "power3.out",
        }, 1.8);

        tl.from(".showreel", {
            opacity: 0,
            scale: 0.9,
            filter: "blur(20px)",
            duration: 1,
            ease: "expo.out",
        }, 1.5);
    } else {
        // On subsequent loads, just animate logo color
        tl.to(".logo", {
            color: "#1B1D1D",
            duration: 0.5,
            ease: "expo.out"
        }, 0);
    }

}

export function createScrollTriggers() {
    // Skip animations if user prefers reduced motion or is on mobile
    if (shouldReduceMotion()) {
        gsap.set(".services_title, .service_category_title, .service_category_text, .dot, .line", {
            yPercent: 0,
            opacity: 1,
            scale: 1,
            width: "100%"
        });
        return;
    }

    const Services_title = new SplitText(".services_title", {
        type: "chars", visibility: "clip", mask: "chars",
    });

    let tl = gsap.timeline({

        scrollTrigger: {
            trigger: '.services_title', // start animation when ".box" enters the viewport
            start: 'bottom bottom',
        }

    });

    tl.addLabel('start')
        .from(Services_title.chars, {
            duration: 0.9,
            yPercent: 400,
            opacity: 1,
            stagger: 0.05,
            ease: "power3.out",
        }, 0.2);

    tl.addLabel('end').from(".line", {
        duration: 0.5,
        width: 0,
        ease: "expo.out",
    }, 0.8);

    const Services_categories = new SplitText(".service_category_title", {
        type: "chars", visibility: "clip", mask: "chars",
    });

    const services_text = new SplitText(".service_category_text", {
        type: "words,lines", visibility: "clip", mask: "lines",
    });

    let tl2 = gsap.timeline({
        scrollTrigger: {
            trigger: '.services_container', // start animation when ".box" enters the viewport
            start: 'bottom bottom',
        }
    });

    tl2.addLabel('start').from(Services_categories.chars, {
        duration: 0.9,
        yPercent: 400,
        opacity: 1,
        stagger: 0.02,
        ease: "power3.out",
    }, 0.2);

    tl2.addLabel('middle').from(".dot", {
        duration: 0.5,
        scale: 0,
        ease: "power3.out",
    }, 0.7);

    tl2.addLabel('end').from(services_text.lines, {
        duration: 1,
        opacity: 1,
        yPercent: 800,
        stagger: 0.05,
    }, 0.7);
}

