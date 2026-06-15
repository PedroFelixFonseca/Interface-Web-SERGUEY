import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motionPathPlugin } from "gsap/MotionPathPlugin";
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  // ─── BLOCK/UNBLOCK SCROLL ───
  let scrollPosition = 0;

  function blockScroll() {
    scrollPosition = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = "100%";
  }

  function unblockScroll() {
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo(0, scrollPosition);
  }

  blockScroll();

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

  // ─── CLICK HANDLER ───
  const clickConfig = {
    textFade: 0.7,
    textMoveY: -20,
    pomegranateMove: 1.3,
    pomegranateFade: 0.8,
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

    gsap.to("#scene", {
      opacity: 0,
      duration: 1.2,
      ease: "power2.inOut",
      delay: 0.8,
      onComplete: () => {
        unblockScroll();
        document.getElementById("scene").style.display = "none";
      },
    });
  });

  // ─── TEXTE ───
  const bookText1 = document.getElementById("book-text-1");
  const bookText2 = document.getElementById("book-text-2");

  function showText(el) {
    gsap.killTweensOf(el);
    gsap.fromTo(
      el,
      { opacity: 0, y: 30, filter: "blur(8px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.2,
        ease: "power2.out",
      },
    );
  }

  function hideText(el) {
    gsap.killTweensOf(el);
    gsap.to(el, {
      opacity: 0,
      y: -20,
      filter: "blur(8px)",
      duration: 0.8,
      ease: "power2.in",
    });
  }

  // ─── ANIMATION 1 ───
  const totalFrames1 = 105;
  let currentFrame1 = 0;
  let phase = 0;
  let isPlaying1 = false;
  let canvasVisible1 = false;
  let enteredFromTop = false;
  let currentX = 0;
  let startX = 0;
  let endX = 0;

  const frames1 = Array.from({ length: totalFrames1 }, (_, i) => {
    const img = new Image();
    img.src = `/images-livre/seq_0_${i}.jpg`;
    return img;
  });

  const canvas1 = document.getElementById("canvas-1");
  const ctx1 = canvas1.getContext("2d");
  canvas1.width = window.innerWidth;
  canvas1.height = window.innerHeight;

  function computePositions() {
    const scale = 1.5;
    const img = frames1[0];
    if (!img || !img.complete) return;
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
    startX = (canvas1.width - finalW) / 2; // ← centré
    endX = canvas1.width * 0.6; // ← vers la droite, ajuste
    currentX = startX;
  }

  function drawFrame1(index) {
    const img = frames1[index];
    if (!img || !img.complete) return;
    const scale = 1.5;
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
    const y = (canvas1.height - finalH) / 2;
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    ctx1.drawImage(img, currentX, y, finalW, finalH);
  }

  function playTo(target, onComplete) {
    if (isPlaying1) return;
    isPlaying1 = true;
    const direction = target > currentFrame1 ? 1 : -1;
    if (direction === 1) blockScroll();
    function step() {
      if (currentFrame1 === target) {
        isPlaying1 = false;
        if (direction === 1) unblockScroll();
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
      if (entry.isIntersecting) {
        enteredFromTop = entry.boundingClientRect.top < 0;
        if (enteredFromTop) {
          phase = 0;
          currentFrame1 = 0;
          isPlaying1 = false;
          currentX = startX;
          hideText(bookText1);
          hideText(bookText2);
          drawFrame1(0);
        }
      } else {
        if (entry.boundingClientRect.top > 0) {
          phase = 0;
          currentFrame1 = 0;
          isPlaying1 = false;
          currentX = startX;
          unblockScroll();
          hideText(bookText1);
          hideText(bookText2);
          drawFrame1(0);
        }
      }
      canvasVisible1 = entry.isIntersecting;
    },
    { threshold: 0.1 },
  );

  observer1.observe(canvas1);
  frames1[0].onload = () => {
    computePositions(); // ← calcule startX et endX une fois l'image chargée
    drawFrame1(0);
  };
  // ─── ANIMATION 2 ───
  const totalFrames2 = 119;
  let currentFrame2 = 0;
  let canvasVisible2 = false;

  const frames2 = Array.from({ length: totalFrames2 }, (_, i) => {
    const img = new Image();
    img.src = `/Images-eglise/Comp 1_${String(i).padStart(5, "0")}.png`;
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

  const section2Title = document.querySelector("#section-2 h1");

  const observer2 = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        gsap.to(section2Title, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
        });
      } else {
        gsap.to(section2Title, { opacity: 0, duration: 0.5 });
        if (entry.boundingClientRect.top > 0) {
          currentFrame2 = 0;
          drawFrame2(0);
        }
      }
      canvasVisible2 = entry.isIntersecting;
    },
    {
      threshold: 0.5,
      rootMargin: "-20% 0px -20% 0px",
    },
  );

  observer2.observe(canvas2);
  frames2[0].onload = () => drawFrame2(0);
  // ─── ANIMATION 3 ───
  const liquidStreams = document.querySelectorAll(".liquid-stream");

  if (liquidStreams.length) {
    liquidStreams.forEach((path) => {
      const delay = parseFloat(path.dataset.delay) || 0;
      const speed = parseFloat(path.dataset.speed) || 1;
      const pathLength = path.getTotalLength();
      path.style.strokeDasharray = pathLength;
      path.style.strokeDashoffset = pathLength;

      ScrollTrigger.create({
        trigger: "#section-3",
        start: "top 80%",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          const progress = Math.max(0, (self.progress - delay) * speed);
          path.style.strokeDashoffset =
            pathLength - pathLength * Math.min(progress, 1);
        },
      });
    });
  }
