gsap.registerPlugin(ScrollTrigger);

const tracks = document.querySelectorAll(".galerie-caroussel");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const photos = document.querySelectorAll(".galerie-photo");

let currentIndex = 0;
const photoWidth = photos[0].offsetWidth;
const totalPhotos = 5; 

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

const navigateToPhoto = (index) => {
    currentIndex = index % totalPhotos;
    const scrollPosition = (currentIndex * photoWidth);
    
    gsap.to(tracks, {
        x: -scrollPosition,
        duration: 0.6,
        ease: "power2.inOut"
    });
};

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
        e.preventDefault();
        navigateToPhoto(currentIndex - 1);
    } else if (e.key === "ArrowRight") {
        e.preventDefault();
        navigateToPhoto(currentIndex + 1);
    }
});

prevBtn.addEventListener("click", () => {
    navigateToPhoto(currentIndex - 1);
});

nextBtn.addEventListener("click", () => {
    navigateToPhoto(currentIndex + 1);
});

const firstGaleriePhotos = tracks[0].querySelectorAll(".galerie-photo");
firstGaleriePhotos.forEach((photo, index) => {
    photo.style.cursor = "pointer";
    photo.addEventListener("click", () => {
        navigateToPhoto(index % totalPhotos);
    });
});