import { gsap } from "gsap";
import lottie from "lottie-web";
import animationData from "../../static/data.json";

// ─── LOTTIE SCROLL ───
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".lottie-wrapper");

const burger = document.querySelector('.burger');
const menu = document.querySelector('.menu');

let ouvert = false;

const tl = gsap.timeline({ paused: true });

tl.to(menu, {
  right: 0,
  duration: 0.5,
  ease: "power3.inOut"
});

tl.to(".burger span:nth-child(1)", {
  y: 9,
  rotate: 45,
  duration: 0.3
}, 0);

tl.to(".burger span:nth-child(2)", {
  opacity: 0,
  duration: 0.3
}, 0);

tl.to(".burger span:nth-child(3)", {
  y: -9,
  rotate: -45,
  duration: 0.3
}, 0);

burger.addEventListener('click', () => {
  ouvert = !ouvert;
  ouvert ? tl.play() : tl.reverse();
});


const tlEntrance = gsap.timeline({ defaults: { ease: 'power3.out' } });
 
gsap.set('#title-sayat',      { opacity: 0, y: 30 });
gsap.set('#byline',           { opacity: 0, y: 12 });
gsap.set('#pomegranate-wrap', { opacity: 0, scale: 0.85 });
gsap.set('#cta',              { opacity: 0 });
 
tlEntrance.to('#title-sayat',      { opacity: 1, y: 0, duration: 1.4 }, 0.3)
  .to('#byline',           { opacity: 1, y: 0, duration: 1.1 }, 0.9)
  .to('#pomegranate-wrap', { opacity: 1, scale: 1, duration: 1.6, ease: 'expo.out' }, 0.6)
  .to('#cta',              { opacity: 0.75, duration: 1.2, ease: 'power2.inOut' }, 1.4);
 
/* ─── CLICK HANDLER ─── */
  const animation = lottie.loadAnimation({
    container: document.querySelector(".lottie-player"),
    renderer: "canvas",
    loop: false,
    autoplay: false,
    animationData: animationData,
  });

  animation.addEventListener("DOMLoaded", () => {
    const totalFrames = animation.totalFrames;

    window.addEventListener("scroll", () => {
      const rect = container.getBoundingClientRect();
      const sectionHeight = container.offsetHeight;
      const progress = Math.max(
        0,
        Math.min(1, -rect.top / (sectionHeight - window.innerHeight)),
      );
      const frame = Math.round(progress * (totalFrames - 1));
      animation.goToAndStop(frame, true);
    });
  });
});

// ─── INITIAL ENTRANCE ───
const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
gsap.set("#title-sayat", { opacity: 0, y: 30 });
gsap.set("#byline", { opacity: 0, y: 12 });
gsap.set("#pomegranate-wrap", { opacity: 0, scale: 0.85 });
gsap.set("#cta", { opacity: 0 });
tl.to("#title-sayat", { opacity: 1, y: 0, duration: 1.4 }, 0.3)
  .to("#byline", { opacity: 1, y: 0, duration: 1.1 }, 0.9)
  .to(
    "#pomegranate-wrap",
    { opacity: 1, scale: 1, duration: 1.6, ease: "expo.out" },
    0.6,
  )
  .to("#cta", { opacity: 0.75, duration: 1.2, ease: "power2.inOut" }, 1.4);

// ─── CLICK HANDLER ───
const clickConfig = {
  textFade: 0.7,
  textMoveY: -20,
  pomegranateMove: 1.3,
  pomegranateFade: 0.8,
  revealDelay: 1.0,
  lottieScrollDelay: 2.8,
};

let clicked = false;
const sceneEl = document.getElementById("scene");

sceneEl.addEventListener("click", () => {
  if (clicked) return;
  clicked = true;

  gsap.killTweensOf("#cta");

  const wrap = document.getElementById("pomegranate-wrap");
  const rect = wrap.getBoundingClientRect();
  const dx = window.innerWidth / 2 - (rect.left + rect.width / 2);
  const dy = window.innerHeight / 2 - (rect.top + rect.height / 2);

  gsap.to(["#title-sayat", "#byline", "#cta"], {
    opacity: 0,
    y: clickConfig.textMoveY,
    duration: clickConfig.textFade,
    stagger: 0.06,
  });

  setTimeout(
    () => {
      document.getElementById("cta").style.display = "none";
    },
    (clickConfig.textFade + 0.1) * 1000,
  );

  gsap.to("#pomegranate-wrap", {
    x: dx,
    y: dy,
    scale: 1.12,
    duration: clickConfig.pomegranateMove,
    ease: "expo.inOut",
  });

  gsap.to("#pomegranate-wrap", {
    opacity: 0,
    duration: clickConfig.pomegranateFade,
    ease: "power2.inOut",
    delay: 0.4,
    onComplete: () => {
      wrap.style.display = "none";
    },
  });

  setTimeout(() => {
    document.getElementById("reveal").style.pointerEvents = "none";
    gsap.to("#reveal", { opacity: 1, duration: 0.01 });
    gsap.to("#title-pomegranates", {
      opacity: 1,
      duration: 1.6,
      ease: "power2.out",
    });
  }, clickConfig.revealDelay * 1000);

  setTimeout(() => {
    const wrapper = document.querySelector(".lottie-wrapper");
    if (wrapper)
      wrapper.scrollIntoView({ behavior: "smooth", block: "center" });
  }, clickConfig.lottieScrollDelay * 1000);
});


