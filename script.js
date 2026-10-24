const supabaseUrl = 'https://gyggowcnigjrnnezgbjx.supabase.co';
const supabaseKey = 'sb_publishable_nKPiVuznJMIv1KCJMy_fJA_AKBIbttG';
const db = supabase.createClient(supabaseUrl, supabaseKey);

console.log("Supabase connected successfully!");


(function () {
    "use strict";

    const LondonApp = {
        products: [],           // Full product list (set below)
        filteredProducts: [],   // Currently visible products
        currentCategory: "all",
        currentSearch: "",
        currentLanguage: "en",
        translations: {},       // Filled below
    };

    // Expose on window so Parts 2 and 3 can read/write shared state
    window.LondonApp = LondonApp;

    const STORAGE_KEY_LANGUAGE = "london_language";

    LondonApp.translations = {
        en: {
            // Announcement
            "announcement.promo": "🚚 Free delivery on orders over 2000 ETB — Shop now and save!",

            // Search
            "search.label": "Search products",
            "search.placeholder": "Search phones, earbuds, accessories…",
            "search.button": "Submit search",

            // Language
            "language.label": "Select language",

            // Navigation
            "nav.home": "Home",
            "nav.phones": "Phones",
            "nav.tablets": "Tablets",
            "nav.earbuds": "Earbuds ",
            "nav.headsets": "Headsets",
            "nav.accessories": "Accessories",
            "nav.contact": "Contact",

            // Hero
            "hero.headline": "Welcome to London (ለንደን) — Your Mobile Shop",
            "hero.subtitle": "Discover phones, tablets, earbuds, and accessories — all in one place. Quality products, honest service, delivered to your door.",
            "hero.cta": "Shop Now",
            "hero.imageAlt": "Collection of mobile phones and accessories",

            // Categories
            "category.heading": "Shop by Category",
            "category.phones.name": "Phones",
            "category.phones.link": "Explore Phones →",
            "category.tablets.name": "Tablets",
            "category.tablets.link": "Explore Tablets →",
            "category.earbuds.name": "Earbuds",
            "category.earbuds.link": "Explore Earbuds →",
 "category.headsets.name": "Headsets",
            "category.headsets.link": "Explore Headsets →",
            "category.chargers.name": "Chargers & Cables",
            "category.chargers.link": "Explore Chargers & Cables →",
            "category.cases.name": "Phone Cases",
            "category.cases.link": "Explore Phone Cases →",
            "category.screenProtectors.name": "Screen Protectors",
            "category.screenProtectors.link": "Explore Screen Protectors →",

            // Featured products
            "featured.heading": "Featured Products",
            "product.pricePlaceholder": "Price to be set (ETB)",
            "product.inStock": "In Stock",
            "product.outOfStock": "Out of Stock",
            "product.addToCart": "Add to Cart",
            "product.noResults": "No products match your search. Try another keyword or category.",

            // Promo
            "promo.heading": "Special Offers & Discounts",
            "promo.text": "Limited-time deals on phones, accessories, and more. Check back often for new promotions.",
            "promo.cta": "Explore Offers",
        },

        am: {
            // Announcement
            "announcement.promo": "🚚 ከ2000 ብር በላይ ግዢ ላይ ነፃ ማድረስ — ይግዙ እና ይቆጥቡ!",

            // Search
            "search.label": "ምርቶችን ይፈልጉ",
            "search.placeholder": "ስልኮች፣ ጆሮ ማዳመጫዎች፣ መለዋወጫዎች… ይፈልጉ",
            "search.button": "ፍለጋን አስገባ",

            // Language
            "language.label": "ቋንቋ ይምረጡ",

            // Navigation
            "nav.home": "መነሻ",
            "nav.phones": "ስልኮች",
            "nav.tablets": "ታብሌቶች",
            "nav.earbuds": "ጆሮ ማዳመጫዎች",
            "nav.headsets": "ሄድሴቶች",
            "nav.accessories": "መለዋወጫዎች",
            "nav.contact": "ያግኙን",

            // Hero
            "hero.headline": "ወደ ለንደን እንኳን ደህና መጡ — የሞባይል ሱቅዎ",
            "hero.subtitle": "ስልኮች፣ ታብሌቶች፣ ጆሮ ማዳመጫዎች እና መለዋወጫዎች — በአንድ ቦታ። ጥራት ያለው ምርት፣ ታማኝ አገልግሎት፣ እስከ ቤትዎ ድረስ።",
            "hero.cta": "አሁን ይግዙ",
            "hero.imageAlt": "የሞባይል ስልኮች እና መለዋወጫዎች ስብስብ",

            // Categories
            "category.heading": "በምድብ ይግዙ",
            "category.phones.name": "ስልኮች",
            "category.phones.link": "ስልኮችን ያስሱ →",
            "category.tablets.name": "ታብሌቶች",
            "category.tablets.link": "ታብሌቶችን ያስሱ →",
            "category.earbuds.name": "ጆሮ ማዳመጫዎች",
            "category.earbuds.link": "ጆሮ ማዳመጫዎችን ያስሱ →",
            "category.headsets.name": "ሄድሴቶች",
            "category.headsets.link": "ሄድሴቶችን ያስሱ →",
            "category.chargers.name": "ቻርጀሮች እና ኬብሎች",
            "category.chargers.link": "ቻርጀሮችን እና ኬብሎችን ያስሱ →",
            "category.cases.name": "የስልክ መያዣዎች",
            "category.cases.link": "የስልክ መያዣዎችን ያስሱ →",
            "category.screenProtectors.name": "የስክሪን መከላከያዎች",
            "category.screenProtectors.link": "የስክሪን መከላከያዎችን ያስሱ →",

            // Featured products
            "featured.heading": "ተመራጭ ምርቶች",
            "product.pricePlaceholder": "ዋጋ በቅርቡ ይታወቃል (ብር)",
            "product.inStock": "በክምችት አለ",
            "product.outOfStock": "ከክምችት ውጪ",
            "product.addToCart": "ወደ ጋሪ ጨምር",
            "product.noResults": "ከፍለጋዎ ጋር የሚዛመድ ምርት አልተገኘም። ሌላ ቃል ወይም ምድብ ይሞክሩ።",

            // Promo
            "promo.heading": "ልዩ ቅናሾች",
            "promo.text": "በስልኮች፣ በመለዋወጫዎች እና በሌሎችም ላይ የተወሰነ ጊዜ ቅናሾች። ለአዲስ ቅናሾች በየጊዜው ይመልከቱ።",
            "promo.cta": "ቅናሾችን ያስሱ",
        },

        om: {
            // Announcement
            "announcement.promo": "🚚 Ajaja 2000 ETB ol ta'e irratti geejjiba bilisa — Amma bitadhaa, qusadhaa!",

            // Search
            "search.label": "Oomishaalee barbaadi",
            "search.placeholder": "Bilbila, earbuds, meeshaalee… barbaadi",
            "search.button": "Barbaachisaa galchi",

            // Language
            "language.label": "Afaan filadhu",
        // Navigation
            "nav.home": "Fuula Duraa",
            "nav.phones": "Bilbilaalee",
            "nav.tablets": "Tableetiiwwan",
            "nav.earbuds": "Gurra Dhaggeeffattuu",
            "nav.headsets": "Heedsetiiwwan",
            "nav.accessories": "Meeshaalee Dabalataa",
            "nav.contact": "Nu Qunnabaa",

            // Hero
            "hero.headline": "Baga gara London (ለንደን) dhuftan — Suuqii Bilbilaa Keessan",
            "hero.subtitle": "Bilbilaalee, tableetiiwwan, gurra dhaggeeffattuu fi meeshaalee dabalataa — bakka tokkotti. Oomisha qulqullina qabu, tajaajila amanamaa, hanga mana keessaniitti.",
            "hero.cta": "Amma Bitadhaa",
            "hero.imageAlt": "Walitti qabama bilbilaalee fi meeshaalee",

            // Categories
            "category.heading": "Ramaddiin Bitadhaa",
            "category.phones.name": "Bilbilaalee",
            "category.phones.link": "Bilbilaalee Ilaalaa →",
            "category.tablets.name": "Tableetiiwwan",
            "category.tablets.link": "Tableetiiwwan Ilaalaa →",
            "category.earbuds.name": "Gurra Dhaggeeffattuu",
            "category.earbuds.link": "Gurra Dhaggeeffattuu Ilaalaa →",
            "category.headsets.name": "Heedsetiiwwan",
            "category.headsets.link": "Heedsetiiwwan Ilaalaa →",
            "category.chargers.name": "Chaarjarii fi Keebilii",
            "category.chargers.link": "Chaarjarii fi Keebilii Ilaalaa →",
            "category.cases.name": "Qeensa Bilbilaa",
            "category.cases.link": "Qeensa Bilbilaa Ilaalaa →",
            "category.screenProtectors.name": "Eegduu Skiriinii",
            "category.screenProtectors.link": "Eegduu Skiriinii Ilaalaa →",

            // Featured products
            "featured.heading": "Oomishaalee Filatamaa",
            "product.pricePlaceholder": "Gatii yeroo booda murtaa'a (ETB)",
            "product.inStock": "Kuusaa keessa jira",
            "product.outOfStock": "Kuusaa keessa hin jiru",
            "product.addToCart": "Gaarii keessa galchi",
            "product.noResults": "Barbaacha keessan waliin walsimu oomisha hin argamne. Jecha yookaan ramaddii biraa yaalaa.",

            // Promo
            "promo.heading": "Gatiin Guddaa fi Hir'isaa",
            "promo.text": "Bilbilaalee, meeshaalee fi kanneen biroo irratti gatii yeroo murtaa'e. Yeroo yeroon hir'isaawwan haaraa ilaalaa.",
            "promo.cta": "Hir'isaawwan Ilaalaa",
        },
    };


    /* ============================================================
       3. SAMPLE PRODUCT DATA (DEMONSTRATION ONLY)
       ------------------------------------------------------------
       ⚠️ These are DEMO products — NOT real inventory.
       Replace this array with data from Supabase in production.

       Each product:
         id        — unique string (matches data-product-id in HTML)
         name      — display name
         category  — one of: phones, tablets, earbuds, headsets,
                     chargers, cases, screenProtectors
         image     — image path (placeholder for now)
         price     — number OR null if not yet set
         currency  — "ETB"
         inStock   — boolean
       ============================================================ */
   // We start with an empty array. The database will fill this up!
LondonApp.products = [];
LondonApp.filteredProducts = [];

// This function fetches the real products from Supabase
async function fetchProducts() {
    console.log("Fetching products from database...");
    
    const { data, error } = await db.from('products').select('*');
    
    if (error) {
        console.error("Error fetching products:", error);
        return;
    }

    LondonApp.products = data.map(product => {
     let cat = 'accessories';
// Use the Category ID from the database
const catId = Number(product.category_id);
if (catId === 1) cat = 'phones';
if (catId === 2) cat = 'tablets';
if (catId === 3) cat = 'earbuds';
if (catId === 4) cat = 'headsets';
if (catId === 5) cat = 'chargers';
if (catId === 6) cat = 'cases';
if (catId === 7) cat = 'screenProtectors';

        return {
            id: product.id.toString(),
            name: product.name,
            name_am: product.name_am,
            name_om: product.name_om,
            category: cat,
            image: product.image_url,
            price: product.price,
            currency: "ETB",
            inStock: product.in_stock
        };
    });
    
    LondonApp.filteredProducts = LondonApp.products.slice();
    renderProducts();
    console.log("Real products loaded and mapped:", LondonApp.products);
}
    /* ============================================================
       4. UTILITY HELPERS
       ============================================================ */
    function $(selector, root) {
        return (root || document).querySelector(selector);
    }

    function $all(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    /**
     * Translate a key. Falls back to English, then to the key itself.
     * Never returns "undefined".
     */
    function t(key) {
        const lang = LondonApp.currentLanguage;
        const dict = LondonApp.translations[lang] || {};
        const fallback = LondonApp.translations.en || {};
        if (typeof dict[key] === "string") return dict[key];
        if (typeof fallback[key] === "string") return fallback[key];
        return key;
    }

    /**
     * Safe text setter — never injects HTML from untrusted data.
     */
    function setText(el, text) {
        if (el) el.textContent = text;
    }


    /* ============================================================
       5. LANGUAGE SWITCHING + PERSISTENCE
       ============================================================ */
    function loadSavedLanguage() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY_LANGUAGE);
            if (saved && LondonApp.translations[saved]) return saved;
        } catch (e) {
            /* localStorage may be blocked — ignore silently */
        }
        return "en";
    }

    function saveLanguage(lang) {
        try {
            localStorage.setItem(STORAGE_KEY_LANGUAGE, lang);
        } catch (e) {
            /* ignore */
        }
    }

    /**
     * Apply translations to every element carrying data-i18n,
     * data-i18n-placeholder, data-i18n-aria-label, or data-i18n-alt.
     */
    function applyTranslations() {
        // Text content
        $all("[data-i18n]").forEach(function (el) {
            const key = el.getAttribute("data-i18n");
            setText(el, t(key));
        });

        // Placeholders
        $all("[data-i18n-placeholder]").forEach(function (el) {
            const key = el.getAttribute("data-i18n-placeholder");
            el.setAttribute("placeholder", t(key));
        });

        // ARIA labels
        $all("[data-i18n-aria-label]").forEach(function (el) {
            const key = el.getAttribute("data-i18n-aria-label");
            el.setAttribute("aria-label", t(key));
        });

        // Image alt attributes
        $all("[data-i18n-alt]").forEach(function (el) {
            const key = el.getAttribute("data-i18n-alt");
            el.setAttribute("alt", t(key));
        });

        // Update <html lang="…">
        document.documentElement.setAttribute("lang", LondonApp.currentLanguage);
    }

    function setLanguage(lang) {
        if (!LondonApp.translations[lang]) lang = "en";
        LondonApp.currentLanguage = lang;
        saveLanguage(lang);
        applyTranslations();

        // Re-render products so labels reflect the new language
        renderProducts();
    }

    function initLanguageSelector() {
        const select = $("#language-select");
        if (!select) return;

        // Restore saved language
        const saved = loadSavedLanguage();
        LondonApp.currentLanguage = saved;
        select.value = saved;

        // Apply translations on load
        applyTranslations();
 // Single change listener — no duplicates
        select.addEventListener("change", function (event) {
            setLanguage(event.target.value);
        });
    }


    /* ============================================================
       6. PRODUCT RENDERING
       ------------------------------------------------------------
       Builds product cards safely using document.createElement
       and textContent — no innerHTML with product data.
       ============================================================ */
    function createProductCard(product) {
        const card = document.createElement("article");
        card.className = "product-card";
        card.setAttribute("data-product-id", product.id);

        // Image
        const img = document.createElement("img");
        img.className = "product-image";
        img.src = product.image;
        img.alt = product.name;
        img.width = 250;
        img.height = 250;
        img.loading = "lazy";
        card.appendChild(img);

        // Info wrapper
        const info = document.createElement("div");
        info.className = "product-info";

        // Name
       // Name
const name = document.createElement("h3");
name.className = "product-name";

// Safely pick the right language
let displayName = product.name;
if (LondonApp.currentLanguage === 'am' && product.name_am) displayName = product.name_am;
if (LondonApp.currentLanguage === 'om' && product.name_om) displayName = product.name_om;

name.textContent = displayName;
        info.appendChild(name);

        // Price — must NEVER invent a real price
        const price = document.createElement("p");
        price.className = "product-price";
        if (typeof product.price === "number" && product.price > 0) {
            price.textContent = formatPrice(product.price, product.currency);
        } else {
            price.textContent = t("product.pricePlaceholder");
        }
        info.appendChild(price);

        // Stock status
        const stock = document.createElement("p");
        stock.className = "product-stock " + (product.inStock ? "in-stock" : "out-of-stock");
        stock.textContent = product.inStock ? t("product.inStock") : t("product.outOfStock");
        info.appendChild(stock);

        // Add to Cart button
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "add-to-cart-button";
        btn.setAttribute("data-product-id", product.id);
        btn.setAttribute("aria-label", t("product.addToCart") + ": " + product.name);
        btn.textContent = t("product.addToCart");
        if (!product.inStock) btn.disabled = true;
        info.appendChild(btn);

        card.appendChild(info);
        return card;
    }

    function formatPrice(value, currency) {
        // Simple integer-thousand formatting — placeholder until real prices exist
        const formatted = value.toLocaleString("en-US", { maximumFractionDigits: 2 });
        return formatted + " " + (currency || "ETB");
    }

    function renderProducts() {
        const grid = $(".products-grid");
        if (!grid) return;

        // Clear previous cards (safe — no HTML insertion)
        while (grid.firstChild) grid.removeChild(grid.firstChild);

        if (!LondonApp.filteredProducts.length) {
            const empty = document.createElement("p");
            empty.className = "product-no-results";
            empty.style.gridColumn = "1 / -1";
            empty.style.textAlign = "center";
            empty.style.padding = "2rem";
            empty.style.color = "var(--color-text-muted)";
            empty.textContent = t("product.noResults");
            grid.appendChild(empty);
            return;
        }

        const fragment = document.createDocumentFragment();
        LondonApp.filteredProducts.forEach(function (product) {
            fragment.appendChild(createProductCard(product));
        });
        grid.appendChild(fragment);
    }


    /* ============================================================
       7. SEARCH FILTERING
       ============================================================ */
