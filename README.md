# EMT Field Impression Funnels

Study tool for NREMT medical assessment / psychomotor prep — cue-driven differential diagnosis funnels, practice scenarios, condition cards, med profiles, and reference sheets.

Built with ♥ from **EMT-253AL** · Bay Area Training Academy (BATA).

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Deploy (Vercel)

1. Push this repo to GitHub (already done if you're reading this on GitHub).
2. Go to [vercel.com](https://vercel.com) → Sign in with GitHub → **Add New Project** → Import this repo.
3. Leave the defaults (Vite is auto-detected) → Deploy.
4. Share the `*.vercel.app` link with classmates.

## What's in here

- **Funnels** — dichotomous keys keyed by walk-in cue (most-obvious → least-obvious)
- **Practice** — predict-then-reveal scenarios + 15-minute NREMT timer
- **Conditions** — searchable condition cards with interventions, shock flags, confused-with links
- **Reference** — 8 med profiles + 9 Rights, skill sheet checklist, radio ringdown, mnemonics / GCS / APGAR

Content lives in `src/data/` so it's easy to edit as protocols evolve.
