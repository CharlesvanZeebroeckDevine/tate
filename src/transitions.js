import { gsap } from 'gsap';

export function animateOut(el) {
    return new Promise((resolve) => {
        gsap.to(el, { autoAlpha: 0, y: 10, duration: 0.2, ease: 'power2.out', onComplete: resolve });
    });
}

export function animateIn(el) {
    return new Promise((resolve) => {
        gsap.fromTo(el, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.25, ease: 'power2.out', onComplete: resolve });
    });
}


