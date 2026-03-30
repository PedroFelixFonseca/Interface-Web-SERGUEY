import "@lottiefiles/lottie-player";
import { gsap } from "gsap";

gsap.registerPlugin(ScrollTrigger);

// ── Éléments DOM ─────────────────────────────────────────────────────────

const handLeft = document.getElementById("handLeft");
const handRight = document.getElementById("handRight");
const veilImg = document.getElementById("veilImg");
const veilLayer = document.getElementById("veilLayer");
const darkOverlay = document.getElementById("darkOverlay");
const scrollHint = document.getElementById("scrollHint");
const revealText = document.getElementById("revealText");

// ── Split du voile en deux moitiés ───────────────────────────────────────
// On clone l'image du voile pour créer une moitié gauche et une moitié droite.
// Chaque moitié sera animée indépendamment via clip-path.

const veilLeft = veilImg.cloneNode();
const veilRight = veilImg.cloneNode();

veilLeft.style.clipPath = "inset(35% 50% 35% 0)";
veilRight.style.clipPath = "inset(35% 0 35% 50%)";

veilImg.remove();
veilLayer.appendChild(veilLeft);
veilLayer.appendChild(veilRight);

// ── Position initiale des mains ───────────────────────────────────────────

gsap.set(handLeft, { x: "-40%" });
gsap.set(handRight, { x: "40%" });

// ── Timeline principale ───────────────────────────────────────────────────

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: 1.2,
  },
});

// Phase 0 → 0.15 : fondu depuis le noir
tl.to(
  darkOverlay,
  {
    opacity: 0,
    duration: 0.15,
    ease: "power2.in",
  },
  0,
);

// Masquage du hint scroll
tl.to(
  scrollHint,
  {
    opacity: 0,
    duration: 0.1,
  },
  0,
);

// Phase 0.05 → 0.35 : les mains convergent vers le centre
tl.to(
  handLeft,
  {
    x: "0%",
    duration: 0.3,
    ease: "power3.out",
  },
  0.05,
);

tl.to(
  handRight,
  {
    x: "0%",
    duration: 0.3,
    ease: "power3.out",
  },
  0.05,
);

// Phase 0.35 → 0.75 : les mains s'écartent et le voile se retire
tl.to(
  handLeft,
  {
    x: "-60%",
    duration: 0.4,
    ease: "power2.inOut",
  },
  0.35,
);

tl.to(
  handRight,
  {
    x: "60%",
    duration: 0.4,
    ease: "power2.inOut",
  },
  0.35,
);

// Le tissu s'écarte via clip-path
tl.to(
  veilLeft,
  {
    clipPath: "inset(35% 100% 35% 0)",
    duration: 0.4,
    ease: "power2.inOut",
  },
  0.35,
);

tl.to(
  veilRight,
  {
    clipPath: "inset(35% 0 35% 100%)",
    duration: 0.4,
    ease: "power2.inOut",
  },
  0.35,
);

// Phase 0.78 → 1 : texte de révélation
tl.to(
  revealText,
  {
    color: "rgba(255, 220, 160, 0.8)",
    duration: 0.2,
    ease: "power1.in",
  },
  0.78,
);

// ── Grain vivant ──────────────────────────────────────────────────────────

gsap.to(".grain", {
  opacity: 0.07,
  duration: 3,
  yoyo: true,
  repeat: -1,
  ease: "sine.inOut",
});
