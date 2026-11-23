import test from 'node:test';
import assert from 'node:assert/strict';
import { onRequestPost as subscribe } from '../functions/api/subscribe.js';
import { onRequestPost as sponsor } from '../functions/api/sponsor.js';

const sent = [];
globalThis.fetch = async (u, o) => {
  if (String(u).includes('siteverify')) return new Response(JSON.stringify({ success: o.body.get('response') === 'good' }));
  if (String(u).includes('resend')) { sent.push(JSON.parse(o.body)); return new Response('{}'); }
  throw new Error('unexpected ' + u);
};
const makeEnv = (changes = 1) => { const calls = []; return { calls, TURNSTILE_SECRET_KEY: 's', RESEND_API_KEY: 'k', NOTIFY_TO: 'info@ama.org.az',
  DB: { prepare: (q) => ({ bind: (...a) => ({ run: async () => { calls.push({ q, a }); return { meta: { changes } }; } }) }) } }; };
const run = async (fn, env, body) => {
  const pending = [];
  const res = await fn({ request: new Request('https://smf.az/api/x', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }), env, waitUntil: (p) => pending.push(p) });
  await Promise.all(pending);
  return { status: res.status, body: await res.json() };
};
const good = { name: 'Ayşən', email: 'A@Test.az', consent: true, turnstile: 'good', lang: 'az' };

test('subscribe: uğurlu qeyd bazaya yazılır və e-poçt gedir', async () => {
  sent.length = 0; const env = makeEnv();
  const r = await run(subscribe, env, good);
  assert.equal(r.status, 200); assert.deepEqual(env.calls[0].a, ['Ayşən', 'a@test.az', 'az']);
  assert.equal(sent.length, 1); assert.deepEqual(sent[0].to, ['info@ama.org.az']); assert.match(sent[0].subject, /Xəbərdar ol/);
});
test('subscribe: təkrar e-poçt üçün bildiriş getmir', async () => {
  sent.length = 0; const r = await run(subscribe, makeEnv(0), good);
  assert.equal(r.status, 200); assert.equal(sent.length, 0);
});
test('subscribe: yanlış e-poçt, razılıqsız və spam rədd olunur', async () => {
  const env = makeEnv();
  assert.equal((await run(subscribe, env, { ...good, email: 'x' })).status, 400);
  assert.equal((await run(subscribe, env, { ...good, consent: false })).status, 400);
  const t = await run(subscribe, env, { ...good, turnstile: 'bad' });
  assert.equal(t.status, 400); assert.equal(t.body.error, 'turnstile');
  assert.equal(env.calls.length, 0);
});
test('subscribe: bot tələsi bazaya yazmır', async () => {
  const env = makeEnv(); const r = await run(subscribe, env, { ...good, website: 'http://spam' });
  assert.equal(r.body.ok, true); assert.equal(env.calls.length, 0);
});
test('sponsor: yalnız düzgün seçimlər saxlanır, HTML qaçırılır', async () => {
  sent.length = 0; const env = makeEnv();
  const r = await run(sponsor, env, { company: '<b>Firma</b>', contact: 'Elvin', email: 'e@f.az', consent: true, turnstile: 'good', picks: ['stage:1', 'evil:9', 'brand:0', 'x'], summary: 'Səhnə: Videoçarx' });
  assert.equal(r.status, 200); assert.equal(env.calls[0].a[3], '["stage:1","brand:0"]');
  assert.ok(!sent[0].html.includes('<b>Firma</b>')); assert.match(sent[0].subject, /\[SMF Sponsor\]/);
});
test('sponsor: şirkətsiz sorğu rədd olunur', async () => {
  assert.equal((await run(sponsor, makeEnv(), { contact: 'x', email: 'e@f.az', consent: true, turnstile: 'good' })).status, 400);
});
