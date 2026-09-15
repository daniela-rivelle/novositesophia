'use strict';
// Sem bibliotecas ou dependências de build. Medição configurada separadamente em config.js.
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  navigation?.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Abrir menu');
}
menuButton?.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});
navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation?.classList.contains('open')) {
    closeMenu(); menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.header')) closeMenu();
});
const featureTabs = Array.from(document.querySelectorAll('[data-feature]'));
function activateFeature(tab, focus = false) {
  featureTabs.forEach(item => {
    const selected = item === tab;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  });
  if (focus) tab.focus();
}
featureTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateFeature(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (['ArrowRight', 'ArrowDown'].includes(event.key)) next = (index + 1) % featureTabs.length;
    if (['ArrowLeft', 'ArrowUp'].includes(event.key)) next = (index - 1 + featureTabs.length) % featureTabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = featureTabs.length - 1;
    if (next !== undefined) { event.preventDefault(); activateFeature(featureTabs[next], true); }
  });
});
// Players são criados apenas após o clique. Nenhuma conexão com o YouTube antes disso.
document.querySelectorAll('[data-video]').forEach(cover => {
  const button = cover.querySelector('button');
  button?.addEventListener('click', () => {
    const id = cover.dataset.video;
    if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return;
    // Evita múltiplos vídeos tocando ao mesmo tempo: restaura os outros botões.
    document.querySelectorAll('.video-cover iframe').forEach(player => {
      const parent = player.parentElement;
      player.remove();
      parent.querySelectorAll('button').forEach(other => { other.hidden = false; });
    });
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`;
    iframe.title = cover.dataset.title;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    cover.appendChild(iframe);
    button.hidden = true;
    iframe.focus();
  });
});
// Formulário HTML nativo: mantém a proteção reCAPTCHA padrão do FormSubmit.
// Confirmação inicial do destinatário é obrigatória. Consulte LEIA-ME.md.
const form = document.querySelector('#contact-form');
if (form && !form.hasAttribute('data-formspree-active')) {
  const phone = form.querySelector('#phone');
  const name = form.querySelector('#name');
  const email = form.querySelector('#email');
  const status = document.querySelector('#form-status');
  const submit = form.querySelector('[type="submit"]');
  const initialButton = submit.innerHTML;
  function configureReturn() {
    if (/^https?:$/.test(location.protocol)) {
      form.elements._next.value = new URL('obrigado.html', location.href).href;
      form.elements.Origem.value = location.origin + location.pathname;
    }
  }
  configureReturn();
  function validatePhone() {
    const digits = phone.value.replace(/\D/g, '');
    phone.setCustomValidity(digits.length >= 10 && digits.length <= 15 ? '' : 'Informe um telefone com DDD, entre 10 e 15 dígitos.');
  }
  phone.addEventListener('input', validatePhone);
  name.addEventListener('input', () => name.setCustomValidity(name.value.trim().length >= 2 ? '' : 'Informe seu nome.'));
  form.addEventListener('submit', event => {
    name.value = name.value.trim(); email.value = email.value.trim();
    name.setCustomValidity(name.value.length >= 2 ? '' : 'Informe seu nome.');
    validatePhone();
    if (!form.checkValidity()) { event.preventDefault(); form.reportValidity(); return; }
    if (location.protocol === 'file:') {
      event.preventDefault();
      status.textContent = 'O formulário funciona no site publicado. Para falar agora, use o WhatsApp ao lado.';
      return;
    }
    configureReturn();
    window.SophiaTracking?.formAttempt();
    submit.disabled = true;
    submit.textContent = 'Continuando para o envio…';
    status.textContent = 'Aguarde a confirmação na próxima tela.';
    // Recupera o botão se o navegador não concluir a navegação.
    window.setTimeout(() => {
      submit.disabled = false; submit.innerHTML = initialButton;
      status.textContent = 'Se o envio não abriu, tente novamente ou fale conosco pelo WhatsApp.';
    }, 15000);
  });
  window.addEventListener('pageshow', () => {
    submit.disabled = false; submit.innerHTML = initialButton; status.textContent = '';
  });
}
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
