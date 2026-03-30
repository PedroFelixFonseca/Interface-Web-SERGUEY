import "@lottiefiles/lottie-player";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── INITIAL ENTRANCE ─── */
const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
 
gsap.set('#title-sayat',      { opacity: 0, y: 30 });
gsap.set('#byline',           { opacity: 0, y: 12 });
gsap.set('#pomegranate-wrap', { opacity: 0, scale: 0.85 });
gsap.set('#cta',              { opacity: 0 });
 
tl.to('#title-sayat',      { opacity: 1, y: 0, duration: 1.4 }, 0.3)
  .to('#byline',           { opacity: 1, y: 0, duration: 1.1 }, 0.9)
  .to('#pomegranate-wrap', { opacity: 1, scale: 1, duration: 1.6, ease: 'expo.out' }, 0.6)
  .to('#cta',              { opacity: 0.75, duration: 1.2, ease: 'power2.inOut' }, 1.4);
 
/* ─── CLICK HANDLER ─── */
const clickConfig = {
  textFade: 0.7,
  textMoveY: -20,
  pomegranateMove: 1.3,
  pomegranateFade: 0.4,
  revealDelay: 1.0,
  lottieScrollDelay: 2.8
};

let clicked = false;

const sceneEl = document.getElementById('scene');
sceneEl.addEventListener('click', () => {
  if (clicked) return;
  clicked = true;

  gsap.killTweensOf('#cta');

  const wrap = document.getElementById('pomegranate-wrap');
  const rect  = wrap.getBoundingClientRect();
  const fromX = rect.left + rect.width / 2;
  const fromY = rect.top + rect.height / 2;
  const dx    = window.innerWidth  / 2 - fromX;
  const dy    = window.innerHeight / 2 - fromY;

  // 1. fade text + cta
  gsap.to(['#title-sayat', '#byline', '#cta'], {
    opacity: 0,
    y: clickConfig.textMoveY,
    duration: clickConfig.textFade,
    stagger: 0.06
  });

  setTimeout(() => {
    document.getElementById('cta').style.display = 'none';
  }, (clickConfig.textFade + 0.1) * 1000);

  // 2. pomegranate moves then fades out
  gsap.to('#pomegranate-wrap', {
    x: dx,
    y: dy,
    scale: 1.12,
    duration: clickConfig.pomegranateMove,
    ease: 'expo.inOut'
  });

  gsap.to('#pomegranate-wrap', {
    opacity: 0,
    duration: clickConfig.pomegranateFade,
    ease: 'power2.inOut',
    delay: 0.4,
    onComplete: () => {
      wrap.style.display = 'none';
    }
  });

  // 3. reveal text
  setTimeout(() => {
    document.getElementById('reveal').style.pointerEvents = 'none';
    gsap.to('#reveal', { opacity: 1, duration: 0.01 });
    gsap.to('#title-pomegranates', {
      opacity: 1,
      duration: 1.6,
      ease: 'power2.out'
    });
  }, clickConfig.revealDelay * 1000);

  // 4. scroll to lottie player
  setTimeout(() => {
    const player = document.querySelector('lottie-player');
    if (player) {
      player.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, clickConfig.lottieScrollDelay * 1000);
});