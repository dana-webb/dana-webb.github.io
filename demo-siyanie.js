/**
 * Логика каталога:
 * 1) список товаров — единственный «склад» данных
 * 2) фильтр по категории + поиск по названию
 * 3) модалка с заявкой на выбранную позицию
 *
 * Корзины нет специально: каталог заканчивается заявкой, магазин — оплатой.
 */

const TELEGRAM_USER = "dana_web";

/** Категории: ключ в данных → подпись на кнопке */
const CATEGORIES = [
  { id: "all", label: "Все" },
  { id: "hair", label: "Волосы" },
  { id: "nails", label: "Ногти" },
  { id: "face", label: "Лицо" },
  { id: "gift", label: "Подарки" },
];

/**
 * Витрина. Чтобы добавить товар — допишите объект сюда.
 * id должен быть уникальным, category — один из ключей выше (кроме all).
 */
const PRODUCTS = [
  {
    id: "shampoo",
    category: "hair",
    name: "Шампунь для волос",
    volume: "250 мл",
    price: 890,
    description: "Мягкое очищение без утяжеления. Тем же средством пользуемся в зале после окрашивания.",
  },
  {
    id: "mask",
    category: "hair",
    name: "Маска для волос",
    volume: "200 мл",
    price: 1250,
    description: "Питание и плотность. Курс дома 1–2 раза в неделю или как уход после салона.",
  },
  {
    id: "hair-oil",
    category: "hair",
    name: "Масло для кончиков",
    volume: "50 мл",
    price: 980,
    description: "Не склеивает длину. Наносите на сухие концы до укладки.",
  },
  {
    id: "cuticle",
    category: "nails",
    name: "Масло для кутикулы",
    volume: "15 мл",
    price: 490,
    description: "Уход между маникюрами. Тот же состав, что на стойке мастера.",
  },
  {
    id: "hand-cream",
    category: "nails",
    name: "Крем для рук",
    volume: "75 мл",
    price: 720,
    description: "Быстро впитывается, без плёнки. Удобно держать в сумке.",
  },
  {
    id: "serum",
    category: "face",
    name: "Сыворотка для лица",
    volume: "30 мл",
    price: 2100,
    description: "Лёгкая текстура под крем. Для кожи после чистки в салоне.",
  },
  {
    id: "cream",
    category: "face",
    name: "Крем после процедур",
    volume: "50 мл",
    price: 1680,
    description: "Спокойный уход на 7–10 дней после ухода у косметолога.",
  },
  {
    id: "certificate",
    category: "gift",
    name: "Подарочный сертификат",
    volume: "на услуги салона",
    price: 3000,
    description: "Электронно или на карточке. Сумму можно увеличить в заявке.",
  },
  {
    id: "set",
    category: "gift",
    name: "Набор «Домашний уход»",
    volume: "шампунь + маска",
    price: 1990,
    description: "Собранный комплект после окрашивания. Дешевле, чем позиции по отдельности.",
  },
];

const state = {
  category: "all",
  query: "",
};

function formatMoney(value) {
  return value.toLocaleString("ru-RU") + " ₽";
}

function categoryLabel(id) {
  const found = CATEGORIES.find((item) => item.id === id);
  return found ? found.label : id;
}

function pluralProducts(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return n + " товар";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return n + " товара";
  return n + " товаров";
}

/** Отбираем витрину: сначала категория, потом строка поиска */
function visibleProducts() {
  const q = state.query.trim().toLowerCase();
  return PRODUCTS.filter((product) => {
    const byCategory = state.category === "all" || product.category === state.category;
    const byQuery =
      !q ||
      product.name.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q);
    return byCategory && byQuery;
  });
}

function renderFilters() {
  const wrap = document.getElementById("filters");
  wrap.innerHTML = "";
  CATEGORIES.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = item.label;
    button.setAttribute("aria-pressed", String(item.id === state.category));
    if (item.id === state.category) button.classList.add("is-active");
    button.addEventListener("click", () => {
      state.category = item.id;
      renderFilters();
      renderCatalog();
    });
    wrap.appendChild(button);
  });
}

function renderCatalog() {
  const root = document.getElementById("catalog");
  const meta = document.getElementById("catalog-meta");
  const list = visibleProducts();

  const catName = categoryLabel(state.category);
  meta.textContent = list.length
    ? catName + " · " + pluralProducts(list.length)
    : "Ничего не нашлось — сбросьте поиск или выберите другую категорию";

  root.innerHTML = "";
  if (!list.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "По этому запросу позиций нет.";
    root.appendChild(empty);
    return;
  }

  list.forEach((product) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "card";
    card.setAttribute("aria-label", product.name + ", " + formatMoney(product.price));

    const photo = document.createElement("div");
    photo.className = "card-photo swatch-" + product.category;
    photo.setAttribute("aria-hidden", "true");

    const body = document.createElement("div");
    body.className = "card-body";
    body.innerHTML =
      "<p class=\"eyebrow\">" +
      categoryLabel(product.category) +
      "</p><h2>" +
      product.name +
      "</h2><p>" +
      product.volume +
      "</p><p class=\"price\">" +
      formatMoney(product.price) +
      "</p>";

    card.append(photo, body);
    card.addEventListener("click", () => openProduct(product));
    root.appendChild(card);
  });
}

function openProduct(product) {
  const modal = document.getElementById("product-modal");
  document.getElementById("modal-category").textContent = categoryLabel(product.category);
  document.getElementById("modal-title").textContent = product.name;
  document.getElementById("modal-volume").textContent = product.volume;
  document.getElementById("modal-desc").textContent = product.description;
  document.getElementById("modal-price").textContent = formatMoney(product.price);
  document.getElementById("modal-preview").className = "modal-preview swatch-" + product.category;
  document.getElementById("lead-product").value = product.name;

  document.getElementById("lead-form").hidden = false;
  document.getElementById("lead-success").hidden = true;

  const message = encodeURIComponent(
    "Здравствуйте! Хочу заказать из каталога: " +
      product.name +
      " (" +
      formatMoney(product.price) +
      ")."
  );
  document.getElementById("lead-telegram").href =
    "https://t.me/" + TELEGRAM_USER + "?text=" + message;

  if (typeof modal.showModal === "function") {
    modal.showModal();
  } else {
    modal.setAttribute("open", "");
  }
}

function setupModal() {
  const modal = document.getElementById("product-modal");
  document.getElementById("modal-close").addEventListener("click", () => modal.close());
  modal.addEventListener("click", (event) => {
    /* Клик по затемнению (сам dialog), не по карточке внутри */
    if (event.target === modal) modal.close();
  });
}

function setupSearch() {
  document.getElementById("search-input").addEventListener("input", (event) => {
    state.query = event.target.value;
    renderCatalog();
  });
}

function setupForm() {
  const form = document.getElementById("lead-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.hidden = true;
    document.getElementById("lead-success").hidden = false;
    form.reset();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderFilters();
  renderCatalog();
  setupSearch();
  setupModal();
  setupForm();
});
