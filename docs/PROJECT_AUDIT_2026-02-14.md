# AIPRESS Audit Report (Functionalitate, Siguranță, Design, Performanță)

Data audit: 2026-02-14
Scope: verificare cod curent din repository + validare rapidă comenzi locale.

## Verdict rapid

Statusul real **nu confirmă** complet îmbunătățirile declarate. Există progres pe unele elemente UI/structură, dar mai multe puncte critice (auth, XSS hardening, AI search funcțional real) rămân nefinalizate sau parțial implementate.

## 1) Verificare afirmații critice

### 1.1 Auth securizat (JWT + blocare /admin/*)
- `aipress_auth` este încă un cookie boolean (`"true"`), setat după validarea parolei — nu JWT.
- Middleware/proxy validează doar egalitatea cu `"true"`.
- Concluzie: controlul accesului există, dar este **insuficient** din perspectivă security-grade.

### 1.2 XSS eliminat + CSP
- Pagina articol folosește încă `dangerouslySetInnerHTML` pentru conținut.
- Header-ele de securitate există (nosniff, frame deny etc.), dar nu există CSP în config.
- Concluzie: XSS risk este **redus parțial**, nu eliminat complet.

### 1.3 AI Pipeline activ (Gemini + AI Search floating real)
- `AISearchFloating` este în stadiu placeholder; nu există submit/search flow conectat la server action/API.
- Biblioteca AI are funcții Gemini (`callAI`, `searchAndResearchNews`) dar nu e legătură directă din floating widget.
- Nu există ratelimiting și timeout explicit pentru aceste apeluri în codul curent.
- Concluzie: AI backend există parțial, însă UX “floating search live” nu este complet funcțional.

## 2) Probleme observate în verificarea locală

- `npm run lint` eșuează din cauza setup-ului local de dependențe (rezolvare module `eslint/config` / install incomplet în sesiune).
- `npm run build` eșuează local în această sesiune (`next: not found`) după install incomplet.

Aceste erori sunt de mediu în sesiunea de audit, dar indică și nevoie de hardening pentru reproducibilitatea setup-ului local/CI.

## 3) Sugestii prioritizate

### P0 (critice)
1. Înlocuiește cookie-ul boolean cu JWT semnat (HS256), include `exp`, `iat`, `sub`, `role`.
2. Verifică JWT în `proxy.ts` pentru `/admin/:path*` + redirect robust la login.
3. Elimină `dangerouslySetInnerHTML` pentru content neîncredere; randare sigură pe paragrafe/text nodes.
4. Adaugă CSP strict în `next.config.ts` (minim `default-src 'self'`, `script-src`, `style-src`, `img-src`, `connect-src` incl. Gemini endpoint dacă necesar).

### P1 (important)
1. Leagă `AISearchFloating` la un endpoint/server action real, cu loading/error/empty states.
2. Adaugă ratelimiting (IP + user/session) și timeout explicit la AI calls.
3. Introdu logging structurat pentru auth failures și AI failures.
4. Adaugă teste pentru auth boundary (`/admin` fără token, token expirat, token invalid).

### P2 (design & DX)
1. Uniformizează spacing scale și contrast (WCAG AA) în componentele principale.
2. Adaugă skeleton + streaming feedback în AI search.
3. Creează guideline de design tokens (culori, radius, shadows, blur), pentru consistență.
4. Hardening CI: workflow pentru `npm ci`, `npm run lint`, `npm run build`, `tsc --noEmit`.

## 4) Propuneri concrete pentru design

1. **Header sticky mai clar**: crește contrastul textului pe blur și adaugă fallback background pentru browsere fără `backdrop-filter`.
2. **Card hierarchy**: accent mai clar pentru titluri + metadata mai discretă (font-weight/size rhythm).
3. **Floating AI UX**: transformă din “input static” în mini-chat cu:
   - prompt suggestions,
   - indicator de răspuns AI,
   - buton “Citează surse” când răspunsul include research.
4. **Article readability**:
   - `max-width` mai strict pentru body (ex: 70ch),
   - line-height 1.65–1.8,
   - spațiere consistentă între paragrafe și subtitluri.

## 5) Propuneri concrete pentru rapiditate/perf

1. Lazy-load pentru module AI și componente non-critice (deja parțial aplicat pe pagina principală; extinde modelul).
2. Cache pentru rezultate AI search pe query scurt-term (TTL 60–180s).
3. Debounce input (300–500ms) + cancel request la query nou.
4. Precompute metadata articole populare la build/ISR și evită procesări redundante.

## 6) Concluzie

Proiectul are o bază bună (Next.js App Router, structurare modulară, componente moderne), dar pentru a confirma “production-ready” pe security + AI UX sunt necesare remedieri P0/P1.