function applyFilters() {
    const search = LondonApp.currentSearch.trim().toLowerCase();
    const category = LondonApp.currentCategory;

    LondonApp.filteredProducts = LondonApp.products.filter(function (p) {
        let matchesCategory = false;
        
        if (category === "all") {
            matchesCategory = true;
        } else if (category === "accessories") {
            // Group the accessories together
            matchesCategory = ['chargers', 'cases', 'screenProtectors'].includes(p.category);
        } else {
            matchesCategory = (p.category === category);
        }

        const matchesSearch = !search || p.name.toLowerCase().indexOf(search) !== -1;
        return matchesCategory && matchesSearch;
    });

    renderProducts();
}
    function initSearch() {
        const input = $("#search-input");
        const button = $("#search-button");
        if (!input) return;

        // Live filter as the customer types
        input.addEventListener("input", function (event) {
            LondonApp.currentSearch = event.target.value;
            applyFilters();
        });

        // Search button — scroll to featured section and refilter
        if (button) {
            button.addEventListener("click", function () {
                LondonApp.currentSearch = input.value;
                applyFilters();
                const featured = $("#featured-products");
                if (featured) featured.scrollIntoView({ behavior: "smooth" });
            });
        }
    }


    /* ============================================================
       8. CATEGORY FILTERING
       ------------------------------------------------------------
       Category cards in the HTML use href="#" without data attributes,
       so we match by their visible text / link text. This is a
       pragmatic bridge until the HTML is updated with data-category
       attributes (recommended for production).
       ============================================================ */
    const CATEGORY_TEXT_MAP = {
        "phones": "phones",
        "tablets": "tablets",
        "earbuds": "earbuds",
        "headsets": "headsets",
        "chargers": "chargers",
        "cases": "cases",
        "screen protectors": "screenProtectors",
        "screenProtectors": "screenProtectors",
    };

    function categoryFromText(text) {
        if (!text) return null;
        const lower = text.toLowerCase();
        // Check in order — most specific first
        const order = [
            "screen protector",
            "phone case",
            "charger",
            "headset",
            "earbud",
            "tablet",
            "phone",
        ];
        for (let i = 0; i < order.length; i++) {
            if (lower.indexOf(order[i]) !== -1) {
                if (order[i] === "phone") return "phones";
                if (order[i] === "tablet") return "tablets";
                if (order[i] === "earbud") return "earbuds";
                if (order[i] === "headset") return "headsets";
                if (order[i] === "charger") return "chargers";
                if (order[i] === "phone case") return "cases";
                if (order[i] === "screen protector") return "screenProtectors";
            }
        }
        return null;
    }

    function setCategory(category) {
        LondonApp.currentCategory = category || "all";

        // Visual active state on category cards
        $all(".category-card").forEach(function (card) {
            const link = card.querySelector(".category-link");
            const cat = categoryFromText(link ? link.textContent : "");
            if (LondonApp.currentCategory === "all") {
                card.classList.remove("is-active");
            } else {
                card.classList.toggle("is-active", cat === LondonApp.currentCategory);
            }
        });

        applyFilters();
    }
