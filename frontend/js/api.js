/**
 * api.js
 * Handles data fetching and DOM rendering for dynamic content:
 * - Collective members (GET /api/members)
 * - Work items / featured portfolio (GET /api/work-items)
 * - Wire photos (GET /api/wire-photos)
 * - Crew application form submissions (POST /api/applications)
 * 
 * Depends on: reveal.js (window.observeNewRevealItems), modals.js (window.openMemberDossier, window.openWirePhoto)
 */
(function () {
  // Empty array: collective members are strictly driven by the database through the API
  window.collectiveMembers = [];
  var membersLoading = false;
  var membersError = null;

  window.wirePhotos = [
    {
      reelId: "[ REEL #104 ]",
      title: "TESTING ANAMORPHIC FLARES ON QUAD FOUNTAINS",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5mBJS8gm7NXtOCyyB-hjG7pHtKFbFtyBK_fWwTp0k1cJTp0G6SCWbKo5vZ0r23o5PkWF1huRBZfIfYb340nl4IhzLITIXGaVUFgd0oI9PA-SMdbYOEPG8yHw6W9PspSHP8DHNZTynFwHDudR0PrhwpI-0fzg1Tu_Hg_dyvO0QtzTSWjRVEi6rF_hZnCRh4wBSXo035f6pMjusA7muRQji66ZF-5E3ev5HY0qZBQX__oqg53a9mvJ5ZA",
      tag: "// ON THE WIRE \u2014 REEL #104",
      desc: "Optical tests capturing 2.39:1 horizontal anamorphic streak flare patterns across the illuminated university quad fountains at midnight."
    },
    {
      reelId: "[ REEL #105 ]",
      title: "GOLDEN HOUR GOLDEN JUBILEE SESSIONS",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBrSckkD0-KZm8TxAFkMA7lP_YRTuQr3TVkAsAyw_N89S-F9haafhdDDGQthXaeCcG6I2si3_KXjYTy39bXdmNFjKT2afR9sgB0pE5-cGOkjxlY--9R8PO-otrGd43m6zHE7E6euUIOth8HyfbC7YstlZ7tuokNqaW4N4qkgNsvrgPRHXTn6Pl-n0ADDJ4robuJJ3i_71Hh_JJQBkNIRD3nlOhmHe5nt7Zp_3ONXBjbvfcRSkbqGzZNUw",
      tag: "// ON THE WIRE \u2014 REEL #105",
      desc: "Cinematographers shooting handheld golden hour sequences on NIST campus cobblestones using prime cinema glass."
    },
    {
      reelId: "[ REEL #106 ]",
      title: "RE-RECORDING CONVOCATION VOICEOVER STEMS",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBje00nEw_y965Kb9PCTIK64oxEcg9hRsog7pbvMJp73vWxlqxurPlrWdP2se0uz5SnW2F_T4M4CSQ6EjRrRXQay44d-i_ok-zO4V2MD54S6u9ZT7EUG04_mdZlkQQEnnAzXOxgdctp2uVDfcJ6vVCoG3ws43UIbA9fxWJzlDVmdZpWd2LgTTXFLn1P1ivO5bXnFSdcsnlENG1VEXrhmNTLthgY33TXowM-ishSZpEEW_FzuhA81LtqvA",
      tag: "// ON THE WIRE \u2014 REEL #106",
      desc: "Foley studio faders and dynamic audio mastering for spatial multi-channel commencement broadcast."
    },
    {
      reelId: "[ REEL #107 ]",
      title: "WRAP ON SHORT FILM 'LATENCY 2025'",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQsndK_lerGGNqmVdITV1WJTi8279ctRzXeR6eEalSO3ftbNzmj1qVNiAUIQzsJACYR3DYS26bOQw_WcBFXL5hQTwYmpF0Ep1SE0R9KzN4nk773ybOO9XlnITPjhGd4654BRu8GDbNcOq0Sv27kYe1p2tM9jQZUNy7Y4ezCWwtjQ1OYebLkRV0fdUOdecDiTxXvllMemdam3thsqyV_CNJNGAw8jFbSeFuCWiYfHCq4XByvK_ZYeZtWw",
      tag: "// ON THE WIRE \u2014 REEL #107",
      desc: "Final slate mark and principal photography wrap on the student-written sci-fi thriller Latency."
    }
  ];

  function renderMembers() {
    var grid = document.getElementById('collective-grid');
    if (!grid) return;

    // Loading state
    if (membersLoading) {
      grid.innerHTML =
        '<div class="col-span-full py-16 flex items-center justify-center">' +
        '<span class="font-label-mono-sm text-label-mono-sm uppercase text-text-muted tracking-widest px-4 py-2 border border-border-hairline bg-surface-slate/60 inline-flex items-center gap-2.5">' +
        '<span class="w-1.5 h-1.5 bg-primary-container rounded-full rec-dot"></span>' +
        'LOADING TEAM...' +
        '</span>' +
        '</div>';
      return;
    }

    // Error state
    if (membersError) {
      grid.innerHTML =
        '<div class="col-span-full py-16 flex flex-col items-center justify-center text-center">' +
        '<span class="material-symbols-outlined text-red-400 text-3xl mb-2">error_outline</span>' +
        '<span class="font-label-mono-sm text-label-mono-sm uppercase text-red-400 tracking-widest">' +
        'COULD NOT LOAD TEAM' +
        '</span>' +
        '</div>';
      return;
    }

    // Zero members state
    if (!Array.isArray(window.collectiveMembers) || window.collectiveMembers.length === 0) {
      grid.innerHTML =
        '<div class="col-span-full py-16 flex flex-col items-center justify-center text-center">' +
        '<span class="material-symbols-outlined text-text-muted text-3xl mb-2">group_off</span>' +
        '<span class="font-label-mono-sm text-label-mono-sm uppercase text-text-muted tracking-widest">' +
        'NO MEMBERS YET' +
        '</span>' +
        '</div>';
      return;
    }

    // Clear grid before rendering to prevent duplication
    grid.innerHTML = '';

    window.collectiveMembers.forEach(function (m, idx) {
      var photo = m.photoUrl || m.image || '';
      var name = m.name || '';
      var role = m.role || '';
      var dept = m.department || m.dept || 'CORE';
      var handle = m.instagramHandle || m.handle || '';
      var quoteText = m.quote ? (m.quote.startsWith('"') ? m.quote : '"' + m.quote + '"') : '';
      var delayMs = idx * 80;

      var card = document.createElement('div');
      card.className = 'border border-border-hairline bg-surface-slate/80 p-5 group flex flex-col justify-between hover:border-primary-container hover:-translate-y-1.5 transition-all duration-300 reveal-item cursor-pointer select-none';
      card.setAttribute('onclick', 'openMemberDossier(' + idx + ')');
      card.style.transitionDelay = delayMs + 'ms';
      card.onclick = function () { window.openMemberDossier(idx); };

      card.innerHTML =
        '<div>' +
        '<div class="w-full h-64 overflow-hidden border border-border-hairline relative mb-4 bg-surface-pitch">' +
        '<img alt="' + name + '" class="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-500 ease-out" src="' + photo + '">' +
        '<div class="absolute inset-0 bg-surface-pitch/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">' +
        '<span class="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-pitch/90 border border-primary-container text-primary font-label-mono-sm text-[11px] uppercase tracking-widest backdrop-blur-sm shadow-md">' +
        '<span class="material-symbols-outlined text-[15px]">zoom_in</span> VIEW DOSSIER' +
        '</span>' +
        '</div>' +
        '</div>' +
        '<div class="font-label-mono-sm text-label-mono-sm text-text-muted uppercase tracking-widest">' + role + '</div>' +
        '<h4 class="font-headline-md text-headline-md uppercase text-on-surface group-hover:text-primary transition-colors mt-1">' + name + '</h4>' +
        (quoteText ? '<p class="font-body-sm text-body-sm text-text-muted mt-2 italic">' + quoteText + '</p>' : '') +
        '</div>' +
        '<div class="pt-4 mt-4 border-t border-border-hairline flex items-center justify-between font-label-mono-sm text-label-mono-sm text-text-muted">' +
        '<span>DEPT: ' + dept + '</span>' +
        '<span class="text-on-surface group-hover:text-primary transition-colors">' + handle + '</span>' +
        '</div>';

      grid.appendChild(card);
    });

    if (typeof window.observeNewRevealItems === 'function') {
      window.observeNewRevealItems(grid);
    }
  }

  function renderWirePhotos() {
    var grid = document.getElementById('wire-photos-grid');
    if (!grid || !Array.isArray(window.wirePhotos) || window.wirePhotos.length === 0) return;
    grid.innerHTML = '';
    window.wirePhotos.forEach(function (p, idx) {
      var item = document.createElement('div');
      item.className = 'relative group overflow-hidden border border-border-hairline aspect-square bg-surface-slate reveal-item cursor-pointer select-none';
      item.onclick = function () { window.openWirePhoto(idx); };
      item.innerHTML =
        '<img alt="' + (p.title || 'Wire photo') + '" class="w-full h-full object-cover grayscale contrast-125 group-hover:scale-110 group-hover:grayscale-0 transition-all duration-700 ease-out" src="' + (p.image || '') + '">' +
        '<div class="absolute inset-0 bg-surface-pitch/75 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">' +
        '<span class="font-label-mono-sm text-label-mono-sm text-primary-container">' + (p.reelId || '[ REEL ]') + '</span>' +
        '<span class="font-label-mono-sm text-label-mono-sm text-on-surface uppercase tracking-wider">' + (p.title || '') + '</span>' +
        '</div>';
      grid.appendChild(item);
    });
    if (typeof window.observeNewRevealItems === 'function') {
      window.observeNewRevealItems(grid);
    }
  }

  function renderWorkItems(items) {
    var list = document.getElementById('work-items-list') || document.getElementById(' work-items-list');
    if (!list || !Array.isArray(items) || items.length === 0) return;
    if (list.id !== 'work-items-list') list.id = 'work-items-list';
    list.innerHTML = '';
    items.forEach(function (item, idx) {
      var isReverse = (idx % 2 === 1);
      var card = document.createElement('div');
      card.className = 'border border-border-hairline bg-surface-slate/60 p-6 lg:p-8 flex flex-col ' + (isReverse ? 'lg:flex-row-reverse' : 'lg:flex-row') + ' gap-8 items-stretch group hover:border-primary-container/60 hover:shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all duration-300 reveal-item';

      var videoBtn = item.videoUrl ?
        '<a class="group/btn inline-flex items-center gap-2 px-5 py-2.5 bg-surface-pitch border border-primary-container text-on-surface font-label-mono-sm text-label-mono-sm uppercase hover:bg-primary-container hover:text-on-surface hover:shadow-[0_0_15px_rgba(255,94,30,0.3)] transition-all duration-200 hover:-translate-y-0.5" href="' + item.videoUrl + '" target="_blank" rel="noopener">' +
        '<span>WATCH PRODUCTION</span>' +
        '<span class="material-symbols-outlined text-[16px] transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform">arrow_outward</span>' +
        '</a>' :
        '<span class="font-label-mono-sm text-label-mono-sm text-text-muted uppercase">// ARCHIVED CUT</span>';

      card.innerHTML =
        '<div class="lg:w-1/2 flex flex-col justify-between ' + (isReverse ? '' : 'order-2 lg:order-1') + '">' +
        '<div>' +
        '<div class="flex items-center gap-3 mb-4">' +
        '<span class="font-label-mono-lg text-label-mono-lg text-primary-container font-mono">' + String(idx + 1).padStart(2, '0') + '/</span>' +
        '<span class="px-2.5 py-0.5 bg-surface-pitch border border-border-hairline font-label-mono-sm text-label-mono-sm text-text-muted uppercase">' + (item.category || 'CINEMA') + '</span>' +
        '</div>' +
        '<h3 class="font-headline-lg text-headline-lg-mobile lg:text-headline-lg uppercase text-on-surface tracking-tight group-hover:text-primary-container transition-colors duration-300">' +
        (item.title || '') +
        '</h3>' +
        '<p class="mt-4 font-body-md text-body-md text-text-muted leading-relaxed">' +
        (item.description || '') +
        '</p>' +
        '</div>' +
        '<div class="pt-8 mt-8 border-t border-border-hairline flex flex-wrap items-center justify-between gap-4">' +
        videoBtn +
        '</div>' +
        '</div>' +
        '<div class="lg:w-1/2 ' + (isReverse ? '' : 'order-1 lg:order-2') + ' relative overflow-hidden border border-border-hairline min-h-[300px]">' +
        '<img alt="' + (item.title || 'Work thumbnail') + '" class="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700 ease-out" src="' + (item.thumbnailUrl || '') + '">' +
        '<div class="absolute inset-0 bg-surface-pitch/20 group-hover:bg-transparent transition-colors duration-500"></div>' +
        '<div class="absolute top-3 right-3 px-2 py-1 bg-surface-pitch/90 font-label-mono-sm text-label-mono-sm text-on-surface uppercase border border-border-hairline backdrop-blur-sm">' +
        '// MASTER NO. ' + String(idx + 1).padStart(2, '0') +
        '</div>' +
        '</div>';
      list.appendChild(card);
    });
    if (typeof window.observeNewRevealItems === 'function') {
      window.observeNewRevealItems(list);
    }
  }

  async function fetchDynamicPublicData() {
    if (location.protocol === 'file:') {
      console.warn('[MediaMovers] Page opened as file:// — API data cannot load. Open via http://localhost:5000/ instead.');
      return;
    }
    console.log('[MediaMovers] Fetching live data from API...');

    // 1. Fetch Members
    membersLoading = true;
    membersError = null;
    renderMembers();

    try {
      var mRes = await fetch('/api/members');
      if (mRes.ok) {
        var mData = await mRes.json();
        membersLoading = false;
        if (Array.isArray(mData)) {
          window.collectiveMembers = mData;
          renderMembers();
          console.log('[MediaMovers] ✓ Loaded ' + mData.length + ' members from API');
        } else {
          window.collectiveMembers = [];
          renderMembers();
        }
      } else {
        throw new Error('API returned status ' + mRes.status);
      }
    } catch (e) {
      membersLoading = false;
      membersError = e;
      window.collectiveMembers = [];
      console.error('[MediaMovers] Failed to load members:', e);
      renderMembers();
    }

    // 2. Fetch Work Items
    try {
      var wRes = await fetch('/api/work-items');
      if (wRes.ok) {
        var wData = await wRes.json();
        if (Array.isArray(wData) && wData.length > 0) {
          renderWorkItems(wData);
          console.log('[MediaMovers] ✓ Loaded ' + wData.length + ' work items from API');
        }
      }
    } catch (e) { console.error('[MediaMovers] Failed to load work items:', e.message); }

    // 3. Fetch Wire Photos
    try {
      var pRes = await fetch('/api/wire-photos');
      if (pRes.ok) {
        var pData = await pRes.json();
        if (Array.isArray(pData) && pData.length > 0) {
          window.wirePhotos = pData.map(function (p) {
            return {
              reelId: p.reelTag || '[ REEL ]',
              title: p.title,
              image: p.imageUrl,
              tag: '// ON THE WIRE — ' + (p.reelTag || 'LIVE FEED'),
              desc: p.description || ''
            };
          });
          renderWirePhotos();
          console.log('[MediaMovers] ✓ Loaded ' + pData.length + ' wire photos from API');
        }
      }
    } catch (e) { console.error('[MediaMovers] Failed to load wire photos:', e.message); }
  }

  function initApplicationForm() {
    var crewForm = document.getElementById('crew-apply-form');
    if (!crewForm) return;
    crewForm.addEventListener('submit', async function (ev) {
      ev.preventDefault();
      var btn = document.getElementById('apply-submit-btn');
      var statusMsg = document.getElementById('apply-form-status');
      var originalBtnText = btn ? btn.textContent : 'TRANSMIT APPLICATION';
      if (btn) {
        btn.textContent = 'TRANSMITTING...';
        btn.disabled = true;
      }

      var payload = {
        name: crewForm.elements['name'] ? crewForm.elements['name'].value : '',
        email: crewForm.elements['email'] ? crewForm.elements['email'].value : '',
        department: crewForm.elements['department'] ? crewForm.elements['department'].value : '',
        portfolioLink: crewForm.elements['portfolioLink'] ? crewForm.elements['portfolioLink'].value : '',
        message: crewForm.elements['message'] ? crewForm.elements['message'].value : ''
      };

      try {
        var response = await fetch('/api/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        var resJson = await response.json();
        if (response.ok) {
          if (statusMsg) {
            statusMsg.className = 'text-xs font-mono text-emerald-400 py-2';
            statusMsg.textContent = 'APPLICATION SUBMITTED TO CALLBOARD.';
            statusMsg.classList.remove('hidden');
          }
          crewForm.reset();
          setTimeout(function () {
            var modal = document.getElementById('apply-modal');
            if (modal) modal.classList.add('hidden');
            if (statusMsg) statusMsg.classList.add('hidden');
            if (btn) {
              btn.textContent = originalBtnText;
              btn.disabled = false;
            }
          }, 2000);
        } else {
          throw new Error(resJson.error || 'Submission failed');
        }
      } catch (error) {
        if (statusMsg) {
          statusMsg.className = 'text-xs font-mono text-red-400 py-2';
          statusMsg.textContent = 'ERR: ' + error.message;
          statusMsg.classList.remove('hidden');
        }
        if (btn) {
          btn.textContent = originalBtnText;
          btn.disabled = false;
        }
      }
    });
  }

  window.renderMembers = renderMembers;
  window.renderWirePhotos = renderWirePhotos;
  window.renderWorkItems = renderWorkItems;
  window.fetchDynamicPublicData = fetchDynamicPublicData;
  window.initApplicationForm = initApplicationForm;
})();
