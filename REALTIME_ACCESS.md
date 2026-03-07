# Acces în timp real pentru audit & intervenții (GitHub + Vercel)

Acest document explică **cum îmi poți oferi acces operațional** astfel încât să pot lucra „în timp real” pe proiect.

## 1) GitHub (obligatoriu)

Pentru lucru real-time pe cod am nevoie de:
- acces la repository (ideal: `Write`, minim: `Read` + workflow de PR-uri),
- posibilitatea de a crea branch-uri + PR,
- opțional acces la Actions logs (pentru debugging CI/CD).

### Variantă recomandată: collaborator pe repo
1. Intri în repo pe GitHub → **Settings** → **Collaborators and teams**.
2. Trimiți invitație cu nivel:
   - `Write` dacă vrei să fac fix-uri direct pe branch-uri dedicate,
   - `Read` dacă vrei strict PR workflow cu aprobarea ta.
3. Confirmi că branch protection permite merge prin PR.

### Variantă enterprise: GitHub App / PAT scoped
- Creezi un token cu scope minim (repo read/write + pull requests) sau instalezi GitHub App intern.
- Îl expui în mediul în care rulez eu prin variabilă secretă (nu în cod).

## 2) Vercel (obligatoriu dacă vrei troubleshooting live de deploy)

Pentru intervenții în timp real pe deploy/producție:
- acces la proiectul Vercel (`Developer` sau `Admin`),
- acces la logs de build/runtime,
- acces la Environment Variables (cel puțin view/edit controlat).

### Pași
1. Vercel Dashboard → Team/Project → **Settings** → **Members**.
2. Adaugi utilizatorul/integratorul cu rol `Developer` (sau `Admin` dacă vrei intervenție completă).
3. Confirmi acces la:
   - **Deployments**,
   - **Runtime Logs**,
   - **Project Settings**,
   - **Environment Variables**.

## 3) Ce înseamnă „real-time” practic

Cu acces GitHub + Vercel pot face continuu:
- verific codul din branch-ul live,
- fac commit-uri + PR-uri imediat,
- verific build/deploy logs pe Vercel,
- aplic fix-uri iterative până la green build.

## 4) Ce NU pot face fără acces explicit

- Nu pot vedea dashboard-ul tău GitHub/Vercel automat.
- Nu pot citi logs/metrics de producție fără permisiuni.
- Nu pot edita env vars sau redeploy fără rolurile corespunzătoare.

## 5) Setup minim ca să încep imediat

Checklist:
- [ ] GitHub repo access (Write sau PR-based access)
- [ ] Vercel project access (Developer)
- [ ] Secrets setate corect (Supabase, Gemini, JWT, admin hash)
- [ ] Confirmare workflow: direct pe branch separat + PR review

După acest setup, pot opera practic „în timp real” pe cod + deploy pipeline.

## 6) Troubleshooting imediat pentru eroarea ta (`src refspec work does not match any`)

Eroarea apare când branch-ul pe care vrei să-l împingi nu există local **sau** nu are niciun commit valid în acel repo.

### Verificare rapidă (PowerShell)
```powershell
git rev-parse --is-inside-work-tree
git branch --show-current
git branch -a
git status
git log --oneline -n 3
```

### Fix standard (merge în 99% din cazuri)
```powershell
# 1) intră în folderul repo-ului corect
cd F:\aipress

# 2) asigură-te că ai cel puțin un commit local
git add .
git commit -m "chore: bootstrap branch"  # dacă spune nothing to commit, e ok

# 3) creează explicit branch-ul work (dacă nu există)
git checkout -B work

# 4) împinge branch-ul
git push -u origin work
```

### Dacă încă nu merge
1. Verifică să nu fii într-un alt folder Git (nested repo).
2. Rulează `git remote -v` și confirmă URL-ul exact.
3. Dacă branch-ul default este `main`, poți împinge temporar cu:
```powershell
git push -u origin HEAD
```
4. Dacă primești `403`, problema e de permisiuni/token (nu de branch).

### Cauza probabilă în cazul tău
- Remote-ul `origin` este corect setat, dar branch-ul `work` nu este prezent/activ în repo-ul local din care ai rulat comanda.
- Cel mai sigur: `git checkout -B work` urmat de `git push -u origin work`.
