
/* =========================================================
   ProtoSprint
   Navigation + Dark Mode + Form.taxi-Kontaktformular
   ========================================================= */

(function () {
  'use strict';

  const CONTACT_EMAIL = 'protosprint.de@gmail.com';
  const FORM_ENDPOINT = 'https://form.taxi/s/bbzhfi6k';
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
      // Theme funktioniert auch ohne Speicherung.
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
      const isDark = selectedTheme === 'dark';

      modeBtn.setAttribute(
        'aria-pressed',
        String(isDark)
      );

      const description = isDark
        ? 'Zum hellen Modus wechseln'
        : 'Zum dunklen Modus wechseln';

      modeBtn.setAttribute('title', description);
      modeBtn.setAttribute('aria-label', description);
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
  // KONTAKTFORMULAR MIT FORM.TAXI
  // =======================================================

  const form = document.getElementById('contact-form');

  if (form) {
    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const telInput = form.querySelector('#tel');
    const msgInput = form.querySelector('#msg');
    const consentInput = form.querySelector('#consent');
    const status = form.querySelector('.form-status');
    const submitButton = form.querySelector(
      'button[type="submit"]'
    );

    function showStatus(message) {
      if (status) {
        status.textContent = message;
      }
    }

    function setError(fieldId, message) {
      const input = form.querySelector('#' + fieldId);

      if (!input) return;

      const field = input.closest('.field');
      const error = field
        ? field.querySelector('.error')
        : null;

      if (error) {
        error.textContent = message || '';
      }

      input.setAttribute(
        'aria-invalid',
        String(Boolean(message))
      );
    }

    form.addEventListener('submit', async function (event) {
      event.preventDefault();

      if (
        !nameInput ||
        !emailInput ||
        !telInput ||
        !msgInput ||
        !consentInput
      ) {
        showStatus(
          'Das Formular ist derzeit nicht verfügbar. ' +
          'Bitte schreibe an ' + CONTACT_EMAIL + '.'
        );
        return;
      }

      if (submitButton && submitButton.disabled) {
        return;
      }

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const msg = msgInput.value.trim();
      const consent = consentInput.checked;

      let firstInvalid = null;

      setError('name', '');
      setError('email', '');
      setError('msg', '');
      setError('consent', '');
      showStatus('');

      if (!name) {
        setError('name', 'Bitte gib deinen Namen ein.');
        firstInvalid = firstInvalid || nameInput;
      }

      const emailOk =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!emailOk) {
        setError(
          'email',
          'Bitte gib eine gültige E-Mail-Adresse ein.'
        );
        firstInvalid = firstInvalid || emailInput;
      }

      if (!msg) {
        setError(
          'msg',
          'Bitte beschreib kurz dein Projekt oder Problem.'
        );
        firstInvalid = firstInvalid || msgInput;
      }

      if (!consent) {
        setError(
          'consent',
          'Bitte bestätige die Kenntnisnahme.'
        );
        firstInvalid = firstInvalid || consentInput;
      }

      if (firstInvalid) {
        showStatus(
          'Bitte prüfe deine Eingaben und die Datenschutzhinweise.'
        );
        firstInvalid.focus();
        return;
      }

      const originalButtonText = submitButton
        ? submitButton.textContent
        : '';

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Wird gesendet ...';
      }

      showStatus('Deine Anfrage wird übertragen ...');

      try {
        const formData = new FormData(form);

        // Keine zusätzliche Consent-Information versenden.
        formData.delete('consent');

        const response = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        });

        let result = null;

        try {
          result = await response.json();
        } catch (error) {
          throw new Error('invalid_response');
        }

        if (
          !response.ok ||
          !result ||
          result.success !== true
        ) {
          throw new Error('submission_failed');
        }

        form.reset();

        setError('name', '');
        setError('email', '');
        setError('msg', '');
        setError('consent', '');

        showStatus(
          'Vielen Dank! Deine Anfrage wurde erfolgreich ' +
          'übermittelt. Ich melde mich so bald wie möglich.'
        );

      } catch (error) {
        showStatus(
          'Die Übermittlung konnte nicht bestätigt werden. ' +
          'Bitte prüfe im Zweifel, ob die Anfrage angekommen ist, ' +
          'bevor du sie erneut sendest. ' +
          'Alternativ erreichst du mich unter ' +
          CONTACT_EMAIL + '.'
        );
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }
      }
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

        const reducedMotion =
          window.matchMedia &&
          window.matchMedia(
            '(prefers-reduced-motion: reduce)'
          ).matches;

        target.scrollIntoView({
          behavior: reducedMotion ? 'auto' : 'smooth',
          block: 'start'
        });

        history.pushState(null, '', id);
      });
    });

})();
