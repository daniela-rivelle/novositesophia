> **Atualização com página de leads:** comece pelo arquivo `COMECE-AQUI.md`. Ele explica o Formspree e a conversão do Google Ads. As instruções de FormSubmit abaixo se aplicam apenas ao formulário anterior, mantido como alternativa enquanto o Formspree não for configurado.

# SophIA — site estático para GitHub Pages

Página institucional criada a partir da apresentação “Novo Modelo de Proposta SophIA 0726” e do site https://sophia.starmindai.ai, consultado em 11/09/2026.

## Publicar pelo GitHub Desktop

1. Extraia este ZIP. Copie seu conteúdo para a pasta local do repositório que será usado no GitHub Pages. `index.html` deve ficar na raiz da pasta publicada, junto de `styles.css`, `script.js`, `obrigado.html` e `assets/`.
2. No GitHub Desktop, revise os arquivos, faça o commit e clique em **Push origin**.
3. No repositório no GitHub, abra **Settings → Pages**.
4. Em **Build and deployment → Source**, selecione **Deploy from a branch**.
5. Escolha a branch em que colocou os arquivos, normalmente `main`, e a pasta **/(root)**. Salve e aguarde a publicação.

Não é necessário instalar Node, executar npm ou configurar servidor. A página funciona em domínio próprio e em subpastas do GitHub Pages. O arquivo `.nojekyll` foi incluído. Se o repositório existente já tem um arquivo `CNAME`, preserve-o; este pacote não modifica o domínio ou o DNS do site atual.

Guia oficial: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Agendamento direto

Os quatro links de demonstração (menu, chamada principal, Banco de Talentos e rodapé) abrem https://painelcliente.starmindai.ai/agendamento em nova aba, para o visitante escolher um horário disponível. O formulário é independente, com o botão “Enviar contato”, e continua encaminhando os dados ao e-mail contato@starmindai.ai.

## ATIVAÇÃO OBRIGATÓRIA DO FORMULÁRIO

O GitHub Pages não envia e-mails por conta própria. O formulário utiliza o serviço externo **FormSubmit**, por HTTPS, e está apontado para **contato@starmindai.ai**. Não usa `mailto:` para enviar o formulário, nem expõe senha SMTP ou chave secreta.

Campos: nome, telefone/WhatsApp e e-mail obrigatórios; empresa opcional.

Depois de publicar:

1. Preencha e envie uma solicitação de teste pelo site publicado. Conclua a verificação de segurança, se exibida.
2. Abra a caixa **contato@starmindai.ai**, incluindo spam. Se esse destinatário ainda não estiver ativado, chegará uma mensagem do FormSubmit pedindo confirmação.
3. Clique no link de ativação recebido. Essa confirmação exige acesso à caixa destinatária; não foi executada nesta entrega.
4. Faça um novo envio pelo site após a ativação. Confira o recebimento do nome, telefone, e-mail e empresa, o assunto “SophIA | Novo contato pelo site” e a possibilidade de responder ao e-mail do interessado. Não considere o primeiro teste concluído sem verificar um novo envio depois da ativação.
5. Verifique que a confirmação retorna para `obrigado.html` no mesmo domínio/subpasta.

O envio usa POST nativo, mantendo o reCAPTCHA padrão do FormSubmit e um campo invisível de proteção contra robôs. O visitante pode passar pela tela do serviço antes de retornar ao site. Não há confirmação fictícia de entrega no JavaScript. A página de agradecimento é pública e não é prova de entrega em caixa postal.

A entrega dos e-mails depende da ativação, disponibilidade e políticas do FormSubmit e do provedor de e-mail. O site não grava contatos em banco de dados. Os campos transitam pelo FormSubmit; a interface informa a finalidade do contato e aponta para a política de privacidade da StarMind. Para gestão de fornecedores e política de privacidade, considere esse serviço como operador externo do formulário. Sua documentação informa retenção de envios por 30 dias.

O formulário requer uma página servida por HTTP/HTTPS. Abrir `index.html` por duplo clique permite visualizar a página, mas o envio é bloqueado nessa visualização local. O WhatsApp continua acessível.

Documentação consultada:
- https://formsubmit.co/ (ativação do destinatário)
- https://formsubmit.co/documentation (POST, `_next`, `_subject`, reCAPTCHA, honeypot e retenção)

## O que está incluído

