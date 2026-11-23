/* SMF.AZ: bütün interaktivlik. Dil səhifənin <html lang> atributundan oxunur. */
(function(){
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const L=document.documentElement.lang==='en'?'en':'az';
const EN=window.__EN||{};
const T=s=>L==='en'&&EN[s]!==undefined?EN[s]:s;
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
if($('#wall')){
// foto divarı
[[['speaker','4/5'],['panel1','1'],['register','4/3']],[['audience','4/3'],['attendees','1'],['standing','4/5']],[['stage','1'],['panel2','4/5'],['lanyard','4/3']]].forEach(c=>{
 const col=document.createElement('div');col.className='col';
 const h=c.map(([n,r])=>`<img src="/img/wall/${n}.jpg" alt="" style="aspect-ratio:${r}">`).join('');col.innerHTML=h+h;$('#wall').append(col)});
// nöqtə animasiyaları
$$('.fc').forEach(c=>{const n=+c.dataset.n,cols=+c.dataset.cols,rows=n/cols,pat=c.dataset.pat,d=$('.dots',c);
 d.style.cssText=`grid-template-columns:repeat(${cols},1fr);aspect-ratio:${cols}/${rows}`;
 for(let i=0;i<n;i++){const x=i%cols,y=(i/cols)|0,e=document.createElement('i');
  e.style.setProperty('--d',(pat==='seq'?i*16:pat==='rad'?Math.hypot(x-(cols-1)/2,y-(rows-1)/2)*70:(x+y)*38)+'ms');d.append(e)}});
function count(c){const n=+c.dataset.n,el=$('.cnt',c),sm=$('small',c),t0=performance.now();
 (function f(t){const k=Math.min(1,(t-t0)/1800),e=1-Math.pow(1-k,3);el.firstChild.nodeValue=Math.round(n*e)+(k<1?'':'+');if(k<1)requestAnimationFrame(f)})(t0)}
// açılış animasiyaları
function reveal(t){t.classList.add('in');
 if(t.classList.contains('fc'))RM?(t.querySelector('.cnt').firstChild.nodeValue=t.dataset.n+'+'):count(t);
 if(t.classList.contains('morph')){const a=$('#ma');if(RM)a.setAttribute('dur','0.01s');a.beginElement()}}
const rev=$$('.wipe,.fc,.steps,.morph');
function chk(){rev.forEach(t=>{if(t._d)return;const r=t.getBoundingClientRect();if(r.top<innerHeight*.88&&r.bottom>0){t._d=1;reveal(t)}})}
addEventListener('scroll',chk,{passive:true});addEventListener('resize',chk);chk();
// alətlər
const nf=new Intl.NumberFormat('az',{maximumFractionDigits:2}),F=x=>nf.format(x);
const num=(r,n)=>parseFloat(String($(`[name=${n}]`,r).value).replace(',','.'));
const out=(r,k,v)=>{$(`[data-o=${k}]`,r.parentNode).textContent=v};
$$('.tabs button').forEach(b=>b.onclick=()=>{$$('.tabs button').forEach(x=>x.setAttribute('aria-selected',x===b));['calc','utm','ab','soc','qr','cal','gl'].forEach(k=>$('#t-'+k).hidden=k!==b.dataset.t)});
const calc=$('#calc');function rc(){const s=num(calc,'s'),r=num(calc,'r'),o=num(calc,'o'),i=num(calc,'i'),c=num(calc,'c'),m=(ok,v)=>ok?v:'—';
 out(calc,'roas',m(s>0&&r>=0,F(r/s)+'×'));out(calc,'roi',m(s>0&&r>=0,F((r-s)/s*100)+'%'));out(calc,'cpa',m(s>0&&o>0,F(s/o)+' ₼'));
 out(calc,'ctr',m(i>0&&c>=0,F(c/i*100)+'%'));out(calc,'cpc',m(s>=0&&c>0,F(s/c)+' ₼'));out(calc,'cpm',m(s>=0&&i>0,F(s/i*1000)+' ₼'));out(calc,'cvr',m(c>0&&o>=0,F(o/c*100)+'%'))}
calc.oninput=rc;rc();
const utm=$('#utm');function ru(){const u=utm.querySelector('[name=url]').value.trim(),o=$('#utmo');if(!u){o.value='';return}
 try{const x=new URL(/^https?:/i.test(u)?u:'https://'+u);['source','medium','campaign','term','content'].forEach(k=>{const v=utm.querySelector(`[name=${k}]`).value.trim();if(v)x.searchParams.set('utm_'+k,v)});o.value=x.toString()}catch(e){o.value=T('Keçərli link yaz')}}
utm.oninput=ru;$('#cp').onclick=async()=>{const o=$('#utmo');try{await navigator.clipboard.writeText(o.value)}catch(e){o.select();document.execCommand('copy')}$('#cp').textContent=T('Kopyalandı');setTimeout(()=>$('#cp').textContent=T('Kopyala'),1500)};
const erf=x=>{const t=1/(1+.3275911*Math.abs(x)),y=1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-.284496736)*t+.254829592)*t*Math.exp(-x*x);return x>=0?y:-y};
const ab=$('#ab');function ra(){const av=num(ab,'av'),ac=num(ab,'ac'),bv=num(ab,'bv'),bc=num(ab,'bc'),ok=av>0&&bv>0&&ac>=0&&bc>=0&&ac<=av&&bc<=bv;
 if(!ok){['pa','pb','up','cf'].forEach(k=>out(ab,k,'—'));out(ab,'vd',T('Rəqəmləri yoxla.'));return}
 const pa=ac/av,pb=bc/bv,pp=(ac+bc)/(av+bv),se=Math.sqrt(pp*(1-pp)*(1/av+1/bv)),z=se?(pb-pa)/se:0,p=2*(1-.5*(1+erf(Math.abs(z)/Math.SQRT2)));
 out(ab,'pa',F(pa*100)+'%');out(ab,'pb',F(pb*100)+'%');out(ab,'up',pa>0?(pb>=pa?'+':'')+F((pb-pa)/pa*100)+'%':'—');out(ab,'cf',F((1-p)*100)+'%');
 out(ab,'vd',p<.05?(pb>pa?T('B variantı statistik əhəmiyyətli dərəcədə yaxşıdır.'):T('A variantı statistik əhəmiyyətli dərəcədə yaxşıdır.')):T('Fərq hələ əhəmiyyətli deyil, daha çox data lazımdır.'))}
ab.oninput=ra;ra();
function rl(){const n=[...$('#txt').value].length,l=+$('#lim').value;$('#cn').textContent=n+' / '+l;$('#mt').classList.toggle('over',n>l);$('#mt i').style.width=Math.min(100,n/l*100)+'%'}
$('#txt').oninput=rl;$('#lim').onchange=rl;
// 3D sponsor sxemi
const U=26,pt=(x,y,z)=>[210+(x-y)*U*.866,120+(x+y)*U*.5-z*U].map(n=>n.toFixed(1)).join(',');
const cube=(x,y,w,d,h,c)=>{const p=(a,b,z)=>pt(x+a,y+b,z);return `<polygon points="${p(0,0,h)} ${p(w,0,h)} ${p(w,d,h)} ${p(0,d,h)}" fill="${c[0]}"/><polygon points="${p(0,d,h)} ${p(w,d,h)} ${p(w,d,0)} ${p(0,d,0)}" fill="${c[1]}"/><polygon points="${p(w,0,h)} ${p(w,d,h)} ${p(w,d,0)} ${p(w,0,0)}" fill="${c[2]}"/>`};
const star=(x,y,s)=>{const [a,b]=pt(x,y,0).split(',');return `<path class="stx" transform="translate(${a} ${b}) scale(${s})" d="M0 -14L3.5 -3.5L14 0L3.5 3.5L0 14L-3.5 3.5L-14 0L-3.5 -3.5Z" fill="#EE6611" stroke="#fff" stroke-width="1.5"/>`};
const W=['#FFFFFF','#DCEBE1','#B7CFC0'],G=['#3E9E5C','#2A7A45','#1D5E34'],M=['#A8F0A8','#77DD77','#4FBF5C'],O=['#FF8A3D','#EE6611','#C4500A'],R=['#E9F6EC','#BFD9C7','#9DBFA9'];
const ZM={brand:['Brandwall','İştirakçıların foto çəkdirdiyi fon. Loqonuz hər kadrda görünür.',['Loqo yerləşdirmə','Fotozona kadrlarında görünmə']],
 stage:['Səhnə','Səhnədə şirkətin təqdim olunması. Bütün salonun gözü qarşısında.',['Şirkət haqqında məlumat','Loqo (səhnə fonu və ekranlar)','Videoçarx']],
 promo:['Promo zonalar','İştirakçılarla birbaşa görüş nöqtələri.',['Stend','Hədiyyə və nümunə paylanması','Aktivasiya (oyun, müsabiqə)']],
 reg:['Qeydiyyat','İştirakçının forumla ilk təması.',['Qeydiyyat masasında loqo','İştirakçı kartında və lentində loqo']]};
const ITEMS=[['brand',s=>cube(1,0,5.5,.4,4.2,s?O:W)+star(3.7,.4,1.1)],['stage',s=>cube(1.5,1.3,4.2,3,.9,s?O:G)+star(3.6,2.8,.9)],['promo',s=>cube(0,5.3,1.7,1.7,1.5,s?O:M)+star(.85,6.15,.8)],['reg',s=>cube(2.6,5.6,2.4,.9,.9,s?O:R)+star(3.8,6.05,.7)],['promo',s=>cube(5.6,5.3,1.7,1.7,1.5,s?O:M)+star(6.45,6.15,.8)]];
const picks=new Set();let cur='brand';
const sumr=()=>[...picks].map(k=>{const [z,i]=k.split(':');return T(ZM[z][0])+': '+T(ZM[z][2][i])});
function drawIso(){$('#iso').innerHTML=`<polygon points="${pt(-.6,-.6,0)} ${pt(8,-.6,0)} ${pt(8,8,0)} ${pt(-.6,8,0)}" fill="rgba(255,255,255,.07)"/>`+ITEMS.map(([k,f],i)=>`<g class="zone${k===cur?' sel':''}${[...picks].some(p=>p.startsWith(k+':'))?' has':''}" data-z="${k}" tabindex="0" role="button" aria-label="${T(ZM[k][0])}"><g class="bob" style="--dl:${i*.4}s">${f(k===cur)}</g></g>`).join('');
 $('#zp').innerHTML=Object.keys(ZM).map(k=>`<button type="button" data-z="${k}" aria-pressed="${k===cur}">${T(ZM[k][0])}</button>`).join('');
 const z=ZM[cur];$('#zt').textContent=T(z[0]);$('#zd').textContent=T(z[1]);
 $('#zo').innerHTML=z[2].map((o,i)=>`<label class="op"><input type="checkbox" data-k="${cur}:${i}"${picks.has(cur+':'+i)?' checked':''}>${T(o)}</label>`).join('');
 const s=sumr();$('#zs').textContent=s.length?T('Seçilmiş yerləşdirmələr')+' ('+s.length+'): '+s.join('; '):T('Hələ heç nə seçilməyib')}
$('#zp').onclick=e=>{const b=e.target.closest('button');if(b){cur=b.dataset.z;drawIso()}};
$('#iso').onclick=e=>{const g=e.target.closest('.zone');if(g){cur=g.dataset.z;drawIso()}};
$('#iso').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){const g=e.target.closest('.zone');if(g){e.preventDefault();cur=g.dataset.z;drawIso();$(`.zone[data-z=${cur}]`).focus()}}};
$('#zo').onchange=e=>{const c=e.target,k=c.dataset.k;if(!k)return;c.checked?picks.add(k):picks.delete(k);drawIso();$(`#zo [data-k="${k}"]`).focus()};
// QR kod
function rq(){const c=$('#qrc'),x=c.getContext('2d'),lg=$('#qrl').checked;x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);
 try{const q=qrcode(0,lg?'H':'M');q.addData($('#qrt').value||' ');q.make();const n=q.getModuleCount(),m=2,s=c.width/(n+m*2);x.fillStyle='#0F2E1E';
  for(let r=0;r<n;r++)for(let k=0;k<n;k++)if(q.isDark(r,k))x.fillRect(Math.floor((k+m)*s),Math.floor((r+m)*s),Math.ceil(s),Math.ceil(s));
  if(lg){const w=c.width*.2,p=(c.width-w)/2;x.fillStyle='#fff';x.beginPath();x.roundRect(p-9,p-9,w+18,w+18,14);x.fill();x.save();x.translate(p,p+w*.06);const k2=w/101.33;x.scale(k2,k2);x.beginPath();x.rect(0,0,101.33,70);x.clip();x.fillStyle='#EE6611';x.fill(new Path2D($('#smf path').getAttribute('d')));x.restore()}
 }catch(e){x.fillStyle='#0F2E1E';x.font='600 22px sans-serif';x.fillText(T('Link çox uzundur'),20,40)}}
