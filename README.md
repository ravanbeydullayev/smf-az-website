# Strateji Marketinq Forumu: smf.az

Astro (statik sayt) + Cloudflare Pages Functions (formalar) + Cloudflare D1 (baza) + Turnstile (spam) + e-poçt bildirişi.

## Struktur
- `src/components/Home.astro`: ana səhifənin bölmələri (mətnlər `t("...")` ilə, EN tərcümələri `src/i18n/en.json` faylında)
- `src/pages/`: `/`, `/en/`, `/bilet/`, `/en/tickets/`, `/gizlilik/`, `/en/privacy/`, `404`
- `public/js/site.js`: bütün interaktivlik (animasiyalar, alətlər, 3D sponsor sxemi, formalar)
- `functions/api/subscribe.js` və `sponsor.js`: formaları qəbul edir, bazaya yazır, e-poçt göndərir
- `schema.sql`: baza cədvəlləri

## Tez dəyişikliklər
- **Tarix tələb olunanda:** bilet səhifəsinin mətni `src/components/Tickets.astro`, ana səhifədəki "SMF 4" mətnləri `Home.astro` faylındadır.
- **Mətn və tərcümə:** AZ mətn `Home.astro` içində, EN qarşılığı `src/i18n/en.json` içində (açar = AZ mətn).
- **Rənglər:** `src/styles/global.css` yuxarısındakı `:root`.
- **Komanda:** `Home.astro` içində `class="team"` bölməsi, şəkillər `public/img/team/`.

## Lokal işə salmaq
```
npm install
npm run dev        # sayt (formalar işləməz, çünki API yoxdur)
npm test           # API testləri
```
Formalarla birlikdə test: `npm run build`, sonra `npx wrangler pages dev dist --d1 DB` (`.dev.vars.example` faylını `.dev.vars` kimi kopyala).

## Cloudflare-ə qoşmaq (birlikdə edəcəyik)
1. GitHub-da repo aç, bu qovluğu yüklə.
2. Cloudflare: **Workers & Pages → Create → Pages → Connect to Git**. Framework: Astro, Build command: `npm run build`, Output: `dist`.
3. **D1:** `npx wrangler d1 create smf-az`, çıxan `database_id`-ni `wrangler.toml` içinə yaz, sonra `npx wrangler d1 execute smf-az --remote --file=schema.sql`. Pages layihəsində Settings → Bindings → D1: ad `DB`.
4. **Turnstile:** Cloudflare → Turnstile → yeni widget (`smf.az`). Site key: Pages mühit dəyişəni `PUBLIC_TURNSTILE_SITEKEY`. Secret key: `TURNSTILE_SECRET_KEY` (Secret).
5. **E-poçt bildirişi:** `NOTIFY_TO=info@ama.org.az`, `MAIL_FROM` (təsdiqlənmiş domen ünvanı), `RESEND_API_KEY` (Secret). Açar yoxdursa qeydlər yenə bazaya yazılır, yalnız e-poçt getmir.
6. **Domen:** Pages → Custom domains → `smf.az`.

## Qeydləri çıxarmaq
```
npx wrangler d1 execute smf-az --remote --command "SELECT name,email,lang,created_at FROM subscribers" --json
```
(Admin panel Faza 2-də gələcək.)

## Əlavə ediləcəklər
Real bilet ödənişi (provayder seçiləndə), admin panel, şəxsi kabinet, şriftləri özümüzdən yükləmək, analitika.
