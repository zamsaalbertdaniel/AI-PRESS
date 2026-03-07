# Audit tehnic AIPress (local codebase snapshot)

Data: 2026-03-06

## Limitări de acces (important)
- Acest audit este făcut pe snapshot-ul local al repository-ului din `/workspace/AI-PRESS`.
- Nu am acces direct, în timp real, la dashboard-urile tale GitHub/Vercel în această sesiune.
- Pot audita codul, configurația și build/lint local, dar nu pot confirma live metrics/traffic/errors din producție fără integrare explicită.

## Rezumat executiv
- **Stare actuală:** proiectul pornește ca structură Next.js modernă, dar are blocaje de calitate care opresc livrarea sigură în CI (`eslint` și `build` eșuează).
- **Risc major:** rate-limiting în memorie (pentru login și search) nu este robust pe serverless/multi-instance.
- **Risc de securitate:** CSP permite `unsafe-inline` și `unsafe-eval`; suprafață XSS mai mare decât necesar.
- **UX/estetic:** inconsistențe de i18n și navigare (`<a>` intern vs `<Link>`), plus conținut placeholder/static în secțiuni cheie.

## Probleme critice (P0/P1)

### P0 — Build/Lint nu sunt green
1. `eslint` eșuează cu erori reale în zona admin și homepage (setState în effect, link intern cu `<a>`, text ne-escapat).
2. `next build` eșuează la fetch Google Fonts (`Fraunces`, `Outfit`) în medii fără acces extern.

### P1 — Rate limiting neadecvat pentru producție
1. Login-ul admin folosește `Map` în memorie globală proces și key fix (`admin_login`), fără context utilizator/IP.
2. Căutarea AI folosește același model in-memory + cheie globală (`global_search`).

Impact: pe Vercel/serverless limitele se resetează frecvent între instanțe; protecție inconsistentă la brute-force/abuz.

### P1 — Hardening de securitate incomplet
1. CSP include `script-src 'unsafe-inline' 'unsafe-eval'`.
2. Headerul `X-XSS-Protection` este legacy și nu ajută browserele moderne.

## Probleme medii (P2)

### P2 — i18n/UX
1. Hero are link intern către `/articles` cu `<a>` în loc de `<Link>`.
2. În homepage există texte strict EN în mai multe zone, deși platforma este poziționată RO/EN.
3. Secțiuni cu date decorative (ex: indicatori statici) pot reduce credibilitatea editorială.

### P2 — Documentație tehnică sub nivelul proiectului
- `README.md` este template generic create-next-app, fără setup real pentru env vars, Supabase, Gemini, deploy flow.

## Probleme minore (P3)
- Importuri neutilizate și warning-uri lint (ex: `useEffect` importat dar nefolosit în contextul de limbă; componentă neutilizată în admin sources).

## Recomandări prioritizate

### Sprint 1 (stabilizare release)
1. Fix toate erorile ESLint și setează gating în CI.
2. Elimină dependența de network la build pentru fonturi (self-host/local fallback).
3. Schimbă rate limit la storage centralizat (Redis/Upstash) + cheie per IP/user agent + endpoint.

### Sprint 2 (security + reliability)
1. Restrânge CSP: elimină `unsafe-eval`, migrează de la inline scripts/styles unde e posibil.
2. Adaugă observabilitate: Sentry (frontend + server actions), log correlation IDs.
3. Introdu testare minimă: smoke e2e (login admin, listă articole, public article page).

### Sprint 3 (estetic + produs)
1. Uniformizează copy bilingv pe homepage.
2. Introdu preview imagini optimizate (`next/image`) în admin/editor și feed.
3. Adaugă „design tokens” (spacing/typography/colors) pentru consistență vizuală între pagini publice și admin.

## Verdict
- **Ce nu este ok acum:** pipeline-ul de calitate (lint/build), rate-limit în memorie, CSP prea permisiv, documentație insuficientă, câteva incoerențe UX/i18n.
- **Ce e promițător:** arhitectură clară pe layere (actions/lib/components), separare public/admin, metadata SEO deja configurată.
