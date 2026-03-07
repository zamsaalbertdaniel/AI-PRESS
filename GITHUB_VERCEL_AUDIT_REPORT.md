# Audit complet AIPress (GitHub code + readiness pentru Vercel)

Data: 2026-03-07

## Context și scop
Acest audit este făcut direct pe codul proiectului din repository-ul curent (`/workspace/AI-PRESS`) cu verificări de build/lint și revizie manuală pe securitate, funcționalitate și UX/UI.

> Notă: pentru audit runtime complet Vercel (deployment history, runtime logs, env drift între preview/prod) este necesar acces direct în dashboard-ul Vercel.

---

## Metodologie folosită
1. Verificare automată de calitate:
   - `npm run lint`
   - `npm run build`
2. Revizie statică manuală pe fișiere critice:
   - securitate (headers/CSP/auth/rate-limit)
   - fluxuri funcționale (admin pipeline, AI actions, data fetch)
   - performanță și UX (imagini, navigare, i18n, consistență UI)

---

## Rezumat executiv
Platforma are o bază bună (Next.js modern, separare public/admin, integrare AI+Supabase), dar are blocaje care afectează livrarea sigură:

- **Release gates neîndeplinite:** lint și build nu sunt green.
- **Securitate parțială:** CSP prea permisivă (`unsafe-inline`, `unsafe-eval`), rate limiting in-memory.
- **Calitate UX/performanță:** probleme de navigare internă, imagini neoptimizate în admin și i18n incomplet pe homepage.
- **Documentație tehnică minimă:** README generic, fără runbook operațional pentru deploy/debug.

---

## Probleme identificate (cu impact)

## P0 — Calitate / livrare

### 1) ESLint eșuează (5 erori, 3 warning-uri)
**Impact:** CI blocat, risc de bug-uri de runtime și degradare UX în admin.

Cauze principale:
- setState în `useEffect` în pagini admin,
- link intern cu `<a>` în loc de `<Link>`,
- text cu caractere neescapate,
- importuri/componente nefolosite.

**Beneficiu după remediere:** pipeline predictibil, reducere regresii front-end, PR-uri mai curate.

### 2) Build eșuează la fetch Google Fonts în medii restrictive
**Impact:** release fragil în medii CI/edge fără ieșire externă stabilă.

**Beneficiu după remediere:** build determinist și deploy robust (fără dependență externă la build-time).

---

## P1 — Securitate

### 3) CSP permisivă (`unsafe-inline`, `unsafe-eval`)
**Impact:** suprafață de atac XSS mai mare decât necesar.

**Recomandare:** migrare graduală la CSP strictă cu nonce/hash pentru script-uri; eliminare `unsafe-eval`.

### 4) Rate limiting in-memory pentru login/search
**Impact:** protecție inconsistentă în serverless/horizontal scaling; poate fi bypass-uibil între instanțe.

**Recomandare:** mutare pe Redis/Upstash cu keying pe IP + endpoint + eventual user/session fingerprint.

### 5) Header legacy `X-XSS-Protection`
**Impact:** zgomot de config, valoare limitată în browsere moderne.

**Recomandare:** păstrează focus pe CSP + Trusted Types (unde aplicabil), elimină header legacy.

---

## P1/P2 — Funcționalitate / fiabilitate

### 6) Admin workflows cu pattern-uri care generează lint errors
**Impact:** risc de comportament imprevizibil în pipeline admin și update-uri repetate.

**Recomandare:** refactor al efectelor în fetch pattern compatibil React hooks lint rules.

### 7) Caching/rate-limit local-only în acțiuni server
- Search și login folosesc `Map` în memorie.
- Crypto feed folosește cache local in-memory ca fallback.

**Impact:** inconsistență între instanțe și după cold start.

**Recomandare:** cache/rate-limit distribuit pentru date critice + observabilitate pe fallback-uri.

### 8) Handling AI outputs fără validare strictă de schemă pe toate căile
**Impact:** date instabile de la model pot genera conținut slab format.

**Recomandare:** validare Zod strictă pentru payload-urile AI înainte de persist.

---

## P2 — UX/UI (vizual + experiență)

### 9) Link intern `/articles` cu `<a>` în HomeHero
**Impact:** pierzi optimizările Next.js routing/prefetch; UX mai slab.

### 10) `<img>` în editor admin (fără `next/image`)
**Impact:** LCP/bandwidth mai slab, încărcare neoptimizată.

### 11) i18n incomplet pe homepage
**Impact:** experiență neuniformă RO/EN pe pagini cheie, afectează percepția premium.

### 12) Elemente informative statice/placeholder
**Impact:** percepție de “mock” în unele zone (mai ales dacă datele nu sunt real-time).

---

## P3 — Operare / documentație

### 13) README este încă template generic
**Impact:** onboarding lent, risc mare de configurare greșită la env/deploy.

**Recomandare:** README operațional: env matrix, local dev, CI checks, deploy playbook, rollback.

---

## Plan de îmbunătățire recomandat

## Faza 1 (1-2 zile) — Stabilizare release
1. Curățare completă lint errors/warnings.
2. Stabilizare font pipeline (self-host/fallback local).
3. PR gate obligatoriu: lint + build + smoke checks.

## Faza 2 (2-4 zile) — Security & reliability
1. CSP hardening gradual.
2. Rate-limit distribuit (Redis/Upstash).
3. Sentry/Log drain pentru erori din server actions.

## Faza 3 (3-5 zile) — UX/UI & produs
1. Migrare imagini la `next/image` în zone relevante.
2. Uniformizare i18n pe homepage și secțiuni conexe.
3. Design tokens + consistență vizuală între public/admin.

---

## KPI-uri propuse (ca să măsurăm progresul)
- Build success rate: 100%
- Lint errors: 0
- P95 admin page load: -20% față de baseline
- Incidente auth brute-force: redus semnificativ după rate-limit distribuit
- Time-to-debug deploy issue: <30 min cu observabilitate activă

---

## Concluzie
Da, proiectul are potențial foarte bun și arhitectură care poate scala, dar înainte de optimizări vizuale majore trebuie rezolvate prioritățile de stabilitate și securitate. După aceste corecții, investiția în polish UI/UX va avea impact mult mai mare și risc mult mai mic.
