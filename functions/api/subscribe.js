import { json, clean, isEmail, readBody, verifyTurnstile, sendMail, esc } from './_lib.js';

export async function onRequestPost(context) {
  const { request, env } = context;
  const b = await readBody(request);
  if (!b) return json({ ok: false, error: 'invalid' }, 400);
  if (b.website) return json({ ok: true }); // bot tələsi
  const name = clean(b.name, 100);
  const email = clean(b.email, 200).toLowerCase();
  const lang = b.lang === 'en' ? 'en' : 'az';
  if (!name || !isEmail(email) || b.consent !== true) return json({ ok: false, error: 'invalid' }, 400);
  if (!(await verifyTurnstile(env, clean(b.turnstile, 2100), request.headers.get('CF-Connecting-IP')))) return json({ ok: false, error: 'turnstile' }, 400);
  try {
    const r = await env.DB.prepare('INSERT OR IGNORE INTO subscribers (name, email, lang) VALUES (?1, ?2, ?3)').bind(name, email, lang).run();
    if ((r.meta?.changes ?? 1) > 0) {
      context.waitUntil(sendMail(env, {
        subject: `[SMF Xəbərdar ol] ${name}`,
        replyTo: email,
        text: `Yeni qeyd\nAd: ${name}\nE-poçt: ${email}\nDil: ${lang}`,
        html: `<p><b>Yeni "Xəbərdar ol" qeydi</b></p><p>Ad: ${esc(name)}<br>E-poçt: ${esc(email)}<br>Dil: ${lang}</p>`,
      }));
    }
    return json({ ok: true });
  } catch {
    return json({ ok: false, error: 'server' }, 500);
  }
}

export const onRequest = () => json({ ok: false, error: 'method' }, 405);
