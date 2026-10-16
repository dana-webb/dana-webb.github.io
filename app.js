/**
 * Интерактивность одностраничного портфолио:
 * 1) мобильное меню (бургер)
 * 2) калькулятор цены и сроков в реальном времени
 * 3) ссылка в Telegram с предзаполненным текстом сметы
 */

/* ---------- Прайс: править только здесь, форма пересчитается сама ---------- */
const PRICES = {
  landing: { label: "Лендинг", price: 40000, days: 7 },
  catalog: { label: "Сайт-каталог", price: 60000, days: 12 },
  multipage: { label: "Многостраничник", price: 80000, days: 14 },
};

const FEATURES = {
  animation: { label: "Анимация", price: 15000, days: 3 },
  form: { label: "Форма связи", price: 8000, days: 2 },
  quiz: { label: "Квиз", price: 12000, days: 4 },
};

/*
 * Личный ник указывается только здесь, без символа @.
 * Пустое значение безопасно: кнопки прокрутят к пояснению в контактах,
 * а не откроют несуществующий адрес.
 */
const TELEGRAM_USER = "";

/**
 * Убирает случайный символ @ и пробелы, чтобы получить корректный адрес.
 */
function getTelegramUser() {
  return TELEGRAM_USER.trim().replace(/^@/, "");
}

/**
 * Собирает ссылку Telegram. Текст сообщения передаём только там,
 * где он действительно нужен — например, в результате калькулятора.
 */
function makeTelegramUrl(message = "") {
  const user = getTelegramUser();
  const query = message ? "?text=" + encodeURIComponent(message) : "";
  return user ? "https://t.me/" + user + query : "#contacts";
}

/**
 * Включает Telegram-кнопки после добавления ника.
 * До этого они ведут к честному пояснению, а не на битую ссылку.
 */
function setupTelegramLinks() {
  const user = getTelegramUser();
  const links = document.querySelectorAll("[data-telegram-link]");
  const status = document.getElementById("contact-status");

  links.forEach((link) => {
    if (user) {
      link.href = makeTelegramUrl();
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = link.dataset.configuredText;
      link.removeAttribute("title");
    } else {
      link.href = "#contacts";
      link.removeAttribute("target");
      link.removeAttribute("rel");
      link.title = "Личный Telegram будет добавлен перед запуском продаж";
    }
  });

  if (user) {
    status.textContent = "Напишите в Telegram — отвечу и уточню задачу, сроки и бюджет.";
  }
}

/**
 * Форматирует число как российскую валюту: 40000 → «40 000 ₽»
 */
function formatMoney(value) {
  return value.toLocaleString("ru-RU") + " ₽";
}

/**
 * Склонение «день / дня / дней» по правилам русского языка
 */
function formatDays(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  let word = "дней";
  if (mod10 === 1 && mod100 !== 11) {
    word = "день";
  } else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    word = "дня";
  }
  return n + " " + word;
}

/**
 * Считывает форму, считает сумму и срок, обновляет блок «Итого»
 * и кнопку «Обсудить в Telegram».
 */
function recalculate() {
  const form = document.getElementById("calc-form");
  const type = form.querySelector('input[name="siteType"]:checked').value;

  let total = PRICES[type].price;
  let days = PRICES[type].days;
  const lines = [PRICES[type].label + " — " + formatMoney(PRICES[type].price)];

  form.querySelectorAll('input[name="feature"]:checked').forEach((input) => {
    const extra = FEATURES[input.value];
    total += extra.price;
    days += extra.days;
    lines.push(extra.label + " — " + formatMoney(extra.price));
  });

  document.getElementById("calc-price").textContent = formatMoney(total);
  document.getElementById("calc-days").textContent = formatDays(days);

  const list = document.getElementById("calc-breakdown");
  list.innerHTML = "";
  lines.forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    list.appendChild(li);
  });

  /* Клиент сразу видит свой расчёт в поле ввода чата */
  const message =
    "Здравствуйте! Хочу сайт.\n" +
      lines.join("\n") +
      "\nИтого: " +
      formatMoney(total) +
      ", срок " +
      formatDays(days);

  const calculatorLink = document.getElementById("calc-telegram");
  if (getTelegramUser()) {
    calculatorLink.href = makeTelegramUrl(message);
  } else {
    calculatorLink.href = "#contacts";
  }
}

/**
 * Открывает / закрывает мобильное меню и блокирует скролл страницы
 */
function setupMobileMenu() {
  const toggle = document.getElementById("menu-toggle");
  const panel = document.getElementById("mobile-menu");
  const iconOpen = document.getElementById("icon-open");
  const iconClose = document.getElementById("icon-close");

  function setOpen(isOpen) {
    panel.classList.toggle("hidden", !isOpen);
    iconOpen.classList.toggle("hidden", isOpen);
    iconClose.classList.toggle("hidden", !isOpen);
    document.body.classList.toggle("menu-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
  }

  toggle.addEventListener("click", () => {
    setOpen(panel.classList.contains("hidden"));
  });

  /* Клик по пункту — закрыть меню, чтобы якорь был виден под шапкой */
  panel.querySelectorAll(".js-menu-link").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupMobileMenu();
  setupTelegramLinks();

  const form = document.getElementById("calc-form");
  form.addEventListener("change", recalculate);
  recalculate();
});
