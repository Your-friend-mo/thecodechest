window.getCouponAvailability = function(couponId) {
    const STORAGE_KEY = 'coupon_availability';
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const data = JSON.parse(stored);
    const couponData = data.coupons?.[couponId];
    return couponData?.count || null;
};
// Utility functions
const utils = {
    formatNumber: (num) => new Intl.NumberFormat().format(num),
    truncateText: (text, length) => {
        return text.length > length ? text.substring(0, length) + '...' : text;
    },
    escapeHtml: (str) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },
    decodeHtmlEntities: (text) => {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        return textarea.value;
    },
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    validateSearchQuery: (query) => {
        return typeof query === 'string' && query.trim().length >= 1;
    }
};

// Coupon Uses Counter Class
class CouponUsesCounter {
    constructor() {
        this.STORAGE_KEY = 'coupon_uses_today';
        this.DAY_IN_MS = 24 * 60 * 60 * 1000;
        this.initialize();
    }

    initialize() {
        if (document.querySelector('.uses-today')) {
            this.updateUsesDisplay();
        }
        if (document.querySelector('.total-uses-today')) {
            this.updateTotalUses();
        }
    }

    initializeUsesCount() {
        let stored = localStorage.getItem(this.STORAGE_KEY);
        let usesData;

        if (stored) {
            usesData = JSON.parse(stored);
            if (this.isDataExpired(usesData.timestamp)) {
                usesData = this.createNewUsesData();
            }
        } else {
            usesData = this.createNewUsesData();
        }

        return usesData;
    }

    isDataExpired(timestamp) {
        const now = new Date();
        const stored = new Date(timestamp);
        return now.toDateString() !== stored.toDateString();
    }

    createNewUsesData() {
        return {
            timestamp: new Date().toISOString(),
            uses: {}
        };
    }

    getRandomUses() {
        const base = Math.floor(Math.random() * 50) + 20;
        const variation = Math.floor(Math.random() * 30) - 15;
        return Math.max(5, base + variation);
    }
    updateTotalUses() {
        const usesData = this.initializeUsesCount();
        const totalUsesElement = document.querySelector('.total-uses-today');
        
        if (totalUsesElement) {
            // Get only the coupon IDs that are displayed on the current page
            const visibleCouponIds = Array.from(document.querySelectorAll('.uses-today'))
                .map(el => el.dataset.couponId);
            
            // Sum up uses only for visible coupons
            const total = visibleCouponIds.reduce((sum, couponId) => {
                return sum + (usesData.uses[couponId] || 0);
            }, 0);
    
            this.animateCount(totalUsesElement, total);
        }
    }
    updateUsesDisplay() {
        const usesData = this.initializeUsesCount();
        const elements = document.querySelectorAll('.uses-today');

        elements.forEach(element => {
            const couponId = element.dataset.couponId;
            const countElement = element.querySelector('.uses-count');

            if (!usesData.uses[couponId]) {
                usesData.uses[couponId] = this.getRandomUses();
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usesData));
            }

            this.animateCount(countElement, usesData.uses[couponId]);
        });

        this.updateTotalUses();
    }
    
    animateCount(element, target) {
        let current = 0;
        const duration = 1000;
        const start = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);

            current = Math.floor(target * progress);
            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    }
}

// Stats Counter Class
class StatsCounter {
    constructor() {
        this.initialize();
    }

    initialize() {
        document.querySelectorAll('.stat-counter').forEach(counter => {
            this.animateCounter(counter);
        });
    }

    animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };

        updateCounter();
    }
}