function initCategories() {
    // 1. Category Cards Logic
    $all(".category-card").forEach(function (card) {
        const link = card.querySelector(".category-link");
        if (!link) return;

        link.addEventListener("click", function (event) {
            event.preventDefault();
            const cat = categoryFromText(link.textContent);
            setCategory(cat || "all");
            const featured = $("#featured-products");
            if (featured) featured.scrollIntoView({ behavior: "smooth" });
        });
    });

    // 2. Brand Logo Logic
    const brandLink = $(".brand-link");
    if (brandLink) {
        brandLink.addEventListener("click", function (event) {
            event.preventDefault();
            setCategory("all");
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // 3. Top Navigation Tabs Logic
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();

            // Highlight active tab
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            const key = this.getAttribute('data-i18n');
            let cat = 'all';

            if (key === 'nav.phones') cat = 'phones';
            if (key === 'nav.tablets') cat = 'tablets';
            if (key === 'nav.earbuds') cat = 'earbuds';
            if (key === 'nav.headsets') cat = 'headsets';
            if (key === 'nav.accessories') cat = 'accessories';

            // Handle Contact tab
            if (key === 'nav.contact') {
                const support = document.getElementById('customer-support');
                if (support) support.scrollIntoView({ behavior: 'smooth' });
                return;
            }

            // Handle Home tab
            if (key === 'nav.home') {
                setCategory('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                // Filter and scroll to products
                setCategory(cat);
                setTimeout(() => {
                    const featured = document.getElementById('featured-products');
                    if (featured) featured.scrollIntoView({ behavior: 'smooth' });
                }, 50);
            }
        });
    });
}


    /* ============================================================
       9. INITIALISATION & BOOT SEQUENCE
       ============================================================ */
  function init() {
    // Language first — so translations are ready before render
    initLanguageSelector();

    // Search + categories
    initSearch();
    initCategories();

    // Initial render (NOW FETCHING FROM DATABASE)
    fetchProducts();   // <--- CHANGED THIS LINE

    // Friendly startup log
    console.log("[London App] Initialised with database connection.");
}

    // Run after DOM is ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();

