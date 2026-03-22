# Project Guardrails & Security Guidelines

> **AI INSTRUCTION:** You MUST read and strictly adhere to this entire file before writing code, proposing architectural changes, or executing git commands.

## 1. Never Commit Secrets
**CRITICAL:** Never hardcode credentials, API keys, or database URLs directly into the source code (e.g., `src/lib/supabase.js` or any React component). Do NOT automatically push or commit credential files to GitHub under any circumstances.

- All sensitive values must be provided via environment variables (e.g., `import.meta.env.VITE_SUPABASE_ANON_KEY`).
- Local development secrets must be placed ONLY in `.env.local` which is ignored by Git.
- Always provide a safe `.env.example` file so other developers know what variables are required.

## 2. Managing Secrets in GitHub Actions
If you are deploying this application using GitHub Actions (as mentioned in the `.github/workflows/deploy.yml` or similar CI), the build process needs access to these environment variables to compile the Vite application correctly.

Here is how to add them to GitHub:
1. Go to your repository on GitHub.
2. Click **Settings** > **Secrets and variables** > **Actions** from the left sidebar.
3. Click **New repository secret**.
4. Add `VITE_SUPABASE_URL` as the Name, and paste your Supabase URL as the Secret. Click **Add secret**.
5. Click **New repository secret** again.
6. Add `VITE_SUPABASE_ANON_KEY` as the Name, and paste your Supabase Anon Key as the Secret. Click **Add secret**.

Once added, your GitHub Actions workflow will automatically have access to these secrets during the build phase if you map them in your `.yml` file like this:
```yaml
env:
  VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
  VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
```

## 3. Rate Limits & Free Tiers
- **CoinGecko**: We are using the free public API. The application caches responses for 10 seconds to avoid HTTP 429 Too Many Requests errors. Do not remove this caching layer.
- **Supabase**: We are on the Hobby Plan. It supports 50,000 MAU and 500k Edge Function invocations. Keep database queries optimized.
