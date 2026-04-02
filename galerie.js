gsap.registerPlugin(ScrollTrigger);

const track = document.querySelector(".galerie-caroussel");
const items = document.querySelectorAll(".galerie-photo");

const getScrollAmount = () => track.scrollWidth - window.innerWidth;

const tween = gsap.to(track, {
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

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            items.forEach(item => item.classList.remove('is-active'));
            entry.target.classList.add('is-active');
        }
    });
}, {
    root: null,
    rootMargin: "0px -50% 0px -50%",
    threshold: 0
});

items.forEach(item => {
    observer.observe(item);
});