(function () {
    "use strict";

    /* ============================================================
       GUARD — ensure Part 1 loaded before running Part 2
       ============================================================ */
    const LondonApp = window.LondonApp;
    if (!LondonApp) {
        console.warn(
            "[London App] Part 2 requires Part 1 to be loaded first. " +
            "Make sure the Part 1 IIFE runs before this block."
        );
        return;
    }


    /* ============================================================
       1. CART STATE + STORAGE HELPERS
       ------------------------------------------------------------
       Cart shape:
         [ { productId: "sample-001", quantity: 2 }, … ]

       We only store productId + quantity in the cart, then look
       up the product details from LondonApp.products — so prices
       and stock always reflect the latest data.
       ============================================================ */
    LondonApp.cart = LondonApp.cart || [];
    LondonApp.appliedPromo = LondonApp.appliedPromo || null;
    LondonApp.CART_STORAGE_KEY = "london_cart";

    function saveCart() {
        try {
            localStorage.setItem(
                LondonApp.CART_STORAGE_KEY,
                JSON.stringify(LondonApp.cart)
            );
        } catch (e) { /* localStorage may be blocked — ignore */ }
    }

    function loadCart() {
        try {
            const raw = localStorage.getItem(LondonApp.CART_STORAGE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                // Sanitise each entry
                LondonApp.cart = parsed
                    .filter(function (item) {
                        return item &&
                               typeof item.productId === "string" &&
                               typeof item.quantity === "number" &&
                               item.quantity > 0;
                    })
                    .map(function (item) {
                        return {
                            productId: item.productId,
                            quantity: Math.max(1, Math.floor(item.quantity)),
                        };
                    });
            }
        } catch (e) {
            LondonApp.cart = [];
        }
    }

    function findProductById(productId) {
        return LondonApp.products.find(function (p) {
            return p.id === productId;
        }) || null;
    }

    function findCartItem(productId) {
        return LondonApp.cart.find(function (item) {
            return item.productId === productId;
        }) || null;
    }

    /**
     * Returns true only if the product has a real, positive price.
     * Products with price === null or <= 0 cannot be checked out.
     */
    function hasValidPrice(product) {
        return product &&
               typeof product.price === "number" &&
               isFinite(product.price) &&
               product.price > 0;
    }
 function formatPrice(value, currency) {
        if (typeof value !== "number" ||!isFinite(value) ||  value < 0) {
            return "Price to be set";
        }
        const formatted = value.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        return formatted + " " + (currency || "ETB");
    }


    /* ============================================================
       2. PROMO-CODE CONFIGURATION  (DEMO ONLY)
       ------------------------------------------------------------
       ⚠️  These rules are DEMO ONLY. In production, the server
       must re-validate the code, discount %, minimum order,
       expiry, and per-customer usage limits. Never trust
       client-side discount logic for real payments.
       ============================================================ */
    const PROMO_RULES = {
        LONDON10: {
            type: "percent",
            value: 10,           // 10% off
            label: "10% off",
            minSubtotal: 0,      // no minimum for demo
        },
        // Add more demo codes here — e.g. WELCOME5: { type: "percent", value: 5, … }
    };

    /**
     * Returns a discount object { code, amount, label } or null.
     * Validates against the current cart subtotal (which must use
     * only products with real prices).
     */
    function calculateDiscount(subtotal) {
        const code = LondonApp.appliedPromo;
        if (!code) return null;
        const rule = PROMO_RULES[code];
        if (!rule) return null;
        if (subtotal <= 0) return null;
        if (rule.minSubtotal && subtotal < rule.minSubtotal) return null;

        if (rule.type === "percent") {
            return {
                code: code,
                label: rule.label,
                amount: Math.round(subtotal * rule.value) / 100, // 2-decimal safety
            };
        }
        if (rule.type === "fixed") {
            return {
                code: code,
                label: rule.label,
                amount: Math.min(rule.value, subtotal),
            };
        }
        return null;
    }


    /* ============================================================
       3. CART CALCULATION HELPERS
       ------------------------------------------------------------
       Returns a breakdown used by both rendering and totals:
         {
           items: [{ product, quantity, unitPrice, subtotal, priced }],
           subtotal: number,
           hasUnpricedItem: boolean,
           itemCount: number
         }
       ============================================================ */
    function buildCartBreakdown() {
        const items = [];
        let subtotal = 0;
        let hasUnpricedItem = false;
        let itemCount = 0;

        LondonApp.cart.forEach(function (cartItem) {
            const product = findProductById(cartItem.productId);
            if (!product) return; // product removed from catalog → skip

            const priced = hasValidPrice(product);
            const unitPrice = priced ? product.price : 0;
            const lineSubtotal = priced ? unitPrice * cartItem.quantity : 0;

            if (!priced) hasUnpricedItem = true;
            subtotal += lineSubtotal;
            itemCount += cartItem.quantity;

            items.push({
                product: product,
                quantity: cartItem.quantity,
                unitPrice: unitPrice,
                subtotal: lineSubtotal,
                priced: priced,
            });
        });

        return {
            items: items,
            subtotal: subtotal,
            hasUnpricedItem: hasUnpricedItem,
            itemCount: itemCount,
        };
    }


    /* ============================================================
       4. ADD TO CART
[22/10/2026 13:07] .: ============================================================ */
    /**
     * Adds a product to the cart (or increments quantity).
     * Respects stock and prevents duplicate entries.
     */
    function addToCart(productId) {
        const product = findProductById(productId);
        if (!product) return;

        // Out-of-stock guard
        if (!product.inStock) {
            showCartToast("Out Of Stock: " + ": " + product.name);
            return;
        }

        const existing = findCartItem(productId);
        const currentQty = existing ? existing.quantity : 0;

        // Stock cap — demo assumes available quantity = 1 for out-of-stock,
        // 10 for in-stock. In production this comes from Supabase.
        const availableStock = typeof product.availableQuantity === "number"
            ? product.availableQuantity
            : (product.inStock ? 10 : 0);

        if (currentQty + 1 > availableStock) {
            showCartToast("Only " + availableStock + " available: " + product.name);
            return;
        }

        if (existing) {
            existing.quantity += 1;
        } else {
            LondonApp.cart.push({ productId: productId, quantity: 1 });
        }

        saveCart();
        refreshCartUI();
        showCartToast("Added to cart:" + product.name);
    }

    /**
     * Delegated listener so newly rendered product cards
     * always respond without needing individual listeners.
     */
    function initAddToCartDelegation() {
        const grid = document.querySelector(".products-grid");
        if (!grid) return;

        grid.addEventListener("click", function (event) {
            const btn = event.target.closest(".add-to-cart-button");
            if (!btn || btn.disabled) return;
            const productId = btn.getAttribute("data-product-id");
            if (productId) addToCart(productId);
        });
    }


    /* ============================================================
       5. CART RENDERING
       ============================================================ */
    function renderCart() {
        const container = document.getElementById("cart-items-container");
        const emptyMsg = document.getElementById("cart-empty-message");
        const subtotalEl = document.getElementById("cart-subtotal-amount");
        if (!container) return;

        const breakdown = buildCartBreakdown();

        // Remove all previous item rows (keep the empty-message <p>)
        Array.prototype.slice.call(container.querySelectorAll(".cart-item"))
            .forEach(function (el) { el.remove(); });

        if (breakdown.items.length === 0) {
            if (emptyMsg) emptyMsg.style.display = "";
            if (subtotalEl) subtotalEl.textContent = formatPrice(0);
            updateOrderTotal(0, 0);
            return;
        }

        if (emptyMsg) emptyMsg.style.display = "none";

        const fragment = document.createDocumentFragment();
        breakdown.items.forEach(function (entry) {
            fragment.appendChild(createCartItemRow(entry));
        });
        container.appendChild(fragment);

        if (subtotalEl) subtotalEl.textContent = formatPrice(breakdown.subtotal);

        // Total = subtotal − discount (Part 2 scope; checkout will reuse this)
        const discount = calculateDiscount(breakdown.subtotal);
        updateOrderTotal(breakdown.subtotal, discount ? discount.amount : 0);
        renderPromoFeedback(discount);
    }
function createCartItemRow(entry) {
    const { product, quantity, unitPrice, subtotal, priced } = entry;

    const row = document.createElement("div");
    row.className = "cart-item";
    row.setAttribute("data-product-id", product.id);

    const img = document.createElement("img");
    img.className = "cart-item-image";
    img.src = product.image;
    img.alt = product.name;
    row.appendChild(img);

    const details = document.createElement("div");
    details.className = "cart-item-details";

    const name = document.createElement("p");
    name.className = "cart-item-name";
    name.textContent = product.name;
    details.appendChild(name);

    const priceLine = document.createElement("p");
    priceLine.className = "cart-item-price";
    if (priced) {
        priceLine.textContent = formatPrice(unitPrice) + " × " + quantity + " = " + formatPrice(subtotal);
    } else {
        priceLine.textContent = "Price to be set (ETB)"; // Fixed: removed t()
    }
    details.appendChild(priceLine);

    const qtyWrap = document.createElement("div");
    qtyWrap.style.display = "inline-flex";
    qtyWrap.style.alignItems = "center";
    qtyWrap.style.gap = "0.5rem";
    qtyWrap.style.marginTop = "0.5rem";

    const decBtn = document.createElement("button");
    decBtn.type = "button";
    decBtn.className = "qty-decrease";
    decBtn.textContent = "−";
    decBtn.addEventListener("click", function () { changeQuantity(product.id, -1); });
    qtyWrap.appendChild(decBtn);

    const qtyInput = document.createElement("input");
    qtyInput.type = "number";
    qtyInput.className = "cart-item-quantity";
    qtyInput.min = "1";
    qtyInput.value = String(quantity);
    qtyInput.addEventListener("change", function (event) { setQuantity(product.id, parseInt(event.target.value, 10)); });
    qtyWrap.appendChild(qtyInput);

    const incBtn = document.createElement("button");
    incBtn.type = "button";
    incBtn.className = "qty-increase";
    incBtn.textContent = "+";
    incBtn.addEventListener("click", function () { changeQuantity(product.id, 1); });
    qtyWrap.appendChild(incBtn);

    details.appendChild(qtyWrap);
    row.appendChild(details);

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "remove-item-button";
    removeBtn.textContent = "Remove"; // Fixed: removed t()
    removeBtn.addEventListener("click", function () { removeFromCart(product.id); });
    row.appendChild(removeBtn);

    return row;
}

    /* ============================================================
       6. QUANTITY & REMOVE CONTROLS
       ============================================================ */
    function changeQuantity(productId, delta) {
        const item = findCartItem(productId);
        if (!item) return;
        setQuantity(productId, item.quantity + delta);
    }

    function setQuantity(productId, newQty) {
        const item = findCartItem(productId);
        const product = findProductById(productId);
        if (!item || !product) return;

        // Sanitise
        let qty = parseInt(newQty, 10);
        if (!isFinite(qty) || qty < 1) qty  // Stock cap
        const availableStock = typeof product.availableQuantity === "number"
            ? product.availableQuantity
            : (product.inStock ? 10 : 0);
        if (qty > availableStock) {
            qty = availableStock;
            showCartToast("Maximum available: " + availableStock);
        }

        item.quantity = qty;
        saveCart();
        refreshCartUI();
    }

    function removeFromCart(productId) {
        LondonApp.cart = LondonApp.cart.filter(function (item) {
            return item.productId !== productId;
        });
        saveCart();
        refreshCartUI();
    }


    /* ============================================================
       7. CART BADGE SYNC
       ============================================================ */
  function updateCartBadge() {
    const badge = document.getElementById("cart-count-badge");
    const cartBtn = document.getElementById("cart-button");
    if (!badge) return;

    // Only count items that ACTUALLY exist in the products list
    let count = 0;
    LondonApp.cart.forEach(item => {
        const productExists = LondonApp.products.find(p => p.id.toString() === item.productId.toString());
        if (productExists) {
            count += item.quantity;
        }
    });

    badge.textContent = String(count);
    badge.classList.toggle("is-empty", count === 0);

    if (cartBtn) {
        cartBtn.setAttribute(
            "aria-label",
            "Open shopping cart, " + count + (count === 1 ? " item" : " items")
        );
    }
}


    /* ============================================================
       8. PROMO CODE — APPLY / REMOVE
       ============================================================ */
    function applyPromoCode(rawCode) {
        const code = (rawCode || "").trim().toUpperCase();
        const feedback = document.getElementById("promo-feedback");

        if (!code) {
            renderPromoFeedbackError(t("checkout.promoPlaceholder") || "Enter a promo code");
            return;
        }

        const rule = PROMO_RULES[code];
        if (!rule) {
            renderPromoFeedbackError("Invalid promo code.");
            return;
        }

        // Validate against current cart subtotal (only priced items count)
        const breakdown = buildCartBreakdown();
        if (breakdown.subtotal <= 0) {
            renderPromoFeedbackError("Add items with valid prices first.");
            return;
        }

        LondonApp.appliedPromo = code;
        refreshCartUI();
        if (feedback) {
            feedback.classList.remove("error");
            feedback.classList.add("success");
            feedback.textContent = "Code applied: " + rule.label;
        }
    }

    function removePromoCode() {
        LondonApp.appliedPromo = null;
        refreshCartUI();
        const feedback = document.getElementById("promo-feedback");
        if (feedback) {
            feedback.classList.remove("error", "success");
            feedback.textContent = "";
        }
    }

    function renderPromoFeedbackError(msg) {
        const feedback = document.getElementById("promo-feedback");
        if (!feedback) return;
        feedback.classList.remove("success");
        feedback.classList.add("error");
        feedback.textContent = msg;
    }

    function renderPromoFeedback(discount) {
        const feedback = document.getElementById("promo-feedback");
        if (!feedback) return;

        if (!LondonApp.appliedPromo) {
            feedback.classList.remove("success", "error");
            feedback.textContent = "";
            return;
        }
        if (discount) {
            feedback.classList.remove("error");
            feedback.classList.add("success");
            feedback.textContent =
                "Code " + discount.code + " applied — save " +
                formatPrice(discount.amount);
        } else {
            feedback.classList.remove("success");
            feedback.classList.add("error");
            feedback.textContent = "Promo code no longer valid for this cart.";
        }
    }
 
    function updateOrderTotal(subtotal, discountAmount) {
        const el = document.getElementById("order-total-amount");
        if (!el) return;
        const total = Math.max(0, (subtotal ||  0) - (discountAmount ||0));
        el.textContent = formatPrice(total);
    }


    /* ============================================================
       10. TOAST / HELPFUL MESSAGE
       ------------------------------------------------------------
       Lightweight non-blocking notification using a <div> we
       inject into <body> the first time it's needed.
       ============================================================ */
    let toastTimer = null;
    function showCartToast(message) {
        let toast = document.getElementById("london-toast");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "london-toast";
            toast.setAttribute("role", "status");
            toast.setAttribute("aria-live", "polite");
            toast.style.position = "fixed";
            toast.style.bottom = "1.5rem";
            toast.style.left = "50%";
            toast.style.transform = "translateX(-50%)";
            toast.style.padding = "0.75rem 1.25rem";
            toast.style.background = "var(--color-primary-dark, #0a5c2e)";
            toast.style.color = "#fff";
            toast.style.borderRadius = "999px";
            toast.style.boxShadow = "0 6px 20px rgba(0,0,0,0.2)";
            toast.style.fontSize = "0.875rem";
            toast.style.fontWeight = "600";
            toast.style.zIndex = "9999";
            toast.style.maxWidth = "90vw";
            toast.style.opacity = "0";
            toast.style.transition = "opacity 200ms ease";
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.style.opacity = "1";
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            toast.style.opacity = "0";
        }, 2600);
    }


    /* ============================================================
       11. REFRESH ALL CART UI IN ONE CALL
       ============================================================ */
    function refreshCartUI() {
        updateCartBadge();
        renderCart();
    }


    /* ============================================================
       12. INITIALISATION
       ============================================================ */
    function initCart() {
        loadCart();
        initAddToCartDelegation();
        // Slide-out Cart Logic
const cartBtn = document.getElementById("cart-button");
const cartPanel = document.getElementById("cart-panel");

if (cartBtn && cartPanel) {
    // Create overlay background
    const overlay = document.createElement("div");
    overlay.className = "cart-panel-overlay";
    document.body.appendChild(overlay);

    // Create close button
    const closeBtn = document.createElement("button");
    closeBtn.className = "close-cart-btn";
    closeBtn.innerHTML = "✕";
    cartPanel.prepend(closeBtn);

    // Open cart when icon is clicked
    cartBtn.addEventListener("click", function (event) {
        event.preventDefault();
        cartPanel.classList.add("is-open");
        overlay.classList.add("is-open");
    });

    // Close cart function
    const closeCart = () => {
        cartPanel.classList.remove("is-open");
        overlay.classList.remove("is-open");
    };

    closeBtn.addEventListener("click", closeCart);
    overlay.addEventListener("click", closeCart);
}

        // Cart panel: Continue Shopping closes panel / scrolls up
        const continueBtn = document.getElementById("continue-shopping-button");
        if (continueBtn) {
            continueBtn.addEventListener("click", function () {
                const panel = document.getElementById("cart-panel");
                if (panel) panel.scrollIntoView({ behavior: "smooth" });
                const featured = document.getElementById("featured-products");
                if (featured) featured.scrollIntoView({ behavior: "smooth" });
            });
        }

        // Cart panel: Proceed to Checkout scrolls to checkout section
        const checkoutBtn = document.getElementById("checkout-button");
        if (checkoutBtn) {
            checkoutBtn.addEventListener("click", function () {
                const target = document.getElementById("checkout-section");
                if (target) target.scrollIntoView({ behavior: "smooth" });
            });
        }

        // Promo: Apply button
        const applyBtn = document.getElementById("apply-promo-button");
        const promoInput = document.getElementById("promo-code-input");
 if (applyBtn && promoInput) {
            applyBtn.addEventListener("click", function () {
                applyPromoCode(promoInput.value);
            });
            promoInput.addEventListener("keydown", function (event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    applyPromoCode(promoInput.value);
                }
            });
        }

        // Initial paint
        refreshCartUI();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initCart);
    } else {
        initCart();
    }

    // Expose helpers for Part 3 (checkout) without duplicating logic
    LondonApp.cart = LondonApp.cart;
    LondonApp.buildCartBreakdown = buildCartBreakdown;
    LondonApp.calculateDiscount = calculateDiscount;
    LondonApp.formatPrice = formatPrice;
    LondonApp.hasValidPrice = hasValidPrice;
    LondonApp.PROMO_RULES = PROMO_RULES;
    LondonApp.refreshCartUI = refreshCartUI;

    console.log("[London App] Part 2 (cart + promo demo) initialised.");

})();
 /* ============================================================
   LONDON (ለንደን) — script.js — PART 3 of 3 (FINAL)
   ------------------------------------------------------------
   Contents of Part 3:
     1.  Checkout configuration (DEMO delivery fees)
     2.  Extra translation keys (checkout / confirmation)
     3.  Form validation helpers
     4.  Delivery vs. pickup toggle
     5.  Order summary builder (reuses Part 2 totals)
     6.  Promo code integration (reuses Part 2 promo)
     7.  Order confirmation rendering (demonstration only)
     8.  Submit handler (front-end validation → demo confirmation)
     9.  Boot sequence

   Continues directly after Part 2 in the same script.js file.

   ⚠️ SECURITY & SCOPE
   ------------------------------------------------------------
   - This is a FRONT-END DEMONSTRATION. No payment is processed.
   - No order is saved to any server or database.
   - No Telegram / API tokens are used anywhere in this file.
   - When ready, the submit handler at the bottom will be
     replaced with a fetch() call to a secure backend that
     re-validates prices, stock, discounts, delivery fees, and
     totals before accepting the order.
   ============================================================ */

