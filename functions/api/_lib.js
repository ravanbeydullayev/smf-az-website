export const json = (o, s = 200) =>
  new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const clean = (v, max) => (typeof v === 'string' ? v.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max) : '');
export const isEmail = (e) => e.length <= 200 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);

export async function readBody(request) {
  if (!(request.headers.get('content-type') || '').includes('application/json')) return null;
  try {
    const text = await request.text();
    return text.length > 20000 ? null : JSON.parse(text);
  } catch {
    return null;
  }
}

export async function verifyTurnstile(env, token, ip) {
  if (!env.TURNSTILE_SECRET_KEY || !token) return false;
  const fd = new FormData();
  fd.append('secret', env.TURNSTILE_SECRET_KEY);
  fd.append('response', token);
  if (ip) fd.append('remoteip', ip);
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: fd });
    return !!(await r.json()).success;
  } catch {
    return false;
  }
}

// Bildiriş e-poçtu (Resend). Açar və ünvan yoxdursa sakitcə keçir, qeyd yenə bazaya yazılıb.
export async function sendMail(env, { subject, html, text, replyTo }) {
  if (!env.RESEND_API_KEY || !env.NOTIFY_TO) return false;
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: env.MAIL_FROM || 'SMF <onboarding@resend.dev>', to: [env.NOTIFY_TO], subject, html, text, reply_to: replyTo }),
    });
    return r.ok;
  } catch {
    return false;
  }
}
