/* Bricks — before/after comparison slider.
   Overlapping images, drag the handle (or use arrow keys) to wipe between
   "before" and "after". Pointer Events cover mouse + touch + pen. */
(function () {
  'use strict';

  function initBA(el) {
    var before = el.querySelector('.ba-before');
    var handle = el.querySelector('.ba-handle');
    if (!before || !handle) return;
    var pos = parseFloat(el.getAttribute('data-pos')) || 50;

    function set(p) {
      p = Math.max(0, Math.min(100, p));
      pos = p;
      before.style.clipPath = 'inset(0 ' + (100 - p) + '% 0 0)';
      handle.style.left = p + '%';
      el.setAttribute('aria-valuenow', Math.round(p));
    }

    function fromX(clientX) {
      var r = el.getBoundingClientRect();
      if (!r.width) return pos;
      return ((clientX - r.left) / r.width) * 100;
    }

    var dragging = false;
    el.addEventListener('pointerdown', function (e) {
      dragging = true;
      try { el.setPointerCapture(e.pointerId); } catch (_) {}
      set(fromX(e.clientX));
      e.preventDefault();
    });
    el.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      set(fromX(e.clientX));
    });
    function end() { dragging = false; }
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    el.addEventListener('keydown', function (e) {
      var step = e.shiftKey ? 10 : 3;
      if (e.key === 'ArrowLeft') { set(pos - step); e.preventDefault(); }
      else if (e.key === 'ArrowRight') { set(pos + step); e.preventDefault(); }
      else if (e.key === 'Home') { set(0); e.preventDefault(); }
      else if (e.key === 'End') { set(100); e.preventDefault(); }
    });

    set(pos);
  }

  function boot() {
    var list = document.querySelectorAll('.ba');
    for (var i = 0; i < list.length; i++) initBA(list[i]);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
