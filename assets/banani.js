/* ============================================================
   BANANI THEME — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ── Horizontal scroll carousel helper ──────────────────── */
  function initScrollCarousel(trackId, prevSel, nextSel, scrollAmount) {
    const track = document.getElementById(trackId);
    if (!track) return;
    const wrap = track.closest('[class$="__track-wrap"]') || track.parentElement;
    const prev = wrap.querySelector(prevSel);
    const next = wrap.querySelector(nextSel);
    if (prev) prev.addEventListener('click', () => track.scrollBy({ left: -scrollAmount, behavior: 'smooth' }));
    if (next) next.addEventListener('click', () => track.scrollBy({ left:  scrollAmount, behavior: 'smooth' }));
  }

  /* ── Season Drops carousel ──────────────────────────────── */
  document.querySelectorAll('[id^="SeasonDropsTrack-"]').forEach(function (track) {
    initScrollCarousel(track.id,
      '.season-drops__arrow--prev',
      '.season-drops__arrow--next',
      320
    );
  });

  /* ── New Arrivals carousel ──────────────────────────────── */
  document.querySelectorAll('[id^="NewArrivalsTrack-"]').forEach(function (track) {
    initScrollCarousel(track.id,
      '.new-arrivals__arrow--prev',
      '.new-arrivals__arrow--next',
      280
    );
  });

  /* ── Luxe Loves carousel ────────────────────────────────── */
  document.querySelectorAll('[id^="LuxeLovesTrack-"]').forEach(function (track) {
    initScrollCarousel(track.id,
      '.luxe-loves__arrow--prev',
      '.luxe-loves__arrow--next',
      280
    );
  });

  /* ── Exclusive Brands carousel ──────────────────────────── */
  document.querySelectorAll('[id^="ExclBrandsTrack-"]').forEach(function (track) {
    initScrollCarousel(track.id,
      '.excl-brands__arrow--prev',
      '.excl-brands__arrow--next',
      320
    );
  });

  /* ── Brands We Love slider ──────────────────────────────── */
  document.querySelectorAll('[id^="BrandsLove-"]').forEach(function (section) {
    var sid       = section.dataset.sectionId;
    var slides    = section.querySelectorAll('.brands-love__slide');
    var dotsTop   = section.querySelectorAll('.brands-love__dot-top');
    var dotsBot   = section.querySelectorAll('.brands-love__dot-bottom');
    var prevBtn   = section.querySelector('.brands-love__nav--prev');
    var nextBtn   = section.querySelector('.brands-love__nav--next');
    var pauseBtn  = section.querySelector('.brands-love__pause');
    var offerEl   = document.getElementById('BrandsLoveOffer-' + sid);
    var footEl    = document.getElementById('BrandsLoveFootText-' + sid);
    var ctaEl     = document.getElementById('BrandsLoveFootCta-' + sid);
    var dataEl    = document.getElementById('BrandsLoveData-' + sid);
    var data      = dataEl ? JSON.parse(dataEl.textContent) : [];
    var current   = 0;
    var paused    = false;
    var timer     = null;

    function goTo(i) {
      slides[current].classList.remove('is-active');
      dotsTop[current] && dotsTop[current].classList.remove('is-active');
      dotsBot[current] && dotsBot[current].classList.remove('is-active');
      current = (i + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      dotsTop[current] && dotsTop[current].classList.add('is-active');
      dotsBot[current] && dotsBot[current].classList.add('is-active');
      if (data[current]) {
        if (offerEl) offerEl.textContent = data[current].offerText;
        if (footEl)  footEl.textContent  = data[current].footText;
        if (ctaEl)  { ctaEl.textContent = data[current].ctaLabel; ctaEl.href = data[current].ctaLink; }
      }
    }

    function startAuto() {
      clearInterval(timer);
      timer = setInterval(function () { if (!paused) goTo(current + 1); }, 5000);
    }

    dotsTop.forEach(function (d, idx) { d.addEventListener('click', function () { goTo(idx); startAuto(); }); });
    dotsBot.forEach(function (d, idx) { d.addEventListener('click', function () { goTo(idx); startAuto(); }); });
    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); startAuto(); });
    if (pauseBtn) pauseBtn.addEventListener('click', function () {
      paused = !paused;
      pauseBtn.textContent = paused ? '▶' : '⏸';
    });

    startAuto();
  });

  /* ── Exclusive Brands: apply bg image if set ────────────── */
  document.querySelectorAll('.excl-brands').forEach(function (el) {
    var bg = el.dataset.bgImage;
    if (bg) el.style.backgroundImage = 'url(' + bg + ')';
  });

  /* ── Collection Drops slider ────────────────────────────── */
  document.querySelectorAll('[id^="ColDrops-"]').forEach(function (section) {
    const slides   = section.querySelectorAll('.col-drops__slide');
    const dots     = section.querySelectorAll('.col-drops__dot');
    const prevBtn  = section.querySelector('.col-drops__arrow--prev');
    const nextBtn  = section.querySelector('.col-drops__arrow--next');
    const pauseBtn = section.querySelector('.col-drops__pause');
    let current    = 0;
    let paused     = false;
    let timer      = null;

    function goTo(i) {
      slides[current].classList.remove('is-active');
      dots[current].classList.remove('is-active');
      current = (i + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      dots[current].classList.add('is-active');
    }

    function startAuto() {
      clearInterval(timer);
      timer = setInterval(function () { if (!paused) goTo(current + 1); }, 5000);
    }

    dots.forEach(function (dot, idx) {
      dot.addEventListener('click', function () { goTo(idx); startAuto(); });
    });
    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); startAuto(); });
    if (pauseBtn) pauseBtn.addEventListener('click', function () {
      paused = !paused;
      pauseBtn.textContent = paused ? '▶' : '⏸';
    });

    startAuto();
  });

  /* ── Collection page ────────────────────────────────────── */

  // Grid toggle
  var gridBtns = document.querySelectorAll('.col-page__grid-btn');
  var grid     = document.getElementById('ColProductGrid');
  gridBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      gridBtns.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      if (grid) grid.dataset.cols = btn.dataset.cols;
    });
  });

  // Filter accordion
  document.querySelectorAll('.filter-group__toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var body = btn.nextElementSibling;
      if (!body) return;
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !isOpen);
      body.style.display = isOpen ? 'none' : '';
      btn.classList.toggle('is-collapsed', isOpen);
    });
  });

  // Filter checkboxes — navigate to filter URL
  document.querySelectorAll('.filter-group__checkbox').forEach(function (cb) {
    cb.addEventListener('change', function () {
      var url = cb.checked ? cb.dataset.filterUrl : cb.dataset.filterRemove;
      if (url) window.location.href = url;
    });
  });

  // Sort select
  var sortSel = document.getElementById('ColSort');
  if (sortSel) {
    sortSel.addEventListener('change', function () {
      var url = new URL(window.location.href);
      url.searchParams.set('sort_by', sortSel.value);
      window.location.href = url.toString();
    });
  }

  /* ── Product page ────────────────────────────────────────── */

  // Thumbnail → main image
  document.querySelectorAll('[id^="PdpThumbs-"]').forEach(function (thumbsEl) {
    var sid     = thumbsEl.id.replace('PdpThumbs-', '');
    var mainEl  = document.getElementById('PdpMainImgs-' + sid);
    if (!mainEl) return;
    var thumbs  = thumbsEl.querySelectorAll('.pdp__thumb');
    var slides  = mainEl.querySelectorAll('.pdp__main-img-slide');

    function activateSlide(idx) {
      thumbs.forEach(function (t) { t.classList.remove('is-active'); });
      slides.forEach(function (s) { s.classList.remove('is-active'); });
      if (thumbs[idx]) thumbs[idx].classList.add('is-active');
      if (slides[idx]) slides[idx].classList.add('is-active');
    }

    thumbs.forEach(function (thumb, idx) {
      thumb.addEventListener('click', function () { activateSlide(idx); });
    });

    var upBtn   = thumbsEl.querySelector('.pdp__thumbs-arrow--up');
    var dnBtn   = thumbsEl.querySelector('.pdp__thumbs-arrow--down');
    var track   = thumbsEl.querySelector('.pdp__thumbs-track');
    if (upBtn) upBtn.addEventListener('click', function () { track.scrollBy({ top: -110, behavior: 'smooth' }); });
    if (dnBtn) dnBtn.addEventListener('click', function () { track.scrollBy({ top:  110, behavior: 'smooth' }); });
  });

  // Size selection → update price
  document.querySelectorAll('[id^="PdpSizes-"]').forEach(function (sizesEl) {
    var sid      = sizesEl.id.replace('PdpSizes-', '');
    var priceEl  = document.getElementById('PdpPrice-' + sid);
    var atcBtn   = document.getElementById('PdpAddToCart-' + sid);
    var radios   = sizesEl.querySelectorAll('.pdp__size-radio');

    radios.forEach(function (radio) {
      radio.addEventListener('change', function () {
        sizesEl.querySelectorAll('.pdp__size-btn').forEach(function (b) { b.classList.remove('is-selected'); });
        radio.closest('.pdp__size-btn').classList.add('is-selected');
        if (priceEl && radio.dataset.price) priceEl.textContent = radio.dataset.price;
        if (atcBtn) {
          var avail = radio.dataset.available === 'true';
          atcBtn.disabled = !avail;
          atcBtn.textContent = avail ? 'ADD TO CART' : 'SOLD OUT';
          atcBtn.dataset.variantId = radio.dataset.variantId;
        }
      });
    });
  });

  // PDP tabs
  document.querySelectorAll('.pdp__tabs').forEach(function (tabs) {
    var btns   = tabs.querySelectorAll('.pdp__tab-btn');
    var panels = tabs.querySelectorAll('.pdp__tab-panel');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('is-active'); });
        panels.forEach(function (p) { p.classList.remove('is-active'); });
        btn.classList.add('is-active');
        var target = tabs.querySelector('[data-panel="' + btn.dataset.tab + '"]');
        if (target) target.classList.add('is-active');
      });
    });
  });

  // More details toggle
  document.querySelectorAll('[id^="PdpMoreDetails-"]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var sid    = btn.id.replace('PdpMoreDetails-', '');
      var detail = document.getElementById('PdpDetails-' + sid);
      if (!detail) return;
      detail.classList.toggle('is-expanded');
      btn.textContent = detail.classList.contains('is-expanded') ? '– HIDE DETAILS' : '+ MORE DETAILS';
    });
  });

  // Similar styles scroll
  document.querySelectorAll('[id^="PdpSimilarTrack-"]').forEach(function (track) {
    var wrap = track.closest('.pdp__similar-wrap');
    if (!wrap) return;
    var prev = wrap.querySelector('.pdp__similar-arrow--prev');
    var next = wrap.querySelector('.pdp__similar-arrow--next');
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -290, behavior: 'smooth' }); });
    if (next) next.addEventListener('click', function () { track.scrollBy({ left:  290, behavior: 'smooth' }); });
  });

  // Add to cart (basic — connects to Shopify AJAX cart API)
  document.querySelectorAll('[id^="PdpAddToCart-"]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var variantId = btn.dataset.variantId;
      if (!variantId) return;
      btn.textContent = 'ADDING...';
      btn.disabled = true;
      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: variantId, quantity: 1 })
      })
      .then(function (r) { return r.json(); })
      .then(function () {
        btn.textContent = '✓ ADDED TO CART';
        setTimeout(function () {
          btn.textContent = 'ADD TO CART';
          btn.disabled = false;
        }, 2000);
      })
      .catch(function () {
        btn.textContent = 'ADD TO CART';
        btn.disabled = false;
      });
    });
  });

})();
