// =========================================================
// ProtoSprint
// Navigation + Dark Mode + Kontaktformular
// =========================================================

(function () {

  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('#nav');
  const modeBtn = document.getElementById('mode-toggle');

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const themeKey = 'theme-preference';

  /*
   * WICHTIG:
   * Hier deine echte Kontaktadresse eintragen.
   */
  const CONTACT_EMAIL = 'annette.hinreier@gmail.com';


  // =======================================================
  // HEADER
  // =======================================================

  const onScroll = () => {
    if (header) {
      header.setAttribute(
        'data-elevated',
        String(window.scrollY > 4)
      );
    }
  };

  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  // =======================================================
  // MOBILE NAVIGATION
  // =======================================================

  if (navToggle && nav) {

    navToggle.addEventListener('click', () => {

      const open = nav.classList.toggle('open');

      navToggle.setAttribute(
        'aria-expanded',
        String(open)
      );

    });

  }


  // Navigation schließen, wenn ein Link angeklickt wird

  if (nav) {

    nav.querySelectorAll('a').forEach((link) => {

      link.addEventListener('click', () => {

        nav.classList.remove('open');

        if (navToggle) {
          navToggle.setAttribute('aria-expanded', 'false');
        }

      });

    });

  }


  // ESC schließt mobiles Menü

  document.addEventListener('keydown', (event) => {

    if (
      event.key === 'Escape' &&
      nav &&
      nav.classList.contains('open')
    ) {

      nav.classList.remove('open');

      if (navToggle) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }

    }

  });


  // =======================================================
  // DARK / LIGHT MODE
  // =======================================================

  const applyTheme = (theme) => {

    document.documentElement.setAttribute(
      'data-theme',
      theme
    );

    if (modeBtn) {

      modeBtn.setAttribute(
        'aria-pressed',
        String(theme === 'dark')
      );

      modeBtn.setAttribute(
        'title',
        theme === 'dark'
          ? 'Zum hellen Modus wechseln'
          : 'Zum dunklen Modus wechseln'
      );

    }

  };


  const storedTheme = localStorage.getItem(themeKey);

  if (storedTheme) {

    applyTheme(storedTheme);

  } else {

    applyTheme(
      prefersDark.matches ? 'dark' : 'light'
    );

  }


  // Auf Änderung der Systemeinstellung reagieren

  prefersDark.addEventListener('change', (event) => {

    if (!localStorage.getItem(themeKey)) {

      applyTheme(
        event.matches ? 'dark' : 'light'
      );

    }

  });


  // Manueller Theme-Schalter

  if (modeBtn) {

    modeBtn.addEventListener('click', () => {

      const current =
        document.documentElement.getAttribute('data-theme')
        || 'light';

      const next =
        current === 'light'
          ? 'dark'
          : 'light';

      applyTheme(next);

      localStorage.setItem(
        themeKey,
        next
      );

    });

  }


  // =======================================================
  // JAHR IM FOOTER
  // =======================================================

  const year = document.getElementById('year');

  if (year) {
    year.textContent = new Date().getFullYear();
  }


  // =======================================================
  // KONTAKTFORMULAR
  // =======================================================

  const form = document.getElementById('contact-form');

  if (form) {

    form.addEventListener('submit', (event) => {

      event.preventDefault();


      const status =
        form.querySelector('.form-status');


      const name =
        form.name.value.trim();

      const email =
        form.email.value.trim();

      const tel =
        form.tel.value.trim();

      const msg =
        form.msg.value.trim();

      const consent =
        form.consent.checked;


      let valid = true;


      // ---------------------------------------------------
      // E-Mail prüfen
      // ---------------------------------------------------

      const emailOk =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);


      // ---------------------------------------------------
      // Fehlermeldungen setzen
      // ---------------------------------------------------

      const setError = (field, message = '') => {

        const input =
          form.querySelector('#' + field);

        const error =
          input
            ?.closest('.field')
            ?.querySelector('.error');

        if (error) {
          error.textContent = message;
        }

      };


      // alte Fehler löschen

      setError('name');
      setError('email');
      setError('msg');


      // ---------------------------------------------------
      // Validierung
      // ---------------------------------------------------

      if (!name) {

        valid = false;

        setError(
          'name',
          'Bitte gib deinen Namen ein.'
        );

      }


      if (!email || !emailOk) {

        valid = false;

        setError(
          'email',
          'Bitte gib eine gültige E-Mail-Adresse ein.'
        );

      }


      if (!msg) {

        valid = false;

        setError(
          'msg',
          'Bitte beschreib kurz dein Projekt oder Problem.'
        );

      }


      if (!consent) {

        valid = false;

      }


      if (!valid) {

        if (status) {

          status.textContent =
            consent
              ? 'Bitte prüfe deine Eingaben.'
              : 'Bitte bestätige noch die Datenschutzhinweise.';

        }

        return;

      }


      // ===================================================
      // E-MAIL ERSTELLEN
      // ===================================================

      const subject =
        encodeURIComponent(
          'ProtoSprint Anfrage – ' + name
        );


      const body =
        encodeURIComponent(

          'Neue Anfrage über ProtoSprint.de\n\n' +

          'Name:\n' +
          name +

          '\n\nE-Mail:\n' +
          email +

          '\n\nTelefon:\n' +
          (tel || 'nicht angegeben') +

          '\n\nProjekt / Problem:\n' +
          msg +

          '\n\n---\n' +
          'Anfrage erstellt über ProtoSprint.de'

        );


      const mailto =
        'mailto:' +
        CONTACT_EMAIL +
        '?subject=' +
        subject +
        '&body=' +
        body;


      if (status) {

        status.textContent =
          'Dein E-Mail-Programm wird geöffnet. Bitte sende die vorbereitete Nachricht anschließend ab.';

      }


      // ---------------------------------------------------
      // Mailprogramm öffnen
      // ---------------------------------------------------

      window.location.href = mailto;

    });

  }


  // =======================================================
  // SMOOTH SCROLL
  // =======================================================

  document
    .querySelectorAll('a[href^="#"]')
    .forEach((link) => {

      link.addEventListener('click', (event) => {

        const id =
          link.getAttribute('href');


        if (!id || id.length <= 1) {
          return;
        }


        const target =
          document.querySelector(id);


        if (!target) {
          return;
        }


        event.preventDefault();


        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });


        history.pushState(
          null,
          '',
          id
        );

      });

    });

})();
