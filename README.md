# Project overview

This document defines a full-stack, production-grade crypto web application with clearly separated frontend and backend for dashboard, crypto detail, and settings. It covers architecture, requirements, data models, APIs, security, DevOps, testing, and operational practices to deliver a modern, maintainable platform.

---

# Product scope and goals

- **Purpose:** Offer real‑time market insights, portfolio tracking, watchlists, and secure account management for crypto users from beginner to pro.
- **Core users:**  
  - **Retail user:** Track prices, manage watchlists, monitor portfolio performance.  
  - **Admin:** Manage assets catalog, market data sources, risk/compliance rules, and application configuration.
- **Success metrics:**  
  - **Engagement:** Daily active users, time on dashboard, watchlist adds.  
  - **Performance:** P95 page load under 2s, live price latency under 500ms.  
  - **Reliability:** 99.9% uptime, error rate under 0.1%.

---

# High-level architecture

## System components

- **Frontend web (Dashboard + Crypto detail + Settings):** React/Next.js SPA with SSR/SSG, TypeScript, Tailwind/Chakra, Vite/Turbopack, WebSocket/SSE for live data.
- **Backend API (Dashboard + Crypto detail + Settings):** Node.js with NestJS (or FastAPI/Go alternative), TypeScript, REST + WebSocket, CQRS for read/write separation.
- **Data layer:** PostgreSQL for transactional data; Redis for caching and pub/sub; optional ClickHouse for analytics.
- **Market data ingestion:** Streaming connectors to providers (e.g., Binance, Coinbase, CoinGecko), normalized via ingestion workers.
- **Auth and security:** OAuth2/OIDC (Auth0/Keycloak), JWT access tokens, role-based access control (RBAC).
- **Observability:** OpenTelemetry, Prometheus + Grafana, ELK for logs, Sentry for error tracking.
- **DevOps:** Docker, Kubernetes, Helm, GitHub Actions CI/CD, Infrastructure as Code with Terraform.

---

# Functional requirements

## Settings (project and user)

- **User profile:**  
  - **Edit profile:** Name, email, preferred fiat, theme, language.  
  - **Security:** 2FA (TOTP), session management, device history.  
  - **Notifications:** Price alerts, news digests, portfolio threshold warnings.
- **Project settings (admin):**  
  - **Feature flags:** Toggle beta features per cohort.  
  - **Data sources:** Configure providers and failover priority.  
  - **Compliance:** KYC/KYB rules, data retention windows, privacy controls.  
  - **Localization:** Manage supported locales, number/date formats.

## Dashboard frontend

- **Overview cards:**  
  - **Market summary:** Global market cap, BTC/ETH dominance, top movers.  
  - **Portfolio:** Current value, P/L, allocation pie.  
  - **Watchlist:** Quick view with sparklines.
- **Market explorer:**  
  - **Filters:** Category, exchange, volume, volatility, price range.  
  - **Sorting:** Market cap, 24h change, liquidity, developer activity (optional).
- **News & sentiment:**  
  - **Feeds:** Curated crypto news, token-specific updates.  
  - **Sentiment:** Aggregated social/analyst sentiment score.
- **Live updates:**  
  - **Streaming prices:** Sub-second updates for selected assets.  
  - **Alerts:** In-app toasts for threshold breaches.

## Dashboard backend

- **Aggregations:**  
  - **Global metrics:** Market cap, dominance, volume (cached).  
  - **Portfolio calculations:** Realized/Unrealized P/L, risk metrics.  
  - **Top movers:** 24h/7d gainers/losers, anomaly detection.
- **Streaming:**  
  - **Channels:** Asset price channels via WebSocket or SSE.  
  - **Backpressure:** Rate limiting and per-user subscription caps.
- **News ingestion:**  
  - **Normalization:** Deduplication, source ranking, token tagging.  
  - **Moderation:** Flag suspicious/promotional content.

## Crypto detail frontend

- **Asset page:**  
  - **Price panel:** Live price, OHLC, 24h/7d/30d performance.  
  - **Charting:** Candles, depth, volume, indicators (EMA, RSI, MACD).  
  - **Fundamentals:** Supply, issuance, tokenomics, governance links.  
  - **Order book (read-only):** Bids/asks, spread.  
  - **On-chain metrics (optional):** Active addresses, transaction count, fees.