- Layout responsivo com navegação móvel, atalhos e botões de contato.
- Mandala interativa com oito funcionalidades, selecionáveis por clique e teclado (setas, Home e End).
- Personagem da SophIA e marcas de clientes extraídas da apresentação fornecida, com imagens locais em WebP.
- Destaques para entrevistas por voz, CORE10, score, relatórios, Banco de Talentos e SophIA Analytics.
- Cinco etapas de recrutamento, indicadores, depoimento da apresentação, mídia, equipe e perguntas frequentes.
- Cinco vídeos originais do site atual. Os players do YouTube só são carregados após o clique, com domínio `youtube-nocookie.com` e links alternativos para abrir no YouTube. A reprodução depende de cada vídeo permanecer disponível e permitir incorporação.
- WhatsApp https://wa.me/551140409152 nos botões “Fale conosco”.
- Rodapé com StarMind, Escritórios, Privacidade, Instagram, LinkedIn e contato. Acessos ao painel, entrevista, integração e Portal de Vagas preservados.
- Formulário e página de agradecimento.
- Favicon, título, descrição e informações básicas de compartilhamento.

## Edição

| Arquivo | Conteúdo |
| --- | --- |
| `index.html` | Textos, links, recursos, vídeos e campos do formulário |
| `styles.css` | Layout, cores, tipografia, responsividade e acessibilidade visual |
| `script.js` | Menu, mandala, vídeo sob demanda e validação do formulário |
| `obrigado.html` | Página de retorno do formulário |
| `assets/` | Personagem e marcas dos clientes |

Os vídeos são configurados nos atributos `data-video` e em seus links alternativos. Ao trocar um, atualize ambos.

## Decisões editoriais e fontes

A apresentação foi a fonte principal. O site antigo forneceu os endereços dos vídeos, links institucionais e matérias. As funções são apresentadas como apoio ao RH, sem prometer eliminação total de vieses. O material chama 9,2 de NPS; a página usa “avaliação dos candidatos”, sem converter esse valor para a escala NPS. Os indicadores de 600 mil+, 75% e 98% são atribuídos à StarMind, sem apresentá-los como auditoria independente.

Os preços, descontos e setup da proposta não foram publicados: o arquivo fornecido contém condições comerciais com validade e campos de negociação. O PDF comercial completo também não faz parte do site público. O bloco Analytics é identificado como exemplo ilustrativo e não usa dados pessoais reais.

As marcas de instituições e serviços apresentadas como “parceiros” no PDF não foram transformadas em alegações públicas de endosso ou parceria institucional. A biografia da equipe segue os cargos da apresentação fornecida.

## Verificação realizada

Conferidos: sintaxe do JavaScript; IDs e âncoras; existência de imagens e arquivos locais; vínculos ARIA dos oito painéis; rótulos; destino e obrigatoriedade dos campos; cinco IDs originais dos vídeos; links externos com proteção de abertura; ativos visuais extraídos do PDF.

Não foi efetuada publicação no GitHub, teste visual em navegador, reprodução real dos vídeos ou envio real de e-mail. A ativação e a entrega em caixa postal só podem ser confirmadas após publicar e concluir o procedimento acima. Nenhum contato fictício foi enviado à sua equipe durante a construção.

## Pixel da Meta e Google Analytics — CONFIGURAÇÃO

Abra **`config.js`**, na mesma pasta do `index.html`. Preencha somente os dois campos entre aspas:

```js
window.SOPHIA_CONFIG = Object.freeze({
  metaPixelId: "SEU_ID_NUMERICO_DA_META",
  googleAnalyticsId: "G-SEU_ID_DO_GA4"
});
```

O código acima ilustra onde preencher; use os identificadores reais. No pacote, os campos começam vazios. Não cole o script inteiro fornecido pelas plataformas e não insira senha nem token da API de Conversões. Salve, faça commit e publique novamente. Não é necessário alterar os eventos para começar a medir.

- **Meta:** ID numérico do Pixel/dataset correspondente, no Gerenciador de Eventos.
- **Google:** ID de medição do fluxo da Web do Google Analytics 4, no formato **G-…**. O campo não aceita identificadores GTM- (Tag Manager), AW- (Google Ads), UA- ou número de propriedade. Nesta versão, o Google está configurado para GA4.
- Campo vazio ou formato inválido mantém a ferramenta desativada.
- Não duplique a instalação dos mesmos identificadores por outro script ou pelo Tag Manager.

