# Agendamento de Corte de Cabelo (via WhatsApp)

Site simples de agendamento com horários a cada 35 minutos, de segunda a sábado, das 08:30 às 18:00. Ao clicar no horário, o WhatsApp abre com a mensagem de agendamento preenchida.

## Como usar

1. Abra o arquivo `script.js` e configure o número do WhatsApp:
   ```js
   const WHATSAPP_NUMBER = "xxxxxxxxxxxxx"; // troque para o seu número
   ```
   - Use apenas dígitos, incluindo DDI e DDD. Exemplo (Brasil, São Paulo): `5511999999999`.

2. Abra `index.html` no navegador.

## Regras

- Dias disponíveis: segunda a sábado (domingo é bloqueado automaticamente).
- Horário: 08:30 até 18:00, com intervalo de 35 minutos.
- No mesmo dia, horários no passado não aparecem.

## Publicar o site

- GitHub Pages: envie estes arquivos para um repositório e ative o Pages.
- Hospedagem estática: qualquer serviço que sirva arquivos HTML/CSS/JS.

## Personalização

- Cores e fontes em `style.css`.
- Mensagem do WhatsApp gerada em `buildWhatsAppLink` dentro de `script.js`.

---

Feito com ❤️ para você.
