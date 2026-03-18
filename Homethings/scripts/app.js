/**
 * B Corp Certification Widget
 * CDN: https://cdn.jsdelivr.net/gh/hostdigitaldata/b-corp@main/widget.js
 *
 * Configure by setting window.BCORP_CONFIG before this script loads.
 * See snippet.html for example usage.
 */
(function () {
  'use strict';

  var CDN_BASE = 'https://cdn.jsdelivr.net/gh/hostdgtl/b-corp-outreach@main/b-corp-main/assets/';

  // Inject Google Fonts if not already present
  if (!document.querySelector('link[href*="fonts.googleapis.com/css2"][href*="Inter"]')) {
    var fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    document.head.appendChild(fontLink);
  }

  // Default config — clients override via window.BCORP_CONFIG
  var defaults = {
    brandName: 'Homethings',
    brandLogo: CDN_BASE + 'Homethings-Logo.png',
    bcorpLogo: CDN_BASE + 'b-corp-logo.png',
    overallScore: 99.4,
    certificationDate: 'February 2022',
    qualifyingScore: 80,
    medianScore: 50.9,
    governance: 17.6,
    workers: 24.0,
    community: 12.3,
    environment: 40.3,
    customers: 5.0,
    profileUrl: 'https://www.bcorporation.net/en-us/find-a-b-corp/company/homethings/'
  };

  var cfg = Object.assign({}, defaults, window.BCORP_CONFIG || {});

  // Helper: compute bar width as percentage of 40 (max category score)
  function barWidth(score) {
    return Math.min((score / 40) * 100, 100).toFixed(1) + '%';
  }

  var container = document.getElementById('bcorp-widget');
  if (!container) {
    console.error('B Corp Widget: #bcorp-widget element not found.');
    return;
  }

  // Info icon SVG (reused)
  var infoIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';

  container.innerHTML =
    '<div class="bcorp-widget">' +
      // ---- Trigger Badge ----
      '<button class="bcorp-trigger" id="bcorp-trigger" aria-label="View B Corp certification details" aria-expanded="false" aria-controls="bcorp-modal">' +
        '<div class="bcorp-trigger__logo-wrapper">' +
          '<img class="bcorp-trigger__logo" src="' + cfg.bcorpLogo + '" alt="B Corp Logo">' +
        '</div>' +

        // Desktop content
        '<div class="bcorp-trigger__content bcorp-trigger__content--desktop">' +
          '<span class="bcorp-trigger__title">Proudly a part of B Corp</span>' +
          '<span class="bcorp-trigger__description">Kind to people, planet, and animals</span>' +
          '<span class="bcorp-trigger__learn-more">Learn more' +
            '<svg class="bcorp-trigger__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>' +
          '</span>' +
        '</div>' +

        // Mobile content
        '<div class="bcorp-trigger__content bcorp-trigger__content--mobile">' +
          '<span class="bcorp-trigger__score-label">B Impact Score</span>' +
          '<span class="bcorp-trigger__score" data-target="' + cfg.overallScore + '">' + cfg.overallScore + '</span>' +
        '</div>' +

        '<div class="bcorp-trigger__cta bcorp-trigger__cta--mobile">' +
          '<span class="bcorp-trigger__cta-text">Learn More' +
            '<svg class="bcorp-trigger__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>' +
          '</span>' +
        '</div>' +

        '<div class="bcorp-trigger__brand-wrapper">' +
          '<div class="bcorp-trigger__brand-logo">' +
            '<img src="' + cfg.brandLogo + '" alt="' + cfg.brandName + '">' +
          '</div>' +
        '</div>' +
      '</button>' +

      // ---- Modal ----
      '<div class="bcorp-modal-overlay" id="bcorp-modal" role="dialog" aria-modal="true" aria-labelledby="bcorp-modal-title">' +
        '<div class="bcorp-modal">' +

          // Header
          '<header class="bcorp-modal__header">' +
            '<img class="bcorp-modal__logo" src="' + cfg.bcorpLogo + '" alt="B Corp Logo">' +
            '<div class="bcorp-modal__header-content">' +
              '<h2 class="bcorp-modal__title" id="bcorp-modal-title">Certified B Corporation</h2>' +
              '<p class="bcorp-modal__subtitle">Since ' + cfg.certificationDate +
                '<svg class="bcorp-modal__subtitle-check" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#22c55e"/><path d="M8 12l2.5 2.5L16 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
              '</p>' +
            '</div>' +
            '<button class="bcorp-modal__close" id="bcorp-close" aria-label="Close modal">' +
              '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
            '</button>' +
          '</header>' +

          // Description
          '<div class="bcorp-modal__description">B Corps are businesses verified to meet high standards of social and environmental performance, transparency, and accountability.</div>' +

          // Score section
          '<div class="bcorp-score-section"><div class="bcorp-score-section__inner">' +
            '<div class="bcorp-progress-ring" style="--progress: ' + cfg.overallScore + '">' +
              '<svg class="bcorp-progress-ring__svg" viewBox="0 0 100 100"><circle class="bcorp-progress-ring__bg" cx="50" cy="50" r="47"></circle><circle class="bcorp-progress-ring__progress" cx="50" cy="50" r="47"></circle></svg>' +
              '<div class="bcorp-progress-ring__content"><span class="bcorp-progress-ring__score">' + cfg.overallScore + '</span><span class="bcorp-progress-ring__label">Overall<br>Score</span></div>' +
            '</div>' +
            '<div class="bcorp-benchmarks">' +
              '<div class="bcorp-benchmark">' +
                '<svg class="bcorp-benchmark__info" ' + infoIcon.slice(4) +
                '<div class="bcorp-benchmark__value">' + cfg.qualifyingScore + '</div>' +
                '<div class="bcorp-benchmark__label">Qualifying</div>' +
                '<span class="bcorp-tooltip">The minimum score required to become a Certified B Corporation.</span>' +
              '</div>' +
              '<div class="bcorp-benchmark">' +
                '<svg class="bcorp-benchmark__info" ' + infoIcon.slice(4) +
                '<div class="bcorp-benchmark__value">' + cfg.medianScore + '</div>' +
                '<div class="bcorp-benchmark__label">Median</div>' +
                '<span class="bcorp-tooltip">The typical score for ordinary businesses taking the B Impact Assessment.</span>' +
              '</div>' +
            '</div>' +
          '</div></div>' +

          // Breakdown
          '<div class="bcorp-breakdown">' +
            '<h3 class="bcorp-breakdown__title">Impact Area Breakdown</h3>' +
            '<div class="bcorp-breakdown__subtitle">Impact Area Breakdown' +
              '<span class="bcorp-breakdown__info" tabindex="0" aria-label="Score information">' + infoIcon +
                '<span class="bcorp-tooltip"><strong>Governance:</strong> Mission, ethics, transparency.<br><br><strong>Workers:</strong> Pay, benefits, training, ownership.<br><br><strong>Community:</strong> Suppliers, local impact, diversity.<br><br><strong>Environment:</strong> Climate, waste, resources.<br><br><strong>Customers:</strong> Product impact on wellbeing.</span>' +
              '</span>' +
            '</div>' +
            // Categories
            buildCategory('governance', 'Governance', cfg.governance, 0.2) +
            buildCategory('workers', 'Workers', cfg.workers, 0.3) +
            buildCategory('community', 'Community', cfg.community, 0.4) +
            buildCategory('environment', 'Environment', cfg.environment, 0.5) +
            buildCategory('customers', 'Customers', cfg.customers, 0.6) +
          '</div>' +

          // Proof
          '<div class="bcorp-proof">' +
            '<h4 class="bcorp-proof__title">The Proof</h4>' +
            '<div class="bcorp-proof__content">' +
              '<div class="bcorp-proof__logo"><svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M35 30h18c8 0 14 4 14 12 0 5-3 9-8 11 6 1 10 6 10 12 0 9-7 14-16 14H35V30zm18 20c5 0 8-2 8-7s-3-7-8-7H42v14h11zm2 22c5 0 9-2 9-8s-4-8-9-8H42v16h13z" fill="currentColor"/></svg></div>' +
              '<div class="bcorp-proof__text">' +
                '<p class="bcorp-proof__heading">Certified by B Lab</p>' +
                '<p class="bcorp-proof__description">B Lab is the nonprofit network transforming the global economy to benefit all people, communities, and the planet.</p>' +
                '<a href="' + cfg.profileUrl + '" target="_blank" rel="noopener noreferrer" class="bcorp-proof__link">See Proof<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></a>' +
              '</div>' +
            '</div>' +
          '</div>' +

        '</div>' +
      '</div>' +
    '</div>';

  function buildCategory(key, label, score, delay) {
    return '<div class="bcorp-category bcorp-category--' + key + '">' +
      '<div class="bcorp-category__header"><span class="bcorp-category__name">' + label + '</span><span class="bcorp-category__score">' + score + '</span></div>' +
      '<div class="bcorp-category__bar"><div class="bcorp-category__fill" style="--width: ' + barWidth(score) + '; --delay: ' + delay + 's"></div></div>' +
    '</div>';
  }

  // Move modal overlay to document.body so it escapes any stacking context
  // (e.g. Shopify themes where <main> has position:relative + z-index)
  var modalOverlay = container.querySelector('.bcorp-modal-overlay');
  if (modalOverlay) {
    document.body.appendChild(modalOverlay);

    // Set CSS custom properties directly on the overlay element so they're
    // available to all descendants regardless of stylesheet caching or
    // host theme interference.
    var props = {
      '--bcorp-primary': '#1a472a',
      '--bcorp-primary-light': '#2d5a3d',
      '--bcorp-accent': '#8bc34a',
      '--bcorp-accent-light': '#c5e1a5',
      '--bcorp-bg': '#ffffff',
      '--bcorp-bg-secondary': '#f8f9fa',
      '--bcorp-text': '#1a1a1a',
      '--bcorp-text-muted': '#6c757d',
      '--bcorp-border': '#e0e0e0',
      '--bcorp-shadow': '0 4px 20px rgba(0, 0, 0, 0.1)',
      '--bcorp-radius': '12px',
      '--bcorp-radius-sm': '8px',
      '--bcorp-font': "'Inter var', 'Inter', ui-sans-serif, system-ui, sans-serif",
      '--bcorp-governance': '#1a472a',
      '--bcorp-workers': '#2d6a4f',
      '--bcorp-community': '#40916c',
      '--bcorp-environment': '#52b788',
      '--bcorp-customers': '#74c69d'
    };
    for (var p in props) {
      if (props.hasOwnProperty(p)) modalOverlay.style.setProperty(p, props[p]);
    }
  }

  // ---- Interactivity ----
  var trigger = document.getElementById('bcorp-trigger');
  var modal = document.getElementById('bcorp-modal');
  var closeBtn = document.getElementById('bcorp-close');

  function openModal() {
    modal.classList.add('active');
    trigger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('active');
    trigger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    trigger.focus();
  }

  trigger.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });

  // Counter animation for the mobile score
  function animateCounter(element, target, duration) {
    duration = duration || 1500;
    var startTime = performance.now();
    function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }
    function update(currentTime) {
      var elapsed = currentTime - startTime;
      var progress = Math.min(elapsed / duration, 1);
      element.textContent = (target * easeOutQuart(progress)).toFixed(1);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  var scoreElement = container.querySelector('.bcorp-trigger__score');
  if (scoreElement) {
    var target = parseFloat(scoreElement.dataset.target) || cfg.overallScore;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(scoreElement, target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    observer.observe(scoreElement);
  }
})();
