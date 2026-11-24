// Helper to generate crisp inline SVG data URIs for banners & brand logos
// (used as primary artwork for pages 2-3 and as automatic fallback if any remote image fails)
function svgToUri(svg) {
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

function makeBannerSvg(title, subtitle, c1, c2, accent = "#ffffff") {
  return svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="240" viewBox="0 0 600 240">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${c1}" />
          <stop offset="100%" stop-color="${c2}" />
        </linearGradient>
        <radialGradient id="glow" cx="75%" cy="30%" r="55%">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.28" />
          <stop offset="100%" stop-color="${accent}" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="600" height="240" fill="url(#g)" />
      <rect width="600" height="240" fill="url(#glow)" />
      <circle cx="510" cy="45" r="95" fill="none" stroke="${accent}" stroke-opacity="0.12" stroke-width="2" />
      <circle cx="510" cy="45" r="60" fill="none" stroke="${accent}" stroke-opacity="0.18" stroke-width="2" />
      <text x="50%" y="48%" text-anchor="middle" fill="#ffffff" font-family="Lexend, Segoe UI, sans-serif" font-size="36" font-weight="700" letter-spacing="-0.5">${title.replace(/&/g, "&amp;")}</text>
      <text x="50%" y="66%" text-anchor="middle" fill="#ffffff" fill-opacity="0.78" font-family="Lexend, Segoe UI, sans-serif" font-size="16" font-weight="500">${subtitle.replace(/&/g, "&amp;")}</text>
    </svg>
  `);
}

function makeLogoSvg(initials, bg1, bg2, fg = "#ffffff") {
  return svgToUri(`
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
      <defs>
        <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bg1}" />
          <stop offset="100%" stop-color="${bg2}" />
        </linearGradient>
      </defs>
      <rect width="160" height="160" rx="22" fill="url(#lg)" />
      <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="${fg}" font-family="Lexend, Segoe UI, sans-serif" font-size="${initials.length > 2 ? 44 : 60}" font-weight="700">${initials.replace(/&/g, "&amp;")}</text>
    </svg>
  `);
}

const REMOTE_BASE = "https://thecodechest.com/public/assets/uploads";

const BRANDS = {
  51: {
    id: 51,
    name: "Rockstar Games",
    logo: `${REMOTE_BASE}/brand_logos/brand_51_fa915fc9454ef4b3.png`,
    fallbackLogo: makeLogoSvg("R★", "#ffb800", "#f29100", "#111111"),
    rating: 5.0,
    ratingCount: 122,
    description:
      "Rockstar Games is a leading video game developer and publisher known for creating immersive, story-driven experiences, including the Grand Theft Auto and Red Dead Redemption series. Its games combine expansive open worlds, detailed environments, memorable characters, and cinematic storytelling with action, exploration, and adventure."
  },
  30: {
    id: 30,
    name: "OpenAI",
    logo: `${REMOTE_BASE}/brand_logos/brand_30_0521384be0037376.png`,
    fallbackLogo: makeLogoSvg("AI", "#10a37f", "#0b7259"),
    rating: 4.9,
    ratingCount: 98,
    description:
      "OpenAI builds advanced AI tools including ChatGPT Plus, providing priority access to flagship reasoning models, voice mode, deep research, image generation, and faster response speeds for everyday productivity and creative workflows."
  },
  32: {
    id: 32,
    name: "Netflix",
    logo: `${REMOTE_BASE}/brand_logos/brand_32_762be56ac50274e6.png`,
    fallbackLogo: makeLogoSvg("N", "#141414", "#000000", "#e50914"),
    rating: 5.0,
    ratingCount: 144,
    description:
      "Netflix is a global streaming service offering award-winning TV shows, movies, anime, documentaries, and Netflix Originals in Ultra HD 4K with spatial audio and multi-device downloads."
  },
  27: {
    id: 27,
    name: "Playstation",
    logo: `${REMOTE_BASE}/brand_logos/brand_27_fb865ae5c4d07873.png`,
    fallbackLogo: makeLogoSvg("PS", "#00439c", "#0070d1"),
    rating: 4.9,
    ratingCount: 165,
    description:
      "PlayStation delivers iconic console gaming across PS5 and PS4, with digital gift cards for PlayStation Store and PlayStation Plus memberships unlocking online multiplayer, monthly games, and the Game Catalog."
  },
  40: {
    id: 40,
    name: "Google Gemini",
    logo: `${REMOTE_BASE}/brand_logos/brand_40_4ab8b6823e1a6fd1.png`,
    fallbackLogo: makeLogoSvg("✦", "#1a73e8", "#7c4dff"),
    rating: 4.9,
    ratingCount: 89,
    description:
      "Google Gemini brings multimodal AI assistance across writing, coding, research, and Google Workspace integration, with Google AI Pro unlocking expanded context windows and higher usage limits."
  },
  36: {
    id: 36,
    name: "Discord",
    logo: `${REMOTE_BASE}/brand_logos/brand_36_c5e8bc88c0652a52.png`,
    fallbackLogo: makeLogoSvg("DC", "#5865f2", "#404eed"),
    rating: 5.0,
    ratingCount: 131,
    description:
      "Discord is the voice, video, and text communication platform built for gaming communities and friend groups. Discord Nitro unlocks HD streaming, larger uploads, custom emojis everywhere, and server boosts."
  },
  28: {
    id: 28,
    name: "Xbox",
    logo: `${REMOTE_BASE}/brand_logos/brand_28_b3cf44d6954099fe.png`,
    fallbackLogo: makeLogoSvg("XB", "#107c10", "#0b5a0b"),
    rating: 4.8,
    ratingCount: 112,
    description:
      "Xbox Game Pass Ultimate gives players access to hundreds of high-quality console, PC, and cloud games, including day-one releases, EA Play membership, and online console multiplayer."
  },
  45: {
    id: 45,
    name: "NBC",
    logo: `${REMOTE_BASE}/brand_logos/brand_45_302724d7524c80fa.png`,
    fallbackLogo: makeLogoSvg("NBC", "#1b263b", "#415a77"),
    rating: 5.0,
    ratingCount: 74,
    description:
      "Peacock by NBCUniversal streams hit NBC shows, Universal Pictures releases, live sports including Premier League and WWE events, and exclusive original series."
  },
  35: {
    id: 35,
    name: "Crunchyroll",
    logo: `${REMOTE_BASE}/brand_logos/brand_35_955aebea9fb6ee75.png`,
    fallbackLogo: makeLogoSvg("CR", "#f47521", "#e05a00"),
    rating: 4.9,
    ratingCount: 118,
    description:
      "Crunchyroll is the world's largest dedicated anime streaming library, offering ad-free simulcasts straight from Japan, offline viewing, and dubbed & subbed catalogs."
  },
  48: {
    id: 48,
    name: "Slay the Spire 2",
    logo: `${REMOTE_BASE}/brand_logos/brand_48_f006e2057fd456d2.png`,
    fallbackLogo: makeLogoSvg("S2", "#2b193d", "#6c3082"),
    rating: 5.0,
    ratingCount: 64,
    description:
      "Slay the Spire 2 is Mega Crit's eagerly awaited roguelike deckbuilder sequel, featuring new characters, revamped relics, fresh Spire encounters, and deep tactical synergies."
  },
  43: {
    id: 43,
    name: "Paramount+",
    logo: `${REMOTE_BASE}/brand_logos/brand_43_e7c885f8a7df376e.png`,
    fallbackLogo: makeLogoSvg("P+", "#0064ff", "#003ea8"),
    rating: 4.9,
    ratingCount: 83,
    description:
      "Paramount+ streams blockbuster movies, CBS live TV, UEFA Champions League matches, SHOWTIME originals, and classic series ad-free with Paramount+ Premium."
  },
  52: {
    id: 52,
    name: "Marathon",
    logo: makeLogoSvg("MR", "#161922", "#00d48a"),
    fallbackLogo: makeLogoSvg("MR", "#161922", "#00d48a"),
    rating: 4.9,
    ratingCount: 57,
    description:
      "Marathon is Bungie's sci-fi PvP extraction shooter set on Tau Ceti IV, where cybernetic Runners scavenge lost artifacts in high-stakes squad expeditions."
  },
  41: {
    id: 41,
    name: "Resident Evil Requiem",
    logo: makeLogoSvg("RE", "#2b0c12", "#8a1526"),
    fallbackLogo: makeLogoSvg("RE", "#2b0c12", "#8a1526"),
    rating: 5.0,
    ratingCount: 94,
    description:
      "Resident Evil Requiem brings Capcom's signature survival horror back with atmospheric tension, intricate puzzles, and terrifying bioweapon encounters."
  },
  53: {
    id: 53,
    name: "Nioh 3",
    logo: makeLogoSvg("N3", "#2b1616", "#a83226"),
    fallbackLogo: makeLogoSvg("N3", "#2b1616", "#a83226"),
    rating: 4.8,
    ratingCount: 49,
    description:
      "Nioh 3 expands Team NINJA's fast-paced dark samurai action RPG formula with stance mastery, yokai abilities, and brutal boss duels."
  },
  54: {
    id: 54,
    name: "Crimson Desert",
    logo: makeLogoSvg("CD", "#361c18", "#9c4128"),
    fallbackLogo: makeLogoSvg("CD", "#361c18", "#9c4128"),
    rating: 4.9,
    ratingCount: 62,
    description:
      "Crimson Desert is an open-world action-adventure set across the war-torn continent of Pywel, blending visceral melee combat with sweeping cinematic exploration."
  },
  55: {
    id: 55,
    name: "Canva",
    logo: makeLogoSvg("Ca", "#00c4cc", "#7d2ae8"),
    fallbackLogo: makeLogoSvg("Ca", "#00c4cc", "#7d2ae8"),
    rating: 4.9,
    ratingCount: 109,
    description:
      "Canva Pro unlocks millions of premium templates, Brand Kits, Magic Resize, background removal, and AI design tools for creators and teams."
  },
  56: {
    id: 56,
    name: "Roblox",
    logo: makeLogoSvg("RB", "#1c222b", "#394657"),
    fallbackLogo: makeLogoSvg("RB", "#1c222b", "#394657"),
    rating: 4.9,
    ratingCount: 156,
    description:
      "Roblox lets millions of players explore user-created experiences and customize avatars with Robux digital gift cards."
  },
  57: {
    id: 57,
    name: "Steam",
    logo: makeLogoSvg("ST", "#171a21", "#1b2838"),
    fallbackLogo: makeLogoSvg("ST", "#171a21", "#1b2838"),
    rating: 5.0,
    ratingCount: 187,
    description:
      "Steam is the premier PC gaming platform for buying, downloading, and playing thousands of indie and AAA games, DLCs, and in-game items."
  },
  58: {
    id: 58,
    name: "Spotify",
    logo: makeLogoSvg("SP", "#1db954", "#12803a"),
    fallbackLogo: makeLogoSvg("SP", "#1db954", "#12803a"),
    rating: 4.9,
    ratingCount: 141,
    description:
      "Spotify Premium delivers ad-free music, podcasts, audiobooks, lossless-ready high-bitrate streaming, and unlimited offline downloads."
  },
  33: {
    id: 33,
    name: "Fortnite",
    logo: makeLogoSvg("FN", "#0b63e5", "#00c2ff"),
    fallbackLogo: makeLogoSvg("FN", "#0b63e5", "#00c2ff"),
    rating: 4.9,
    ratingCount: 173,
    description:
      "Fortnite V-Bucks gift cards let players unlock Battle Passes, outfits, emotes, gliders, and seasonal cosmetics across Battle Royale, LEGO Fortnite, and Festival."
  },
  59: {
    id: 59,
    name: "CapCut",
    logo: makeLogoSvg("CC", "#15181e", "#323846"),
    fallbackLogo: makeLogoSvg("CC", "#15181e", "#323846"),
    rating: 4.8,
    ratingCount: 84,
    description:
      "CapCut Pro provides creator-grade video editing effects, AI captions, smooth slow-motion, cloud storage, and watermark-free 4K exports."
  },
  60: {
    id: 60,
    name: "Amazon",
    logo: makeLogoSvg("az", "#232f3e", "#ff9900"),
    fallbackLogo: makeLogoSvg("az", "#232f3e", "#ff9900"),
    rating: 5.0,
    ratingCount: 192,
    description:
      "Amazon Digital Gift Cards can be redeemed toward millions of products, electronics, books, Prime subscriptions, and digital entertainment."
  },
  61: {
    id: 61,
    name: "WWE 2K26",
    logo: makeLogoSvg("2K", "#1a1a1a", "#c8102e"),
    fallbackLogo: makeLogoSvg("2K", "#1a1a1a", "#c8102e"),
    rating: 4.8,
    ratingCount: 51,
    description:
      "WWE 2K26 Attitude Era Edition celebrates legendary superstars, classic arenas, expanded Showcase mode, and MyGM upgrades."
  },
  62: {
    id: 62,
    name: "Overwatch",
    logo: makeLogoSvg("OW", "#f99e1a", "#d97706"),
    fallbackLogo: makeLogoSvg("OW", "#f99e1a", "#d97706"),
    rating: 4.9,
    ratingCount: 77,
    description:
      "Overwatch Coins unlock Mythic skins, Premium Battle Passes, hero bundles, and seasonal cosmetics in Overwatch."
  },
  63: {
    id: 63,
    name: "Hytale",
    logo: makeLogoSvg("HY", "#1e6b52", "#2fb57a"),
    fallbackLogo: makeLogoSvg("HY", "#1e6b52", "#2fb57a"),
    rating: 5.0,
    ratingCount: 105,
    description:
      "Hytale combines sandbox block-building creativity with RPG adventure, dungeons, minigames, and built-in modding tools."
  }
};

const POPULAR_BRAND_IDS = [35, 41, 33];

const COUPONS = [
  // ==================== PAGE 1 (12 codes) ====================
  {
    id: 48,
    title: "Grand Theft Auto 6",
    brandId: 51,
    rating: "5.0",
    ratingCount: 122,
    hot: true,
    incentive: "Free Game Key",
    shortDesc: "XBOX /PS5",
    codesLeft: 162,
    expiresText: "Expires in 3",
    expiresValue: "3",
    expiresLabel: "Expires in",
    noExpiration: false,
    usesToday: 45,
    code: "GTA6- Leon-8842-336P".replace(" ", ""),
    banner: `${REMOTE_BASE}/coupon_banners/coupon_48_6f86e103e3d7216b.png`,
    fallbackBanner: makeBannerSvg("GTA VI", "GRAND THEFT AUTO 6", "#ff5e62", "#4e2a84", "#ffd166"),
    detailsHtml: `
      <p>Grand Theft Auto VI (GTA 6) is an upcoming open-world action-adventure game from Rockstar Games that combines cinematic storytelling with an expansive setting to explore. Set in the fictional state of Leonida, home to Vice City, the game follows Jason and Lucia as they become caught in a dangerous criminal conspiracy. Key features include:</p>
      <ul>
        <li><strong>An expansive open world</strong> featuring Vice City and the surrounding regions of Leonida</li>
        <li><strong>Two central characters, Jason and Lucia,</strong> whose partnership lies at the heart of the story</li>
        <li><strong>Next-gen visuals and dynamic world systems</strong> tailored for PlayStation 5 and Xbox Series X|S</li>
      </ul>
    `
  },
  {
    id: 27,
    title: "ChatGPT Plus Upgrade",
    brandId: 30,
    rating: "4.9",
    ratingCount: 98,
    hot: true,
    incentive: "12 Months Free",
    shortDesc: "Get 12 Months of ChatGPT Plus",
    codesLeft: 306,
    expiresText: "Expires in 8 days",
    expiresValue: "8 days",
    expiresLabel: "Expires in",
    noExpiration: false,
    usesToday: 31,
    code: "GPTP-12MO-7941-K82X",
    banner: `${REMOTE_BASE}/coupon_banners/coupon_27_4eb3c9f9c990c038.png`,
    fallbackBanner: makeBannerSvg("ChatGPT", "PLUS UPGRADE", "#38b2ac", "#6b46c1", "#ffffff"),
    detailsHtml: `
      <p>Upgrade your OpenAI account to ChatGPT Plus for 12 full months with priority access to flagship reasoning models, image generation, file analysis, and faster response speeds.</p>
      <ul>
        <li><strong>Priority model access</strong> even during peak usage hours</li>
        <li><strong>Advanced data analysis, voice mode, and custom GPTs</strong> included</li>
        <li><strong>Instant redemption</strong> on new or existing eligible accounts</li>
      </ul>
    `
  },
  {
    id: 32,
    title: "Netflix Premium Subscription",
    brandId: 32,
    rating: "5.0",
    ratingCount: 144,
    hot: true,
    incentive: "12 Months Free",
    shortDesc: "Get 12 Months of Netflix Premium",
    codesLeft: 205,
    expiresText: "Expires in 5 days",
    expiresValue: "5 days",
    expiresLabel: "Expires in",
    noExpiration: false,
    usesToday: 27,
    code: "NFLX-4KUH-5520-9Q4M",
    banner: `${REMOTE_BASE}/coupon_banners/coupon_32_a076c8475ef29b0b.png`,
    fallbackBanner: makeBannerSvg("NETFLIX", "PREMIUM 4K UHD", "#141414", "#8b0000", "#e50914"),
    detailsHtml: `
      <p>Enjoy 12 months of Netflix Premium featuring Ultra HD 4K streaming, HDR support, spatial audio, and simultaneous viewing on up to 4 supported devices.</p>
      <ul>
        <li><strong>Ad-free movies, series, and Netflix Originals</strong> in 4K UHD</li>
        <li><strong>Offline downloads</strong> on up to 6 mobile or tablet devices</li>
        <li><strong>Works worldwide</strong> via standard Netflix gift redemption</li>
      </ul>
    `
  },
  {
    id: 23,
    title: "PS Store Gift Card Codes",
    brandId: 27,
    rating: "4.9",
    ratingCount: 110,
    hot: false,
    incentive: "Free Gift Card",
    shortDesc: "$50 Playstation Store Digital Gift Card",
    codesLeft: 335,
    expiresText: "Expires in 7 days",
    expiresValue: "7 days",
    expiresLabel: "Expires in",
    noExpiration: false,
    usesToday: 30,
    code: "PSN5-0USD-4198-W72R",
    banner: `${REMOTE_BASE}/coupon_banners/coupon_23_9aa1aa308724ea94.png`,
    fallbackBanner: makeBannerSvg("PlayStation Store", "$50 DIGITAL GIFT CARD", "#003791", "#0072ce", "#66b2ff"),
    detailsHtml: `
      <p>Redeem a $50 PlayStation Store digital voucher directly to your PSN wallet to purchase full games, DLC expansions, in-game currency, and subscriptions.</p>
      <ul>
        <li><strong>Compatible with PS5, PS4, and Web Store</strong></li>
        <li><strong>No credit card required</strong> to redeem wallet balance</li>
        <li><strong>Hand-verified digital voucher</strong> ready for immediate use</li>
      </ul>
    `
  },
  {
    id: 22,
    title: "PS Plus Discount Codes",
    brandId: 27,
    rating: "4.9",
    ratingCount: 105,
    hot: true,
    incentive: "12 Months Free",
    shortDesc: "Get 12 Months of PS Plus Premium",
    codesLeft: 248,
    expiresText: "Expires in 11 days",
    expiresValue: "11 days",
    expiresLabel: "Expires in",
    noExpiration: false,
    usesToday: 40,
    code: "PSPL-PREM-6034-V91B",
    banner: `${REMOTE_BASE}/coupon_banners/coupon_22_98ee1d065277298a.png`,
    fallbackBanner: makeBannerSvg("PlayStation Plus", "12 MONTHS PREMIUM", "#111827", "#1e3a8a", "#facc15"),
    detailsHtml: `
      <p>Unlock 12 months of PlayStation Plus Premium including online multiplayer, monthly games, the Game Catalog, Classics Catalog, game trials, and cloud streaming.</p>
      <ul>
        <li><strong>Hundreds of PS5, PS4, and Classic titles</strong> included</li>
        <li><strong>Exclusive PlayStation Store member discounts</strong></li>
        <li><strong>Cloud storage</strong> for game saves across consoles</li>
      </ul>
    `
  },
  {
    id: 31,
    title: "Gemini Pro Upgrade",
    brandId: 40,
    rating: "4.9",
    ratingCount: 89,
    hot: true,
    incentive: "12 Months Free",
    shortDesc: "Get 12 Months of Google AI Pro",
    codesLeft: 279,
    expiresText: "Expires in 9 days",
    expiresValue: "9 days",
    expiresLabel: "Expires in",
    noExpiration: false,
    usesToday: 60,
    code: "GMNI-PRO1-9217-Z48C",
    banner: `${REMOTE_BASE}/coupon_banners/coupon_31_4b2d4ee9822eec8e.png`,
    fallbackBanner: makeBannerSvg("Google Gemini", "GOOGLE AI PRO", "#0f172a", "#3b82f6", "#a855f7"),
    detailsHtml: `
      <p>Activate 12 months of Google AI Pro with expanded access to Gemini models, Deep Research, NotebookLM enhancements, and 2 TB of Google One cloud storage.</p>
      <ul>
        <li><strong>Higher limits for coding, writing, and multimodal tasks</strong></li>
        <li><strong>Integrated across Gmail, Docs, and Drive</strong></li>
        <li><strong>2 TB cloud storage</strong> included with the plan</li>
      </ul>
    `
  },
  {
    id: 29,
    title: "Discord Nitro Codes",
    brandId: 36,
    rating: "5.0",
    ratingCount: 131,
    hot: true,
    incentive: "12 Months Free",
    shortDesc: "Get 12 Months of Discord Nitro",
    codesLeft: 194,
    expiresText: "No expiration",
    expiresValue: "Never",
    expiresLabel: "Expiration",
    noExpiration: true,
    usesToday: 60,
    code: "NTRO-12YR-3385-J64N",
    banner: `${REMOTE_BASE}/coupon_banners/coupon_29_07433b9701f9d8f3.png`,
    fallbackBanner: makeBannerSvg("Discord NITRO", "12 MONTHS SUBSCRIPTION", "#5865f2", "#c471ed", "#ffffff"),
    detailsHtml: `
      <p>Supercharge your Discord experience with 12 months of Discord Nitro: 4K 60fps screen sharing, 500 MB file uploads, 2 Server Boosts, custom profiles, and global animated emojis.</p>
      <ul>
        <li><strong>2 Free Server Boosts</strong> plus 30% off additional boosts</li>
        <li><strong>Custom soundboard and emojis</strong> across every server</li>
        <li><strong>No expiration date</strong> on eligible Nitro redemptions</li>
      </ul>
    `
  },
  {
    id: 36,
    title: "Xbox Game Pass Ultimate",
    brandId: 28,
    rating: "4.8",
    ratingCount: 112,
    hot: true,
    incentive: "12 Months Free",
    shortDesc: "Get 12 Months of Game Pass Ultimate",
    codesLeft: 221,
    expiresText: "No expiration",
    expiresValue: "Never",
    expiresLabel: "Expiration",
    noExpiration: true,
    usesToday: 66,
    code: "XGPU-12MO-7741-M20K",
    banner: `${REMOTE_BASE}/coupon_banners/coupon_36_d791fe586706c356.png`,
    fallbackBanner: makeBannerSvg("XBOX GAME PASS", "ULTIMATE 12 MONTHS", "#0b3d0b", "#107c10", "#84cc16"),
    detailsHtml: `
      <p>Play hundreds of console, PC, and cloud games for 12 full months with Xbox Game Pass Ultimate, including day-one first-party launches and EA Play.</p>
      <ul>
        <li><strong>Console, PC, and Xbox Cloud Gaming</strong> all in one pass</li>
        <li><strong>EA Play membership &amp; member perks</strong> included</li>
        <li><strong>Redeemable via Microsoft Store</strong> or Xbox console</li>
      </ul>
    `
  },
  {
    id: 42,
    title: "Peacock Promo Codes",
    brandId: 45,
    rating: "5.0",
    ratingCount: 74,
    hot: true,
    incentive: "12 Months Free",
    shortDesc: "Get 12 Months of Peacock Premium Plus",
    codesLeft: 264,
    expiresText: "Expires in 6 days",
    expiresValue: "6 days",
    expiresLabel: "Expires in",
    noExpiration: false,
    usesToday: 56,
    code: "PCK+-PREM-2890-T51L",
    banner: `${REMOTE_BASE}/coupon_banners/coupon_42_b4cafc8fe5a05dc7.png`,
    fallbackBanner: makeBannerSvg("Peacock", "PREMIUM PLUS 12 MONTHS", "#0f172a", "#1e293b", "#f59e0b"),
    detailsHtml: `
      <p>Stream Peacock Premium Plus ad-free for 12 months, including live local NBC channels, Premier League matches, Universal movies, and offline downloads.</p>
      <ul>
        <li><strong>Ad-free on-demand streaming</strong> (limited exclusions apply)</li>
        <li><strong>Live sports and local NBC broadcast</strong> included</li>
        <li><strong>Download select titles</strong> to watch offline</li>
      </ul>
    `
  },
  {
    id: 28,
    title: "Crunchyroll Premium Codes",
    brandId: 35,
    rating: "4.9",
    ratingCount: 118,
    hot: false,
    incentive: "12 Months Free",
    shortDesc: "Get 12 Months of Crunchyroll Premium",
    codesLeft: 312,
    expiresText: "No expiration",
    expiresValue: "Never",
    expiresLabel: "Expiration",
    noExpiration: true,
    usesToday: 50,
    code: "CRYL-MEGA-6412-P83F",
    banner: `${REMOTE_BASE}/coupon_banners/coupon_28_71eb927332f5dcb9.png`,
    fallbackBanner: makeBannerSvg("Crunchyroll", "ANIME PREMIUM 12 MONTHS", "#231942", "#f47521", "#ffffff"),
    detailsHtml: `
      <p>Watch thousands of episodes of ad-free anime with Crunchyroll Premium, featuring same-day simulcasts from Japan and offline viewing on mobile devices.</p>
      <ul>
        <li><strong>No ads</strong> across the entire anime catalog</li>
        <li><strong>Simulcast episodes</strong> hours after Japanese broadcast</li>
        <li><strong>Offline viewing</strong> on supported mobile apps</li>
      </ul>
    `
  },
  {
    id: 45,
    title: "Slay the Spire 2 Early Access",
    brandId: 48,
    rating: "5.0",
    ratingCount: 64,
    hot: true,
    incentive: "Free Game Key",
    shortDesc: "PC / STEAM",
    codesLeft: 185,
    expiresText: "Expires in 11 days",
    expiresValue: "11 days",
    expiresLabel: "Expires in",
    noExpiration: false,
    usesToday: 36,
    code: "STS2-STEA-4920-D19Q",
    banner: `${REMOTE_BASE}/coupon_banners/coupon_45_1e26b222e9e0841e.png`,
    fallbackBanner: makeBannerSvg("Slay the Spire 2", "EARLY ACCESS • STEAM", "#1e1030", "#6d28d9", "#f472b6"),
    detailsHtml: `
      <p>Ascend the Spire once again with an Early Access PC Steam key for Slay the Spire 2. Discover new playable classes, hundreds of cards, and fresh relic synergies.</p>
      <ul>
        <li><strong>Full Steam Early Access activation</strong> with future updates</li>
        <li><strong>New characters, cards, potions, and bosses</strong></li>
        <li><strong>Region-free PC key</strong> redeemable via Steam client</li>
      </ul>
    `
  },
  {
    id: 40,
    title: "Paramount+ Premium Promo Codes",
    brandId: 43,
    rating: "4.9",
    ratingCount: 83,
    hot: true,
    incentive: "12 Months Free",
    shortDesc: "Get 12 Months of Paramount+ Premium",
    codesLeft: 238,
    expiresText: "Expires in 6 days",
    expiresValue: "6 days",
    expiresLabel: "Expires in",
    noExpiration: false,
    usesToday: 42,
    code: "PMNT-SHOW-8153-H74V",
    banner: `${REMOTE_BASE}/coupon_banners/coupon_40_f765716de611f55b.png`,
    fallbackBanner: makeBannerSvg("Paramount+", "PREMIUM WITH SHOWTIME", "#001f5c", "#0064ff", "#93c5fd"),
    detailsHtml: `
      <p>Get 12 months of Paramount+ Premium including SHOWTIME originals, live CBS broadcasts, UEFA Champions League matches, and ad-free on-demand movies.</p>
      <ul>
        <li><strong>Includes SHOWTIME library</strong> and exclusive originals</li>
        <li><strong>4K UHD, Dolby Vision, and offline downloads</strong></li>
        <li><strong>Valid for eligible new &amp; returning subscribers</strong></li>
      </ul>
    `
  },

  // ==================== PAGE 2 (12 codes) ====================
  {
    id: 61,
    title: "Marathon Deluxe Edition",
    brandId: 52,
    rating: "4.9",
    ratingCount: 57,
    hot: true,
    incentive: "Free Game Key",
    shortDesc: "PC / PS5 / XBOX",
    codesLeft: 174,
    expiresText: "Expires in 9 days",
    expiresValue: "9 days",
    expiresLabel: "Expires in",
    noExpiration: false,
    usesToday: 38,
    code: "MRTH-DLXE-5128-A47R",
    banner: makeBannerSvg("MARATHON", "DELUXE EDITION", "#0e131f", "#0d9488", "#2dd4bf"),
    fallbackBanner: makeBannerSvg("MARATHON", "DELUXE EDITION", "#0e131f", "#0d9488", "#2dd4bf"),
    detailsHtml: `
      <p>Claim a Deluxe Edition key for Bungie's sci-fi extraction shooter Marathon, including exclusive Runner cosmetics, weapon blueprints, and seasonal pass access.</p>
      <ul>
        <li><strong>Full base game + Deluxe cosmetic bundle</strong></li>
        <li><strong>Cross-play and cross-save</strong> across PC, PS5, and Xbox</li>
      </ul>
    `
  },
  {
    id: 62,
    title: "Resident Evil Requiem Deluxe Edition",
    brandId: 41,
    rating: "5.0",
    ratingCount: 94,
    hot: true,
    incentive: "Free Game Key",
    shortDesc: "PC / PS5 / XBOX",
    codesLeft: 158,
    expiresText: "Expires in 4 days",
    expiresValue: "4 days",
    expiresLabel: "Expires in",
    noExpiration: false,
    usesToday: 52,
    code: "RERE-QDLX-9043-X61E",
    banner: makeBannerSvg("Resident Evil Requiem", "DELUXE EDITION", "#1c070b", "#7f1d1d", "#f87171"),
    fallbackBanner: makeBannerSvg("Resident Evil Requiem", "DELUXE EDITION", "#1c070b", "#7f1d1d", "#f87171"),
    detailsHtml: `
      <p>Survive the nightmare in Resident Evil Requiem Deluxe Edition, featuring bonus costumes, classic soundtrack swap, and extra survival supply packs.</p>
      <ul>
        <li><strong>Deluxe Edition DLC pack</strong> included at launch</li>
        <li><strong>Supports Steam, PlayStation 5, and Xbox Series X|S</strong></li>
      </ul>
    `
  },
  {
    id: 63,
    title: "Nioh 3 Standard Edition",
    brandId: 53,
    rating: "4.8",
    ratingCount: 49,
    hot: false,
    incentive: "Free Game Key",
    shortDesc: "PC / PS5",
    codesLeft: 215,
    expiresText: "Expires in 10 days",
    expiresValue: "10 days",
    expiresLabel: "Expires in",
    noExpiration: false,
    usesToday: 29,
    code: "NIOH-3STD-3761-S82P",
    banner: makeBannerSvg("NIOH 3", "STANDARD EDITION", "#1f1010", "#991b1b", "#fbbf24"),
    fallbackBanner: makeBannerSvg("NIOH 3", "STANDARD EDITION", "#1f1010", "#991b1b", "#fbbf24"),
    detailsHtml: `
      <p>Master lethal samurai stances and yokai powers in Nioh 3 Standard Edition. Redeemable on PC (Steam) or PlayStation 5.</p>
      <ul>
        <li><strong>Full single-player campaign &amp; online co-op</strong></li>
        <li><strong>Instant digital key delivery</strong></li>
      </ul>
    `
  },
  {
    id: 64,
    title: "Crimson Desert Standard Edition",
    brandId: 54,
    rating: "4.9",
    ratingCount: 62,
    hot: true,
    incentive: "Free Game Key",
    shortDesc: "PC / PS5 / XBOX",
    codesLeft: 199,
    expiresText: "Expires in 7 days",
    expiresValue: "7 days",
    expiresLabel: "Expires in",
    noExpiration: false,
    usesToday: 44,
    code: "CRMD-PYWL-6619-U35T",
    banner: makeBannerSvg("Crimson Desert", "STANDARD EDITION", "#24120c", "#b45309", "#fde68a"),
    fallbackBanner: makeBannerSvg("Crimson Desert", "STANDARD EDITION", "#24120c", "#b45309", "#fde68a"),
    detailsHtml: `
      <p>Explore the sweeping open world of Pywel in Crimson Desert Standard Edition with dynamic combat, mount traversal, and epic boss encounters.</p>
      <ul>
        <li><strong>Full Standard Edition digital key</strong></li>
        <li><strong>Available for PC, PS5, and Xbox Series X|S</strong></li>
      </ul>
    `
  },
  {
    id: 65,
    title: "Canva Pro Upgrade Codes",
    brandId: 55,
    rating: "4.9",
    ratingCount: 109,
    hot: false,
    incentive: "12 Months Free",
    shortDesc: "Get 12 Months of Canva Pro",
    codesLeft: 289,
    expiresText: "No expiration",
    expiresValue: "Never",
    expiresLabel: "Expiration",
    noExpiration: true,
    usesToday: 48,
    code: "CNVA-PRO1-8824-L59G",
    banner: makeBannerSvg("Canva Pro", "12 MONTHS CREATIVE SUITE", "#00a8b5", "#6d28d9", "#ffffff"),
    fallbackBanner: makeBannerSvg("Canva Pro", "12 MONTHS CREATIVE SUITE", "#00a8b5", "#6d28d9", "#ffffff"),
    detailsHtml: `
      <p>Unlock 12 months of Canva Pro with unlimited premium templates, 1-click Background Remover, Magic Studio AI tools, and 1 TB cloud storage.</p>
      <ul>
        <li><strong>100M+ stock photos, graphics, and fonts</strong></li>
        <li><strong>Brand Kits &amp; Magic Resize</strong> for instant social formatting</li>
      </ul>
    `
  },
  {
    id: 66,
    title: "Robux Digital Gift Cards",
    brandId: 56,
    rating: "4.9",
    ratingCount: 156,
    hot: true,
    incentive: "Free Gift Card",
    shortDesc: "4,500 Robux Digital Gift Card",
    codesLeft: 342,
    expiresText: "Expires in 6 days",
    expiresValue: "6 days",
    expiresLabel: "Expires in",
    noExpiration: false,
    usesToday: 71,
    code: "RBLX-4500-2398-C41M",
    banner: makeBannerSvg("ROBLOX", "4,500 ROBUX GIFT CARD", "#111827", "#334155", "#38bdf8"),
    fallbackBanner: makeBannerSvg("ROBLOX", "4,500 ROBUX GIFT CARD", "#111827", "#334155", "#38bdf8"),
    detailsHtml: `
      <p>Redeem 4,500 Robux directly into your Roblox account to purchase avatar items, game passes, and exclusive virtual accessories.</p>
      <ul>
        <li><strong>Includes bonus virtual item</strong> upon redemption</li>
        <li><strong>Works on PC, mobile, and console</strong> Roblox accounts</li>
      </ul>
    `
  },
  {
    id: 67,
    title: "Steam Gift Card Codes",
    brandId: 57,
    rating: "5.0",
    ratingCount: 187,
    hot: true,
    incentive: "Free Gift Card",
    shortDesc: "$50 Steam Wallet Digital Code",
    codesLeft: 256,
    expiresText: "No expiration",
    expiresValue: "Never",
    expiresLabel: "Expiration",
    noExpiration: true,
    usesToday: 63,
    code: "STMW-50US-7104-B96K",
    banner: makeBannerSvg("STEAM", "$50 WALLET GIFT CARD", "#171a21", "#1b2838", "#66c0f4"),
    fallbackBanner: makeBannerSvg("STEAM", "$50 WALLET GIFT CARD", "#171a21", "#1b2838", "#66c0f4"),
    detailsHtml: `
      <p>Add $50 directly to your Steam Wallet to buy PC games, Steam Deck verified hits, DLCs, and Community Market items.</p>
      <ul>
        <li><strong>Instant Steam Wallet balance top-up</strong></li>
        <li><strong>Never expires</strong> once added to your account</li>
      </ul>
    `
  },
  {
    id: 68,
    title: "Spotify Premium Subscription",
    brandId: 58,
    rating: "4.9",
    ratingCount: 141,
    hot: false,
    incentive: "12 Months Free",
    shortDesc: "Get 12 Months of Spotify Premium",
    codesLeft: 294,
    expiresText: "Expires in 8 days",
    expiresValue: "8 days",
    expiresLabel: "Expires in",
    noExpiration: false,
    usesToday: 54,
    code: "SPTF-PREM-4418-N23Y",
    banner: makeBannerSvg("Spotify", "12 MONTHS PREMIUM", "#0b2e18", "#1db954", "#ffffff"),
    fallbackBanner: makeBannerSvg("Spotify", "12 MONTHS PREMIUM", "#0b2e18", "#1db954", "#ffffff"),
    detailsHtml: `
      <p>Listen to ad-free music, podcasts, and curated playlists offline for 12 full months with Spotify Premium Individual.</p>
      <ul>
        <li><strong>Unlimited skips &amp; offline downloads</strong></li>
        <li><strong>Very High audio quality</strong> across all devices</li>
      </ul>
    `
  },
  {
    id: 69,
    title: "Fortnite V-Bucks Gift Card Codes",
    brandId: 33,
    rating: "4.9",
    ratingCount: 173,
    hot: true,
    incentive: "Free Gift Card",
    shortDesc: "5,000 V-Bucks Digital Card",
    codesLeft: 218,
    expiresText: "Expires in 5 days",
    expiresValue: "5 days",
    expiresLabel: "Expires in",
    noExpiration: false,
    usesToday: 68,
    code: "FNVB-5000-8312-R77W",
    banner: makeBannerSvg("FORTNITE", "5,000 V-BUCKS CARD", "#0c2d6b", "#0284c7", "#38bdf8"),
    fallbackBanner: makeBannerSvg("FORTNITE", "5,000 V-BUCKS CARD", "#0c2d6b", "#0284c7", "#38bdf8"),
    detailsHtml: `
      <p>Redeem 5,000 V-Bucks on your Epic Games account to pick up Battle Passes, Item Shop bundles, outfits, and emotes.</p>
      <ul>
        <li><strong>Redeemable via fortnite.com/vbuckscard</strong></li>
        <li><strong>Supports PC, PlayStation, Xbox, and Nintendo Switch</strong></li>
      </ul>
    `
  },
  {
    id: 70,
    title: "CapCut Pro Upgrade Codes",
    brandId: 59,
    rating: "4.8",
    ratingCount: 84,
    hot: false,
    incentive: "12 Months Free",
    shortDesc: "Get 12 Months of CapCut Pro",
    codesLeft: 325,
    expiresText: "Expires in 12 days",
    expiresValue: "12 days",
    expiresLabel: "Expires in",
    noExpiration: false,
    usesToday: 34,
    code: "CPCT-PRO1-5927-E14J",
    banner: makeBannerSvg("CapCut Pro", "12 MONTHS CREATOR PLAN", "#111827", "#374151", "#e5e7eb"),
    fallbackBanner: makeBannerSvg("CapCut Pro", "12 MONTHS CREATOR PLAN", "#111827", "#374151", "#e5e7eb"),
    detailsHtml: `
      <p>Access CapCut Pro for 12 months on desktop, web, and mobile with premium effects, auto-captions, AI video tools, and cloud sync.</p>
      <ul>
        <li><strong>Watermark-free 4K 60fps exports</strong></li>
        <li><strong>100 GB cloud workspace</strong> for cross-device editing</li>
      </ul>
    `
  },
  {
    id: 71,
    title: "Amazon Gift Card Codes",
    brandId: 60,
    rating: "5.0",
    ratingCount: 192,
    hot: true,
    incentive: "Free Gift Card",
    shortDesc: "$50 Amazon Digital Gift Card",
    codesLeft: 207,
    expiresText: "No expiration",
    expiresValue: "Never",
    expiresLabel: "Expiration",
    noExpiration: true,
    usesToday: 74,
    code: "AMZN-50DG-9482-Q60F",
    banner: makeBannerSvg("amazon", "$50 DIGITAL GIFT CARD", "#1e293b", "#b45309", "#fbbf24"),
    fallbackBanner: makeBannerSvg("amazon", "$50 DIGITAL GIFT CARD", "#1e293b", "#b45309", "#fbbf24"),
    detailsHtml: `
      <p>Apply a $50 digital gift card balance directly to your Amazon account for eligible purchases across electronics, gaming, books, and everyday essentials.</p>
      <ul>
        <li><strong>No fees and no expiration date</strong></li>
        <li><strong>Instant redemption</strong> in Your Account &gt; Gift Cards</li>
      </ul>
    `
  },
  {
    id: 72,
    title: "WWE 2K26 Attitude Era Edition",
    brandId: 61,
    rating: "4.8",
    ratingCount: 51,
    hot: false,
    incentive: "Free Game Key",
    shortDesc: "PC / PS5 / XBOX",
    codesLeft: 191,
    expiresText: "Expires in 9 days",
    expiresValue: "9 days",
    expiresLabel: "Expires in",
    noExpiration: false,
    usesToday: 26,
    code: "WWE2-K26A-3175-V42Z",
    banner: makeBannerSvg("WWE 2K26", "ATTITUDE ERA EDITION", "#18181b", "#991b1b", "#f87171"),
    fallbackBanner: makeBannerSvg("WWE 2K26", "ATTITUDE ERA EDITION", "#18181b", "#991b1b", "#f87171"),
    detailsHtml: `
      <p>Step into the ring with WWE 2K26 Attitude Era Edition, featuring classic legends, Season Pass access, and bonus MyFACTION packs.</p>
      <ul>
        <li><strong>Includes Season Pass &amp; Attitude Era Legends Pack</strong></li>
        <li><strong>Digital activation for PC, PS5, or Xbox</strong></li>
      </ul>
    `
  },

  // ==================== PAGE 3 (2 codes) ====================
  {
    id: 73,
    title: "11,800 Overwatch Coins",
    brandId: 62,
    rating: "4.9",
    ratingCount: 77,
    hot: true,
    incentive: "Free Gift Card",
    shortDesc: "11,800 Overwatch Coins Bundle",
    codesLeft: 234,
    expiresText: "Expires in 6 days",
    expiresValue: "6 days",
    expiresLabel: "Expires in",
    noExpiration: false,
    usesToday: 41,
    code: "OW2C-118K-6509-M38H",
    banner: makeBannerSvg("OVERWATCH", "11,800 COINS BUNDLE", "#1f2937", "#d97706", "#fde047"),
    fallbackBanner: makeBannerSvg("OVERWATCH", "11,800 COINS BUNDLE", "#1f2937", "#d97706", "#fde047"),
    detailsHtml: `
      <p>Top up your Battle.net account with 11,800 Overwatch Coins to unlock Mythic hero skins, Premium Battle Passes, and seasonal bundles.</p>
      <ul>
        <li><strong>Redeemable via Battle.net</strong> and linked console accounts</li>
        <li><strong>Includes bonus coin tier</strong></li>
      </ul>
    `
  },
  {
    id: 74,
    title: "Hytale Founder's Edition",
    brandId: 63,
    rating: "5.0",
    ratingCount: 105,
    hot: true,
    incentive: "Free Game Key",
    shortDesc: "PC / LAUNCHER",
    codesLeft: 169,
    expiresText: "Expires in 10 days",
    expiresValue: "10 days",
    expiresLabel: "Expires in",
    noExpiration: false,
    usesToday: 59,
    code: "HYTL-FNDR-4802-G95D",
    banner: makeBannerSvg("HYTALE", "FOUNDER'S EDITION", "#0f3d2e", "#15803d", "#86efac"),
    fallbackBanner: makeBannerSvg("HYTALE", "FOUNDER'S EDITION", "#0f3d2e", "#15803d", "#86efac"),
    detailsHtml: `
      <p>Embark on an adventure across Orbis with Hytale Founder's Edition, including exclusive founder cosmetics, early beta perks, and full modding suite access.</p>
      <ul>
        <li><strong>Full PC game + Founder's cosmetic pack</strong></li>
        <li><strong>Includes Adventure Mode, Minigames, and Creator Tools</strong></li>
      </ul>
    `
  }
];