// ─────────────────────────────
// SECTION 4 — LACE STORY
// ─────────────────────────────

const laceRibbon = document.getElementById("laceRibbon");

if (laceRibbon) {

  gsap.set(".chapter", {
    opacity: 0,
    y: 60
  });

  const laceTl = gsap.timeline({

    scrollTrigger: {
      trigger: "#section-4",
      start: "top top",
      end: "+=4500",
      scrub: 1,
      pin: true,
      anticipatePin: 1
    }
  });

  laceTl.fromTo(
    "#laceRibbon",

    {
      clipPath: "inset(100% 0 0 0)"
    },

    {
      clipPath: "inset(0% 0 0 0)",
      duration: 1
    },

    0
  );

  laceTl.to(
    "#laceRibbon",

    {
      y: -180,
      duration: 1
    },

    0
  );

  laceTl.to(
    ".chapter-1",
    {
      opacity: 1,
      y: 0,
      duration: .25
    },
    0.10
  );

  laceTl.to(
    ".chapter-2",
    {
      opacity: 1,
      y: 0,
      duration: .25
    },
    0.30
  );

  laceTl.to(
    ".chapter-3",
    {
      opacity: 1,
      y: 0,
      duration: .25
    },
    0.50
  );

  laceTl.to(
    ".chapter-4",
    {
      opacity: 1,
      y: 0,
      duration: .25
    },
    0.70
  );

  laceTl.to(
    ".chapter-5",
    {
      opacity: 1,
      y: 0,
      duration: .25
    },
    0.90
  );

  // léger flottement permanent

  gsap.to("#laceRibbon", {
    rotation: 1,
    duration: 4,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    transformOrigin: "center center"
  });
}


  // ─── SCROLL LISTENER ───
  let lastScrollY = window.scrollY;
  let autoScrolling = false;
  let waitingToHideText2 = false;
  let hideText2AfterTime = 0;

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const scrollingDown = scrollY > lastScrollY;
    lastScrollY = scrollY;

    if (autoScrolling) return;

    if (waitingToHideText2 && Date.now() > hideText2AfterTime) {
      hideText(bookText2);
      waitingToHideText2 = false;
    }

    if (canvasVisible1) {
      if (scrollingDown) {
        enteredFromTop = false;
        if (phase === 0) {
          phase = 1;
          blockScroll();
          gsap.to(
            { x: currentX },
            {
              x: endX,
              duration: 0.9,
              ease: "power2.inOut",
              onUpdate: function () {
                currentX = this.targets()[0].x;
                drawFrame1(currentFrame1);
              },
              onComplete: () => {
                unblockScroll();
                showText(bookText1);
                playTo(50, () => {
                  setTimeout(() => {
                    phase = 2;
                  }, 200);
                });
              },
            },
          );
        } else if (phase === 2) {
          phase = 3;
          hideText(bookText1);
          showText(bookText2);
          playTo(104, () => {
            waitingToHideText2 = true;
            hideText2AfterTime = Date.now() + 800;
            setTimeout(() => {
              phase = 4;
            }, 200);
          });
        }
      } else {
        if (!enteredFromTop) {
          if (phase === 4) {
            phase = 5;
            waitingToHideText2 = false;
            hideText(bookText2);
            showText(bookText1);
            playTo(50, () => {
              setTimeout(() => {
                phase = 6;
              }, 200);
            });
          } else if (phase === 6) {
            phase = 0;
            hideText(bookText1);
            hideText(bookText2);
            playTo(0, () => {});
          }
        }
      }
    }

    if (canvasVisible2) {
      if (scrollingDown && currentFrame2 < totalFrames2 - 1) {
        currentFrame2++;
        drawFrame2(currentFrame2);

        // disparition progressive entre frame 10 et 50
        if (currentFrame2 >= 10 && currentFrame2 <= 100) {
          const progress = (currentFrame2 - 10) / 70;
          gsap.set(section2Title, { opacity: 1 - progress });
        }
      } else if (!scrollingDown && currentFrame2 > 0) {
        currentFrame2--;
        drawFrame2(currentFrame2);

        // réapparition progressive si on revient en arrière
        if (currentFrame2 >= 10 && currentFrame2 <= 100) {
          const progress = (currentFrame2 - 10) / 70;
          gsap.set(section2Title, { opacity: 1 - progress });
        }
        if (currentFrame2 < 10) {
          gsap.set(section2Title, { opacity: 1 });
        }
      }
    }
  });

  // ─── PROGRESSBAR ───

  const STEPS = [
    { id: "section-1", label: "The poet's youth", img: "#" },
    { id: "section-2", label: "The poet at the monastery", img: "#" },
    { id: "section-3", label: "The poet's love", img: "#" },
    { id: "section-4", label: "WIP", img: "#" },
    { id: "section-5", label: "WIP", img: "#" },
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
      if (target) {
        phase = 0;
        currentFrame1 = 0;
        isPlaying1 = false;
        currentX = startX; // ← était (canvas1.width - finalW) / 2
        hideText(bookText1);
        hideText(bookText2);
        unblockScroll();
        drawFrame1(0);
        currentFrame2 = 0;
        drawFrame2(0);
        autoScrolling = true;
        target.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          autoScrolling = false;
        }, 1500);
      }
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

  // ─── PARTICULES ───
  const particleCanvas = document.getElementById("particles");
  const pCtx = particleCanvas.getContext("2d");
  particleCanvas.width = window.innerWidth;
  particleCanvas.height = window.innerHeight;

  const PARTICLE_COUNT = 60;
  const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * particleCanvas.width,
    y: Math.random() * particleCanvas.height,
    r: Math.random() * 2 + 0.5,
    speedX: (Math.random() - 0.5) * 0.4,
    speedY: (Math.random() - 0.5) * 0.4,
    opacity: Math.random() * 0.5 + 0.1,
  }));

  function animateParticles() {
    pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < 0) p.x = particleCanvas.width;
      if (p.x > particleCanvas.width) p.x = 0;
      if (p.y < 0) p.y = particleCanvas.height;
      if (p.y > particleCanvas.height) p.y = 0;
      pCtx.beginPath();
      pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      pCtx.fillStyle = `rgba(255, 255, 249, ${p.opacity})`;
      pCtx.fill();
    });
    requestAnimationFrame(animateParticles);
  }

  animateParticles();

  window.addEventListener("resize", () => {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
  });
});
