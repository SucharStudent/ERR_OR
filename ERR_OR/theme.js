// Apply saved theme immediately (before DOM ready - prevents flash)
(function() {
  const saved = localStorage.getItem('error-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
})();

function setTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('error-theme', t);
  document.querySelectorAll('.theme-option').forEach(b => {
    b.classList.toggle('active', b.dataset.theme === t);
  });
  // also keep old .theme-btn in sync if they exist
  document.querySelectorAll('.theme-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.t === t);
  });
  setTimeout(closeThemePanel, 320);
}

function openThemePanel() {
  const panel = document.getElementById('themePanel');
  const overlay = document.getElementById('themeOverlay');
  if (panel) panel.classList.add('open');
  if (overlay) overlay.classList.add('open');
}

function closeThemePanel() {
  const panel = document.getElementById('themePanel');
  const overlay = document.getElementById('themeOverlay');
  if (panel) panel.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('error-theme') || 'dark';

  // Mark active option
  document.querySelectorAll('.theme-option').forEach(b => {
    b.classList.toggle('active', b.dataset.theme === saved);
  });
  document.querySelectorAll('.theme-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.t === saved);
  });

  // Trigger button
  const trigger = document.getElementById('themeTrigger');
  const overlay = document.getElementById('themeOverlay');

  if (trigger) {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const panel = document.getElementById('themePanel');
      panel && panel.classList.contains('open') ? closeThemePanel() : openThemePanel();
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeThemePanel);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeThemePanel();
  });
});
