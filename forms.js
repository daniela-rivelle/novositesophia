'use strict';
(() => {
  const RECEIPT = 'sophia_confirmed_lead_v1';
  const CONSENT = 'sophia_marketing_choice_v1';
  const endpoint = (window.SOPHIA_CONFIG?.formspreeEndpoint || '').trim();
  const configured = /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]{6,32}$/.test(endpoint) && !/SEU_ID|YOUR|EXAMPLE/i.test(endpoint);
  const permitted = () => { try { return localStorage.getItem(CONSENT) === 'accepted'; } catch { return false; } };
  const readReceipt = () => {
    try {
      const r = JSON.parse(sessionStorage.getItem(RECEIPT));
      const age = Date.now() - r.at;
      return r && /^[a-zA-Z0-9-]{12,100}$/.test(r.id) && ['leads', 'homepage'].includes(r.source) && age >= 0 && age < 1800000 ? r : null;
    } catch { return null; }
  };
  const saveReceipt = r => { try { sessionStorage.setItem(RECEIPT, JSON.stringify(r)); return true; } catch { return false; } };
  const measure = r => {
    if (!r || r.measured || !r.consentAtSubmission || !permitted()) return;
    if (window.SophiaTracking?.formSuccess(r)) { r.measured = true; saveReceipt(r); }
  };
  // Abrir ou atualizar a página de agradecimento não cria uma conversão.
  if (document.body.hasAttribute('data-lead-thanks')) {
    const receipt = readReceipt();
    if (receipt) {
      document.querySelector('#thanks-neutral').hidden = true;
      document.querySelector('#thanks-confirmed').hidden = false;
      measure(receipt);
    }
  }
  document.querySelectorAll('#contact-form, [data-lead-form]').forEach(form => {
    const landing = form.hasAttribute('data-lead-form');
    const status = form.querySelector('.form-status');
    const button = form.querySelector('[type="submit"]');
    const success = document.querySelector('#lead-inline-success');
    if (!configured && !landing) return; // O formulário anterior continua operacional.
    form.setAttribute('data-formspree-active', '');
    if (!configured) {
      button.disabled = true;
      status.textContent = 'O formulário está temporariamente indisponível. Fale com nossa equipe pelo WhatsApp abaixo.';
      form.addEventListener('submit', event => event.preventDefault());
      return;
    }
    form.action = endpoint;
    button.disabled = false;
    const note = form.querySelector('.form-note');
    if (note) note.textContent = '* Campos obrigatórios. Envie seu contato sem sair do site.';
    const name = form.querySelector('#name');
    const phone = form.querySelector('#phone');
    const email = form.querySelector('#email');
    const company = form.querySelector('#company');
    const initialButton = button.innerHTML;
    let pending = false;
    let completed = false;
    function validate() {
      name.setCustomValidity(name.value.trim().length >= 2 ? '' : 'Informe seu nome.');
      const digits = phone.value.replace(/\D/g, '');
      phone.setCustomValidity(digits.length >= 10 && digits.length <= 15 ? '' : 'Informe um telefone com DDD, entre 10 e 15 dígitos.');
    }
    [name, phone].forEach(field => field.addEventListener('input', validate));
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (pending || completed) return;
      name.value = name.value.trim(); email.value = email.value.trim();
      validate();
      if (!form.reportValidity()) return;
      if (location.protocol === 'file:') {
        status.textContent = 'Para enviar, acesse o site publicado ou fale pelo WhatsApp.';
        return;
      }
      const honeypot = form.querySelector('[name="_gotcha"], [name="_honey"]');
      if (honeypot?.value) { status.textContent = 'Não foi possível enviar. Recarregue a página e tente novamente.'; return; }
      pending = true; button.disabled = true;
      button.textContent = 'Enviando…'; form.setAttribute('aria-busy', 'true');
      status.textContent = 'Estamos enviando seu contato. Aguarde a confirmação.';
      const source = landing ? 'leads' : 'homepage';
      window.SophiaTracking?.formAttempt(form.id);
      const id = globalThis.crypto?.randomUUID?.() || `lead-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const data = new FormData();
      data.set('name', name.value); data.set('email', email.value);
      data.set('Telefone_WhatsApp', phone.value.trim()); data.set('Empresa', company.value.trim());
      data.set('_subject', `SophIA | Novo contato — ${landing ? 'Página de leads' : 'Site principal'}`);
      data.set('_gotcha', ''); data.set('lead_id', id);
      data.set('Origem', location.origin + location.pathname);
      data.set('Solicitacao', 'Conhecer a SophIA e receber contato comercial.');
      data.set('Aviso_de_privacidade', 'https://privacy.starmindai.ai/');
      if (permitted()) {
        const params = new URLSearchParams(location.search);
        for (const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','gbraid','wbraid']) {
          const value = params.get(key);
          if (value) data.set(key, value.slice(0, 250));
        }
      }
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);
      try {
        const response = await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' }, signal: controller.signal });
        const payload = await response.json().catch(() => null);
        if (!response.ok || payload?.ok !== true || payload?.errors?.length) {
          status.textContent = response.status === 429
            ? 'O envio está temporariamente indisponível. Tente novamente mais tarde ou fale pelo WhatsApp.'
            : 'Não foi possível confirmar o envio. Seus dados continuam preenchidos. Tente novamente ou fale pelo WhatsApp.';
          return;
        }
        completed = true;
        button.textContent = 'Contato enviado';
        const receipt = { id, at: Date.now(), source, consentAtSubmission: permitted(), measured: false };
        status.textContent = 'Seu contato foi recebido. Obrigado pelo interesse na SophIA!';
        form.reset();
        if (saveReceipt(receipt)) {
          const destination = new URL(landing ? 'obrigado/' : 'leads/obrigado/', location.href);
          location.assign(destination.href);
        } else {
          measure(receipt);
          if (success) { success.hidden = false; success.focus(); }
        }
      } catch (error) {
        status.textContent = error.name === 'AbortError'
          ? 'A confirmação demorou mais que o esperado. Não foi possível verificar o envio. Você pode tentar novamente ou falar pelo WhatsApp.'
          : 'Não foi possível confirmar o envio. Verifique sua conexão e tente novamente. Seus dados continuam preenchidos.';
      } finally {
        clearTimeout(timeout); pending = false; form.removeAttribute('aria-busy');
        if (!completed) { button.disabled = false; button.innerHTML = initialButton; }
      }
    });
  });
})();
