/* Bricks — content deterrent.
   Blocks right-click (context menu) site-wide and drag-to-download of
   images/video, and removes the native video download control.
   This is a UX deterrent only — assets remain reachable via the browser's
   network inspector / view-source. For real protection use signed, expiring
   URLs, CDN referer locking, and watermarking. */
(function () {
  'use strict';

  // Prevent image/video selection-drag at the CSS level.
  var style = document.createElement('style');
  style.textContent = 'img,video{-webkit-user-drag:none;-webkit-user-select:none;user-select:none;}';
  (document.head || document.documentElement).appendChild(style);

  // 1) Kill the context menu everywhere (all right clicks).
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    return false;
  });

  // 2) Block drag-to-download of imagery and video.
  document.addEventListener('dragstart', function (e) {
    var t = e.target;
    if (!t) return;
    var tag = (t.tagName || '').toUpperCase();
    if (tag === 'IMG' || tag === 'VIDEO' ||
        (typeof t.closest === 'function' && t.closest('img, video'))) {
      e.preventDefault();
    }
  });

  // 3) Strip the native download affordance from <video> elements.
  function lockVideos() {
    var vids = document.querySelectorAll('video');
    for (var i = 0; i < vids.length; i++) {
      var v = vids[i];
      v.setAttribute('controlsList', 'nodownload');
      v.removeAttribute('download');
      var srcs = v.querySelectorAll('source');
      for (var j = 0; j < srcs.length; j++) srcs[j].removeAttribute('download');
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', lockVideos);
  } else {
    lockVideos();
  }
})();
