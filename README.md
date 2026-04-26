# Laila-Your-Virtual-Broker

AI-powered Pakistan Stock Exchange dashboard with PKT-synced market timing, advanced terminal analytics, AI watchlists, VGI market scoring, and virtual portfolio simulation.

## Live Website

- Production: https://laila-your-virtual-broker.vercel.app

## Recommended GitHub Setup

- Repository Name: laila-your-virtual-broker
- Short Description: AI-powered PSX dashboard with live market pulse, user analytics, and virtual portfolio manager.

## Features

- Laila AI assistant with voice briefing
- Pakistan-time PSX session engine (Mon-Thu 09:30-15:30, Fri split session)
- Blue/white/black modern dashboard UI
- Live ticker board + sector momentum view
- Advanced AI terminal: VGI score, regime detection, anomaly radar, feed health
- AI watchlist and alert center with local persistence
- Quant execution lab with strategy-aware position sizing
- User analytics (engagement, activity, chat/trade metrics)
- Virtual portfolio manager (buy/sell simulation)
- Top movers, IPO tracker, macro indicators, and news feed
- Auto fallback to demo mode when external APIs are unavailable

## Demo Credentials

- Configured via environment variables (`VITE_DEMO_EMAIL`, `VITE_DEMO_PASSWORD`)

## Tech Stack

- React + TypeScript + Vite
- CSS (custom dashboard styling)
- Vercel for deployment

## Local Development

1. npm install
2. cp .env.example .env
3. Set your local values in `.env`
4. npm run dev
5. Open the local Vite URL

## Environment Variables

See [.env.example](.env.example) for supported variables.

## Production Build

1. npm run build
2. npm run preview

## Deployment (Vercel)

- npx vercel --prod

## Maintainer

- Mohammad Arqam Javed
