import { json, clean, isEmail, readBody, verifyTurnstile, sendMail, esc } from './_lib.js';

const PICK = /^(brand|stage|promo|reg):\d$/;

export async function onRequestPost(context) {
  const { request, env } = context;
  const b = await readBody(request);
  if (!b) return json({ ok: false, error: 'invalid' }, 400);
  if (b.website) return json({ ok: true });
  const company = clean(b.company, 120);
  const contact = clean(b.contact, 120);
  const email = clean(b.email, 200).toLowerCase();
  const lang = b.lang === 'en' ? 'en' : 'az';
  const picks = (Array.isArray(b.picks) ? b.picks : []).filter((p) => typeof p === 'string' && PICK.test(p)).slice(0, 12);
  const summary = clean(b.summary, 1000);
  if (!company || !contact || !isEmail(email) || b.consent !== true) return json({ ok: false, error: 'invalid' }, 400);
  if (!(await verifyTurnstile(env, clean(b.turnstile, 2100), request.headers.get('CF-Connecting-IP')))) return json({ ok: false, error: 'turnstile' }, 400);
  try {
    await env.DB.prepare('INSERT INTO sponsor_requests (company, contact, email, picks, summary, lang) VALUES (?1, ?2, ?3, ?4, ?5, ?6)')
      .bind(company, contact, email, JSON.stringify(picks), summary, lang).run();
    context.waitUntil(sendMail(env, {
      subject: `[SMF Sponsor] ${company}`,
      replyTo: email,
      text: `Yeni sponsorluq sorğusu\nŞirkət: ${company}\nƏlaqə: ${contact}\nE-poçt: ${email}\nSeçimlər: ${summary || 'seçilməyib'}\nDil: ${lang}`,
      html: `<p><b>Yeni sponsorluq sorğusu</b></p><p>Şirkət: ${esc(company)}<br>Əlaqə: ${esc(contact)}<br>E-poçt: ${esc(email)}<br>Seçimlər: ${esc(summary || 'seçilməyib')}<br>Dil: ${lang}</p>`,
    }));
    return json({ ok: true });
  } catch {
    return json({ ok: false, error: 'server' }, 500);
  }
}

export const onRequest = () => json({ ok: false, error: 'method' }, 405);
