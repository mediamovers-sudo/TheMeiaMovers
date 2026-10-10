/**
 * modals.js
 * Controls all modal dialogues and lightboxes:
 * - Collective Member Dossier Lightbox (#member-dossier-modal)
 * - Wire Photo Lightbox (#wire-photo-modal)
 * - Showreel Video Viewer (#reel-modal)
 * - Crew Application Sheet (#apply-modal)
 * - Story Pitch Sheet (#pitch-modal)
 * - Keyboard listeners (Escape to dismiss, Arrow keys for lightbox pagination)
 * 
 * Depends on: api.js (window.collectiveMembers, window.wirePhotos), drawer.js (window.isDrawerOpen, window.closeDrawer)
 */
(function () {
  var currentDossierIndex = 0;
  var currentWireIndex = 0;

  window.openMemberDossier = function (indexOrId) {
    var members = window.collectiveMembers || [];
    if (!members.length) return;

    var targetIndex = -1;
    if (typeof indexOrId === 'number' && indexOrId >= 0 && indexOrId < members.length) {
      targetIndex = indexOrId;
    } else {
      targetIndex = members.findIndex(function (m) { return m.id === indexOrId; });
    }
    if (targetIndex === -1) {
      targetIndex = 0;
    }

    currentDossierIndex = (targetIndex + members.length) % members.length;
    var member = members[currentDossierIndex];
    if (!member) return;

    var idxEl = document.getElementById('dossier-index');
    if (idxEl) idxEl.textContent = String(currentDossierIndex + 1).padStart(2, '0');
    var imgEl = document.getElementById('dossier-image');
    if (imgEl) {
      imgEl.src = member.photoUrl || member.image || '';
      imgEl.alt = member.name || 'Member';
    }
    var roleEl = document.getElementById('dossier-role');
    if (roleEl) roleEl.textContent = member.role || '';
    var nameEl = document.getElementById('dossier-name');
    if (nameEl) nameEl.textContent = member.name || '';
    var quoteEl = document.getElementById('dossier-quote');
    if (quoteEl) quoteEl.textContent = member.quote ? (member.quote.startsWith('"') ? member.quote : '"' + member.quote + '"') : '';
    var deptEl = document.getElementById('dossier-dept');
    if (deptEl) deptEl.textContent = member.department || member.dept || '';
    var handleEl = document.getElementById('dossier-handle');
    if (handleEl) handleEl.textContent = member.instagramHandle || member.handle || '';
    var socialEl = document.getElementById('dossier-social-link');
    if (socialEl) {
      var handle = member.instagramHandle || member.handle || '';
      socialEl.href = handle ? ('https://www.instagram.com/' + handle.replace('@', '')) : (member.socialUrl || 'https://www.instagram.com/the.mediamovers');
    }
    var bioEl = document.getElementById('dossier-bio');
    if (bioEl) bioEl.textContent = member.bio || '';
    var camEl = document.getElementById('dossier-cam-tag');
    if (camEl) camEl.textContent = member.camTag || ('MEMBER // ' + String(currentDossierIndex + 1).padStart(2, '0'));

    var modal = document.getElementById('member-dossier-modal');
    var container = document.getElementById('dossier-container');
    if (modal && container) {
      modal.classList.remove('hidden');
      requestAnimationFrame(function () {
        modal.classList.remove('opacity-0');
        container.classList.remove('scale-95');
        container.classList.add('scale-100');
      });
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeMemberDossier = function () {
    var modal = document.getElementById('member-dossier-modal');
    var container = document.getElementById('dossier-container');
    if (modal && container) {
      modal.classList.add('opacity-0');
      container.classList.remove('scale-100');
      container.classList.add('scale-95');
      setTimeout(function () {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
      }, 250);
    }
  };

  window.navigateDossier = function (direction) {
    var members = window.collectiveMembers || [];
    if (!members.length) return;
    var newIdx = (currentDossierIndex + direction + members.length) % members.length;
    window.openMemberDossier(newIdx);
  };

  window.openWirePhoto = function (index) {
    var photos = window.wirePhotos || [];
    if (!photos.length) return;
    currentWireIndex = (index + photos.length) % photos.length;
    var photo = photos[currentWireIndex];
    if (!photo) return;

    var tagEl = document.getElementById('wire-tag');
    if (tagEl) tagEl.textContent = photo.tag;
    var reelEl = document.getElementById('wire-reel-id');
    if (reelEl) reelEl.textContent = photo.reelId;
    var titleEl = document.getElementById('wire-title');
    if (titleEl) titleEl.textContent = photo.title;
    var descEl = document.getElementById('wire-desc');
    if (descEl) descEl.textContent = photo.desc;
    var imgEl = document.getElementById('wire-image');
    if (imgEl) imgEl.src = photo.image;

    var modal = document.getElementById('wire-photo-modal');
    var container = document.getElementById('wire-container');
    if (modal && container) {
      modal.classList.remove('hidden');
      requestAnimationFrame(function () {
        modal.classList.remove('opacity-0');
        container.classList.remove('scale-95');
        container.classList.add('scale-100');
      });
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeWirePhoto = function () {
    var modal = document.getElementById('wire-photo-modal');
    var container = document.getElementById('wire-container');
    if (modal && container) {
      modal.classList.add('opacity-0');
      container.classList.remove('scale-100');
      container.classList.add('scale-95');
      setTimeout(function () {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
      }, 250);
    }
  };

  window.navigateWire = function (direction) {
    window.openWirePhoto(currentWireIndex + direction);
  };

  // Keyboard navigation & dismissal handlers
  window.addEventListener('keydown', function (e) {
    var memberModal = document.getElementById('member-dossier-modal');
    if (memberModal && !memberModal.classList.contains('hidden')) {
      if (e.key === 'Escape') { window.closeMemberDossier(); return; }
      if (e.key === 'ArrowRight') { window.navigateDossier(1); return; }
      if (e.key === 'ArrowLeft') { window.navigateDossier(-1); return; }
    }
    var wireModal = document.getElementById('wire-photo-modal');
    if (wireModal && !wireModal.classList.contains('hidden')) {
      if (e.key === 'Escape') { window.closeWirePhoto(); return; }
      if (e.key === 'ArrowRight') { window.navigateWire(1); return; }
      if (e.key === 'ArrowLeft') { window.navigateWire(-1); return; }
    }
    var reelModal = document.getElementById('reel-modal');
    if (reelModal && !reelModal.classList.contains('hidden')) {
      if (e.key === 'Escape') {
        reelModal.classList.add('hidden');
        var reelVideo = document.getElementById('reel-video');
        if (reelVideo) reelVideo.pause();
        return;
      }
    }
    var applyModal = document.getElementById('apply-modal');
    if (applyModal && !applyModal.classList.contains('hidden')) {
      if (e.key === 'Escape') { applyModal.classList.add('hidden'); return; }
    }
    var pitchModal = document.getElementById('pitch-modal');
    if (pitchModal && !pitchModal.classList.contains('hidden')) {
      if (e.key === 'Escape') { pitchModal.classList.add('hidden'); return; }
    }
    if (e.key === 'Escape' && typeof window.isDrawerOpen === 'function' && window.isDrawerOpen()) {
      if (typeof window.closeDrawer === 'function') {
        window.closeDrawer();
      }
      return;
    }
  });
})();
