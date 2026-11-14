// Booking-mockup thumbs used to load from Supabase Storage (now 402).
// bricks.js points at self-hosted /media/v/screens/ files. This keeps a
// fallback if an old UUID filename is still requested.
(function() {
  var FIXES = {
    '74E774C6-1524-4287-B115-25CA213E4BBD.PNG': '/media/v/screens/listing-a.bf8aeb6444b6.webp',
    '8F382591-AA45-4B74-AD75-08717CFB63D4.PNG': '/media/v/screens/listing-b.422812c72a6d.webp',
    '2153E4F6-D200-4DE8-BDCE-15799C873D44.PNG': '/media/v/screens/listing-c.ab2992eff4a1.webp'
  };
  function fixImg(img) {
    if (!img || img.tagName !== 'IMG' || img.dataset.bxFixed) return;
    for (var broken in FIXES) {
      if (img.src.indexOf(broken) !== -1) {
        img.dataset.bxFixed = '1';
        img.src = FIXES[broken];
        break;
      }
    }
  }
  document.addEventListener('error', function(e) {
    if (e.target && e.target.tagName === 'IMG') fixImg(e.target);
  }, true);
  function sweep() { document.querySelectorAll('img').forEach(fixImg); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', sweep);
  } else { sweep(); }
  new MutationObserver(function(muts) {
    muts.forEach(function(m) {
      m.addedNodes.forEach(function(n) {
        if (n.tagName === 'IMG') fixImg(n);
        else if (n.querySelectorAll) n.querySelectorAll('img').forEach(fixImg);
      });
    });
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