// Live Search Class - High Performance, International & Typo-Tolerant
class LiveSearch {
    constructor() {
        this.form = document.getElementById('searchForm');
        this.input = document.getElementById('searchInput');
        this.dropdown = document.getElementById('searchDropdown');
        this.loader = this.form ? this.form.querySelector('.search-loader') : null;
        this.searchIcon = this.loader ? this.loader.querySelector('.bi-search') : null;
        this.spinner = this.loader ? this.loader.querySelector('.spinner-border') : null;
        
        this.debounceTimeout = null;
        this.minChars = 1;
        this.baseUrl = document.querySelector('meta[name="base-url"]')?.content || window.location.origin;
        this.activeItem = null;
        this.couponsData = null;
        this.isBrandPage = window.location.pathname.includes('/brand/');
        this.rootPrefix = this.isBrandPage ? '../' : '';

        this.acronyms = {
            'gta': 'grand theft auto',
            'gta 6': 'grand theft auto 6',
            'gta6': 'grand theft auto 6',
            'gta vi': 'grand theft auto 6',
            'gtavi': 'grand theft auto 6',
            'ps': 'playstation',
            'ps5': 'playstation',
            'ps4': 'playstation',
            'ps plus': 'ps plus discount codes',
            'ps store': 'ps store gift card',
            'psn': 'playstation ps plus ps store',
            'xgpu': 'xbox game pass ultimate',
            'gamepass': 'xbox game pass',
            'game pass': 'xbox game pass',
            're': 'resident evil',
            'cod': 'call of duty',
            'ai': 'openai chatgpt gemini',
            'gpt': 'chatgpt openai',
            'vbucks': 'fortnite v bucks',
            'v bucks': 'fortnite v bucks',
            'robux': 'roblox robux'
        };

        if (this.input && this.dropdown) {
            this.initialize();
            this.preloadData();
        }
    }

    async preloadData() {
        if (window.__THECODECHEST_SEARCH_DATA) {
            this.couponsData = window.__THECODECHEST_SEARCH_DATA;
            return;
        }
        try {
            const res = await fetch(`${this.rootPrefix}api/all_coupons.json`);
            if (res.ok) {
                this.couponsData = await res.json();
                window.__THECODECHEST_SEARCH_DATA = this.couponsData;
            }
        } catch (e) {
            console.warn('Preload search error:', e);
        }
    }

