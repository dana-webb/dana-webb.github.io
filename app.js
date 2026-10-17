/**
 * Интерактивность портфолио Noir Atelier:
 * 1) мобильное меню;
 * 2) аккуратное появление секций;
 * 3) подробности учебных кейсов в dialog;
 * 4) калькулятор стоимости;
 * 5) безопасная настройка Telegram без битых ссылок.
 */

/* Ник указывается без символа @. Пустое значение не создаёт неверную ссылку. */
const TELEGRAM_USER = "dana_web";

/* Все числа калькулятора собраны в одном месте, чтобы их было легко менять. */
const SITE_TYPES = {
  landing: { label: "Лендинг", price: 40000, days: 7 },
  catalog: { label: "Сайт-каталог", price: 60000, days: 12 },
  multipage: { label: "Сайт компании", price: 80000, days: 14 },
};

const FEATURES = {
  animation: { label: "Анимация интерфейса", price: 15000, days: 3 },
  telegram: { label: "Заявка в Telegram", price: 8000, days: 2 },
  quiz: { label: "Квиз", price: 12000, days: 4 },
};

/* Тексты подробностей отделены от разметки карточек. */
const CASES = {
  catalog: {
    label: "Инженерный концепт · каталог",
    title: "Каталог «Сияние»",
    description:
      "Концепт каталога для бренда ухода: человек быстро находит категорию, смотрит товар и оставляет заявку без сложной корзины.",
    stack: "HTML5 · CSS3 · JavaScript",
    demo: "demo-siyanie.html",
    code: "https://github.com/dana-webb/dana-webb.github.io/blob/main/demo-siyanie.html",
    tasks: [
      "Показать ассортимент так, чтобы клиент не терялся среди позиций",
      "Дать фильтр и поиск, которые удобно нажимать пальцем",
      "Собрать заявку на конкретный товар, не уводя со страницы в корзину",
    ],
    inside: [
      "Чистый семантический HTML5: header, main, form, dialog",
      "Сетка Flexbox/Grid без конструктора",
      "Логика на JavaScript, без внешних плагинов",
      "Лёгкая страница: нет лишних библиотек и тяжёлой галереи",
    ],
    features: [
      "Категории и фильтрация ассортимента",
      "Поиск по названию и описанию",
      "Карточка товара в модальном окне",
      "Адаптация для телефона и планшета",
      "Простой сценарий заявки",
    ],
    note:
      "Это демонстрационный концепт, а не чужой клиентский кейс. Показатели продаж здесь не придуманы.",
  },
  shop: {
    label: "Инженерный концепт · интернет-магазин",
    title: "Магазин с корзиной",
    description:
      "Клиентская часть небольшого магазина: каталог, изменение количества, сохранение корзины и последовательное оформление заказа.",
    stack: "HTML5 · CSS3 · JavaScript",
    demo: "demo-shop.html",
    code: "https://github.com/dana-webb/dana-webb.github.io/blob/main/demo-shop.html",
    tasks: [
      "Провести путь от витрины до заказа без сервера",
      "Не терять корзину, если человек обновил страницу",
      "Честно объяснить, что оплата картой здесь ещё не подключена",
    ],
    inside: [
      "Семантический HTML5 и доступные диалоги корзины",
      "Сетка Flexbox/Grid, адаптив без конструктора",
      "Корзина на чистом JavaScript, без плагинов",
      "Состояние заказа хранится в браузере, без скрытых сервисов",
    ],
    features: [
      "Каталог и фильтры",
      "Добавление и удаление товаров",
      "Изменение количества в корзине",
      "Сохранение корзины в браузере",
      "Проверка формы оформления",
    ],
    note:
      "Концепт показывает интерфейс и логику корзины. Боевой магазин дополнительно требует сервер, базу данных, оплату, чеки и мониторинг.",
  },
  tiho: {
    label: "Инженерный концепт · сайт пространства",
    title: "TIHO",
    description:
      "Многостраничный сайт камерного пространства: главная с атмосферой, программы, страница о доме и форма брони визита.",
    stack: "HTML5 · CSS3 · JavaScript",
    demo: "demo-tiho.html",
    code: "https://github.com/dana-webb/dana-webb.github.io/blob/main/demo-tiho.html",
    tasks: [
      "Передать характер места первым экраном, а не списком цен",
      "Связать несколько страниц без конструктора",
      "Довести человека до брони, не потеряв тон бренда",
    ],
    inside: [
      "Семантический HTML5 на нескольких связанных страницах",
      "Сетка Flexbox/Grid и типографика без конструктора",
      "Интерфейс на HTML/CSS/JS, без внешних плагинов",
      "Форма брони без сторонней CRM: путь остаётся на сайте",
    ],
    features: [
      "Несколько связанных страниц",
      "Главный экран с характером бренда",
      "Программы и описание пространства",
      "Форма бронирования визита",
      "Адаптация для телефона",
    ],
    note:
      "Концепт показывает тон и структуру сайта услуг. Это не чужой коммерческий кейс и не отзыв клиента.",
  },
  payment: {
    label: "Инженерный концепт · сервер и оплата",
    title: "Магазин + ЮKassa",
    description:
      "Серверный концепт: заказ сохраняется в базе, тестовый платёж создаётся через ЮKassa, владелец получает уведомление.",
    stack: "HTML5 · CSS3 · JavaScript · Flask · ЮKassa API · Telegram",
    tasks: [
      "Сохранить заказ на сервере, а не только в браузере",
      "Провести тестовый платёж без списания живых денег",
      "Сообщить владельцу о заказе и показать статус оплаты",
    ],
    inside: [
      "Семантический HTML5 на клиентской части",
      "Сервер на Flask, без WordPress и плагинов оплаты",
      "ЮKassa API и Telegram подключаю напрямую",
      "Заказ и статус платежа живут в базе, не только в браузере",
    ],
    features: [
      "Серверное создание заказа",
      "Тестовый платёж ЮKassa",
      "Статусы заказа и страница результата",
      "Telegram-уведомление владельцу",
      "Вход в административную часть",
    ],
    note:
      "Живую оплату нельзя открыть на GitHub Pages: нужен сервер. Показать тестовый сценарий могу на созвоне. Перед коммерческим запуском нужны production-хостинг, webhook и аудит безопасности.",
  },
};