$('#qrt').oninput=rq;$('#qrl').onchange=rq;$('#qrd').onclick=()=>{const a=document.createElement('a');a.href=$('#qrc').toDataURL('image/png');a.download='smf-qr.png';a.click()};
// təqvim və lüğət
const l2=(a,b)=>L==='en'?b:a;
const MO=[['Yanvar','January'],['Fevral','February'],['Mart','March'],['Aprel','April'],['May','May'],['İyun','June'],['İyul','July'],['Avqust','August'],['Sentyabr','September'],['Oktyabr','October'],['Noyabr','November'],['Dekabr','December']];
const CAL=[[1,'1','1','Yeni il','New Year',0],[1,'20','20','Ümumxalq hüzn günü','Day of National Mourning',0],[2,'14','14','Sevgililər günü','Valentine’s Day',1],[3,'8','8','Qadınlar günü','Women’s Day',0],[3,'20–24','20–24','Novruz bayramı','Novruz holiday',0],[5,'9','9','Faşizm üzərində Qələbə günü','Victory over Fascism Day',0],[5,'28','28','Müstəqillik günü','Independence Day',0],[6,'1','1','Uşaqların müdafiəsi günü','Children’s Day',1],[6,'15','15','Milli Qurtuluş günü','National Salvation Day',0],[6,'26','26','Silahlı Qüvvələr günü','Armed Forces Day',0],[9,'27','27','Anım günü','Remembrance Day',0],[10,'18','18','Müstəqilliyin bərpası günü','Independence Restoration Day',0],[11,'8','8','Zəfər günü','Victory Day',0],[11,'9','9','Dövlət Bayrağı günü','National Flag Day',0],[11,'11','11','11.11 endirim günü','11.11 sale day',1],[11,'12','12','Konstitusiya günü','Constitution Day',0],[11,'17','17','Milli Dirçəliş günü','National Revival Day',0],[11,'son cümə','last Friday','Qara Cümə','Black Friday',1],[12,'31','31','Dünya Azərbaycanlılarının Həmrəyliyi günü','Day of Solidarity of World Azerbaijanis',0]];
function rcal(){const by={};CAL.forEach(c=>(by[c[0]]=by[c[0]]||[]).push(c));
 $('#cal').innerHTML=Object.keys(by).map(m=>`<div class="mo"><h4>${l2(...MO[m-1])}</h4><ul>${by[m].map(c=>`<li><b>${l2(c[1],c[2])}</b>${c[5]?'<i class="mk"></i>':''}${l2(c[3],c[4])}</li>`).join('')}</ul></div>`).join('')}