- **User interactions:**  
  - **Add to watchlist:** Single click with feedback.  
  - **Set alerts:** Price, percent change, volume spikes.  
  - **Notes:** Personal annotations per asset.

## Crypto detail backend

- **Asset registry:** Canonical metadata, symbol aliases, contract addresses per chain.  
- **Historical data:** OHLCV storage, resampling, indicator calculations, paginated chart data.  
- **Order book proxy (optional):** Read‑through to exchanges with rate-limit controls.  
- **On-chain analytics (optional):** ETL from chain explorers, caching.

---

# Non-functional requirements

- **Performance:**  
  - **Frontend:** P95 TTI < 2s on 4G; bundle < 250KB critical path.  
  - **Backend:** P95 API latency < 200ms; streaming < 500ms lag.
- **Security:**  
  - **Encryption:** TLS 1.2+ in transit; AES‑256 at rest.  
  - **Privacy:** GDPR‑aligned DSR flows; minimal PII collection.
- **Reliability:**  
  - **Availability:** 99.9% SLA; multi‑AZ deployment; rolling updates.  
  - **Resilience:** Graceful degradation when providers fail.
- **Scalability:** Horizontal scaling for API and streamers; caching first for hot paths.
- **Accessibility:** WCAG 2.2 AA; keyboard-first navigation; high-contrast mode.
- **Localization:** English + additional locales; ICU formatting; RTL support if needed.

---

# Data model

## Entities

- **User:** id, email, name, locale, fiat, theme, roles, 2FA enabled.  
- **Session/Device:** user_id, device_fingerprint, last_seen, ip, revoked.  
- **Portfolio:** user_id, entries[], base_fiat.  
- **PortfolioEntry:** asset_id, quantity, average_cost, tags[].  
- **Asset:** id, symbol, name, category, chain_ids[], contract_addresses{}, decimals, status.  
- **PriceTick:** asset_id, timestamp, price, volume, source.  
- **OHLCV:** asset_id, interval, open, high, low, close, volume, timestamp.  
- **Watchlist:** user_id, asset_ids[], sort_order, created_at.  
- **Alert:** user_id, asset_id, type, threshold, direction, status, channel (email/in-app).  
- **NewsItem:** id, title, source, url, published_at, assets[], sentiment.  
- **Settings:** key, value, scope (user/global), updated_by, updated_at.  
- **FeatureFlag:** key, enabled, audience_query, expires_at.  
- **Provider:** id, name, type (exchange/api), status, priority, rate_limit.

---

# API design

## Authentication and user

- **POST /auth/login:** Issue JWT after OAuth/OIDC callback.  
- **POST /auth/refresh:** Rotate tokens; invalidate if compromised.  
- **GET /users/me:** Profile and preferences.  
- **PATCH /users/me:** Update profile, fiat, theme, locale.  
- **POST /users/me/2fa:** Enable/disable TOTP; backup codes.  
- **GET /users/me/devices:** List/revoke sessions.

## Dashboard

- **GET /dashboard/summary:** Market cap, dominance, top movers, portfolio snapshot.  
- **GET /dashboard/watchlist:** User’s watchlist with latest prices.  
- **GET /dashboard/news:** Paginated, token-tagged news.  
- **WS /streams/prices:** Subscribe to asset channels; auth + RBAC enforced.

## Assets and crypto detail

- **GET /assets:** Filterable list with pagination and sorting.  
- **GET /assets/{id}:** Metadata and fundamentals.  
- **GET /assets/{id}/ohlcv?interval=1m|5m|1h|1d:** Chart data.  
- **GET /assets/{id}/indicators?ema=...,rsi=...,macd=...:** Computed signals.  
- **GET /assets/{id}/orderbook:** Read-only order book (if enabled).  
- **GET /assets/{id}/onchain:** On-chain metrics (if enabled).

## Portfolio and alerts

- **GET /portfolio:** Current positions and P/L.  
- **POST /portfolio/entries:** Add/update entries.  
- **DELETE /portfolio/entries/{id}:** Remove entry.  
- **GET /alerts:** List user alerts.  
- **POST /alerts:** Create alert.  
- **PATCH /alerts/{id}:** Update alert.  
- **DELETE /alerts/{id}:** Disable alert.

## Settings and admin