    initialize() {
        if (this.loader) {
            this.loader.classList.remove('d-none');
        }

        // Low-latency debounce (120ms) for snappy, instantaneous feel
        this.input.addEventListener('input', utils.debounce(() => {
            this.performSearch();
        }, 120));

        // Re-open on focus if query exists
        this.input.addEventListener('focus', () => {
            if (this.input.value.trim().length >= 1) {
                this.performSearch();
            }
        });

        // Form submit handler: execute selection on Enter
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                const activeItem = this.dropdown.querySelector('.search-item.active') || this.dropdown.querySelector('.search-item');
                if (activeItem) {
                    activeItem.click();
                }
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (this.form && !this.form.contains(e.target)) {
                this.hideDropdown();
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideDropdown();
                this.input.blur();
            }
        });

        // Add keyboard navigation
        this.addKeyboardNavigation();
    }

    normalize(text) {
        if (!text) return '';
        return String(text)
            .normalize('NFD')
            .replace(/[̀-ͯ]/g, '') // strip diacritics / accents
            .toLowerCase()
            .replace(/[+]/g, ' plus ')
            .replace(/[&]/g, ' and ')
            .replace(/[\$€£¥₹]/g, '')
            .replace(/[^a-z0-9\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    levenshtein(s1, s2) {
        if (s1.length < s2.length) return this.levenshtein(s2, s1);
        if (s2.length === 0) return s1.length;
        let prev = Array.from({ length: s2.length + 1 }, (_, i) => i);
        for (let i = 0; i < s1.length; i++) {
            let curr = [i + 1];
            for (let j = 0; j < s2.length; j++) {
                let ins = prev[j + 1] + 1;
                let del = curr[j] + 1;
                let sub = prev[j] + (s1[i] === s2[j] ? 0 : 1);
                curr.push(Math.min(ins, del, sub));
            }
            prev = curr;
        }
        return prev[s2.length];
    }

    scoreMatch(query, text) {
        const qn = this.normalize(query);
        const tn = this.normalize(text);
        if (!qn || !tn) return 0;

        // Single character: strict prefix match on title or word start
        if (qn.length === 1) {
            if (tn.startsWith(qn)) return 1000;
            const words = tn.split(' ');
            for (const w of words) {
                if (w.startsWith(qn)) return 800;
            }
            return 0;
        }

        // Acronym match
        if (this.acronyms[qn] && (tn.includes(this.acronyms[qn]) || this.acronyms[qn].includes(tn))) {
            return 950;
        }

        // Exact match
        if (qn === tn) return 1000;

        // Full prefix match
        if (tn.startsWith(qn)) return 850;

        // Word start match
        const words = tn.split(' ');
        for (const w of words) {
            if (w.startsWith(qn)) return 750;
        }

        // Substring match
        if (tn.includes(qn)) return 500;

        // Word-level fuzzy match (typo tolerance)
        const qWords = qn.split(' ');
        let matchedQWords = 0;
        for (const qw of qWords) {
            let qwMatched = false;
            for (const tw of words) {
                if (tw.startsWith(qw) || tw.includes(qw)) {
                    qwMatched = true;
                    break;
                }
                if (qw.length >= 3 && tw.length >= 3) {
                    const maxDist = qw.length <= 4 ? 1 : (qw.length <= 8 ? 2 : 3);
                    if (this.levenshtein(qw, tw) <= maxDist) {
                        qwMatched = true;
                        break;
                    }
                }
            }
            if (qwMatched) matchedQWords++;
        }

        if (matchedQWords === qWords.length && qWords.length > 0) {
            return 400;
        } else if (matchedQWords > 0) {
            return 200 * (matchedQWords / qWords.length);
        }

        return 0;
    }

    executeClientSearch(query) {
        if (!this.couponsData) return { brands: [], coupons: [] };

        const brandsMap = {};
        const coupons = Object.values(this.couponsData);

        coupons.forEach(c => {
            if (c.brand_id && !brandsMap[c.brand_id]) {
                brandsMap[c.brand_id] = {
                    id: c.brand_id,
                    brand_name: c.brand_name,
                    brand_logo: c.brand_logo,
                    coupon_count: 1
                };
            } else if (c.brand_id) {
                brandsMap[c.brand_id].coupon_count++;
            }
        });

        const scoredCoupons = [];
        const scoredBrands = [];

        // Score coupons
        coupons.forEach(c => {
            const sTitle = this.scoreMatch(query, c.coupon_title);
            const sBrand = this.scoreMatch(query, c.brand_name);
            const sIncent = this.scoreMatch(query, c.coupon_short_incent);
            const sDesc = this.scoreMatch(query, c.coupon_short_description);
            const bestScore = Math.max(sTitle, sBrand, sIncent, sDesc);
            if (bestScore > 0) {
                scoredCoupons.push({ coupon: c, score: bestScore });
            }
        });

        // Score brands
        Object.values(brandsMap).forEach(b => {
            let s = this.scoreMatch(query, b.brand_name);
            // Association: if any high-scoring coupon belongs to this brand, boost brand score
            const topCouponForBrand = scoredCoupons.find(sc => sc.coupon.brand_id === b.id);
            if (topCouponForBrand && topCouponForBrand.score >= 300) {
                s = Math.max(s, topCouponForBrand.score - 50);
            }
            if (s > 0) {
                scoredBrands.push({ brand: b, score: s });
            }
        });

        // Boost coupons of matched brands
        scoredBrands.forEach(sb => {
            coupons.forEach(c => {
                if (c.brand_id === sb.brand.id) {
                    const existing = scoredCoupons.find(sc => sc.coupon.id === c.id);
                    if (existing) {
                        existing.score = Math.max(existing.score, sb.score);
                    } else if (sb.score >= 600) {
                        scoredCoupons.push({ coupon: c, score: sb.score - 50 });
                    }
                }
            });
        });

        scoredCoupons.sort((a, b) => b.score - a.score);
        scoredBrands.sort((a, b) => b.score - a.score);

        return {
            brands: scoredBrands.map(sb => sb.brand).slice(0, 5),
            coupons: scoredCoupons.map(sc => sc.coupon).slice(0, 10)
        };
    }

    async performSearch() {
        const query = this.input.value.trim();
        
        if (!utils.validateSearchQuery(query)) {
            this.hideDropdown();
            this.hideLoading();
            return;
        }
    
        this.showLoading();
    
        try {
            if (!this.couponsData) {
                await this.preloadData();
            }

            let data;
            if (this.couponsData) {
                data = this.executeClientSearch(query);
            } else {
                // Fallback to fetch router
                const searchUrl = `${this.rootPrefix}search?q=${encodeURIComponent(query)}`;
                const response = await fetch(searchUrl, {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': 'application/json'
                    }
                });
                if (!response.ok) throw new Error(`HTTP status: ${response.status}`);
                data = await response.json();
            }
            
            this.updateDropdown(data, query);
        } catch (error) {
            console.error('Search error:', error);
            this.showError();
        } finally {
            this.hideLoading();
        }
    }

    showLoading() {
        if (!this.loader) return;
        this.loader.classList.add('is-searching');
        if (this.spinner) this.spinner.classList.remove('d-none');
        if (this.searchIcon) this.searchIcon.classList.add('d-none');
    }

    hideLoading() {
        if (!this.loader) return;
        this.loader.classList.remove('is-searching');
        if (this.spinner) this.spinner.classList.add('d-none');
        if (this.searchIcon) this.searchIcon.classList.remove('d-none');
    }

    showError() {
        this.dropdown.innerHTML = `
            <div class="search-empty">
                <i class="bi bi-exclamation-circle"></i>
                <p class="m-0 text-third">An error occurred. Please try again.</p>
            </div>`;
        this.dropdown.classList.add('show');
    }

    updateDropdown(data, query) {
        const { brands = [], coupons = [] } = data;
        
        if (brands.length === 0 && coupons.length === 0) {
            const noTitle = (window.searchTranslations && window.searchTranslations.noResultsTitle) || "No Results Found";
            const noDesc = (window.searchTranslations && window.searchTranslations.noResultsDesc) || "Try adjusting your search terms";
            this.dropdown.innerHTML = `
                <div class="search-empty">
                    <i class="bi bi-search"></i>
                    <p class="m-0 text-third">${noTitle}</p>
                    <p class="small text-third mt-1">${noDesc}</p>
                </div>`;
            this.dropdown.classList.add('show');
            return;
        }

        let html = '';

        // Brands section
        if (brands.length > 0) {
            html += `
                <div class="search-section">
                    <div class="search-section-title">Brands</div>
                    ${brands.map(brand => this.renderBrandItem(brand)).join('')}
                </div>`;
        }

        // Coupons section
        if (coupons.length > 0) {
            html += `
                <div class="search-section">
                    <div class="search-section-title">Coupons</div>
                    ${coupons.map(coupon => this.renderCouponItem(coupon)).join('')}
                </div>`;
        }

        this.dropdown.innerHTML = html;
        this.dropdown.classList.add('show');

        // Add click handlers for coupon items
        this.dropdown.querySelectorAll('.search-coupon-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const couponId = item.dataset.couponId;
                if (window.Alpine && window.Alpine.store('couponModal')) {
                    window.Alpine.store('couponModal').open(parseInt(couponId));
                    this.hideDropdown();
                } else {
                    window.location.href = `${this.rootPrefix}index.html?coupon=${couponId}`;
                }
            });
        });
    }

    renderBrandItem(brand) {
        const brandHref = `${this.rootPrefix}brand/${brand.id}.html`;
        const logoSrc = brand.brand_logo 
            ? `${this.rootPrefix}public/${brand.brand_logo}` 
            : `${this.rootPrefix}public/assets/uploads/favicons/favicon_694c73bfce2a5.png`;
        const fallbackLogo = `${this.rootPrefix}public/assets/uploads/favicons/favicon_694c73bfce2a5.png`;

        return `
            <a href="${brandHref}" class="search-item">
                <img src="${logoSrc}" 
                    alt="${utils.escapeHtml(brand.brand_name || 'Brand Logo')}"
                    class="search-item-image rounded-2"
                    loading="lazy"
                    onerror="this.onerror=null; this.src='${fallbackLogo}';">
                <div class="search-item-content">
                    <div class="search-item-title">${utils.escapeHtml(brand.brand_name || '')}</div>
                    <div class="search-item-subtitle">
                        ${parseInt(brand.coupon_count || 1).toLocaleString()} Coupons
                    </div>
                </div>
            </a>`;
    }

    renderCouponItem(coupon) {
        return `
            <a href="#" class="search-item search-coupon-item" data-coupon-id="${coupon.id}">
                <div class="search-item-content">
                    <div class="search-item-title">${utils.decodeHtmlEntities(coupon.coupon_title || '')}</div>
                    <div class="search-item-subtitle">
                        ${coupon.brand_name ? utils.decodeHtmlEntities(coupon.brand_name) + ' • ' : ''}
                        ${utils.decodeHtmlEntities(coupon.coupon_short_incent || '')}
                    </div>
                </div>
            </a>`;
    }

    addKeyboardNavigation() {
        this.input.addEventListener('keydown', (e) => {
            if (!this.dropdown.classList.contains('show')) return;
            
            const items = this.dropdown.querySelectorAll('.search-item');
            const current = this.dropdown.querySelector('.search-item.active');
            
            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    if (!current) {
                        this.setActiveItem(items[0]);
                    } else {
                        const next = [...items].indexOf(current) + 1;
                        if (items[next]) {
                            this.setActiveItem(items[next]);
                        }
                    }
                    break;
                    
                case 'ArrowUp':
                    e.preventDefault();
                    if (current) {
                        const prev = [...items].indexOf(current) - 1;
                        if (prev >= 0) {
                            this.setActiveItem(items[prev]);
                        } else {
                            this.clearActiveItem();
                            this.input.focus();
                        }
                    }
                    break;
                    
                case 'Enter':
                    e.preventDefault();
                    if (current) {
                        current.click();
                    } else if (items.length > 0) {
                        items[0].click();
                    }
                    break;
                
                case 'Escape':
                    this.hideDropdown();
                    this.input.blur();
                    break;
            }
        });
    }

    setActiveItem(element) {
        this.clearActiveItem();
        element?.classList.add('active');
        this.activeItem = element;
        
        // Ensure the active item is visible in the dropdown
        if (element) {
            element.scrollIntoView({ block: 'nearest' });
        }
    }

    clearActiveItem() {
        this.activeItem?.classList.remove('active');
        this.activeItem = null;
    }

    hideDropdown() {
        this.dropdown.classList.remove('show');
        this.clearActiveItem();
    }
}


