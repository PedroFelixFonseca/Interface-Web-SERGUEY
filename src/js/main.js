import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", () => {
  // ─── BURGER MENU ───
  const burger = document.querySelector(".burger");
  const menu = document.querySelector(".menu");
  let ouvert = false;
  const tlBurger = gsap.timeline({ paused: true });

  tlBurger.to(menu, { right: 0, duration: 0.5, ease: "power3.inOut" });
  tlBurger.to(
    ".burger span:nth-child(1)",
    { y: 9, rotate: 45, duration: 0.3 },
    0,
  );
  tlBurger.to(".burger span:nth-child(2)", { opacity: 0, duration: 0.3 }, 0);
  tlBurger.to(
    ".burger span:nth-child(3)",
    { y: -9, rotate: -45, duration: 0.3 },
    0,
  );

  burger.addEventListener("click", () => {
    ouvert = !ouvert;
    ouvert ? tlBurger.play() : tlBurger.reverse();
  });

  // ─── INITIAL ENTRANCE ───
  const tlEntrance = gsap.timeline({ defaults: { ease: "power3.out" } });

  gsap.set("#title-sayat", { opacity: 0, y: 30 });
  gsap.set("#byline", { opacity: 0, y: 12 });
  gsap.set("#pomegranate-wrap", { opacity: 0, scale: 0.85 });
  gsap.set("#cta", { opacity: 0 });

  tlEntrance
    .to("#title-sayat", { opacity: 1, y: 0, duration: 1.4 }, 0.3)
    .to("#byline", { opacity: 1, y: 0, duration: 1.1 }, 0.9)
    .to(
      "#pomegranate-wrap",
      { opacity: 1, scale: 1, duration: 1.6, ease: "expo.out" },
      0.6,
    )
    .to("#cta", { opacity: 0.75, duration: 1.2, ease: "power2.inOut" }, 1.4);

  // ─── ANIMATION 1 — phases ───
  const totalFrames1 = 105;
  let currentFrame1 = 0;
  let phase = 0;
  let isPlaying1 = false;
  let canvasVisible1 = false;

  const frames1 = Array.from({ length: totalFrames1 }, (_, i) => {
    const img = new Image();
    img.src = `/images-livre/seq_0_${i}.jpg`;
    return img;
  });

  const canvas1 = document.getElementById("canvas-1");
  const ctx1 = canvas1.getContext("2d");
  canvas1.width = window.innerWidth;
  canvas1.height = window.innerHeight;
  function drawFrame1(index) {
    const img = frames1[index];
    if (!img || !img.complete) return;

    const scale = 1.2; // ← ajuste ce chiffre, 1 = normal, 1.2 = 20% plus grand
    const ratio = img.naturalHeight / img.naturalWidth;
    const w = canvas1.width;
    const h = w * ratio;

    let finalW = w;
    let finalH = h;
    if (h > canvas1.height) {
      finalH = canvas1.height;
      finalW = finalH / ratio;
    }

    finalW *= scale;
    finalH *= scale;

    const x = (canvas1.width - finalW) / 2;
    const y = (canvas1.height - finalH) / 2;

    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    ctx1.drawImage(img, x, y, finalW, finalH);
  }

  function playTo(target, onComplete) {
    if (isPlaying1) return;
    isPlaying1 = true;
    const direction = target > currentFrame1 ? 1 : -1;
    function step() {
      if (currentFrame1 === target) {
        isPlaying1 = false;
        if (onComplete) onComplete();
        return;
      }
      currentFrame1 += direction;
      drawFrame1(currentFrame1);
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const observer1 = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (!entry.isIntersecting && entry.boundingClientRect.top > 0) {
        phase = 0;
        currentFrame1 = 0;
        isPlaying1 = false;
        drawFrame1(0);
      }
      canvasVisible1 = entry.isIntersecting;
    },
    { threshold: 0.1 },
  );

  observer1.observe(canvas1);
  frames1[0].onload = () => drawFrame1(0);

  // ─── ANIMATION 2 — scroll continu ───
  const totalFrames2 = 119;
  let currentFrame2 = 0;
  let canvasVisible2 = false;

  const frames2 = Array.from({ length: totalFrames2 }, (_, i) => {
    const img = new Image();
    img.src = `/Images-eglise/Comp 1_${String(i).padStart(5, "0")}.png`;
    img.onload = () => console.log(`frame2 ${i} chargée`);
    img.onerror = () => console.error(`frame2 ${i} ERREUR`);
    return img;
  });

  const canvas2 = document.getElementById("canvas-2");
  const ctx2 = canvas2.getContext("2d");
  canvas2.width = window.innerWidth;
  canvas2.height = window.innerHeight;

  function drawFrame2(index) {
    const img = frames2[index];
    if (!img || !img.complete) return;

    const ratio = img.naturalHeight / img.naturalWidth;
    const w = canvas2.width;
    const h = w * ratio;

    // Si l'image est trop haute, on la réduit pour qu'elle rentre
    let finalW = w;
    let finalH = h;
    if (h > canvas2.height) {
      finalH = canvas2.height;
      finalW = finalH / ratio;
    }

    const x = (canvas2.width - finalW) / 2;
    const y = (canvas2.height - finalH) / 2;

    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    ctx2.drawImage(img, x, y, finalW, finalH);
  }

  const observer2 = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (!entry.isIntersecting && entry.boundingClientRect.top > 0) {
        currentFrame2 = 0;
        drawFrame2(0);
      }
      canvasVisible2 = entry.isIntersecting;
    },
    { threshold: 0.1 },
  );

  observer2.observe(canvas2);
  frames2[0].onload = () => drawFrame2(0);

  // ─── SCROLL LISTENER ───
  let lastScrollY = window.scrollY;
  let autoScrolling = false;

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const scrollingDown = scrollY > lastScrollY;
    lastScrollY = scrollY;

    if (autoScrolling) return;

    if (canvasVisible1) {
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
    }

    if (canvasVisible2) {
      if (scrollingDown && currentFrame2 < totalFrames2 - 1) {
        currentFrame2++;
        drawFrame2(currentFrame2);
      } else if (!scrollingDown && currentFrame2 > 0) {
        currentFrame2--;
        drawFrame2(currentFrame2);
      }
    }
  });

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
      const wrapper = document.getElementById("wrapper-1");
      if (wrapper) {
        autoScrolling = true;
        wrapper.scrollIntoView({ behavior: "smooth", block: "start" });
        setTimeout(() => {
          autoScrolling = false;
        }, 1500);
      }
    }, clickConfig.lottieScrollDelay * 1000);
  });

  // ─── PROGRESSBAR ───
  gsap.registerPlugin(ScrollTrigger);

  const STEPS = [
    { id: "section-1", label: "The poet's youth", img: "#" },
    { id: "section-2", label: "The poet's love", img: "#" },
    { id: "section-3", label: "The poet at the prince's court", img: "#" },
    { id: "section-4", label: "Validation", img: "#" },
    { id: "section-5", label: "Livraison", img: "#" },
  ];

  const TRIGGER_START = "top center";
  const TRIGGER_END = "bottom center";
  const stepsContainer = document.getElementById("pb-steps");
  const fillEl = document.getElementById("pb-fill");
  const progressBar = document.getElementById("progress-bar");

  STEPS.forEach((step, i) => {
    const el = document.createElement("div");
    el.className = "pb-step";
    el.dataset.index = i;
    el.setAttribute("aria-label", `Aller à ${step.label}`);
    el.innerHTML = `
      <div class="pb-dot">
        <img src="${step.img}" alt="${step.label}"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'" />
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
      el.classList.toggle("is-past", i < index);
    });
  }

  ScrollTrigger.create({
    trigger: document.getElementById(STEPS[0].id),
    start: "top center",
    onEnter: () => progressBar.classList.add("is-visible"),
    onLeaveBack: () => progressBar.classList.remove("is-visible"),
  });

  const footer = document.querySelector("footer");
  if (footer) {
    ScrollTrigger.create({
      trigger: footer,
      start: "top center",
      onEnter: () => progressBar.classList.remove("is-visible"),
      onLeaveBack: () => progressBar.classList.add("is-visible"),
    });
  }

  STEPS.forEach((step, i) => {
    const target = document.getElementById(step.id);
    if (!target) {
      console.warn(`[progress-bar] Section introuvable : #${step.id}`);
      return;
    }
    ScrollTrigger.create({
      trigger: target,
      start: TRIGGER_START,
      end: TRIGGER_END,
      onEnter: () => setActive(i),
      onEnterBack: () => setActive(i),
    });
  });

  ScrollTrigger.create({
    trigger: document.getElementById(STEPS[0].id),
    start: "top top",
    end: `+=${STEPS.length * window.innerHeight}`,
    scrub: true,
    onUpdate: (self) => {
      fillEl.style.height = `${self.progress * 100}%`;
    },
  });
});
