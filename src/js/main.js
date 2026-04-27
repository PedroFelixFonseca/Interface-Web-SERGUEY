import { gsap } from "gsap";
const totalFrames = 105;
const canvas = document.querySelector(".lottie-player");
const ctx = canvas.getContext("2d");
const container = document.querySelector(".lottie-wrapper");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const frames = Array.from({ length: totalFrames }, (_, i) => {
  const img = new Image();
  img.src = `/images/seq_0_${i}.jpg`;
  return img;
});

function drawFrame(index) {
  const img = frames[index];
  if (!img || !img.complete) return;
  const scale = Math.max(canvas.width / 1920, canvas.height / 1080);
  const w = 1400 * scale;
  const h = 1400 * scale;
  const x = (canvas.width - w) / 2;
  const y = (canvas.height - h) / 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, x, y, w, h);
}

let currentFrame = 0;
let phase = 0; // 0=avant 1er scroll, 1=playing 0->50, 2=attente, 3=playing 50->104, 4=fin, 5=playing 104->50, 6=playing 50->0
let isPlaying = false;
let lastScrollY = window.scrollY;

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
      playTo(50, () => {
        phase = 2;
      });
    } else if (phase === 2) {
      phase = 3;
      playTo(104, () => {
        phase = 4;
      });
    }
  } else {
    if (phase === 4) {
      phase = 5;
      playTo(50, () => {
        phase = 6;
      });
    } else if (phase === 6) {
      phase = 0;
      playTo(0, () => {});
    }
  }
});

frames[0].onload = () => drawFrame(0);

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
