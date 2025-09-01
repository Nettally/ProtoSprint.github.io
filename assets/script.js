// Mobile nav + Dark mode + simple form handling
(function(){
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('#nav');
  const modeBtn = document.getElementById('mode-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const key = 'theme-preference';

  // Header elevation on scroll
  const onScroll = () => header && header.setAttribute('data-elevated', window.scrollY > 4);
  document.addEventListener('scroll', onScroll); onScroll();

  // Mobile nav toggle
  if (navToggle && nav){
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Theme
  const applyTheme = (t) => document.documentElement.setAttribute('data-theme', t);
  const stored = localStorage.getItem(key);
  if (stored){ applyTheme(stored); }
  else { applyTheme(prefersDark.matches ? 'dark' : 'light'); }
  prefersDark.addEventListener('change', (e)=>{
    if (!localStorage.getItem(key)) applyTheme(e.matches ? 'dark' : 'light');
  });
  if (modeBtn){
    modeBtn.addEventListener('click', ()=>{
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'light' ? 'dark' : 'light';
      applyTheme(next); localStorage.setItem(key, next);
      modeBtn.setAttribute('aria-pressed', String(next==='dark'));
    });
  }

  // Year
  const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();

  // Contact form (client-side demo)
  const form = document.getElementById('contact-form');
  if (form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const status = form.querySelector('.form-status');
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const msg = form.msg.value.trim();
      const consent = form.consent.checked;

      let valid = true;
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      const setError = (field, message='')=>{
        const el = form.querySelector('#'+field)?.closest('.field')?.querySelector('.error');
        if (el) el.textContent = message;
      };
      setError('name'); setError('email'); setError('msg');

      if (!name){ valid=false; setError('name','Bitte geben Sie Ihren Namen ein.'); }
      if (!email || !emailOk){ valid=false; setError('email','Bitte geben Sie eine gültige E‑Mail ein.'); }
      if (!msg){ valid=false; setError('msg','Bitte schreiben Sie eine kurze Nachricht.'); }
      if (!consent){ valid=false; alert('Bitte stimmen Sie der Speicherung zur Kontaktaufnahme zu.'); }

      if (!valid){ status.textContent = 'Bitte prüfen Sie Ihre Eingaben.'; return; }

      // Demo: send as mailto (kann später durch Backend/API ersetzt werden)
      const subject = encodeURIComponent('Neue Anfrage von ' + name);
      const body = encodeURIComponent('Name: '+name+'\nE-Mail: '+email+'\nTelefon: '+(form.tel.value||'')+'\n\nNachricht:\n'+msg);
      window.location.href = 'mailto:hallo@ihre-marke.de?subject='+subject+'&body='+body;
      status.textContent = 'Vielen Dank! Ihr E‑Mail‑Programm sollte sich gleich öffnen.';
      form.reset();
    });
  }

  // Smooth scroll for same-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const id = a.getAttribute('href');
      if (id.length > 1){
        const target = document.querySelector(id);
        if (target){
          e.preventDefault();
          target.scrollIntoView({behavior:'smooth', block:'start'});
          history.pushState(null, '', id);
        }
      }
    });
  });

})();