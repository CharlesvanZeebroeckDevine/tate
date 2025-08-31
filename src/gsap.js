import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const tl = gsap.timeline();

tl.from(".showreel", {
    opacity: 0,
    duration: 1,
    ease: "power2.inOut",
});