(function () {
    "use strict";

    /* ============================================================
       GUARD — ensure Parts 1 and 2 loaded first
       ============================================================ */
    const LondonApp = window.LondonApp;
    if (!LondonApp || typeof LondonApp.buildCartBreakdown !== "function") {
        console.warn(
            "[London App] Part 3 requires Parts 1 and 2 to be loaded first. " +
            "Check that both earlier IIFEs run before this block."
        );
        return;
    }


    /* ============================================================
       1. CHECKOUT CONFIGURATION (DEMONSTRATION ONLY)
       ------------------------------------------------------------
       ⚠️  These are DEMO delivery fees — NOT real prices.
       The shop owner can edit these numbers here later, or they
       will be replaced by server-side values in production.
       ------------------------------------------------------------
       Future: support per-location fees by replacing the flat
       amount with a function that reads a location field
       from the checkout form. Example commented below.
       ============================================================ */
    const DELIVERY_CONFIG = {
        currency: "ETB",
        fees: {
            delivery: 100,   // demo flat delivery fee
            pickup: 0,       // pickup is free
        },
        // Future location-based example (uncomment when ready):
        // feesByLocation: {
        //     "addis-ababa": 100,
        //     "adama": 150,
        //     "default": 200,
        // },
    };

    function getDeliveryFee(method, _location) {
        // _location reserved for future per-city fees
        if (method === "pickup") return DELIVERY_CONFIG.fees.pickup;
        return DELIVERY_CONFIG.fees.delivery;
    }


    /* ============================================================
       2. EXTRA TRANSLATION KEYS
       ------------------------------------------------------------
       Part 1 loaded translations into LondonApp.translations.
       We add Part 3 keys here so they can be edited alongside
       the rest — one dictionary, one system, no duplicates.
       ============================================================ */
    const part3Translations = {
        en: {
            "checkout.error.fullName": "Please enter your full name.",
            "checkout.error.phone": "Please enter a valid phone number.",
            "checkout.error.email": "Please enter a valid email address or leave it empty.",
 "checkout.error.address": "Please enter a delivery address.",
            "checkout.error.emptyCart": "Your cart is empty. Add a product first.",
            "checkout.error.unpricedItem": "Some items have no price set yet. Checkout is disabled for those items.",
            "checkout.error.generic": "Please fix the highlighted fields and try again.",
            "checkout.success.demo": "Demo order created — not sent to the shop.",
            "checkout.demoNotice": "This is a demonstration order only. No payment has been processed and no order has been sent to the shop.",
            "checkout.orderRef": "Demo order reference",
            "checkout.fulfillment": "Fulfillment method",
            "checkout.delivery": "Home Delivery",
            "checkout.pickup": "Store Pickup",
            "checkout.deliveryFee": "Delivery fee",
            "checkout.subtotal": "Subtotal",
            "checkout.discount": "Discount",
            "checkout.total": "Total",
            "checkout.itemsHeader": "Items",
            "checkout.placeOrder": "Place Order",
            "checkout.continueShopping": "Continue Shopping",
        },
        am: {
            "checkout.error.fullName": "እባክዎ ሙሉ ስምዎን ያስገቡ።",
            "checkout.error.phone": "እባክዎ ትክክለኛ የስልክ ቁጥር ያስገቡ።",
            "checkout.error.email": "እባክዎ ትክክለኛ ኢሜይል ያስገቡ ወይም ባዶ ይተውት።",
            "checkout.error.address": "እባክዎ የማድረሻ አድራሻ ያስገቡ።",
            "checkout.error.emptyCart": "ጋሪዎ ባዶ ነው። አስቀድመው ምርት ይጨምሩ።",
            "checkout.error.unpricedItem": "አንዳንድ ምርቶች ዋጋ አልተዘጋጀላቸውም። ለእነዚህ ምርቶች ትዕዛዝ አይፈቀድም።",
            "checkout.error.generic": "እባክዎ የተለዩትን መስኮች ያስተካክሉ እና እንደገና ይሞክሩ።",
            "checkout.success.demo": "የማሳያ ትዕዛዝ ተፈጥሯል — ወደ ሱቁ አልተላከም።",
            "checkout.demoNotice": "ይህ የማሳያ ትዕዛዝ ብቻ ነው። ምንም ክፍያ አልተፈጸመም እና ትዕዛዙ ወደ ሱቁ አልተላከም።",
            "checkout.orderRef": "የማሳያ ትዕዛዝ ቁጥር",
            "checkout.fulfillment": "የማድረሻ ዘዴ",
            "checkout.delivery": "ወደ ቤት ማድረስ",
            "checkout.pickup": "ከሱቅ መውሰድ",
            "checkout.deliveryFee": "የማድረሻ ክፍያ",
            "checkout.subtotal": "ንዑስ ድምር",
            "checkout.discount": "ቅናሽ",
            "checkout.total": "ጠቅላላ",
            "checkout.itemsHeader": "ምርቶች",
            "checkout.placeOrder": "ትዕዛዝ አስገባ",
            "checkout.continueShopping": "ግዢን ይቀጥሉ",
        },
        om: {
            "checkout.error.fullName": "Maaloo maqaa guutuu keessan galchaa.",
            "checkout.error.phone": "Maaloo lakkoofsa bilbilaa sirrii galchaa.",
            "checkout.error.email": "Maaloo imeelii sirrii galchaa yookaan duwwaa dhiisaa.",
            "checkout.error.address": "Maaloo teessoo geejjibaa galchaa.",
            "checkout.error.emptyCart": "Gaariin keessan duwwaa dha. Dursa oomisha galchaa.",
            "checkout.error.unpricedItem": "Oomishaaleen tokko tokko gatii hin qaban. Isaanii irratti ajaja hin fudhatamu.",
            "checkout.error.generic": "Maaloo dirreewwan addeeffaman sirreessaa irra deebi'aa yaalaa.",
            "checkout.success.demo": "Ajajni agarsiisaa uumame — suuqaaf hin ergamne.",
            "checkout.demoNotice": "Kun ajaja agarsiisaa qofa. Kaffaltiin hin raawwatamne, ajajnis gara suuqaatti hin ergamne.",
            "checkout.orderRef": "Lakkoofsa ajaja agarsiisaa",
            "checkout.fulfillment": "Mala geejjibaa",
            "checkout.delivery": "Gara Manaatti Geessuu",
            "checkout.pickup": "Suuqa Irraa Fudhachuu",
            "checkout.deliveryFee": "Kaffaltii geejjibaa",
            "checkout.subtotal": "Waliigala xiqqaa",
            "checkout.discount": "Hir'isaa",
            "checkout.total": "Waliigala",
            "checkout.itemsHeader": "Oomishaalee",
            "checkout.placeOrder": "Ajaja Galchi",
            "checkout.continueShopping": "Bittaa Itti Fufi",
        },
    };
 // Merge into the shared dictionary — never overwrite existing keys
    Object.keys(part3Translations).forEach(function (lang) {
        LondonApp.translations[lang] = Object.assign(
            {},
            part3Translations[lang],
            LondonApp.translations[lang] || {}
        );
    });

    // Local t() that reads from the shared dictionary with EN fallback
    function t(key) {
        const lang = LondonApp.currentLanguage;
        const dict = LondonApp.translations[lang] || {};
        const fallback = LondonApp.translations.en || {};
        if (typeof dict[key] === "string") return dict[key];
        if (typeof fallback[key] === "string") return fallback[key];
        return key;
    }


    /* ============================================================
       3. VALIDATION HELPERS
       ============================================================ */
    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const PHONE_PATTERN = /^[0-9+\-\s()]{7,20}$/;

    function setFieldError(fieldEl, message) {
        if (!fieldEl) return;
        fieldEl.classList.add("has-error");
        const existing = fieldEl.querySelector(".field-error");
        if (existing) existing.remove();

        const errorEl = document.createElement("p");
        errorEl.className = "field-error";
        errorEl.setAttribute("role", "alert");
        errorEl.style.color = "var(--color-danger, #c0392b)";
        errorEl.style.fontSize = "0.8125rem";
        errorEl.style.marginTop = "0.25rem";
        errorEl.textContent = message;
        fieldEl.appendChild(errorEl);
    }

    function clearFieldError(fieldEl) {
        if (!fieldEl) return;
        fieldEl.classList.remove("has-error");
        const existing = fieldEl.querySelector(".field-error");
        if (existing) existing.remove();
    }

    function clearAllErrors(form) {
        if (!form) return;
        Array.prototype.slice
            .call(form.querySelectorAll(".form-field, .form-fieldset"))
            .forEach(clearFieldError);
    }

    /**
     * Validate the whole checkout form.
     * Returns { valid: boolean, data: {...} }.
     */
    function validateCheckoutForm() {
        const form = document.getElementById("checkout-form");
        if (!form) return { valid: false, data: null };
        clearAllErrors(form);

        let valid = true;

        // Full name
        const fullNameInput = document.getElementById("customer-full-name");
        const fullName = fullNameInput ? fullNameInput.value.trim() : "";
        if (!fullName) {
            setFieldError(fullNameInput && fullNameInput.closest(".form-field"),
                          t("checkout.error.fullName"));
            valid = false;
        }

        // Phone
        const phoneInput = document.getElementById("customer-phone");
        const phone = phoneInput ? phoneInput.value.trim() : "";
        if (!phone || !PHONE_PATTERN.test(phone)) {
            setFieldError(phoneInput && phoneInput.closest(".form-field"),
                          t("checkout.error.phone"));
            valid = false;
        }

        // Email — optional but must be valid if provided
        const emailInput = document.getElementById("customer-email");
        const email = emailInput ? emailInput.value.trim() : "";
        if (email && !EMAIL_PATTERN.test(email)) {
            setFieldError(emailInput && emailInput.closest(".form-field"),
                          t("checkout.error.email"));
            valid = false;
        }

        // Fulfillment method
        const deliveryRadio = document.getElementById("delivery-method-delivery");
        const pickupRadio = document.getElementById("delivery-method-pickup");
        let method = "delivery";
        if (pickupRadio && pickupRadio.checked) method = "pickup";
        else if (deliveryRadio && deliveryRadio.checked) method = "delivery";
// Address — required for delivery only
        const addressInput = document.getElementById("delivery-address");
        const address = addressInput ? addressInput.value.trim() : "";
        if (method === "delivery" && !address) {
            setFieldError(addressInput && addressInput.closest(".form-field"),
                          t("checkout.error.address"));
            valid = false;
        }

        return {
            valid: valid,
            data: {
                fullName: fullName,
                phone: phone,
                email: email,
                method: method,
                address: method === "delivery" ? address : "",
            },
        };
    }


    /* ============================================================
       4. DELIVERY vs. PICKUP TOGGLE
       ============================================================ */
    function updateFulfillmentUI() {
        const deliveryRadio = document.getElementById("delivery-method-delivery");
        const pickupRadio = document.getElementById("delivery-method-pickup");
        const addressField = document.getElementById("delivery-address-field");
        const addressInput = document.getElementById("delivery-address");

        if (!deliveryRadio || !pickupRadio) return;

        const isDelivery = deliveryRadio.checked;

        if (addressField) {
            if (isDelivery) {
                addressField.hidden = false;
                addressField.removeAttribute("hidden");
            } else {
                addressField.hidden = true;
                addressField.setAttribute("hidden", "");
            }
        }
        if (addressInput) {
            if (isDelivery) {
                addressInput.setAttribute("required", "required");
                addressInput.setAttribute("aria-required", "true");
            } else {
                addressInput.removeAttribute("required");
                addressInput.setAttribute("aria-required", "false");
                // Clear its validation error when hidden
                const wrapper = addressInput.closest(".form-field");
                if (wrapper) clearFieldError(wrapper);
            }
        }

        // Refresh the totals so the delivery fee updates live
        updateCheckoutTotals();
    }

    function initFulfillmentToggle() {
        const radios = document.querySelectorAll(
            'input[name="deliveryMethod"]'
        );
        if (!radios.length) return;
        radios.forEach(function (radio) {
            radio.addEventListener("change", updateFulfillmentUI);
        });
        updateFulfillmentUI();
    }


    /* ============================================================
       5. ORDER SUMMARY BUILDER (reuses Part 2 helpers)
       ============================================================ */
    /**
     * Returns a snapshot of the cart with all totals:
       { items, subtotal, discount, deliveryFee, total,
         hasUnpricedItem, method }
     */
    function buildOrderSnapshot() {
        const breakdown = LondonApp.buildCartBreakdown();
        const discountInfo = LondonApp.calculateDiscount
            ? LondonApp.calculateDiscount(breakdown.subtotal)
            : null;
        const discountAmount = discountInfo ? discountInfo.amount : 0;

        const deliveryRadio = document.getElementById("delivery-method-delivery");
        const pickupRadio = document.getElementById("delivery-method-pickup");
        let method = "delivery";
        if (pickupRadio && pickupRadio.checked) method = "pickup";
        else if (deliveryRadio && deliveryRadio.checked) method = "delivery";

        const deliveryFee = getDeliveryFee(method);
        const total = Math.max(
            0,
            breakdown.subtotal - discountAmount + deliveryFee
        );
 return {
            items: breakdown.items,
            subtotal: breakdown.subtotal,
            discount: discountAmount,
            discountCode: LondonApp.appliedPromo || null,
            deliveryFee: deliveryFee,
            total: total,
            hasUnpricedItem: breakdown.hasUnpricedItem,
            itemCount: breakdown.itemCount,
            method: method,
        };
    }

    /**
     * Paints the checkout-side totals (order-total-amount + optional
     * delivery-fee line, injected next to order total if missing).
     */
    function updateCheckoutTotals() {
        const snapshot = buildOrderSnapshot();

        // Update or create delivery fee line beneath #order-total-amount
        const orderTotalRow = document.querySelector(".order-total-row");
        if (orderTotalRow) {
            let feeRow = document.getElementById("checkout-delivery-fee-row");
            if (!feeRow) {
                feeRow = document.createElement("div");
                feeRow.id = "checkout-delivery-fee-row";
                feeRow.className = "order-total-row order-total-row--fee";
                feeRow.style.background = "transparent";
                feeRow.style.padding = "0.5rem 0";

                const label = document.createElement("span");
                label.className = "order-total-label";
                label.setAttribute("data-i18n", "checkout.deliveryFee");
                label.id = "checkout-delivery-fee-label";
                feeRow.appendChild(label);

                const value = document.createElement("span");
                value.className = "order-total-amount";
                value.id = "checkout-delivery-fee-amount";
                value.style.fontSize = "1rem";
                feeRow.appendChild(value);

                orderTotalRow.parentNode.insertBefore(feeRow, orderTotalRow);
            }
            const labelEl = document.getElementById("checkout-delivery-fee-label");
            if (labelEl) labelEl.textContent = t("checkout.deliveryFee");
            const valueEl = document.getElementById("checkout-delivery-fee-amount");
            if (valueEl) valueEl.textContent = LondonApp.formatPrice(snapshot.deliveryFee);
        }

        // Update final total
        const totalEl = document.getElementById("order-total-amount");
        if (totalEl) totalEl.textContent = LondonApp.formatPrice(snapshot.total);
    }


    /* ============================================================
       6. PROMO CODE INTEGRATION
       ------------------------------------------------------------
       Part 2 already handles apply/remove on the promo panel.
       We just refresh checkout totals whenever the promo panel
       refreshes the cart. Hook into LondonApp.refreshCartUI by
       wrapping it once — safe, no duplicate listeners.
       ============================================================ */
    function hookCheckoutRefresh() {
        if (LondonApp._checkoutHooked) return;
        LondonApp._checkoutHooked = true;

        const original = LondonApp.refreshCartUI;
        if (typeof original === "function") {
            LondonApp.refreshCartUI = function () {
                original();
                try { updateCheckoutTotals(); } catch (e) { /* safe */ }
            };
        }
    }


    /* ============================================================
       7. ORDER CONFIRMATION (DEMONSTRATION ONLY)
       ------------------------------------------------------------
       Builds a safe, non-server order summary and shows it in
       place of the checkout form. The cart is cleared only
       after this demonstration is confirmed.
       ============================================================ */
    function generateDemoOrderReference() {
        // e.g. DEMO-2025-4F7A9C
        const year = new Date().getFullYear();
        const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
        return "DEMO-" + year + "-" + rand;
    }
 function renderOrderConfirmation(snapshot, customer) {
        // Hide the checkout form
        const form = document.getElementById("checkout-form");
        if (form) form.style.display = "none";

        // Prepare or create a confirmation container inside checkout section
        const section = document.getElementById("checkout-section");
        if (!section) return;

        let box = document.getElementById("order-confirmation-box");
        if (!box) {
            box = document.createElement("div");
            box.id = "order-confirmation-box";
            box.className = "order-confirmation";
            box.setAttribute("role", "status");
            box.setAttribute("aria-live", "polite");
            box.style.padding = "1.5rem";
            box.style.background = "var(--color-primary-light, #e6f4ec)";
            box.style.border = "2px solid var(--color-primary, #0f7b3f)";
            box.style.borderRadius = "var(--radius-lg, 16px)";
            box.style.marginTop = "1rem";
            section.appendChild(box);
        }
        // Clear previous content safely
        while (box.firstChild) box.removeChild(box.firstChild);

        const ref = generateDemoOrderReference();

        // Header
        const h3 = document.createElement("h3");
        h3.textContent = t("checkout.success.demo");
        h3.style.marginBottom = "0.75rem";
        h3.style.color = "var(--color-primary-dark, #0a5c2e)";
        box.appendChild(h3);

        // Reference
        const refEl = document.createElement("p");
        refEl.textContent = t("checkout.orderRef") + ": " + ref;
        refEl.style.fontWeight = "700";
        refEl.style.marginBottom = "0.75rem";
        box.appendChild(refEl);

        // Demo notice (important!)
        const notice = document.createElement("p");
        notice.textContent = t("checkout.demoNotice");
        notice.style.background = "#fff4e5";
        notice.style.border = "1px solid #f0b27a";
        notice.style.color = "#7a4a00";
        notice.style.padding = "0.65rem 0.85rem";
        notice.style.borderRadius = "8px";
        notice.style.fontSize = "0.875rem";
        notice.style.marginBottom = "1rem";
        box.appendChild(notice);

        // Customer summary
        const cust = document.createElement("dl");
        cust.style.display = "grid";
        cust.style.gridTemplateColumns = "max-content 1fr";
        cust.style.gap = "0.35rem 1rem";
        cust.style.margin = "0 0 1rem";

        appendDefinition(cust, "Name", customer.fullName);
        appendDefinition(cust, "Phone", customer.phone);
        if (customer.email) appendDefinition(cust, "Email", customer.email);
        appendDefinition(
            cust,
            t("checkout.fulfillment"),
            customer.method === "pickup" ? t("checkout.pickup") : t("checkout.delivery")
        );
        if (customer.method === "delivery" && customer.address) {
            appendDefinition(cust, "Address", customer.address);
        }
        box.appendChild(cust);

        // Items
        const itemsHeader = document.createElement("h4");
        itemsHeader.textContent = t("checkout.itemsHeader");
        itemsHeader.style.margin = "1rem 0 0.5rem";
        box.appendChild(itemsHeader);

        const list = document.createElement("ul");
        list.style.listStyle = "none";
        list.style.padding = "0";
        list.style.margin = "0 0 1rem";
        list.style.display = "flex";
        list.style.flexDirection = "column";
        list.style.gap = "0.35rem";

        snapshot.items.forEach(function (entry) {
            const li = document.createElement("li");
            li.style.display = "flex";
            li.style.justifyContent = "space-between";
            li.style.fontSize = "0.9375rem";
            const nameQty = document.createElement("span");
            nameQty.textContent = entry.product.name + " × " + entry.quantity;
            li.appendChild(nameQty);
const price = document.createElement("span");
            price.textContent = entry.priced
                ? LondonApp.formatPrice(entry.subtotal)
                : t("product.pricePlaceholder");
            li.appendChild(price);
            list.appendChild(li);
        });
        box.appendChild(list);

        // Totals
        const totals = document.createElement("dl");
        totals.style.display = "grid";
        totals.style.gridTemplateColumns = "max-content 1fr";
        totals.style.gap = "0.35rem 1rem";
        totals.style.padding = "0.75rem";
        totals.style.background = "#fff";
        totals.style.borderRadius = "8px";
        totals.style.margin = "0 0 1rem";

        appendDefinition(totals, t("checkout.subtotal"),
                         LondonApp.formatPrice(snapshot.subtotal));
        if (snapshot.discount > 0) {
            appendDefinition(
                totals,
                t("checkout.discount") + " (" + (snapshot.discountCode || "") + ")",
                "−" + LondonApp.formatPrice(snapshot.discount)
            );
        }
        appendDefinition(totals, t("checkout.deliveryFee"),
                         LondonApp.formatPrice(snapshot.deliveryFee));
        appendDefinition(totals, t("checkout.total"),
                         LondonApp.formatPrice(snapshot.total));
        box.appendChild(totals);

        // Continue shopping button
        const continueBtn = document.createElement("button");
        continueBtn.type = "button";
        continueBtn.className = "hero-cta-button";
        continueBtn.textContent = t("checkout.continueShopping");
        continueBtn.addEventListener("click", function () {
            // Reset the checkout form + confirmation box
            if (form) {
                form.reset();
                form.style.display = "";
            }
            box.remove();
            // Clear cart (Part 2 state + localStorage)
            LondonApp.cart = [];
            try { localStorage.removeItem(LondonApp.CART_STORAGE_KEY); } catch (e) {}
            if (typeof LondonApp.refreshCartUI === "function") {
                LondonApp.refreshCartUI();
            }
            const featured = document.getElementById("featured-products");
            if (featured) featured.scrollIntoView({ behavior: "smooth" });
        });
        box.appendChild(continueBtn);

        box.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function appendDefinition(dl, term, value) {
        const dt = document.createElement("dt");
        dt.textContent = term;
        dt.style.fontWeight = "600";
        dt.style.color = "var(--color-text-muted, #5f6b64)";
        dl.appendChild(dt);

        const dd = document.createElement("dd");
        dd.textContent = value;
        dd.style.margin = "0";
        dl.appendChild(dd);
    }


    /* ============================================================
       8. SUBMIT HANDLER
       ------------------------------------------------------------
       Front-end validation only. In production, replace the
       buildOrderSnapshot payload with a fetch() to a secure
       backend endpoint that re-validates everything server-side:

         POST /api/orders  (server re-checks prices, stock,
                            discounts, delivery fee, totals)
       ============================================================ */
   async function handleCheckoutSubmit(event) {
        if (event && event.preventDefault) event.preventDefault();

        const form = document.getElementById("checkout-form");
        if (!form) return;

        // 1) Cart must not be empty
        const snapshot = buildOrderSnapshot();
        if (!snapshot.items.length) {
            showToastSafe(t("checkout.error.emptyCart"));
            return;
        }

        // 2) No unpriced items allowed at checkout
        if (snapshot.hasUnpricedItem) {
            showToastSafe(t("checkout.error.unpricedItem"));
            return;
        } // 3) Form validation
        const { valid, data } = validateCheckoutForm();
        if (!valid || !data) {
            showToastSafe(t("checkout.error.generic"));
            // Focus first error field for accessibility
            const firstError = form.querySelector(".has-error input, .has-error textarea");
            if (firstError) firstError.focus();
            return;
        }

   // 4) SAVE THE REAL ORDER TO SUPABASE (Secure Calculation)
// We show a loading message while it saves

// 🛑 SMART CHECK: Prevent spam by checking for existing pending orders
//const { data: existingOrders, error: checkError } = await db
   // .from('orders')
   // .select('id')
   // .eq('customer_phone', data.phone)
   // .eq('status', 'pending');

//if (existingOrders && existingOrders.length > 0) {
    //alert("You already have a pending order. Please wait for us to call you before placing another one.");
   // return; // This stops the checkout here
//}
//const submitBtn = document.getElementById("place-order-button");
//if (submitBtn) {
//    submitBtn.disabled = true;
  //  submitBtn.textContent = "Placing Order...";
//}





try {
    // A. Recalculate the total securely using the database prices
    let secureTotal = 0;
    const itemsToInsert = [];

    for (let item of LondonApp.cart) {
        // Find the real product in our loaded database products list
        const dbProduct = LondonApp.products.find(p => p.id.toString() === item.productId.toString());
        
        if (!dbProduct) {
            throw new Error("Product not found in database.");
        }

        const truePrice = dbProduct.price; 
        secureTotal += (truePrice * item.quantity);
        
        itemsToInsert.push({
            product_id: dbProduct.id,
            quantity: item.quantity,
            price_at_time: truePrice
        });
    }

    // B. Insert the main order receipt into the 'orders' table
    const { data: orderData, error: orderError } = await db
        .from('orders')
        .insert([{
            customer_name: data.fullName,
            customer_phone: data.phone,
            delivery_method: data.method,
            delivery_address: data.address,
            total_amount: secureTotal,
            status: 'pending'
        }])
        .select(); // This asks Supabase to return the new row (so we get the ID)

    if (orderError) throw orderError;

    const newOrderId = orderData[0].id;

    // C. Insert the items into the 'order_item' table
    // We add the newOrderId to every item so they are linked to the receipt
    const finalItemsToInsert = itemsToInsert.map(item => ({
        ...item,
        order_id: newOrderId
    }));

    const { error: itemsError } = await db
        .from('order_item')
        .insert(finalItemsToInsert);

    if (itemsError) throw itemsError;

    // D. Success! Clear the cart and show a message
    alert("Order Placed Successfully! We will contact you soon.");
    
    LondonApp.cart = [];
    localStorage.removeItem("london_cart");
    if (typeof LondonApp.refreshCartUI === 'function') {
        LondonApp.refreshCartUI();
    }
    
    // Reset the form
    const form = document.getElementById("checkout-form");
    if (form) form.reset();

} catch (error) {
    console.error("Failed to save order:", error);
    alert("Sorry, there was a problem placing your order. Please try again.");
} finally {
    // Re-enable the button
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Place Order";
    }
}
    }

    function showToastSafe(message) {
        // Reuse Part 2's toast if available; otherwise alert as last resort
        if (typeof LondonApp.refreshCartUI === "function") {
            // Part 2 exposes toast via closure only, so implement minimal fallback:
        }
        // Try to find Part 2's #london-toast; if absent, create a simple one
        let toast = document.getElementById("london-toast");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "london-toast";
            toast.setAttribute("role", "status");
            toast.setAttribute("aria-live", "polite");
            toast.style.position = "fixed";
            toast.style.bottom = "1.5rem";
            toast.style.left = "50%";
            toast.style.transform = "translateX(-50%)";
            toast.style.padding = "0.75rem 1.25rem";
            toast.style.background = "var(--color-danger, #c0392b)";
            toast.style.color = "#fff";
            toast.style.borderRadius = "999px";
            toast.style.boxShadow = "0 6px 20px rgba(0,0,0,0.2)";
            toast.style.fontSize = "0.875rem";
            toast.style.fontWeight = "600";
            toast.style.zIndex = "9999";
            toast.style.maxWidth = "90vw";
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        clearTimeout(showToastSafe._t);
        showToastSafe._t = setTimeout(function () {
            if (toast && toast.parentNode) toast.parentNode.removeChild(toast);
        }, 3200);
    }


    /* ============================================================
       9. BOOT SEQUENCE
       ============================================================ */
    function initCheckout() {
        // Prevent double init (e.g. if script.js accidentally loaded twice)
        if (LondonApp._checkoutInitialised) return;
        LondonApp._checkoutInitialised = true;

        hookCheckoutRefresh();
        initFulfillmentToggle();

        // Attach submit listener once
        const form = document.getElementById("checkout-form");
        if (form) {
            form.addEventListener("submit", handleCheckoutSubmit);
        } else {
            console.warn(
                "[London App] #checkout-form not found — checkout submit will not work. " +
                "Ensure the checkout section from HTML Part 3 is present."
            );
        }

        // Initial totals paint
        updateCheckoutTotals();

        const langSelect = document.getElementById("language-select");
        if (langSelect) {
            langSelect.addEventListener("change", function () {
                // Rebuild fee label with the new language
                const labelEl = document.getElementById("checkout-delivery-fee-label");
                if (labelEl) labelEl.textContent = t("checkout.deliveryFee");
                updateCheckoutTotals();
            });
        }
 console.log("[London App] Part 3 (checkout demo) initialised.");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initCheckout);
    } else {
        initCheckout();
    }

    // Expose a few helpers for future backend integration / debugging
    LondonApp.buildOrderSnapshot = buildOrderSnapshot;
    LondonApp.validateCheckoutForm = validateCheckoutForm;
    LondonApp.DELIVERY_CONFIG = DELIVERY_CONFIG;
    LondonApp.handleCheckoutSubmit = handleCheckoutSubmit;

})();