function cleanTelegramUser() {
  return TELEGRAM_USER.trim().replace(/^@/, "");
}

function formatMoney(value) {
  return value.toLocaleString("ru-RU") + " ₽";
}

function formatDays(value) {
  const mod10 = value % 10;
  const mod100 = value % 100;
  let word = "дней";

  if (mod10 === 1 && mod100 !== 11) {
    word = "день";
  } else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    word = "дня";
  }

  return `${value} ${word}`;
}

function setupMobileMenu() {
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("mobile-menu");
  const lines = document.querySelectorAll("#menu-icon span");

  function setOpen(isOpen) {
    menu.classList.toggle("hidden", !isOpen);
    document.body.classList.toggle("menu-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");

    lines[0].style.transform = isOpen ? "translateY(6.5px) rotate(45deg)" : "";
    lines[1].style.transform = isOpen ? "translateY(-6.5px) rotate(-45deg)" : "";
  }

  toggle.addEventListener("click", () => {
    setOpen(menu.classList.contains("hidden"));
  });

  menu.querySelectorAll(".mobile-link").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      setOpen(false);
    }
  });
}

function setupRevealAnimation() {
  const elements = document.querySelectorAll(".reveal");

  if (
    !("IntersectionObserver" in window) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  elements.forEach((element) => observer.observe(element));
}

function fillNumberedList(container, items) {
  container.replaceChildren();

  items.forEach((item, index) => {
    const row = document.createElement("li");
    row.className = "grid grid-cols-[36px_1fr] gap-3 py-3 text-sm text-black/70";

    const number = document.createElement("span");
    number.className = "font-mono text-[9px] text-black/40";
    number.textContent = String(index + 1).padStart(2, "0");

    const text = document.createElement("span");
    text.textContent = item;

    row.append(number, text);
    container.append(row);
  });
}

function toggleActionLink(link, href) {
  if (href) {
    link.href = href;
    link.classList.remove("hidden");
    link.classList.add("flex");
    return;
  }

  link.removeAttribute("href");
  link.classList.add("hidden");
  link.classList.remove("flex");
}

function setupCaseDialog() {
  const dialog = document.getElementById("case-dialog");
  const closeButton = document.getElementById("dialog-close");
  const label = document.getElementById("dialog-label");
  const title = document.getElementById("dialog-title");
  const description = document.getElementById("dialog-description");
  const tasksTitle = document.getElementById("dialog-tasks-title");
  const tasks = document.getElementById("dialog-tasks");
  const insideTitle = document.getElementById("dialog-inside-title");
  const inside = document.getElementById("dialog-inside");
  const features = document.getElementById("dialog-features");
  const stack = document.getElementById("dialog-stack");
  const note = document.getElementById("dialog-note");
  const demo = document.getElementById("dialog-demo");
  const code = document.getElementById("dialog-code");

  if (!dialog || !closeButton) return;

  function openCase(caseId) {
    const item = CASES[caseId];
    if (!item) return;

    label.textContent = item.label;
    title.textContent = item.title;
    description.textContent = item.description;
    stack.textContent = item.stack ? "Стек: " + item.stack : "";
    note.textContent = item.note;

    const taskItems = item.tasks || [];
    const insideItems = item.inside || [];
    tasksTitle.hidden = taskItems.length === 0;
    insideTitle.hidden = insideItems.length === 0;
    fillNumberedList(tasks, taskItems);
    fillNumberedList(inside, insideItems);
    fillNumberedList(features, item.features);
    toggleActionLink(demo, item.demo);
    toggleActionLink(code, item.code);

    if (!dialog.open) {
      dialog.showModal();
      document.body.classList.add("dialog-open");
    }
  }

  document.querySelectorAll(".case-open").forEach((button) => {
    button.addEventListener("click", () => openCase(button.dataset.case));
  });

  closeButton.addEventListener("click", () => dialog.close());

  /* Клик по затемнённой области вокруг окна тоже закрывает dialog. */
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  dialog.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
  });
}