const GL=[['ROAS','ROAS','Reklama xərclənən hər manata görə gələn gəlir.','Revenue earned for every unit spent on ads.'],['ROI','ROI','Yatırımın gətirdiyi qazancın yatırım məbləğinə nisbəti.','Profit from an investment relative to what you invested.'],['CPA','CPA','Bir sifarişin və ya hədəf əməliyyatın orta qiyməti.','Average cost of one order or target action.'],['CPC','CPC','Bir klikin qiyməti.','Cost of one click.'],['CPM','CPM','Reklamın 1000 dəfə göstərilməsinin qiyməti.','Cost of showing an ad 1000 times.'],['CTR','CTR','Göstərişlərdən klikə çevrilənlərin faizi.','Percentage of impressions that turn into clicks.'],['KPI','KPI','Məqsədə nə qədər yaxınlaşdığını göstərən əsas ölçü.','A key measure showing how close you are to a goal.'],['Konversiya','Conversion','Ziyarətçinin hədəf addımı atması: alış, qeydiyyat, zəng.','A visitor taking the target step: purchase, sign-up, call.'],['Satış qıfı (funnel)','Funnel','Tanışlıqdan alışa qədər müştərinin keçdiyi mərhələlər.','The stages a customer passes from awareness to purchase.'],['Brif','Brief','Layihənin məqsədini, auditoriyasını və şərtlərini toplayan qısa sənəd.','A short document with a project’s goal, audience, and conditions.'],['Persona','Persona','İdeal müştərinin ətraflı təsviri.','A detailed portrait of an ideal customer.'],['USP','USP','Brendi rəqiblərdən ayıran unikal təklif.','The unique offer that sets a brand apart from competitors.'],['Retargeting','Retargeting','Saytınıza baxıb getmiş insanlara yenidən reklam göstərmək.','Showing ads again to people who visited your site and left.'],['SEO','SEO','Saytı axtarış nəticələrində yuxarı çıxarmaq üçün görülən işlər.','Work done to rank a site higher in search results.'],['Pozisiyalaşdırma','Positioning','Brendin müştərinin zehnində tutduğu yer.','The place a brand holds in the customer’s mind.'],['İnsayt','Insight','Auditoriyanın davranışının arxasındakı gizli səbəb.','The hidden reason behind audience behavior.'],['A/B test','A/B test','İki variantı müqayisə edib daha yaxşısını seçmək.','Comparing two versions to pick the better one.']];
function rgl(){const q=$('#gq').value.trim().toLowerCase();$('#gl').innerHTML=GL.filter(g=>!q||(l2(g[0],g[1])+' '+l2(g[2],g[3])).toLowerCase().includes(q)).map(g=>`<div><dt>${l2(g[0],g[1])}</dt><dd>${l2(g[2],g[3])}</dd></div>`).join('')||`<p class="note">${T('Heç nə tapılmadı')}</p>`}
$('#gq').oninput=rgl;

