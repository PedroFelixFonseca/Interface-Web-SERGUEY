import { gsap } from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";
 
document.addEventListener("DOMContentLoaded", () => {

  const container = document.querySelector(".lottie-wrapper");
 
  // ─── BURGER MENU ───

  const burger = document.querySelector('.burger');

  const menu = document.querySelector('.menu');

  let ouvert = false;
 
  const tlBurger = gsap.timeline({ paused: true });
 
  tlBurger.to(menu, {

    right: 0,

    duration: 0.5,

    ease: "power3.inOut"

  });
 
  tlBurger.to(".burger span:nth-child(1)", {
    y: 9,

    rotate: 45,

    duration: 0.3

  }, 0);
 
  tlBurger.to(".burger span:nth-child(2)", {

    opacity: 0,

    duration: 0.3

  }, 0);
 
  tlBurger.to(".burger span:nth-child(3)", {

    y: -9,

    rotate: -45,

    duration: 0.3

  }, 0);
 
  burger.addEventListener('click', () => {

    ouvert = !ouvert;

    ouvert ? tlBurger.play() : tlBurger.reverse();

  });
 
  // ─── INITIAL ENTRANCE ───

  const tlEntrance = gsap.timeline({ defaults: { ease: 'power3.out' } });
 
  gsap.set('#title-sayat',      { opacity: 0, y: 30 });

  gsap.set('#byline',           { opacity: 0, y: 12 });

  gsap.set('#pomegranate-wrap', { opacity: 0, scale: 0.85 });

  gsap.set('#cta',              { opacity: 0 });
 
  tlEntrance.to('#title-sayat',      { opacity: 1, y: 0, duration: 1.4 }, 0.3)

    .to('#byline',           { opacity: 1, y: 0, duration: 1.1 }, 0.9)

    .to('#pomegranate-wrap', { opacity: 1, scale: 1, duration: 1.6, ease: 'expo.out' }, 0.6)

    .to('#cta',              { opacity: 0.75, duration: 1.2, ease: 'power2.inOut' }, 1.4);
 
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
 
    setTimeout(() => {

      document.getElementById("cta").style.display = "none";

    }, (clickConfig.textFade + 0.1) * 1000);
 
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
 
  // ─── CANVAS ANIMATION ───
const totalFrames = 105;
let currentFrame = 0;
let phase = 0;
let isPlaying = false;
let lastScrollY = window.scrollY;
 
const frames = Array.from({ length: totalFrames }, (_, i) => {
  const img = new Image();
  img.src = `/images/seq_0_${i}.jpg`;
  return img;
});
 
const canvas = document.querySelector(".lottie-player");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
 
function drawFrame(index) {
  const img = frames[index];
  if (!img || !img.complete) return;
  const scale = Math.max(canvas.width / 1920, canvas.height / 1080);
  const w = 1920 * scale;
  const h = 1080 * scale;
  const x = (canvas.width - w) / 2;
  const y = (canvas.height - h) / 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, x, y, w, h);
}
 
function playTo(target, onComplete) {
  if (isPlaying) return;
  isPlaying = true;
  const direction = target > currentFrame ? 1 : -1;
  function step() {
    if (currentFrame === target) {
      isPlaying = false;
      if (onComplete) onComplete();
      return;
    }
    currentFrame += direction;
    drawFrame(currentFrame);
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
 
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const scrollingDown = scrollY > lastScrollY;
  lastScrollY = scrollY;
 
  if (scrollingDown) {
    if (phase === 0) {
      phase = 1;
      playTo(50, () => { phase = 2; });
    } else if (phase === 2) {
      phase = 3;
      playTo(104, () => { phase = 4; });
    }
  } else {
    if (phase === 4) {
      phase = 5;
      playTo(50, () => { phase = 6; });
    } else if (phase === 6) {
      phase = 0;
      playTo(0, () => {});
    }
  }
});
 
frames[0].onload = () => drawFrame(0);
 
// ─── PROGRESSBAR ───

gsap.registerPlugin(ScrollTrigger);
 
const STEPS = [

  { id: "section-1", label: "The poet's youth", img: "#" },

  { id: "section-2", label: "The poet's love", img: "#" },

  { id: "section-3", label: "The poet at the princes court", img: "#" },

  { id: "section-4", label: "Validation", img: "#" },

  { id: "section-5", label: "Livraison", img: "#" },

];
 
const TRIGGER_START = "top center";

const TRIGGER_END   = "bottom center";
 
const stepsContainer = document.getElementById("pb-steps");

const fillEl         = document.getElementById("pb-fill");

const progressBar    = document.getElementById("progress-bar");
 
STEPS.forEach((step, i) => {

  const el = document.createElement("div");

  el.className = "pb-step";

  el.dataset.index = i;

  el.setAttribute("aria-label", `Aller à ${step.label}`);
 
  el.innerHTML = `
<div class="pb-dot">
<img

        src="${step.img}"

        alt="${step.label}"

        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"

      />
<span class="pb-fallback" style="display:none">${i + 1}</span>
</div>
<span class="pb-label">${step.label}</span>

  `;
 
  el.addEventListener("click", () => {

    const target = document.getElementById(step.id);

    if (target) target.scrollIntoView({ behavior: "smooth" });

  });
 
  stepsContainer.appendChild(el);

});
 
const stepEls = stepsContainer.querySelectorAll(".pb-step");
 
let activeIndex = -1;
 
function setActive(index) {

  if (index === activeIndex) return;

  activeIndex = index;
 
  stepEls.forEach((el, i) => {

    el.classList.toggle("is-active", i === index);

    el.classList.toggle("is-past",   i < index);

  });

}
 
// ─── SHOW/HIDE PROGRESS BAR ───
ScrollTrigger.create({
  trigger: "#main-content",   // apparaît dès qu'on entre dans le main
  start: "top center",
  end: "bottom bottom",
  onEnter:      () => progressBar.classList.add("is-visible"),
  onLeaveBack:  () => progressBar.classList.remove("is-visible"),
  onLeave:      () => progressBar.classList.remove("is-visible"),
});

// ─── FILL + ÉTAPES ACTIVES ───
STEPS.forEach((step, i) => {
  const target = document.getElementById(step.id);
  if (!target) return;

  ScrollTrigger.create({
    trigger: target,
    start: TRIGGER_START,
    end:   TRIGGER_END,
    onEnter:      () => setActive(i),
    onEnterBack:  () => setActive(i),
  });
});

// Barre de remplissage liée au scroll global
ScrollTrigger.create({
  trigger: "#main-content",
  start: "top top",
  end:   "bottom bottom",
  scrub: true,
  onUpdate: (self) => {
    fillEl.style.height = `${self.progress * 100}%`;
  },
});

});