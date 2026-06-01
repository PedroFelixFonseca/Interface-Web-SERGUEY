/* ============================================================
   collage.js — configuration centralisée dans le JS
   Le HTML ne contient que de simples .collage-img vides.
   Toutes les coordonnées et vitesses vivent ici.
   ============================================================ */


/* ── CONFIGURATION GLOBALE ───────────────────────────────────
   Comportement général de l'animation.
   ──────────────────────────────────────────────────────────── */
const CONFIG = {
  amplitude: 140,   // distance max de déplacement en px au scroll
  lerp:      0.08,  // inertie (0.01 = très mou / 0.3 = vif)
};


/* ── PLACEMENT DES IMAGES ────────────────────────────────────
   C'est ici que tu positionnes et configures chaque image.
   L'ordre correspond à l'ordre des .collage-img dans le HTML
   (index 0 = première, index 1 = deuxième, etc.)

   Propriétés disponibles :
   ┌──────────┬──────────────────────────────────────────────┐
   │ x        │ position horizontale en % du conteneur       │
   │ y        │ position verticale en % du conteneur         │
   │ w        │ largeur en px                                 │
   │ h        │ hauteur en px                                 │
   │ rot      │ rotation initiale en degrés                   │
   │ z        │ ordre de superposition (max 9, texte = 10)    │
   │ speedX   │ vitesse horizontale au scroll  (-1 à 1)       │
   │ speedY   │ vitesse verticale au scroll    (-1 à 1)       │
   │ speedR   │ vitesse de rotation au scroll  (-1 à 1)       │
   └──────────┴──────────────────────────────────────────────┘

   Exemples de speedX / speedY :
     0.5  → se déplace vers la droite / le bas
    -0.5  → se déplace vers la gauche / le haut
     0    → ne bouge pas sur cet axe
   ──────────────────────────────────────────────────────────── */
const IMAGES_CONFIG = [
  {
    // Image 01 — en haut à droite
    x: 62,  y: 80,
    w: 180, h: 130,
    rot: -6, z: 3,
    speedX:  0.3,  speedY: -0.55, speedR:  0.04,
  },
  {
    // Image 02 — à gauche, milieu
    x: 50,   y: 86,
    w: 155, h: 200,
    rot:  5, z: 2,
    speedX: -0.4,  speedY:  0.4,  speedR: -0.05,
  },
  {
    // Image 03 — centre-droite
    x: 55,  y: 88,
    w: 200, h: 130,
    rot: -3, z: 4,
    speedX:  0.5,  speedY:  0.35, speedR:  0.06,
  },
  {
    // Image 04 — bas centre
    x: 30,  y: 120,
    w: 160, h: 120,
    rot:  8, z: 5,
    speedX: -0.3,  speedY: -0.45, speedR: -0.03,
  },
];


/* ── RÉCUPÉRATION DES ÉLÉMENTS ───────────────────────────────
   On récupère les .collage-img du HTML et on les associe
   un à un avec IMAGES_CONFIG par leur index.
   ──────────────────────────────────────────────────────────── */
const section = document.getElementById('collage-section');
const imgEls  = Array.from(document.querySelectorAll('.collage-img'));

// On fusionne chaque élément DOM avec sa config JS
const items = imgEls.map((el, i) => ({
  el,
  ...IMAGES_CONFIG[i],  // spread : copie toutes les propriétés de la config
}));


/* ── POSITIONNEMENT INITIAL ──────────────────────────────────
   x et y sont en % → convertis en px selon la taille réelle
   du conteneur au moment de l'appel.
   ──────────────────────────────────────────────────────────── */
function placeImages() {
  const W = section.offsetWidth;
  const H = section.offsetHeight;

  items.forEach((item) => {
    item.el.style.width  = item.w + 'px';
    item.el.style.height = item.h + 'px';
    item.el.style.zIndex = item.z;   // max 9 → sous le texte (z-index: 10)
    item.el.style.left   = (W * item.x / 100) - item.w / 2 + 'px';
    item.el.style.top    = (H * item.y / 100) - item.h / 2 + 'px';

    gsap.set(item.el, {
      x: 0, y: 0,
      rotation: item.rot,
      transformOrigin: 'center center',
    });
  });
}


/* ── SCROLL AVEC SCROLLTRIGGER ───────────────────────────────
   progress va de -1 (section en bas de l'écran, pas encore vue)
   à +1 (section sortie par le haut).
   À 0 : la section est centrée dans le viewport → position neutre.
   ──────────────────────────────────────────────────────────── */
let progress       = 0;
let targetProgress = 0;

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.create({
  trigger: section,
  start:   'top bottom',
  end:     'bottom top',
  onUpdate: (self) => {
    targetProgress = (self.progress - 0.5) * 2;
  },
});


/* ── BOUCLE D'ANIMATION ──────────────────────────────────────*/
gsap.ticker.add(() => {
  progress += (targetProgress - progress) * CONFIG.lerp;

  items.forEach((item) => {
    const tx = item.speedX * CONFIG.amplitude * progress;
    const ty = item.speedY * CONFIG.amplitude * progress;
    const tr = item.rot + item.speedR * 180 * progress;
    gsap.set(item.el, { x: tx, y: ty, rotation: tr });
  });
});


/* ── RESIZE & INIT ───────────────────────────────────────────*/
window.addEventListener('resize', () => {
  placeImages();
  ScrollTrigger.refresh();
});

placeImages();