class CouponAvailability {
    constructor() {
        if (!document.querySelector('.coupons-remaining-wrapper')) {
            return;
        }

        const settingsElement = document.querySelector('meta[name="appearance-settings"]');
        const settings = settingsElement ? JSON.parse(settingsElement.content) : {};
        
        this.MIN_COUPONS = parseInt(settings.available_coupons_min) || 20;
        this.MAX_COUPONS = parseInt(settings.available_coupons_max) || 120;

        this.STORAGE_KEY = 'coupon_availability';
        this.UPDATE_INTERVAL = 20000; // Base interval (20 seconds)
        this.VARIANCE = 10000; // Random variance (+/- 10 seconds)
        this.intervals = new Map(); // Store intervals for each coupon
        this.initialize();
    }

    initialize() {
        // Clean expired data first
        this.cleanExpiredData();
        
        // Initialize for all coupon elements on the page
        document.querySelectorAll('.coupons-remaining-wrapper').forEach(wrapper => {
            const couponId = wrapper.dataset.couponId;
            this.initializeCoupon(couponId, wrapper);
        });
    }

    initializeCoupon(couponId, wrapper) {
        // Find the count element
        const countElement = wrapper.matches('.count') ? 
            wrapper : 
            wrapper.querySelector('.count');
            
        if (!countElement) return;

        // Check if this coupon has a fixed count set
        const fixedCount = wrapper.dataset.fixedCount;
        if (fixedCount !== undefined && fixedCount !== '') {
            // Fixed count is set - just display it without any countdown logic
            countElement.textContent = parseInt(fixedCount);
            return; // Skip all the dynamic countdown logic
        }

        let availabilityData = this.getAvailabilityData();
        let couponData = availabilityData.coupons[couponId];

        // Initialize if not exists or expired
        if (!couponData || this.isExpired(couponData.timestamp)) {
            couponData = {
                count: this.generateInitialCount(),
                timestamp: new Date().getTime(),
                lastUpdate: new Date().getTime()
            };
            availabilityData.coupons[couponId] = couponData;
            this.saveAvailabilityData(availabilityData);
        }

        // Update display
        this.updateDisplay(couponId, countElement);

        // Set up interval for this coupon if not already running
        if (!this.intervals.has(couponId)) {
            const interval = setInterval(() => {
                this.updateCouponCount(couponId, countElement);
            }, this.getRandomInterval());
            this.intervals.set(couponId, interval);
        }
    }

