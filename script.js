(function () {
  "use strict";

  // CONFIGURE AQUI O NÚMERO DO WHATSAPP (somente dígitos, com DDI/DDD). Ex: Brasil (11) -> 5511999999999
  const WHATSAPP_NUMBER = "xxxxxxxxxxxxx"; // <-- troque pelo seu número

  const OPEN_HOUR = 8;   // 08:00 base
  const OPEN_MIN = 30;   // começa às 08:30
  const CLOSE_HOUR = 18; // 18:00
  const INTERVAL_MINUTES = 35; // intervalo entre horários

  const nomeInput = document.getElementById("nome");
  const dataInput = document.getElementById("data");
  const observacoesInput = document.getElementById("observacoes");
  const listaHorarios = document.getElementById("listaHorarios");
  const vazioEl = document.getElementById("semHorarios");
  const hojeBtn = document.getElementById("hojeBtn");

  // Utils de data e formatação
  const fmtHora = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", hour12: false });
  const fmtData = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

  function getTodayISO() {
    const today = new Date();
    // Zerar horas para o campo date
    today.setHours(0, 0, 0, 0);
    return today.toISOString().slice(0, 10);
  }

  function isSunday(date) {
    return date.getDay() === 0; // 0 = domingo
  }

  function isSameDay(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
  }

  function clampToWorkdayRange(date) {
    const start = new Date(date);
    start.setHours(OPEN_HOUR, OPEN_MIN, 0, 0);
    const end = new Date(date);
    end.setHours(CLOSE_HOUR, 0, 0, 0);
    return { start, end };
  }

  function generateTimeSlots(date) {
    const { start, end } = clampToWorkdayRange(date);
    const now = new Date();
    const slots = [];

    if (isSunday(date)) {
      return slots; // domingo sem horários
    }

    // gera de 08:30 até 18:00 inclusive se cair exato
    for (let t = new Date(start); t <= end; t = addMinutes(t, INTERVAL_MINUTES)) {
      // se for o mesmo dia de hoje, bloquear horários passados
      if (isSameDay(date, now) && t <= now) {
        continue;
      }
      // Garantir não passar do limite das 18:00
      if (t.getHours() > CLOSE_HOUR || (t.getHours() === CLOSE_HOUR && t.getMinutes() > 0)) {
        break;
      }
      slots.push(new Date(t));
    }
    return slots;
  }

  function buildWhatsAppLink(dateObj, timeObj, nome, observacoes) {
    const dataStr = fmtData.format(dateObj);
    const horaStr = fmtHora.format(timeObj);
    const nomeStr = nome ? nome.trim() : "";
    const obsStr = observacoes ? observacoes.trim() : "";

    let msg = `Olá! Gostaria de agendar um corte de cabelo para ${dataStr} às ${horaStr}.`;
    if (nomeStr) msg += `\nNome: ${nomeStr}`;
    if (obsStr) msg += `\nObservações: ${obsStr}`;
    msg += "\nPode confirmar, por favor?";

    const encoded = encodeURIComponent(msg);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
  }

  function renderSlotsForDate(date) {
    listaHorarios.innerHTML = "";
    const slots = generateTimeSlots(date);

    if (slots.length === 0) {
      vazioEl.hidden = false;
      return;
    }
    vazioEl.hidden = true;

    for (const slot of slots) {
      const btn = document.createElement("button");
      btn.className = "slot";
      btn.type = "button";
      btn.textContent = fmtHora.format(slot);
      btn.addEventListener("click", () => {
        const link = buildWhatsAppLink(date, slot, nomeInput.value, observacoesInput.value);
        window.open(link, "_blank");
      });
      listaHorarios.appendChild(btn);
    }
  }

  function setMinMaxAndDisableSundays() {
    const todayISO = getTodayISO();
    dataInput.min = todayISO;
    // opcional: limitar a 60 dias à frente
    const max = new Date();
    max.setDate(max.getDate() + 60);
    dataInput.max = max.toISOString().slice(0, 10);
  }

  function ensureNonSunday(date) {
    // Se cair em domingo, avança para segunda
    if (isSunday(date)) {
      const next = new Date(date);
      next.setDate(next.getDate() + 1);
      return next;
    }
    return date;
  }

  function init() {
    setMinMaxAndDisableSundays();

    // Define hoje (ou segunda, se hoje for domingo)
    const initDate = ensureNonSunday(new Date());
    initDate.setHours(0, 0, 0, 0);

    dataInput.value = initDate.toISOString().slice(0, 10);
    renderSlotsForDate(initDate);

    dataInput.addEventListener("change", () => {
      const chosen = new Date(dataInput.value);
      const normalized = ensureNonSunday(chosen);
      if (!isSameDay(chosen, normalized)) {
        // se o usuário escolheu domingo, mova para segunda e avise sutilmente
        dataInput.value = normalized.toISOString().slice(0, 10);
      }
      renderSlotsForDate(new Date(dataInput.value));
    });

    hojeBtn.addEventListener("click", () => {
      const today = ensureNonSunday(new Date());
      today.setHours(0, 0, 0, 0);
      dataInput.value = today.toISOString().slice(0, 10);
      renderSlotsForDate(today);
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();