### Eventos preparados

| Ação | Meta | Google Analytics 4 |
| --- | --- | --- |
| Página aberta, após aceitar medição | `PageView` | `page_view` |
| Visualização da seção de recursos | `ViewContent` | `view_solution` |
| Clique para abrir a agenda | `ScheduleClick` (personalizado) | `schedule_click` |
| Clique no WhatsApp | `Contact` | `whatsapp_click` |
| Primeiro preenchimento do formulário | `ContactFormStart` (personalizado) | `contact_form_start` |
| Envio válido iniciado | `ContactFormSubmitAttempt` (personalizado) | `contact_form_submit_attempt` |
| Retorno do formulário à página de agradecimento | `Lead` | `generate_lead` |
| Clique para reproduzir um vídeo | `VideoPlayClick` (personalizado) | `video_play_click` |
| Clique em link externo do YouTube | `YouTubeLinkClick` (personalizado) | `youtube_link_click` |
| Seleção de recurso na mandala por clique | `FeatureSelect` (personalizado) | `feature_select` |
| Clique no Portal de Vagas | `JobPortalClick` (personalizado) | `job_portal_click` |

**Agenda:** o site mede a abertura da agenda. Não dispara `Schedule` nem afirma que uma reunião foi marcada. A conversão de agendamento concluído precisa ser implementada em `painelcliente.starmindai.ai`, na confirmação do agendamento, usando os identificadores correspondentes. Esse sistema não foi alterado nesta entrega.

**Formulário:** `Lead`/`generate_lead` exige uma tentativa válida iniciada na mesma aba nos últimos 30 minutos e o retorno a `obrigado.html`. O marcador é consumido uma vez; abrir diretamente ou atualizar a página não gera outro lead. Esse evento é uma indicação de conclusão do fluxo do formulário, não uma confirmação de entrega na caixa de e-mail. O FormSubmit continua precisando da ativação descrita acima. Se o navegador bloquear o armazenamento da sessão, não será emitido esse lead.

**Vídeo:** o evento registra o clique no player; não afirma que o vídeo começou, foi assistido ou foi concluído.

**Preferências:** quando houver pelo menos um identificador válido, o site oferece aceitar ou recusar cookies opcionais. As tags só carregam após aceitar. Há um botão “Preferências de cookies” no rodapé para mudar a escolha. Ao retirar a autorização, a página recarrega para interromper as tags. A decisão é armazenada neste navegador. Formulário, agenda e WhatsApp funcionam mesmo com a medição recusada. Sem identificadores, nenhum banner é exibido.

Os eventos implementados não incluem os valores de nome, telefone, e-mail ou empresa. Não há correspondência avançada de dados do formulário. As plataformas podem coletar metadados técnicos de navegação conforme suas próprias tags e configurações. O modo de anúncios do Google permanece negado; esta instalação do Google serve à análise GA4.

### Verificar depois de preencher os IDs

1. Publique e abra o site. Aceite os cookies opcionais para testar.
2. Na Meta, use a área **Testar eventos** do Pixel; no GA4, use **Tempo real**.
3. Teste os cliques na agenda e no WhatsApp, os vídeos e o formulário. Para testar `Lead`, conclua um envio pelo FormSubmit já ativado e aguarde o retorno ao site.
4. Se quiser otimizar campanhas por esses sinais, configure as conversões/eventos principais desejados nas plataformas. Um clique em anúncio, um evento recebido e uma conversão atribuída à campanha são medidas diferentes.

O pacote inclui verificações locais da lógica de consentimento, da inicialização única, dos eventos de clique e do retorno do formulário sem duplicação. Nenhum evento foi enviado para contas reais; os IDs foram deixados vazios e a validação nas plataformas depende do preenchimento e da publicação.

Referências técnicas consultadas:
- Google tag: https://developers.google.com/tag-platform/gtagjs/configure
- Eventos GA4: https://developers.google.com/analytics/devguides/collection/ga4/reference/events
- Consentimento Google: https://developers.google.com/tag-platform/security/guides/consent
- Eventos Meta: https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking/

### Destaque da abertura

A abertura passou a mostrar “Mais de 600 mil entrevistas realizadas” com maior destaque. A frase “Líder de mercado em recrutamento e seleção usando inteligência artificial” foi inserida como posicionamento solicitado pelo cliente; não representa verificação independente de participação de mercado.