    getAvailabilityData() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (!stored) {
            return { 
                timestamp: new Date().getTime(), 
                coupons: {} 
            };
        }

        const data = JSON.parse(stored);
        // Check if data is expired
        if (this.isExpired(data.timestamp)) {
            const newData = { 
                timestamp: new Date().getTime(), 
                coupons: {} 
            };
            this.saveAvailabilityData(newData);
            return newData;
        }

        return data;
    }

    saveAvailabilityData(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }

    generateInitialCount() {
        return Math.max(1, Math.floor(Math.random() * (this.MAX_COUPONS - this.MIN_COUPONS + 1)) + this.MIN_COUPONS);
    }

    getRandomInterval() {
        return this.UPDATE_INTERVAL + (Math.random() * this.VARIANCE - this.VARIANCE / 2);
    }

    isExpired(timestamp) {
        const now = new Date().getTime();
        const hours24 = 24 * 60 * 60 * 1000;
        return (now - timestamp) > hours24;
    }

    updateCouponCount(couponId, element) {
        const data = this.getAvailabilityData();
        const couponData = data.coupons[couponId];
        
        if (!couponData) return;

        // Only update if current count is greater than 1
        if (couponData.count > 1 && Math.random() < 0.7) { // 70% chance to decrease
            const newCount = Math.max(1, couponData.count - 1);
            couponData.count = newCount;
            couponData.lastUpdate = new Date().getTime();
            
            this.saveAvailabilityData(data);
            
            // Update all elements with this coupon ID
            this.updateAllCountElements(couponId);

            // If count reaches 1, stop the interval
            if (newCount === 1) {
                if (this.intervals.has(couponId)) {
                    clearInterval(this.intervals.get(couponId));
                    this.intervals.delete(couponId);
                }
            }
        }
    }

    updateAllCountElements(couponId) {
        // Find all elements that need updating
        const countElements = document.querySelectorAll(`[data-coupon-id="${couponId}"]`);
        countElements.forEach(wrapper => {
            // Find the count element within the wrapper
            const countElement = wrapper.matches('.count') ? 
                wrapper : 
                wrapper.querySelector('.count');
                
            if (countElement) {
                this.updateDisplay(couponId, countElement);
            }
        });

        // Dispatch event for Alpine.js components
        const data = this.getAvailabilityData();
        const couponData = data.coupons[couponId];
        
        if (couponData) {
            window.dispatchEvent(new CustomEvent('couponCountUpdated', {
                detail: { 
                    couponId, 
                    count: couponData.count,
                    timestamp: new Date().getTime()
                }
            }));
        }
    }

    updateDisplay(couponId, element) {
        const data = this.getAvailabilityData();
        const couponData = data.coupons[couponId];
        
        if (!couponData || !element) return;
    
        // Add animation class
        element.classList.add('updating');
        
        // Update the text content
        element.textContent = couponData.count;
        
        // Remove animation class after animation completes
        setTimeout(() => {
            element.classList.remove('updating');
        }, 300);
    }

    cleanExpiredData() {
        const data = this.getAvailabilityData();
        let hasChanges = false;

        // Check if the main timestamp is expired
        if (this.isExpired(data.timestamp)) {
            // Reset everything if main data is expired
            data.timestamp = new Date().getTime();
            data.coupons = {};
            hasChanges = true;
        } else {
            // Check individual coupons
            Object.entries(data.coupons).forEach(([couponId, couponData]) => {
                if (this.isExpired(couponData.timestamp)) {
                    delete data.coupons[couponId];
                    hasChanges = true;

                    // Clear any existing interval
                    if (this.intervals.has(couponId)) {
                        clearInterval(this.intervals.get(couponId));
                        this.intervals.delete(couponId);
                    }
                }
            });
        }

        if (hasChanges) {
            this.saveAvailabilityData(data);
        }
    }

    // Cleanup method to clear intervals when needed (e.g., page unload)
    destroy() {
        this.intervals.forEach(interval => clearInterval(interval));
        this.intervals.clear();
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize main components
    new CouponUsesCounter();
    new StatsCounter();
    new LiveSearch();

    // Handle coupon card clicks
    document.querySelectorAll('.coupon-card-link').forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const couponId = this.dataset.couponId;
            console.log('Show coupon:', couponId);
        });
    });
    
    const couponAvailability = new CouponAvailability();

    // Cleanup on page unload
    window.addEventListener('unload', () => {
        couponAvailability.destroy();
    });
});
// Export utilities globally
window.utils = utils;
