gsap.registerPlugin(ScrollTrigger);

const tracks = document.querySelectorAll(".galerie-caroussel");

const getScrollAmount = () => tracks[0].scrollWidth - window.innerWidth;

const tween = gsap.to(tracks, {
    x: () => -getScrollAmount(),
    ease: "none"
});

ScrollTrigger.create({
    trigger: ".galerie-section",
    start: "top top",
    end: () => `+=${getScrollAmount()}`,
    pin: true,
    animation: tween,
    scrub: 1,
    invalidateOnRefresh: true
});