- **GET /settings:** Effective settings (merged global + user).  
- **PATCH /settings:** Update user-scoped settings.  
- **GET /admin/settings:** Global project settings.  
- **PATCH /admin/settings:** Update global settings.  
- **GET /admin/providers:** List configured data sources.  
- **PATCH /admin/providers/{id}:** Update provider priority, rate limits.  
- **GET /admin/feature-flags:** List flags.  
- **PATCH /admin/feature-flags/{key}:** Update flag state.

---

# Frontend specification

## Application shell

- **Framework:** Next.js + React, TypeScript, SSR/SSG for SEO and first paint.  
- **State:** Redux Toolkit or Zustand; React Query for server state.  
- **Styling:** Tailwind CSS or Chakra UI; theming with light/dark and high-contrast.  
- **Routing:** File-based; guarded routes for authenticated pages.

## Dashboard UI

- **Cards:** Market summary, portfolio, watchlist; responsive grid (mobile-first).  
- **Charts:** High-performance canvas/WebGL charting (e.g., Recharts or Lightweight Charts).  
- **Streaming:** WebSocket handler with auto-reconnect and exponential backoff.  
- **Accessibility:** Focus management, ARIA landmarks, keyboard shortcuts.

## Crypto detail UI

- **Chart tool:** Multiple intervals, overlays, indicators; snapshot + live overlay.  
- **Data panels:** Fundamentals, order book, depth chart, news feed.  
- **Interactions:** Watchlist toggles, alert modals, inline notes.

## Settings UI

- **Profile:** Editable fields with validation and optimistic updates.  
- **Security:** 2FA setup wizard, device/session manager.  
- **Preferences:** Language, fiat, theme, notification frequency.

---

# Backend specification

## Services

- **API Gateway:** Auth, rate limiting, request validation (JSON schema), coercion.  
- **Identity:** OAuth/OIDC integration, token issuance, refresh rotation, RBAC.  
- **Market Data:** Ingestion workers, normalization, deduplication, failover logic.  
- **Portfolio:** P/L computations, tax lots (FIFO/LIFO configurable), currency conversion via FX feed.  
- **Alerts:** Scheduler + event-driven triggers; debounce and cooldowns.  
- **Settings:** Hierarchical config resolver (global → role → user).

## Data and caching

- **Primary DB:** PostgreSQL with row-level security (RLS) for multi-tenant safety.  
- **Cache:** Redis for hot price ticks, watchlist aggregation, feature flags.  
- **Analytics:** ClickHouse for time‑series and funnels; batched ETL from PostgreSQL.  
- **Indices:** Composite indices on asset_id, timestamp for OHLCV; partial indices on active alerts.

## Streaming

- **Transport:** WebSocket or SSE; per-channel subscriptions; heartbeats and ping/pong.  
- **Scaling:** Sharded streamers; Redis pub/sub; topic partitioning by asset class.  
- **QoS:** Snapshot on subscribe, throttled deltas (e.g., 100ms), client backpressure handling.

---

# Security and compliance

- **Authentication:** OAuth2/OIDC; short-lived JWT access tokens; rotating refresh tokens; device binding.  
- **Authorization:** RBAC with scopes per route; admin endpoints restricted; audit logs.  
- **Data protection:** PII minimization, encryption at rest, secure secrets management (KMS).  
- **Hardening:** CSP, HSTS, XSS protections, CSRF tokens, rate limiting, input validation.  
- **Compliance:** GDPR data subject requests, data retention policies, incident response runbooks.  
- **KYC/KYB (optional):** Pluggable verification provider; clear user consent and privacy disclosures.

---

# DevOps, CI/CD, and environments

- **Branching model:** trunk + short‑lived feature branches; conventional commits.  
- **CI:** Type checks, lint, unit tests, e2e tests, vulnerability scan, build artifacts.  
- **CD:** Blue/green or canary deploys; feature flags for progressive rollouts.  
- **Environments:** Dev, Staging, Prod with separate secrets and providers.  
- **Infrastructure:** Terraform modules for VPC, DB, cache, Kubernetes cluster, monitoring stack.  
- **Backups & DR:** Daily DB backups, PITR; warm standby; recovery drills quarterly.

---

# Testing strategy

