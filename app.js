(() => {
  const ITEMS_PER_PAGE = 12;
  const MIN_CODES_LEFT = 150;
  const MAX_CODES_LEFT = 400;

  // State
  let currentPage = 1;
  let activeModalCoupon = null;
  const brandUserRatings = {};

  // DOM References
  const htmlEl = document.documentElement;
  const bodyEl = document.body;
  const homeView = document.getElementById("homeView");
  const brandView = document.getElementById("brandView");
  const couponsGrid = document.getElementById("couponsGrid");
  const paginationNav = document.getElementById("paginationNav");
  const popularBrandsList = document.getElementById("popularBrandsList");
  const brandSidebar = document.getElementById("brandSidebar");
  const brandMainContent = document.getElementById("brandMainContent");

  // Search DOM
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const searchDropdown = document.getElementById("searchDropdown");

  // Theme Toggle DOM
  const themeToggle = document.getElementById("themeToggle");

  // Modal DOM
  const modalOverlay = document.getElementById("couponModalOverlay");
  const modalHeaderBg = document.getElementById("modalHeaderBg");
  const modalBrandLogo = document.getElementById("modalBrandLogo");
  const modalBrandLink = document.getElementById("modalBrandLink");
  const modalCouponTitle = document.getElementById("modalCouponTitle");
  const modalBadges = document.getElementById("modalBadges");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalIncentiveTitle = document.getElementById("modalIncentiveTitle");
  const modalIncentiveSub = document.getElementById("modalIncentiveSub");
  const modalRating = document.getElementById("modalRating");
  const modalRatingCount = document.getElementById("modalRatingCount");
  const modalUsesToday = document.getElementById("modalUsesToday");
  const modalExpires = document.getElementById("modalExpires");
  const modalExpiresLabel = document.getElementById("modalExpiresLabel");
  const modalDetailsContent = document.getElementById("modalDetailsContent");
  const modalRevealContainer = document.getElementById("modalRevealContainer");
  const modalCodeSuffix = document.getElementById("modalCodeSuffix");
  const modalRevealBtn = document.getElementById("modalRevealBtn");
  const modalRevealedBox = document.getElementById("modalRevealedBox");
  const modalFullCode = document.getElementById("modalFullCode");
  const modalCopyBtn = document.getElementById("modalCopyBtn");

  // Shared Inline SVG Icons
  const ICONS = {
    star: `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>`,
    starOutline: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>`,
    ticket: `<svg class="ticket-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5v2"/><path d="M15 11v2"/><path d="M15 17v2"/><path d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2Z"/></svg>`,
    chest: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M3 12h18"/><path d="M5 8V7a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v1"/><rect x="10" y="10" width="4" height="4" rx="1"/></svg>`,
    scissors: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>`,
    clock: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    infinity: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z"/></svg>`,
    users: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    verified: `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 2.4 3.4-.5.9 3.3 3 1.7-1.1 3.2 1.1 3.2-3 1.7-.9 3.3-3.4-.5L12 22l-2.4-2.4-3.4.5-.9-3.3-3-1.7 1.1-3.2-1.1-3.2 3-1.7.9-3.3 3.4.5L12 2zm-1.2 13.4l5.2-5.2-1.4-1.4-3.8 3.8-1.6-1.6-1.4 1.4 3 3z"/></svg>`,
    verifiedOutline: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l2.2 2.2 3.1-.4.8 3 2.7 1.5-1 2.9 1 2.9-2.7 1.5-.8 3-3.1-.4L12 21l-2.2-2.2-3.1.4-.8-3-2.7-1.5 1-2.9-1-2.9 2.7-1.5.8-3 3.1.4L12 3z"/><path d="M9 12l2 2 4-4"/></svg>`
  };

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getBrand(brandId) {
    return BRANDS[brandId] || Object.values(BRANDS)[0];
  }

  function getBrandCoupons(brandId) {
    return COUPONS.filter((c) => c.brandId === Number(brandId));
  }

  // ==================== THEME TOGGLE ====================
  function applyTheme(theme) {
    htmlEl.setAttribute("data-bs-theme", theme);
    if (theme === "light") {
      bodyEl.classList.remove("theme-dark", "dark-mode");
      bodyEl.classList.add("theme-light", "light-mode");
    } else {
      bodyEl.classList.remove("theme-light", "light-mode");
      bodyEl.classList.add("theme-dark", "dark-mode");
    }
    try {
      localStorage.setItem("thecodechest-theme", theme);
    } catch (_) {}
  }

  function initTheme() {
    let saved = "dark";
    try {
      const stored = localStorage.getItem("thecodechest-theme");
      if (stored === "light" || stored === "dark") saved = stored;
    } catch (_) {}
    applyTheme(saved);

    themeToggle.addEventListener("click", () => {
      const next = htmlEl.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
    });
  }

  // ==================== HOMEPAGE CARDS ====================
  function renderHomepage(page = 1) {
    const totalPages = Math.ceil(COUPONS.length / ITEMS_PER_PAGE);
    currentPage = Math.max(1, Math.min(page, totalPages));

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const slice = COUPONS.slice(start, start + ITEMS_PER_PAGE);

    couponsGrid.innerHTML = slice
      .map((coupon, idx) => {
        const brand = getBrand(coupon.brandId);
        const expiryIcon = coupon.noExpiration ? ICONS.infinity : ICONS.clock;
        return `
          <article class="coupon-card" style="animation-delay: ${idx * 30}ms" data-coupon-id="${coupon.id}">
            <div class="banner-section">
              <img
                class="banner-image"
                src="${escapeHtml(coupon.banner)}"
                alt="${escapeHtml(coupon.title)}"
                loading="lazy"
                onerror="this.onerror=null;this.src='${coupon.fallbackBanner}'"
              />
              <span class="rating-badge" aria-label="Rating ${coupon.rating} out of 5">
                ${ICONS.star}
                <span>${escapeHtml(coupon.rating)}</span>
              </span>
              ${coupon.hot ? `<span class="hot-badge">Hot</span>` : ""}
              <a href="#/brand/${brand.id}" class="brand-logo-wrapper" title="View all ${escapeHtml(brand.name)} codes">
                <img
                  class="brand-logo-img"
                  src="${escapeHtml(brand.logo)}"
                  alt="${escapeHtml(brand.name)}"
                  loading="lazy"
                  onerror="this.onerror=null;this.src='${brand.fallbackLogo}'"
                />
              </a>
            </div>

            <div class="card-body">
              <h3 class="card-title">${escapeHtml(coupon.title)}</h3>
              <a href="#/brand/${brand.id}" class="coupon-brand-name">${escapeHtml(brand.name)}</a>

              <div class="coupon-incentive">
                <div class="coupon-incentive-inner">
                  <span class="incentive-circle start" aria-hidden="true"></span>
                  <span class="incentive-circle end" aria-hidden="true"></span>
                  <div class="incentive-text">${escapeHtml(coupon.incentive)}</div>
                  <div class="short-description-text">${escapeHtml(coupon.shortDesc)}</div>
                </div>
              </div>

              <div class="coupons-remaining-wrapper">
                <span class="coupons-remaining">
                  ${ICONS.ticket}
                  <span><span class="count" data-count-for="${coupon.id}">${coupon.codesLeft}</span> codes left</span>
                </span>
              </div>

              <button type="button" class="btn-reveal" data-open-coupon="${coupon.id}">
                ${ICONS.chest}
                <span>Get Code</span>
              </button>
            </div>

            <div class="card-footer">
              <span class="card-meta-item">
                ${expiryIcon}
                <span>${escapeHtml(coupon.expiresText)}</span>
              </span>
              <span class="card-meta-item">
                ${ICONS.users}
                <span>${coupon.usesToday} uses today</span>
              </span>
            </div>
          </article>
        `;
      })
      .join("");

    renderPagination(totalPages);
  }

  function renderPagination(totalPages) {
    let html = `
      <button type="button" class="page-btn" data-page="${currentPage - 1}" ${currentPage === 1 ? "disabled" : ""} aria-label="Previous page">&laquo;</button>
    `;
    for (let p = 1; p <= totalPages; p++) {
      html += `
        <button type="button" class="page-btn ${p === currentPage ? "active" : ""}" data-page="${p}" aria-label="Page ${p}" ${p === currentPage ? 'aria-current="page"' : ""}>${p}</button>
      `;
    }
    html += `
      <button type="button" class="page-btn" data-page="${currentPage + 1}" ${currentPage === totalPages ? "disabled" : ""} aria-label="Next page">&raquo;</button>
    `;
    paginationNav.innerHTML = html;
  }

  // ==================== BRAND DETAIL PAGE ====================
  function renderBrandPage(brandId) {
    const brand = getBrand(brandId);
    const brandCoupons = getBrandCoupons(brand.id);
    const totalUses = brandCoupons.reduce((acc, c) => acc + c.usesToday, 0);
    const currentUserRating = brandUserRatings[brand.id] || 0;
    const displayRatingCount = brand.ratingCount + (currentUserRating ? 1 : 0);

    brandSidebar.innerHTML = `
      <div class="brand-profile-card">
        <img
          class="brand-logo-large"
          src="${escapeHtml(brand.logo)}"
          alt="${escapeHtml(brand.name)}"
          onerror="this.onerror=null;this.src='${brand.fallbackLogo}'"
        />
        <h1 class="brand-profile-name">${escapeHtml(brand.name)}</h1>
        <p class="brand-profile-desc">${escapeHtml(brand.description)}</p>
      </div>

      <div class="brand-stats-grid">
        <div class="brand-stat-box">
          ${ICONS.ticket}
          <div class="brand-stat-num">${brandCoupons.length}</div>
          <div class="brand-stat-lbl">Total Codes</div>
        </div>
        <div class="brand-stat-box">
          ${ICONS.verifiedOutline}
          <div class="brand-stat-num">${brandCoupons.length}</div>
          <div class="brand-stat-lbl">Verified</div>
        </div>
        <div class="brand-stat-box">
          ${ICONS.users}
          <div class="brand-stat-num">${totalUses}</div>
          <div class="brand-stat-lbl">Uses Today</div>
        </div>
      </div>

      <div class="brand-rating-card">
        <div class="brand-rating-header">
          <span class="brand-rating-title">Rate ${escapeHtml(brand.name)}</span>
          <span class="brand-rating-summary">${brand.rating.toFixed(1)} &bull; ${displayRatingCount} ratings</span>
        </div>
        <div class="star-picker" role="group" aria-label="Rate this brand">
          ${[1, 2, 3, 4, 5]
            .map(
              (n) => `
            <button type="button" class="star-btn ${n <= currentUserRating ? "active" : ""}" data-rate-brand="${brand.id}" data-stars="${n}" aria-label="Rate ${n} stars">
              ${ICONS.starOutline}
            </button>`
            )
            .join("")}
        </div>
        ${currentUserRating ? `<div class="rating-feedback">Thanks for rating ${currentUserRating}/5!</div>` : ""}
      </div>

      <div class="brand-tips-card">
        <h3 class="brand-tips-title">Tips</h3>
        <ul class="brand-tips-list">
          <li>Click <strong>Get Code</strong> to view full redemption instructions and details.</li>
          <li>Verify your account region matches the code platform before redeeming.</li>
          <li>Check back daily—expired codes are automatically replaced with newly tested ones.</li>
        </ul>
      </div>
    `;

    brandMainContent.innerHTML = `
      <div class="brand-main-header">
        <div class="brand-main-title-group">
          <a href="#/" class="back-home-btn">&larr; All Codes</a>
          <h2 class="brand-main-heading">Available Codes</h2>
        </div>
        <span class="brand-results-count">Showing ${brandCoupons.length} ${brandCoupons.length === 1 ? "results" : "results"}</span>
      </div>

      <div class="brand-coupon-rows">
        ${brandCoupons
          .map(
            (coupon) => `
          <div class="coupon-row-card">
            <div class="row-ticket">
              <span class="incentive-circle start" aria-hidden="true"></span>
              <span class="incentive-circle end" aria-hidden="true"></span>
              <div class="row-ticket-title">${escapeHtml(coupon.incentive)}</div>
            </div>

            <div class="row-info-col">
              ${coupon.hot ? `<span class="row-hot-pill">Hot</span>` : ""}
              <h3 class="row-title">${escapeHtml(coupon.title)}</h3>
              <div class="row-subtitle">${escapeHtml(coupon.shortDesc)}</div>
            </div>

            <div class="row-meta-col">
              <div class="row-meta-line">
                <span class="row-rating-pill">${ICONS.star} ${escapeHtml(coupon.rating)}</span>
                <span>(${coupon.ratingCount} ratings)</span>
              </div>
              <div class="row-meta-line">
                ${coupon.noExpiration ? ICONS.infinity : ICONS.clock}
                <span>${escapeHtml(coupon.expiresText)}</span>
              </div>
              <div class="row-meta-line">
                ${ICONS.users}
                <span>${coupon.usesToday} uses today</span>
              </div>
              <div class="row-meta-line">
                ${ICONS.ticket}
                <span><span data-count-for="${coupon.id}">${coupon.codesLeft}</span> codes left</span>
              </div>
            </div>

            <button type="button" class="row-cta-btn" data-open-coupon="${coupon.id}">
              ${ICONS.scissors}
              <span>Get Code</span>
            </button>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }

  // ==================== FOOTER POPULAR BRANDS ====================
  function renderPopularBrands() {
    popularBrandsList.innerHTML = POPULAR_BRAND_IDS.map((id) => {
      const brand = getBrand(id);
      const count = getBrandCoupons(id).length;
      return `
        <a href="#/brand/${brand.id}" class="popular-brand-card">
          <img
            class="popular-brand-img"
            src="${escapeHtml(brand.logo)}"
            alt="${escapeHtml(brand.name)}"
            loading="lazy"
            onerror="this.onerror=null;this.src='${brand.fallbackLogo}'"
          />
          <div>
            <div class="popular-brand-name">${escapeHtml(brand.name)}</div>
            <div class="popular-brand-count">${count} ${count === 1 ? "code" : "codes"}</div>
          </div>
        </a>
      `;
    }).join("");
  }

  // ==================== LIVE SEARCH ====================
  function renderSearchResults(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      searchDropdown.classList.remove("show");
      searchDropdown.innerHTML = "";
      return;
    }

    const matchedBrands = Object.values(BRANDS)
      .filter((b) => b.name.toLowerCase().includes(q))
      .slice(0, 4);

    const matchedCoupons = COUPONS.filter((c) => {
      const brand = getBrand(c.brandId);
      return (
        c.title.toLowerCase().includes(q) ||
        c.incentive.toLowerCase().includes(q) ||
        c.shortDesc.toLowerCase().includes(q) ||
        brand.name.toLowerCase().includes(q)
      );
    }).slice(0, 6);

    if (!matchedBrands.length && !matchedCoupons.length) {
      searchDropdown.innerHTML = `<div class="search-empty">No Results Found</div>`;
      searchDropdown.classList.add("show");
      return;
    }

    let html = "";
    if (matchedBrands.length) {
      html += `<div class="search-group-label">Brands</div>`;
      html += matchedBrands
        .map((brand) => {
          const count = getBrandCoupons(brand.id).length;
          return `
            <a href="#/brand/${brand.id}" class="search-item" data-search-brand="${brand.id}">
              <img class="search-item-img" src="${escapeHtml(brand.logo)}" alt="${escapeHtml(brand.name)}" onerror="this.onerror=null;this.src='${brand.fallbackLogo}'" />
              <div class="search-item-info">
                <div class="search-item-title">${escapeHtml(brand.name)}</div>
                <div class="search-item-sub">${count} ${count === 1 ? "code" : "codes"} available</div>
              </div>
            </a>
          `;
        })
        .join("");
    }

    if (matchedCoupons.length) {
      html += `<div class="search-group-label">Coupons</div>`;
      html += matchedCoupons
        .map((coupon) => {
          const brand = getBrand(coupon.brandId);
          return `
            <button type="button" class="search-item" data-search-coupon="${coupon.id}">
              <img class="search-item-img" src="${escapeHtml(brand.logo)}" alt="${escapeHtml(brand.name)}" onerror="this.onerror=null;this.src='${brand.fallbackLogo}'" />
              <div class="search-item-info">
                <div class="search-item-title">${escapeHtml(coupon.title)}</div>
                <div class="search-item-sub">${escapeHtml(brand.name)} &bull; ${escapeHtml(coupon.incentive)}</div>
              </div>
            </button>
          `;
        })
        .join("");
    }

    searchDropdown.innerHTML = html;
    searchDropdown.classList.add("show");
  }

  function closeSearchDropdown() {
    searchDropdown.classList.remove("show");
  }

  // ==================== MODAL ====================
  function openCouponModal(couponId) {
    const coupon = COUPONS.find((c) => c.id === Number(couponId));
    if (!coupon) return;
    activeModalCoupon = coupon;
    const brand = getBrand(coupon.brandId);

    modalHeaderBg.style.backgroundImage = `url("${coupon.banner}"), url("${coupon.fallbackBanner}")`;
    modalBrandLogo.src = brand.logo;
    modalBrandLogo.alt = brand.name;
    modalBrandLogo.onerror = () => {
      modalBrandLogo.onerror = null;
      modalBrandLogo.src = brand.fallbackLogo;
    };

    modalBrandLink.textContent = brand.name;
    modalBrandLink.href = `#/brand/${brand.id}`;
    modalCouponTitle.textContent = coupon.title;

    modalBadges.innerHTML = `
      ${coupon.hot ? `<span class="modal-pill">Hot</span>` : ""}
      <span class="modal-pill">${ICONS.ticket} <span data-count-for="${coupon.id}">${coupon.codesLeft}</span> codes left</span>
      <span class="modal-pill">${ICONS.verified} Verified</span>
    `;

    modalIncentiveTitle.textContent = coupon.incentive;
    modalIncentiveSub.textContent = coupon.shortDesc;

    modalRating.textContent = coupon.rating;
    modalRatingCount.textContent = `${coupon.ratingCount} Ratings`;
    modalUsesToday.textContent = coupon.usesToday;
    modalExpires.textContent = coupon.expiresValue;
    modalExpiresLabel.textContent = coupon.expiresLabel;
    modalDetailsContent.innerHTML = coupon.detailsHtml;

    const suffix = coupon.code.slice(-4);
    modalCodeSuffix.textContent = `••••••••${suffix}`;
    modalFullCode.textContent = coupon.code;
    modalRevealContainer.hidden = false;
    modalRevealedBox.hidden = true;
    modalCopyBtn.textContent = "Copy Code";
    modalCopyBtn.classList.remove("copied");

    modalOverlay.hidden = false;
    modalOverlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeCouponModal() {
    modalOverlay.hidden = true;
    modalOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    activeModalCoupon = null;
  }

  // ==================== LIVE STOCK COUNTER TICKER ====================
  function startStockTicker() {
    setInterval(() => {
      const randomCoupon = COUPONS[Math.floor(Math.random() * COUPONS.length)];
      if (!randomCoupon) return;

      if (randomCoupon.codesLeft > MIN_CODES_LEFT) {
        randomCoupon.codesLeft -= 1;
      } else {
        randomCoupon.codesLeft = Math.floor(Math.random() * (MAX_CODES_LEFT - 260)) + 260;
      }

      const nodes = document.querySelectorAll(`[data-count-for="${randomCoupon.id}"]`);
      nodes.forEach((node) => {
        node.textContent = randomCoupon.codesLeft;
        node.classList.add("updating");
        setTimeout(() => node.classList.remove("updating"), 450);
      });
    }, 4500);
  }

  // ==================== HASH ROUTER ====================
  function handleRoute() {
    const hash = window.location.hash || "#/";
    const brandMatch = hash.match(/^#\/brand\/(\d+)$/);
    const pageMatch = hash.match(/^#\/page\/(\d+)$/);

    closeSearchDropdown();

    if (brandMatch) {
      const brandId = Number(brandMatch[1]);
      homeView.hidden = true;
      brandView.hidden = false;
      renderBrandPage(brandId);
      window.scrollTo({ top: 0, behavior: "instant" });
    } else {
      brandView.hidden = true;
      homeView.hidden = false;
      const targetPage = pageMatch ? Number(pageMatch[1]) : currentPage;
      renderHomepage(targetPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // ==================== EVENT LISTENERS ====================
  function bindEvents() {
    // Delegate clicks on cards, pagination, brand rating, and modal triggers
    document.addEventListener("click", (e) => {
      const openBtn = e.target.closest("[data-open-coupon]");
      if (openBtn) {
        openCouponModal(openBtn.getAttribute("data-open-coupon"));
        return;
      }

      const pageBtn = e.target.closest("[data-page]");
      if (pageBtn && !pageBtn.disabled) {
        const nextPage = Number(pageBtn.getAttribute("data-page"));
        window.location.hash = nextPage === 1 ? "#/" : `#/page/${nextPage}`;
        return;
      }

      const rateBtn = e.target.closest("[data-rate-brand]");
      if (rateBtn) {
        const bId = Number(rateBtn.getAttribute("data-rate-brand"));
        const stars = Number(rateBtn.getAttribute("data-stars"));
        brandUserRatings[bId] = stars;
        renderBrandPage(bId);
        return;
      }

      const searchCouponBtn = e.target.closest("[data-search-coupon]");
      if (searchCouponBtn) {
        const cId = searchCouponBtn.getAttribute("data-search-coupon");
        closeSearchDropdown();
        openCouponModal(cId);
        return;
      }

      if (!e.target.closest(".search-wrapper")) {
        closeSearchDropdown();
      }
    });

    // Search input
    searchInput.addEventListener("input", (e) => {
      renderSearchResults(e.target.value);
    });

    searchInput.addEventListener("focus", () => {
      if (searchInput.value.trim()) {
        renderSearchResults(searchInput.value);
      }
    });

    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      renderSearchResults(searchInput.value);
    });

    // Modal controls
    modalCloseBtn.addEventListener("click", closeCouponModal);
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeCouponModal();
    });
    modalBrandLink.addEventListener("click", () => {
      closeCouponModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (!modalOverlay.hidden) closeCouponModal();
        closeSearchDropdown();
      }
    });

    modalRevealBtn.addEventListener("click", () => {
      modalRevealContainer.hidden = true;
      modalRevealedBox.hidden = false;
      if (activeModalCoupon) {
        activeModalCoupon.usesToday += 1;
        modalUsesToday.textContent = activeModalCoupon.usesToday;
      }
    });

    modalCopyBtn.addEventListener("click", async () => {
      if (!activeModalCoupon) return;
      try {
        await navigator.clipboard.writeText(activeModalCoupon.code);
      } catch (_) {
        const temp = document.createElement("textarea");
        temp.value = activeModalCoupon.code;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        temp.remove();
      }
      modalCopyBtn.textContent = "Copied!";
      modalCopyBtn.classList.add("copied");
      setTimeout(() => {
        modalCopyBtn.textContent = "Copy Code";
        modalCopyBtn.classList.remove("copied");
      }, 2000);
    });

    window.addEventListener("hashchange", handleRoute);
  }

  // ==================== INIT ====================
  initTheme();
  renderPopularBrands();
  bindEvents();
  handleRoute();
  startStockTicker();
})();
