import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { shouldReduceMotion } from '../gsap.js';

gsap.registerPlugin(SplitText);

export function buildProjectDetailIntroTimeline() {
    console.log('buildProjectDetailIntroTimeline called');

    // Check if elements exist
    const backButton = document.querySelector('.back-button');
    const titleElement = document.querySelector('#projectTitle');
    const projectMeta = document.querySelector('.project-meta');

    console.log('Elements found:', {
        backButton: !!backButton,
        titleElement: !!titleElement,
        projectMeta: !!projectMeta
    });

    // Skip animations if user prefers reduced motion or is on mobile
    if (shouldReduceMotion()) {
        console.log('Reduced motion detected, skipping animations');
        gsap.set(".back-button", { opacity: 1 });
        gsap.set("#projectTitle", { opacity: 1 });
        gsap.set(".project-meta", { opacity: 1 });
        gsap.set(".project-description", { opacity: 1 });
        gsap.set(".project-detail", { opacity: 1 });
        gsap.set(".parent-container", { opacity: 1 });
        return;
    }

    // Create timeline for page entrance animations (total < 2s)
    const tl = gsap.timeline({
        onStart: () => console.log('Detail page timeline started'),
        onComplete: () => console.log('Detail page timeline completed'),
        defaults: { ease: "power2.out" }
    });

    // 1. Animate back button (0s - 0.4s)
    tl.fromTo(".back-button",
        {
            y: -20,
            opacity: 0
        },
        {
            duration: 0.4,
            y: 0,
            opacity: 1,
            ease: "power2.out"
        }, 0);

    // 2. Split and animate project title (0.1s - 0.8s)
    const titleElementCheck = document.querySelector("#projectTitle");
    if (titleElementCheck && titleElementCheck.textContent.trim().length > 0) {
        try {
            // First set the title to be visible
            gsap.set("#projectTitle", { opacity: 1 });

            const titleSplit = new SplitText("#projectTitle", {
                type: "chars",
                visibility: "clip",
                mask: "chars"
            });
            console.log('Title split into:', titleSplit.chars.length, 'chars');

            if (titleSplit.chars.length > 0) {
                tl.from(titleSplit.chars, {
                    duration: 0.6,
                    yPercent: 100,
                    opacity: 1,
                    stagger: 0.02,
                    ease: "power3.out",
                }, 0.1);
            }
        } catch (error) {
            console.error('Error splitting title:', error);
            // Fallback to simple fade for title
            tl.fromTo("#projectTitle",
                {
                    y: 30,
                    opacity: 0
                },
                {
                    duration: 0.6,
                    y: 0,
                    opacity: 1,
                    ease: "power3.out",
                }, 0.1);
        }
    } else {
        console.warn('Title element not found or empty');
        // Fallback animation
        tl.fromTo("#projectTitle",
            {
                y: 30,
                opacity: 0
            },
            {
                duration: 0.6,
                y: 0,
                opacity: 1,
                ease: "power3.out",
            }, 0.1);
    }

    // 3. Animate project meta (year, client, category) (0.3s - 0.8s)
    tl.fromTo(".project-meta",
        {
            y: 30,
            opacity: 0
        },
        {
            duration: 0.5,
            y: 0,
            opacity: 1,
            ease: "power2.out"
        }, 0.3);

    // 4. Animate project description (0.4s - 0.9s)
    tl.fromTo(".project-description",
        {
            y: 30,
            opacity: 0
        },
        {
            duration: 0.5,
            y: 0,
            opacity: 1,
            ease: "power2.out"
        }, 0.4);

    // 5. Animate project details (collaborators, services) (0.5s - 1.0s)
    tl.fromTo(".project-detail",
        {
            y: 30,
            opacity: 0
        },
        {
            duration: 0.5,
            y: 0,
            opacity: 1,
            ease: "power2.out"
        }, 0.5);

    // 6. Animate video container and controls (0.6s - 1.4s)
    tl.fromTo(".parent-container",
        {
            y: 50,
            opacity: 0
        },
        {
            duration: 0.8,
            y: 0,
            opacity: 1,
            ease: "power3.out"
        }, 0.6);

    // 7. Animate video navigation if it exists (0.8s - 1.3s)
    const videoNav = document.querySelector('.video-navigation');
    if (videoNav && videoNav.style.display !== 'none') {
        tl.fromTo(".video-navigation",
            {
                scale: 0.9,
                opacity: 0
            },
            {
                duration: 0.5,
                scale: 1,
                opacity: 1,
                ease: "back.out(1.7)"
            }, 0.8);
    }

    console.log('Timeline created, duration:', tl.duration());
    console.log('Timeline will now play');

    // Ensure the timeline plays
    tl.play();

    return tl;
}

export function animateVideoChange() {
    // Skip animations if user prefers reduced motion
    if (shouldReduceMotion()) {
        return;
    }

    // Quick fade animation when changing videos
    const tl = gsap.timeline();

    tl.to(".project-video-container", {
        duration: 0.2,
        opacity: 0.3,
        ease: "power2.inOut"
    })
        .to(".project-video-container", {
            duration: 0.4,
            opacity: 1,
            ease: "power2.out"
        });

    return tl;
}

