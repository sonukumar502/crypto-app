# Crypto Tracker (Client-only)

A single-page crypto portfolio tracker that runs entirely on GitHub Pages — no backend. Built with React + Vite, Tailwind CSS (CDN), Chart.js and CoinGecko public API.

Features
- Dashboard: Top 50 coins (auto-refresh every 60s), search and sort
- Watchlist: Add/remove coins stored in localStorage
- Portfolio: Track holdings (quantity + avg buy), P&L, pie chart
- Coin detail modal with historical chart
- Offline caching (service worker) and aggressive in-memory caching of API results

API
- Data from CoinGecko (free public API). See https://www.coingecko.com/en/api

How to run locally

1. Install dependencies

```bash
# macOS (zsh)
npm install
npm run dev
```

2. Build for production (outputs into `docs/` for GitHub Pages)

```bash
npm run build
```

3. Commit and push. In GitHub repo settings → Pages, select `docs/` folder on `main` branch.

Notes
- Tailwind is included from CDN in `index.html` for quick setup. For production you may integrate Tailwind properly.
- The app caches API responses in memory for 60s to respect rate limits.
- This is a minimal MVP; styling is tailwind-based and responsive.

New features added:
- Debounced search on Dashboard (300ms) to reduce UI churn and API pressure.
- Export portfolio as CSV from the Portfolio view.

Service worker: a simple service worker caches app shell and recent CoinGecko responses for basic offline support. For production consider using Workbox for more robust caching strategies.

Credit
- CoinGecko: https://www.coingecko.com (Free API)

Screenshots
- Placeholder: add screenshots to README after running the app.

License
MIT