function getEstimate() {
  const form = document.getElementById("estimate-form");
  const selectedType = form.querySelector('input[name="siteType"]:checked').value;
  const type = SITE_TYPES[selectedType];

  let total = type.price;
  let days = type.days;
  const lines = [`${type.label} — ${formatMoney(type.price)}`];

  form.querySelectorAll('input[name="feature"]:checked').forEach((input) => {
    const feature = FEATURES[input.value];
    if (!feature) return;

    total += feature.price;
    days += feature.days;
    lines.push(`${feature.label} — ${formatMoney(feature.price)}`);
  });

  return { total, days, lines };
}

function makeEstimateMessage(estimate) {
  return [
    "Здравствуйте! Хочу обсудить проект.",
    "",
    ...estimate.lines,
    "",
    `Ориентир: ${formatMoney(estimate.total)}, ${formatDays(estimate.days)}.`,
  ].join("\n");
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  /* Резервный способ нужен при локальном открытии через file://. */
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function setupEstimate() {
  const form = document.getElementById("estimate-form");
  const price = document.getElementById("estimate-price");
  const days = document.getElementById("estimate-days");
  const details = document.getElementById("estimate-details");
  const telegramLink = document.getElementById("estimate-telegram");
  const copyButton = document.getElementById("estimate-copy");
  const status = document.getElementById("copy-status");
  const telegramUser = cleanTelegramUser();

  function render() {
    const estimate = getEstimate();
    const message = makeEstimateMessage(estimate);

    price.textContent = formatMoney(estimate.total);
    days.textContent = formatDays(estimate.days);
    details.replaceChildren();
    status.textContent = "";

    estimate.lines.forEach((line) => {
      const item = document.createElement("li");
      item.className = "flex justify-between gap-4";
      item.textContent = line;
      details.append(item);
    });

    if (telegramUser) {
      telegramLink.href = `https://t.me/${telegramUser}?text=${encodeURIComponent(message)}`;
      telegramLink.target = "_blank";
      telegramLink.rel = "noopener noreferrer";
    } else {
      telegramLink.href = "#contact";
      telegramLink.removeAttribute("target");
      telegramLink.removeAttribute("rel");
    }
  }

  form.addEventListener("change", render);

  copyButton.addEventListener("click", async () => {
    try {
      await copyText(makeEstimateMessage(getEstimate()));
      status.textContent = "Расчёт скопирован. Можно вставить в Telegram.";
    } catch {
      status.textContent = "Не удалось скопировать. Выделите расчёт вручную.";
    }
  });

  render();
}

function setupTelegramContact() {
  const user = cleanTelegramUser();
  if (!user) return;

  const link = document.getElementById("telegram-link");
  const copy = document.getElementById("contact-copy");

  link.href = `https://t.me/${user}`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Написать в Telegram";
  copy.textContent =
    "Напишите в Telegram. Я уточню задачу, скажу, что смогу сделать сама, и пришлю понятную смету.";
}

document.addEventListener("DOMContentLoaded", () => {
  setupMobileMenu();
  setupRevealAnimation();
  setupCaseDialog();
  setupEstimate();
  setupTelegramContact();

  document.getElementById("year").textContent = String(new Date().getFullYear());
});
