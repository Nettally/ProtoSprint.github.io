
/* =========================================================
   ProtoSprint
   Navigation + Dark Mode + Kontaktformular
   ========================================================= */

(function () {
  'use strict';

  const CONTACT_EMAIL = 'protosprint.de@gmail.com';
  const THEME_KEY = 'theme-preference';

  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('nav');
  const modeBtn = document.getElementById('mode-toggle');

  // =======================================================
  // HEADER
  // =======================================================

  function updateHeader() {
    if (header) {
      header.setAttribute(
        'data-elevated',
        String(window.scrollY > 4)
      );
    }
  }

  document.addEventListener('scroll', updateHeader, {
    passive: true
  });

  updateHeader();

  // =======================================================
  // MOBILE NAVIGATION
  // =======================================================

  function closeNavigation() {
    if (!nav) return;

    nav.classList.remove('open');

    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'false');
    }
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('open');

      navToggle.setAttribute(
        'aria-expanded',
        String(isOpen)
      );
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNavigation);
    });
  }

  document.addEventListener('keydown', function (event) {
    if (
      event.key === 'Escape' &&
      nav &&
      nav.classList.contains('open')
    ) {
      closeNavigation();

      if (navToggle) {
        navToggle.focus();
      }
    }
  });

  // =======================================================
  // HELL- / DUNKELMODUS
  // =======================================================

  const prefersDark = window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null;

  function readTheme() {
    try {
      return window.localStorage.getItem(THEME_KEY);
    } catch (error) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      // Darstellung funktioniert auch ohne Speicherung.
    }
  }

  function applyTheme(theme) {
    const selectedTheme =
      theme === 'dark' ? 'dark' : 'light';

    document.documentElement.setAttribute(
      'data-theme',
      selectedTheme
    );

    if (modeBtn) {
      modeBtn.setAttribute(
        'aria-pressed',
        String(selectedTheme === 'dark')
      );

      modeBtn.setAttribute(
        'title',
        selectedTheme === 'dark'
          ? 'Zum hellen Modus wechseln'
          : 'Zum dunklen Modus wechseln'
      );

      modeBtn.setAttribute(
        'aria-label',
        selectedTheme === 'dark'
          ? 'Zum hellen Modus wechseln'
          : 'Zum dunklen Modus wechseln'
      );
    }
  }

  const savedTheme = readTheme();

  const initialTheme =
    savedTheme === 'dark' || savedTheme === 'light'
      ? savedTheme
      : prefersDark && prefersDark.matches
        ? 'dark'
        : 'light';

  applyTheme(initialTheme);

  if (prefersDark) {
    const handleSystemThemeChange = function (event) {
      if (!readTheme()) {
        applyTheme(event.matches ? 'dark' : 'light');
      }
    };

    if (typeof prefersDark.addEventListener === 'function') {
      prefersDark.addEventListener(
        'change',
        handleSystemThemeChange
      );
    } else if (
      typeof prefersDark.addListener === 'function'
    ) {
      prefersDark.addListener(handleSystemThemeChange);
    }
  }

  if (modeBtn) {
    modeBtn.addEventListener('click', function () {
      const currentTheme =
        document.documentElement.getAttribute('data-theme');

      const nextTheme =
        currentTheme === 'dark' ? 'light' : 'dark';

      applyTheme(nextTheme);
      saveTheme(nextTheme);
    });
  }

  // =======================================================
  // JAHR IM FOOTER
  // =======================================================

  const year = document.getElementById('year');

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  // =======================================================
  // KONTAKTFORMULAR
  // =======================================================

  const form = document.getElementById('contact-form');

  if (form) {
    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const telInput = form.querySelector('#tel');
    const msgInput = form.querySelector('#msg');
    const consentInput = form.querySelector('#consent');
    const status = form.querySelector('.form-status');

    function setError(fieldId, message) {
      const input = form.querySelector('#' + fieldId);

      if (!input) return;

      const field = input.closest('.field');

      if (!field) return;

      const error = field.querySelector('.error');

      if (error) {
        error.textContent = message || '';
      }

      if (fieldId !== 'consent') {
        input.setAttribute(
          'aria-invalid',
          String(Boolean(message))
        );
      }
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      if (
        !nameInput ||
        !emailInput ||
        !telInput ||
        !msgInput ||
        !consentInput
      ) {
        if (status) {
          status.textContent =
            'Das Formular konnte nicht verarbeitet werden. ' +
            'Bitte schreibe direkt an ' + CONTACT_EMAIL + '.';
        }

        return;
      }

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const tel = telInput.value.trim();
      const msg = msgInput.value.trim();
      const consent = consentInput.checked;

      let valid = true;

      setError('name', '');
      setError('email', '');
      setError('msg', '');

      if (status) {
        status.textContent = '';
      }

      if (!name) {
        valid = false;

        setError(
          'name',
          'Bitte gib deinen Namen ein.'
        );
      }

      const emailOk =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!emailOk) {
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
          status.textContent = !consent
            ? 'Bitte bestätige, dass du die ' +
              'Datenschutzhinweise zur Kenntnis genommen hast.'
            : 'Bitte prüfe deine Eingaben.';
        }

        return;
      }

      // ===================================================
      // E-MAIL VORBEREITEN
      // ===================================================

      const subject = encodeURIComponent(
        'ProtoSprint Anfrage – ' + name
      );

      const messageBody = [
        'Neue Anfrage über ProtoSprint.de',
        '',
        'Name:',
        name,
        '',
        'E-Mail:',
        email,
        '',
        'Telefon:',
        tel || 'nicht angegeben',
        '',
        'Projekt / Problem:',
        msg,
        '',
        '---',
        'Anfrage erstellt über ProtoSprint.de'
      ].join('\n');

      const body = encodeURIComponent(messageBody);

      const mailto =
        'mailto:' + CONTACT_EMAIL +
        '?subject=' + subject +
        '&body=' + body;

      if (status) {
        status.textContent =
          'Dein E-Mail-Programm wird geöffnet. ' +
          'Bitte sende die vorbereitete Nachricht ' +
          'anschließend selbst ab.';
      }

      // Kein automatischer Versand.
      // Das E-Mail-Programm des Besuchers wird geöffnet.
      window.location.href = mailto;
    });
  }

  // =======================================================
  // SMOOTH SCROLL
  // =======================================================

  document
    .querySelectorAll('a[href^="#"]')
    .forEach(function (link) {
      link.addEventListener('click', function (event) {
        const id = link.getAttribute('href');

        if (!id || id.length <= 1) {
          return;
        }

        const target = document.getElementById(
          id.substring(1)
        );

        if (!target) {
          return;
        }

        event.preventDefault();

        target.scrollIntoView({
          behavior: window.matchMedia &&
            window.matchMedia(
              '(prefers-reduced-motion: reduce)'
            ).matches
              ? 'auto'
              : 'smooth',
          block: 'start'
        });

        history.pushState(null, '', id);
      });
    });

})();
