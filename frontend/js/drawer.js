/**
 * drawer.js
 * Mobile navigation hamburger drawer for responsive viewports (< xl breakpoint).
 * Manages open/close animations, scroll locks, and keyboard focus trap.
 * 
 * Depends on: none
 */
(function () {
  var menuBtn = null;
  var drawer = null;
  var drawerOverlay = null;
  var drawerCloseBtn = null;
  var drawerOpen = false;
  var savedScrollY = 0;

  function openDrawer() {
    if (drawerOpen) return;
    drawer = drawer || document.getElementById('mobile-drawer');
    drawerOverlay = drawerOverlay || document.getElementById('mobile-drawer-overlay');
    menuBtn = menuBtn || document.getElementById('mobile-menu-btn');
    if (!drawer || !drawerOverlay) return;

    drawerOpen = true;
    savedScrollY = window.scrollY;
    drawerOverlay.classList.remove('hidden');
    drawer.classList.remove('hidden');

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        drawerOverlay.classList.add('active');
        drawer.classList.add('active');
      });
    });

    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', 'true');
      menuBtn.setAttribute('aria-label', 'Close menu');
      menuBtn.classList.add('hamburger-open');
    }

    // Lock body scroll
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = '-' + savedScrollY + 'px';
    document.body.style.width = '100%';

    // Focus first focusable element
    var first = drawer.querySelector('a, button');
    if (first) first.focus();
  }

  function closeDrawer() {
    if (!drawerOpen) return;
    drawer = drawer || document.getElementById('mobile-drawer');
    drawerOverlay = drawerOverlay || document.getElementById('mobile-drawer-overlay');
    menuBtn = menuBtn || document.getElementById('mobile-menu-btn');

    drawerOpen = false;
    if (drawerOverlay) drawerOverlay.classList.remove('active');
    if (drawer) drawer.classList.remove('active');

    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', 'Open menu');
      menuBtn.classList.remove('hamburger-open');
    }

    // Restore body scroll
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, savedScrollY);

    if (menuBtn) menuBtn.focus();

    setTimeout(function () {
      if (!drawerOpen) {
        if (drawerOverlay) drawerOverlay.classList.add('hidden');
        if (drawer) drawer.classList.add('hidden');
      }
    }, 300);
  }

  function initDrawer() {
    menuBtn = document.getElementById('mobile-menu-btn');
    drawer = document.getElementById('mobile-drawer');
    drawerOverlay = document.getElementById('mobile-drawer-overlay');
    drawerCloseBtn = document.getElementById('mobile-menu-close');

    if (menuBtn) menuBtn.addEventListener('click', function () { drawerOpen ? closeDrawer() : openDrawer(); });
    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

    // Focus trap inside drawer
    if (drawer) {
      drawer.addEventListener('keydown', function (e) {
        if (e.key !== 'Tab' || !drawerOpen) return;
        var focusables = drawer.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      });
    }

    // Auto-close drawer on viewport resize to desktop (xl breakpoint)
    var xlQuery = window.matchMedia('(min-width: 1280px)');
    xlQuery.addEventListener('change', function (e) {
      if (e.matches && drawerOpen) closeDrawer();
    });
  }

  window.openDrawer = openDrawer;
  window.closeDrawer = closeDrawer;
  window.isDrawerOpen = function () { return drawerOpen; };
  window.initDrawer = initDrawer;
})();