- **Unit tests:** Core logic (indicators, P/L, alert triggers).  
- **Integration tests:** API endpoints, DB migrations, streaming channels.  
- **E2E tests:** User flows (login, watchlist, alerts, chart interactions) via Playwright/Cypress.  
- **Performance tests:** Load on /assets and streaming; chart rendering FPS.  
- **Security tests:** Static analysis (SAST), dependency checks, DAST against staging.  
- **Accessibility tests:** Axe automated checks + manual keyboard and screen reader passes.

---

# Monitoring and operations

- **Metrics:** Latency, throughput, error rates, stream lag, cache hit ratio, DB slow queries.  
- **Logs:** Structured JSON with correlation IDs; privacy filters.  
- **Tracing:** Distributed traces across API → workers → DB.  
- **Alerts:** On-call rotations; SLO-based alerts with burn rate policies; synthetic monitors.  
- **Runbooks:** Incident triage, rollbacks, failover to secondary provider, rate-limit mitigation.

---

# Roadmap and deliverables

## Milestones

1. **MVP (4–6 weeks):** Auth, dashboard summary, asset list, basic crypto detail (price + OHLCV), watchlist, alerts, settings (profile).  
2. **Beta (6–10 weeks):** Streaming prices, portfolio module, news feed, admin settings, feature flags, 2FA.  
3. **Production (10–14 weeks):** On-chain metrics, order book, sentiment, performance hardening, full observability, accessibility AA.

## Deliverables

- **Design system:** Components library and theming tokens.  
- **API contract:** OpenAPI spec with examples and error catalog.  
- **Runbooks and playbooks:** Operations, incident, and data corrections.  
- **Compliance pack:** Privacy policy, DSR process, data retention, audit logs overview.  
- **Onboarding guide:** Environment setup, scripts, coding standards, contribution guidelines.

---

# Open questions and assumptions

- **Market data licenses:** Which providers and terms are approved?  
- **On-chain scope:** Which chains and frequency of metrics?  
- **Portfolio data source:** Read-only manual entries vs. exchange integrations?  
- **Regions and locales:** Initial language set and RTL requirements.  
- **Mobile:** PWA only or native app later?

---

# Next steps

- **Confirm priorities:** Choose MVP feature set and data providers.  
- **Select stack:** Lock frontend/backend frameworks and hosting.  
- **Draft API spec:** Generate OpenAPI, error codes, and pagination conventions.  
- **Define UI flows:** Wireframes for dashboard, asset page, and settings.  
- **Plan sprints:** Assign milestones, owners, and quality gates.

If you want, I can tailor this into a bilingual, presentation-ready onboarding pack with mapping tables for Khmer/English headers, plus an initial OpenAPI spec and component inventory.

---

## Crypto Dashboard - Market Overview Screen

Build a modern crypto market dashboard screen that displays real-time cryptocurrency data with watchlist functionality and interactive price charts.

**Key Features & Functionality**
- Live Market Data Grid: Display top cryptocurrencies with coin image, name/symbol, current price, 24h change (color-coded green/red), and market cap in a responsive card layout
- Interactive Watchlist: Heart/star icon toggle on each coin card to add/remove from user's watchlist with optimistic UI updates
- Search & Filter Bar: Top navigation with search input, currency selector dropdown (USD/EUR/GBP), and sort options (Market Cap, Price, 24h Change)
- Infinite Scroll Pagination: Load more coins as user scrolls down with loading skeleton states
- Pull-to-Refresh: Swipe down gesture to fetch latest market data with animated loading indicator

**UI Components & Layout**
- Header: App logo/title on left, search bar center, settings icon and currency chip on right
- Coin Cards: Grid/list of cards with coin logo (48x48), name + symbol, price (large bold text), 24h change badge, market cap (muted text), and watchlist toggle button
- Loading States: Shimmer skeleton cards while fetching data
- Empty/Error States: Friendly messages with retry button when no data or network errors

**Style & Design Notes**
- Modern Material 3 design with dynamic color theming. Use rounded corners on cards, subtle shadows, and smooth transitions. Price increases in green (#00C853), decreases in red (#FF5252). Accessible contrast ratios and support for dark mode.

**Technical Considerations**                                                                                                                                                                                                                                                          
- State management with React hooks (useState, useEffect) for market data, watchlist, and loading states
- Debounced search input to avoid excessive API calls
- Memoize coin list filtering and sorting for performance
- Use Next.js 16.0.1 App Router with server components for initial data fetch and client components for interactive features 
