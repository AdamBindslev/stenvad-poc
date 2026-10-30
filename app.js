/**
 * Mosebrugsudstilling - Proof of Concept
 * Hovedlogik: Hotspots, Video Lightbox, Kiosk & PWA håndtering
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Referencer
  const hotspotsLayer = document.getElementById('hotspots-layer');
  const modal = document.getElementById('video-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBadge = document.getElementById('modal-point-badge');
  const modalDesc = document.getElementById('modal-description');
  const videoContainer = document.getElementById('video-container');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  const onlineStatusDot = document.querySelector('.status-dot');
  const onlineStatusText = document.querySelector('.status-text');

  let idleTimer = null;

  // 1. Render Hotspots på kortet
  function renderHotspots() {
    hotspotsLayer.innerHTML = '';

    EXHIBITION_CONFIG.locations.forEach((loc) => {
      const button = document.createElement('button');
      button.className = 'hotspot-node';
      button.style.setProperty('--x', loc.x);
      button.style.setProperty('--y', loc.y);
      button.setAttribute('aria-label', `${loc.title} - Tryk for at se video`);
      button.setAttribute('title', loc.title);
      button.dataset.id = loc.id;

      button.innerHTML = `
        <div class="hotspot-ring"></div>
        <div class="hotspot-ring ring-delay"></div>
        <div class="hotspot-core">
          <svg viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <div class="hotspot-label">${loc.title}</div>
      `;

      button.addEventListener('click', (e) => {
        e.stopPropagation();
        openVideoModal(loc);
      });

      hotspotsLayer.appendChild(button);
    });
  }

  // 2. Åbn Video Lightbox Modal
  function openVideoModal(locationData) {
    modalTitle.textContent = locationData.title;
    modalBadge.textContent = `Punkt ${locationData.number}`;
    modalDesc.textContent = locationData.description || '';

    // Ryd eksisterende indhold
    videoContainer.innerHTML = '';

    const videoConfig = locationData.video;

    if (videoConfig.type === 'youtube') {
      if (navigator.onLine) {
        // Embed YouTube med YouTube-nocookie for privatliv og autoplay
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube-nocookie.com/embed/${videoConfig.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
        iframe.title = locationData.title;
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowFullscreen = true;
        videoContainer.appendChild(iframe);
      } else {
        // Offline besked hvis internet mangler og lokal video ikke er valgt endnu
        videoContainer.innerHTML = `
          <div class="video-offline-notice">
            <h3>Ingen internetforbindelse</h3>
            <p>Denne Proof of Concept afspiller video via YouTube, som kræver internetadgang.<br><br>
            Til den endelige udstilling kan videoerne lægges som lokale MP4-filer i <code>assets/videos/</code>, så systemet fungerer 100% offline.</p>
          </div>
        `;
      }
    } else if (videoConfig.type === 'local') {
      // HTML5 lokal video
      const videoEl = document.createElement('video');
      videoEl.src = videoConfig.localSrc;
      videoEl.controls = true;
      videoEl.autoplay = true;
      videoEl.playsInline = true;
      videoContainer.appendChild(videoEl);
    }

    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
    resetIdleTimer();
  }

  // 3. Luk Video Lightbox Modal
  function closeVideoModal() {
    if (!modal.classList.contains('is-active')) return;

    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');

    // VIGTIGT: Tøm videoContainer med det samme for øjeblikkeligt at stoppe lydafspilning!
    setTimeout(() => {
      videoContainer.innerHTML = '';
    }, 200);
  }

  // Luk ved klik på luk-knap eller uden for modal-kortet
  modalCloseBtn.addEventListener('click', closeVideoModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeVideoModal();
    }
  });

  // Tastaturnavigation (ESC lukker video)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-active')) {
      closeVideoModal();
    }
  });

  // 4. Kiosk Fuldskærmshåndtering
  function toggleFullscreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch(err => console.log('Fullscreen error:', err));
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => console.log('Exit fullscreen error:', err));
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  function updateFullscreenUI() {
    const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement);
    const expandIcon = fullscreenBtn.querySelector('.icon-expand');
    const compressIcon = fullscreenBtn.querySelector('.icon-compress');
    const label = fullscreenBtn.querySelector('.btn-label');

    if (isFullscreen) {
      expandIcon.style.display = 'none';
      compressIcon.style.display = 'inline-block';
      label.textContent = 'Forlad fuld';
    } else {
      expandIcon.style.display = 'inline-block';
      compressIcon.style.display = 'none';
      label.textContent = 'Fuld skærm';
    }
  }

  fullscreenBtn.addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', updateFullscreenUI);
  document.addEventListener('webkitfullscreenchange', updateFullscreenUI);

  // 5. Inaktivitets-timer (Auto-reset til udstillingskiosk)
  function resetIdleTimer() {
    if (idleTimer) clearTimeout(idleTimer);
    const timeoutSec = EXHIBITION_CONFIG.kiosk.idleTimeoutSeconds;
    if (timeoutSec && timeoutSec > 0) {
      idleTimer = setTimeout(() => {
        // Hvis der ikke er rørt ved skærmen i X sekunder, lukkes videoen
        closeVideoModal();
      }, timeoutSec * 1000);
    }
  }

  // Nulstil timer ved interaktion
  ['touchstart', 'mousedown', 'mousemove', 'keydown'].forEach(evt => {
    document.addEventListener(evt, resetIdleTimer, { passive: true });
  });

  // 6. Deaktiver højreklik/context menu hvis konfigureret (for at hindre publikum i at åbne browser-menuer)
  if (EXHIBITION_CONFIG.kiosk.preventContextMenu) {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      return false;
    });
  }

  // 7. Netværks- og PWA-status
  function updateNetworkStatus() {
    if (navigator.onLine) {
      onlineStatusDot.className = 'status-dot online';
      onlineStatusText.textContent = 'Online';
    } else {
      onlineStatusDot.className = 'status-dot offline';
      onlineStatusText.textContent = 'Offline';
    }
  }

  window.addEventListener('online', updateNetworkStatus);
  window.addEventListener('offline', updateNetworkStatus);
  updateNetworkStatus();

  // Registrer Service Worker for PWA
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => {
          console.log('ServiceWorker registreret med succes:', reg.scope);
        })
        .catch((err) => {
          console.warn('ServiceWorker registrering fejlede (kører måske via file://):', err);
        });
    });
  }

  // Tilpas kortstørrelse præcist til den tilgængelige plads så hotspots altid sidder 100% perfekt
  function fitMapStage() {
    const viewport = document.querySelector('.map-viewport');
    const stage = document.getElementById('map-stage');
    if (!viewport || !stage) return;

    // Træk en smule padding fra så kortet aldrig rører kanten
    const paddingX = 16;
    const paddingY = 16;
    const availW = Math.max(0, viewport.clientWidth - paddingX);
    const availH = Math.max(0, viewport.clientHeight - paddingY);

    const targetRatio = 1024 / 796;
    const currentRatio = availW / availH;

    if (currentRatio > targetRatio) {
      // Højden er den begrænsende faktor
      const h = availH;
      const w = Math.round(h * targetRatio);
      stage.style.width = `${w}px`;
      stage.style.height = `${h}px`;
    } else {
      // Bredden er den begrænsende faktor
      const w = availW;
      const h = Math.round(w / targetRatio);
      stage.style.width = `${w}px`;
      stage.style.height = `${h}px`;
    }
  }

  window.addEventListener('resize', fitMapStage);
  window.addEventListener('orientationchange', () => setTimeout(fitMapStage, 100));

  // Initialiser
  fitMapStage();
  renderHotspots();
  resetIdleTimer();
});