(function () {
    const extraTranslations = {
        en: {
            "cart.heading": "Your Shopping Cart",
            "cart.empty": "Your cart is currently empty.",
            "cart.subtotalLabel": "Subtotal:",
            "cart.continueShopping": "Continue Shopping",
            "cart.proceedToCheckout": "Proceed to Checkout",
            "checkout.heading": "Checkout",
            "checkout.fullNameLabel": "Full Name",
            "checkout.fullNamePlaceholder": "Enter your full name",
            "checkout.phoneLabel": "Phone Number",
            "checkout.phonePlaceholder": "e.g. 09XX XXX XXXX",
            "checkout.emailLabel": "Email Address (optional)",
            "checkout.emailPlaceholder": "you@example.com",
            "checkout.deliveryMethodLegend": "Delivery Method",
            "checkout.deliveryOption": "Home Delivery",
            "checkout.pickupOption": "Store Pickup",
            "checkout.addressLabel": "Delivery Address",
            "checkout.addressPlaceholder": "Street, area, city...",
            "checkout.promoLabel": "Discount / Promo Code",
            "checkout.promoPlaceholder": "Enter promo code",
            "checkout.applyPromo": "Apply",
            "checkout.orderTotalLabel": "Order Total:",
            "checkout.placeOrder": "Place Order",
            "support.heading": "Need Help?",
            "support.message": "Have a question about a product or your order? Our team is happy to help. Reach out to us on Telegram or give us a call before placing your order.",
            "support.telegramLink": "💬 Telegram Support",
            "support.phoneLink": "📞 Call Support",
            "footer.tagline": "Mobile phones & accessories you can trust.",
            "footer.quickLinksHeading": "Quick Links",
            "footer.categoriesHeading": "Categories",
            "footer.contactHeading": "Contact",
           "footer.addressPlaceholder": "📍 Kemisse around Dawe mosque",
           "footer.phonePlaceholder": "📞 +251 930613306",
           "footer.emailPlaceholder": "✉️ Email to be added", // Put your real email here if you have one
           "footer.hoursPlaceholder": "🕒 1:00 AM - 3:00 AM",
            "footer.copyright": "All rights reserved."
        },
        am: {
            "cart.heading": "የእርስዎ የግዢ ጋሪ",
            "cart.empty": "ጋሪዎ በአሁኑ ጊዜ ባዶ ነው።",
            "cart.subtotalLabel": "ንዑስ ድምር:",
            "cart.continueShopping": "ግዢን ይቀጥሉ",
            "cart.proceedToCheckout": "ወደ ክፍያ ይሂዱ",
            "checkout.heading": "ክፍያ",
            "checkout.fullNameLabel": "ሙሉ ስም",
            "checkout.fullNamePlaceholder": "ሙሉ ስምዎን ያስገቡ",
            "checkout.phoneLabel": "የስልክ ቁጥር",
            "checkout.phonePlaceholder": "ለምሳሌ 09XX XXX XXXX",
            "checkout.emailLabel": "ኢሜይል አድራሻ (አማራጭ)",
            "checkout.emailPlaceholder": "you@example.com",
            "checkout.deliveryMethodLegend": "የማድረሻ ዘዴ",
            "checkout.deliveryOption": "ወደ ቤት ማድረስ",
            "checkout.pickupOption": "ከሱቅ መውሰድ",
            "checkout.addressLabel": "የማድረሻ አድራሻ",
            "checkout.addressPlaceholder": "መንገድ፣ አካባቢ፣ ከተማ...",
            "checkout.promoLabel": "ቅናሽ / የፕሮሞ ኮድ",
            "checkout.promoPlaceholder": "የፕሮሞ ኮድ ያስገቡ",
            "checkout.applyPromo": "ተግብር",
            "checkout.orderTotalLabel": "ጠቅላላ ትዕዛዝ:",
            "checkout.placeOrder": "ትዕዛዝ አስገባ",
            "support.heading": "እርዳታ ይፈልጋሉ?",
            "support.message": "ስለ ምርት ወይም ስለ ትዕዛዝዎ ጥያቄ አለዎት? ቡድናችን ለመርዳት ደስተኛ ነው። ትዕዛዝዎን ከመስጠትዎ በፊት በቴሌግራም ያግኙን ወይም ይደውሉልን።",
            "support.telegramLink": "💬 የቴሌግራም ድጋፍ",
            "support.phoneLink": "📞 ድጋፍ ይደውሉ",
         "footer.tagline": "ሊታመኑባቸው የሚችሉ የሞባይል ስልኮች እና መለዋወጫዎች።",
            "footer.quickLinksHeading": "ፈጣን አገናኞች",
            "footer.categoriesHeading": "ምድቦች",
            "footer.contactHeading": "ያግኙን",
          "footer.addressPlaceholder": "📍 ከሚሴ ዳዌ መስጊድ አካባቢ",
          "footer.phonePlaceholder": "📞 +251 930613306",
        "footer.emailPlaceholder": "✉️ ኢሜይል በቅርቡ ይታወቃል",
        "footer.hoursPlaceholder": "🕒 ከጠዋቱ 1:00 - ማታ 3:00",
            "footer.copyright": "መብቱ በህግ የተጠበቀ ነው።"
        },
        om: {
            "cart.heading": "Gaarii Bittaa Keessan",
            "cart.empty": "Gaariin keessan yeroo ammaa duwwaa dha.",
            "cart.subtotalLabel": "Waliigala xiqqaa:",
            "cart.continueShopping": "Bittaa Itti Fufi",
            "cart.proceedToCheckout": "Gara Kaffaltiitti Darbi",
            "checkout.heading": "Kaffaltii",
            "checkout.fullNameLabel": "Maqaa Guutuu",
            "checkout.fullNamePlaceholder": "Maqaa guutuu keessan galchaa",
            "checkout.phoneLabel": "Lakkoofsa Bilbilaa",
            "checkout.phonePlaceholder": "Fkn. 09XX XXX XXXX",
            "checkout.emailLabel": "Imeelii (filannoo)",
            "checkout.emailPlaceholder": "you@example.com",
            "checkout.deliveryMethodLegend": "Mala Geejjibaa",
            "checkout.deliveryOption": "Gara Manaatti Geessuu",
            "checkout.pickupOption": "Suuqa Irraa Fudhachuu",
            "checkout.addressLabel": "Teessoo Geejjibaa",
            "checkout.addressPlaceholder": "Karaa, naannoo, magaalaa...",
            "checkout.promoLabel": "Hir'isaa / Koodii Promo",
            "checkout.promoPlaceholder": "Koodii promo galchaa",
            "checkout.applyPromo": "Hojiirra Oolchi",
            "checkout.orderTotalLabel": "Waliigala Ajajaa:",
            "checkout.placeOrder": "Ajaja Galchi",
            "support.heading": "Gargaarsa Barbaaddaa?",
            "support.message": "Waa'ee oomishaa yookaan ajaja keessanii gaaffii qabduu? Gareen keenya gargaaruuf gammachuu qaba. Ajaja keessan galchuu dura Telegram irratti nu qunnabaa yookaan nuuf bilbilaa.",
            "support.telegramLink": "💬 Deeggarsa Telegram",
            "support.phoneLink": "📞 Deeggarsa Bilbilaa",
            "footer.tagline": "Bilbilaalee fi meeshaalee amanamuu.",
            "footer.quickLinksHeading": "Geessituu Saffisaa",
            "footer.categoriesHeading": "Ramaddiiwwan",
            "footer.contactHeading": "Nu Qunnabaa",
           "footer.addressPlaceholder": "📍 Kemisse Dawe masgiid naannoo",
          "footer.phonePlaceholder": "📞 +251 930613306",
          "footer.emailPlaceholder": "✉️ Imeelii dabalata",
         "footer.hoursPlaceholder": "🕒 Ganama 1:00 - Halkan 3:00",
            "footer.copyright": "Mirgi seeraan eegamaa dha."
        }
    };

    // Merge the new translations into the existing dictionary
    if (window.LondonApp && window.LondonApp.translations) {
        Object.keys(extraTranslations).forEach(function (lang) {
            window.LondonApp.translations[lang] = Object.assign(
                {},
                window.LondonApp.translations[lang] || {},
                extraTranslations[lang]
            );
        });
        
        // Force the page to re-translate instantly
        const lang = window.LondonApp.currentLanguage || "en";
        document.querySelectorAll("[data-i18n]").forEach(function(el) {
            const key = el.getAttribute("data-i18n");
            const dict = window.LondonApp.translations[lang] || {};
            const fallback = window.LondonApp.translations.en || {};
            el.textContent = dict[key] || fallback[key] || key;
        });
        document.querySelectorAll("[data-i18n-placeholder]").forEach(function(el) {
 const key = el.getAttribute("data-i18n-placeholder");
            const dict = window.LondonApp.translations[lang] || {};
            const fallback = window.LondonApp.translations.en || {};
            el.setAttribute("placeholder", dict[key] 
            || fallback[key] || key);
        });
    }
    console.log("[London App] All missing translations added!");
})();

 