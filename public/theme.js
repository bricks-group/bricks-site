// Bricks prelaunch — theme: auto (system dark mode) + manual toggle, persisted (bricks-theme)
// Less prominent than a big button: it lives inside the menu bar and uses a small glyph.
(function () {
  var root = document.documentElement;
  var KEY = 'bricks-theme';

  function setAttrOnRoot(v) { root.setAttribute('data-theme', v); }

  // Apply any persisted choice as early as possible (FOUC guard).
  try {
    var saved = localStorage.getItem(KEY);
    if (saved) setAttrOnRoot(saved);
  } catch (e) {}

  function isDark() {
    var t = root.getAttribute('data-theme');
    if (t === 'dark') return true;
    if (t === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function syncGlyph() {
    var g = isDark() ? '○' : '◑';
    var aria = isDark() ? 'Switch to light mode' : 'Switch to dark mode';
    var nodes = document.querySelectorAll('.theme-toggle');
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = g;
      nodes[i].setAttribute('aria-label', aria);
    }
  }

  function toggle() {
    var next = isDark() ? 'light' : 'dark';
    setAttrOnRoot(next);
    try { localStorage.setItem(KEY, next); } catch (e) {}
    syncGlyph();
  }

  // One delegated listener is enough; tappable things are .theme-toggle buttons.
  document.addEventListener('click', function (e) {
    var node = e.target;
    if (!node) return;
    if (node.classList && node.classList.contains('theme-toggle')) { toggle(); return; }
    if (node.classList && node.classList.contains('theme-glyph')) { toggle(); return; }
    var parent = node.parentElement;
    if (parent && parent.classList && parent.classList.contains('theme-toggle')) { toggle(); return; }
  });

  // Respect system preference changes when the user hasn't manually switched.
  try {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    if (mq.addEventListener) mq.addEventListener('change', function () {
      if (!localStorage.getItem(KEY)) syncGlyph();
    });
    else if (mq.addListener) mq.addListener(function () {
      if (!localStorage.getItem(KEY)) syncGlyph();
    });
  } catch (e) {}

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncGlyph);
  } else {
    syncGlyph();
  }
})();
