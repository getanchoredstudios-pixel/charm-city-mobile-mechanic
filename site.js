const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  burger?.setAttribute('aria-expanded', 'false');
}));
document.querySelectorAll('.dd-toggle').forEach(t => t.addEventListener('click', () => {
  const open = t.parentElement.classList.toggle('open');
  t.setAttribute('aria-expanded', open);
}));
document.getElementById('yr').textContent = new Date().getFullYear();

const PAY = { cashtag: '$keys2anotherworld', zelle: '', cardLink: '' };
const paySection = document.getElementById('pay');
if (paySection) {
  const tag = PAY.cashtag.replace(/^\$/, '');
  const show = (id, on) => { const el = document.getElementById(id); if (el) el.style.display = on ? '' : 'none'; };
  show('payCashApp', !!tag); show('payZelle', !!PAY.zelle); show('payCard', !!PAY.cardLink);
  if (tag) {
    document.querySelector('[data-pay="cashtag"]').textContent = '$' + tag;
    document.querySelector('[data-pay-link="cashapp"]').href = 'https://cash.app/$' + encodeURIComponent(tag);
  }
  if (PAY.zelle) document.querySelector('[data-pay="zelle"]').textContent = PAY.zelle;
  if (PAY.cardLink) document.querySelector('[data-pay-link="card"]').href = PAY.cardLink;
}

const quoteForm = document.getElementById('quoteForm');
if (quoteForm) {
  const msg = document.getElementById('formMsg');
  quoteForm.addEventListener('submit', async e => {
    e.preventDefault(); const btn = quoteForm.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = 'Sending...'; msg.className = 'form-msg';
    try {
      const res = await fetch(quoteForm.action,{method:'POST',body:new FormData(quoteForm),headers:{Accept:'application/json'}});
      if (!res.ok) throw new Error();
      quoteForm.reset(); msg.textContent = "Got it! I'll reach out shortly. Need it sooner? Call (667) 967-9166."; msg.className='form-msg ok';
    } catch { msg.textContent='Something went wrong. Please call or text (667) 967-9166 instead.'; msg.className='form-msg err'; }
    btn.disabled=false; btn.textContent='Send My Request';
  });
}

const authorizationForm = document.getElementById('authorizationForm');
if (authorizationForm) {
  const authorizationMsg=document.getElementById('authorizationMsg');
  const signatureDate=document.getElementById('signatureDate');
  const localToday=new Date(); localToday.setMinutes(localToday.getMinutes()-localToday.getTimezoneOffset());
  signatureDate.value=localToday.toISOString().slice(0,10);
  const printAuthorization=()=>window.print();
  document.getElementById('printAuthorization')?.addEventListener('click',printAuthorization);
  document.getElementById('printAuthorizationBottom')?.addEventListener('click',printAuthorization);
  authorizationForm.addEventListener('submit',async e=>{
    e.preventDefault();
    const customerName=document.getElementById('authName').value.trim();
    const signatureName=document.getElementById('signatureName').value.trim();
    if(customerName.toLocaleLowerCase()!==signatureName.toLocaleLowerCase()){
      authorizationMsg.textContent='Your typed signature must match the customer legal name above.'; authorizationMsg.className='form-msg err'; document.getElementById('signatureName').focus(); return;
    }
    const signedAt=new Date().toISOString(); document.getElementById('signedAt').value=signedAt;
    const data=new FormData(authorizationForm);
    document.getElementById('recordSummary').value=[...data.entries()].filter(([key])=>!key.startsWith('_')&&key!=='record_summary').map(([key,value])=>key+': '+value).join('\n');
    const btn=authorizationForm.querySelector('button[type="submit"]'); btn.disabled=true; btn.textContent='Submitting signed authorization...'; authorizationMsg.className='form-msg';
    try {
      const res=await fetch(authorizationForm.action,{method:'POST',body:new FormData(authorizationForm),headers:{Accept:'application/json'}}); if(!res.ok)throw new Error();
      authorizationMsg.textContent='Signed authorization received at '+new Date(signedAt).toLocaleString()+'. Print or save this page now for your records.'; authorizationMsg.className='form-msg ok';
      authorizationForm.querySelectorAll('input, textarea, select, button[type="submit"]').forEach(el=>el.disabled=true);
    } catch { authorizationMsg.textContent='The authorization was not submitted. Nothing has been signed. Please try again or call (667) 967-9166 for a paper form.'; authorizationMsg.className='form-msg err'; btn.disabled=false; btn.textContent='Sign and Submit'; }
  });
}
