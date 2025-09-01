import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText)


export function buildIntroTimeline() {
    gsap.set(".logo", { x: 0, y: 500 });

    const tl = gsap.timeline();
    const splitText = new SplitText(".logo", {
        type: "chars", visibility: "clip", mask: "chars",
    });

    tl.from(splitText.chars, {
        duration: 0.5,
        yPercent: 400,
        opacity: 1,
        stagger: 0.05,
        ease: "power3.out",
    });

    tl.to(".logo", {
        duration: 0.5,
        x: 0,
        y: 0,
        ease: "power3.out",
    });


}

export function createScrollTriggers() {
    const triggers = [];



    return triggers;
}


