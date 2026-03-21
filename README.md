# Crypto Tracker (Client-only)

A single-page, client-only crypto portfolio tracker built with React + Vite. There is no backend — all data comes from CoinGecko's free public API and user data is stored in `localStorage`. The project is configured to build into the `docs/` folder so it can be hosted on GitHub Pages.

## Live behavior (what this app actually does)

- Dashboard
  - Shows the top 50 coins (rank, name, price, 24h %, 7d %, market cap, volume).
  - Auto-refreshes markets every 10s (in-memory cached API responses, 10s TTL).
  - Search (debounced 300ms) and sorting by price / 24h change / market cap.

- Watchlist (localStorage)
  - Add/remove coins from the dashboard table.
  - Persists across sessions.

- Mini Portfolio (localStorage)
  - Add coin entries with `quantity` and `avg buy price` (USD).
  - Shows real-time portfolio value using live prices and unrealized P&L %.
  - Pie chart of allocation (Chart.js via `react-chartjs-2`).
  - Export portfolio as CSV (id, quantity, buyPrice, currentPrice, value).

- Coin Detail Modal
  - Click a coin to open a modal with live price, basic metrics (ATH, rank) and a historical price chart (7d by default) powered by Chart.js.

- Offline & caching
  - A simple service worker caches app shell assets and recent CoinGecko GET responses for basic offline fallback. (Note: the SW is intentionally minimal; for production use Workbox or a more robust strategy.)

## Technical notes / implementation details

- Frameworks & libraries: React 18 + Vite, Tailwind CSS (CDN for quick setup), Chart.js, react-chartjs-2, Zustand (lightweight state used where appropriate). Icons via Heroicons.
- API: CoinGecko public API (no API key). Rate limit: ~30 calls/min — the app caches responses in-memory for 10s to reduce calls.
- Storage: `localStorage` keys used: `watchlist`, `portfolio`, `settings`.
- Service worker: registered relative to Vite base so it works when the app is hosted under a repo subpath (GitHub Pages).
- Vite `base` is configured to `/crypto-app/` in `vite.config.js` so built assets load correctly when the repo is published at `https://<username>.github.io/crypto-app/`. If you serve from a different path adjust `base` accordingly or use `./` for relative assets.
- The app build output is written to the `docs/` folder to make GitHub Pages deployment straightforward.

## Run locally (macOS, zsh)

1. Install dependencies (use `--legacy-peer-deps` if you hit peer dependency errors):

```bash
cd /Users/sk/Desktop/Code/crypto-app
npm install --legacy-peer-deps
```

2. Start dev server (hot reload):

```bash
npm run dev
# open http://localhost:5173
```

3. Build for production (writes static files to `docs/`):

```bash
npm run build
```

4. Preview built site locally:

```bash
npm run preview
# or: npx serve docs
```

## Publishing to GitHub Pages

- Manual: build (`npm run build`), commit and push `docs/`, then in your repo Settings → Pages set source to `main` branch and folder `/docs`.
- CI: a GitHub Actions workflow template is included locally at `.github/workflows/deploy.yml` which can build and publish automatically. Review it and commit it if you want automatic deploys.

## Limitations & next steps

- Service worker is simple and may serve cached content until you unregister it — during development unregister via DevTools → Application → Service Workers.
- Tailwind is used via CDN for speed; for production integrate Tailwind properly (postcss) to purge unused CSS for smaller builds.
- No automated tests or linting configured in this MVP — you may want to add ESLint, unit tests, and a CI check.

## Credits

- Data: CoinGecko — https://www.coingecko.com (Free public API)

## License

MIT
