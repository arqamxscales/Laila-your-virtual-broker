# GitHub Push + Deploy Flow

## 1) Create GitHub repository

Create a new public repo in your GitHub account:

- Name: `laila-your-virtual-broker`
- Description: `AI-powered PSX dashboard with live market pulse, user analytics, and virtual portfolio manager.`
- Do **not** initialize with README/.gitignore/license (already present locally).

## 2) Connect local repo and push

```bash
git remote add origin https://github.com/<your-username>/laila-your-virtual-broker.git
git push -u origin main
```

If remote already exists:

```bash
git remote set-url origin https://github.com/<your-username>/laila-your-virtual-broker.git
git push -u origin main
```

## 3) Configure GitHub topics

Suggested topics:

- `react`
- `typescript`
- `vite`
- `fintech`
- `psx`
- `stock-market`
- `ai-assistant`
- `portfolio-manager`
- `vercel`

## 4) Website field

Set repository website to:

- `https://laila-your-virtual-broker.vercel.app`

## 5) Vercel deploy

Project is already deployed. For redeploys:

```bash
npx vercel --prod
```
