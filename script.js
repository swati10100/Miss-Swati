// ========================
// PAGE NAVIGATION
// ========================
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');

  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === name);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Close mobile menu
  document.getElementById('nav-links').classList.remove('open');
  document.getElementById('burger').classList.remove('open');

  // Trigger reveals on the newly shown page
  setTimeout(initReveal, 80);
  setTimeout(initCounters, 200);
}

// ========================
// SCROLL EFFECTS
// ========================
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ========================
// REVEAL ON SCROLL
// ========================
function initReveal() {
  const els = document.querySelectorAll('.page.active .reveal:not(.visible)');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

// ========================
// STAT COUNTERS
// ========================
function animateCount(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1400;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(ease * target).toLocaleString('en-IN');
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function initCounters() {
  const counters = document.querySelectorAll('.page.active .stat-num[data-target]');
  if (!counters.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.animated) {
        e.target.dataset.animated = '1';
        animateCount(e.target);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => obs.observe(c));
}

// ========================
// MOBILE BURGER
// ========================
document.getElementById('burger').addEventListener('click', function () {
  this.classList.toggle('open');
  document.getElementById('nav-links').classList.toggle('open');
});

// ========================
// PRICING TOGGLE
// ========================
const retailPrices = {
  1: '2,400', 2: '780', 3: '1,100', 4: '5,800', 5: '420'
};
const wholesalePrices = {
  1: '1,680', 2: '546', 3: '770', 4: '4,060', 5: '294'
};
const retailNotes = {
  1: 'Min. 2 metres',
  2: 'Min. 1 metre',
  3: 'Min. 2.5 metres',
  4: 'Min. 1 metre',
  5: 'Min. 3 metres'
};
const wholesaleNotes = {
  1: 'Min. 12 metres · Trade only',
  2: 'Min. 20 metres · Trade only',
  3: 'Min. 10 metres · Trade only',
  4: 'Min. 5 metres · Trade only',
  5: 'Min. 25 metres · Trade only'
};

let isWholesale = false;

function updatePricing() {
  const prices = isWholesale ? wholesalePrices : retailPrices;
  const notes  = isWholesale ? wholesaleNotes  : retailNotes;

  document.querySelectorAll('.pc-amount').forEach((el, i) => {
    const key = i + 1;
    if (prices[key]) {
      el.style.transition = 'opacity 0.25s, transform 0.25s';
      el.style.opacity = '0';
      el.style.transform = 'translateY(-6px)';
      setTimeout(() => {
        el.textContent = prices[key];
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 200);
    }
  });

  document.querySelectorAll('.pc-note').forEach((el, i) => {
    const key = i + 1;
    if (notes[key]) el.textContent = notes[key];
  });

  const track = document.getElementById('billing-toggle');
  if (track) {
    track.classList.toggle('on', isWholesale);
    track.setAttribute('aria-checked', isWholesale);
  }

  const lblR = document.getElementById('lbl-retail');
  const lblW = document.getElementById('lbl-wholesale');
  if (lblR) lblR.classList.toggle('active', !isWholesale);
  if (lblW) lblW.classList.toggle('active', isWholesale);
}

function toggleBilling() {
  isWholesale = !isWholesale;
  updatePricing();
}

function setBilling(mode) {
  isWholesale = (mode === 'wholesale');
  updatePricing();
}

// ========================
// FAQ ACCORDION
// ========================
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// ========================
// CONTACT FORM
// ========================
function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const success = document.getElementById('form-success');
  form.classList.add('hidden');
  setTimeout(() => {
    success.classList.add('show');
  }, 200);
}

// ========================
// INIT
// ========================
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initCounters();
});