window.__picks=()=>({keys:[...picks],summary:sumr()});
drawIso();rq();rcal();rgl();
}
// formalar
const MSG={sending:'Göndərilir...',okSub:'Təşəkkür edirik! Qeydin qəbul olundu, satış açılanda sənə yazacağıq.',okSp:'Təşəkkür edirik! Sorğun qəbul olundu, tezliklə sənə yazacağıq.',err:'Göndərmək alınmadı. Bir az sonra yenidən cəhd et.',ts:'Spam yoxlaması tamamlanmayıb. Səhifəni yeniləyib yenidən cəhd et.',val:'Məlumatları yoxla və razılığı işarələ.'};
$$('form.f').forEach(f=>f.addEventListener('submit',async e=>{
 e.preventDefault();const ok=$('.ok',f),er=$('.err',f),btn=$('button[type=submit]',f),sp=f.dataset.api.endsWith('sponsor');
 ok.hidden=er.hidden=true;const body={lang:L};new FormData(f).forEach((v,k)=>{body[k]=v});
 body.consent=!!$('[name=consent]',f).checked;body.turnstile=body['cf-turnstile-response']||'';delete body['cf-turnstile-response'];
 if(sp&&window.__picks){const p=window.__picks();body.picks=p.keys;body.summary=p.summary.join('; ')}
 btn.disabled=true;const old=btn.textContent;btn.textContent=T(MSG.sending);
 try{const r=await fetch(f.dataset.api,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const j=await r.json().catch(()=>({}));
  if(r.ok&&j.ok){ok.textContent=T(sp?MSG.okSp:MSG.okSub);ok.hidden=false;f.reset();try{window.turnstile&&window.turnstile.reset()}catch(x){}}
  else{er.textContent=T(j.error==='turnstile'?MSG.ts:j.error==='invalid'?MSG.val:MSG.err);er.hidden=false}
 }catch(x){er.textContent=T(MSG.err);er.hidden=false}
 btn.disabled=false;btn.textContent=old}));
// razılaşma
const cons=$('#cons');if(cons){let seen=false;try{seen=localStorage.getItem('smf-consent')==='1'}catch(e){}cons.hidden=seen;
 $('#ok').onclick=()=>{cons.hidden=true;try{localStorage.setItem('smf-consent','1')}catch(e){}};
 $('#mr').onclick=()=>{const u=$('#cd');u.hidden=!u.hidden}}
})();
