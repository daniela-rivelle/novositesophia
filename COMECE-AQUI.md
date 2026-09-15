> **Atualização v5:** preserve seu `config.js` preenchido ao publicar. Leia `ATUALIZACAO-v5.md` para os detalhes desta versão.

# SophIA — site completo com página de leads

O ZIP contém o site principal e todas as imagens anteriores, a nova página de campanha e o agradecimento. O domínio permanece `sophia.starmindai.ai`. A seção “Por trás da SophIA” tem um link em destaque para conhecer a StarMind; o link também está no rodapé da página de leads e do agradecimento.

## O que falta para ativar

Não foram fornecidos o endereço do formulário na sua conta Formspree nem os identificadores da conversão do Google Ads. Esses campos estão vazios em `config.js`. O site foi preparado, mas a captação na nova página e a conversão do Google Ads precisam desses dados antes da campanha.

### 1. Formspree

1. Entre em [formspree.io](https://formspree.io/) e crie um formulário para a SophIA.
2. Configure o recebimento em `contato@starmindai.ai` e confirme o e-mail solicitado pelo serviço. Verifique no painel se as notificações de novos contatos estão habilitadas para esse destinatário.
3. Nas configurações de proteção contra spam desse formulário, desative a exigência de reCAPTCHA para usar o fluxo de envio desta entrega sem etapa visual adicional. O site usa um campo oculto antispam e o serviço mantém sua filtragem. Esta entrega não inclui um widget CAPTCHA; habilitar a exigência dele no painel requer integrar o widget correspondente antes de publicar.
4. Copie a URL pública do formulário, no formato `https://formspree.io/f/xxxxxxxx`, e cole entre as aspas de `formspreeEndpoint` em `config.js`. Não use uma chave de API privada, senha ou token de administração.
5. Publique e faça um envio de teste. Confirme a presença do contato no painel do Formspree e no e-mail.

O visitante não precisa criar conta nem confirmar e-mail. A confirmação inicial acima é do destinatário do formulário. A configuração de spam é documentada em [reCAPTCHA settings](https://help.formspree.io/articles/form-and-project-settings/recaptcha-settings) e [Honeypot spam filtering](https://help.formspree.io/articles/building-your-form/honeypot-spam-filtering).

Ao preencher `formspreeEndpoint`, o formulário da página principal também passa a usar o Formspree, com o mesmo visual. Enquanto esse campo estiver vazio, o formulário principal mantém seu fluxo anterior pelo FormSubmit. A nova página `/leads/` mostra uma alternativa pelo WhatsApp e não simula envio ou conversão.

### 2. Google Ads

Crie uma ação de conversão de site para o envio de formulário. Copie o ID `AW-...` e o rótulo da conversão (a parte depois da barra no `send_to` do snippet do Google) para `googleAdsId` e `googleAdsConversionLabel` em `config.js`.

Use o endereço final do anúncio:

**https://sophia.starmindai.ai/leads/**

O código dispara o evento `conversion` diretamente para essa ação após um envio confirmado pelo Formspree, usando um identificador aleatório por envio em `transaction_id`. Não é necessário cadastrar outra conversão apenas por visitar a página de agradecimento. Se também importar o evento `generate_lead` do GA4 para o Google Ads, não use as duas ações como conversão principal do mesmo lead.

Configure a contagem da ação como **Uma**, adequada à captação de leads, e selecione essa ação como objetivo da campanha. Valide com o [Google Tag Assistant](https://tagassistant.google.com/) após preencher os identificadores e publicar. Referência: [medir conversões com a tag do Google](https://developers.google.com/tag-platform/devguides/conversions).

Se já usa Meta Pixel e Google Analytics, preserve seus valores em `metaPixelId` e `googleAnalyticsId`. A cópia disponibilizada nesta conversa estava com esses campos vazios; valores eventualmente adicionados diretamente ao seu repositório precisam ser mantidos ao substituir `config.js`.

## Como funciona o fluxo

- `/`: site principal preservado, com agendamento externo e todos os conteúdos anteriores.
- `/leads/`: apresentação curta, imagem da SophIA, mais de 600 mil entrevistas, formulário de nome, telefone/WhatsApp, e-mail e empresa opcional.
- `/leads/obrigado/`: confirma o contato quando há registro recente de envio aceito e oferece a agenda disponível em `https://painelcliente.starmindai.ai/agendamento`.
- `/obrigado.html`: permanece para o retorno do FormSubmit anterior.

A captação envia nome, telefone, e-mail, empresa, página de origem e um identificador aleatório do envio para o Formspree. Com a medição opcional aceita, inclui também os parâmetros de campanha presentes na página (UTMs e identificadores de clique do Google). Nenhum dos dados pessoais do formulário é enviado como parâmetro dos eventos de analytics ou pixel.

Os campos continuam preenchidos em caso de falha. O botão impede duplo envio durante a requisição. Não há reenvio automático em falhas de rede: uma interrupção pode acontecer depois de o servidor receber o contato. O sucesso significa aceite pelo serviço, não comprovação de entrega à caixa de entrada.

O agradecimento usa um registro temporário na mesma aba, sem nome, e-mail ou telefone, por até 30 minutos. Abrir o agradecimento diretamente não cria um lead. Atualizar a página não repete o evento já emitido. Se o navegador bloquear esse armazenamento, a confirmação é apresentada na página do formulário.

## Medição e preferências

As tags de Google e Meta carregam apenas após a aceitação das preferências opcionais, como no site anterior. Recusar a medição não impede o formulário de enviar. Eventos não são disparados para visitantes que recusaram; por isso, a quantidade no Formspree pode ser maior que a quantidade medida pelas tags.

| Ação | Google Analytics 4 | Meta | Google Ads direto |
|---|---|---|---|
| Início do preenchimento | `contact_form_start` | `ContactFormStart` | Não |
| Tentativa de envio | `contact_form_submit_attempt` | `ContactFormSubmitAttempt` | Não |
| Contato confirmado pelo Formspree | `generate_lead` | `Lead` | `conversion` |
| Clique para abrir agenda | `schedule_click` | `ScheduleClick` | Não |
| Clique no WhatsApp | `whatsapp_click` | `Contact` | Não |

Clique na agenda não significa agendamento concluído. Esta entrega não altera nem instrumenta o sistema externo de agendamento. Também não envia conversões aprimoradas com dados pessoais ou conversões por servidor.

## Publicação

Extraia o ZIP e copie todo o conteúdo para a raiz do repositório do site SophIA. Mantenha a estrutura da pasta `leads`, com seu `index.html` e sua pasta `obrigado`. O GitHub Pages resolve esses caminhos como páginas estáticas; não há servidor de aplicação ou etapa de compilação.

O arquivo `CNAME` conserva o domínio SophIA. O `sitemap.xml` inclui somente a página principal e a página de leads. As duas páginas de agradecimento têm `noindex`.

Antes de ativar a campanha, confirme o envio no Formspree, o recebimento do e-mail e a conversão na ferramenta de diagnóstico do Google. A validação desta entrega cobriu os arquivos, os links, a preservação do site e cenários simulados de envio; não houve acesso à sua conta Formspree ou ao Google Ads, nem envio de e-mail real.
