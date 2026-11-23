import en from './en.json';
export type Lang = 'az' | 'en';
export const mk = (lang: Lang) => (s: string): string => (lang === 'en' && (en as Record<string, string>)[s] !== undefined ? (en as Record<string, string>)[s] : s);
const routes: Record<string, [string, string]> = { home: ['', ''], tickets: ['bilet', 'tickets'], privacy: ['gizlilik', 'privacy'] };
export const url = (lang: Lang, page = 'home') => {
  const slug = routes[page][lang === 'az' ? 0 : 1];
  return (lang === 'az' ? '/' : '/en/') + (slug ? slug + '/' : '');
};
export const DESC_AZ = "Strateji Marketinq Forumu: marketinq peşəkarlarının Bakıdakı görüş nöqtəsi. SMF 4 tezliklə.";
export const nav: [string, string][] = [['haqqinda', 'Forum haqqında'], ['forumlar', 'Keçmiş forumlar'], ['komanda', 'Komanda'], ['aletler', 'Alətlər'], ['sponsor', 'Sponsor ol']];
