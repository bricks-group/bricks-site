// Fix broken Supabase property thumbnails in booking mockup.
// The "Bricks Images" bucket was migrated and 3 files were lost (400 Bad Request).
// This swaps in real listing photos from Ajani's Unsplash (@akasm).
(function() {
  var FIXES = {
    '74E774C6-1524-4287-B115-25CA213E4BBD.PNG': 'https://images.unsplash.com/photo-1759691555105-17e609a3e46f?w=128&q=80&fm=jpg&fit=crop',
    '8F382591-AA45-4B74-AD75-08717CFB63D4.PNG': 'https://images.unsplash.com/photo-1759691555010-7f3f8674d2f2?w=128&q=80&fm=jpg&fit=crop',
    '2153E4F6-D200-4DE8-BDCE-15799C873D44.PNG': 'https://images.unsplash.com/photo-1759691554646-8155da2172ee?w=128&q=80&fm=jpg&fit=crop'
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
