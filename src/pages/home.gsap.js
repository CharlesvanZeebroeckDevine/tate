import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText)
gsap.registerPlugin(CustomEase)


export function buildIntroTimeline() {
    gsap.set(".logo", { x: 0, y: 300 });
    // Ensure mask starts fully covering viewport from the top
    gsap.set(".mask", { y: 0 });

    const tl = gsap.timeline();

    const splitText = new SplitText(".logo", {
        type: "chars", visibility: "clip", mask: "chars",
    });


    tl.to(".mask", {
        duration: 1.6,
        y: "-100vh",
        ease: "expo.out",
    }, 0.9)

        .to(".logo", {
            duration: 0.5,
            x: 0,
            y: 0,
            ease: "expo.out",
        }, 0.9)

        .to(".logo", {
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

}

export function createScrollTriggers() {

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
        ease: "power3.out",
    }, 0.8);
}

let tl2 = gsap.timeline({
    scrollTrigger: {
        trigger: '.services_container', // start animation when ".box" enters the viewport
        start: 'bottom bottom',
    }


});

const Services_categories = new SplitText(".service_category_title", {
    type: "chars", visibility: "clip", mask: "chars",
});


const services_text = new SplitText(".service_category_text", {
    type: "words,lines", visibility: "clip", mask: "lines",
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


