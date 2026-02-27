// CURSOR
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
if (cur && ring) {
  cur.style.opacity = '0';
  ring.style.opacity = '0';
  document.addEventListener('mousemove', e => {
    cur.style.opacity = '1';
    ring.style.opacity = '1';
    cur.style.left = e.clientX + 'px';
    cur.style.top  = e.clientY + 'px';
    setTimeout(() => { ring.style.left = e.clientX + 'px'; ring.style.top = e.clientY + 'px'; }, 55);
  });
}

// Active nav link based on current page
const page = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.getAttribute('href') === page) a.classList.add('active');
});

// COUNTDOWN (used on index.html)
const cdEl = document.getElementById('cd-d');
if (cdEl) {
  const cdTarget = new Date('2025-03-15T09:00:00');
  function updateCD() {
    const diff = cdTarget - new Date();
    if (diff <= 0) { ['cd-d','cd-h','cd-m','cd-s'].forEach(id => document.getElementById(id).textContent = '00'); return; }
    document.getElementById('cd-d').textContent = String(Math.floor(diff/86400000)).padStart(2,'0');
    document.getElementById('cd-h').textContent = String(Math.floor((diff%86400000)/3600000)).padStart(2,'0');
    document.getElementById('cd-m').textContent = String(Math.floor((diff%3600000)/60000)).padStart(2,'0');
    document.getElementById('cd-s').textContent = String(Math.floor((diff%60000)/1000)).padStart(2,'0');
  }
  updateCD(); setInterval(updateCD, 1000);
}

// FAQ
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
}

// FORM
function submitForm() {
  const team  = document.getElementById('f-team')?.value.trim();
  const name  = document.getElementById('f-name')?.value.trim();
  const email = document.getElementById('f-email')?.value.trim();
  const game  = document.getElementById('f-game')?.value;
  if (!team || !name || !email || !game) { alert('Vyplňte prosím všechna povinná pole.'); return; }
  document.querySelectorAll('#regForm input, #regForm select, #regForm button').forEach(el => el.style.display = 'none');
  document.getElementById('formSuccess').style.display = 'block';
}

// PRIZE POOL FLAP
const fids = ['fd0','fd1','fd2','fd3','fd4','fd5'];
const fels = fids.map(id => document.getElementById(id)).filter(Boolean);
const shown = [0,0,0,0,0,0];

function flipDigit(el, from, to) {
  if (from === to) return;
  const top  = el.querySelector('.flap-top span');
  const bot  = el.querySelector('.flap-bottom span');
  const card = el.querySelector('.flap-card');
  const cs   = card.querySelector('span');
  cs.textContent = from;
  card.classList.remove('go');
  void card.offsetWidth;
  card.classList.add('go');
  top.textContent = to;
  bot.textContent = to;
}

function displayPool(value) {
  const str = String(Math.min(value, 999999)).padStart(6,'0');
  for (let i = 0; i < 6; i++) {
    const d = parseInt(str[i]);
    if (d !== shown[i]) { flipDigit(fels[i], String(shown[i]), String(d)); shown[i] = d; }
  }
}

function spinReveal(targetVal, onDone) {
  const tStr = String(Math.min(targetVal, 999999)).padStart(6,'0');
  let doneCount = 0;
  fels.forEach((el, i) => {
    let count = 0;
    const rounds = 10 + i * 2;
    const tgt = parseInt(tStr[i]);
    const iv = setInterval(() => {
      const r = Math.floor(Math.random() * 10);
      flipDigit(el, String(shown[i]), String(r));
      shown[i] = r;
      count++;
      if (count >= rounds) {
        clearInterval(iv);
        setTimeout(() => {
          flipDigit(el, String(shown[i]), String(tgt));
          shown[i] = tgt;
          doneCount++;
          if (doneCount === 6 && onDone) onDone();
        }, 60);
      }
    }, 60 + i * 12);
  });
}

let pool = 0;
let prizeStarted = false;

function growPool() {
  const bump = Math.floor(Math.random() * 200) + 50;
  pool += bump;
  displayPool(pool);
  const delay = Math.min(7000, 3500 + pool * 0.1);
  setTimeout(growPool, delay);
}

function revealPrize() {
  if (prizeStarted) return;
  prizeStarted = true;
  document.getElementById('prizeOverlay').classList.add('gone');
  pool = Math.floor(Math.random() * 6000) + 4000;
  spinReveal(pool, () => { setTimeout(growPool, 3000); });
}

// GLITCH EFFECT — independent timers per element
(function() {
  function scheduleGlitch(el, minMs, maxMs) {
    setTimeout(function fire() {
      el.classList.add('is-glitching');
      setTimeout(() => {
        el.classList.remove('is-glitching');
        scheduleGlitch(el, minMs, maxMs);
      }, 150 + Math.random() * 100);
    }, minMs + Math.random() * (maxMs - minMs));
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.hero-title.glitch, .page-title.glitch').forEach(el => {
      scheduleGlitch(el, 2000, 6000);
    });
    const trophy = document.querySelector('.trophy-wrap.glitch');
    if (trophy) scheduleGlitch(trophy, 3500, 9000);
  });
})();
