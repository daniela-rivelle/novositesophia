'use strict';
(() => {
  const config = window.SOPHIA_CONFIG || {};
  const metaId = /^\d{5,25}$/.test(config.metaPixelId || '') ? config.metaPixelId : '';
  const gaId = /^G-[A-Z0-9]+$/.test(config.googleAnalyticsId || '') ? config.googleAnalyticsId : '';
  const adsId = /^AW-\d+$/.test(config.googleAdsId || '') ? config.googleAdsId : '';
  const adsLabel = /^[A-Za-z0-9_-]+$/.test(config.googleAdsConversionLabel || '') ? config.googleAdsConversionLabel : '';
  if (!metaId && !gaId && !adsId) return;
  const CONSENT = 'sophia_marketing_choice_v1';
  const PENDING = 'sophia_contact_pending_v1';
  let allowed = false;
  let initialized = false;
  const read = (storage, key) => { try { return window[storage].getItem(key); } catch { return null; } };
  const write = (storage, key, value) => { try { window[storage].setItem(key, value); } catch {} };
  const remove = (storage, key) => { try { window[storage].removeItem(key); } catch {} };
  let choice = read('localStorage', CONSENT);
  const load = src => {
    const script = document.createElement('script');
    script.async = true; script.src = src; document.head.appendChild(script);
  };
  function initialize() {
    if (initialized) return;
    initialized = true;
    if (metaId) {
      const fbq = window.fbq = function () {
        if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments);
        else fbq.queue.push(arguments);
      };
      if (!window._fbq) window._fbq = fbq;
      fbq.push = fbq; fbq.loaded = true; fbq.version = '2.0'; fbq.queue = [];
      fbq('init', metaId);
      fbq('set', 'autoConfig', false, metaId);
      fbq('track', 'PageView');
      load('https://connect.facebook.net/en_US/fbevents.js');
    }
    if (gaId || adsId) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('consent', 'default', {
        analytics_storage: 'denied', ad_storage: 'denied',
        ad_user_data: 'denied', ad_personalization: 'denied'
      });
      window.gtag('consent', 'update', {
        analytics_storage: 'granted', ad_storage: adsId ? 'granted' : 'denied',
        ad_user_data: adsId ? 'granted' : 'denied', ad_personalization: 'denied'
      });
      window.gtag('js', new Date());
      if (gaId) window.gtag('config', gaId, { send_page_view: true, allow_google_signals: false, allow_ad_personalization_signals: false });
      if (adsId) window.gtag('config', adsId, { allow_ad_personalization_signals: false });
      load(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId || adsId)}`);
    }
  }
  function event(googleName, metaName, params = {}, standard = false) {
    if (!allowed) return;
    if (gaId && window.gtag) window.gtag('event', googleName, { ...params, send_to: gaId, transport_type: 'beacon' });
    if (metaId && window.fbq) window.fbq(standard ? 'track' : 'trackCustom', metaName, params);
  }
  const recent = new Map();
  function trackOncePerClick(key, run) {
    if (!allowed) return;
    const now = Date.now();
    if (now - (recent.get(key) || 0) < 1000) return;
    recent.set(key, now); run();
  }
  const completedLeads = new Set();
  window.SophiaTracking = Object.freeze({
    formSuccess(receipt) {
      if (!allowed || !receipt?.consentAtSubmission || !/^[a-zA-Z0-9-]{12,100}$/.test(receipt.id) || !['leads', 'homepage'].includes(receipt.source)) return false;
      if (completedLeads.has(receipt.id)) return true;
      completedLeads.add(receipt.id);
      const params = { form_id: receipt.source === 'leads' ? 'leads-form' : 'contact-form', conversion_source: 'formspree_confirmed', lead_id: receipt.id };
      event('generate_lead', 'Lead', params, true);
      if (adsId && adsLabel && window.gtag) window.gtag('event', 'conversion', {
        send_to: `${adsId}/${adsLabel}`, transaction_id: receipt.id
      });
      return true;
    },
    formAttempt(formId) {
      if (!allowed) return;
      if (!formId) write('sessionStorage', PENDING, String(Date.now()));
      event('contact_form_submit_attempt', 'ContactFormSubmitAttempt', { form_id: formId || 'contact-form' });
    }
  });
  // Conversão no retorno do formulário: exige tentativa recente nesta mesma aba.
  // Não prova entrega do e-mail. Acesso direto, refresh e volta posterior não geram novo Lead.
  function formReturn() {
    if (!/\/obrigado\.html$/.test(location.pathname)) return;
    const raw = read('sessionStorage', PENDING);
    const age = Date.now() - Number(raw);
    remove('sessionStorage', PENDING);
    if (allowed && raw && age >= 0 && age < 30 * 60 * 1000) {
      event('generate_lead', 'Lead', { form_id: 'contact-form', conversion_source: 'formsubmit_return' }, true);
    }
  }
  let formStarted = false;
  document.querySelector('#contact-form, #leads-form')?.addEventListener('input', ev => {
    if (!allowed || formStarted || !['name', 'phone', 'email', 'company'].includes(ev.target.id)) return;
    formStarted = true;
    event('contact_form_start', 'ContactFormStart', { form_id: ev.currentTarget.id });
  });
  document.addEventListener('click', ev => {
    if (!allowed) return;
    const link = ev.target.closest('a[href]');
    if (link) {
      let url; try { url = new URL(link.href, location.href); } catch { return; }
      if (url.origin === 'https://painelcliente.starmindai.ai' && url.pathname === '/agendamento') {
        trackOncePerClick('schedule', () => event('schedule_click', 'ScheduleClick', { placement: link.closest('header') ? 'header' : link.closest('footer') ? 'footer' : link.closest('.hero') ? 'hero' : 'content' }));
      } else if (url.hostname === 'wa.me') {
        trackOncePerClick('whatsapp', () => event('whatsapp_click', 'Contact', { contact_method: 'whatsapp' }, true));
      } else if (url.hostname === 'vagas.starmindai.ai') {
        event('job_portal_click', 'JobPortalClick');
      } else if (url.hostname === 'www.youtube.com') {
        event('youtube_link_click', 'YouTubeLinkClick', { video_id: url.searchParams.get('v') || '' });
      }
    }
    const play = ev.target.closest('.video-cover .play-button');
    if (play) {
      const id = play.closest('[data-video]')?.dataset.video;
      if (id) event('video_play_click', 'VideoPlayClick', { video_id: id });
    }
    const feature = ev.target.closest('[data-feature]');
    if (feature) event('feature_select', 'FeatureSelect', { feature_id: feature.dataset.feature });
  });
  // Um ViewContent quando a seção da solução é efetivamente vista, por carregamento.
  const solution = document.querySelector('#solucao');
  let solutionSeen = false;
  if (solution && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (allowed && !solutionSeen && entries.some(entry => entry.isIntersecting)) {
        solutionSeen = true;
        event('view_solution', 'ViewContent', { content_name: 'SophIA - recursos', content_type: 'product' }, true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    observer.observe(solution);
    document.addEventListener('sophia:consent', () => { observer.unobserve(solution); observer.observe(solution); });
  }
  // Sem IDs, não há banner. Com IDs, nada externo carrega antes da escolha.
  const banner = document.createElement('section');
  banner.className = 'cookie-banner';
  banner.setAttribute('aria-label', 'Preferências de cookies');
  banner.hidden = true;
  banner.innerHTML = '<div><strong>Sua privacidade importa.</strong><p>Podemos usar cookies de medição e marketing para entender o uso do site e melhorar nossas campanhas? <a href="https://privacy.starmindai.ai/" target="_blank" rel="noopener noreferrer">Política de privacidade</a></p></div><div class="cookie-actions"><button type="button" data-choice="rejected">Recusar opcionais</button><button type="button" data-choice="accepted">Aceitar opcionais</button></div>';
  document.body.appendChild(banner);
  const preferences = document.createElement('button');
  preferences.type = 'button'; preferences.className = 'cookie-preferences';
  preferences.textContent = 'Preferências de cookies';
  (document.querySelector('.copyright') || document.querySelector('main') || document.body).appendChild(preferences);
  preferences.addEventListener('click', () => { banner.hidden = false; banner.querySelector('button').focus(); });
  banner.querySelectorAll('[data-choice]').forEach(button => button.addEventListener('click', () => {
    choice = button.dataset.choice;
    write('localStorage', CONSENT, choice);
    banner.hidden = true;
    if (choice === 'accepted') {
      allowed = true; initialize();
      document.dispatchEvent(new Event('sophia:consent'));
    } else {
      allowed = false;
      remove('sessionStorage', PENDING);
      if (initialized) {
        if (window.fbq) window.fbq('consent', 'revoke');
        if (window.gtag) window.gtag('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
        location.reload();
      }
    }
    preferences.focus();
  }));
  if (choice === 'accepted') { allowed = true; initialize(); }
  else if (choice !== 'rejected') banner.hidden = false;
  formReturn();
})();
