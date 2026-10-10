/**
 * reveal.js
 * IntersectionObserver / reveal-item entrance animation controller.
 * Observes .reveal-item elements on route changes and after dynamic content insertion.
 * 
 * Depends on: none
 */
(function () {
  var currentObserver = null;

  function resetRevealAnimations(route) {
    if (currentObserver) {
      currentObserver.disconnect();
      currentObserver = null;
    }
    var activeView = document.querySelector('[data-page="' + route + '"]');
    if (!activeView) return;
    var items = activeView.querySelectorAll('.reveal-item');
    items.forEach(function (el) { el.classList.remove('revealed'); });
    if ('IntersectionObserver' in window) {
      currentObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            if (observer) {
              observer.unobserve(entry.target);
            }
          }
        });
      }, { rootMargin: '0px 0px -40px 0px', threshold: 0.1 });
      items.forEach(function (el) { currentObserver.observe(el); });
    } else {
      items.forEach(function (el) { el.classList.add('revealed'); });
    }
  }

  function observeNewRevealItems(container) {
    if (!container) return;
    var items = container.querySelectorAll('.reveal-item');
    if ('IntersectionObserver' in window) {
      if (!currentObserver) {
        currentObserver = new IntersectionObserver(function (entries, observer) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              if (observer) {
                observer.unobserve(entry.target);
              }
            }
          });
        }, { rootMargin: '0px 0px -40px 0px', threshold: 0.1 });
      }
      items.forEach(function (el) {
        if (!el.classList.contains('revealed')) {
          currentObserver.observe(el);
        }
      });
    } else {
      items.forEach(function (el) { el.classList.add('revealed'); });
    }
  }

  window.resetRevealAnimations = resetRevealAnimations;
  window.observeNewRevealItems = observeNewRevealItems;
})();
