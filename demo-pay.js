/**
 * Учебный магазин:
 * 1) витрина — как в каталоге
 * 2) корзина { id товара → количество } + localStorage
 * 3) оформление: имя, телефон, самовывоз или курьер
 */

const TELEGRAM_USER = "dana_web";
const CART_KEY = "sianie-pay-cart";
const ORDERS_KEY = "sianie-pay-orders";
const ADMIN_PASSWORD = "demo";
const MAX_QTY = 20;
const COURIER_PRICE = 350;

const CATEGORIES = [
  { id: "all", label: "Все" },
  { id: "hair", label: "Волосы" },
  { id: "nails", label: "Ногти" },
  { id: "face", label: "Лицо" },
  { id: "gift", label: "Подарки" },
];

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
    description: "Электронно или на карточке. Сумму можно увеличить в комментарии к заказу.",
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
  /** id товара в открытой модалке */
  modalProductId: null,
  currentOrderId: null,
};

function formatMoney(value) {
  return value.toLocaleString("ru-RU") + " ₽";
}

function categoryLabel(id) {
  const found = CATEGORIES.find((item) => item.id === id);
  return found ? found.label : id;
}

function findProduct(id) {
  return PRODUCTS.find((item) => item.id === id);
}

function pluralProducts(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return n + " товар";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return n + " товара";
  return n + " товаров";
}

/* ---------- Корзина: читаем и пишем в localStorage ---------- */

function loadCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY) || "{}");
    return raw && typeof raw === "object" ? raw : {};
  } catch (error) {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function cartCount(cart) {
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}

function goodsTotal(cart) {
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = findProduct(id);
    return product ? sum + product.price * qty : sum;
  }, 0);
}

function addToCart(productId, extra = 1) {
  const cart = loadCart();
  const next = (cart[productId] || 0) + extra;
  cart[productId] = Math.min(MAX_QTY, next);
  saveCart(cart);
  renderCartChrome();
  toast("Добавлено в корзину");
}

function setQty(productId, qty) {
  const cart = loadCart();
  if (qty <= 0) {
    delete cart[productId];
  } else {
    cart[productId] = Math.min(MAX_QTY, qty);
  }
  saveCart(cart);
  renderCartChrome();
  renderCartModal();
}

/* ---------- Витрина ---------- */

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

  meta.textContent = list.length
    ? categoryLabel(state.category) + " · " + pluralProducts(list.length)
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
    const card = document.createElement("article");
    card.className = "card";

    const open = document.createElement("button");
    open.type = "button";
    open.className = "card-open";
    open.setAttribute("aria-label", "Открыть " + product.name);

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

    open.append(photo, body);
    open.addEventListener("click", () => openProduct(product));

    const actions = document.createElement("div");
    actions.className = "card-actions";
    const add = document.createElement("button");
    add.type = "button";
    add.className = "ghost-btn";
    add.textContent = "В корзину";
    add.addEventListener("click", () => addToCart(product.id));
    actions.appendChild(add);

    card.append(open, actions);
    root.appendChild(card);
  });
}

function openProduct(product) {
  state.modalProductId = product.id;
  const modal = document.getElementById("product-modal");
  document.getElementById("modal-category").textContent = categoryLabel(product.category);
  document.getElementById("modal-title").textContent = product.name;
  document.getElementById("modal-volume").textContent = product.volume;
  document.getElementById("modal-desc").textContent = product.description;
  document.getElementById("modal-price").textContent = formatMoney(product.price);
  document.getElementById("modal-preview").className = "modal-preview swatch-" + product.category;
  showDialog(modal);
}

function renderCartChrome() {
  const count = cartCount(loadCart());
  const badge = document.getElementById("cart-badge");
  badge.hidden = count === 0;
  badge.textContent = String(count);
}

function selectedDelivery() {
  const checked = document.querySelector('input[name="delivery"]:checked');
  return checked ? checked.value : "pickup";
}

function renderCartModal() {
  const cart = loadCart();
  const ids = Object.keys(cart);
  const empty = document.getElementById("cart-empty");
  const filled = document.getElementById("cart-filled");
  const success = document.getElementById("order-success");

  if (success) success.hidden = true;

  if (!ids.length) {
    empty.hidden = false;
    filled.hidden = true;
    return;
  }

  empty.hidden = true;
  filled.hidden = false;

  const list = document.getElementById("cart-lines");
  list.innerHTML = "";
  ids.forEach((id) => {
    const product = findProduct(id);
    if (!product) return;
    const qty = cart[id];
    const li = document.createElement("li");
    li.className = "cart-line";
    li.innerHTML =
      "<div><strong>" +
      product.name +
      "</strong><p>" +
      formatMoney(product.price) +
      " × " +
      qty +
      " = " +
      formatMoney(product.price * qty) +
      "</p></div>";

    const controls = document.createElement("div");
    const qtyBox = document.createElement("div");
    qtyBox.className = "qty";

    const minus = document.createElement("button");
    minus.type = "button";
    minus.textContent = "−";
    minus.setAttribute("aria-label", "Меньше");
    minus.addEventListener("click", () => setQty(id, qty - 1));

    const value = document.createElement("span");
    value.textContent = String(qty);

    const plus = document.createElement("button");
    plus.type = "button";
    plus.textContent = "+";
    plus.setAttribute("aria-label", "Больше");
    plus.addEventListener("click", () => setQty(id, qty + 1));

    qtyBox.append(minus, value, plus);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "line-remove";
    remove.textContent = "Убрать";
    remove.addEventListener("click", () => setQty(id, 0));

    controls.append(qtyBox, remove);
    li.appendChild(controls);
    list.appendChild(li);
  });

  const delivery = selectedDelivery();
  const deliveryCost = delivery === "courier" ? COURIER_PRICE : 0;
  document.getElementById("cart-total").textContent = formatMoney(goodsTotal(cart) + deliveryCost);
  document.getElementById("address-wrap").hidden = delivery !== "courier";
  document.getElementById("order-address").required = delivery === "courier";
}

function orderLinesText(cart) {
  return Object.entries(cart)
    .map(([id, qty]) => {
      const product = findProduct(id);
      if (!product) return "";
      return "• " + product.name + " × " + qty + " — " + formatMoney(product.price * qty);
    })
    .filter(Boolean)
    .join("\n");
}

function showDialog(modal) {
  if (typeof modal.showModal === "function") modal.showModal();
  else modal.setAttribute("open", "");
}

function loadOrders() {
  try {
    const raw = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch (error) {
    return [];
  }
}

function saveOrder(order) {
  const orders = loadOrders();
  const index = orders.findIndex((item) => item.id === order.id);
  if (index >= 0) orders[index] = order;
  else orders.unshift(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function findOrder(id) {
  return loadOrders().find((item) => String(item.id) === String(id));
}

function statusLabel(status) {
  if (status === "paid") return "оплачен";
  if (status === "cancelled") return "отменён";
  return "ждёт оплаты";
}

function showView(name) {
  document.getElementById("view-shop").hidden = name !== "shop";
  document.getElementById("view-pay").hidden = name !== "pay";
  document.getElementById("view-result").hidden = name !== "result";
  document.getElementById("view-admin").hidden = name !== "admin";
  if (name === "admin") renderAdmin();
  window.scrollTo(0, 0);
}

function renderPayList(order) {
  const list = document.getElementById("pay-list");
  list.replaceChildren();
  order.items.forEach((item) => {
    const row = document.createElement("li");
    row.innerHTML = "<span></span><span></span>";
    row.children[0].textContent = item.name + " × " + item.qty;
    row.children[1].textContent = formatMoney(item.line_total);
    list.append(row);
  });
  const delivery = document.createElement("li");
  delivery.innerHTML = "<span>Доставка</span><span></span>";
  delivery.children[1].textContent = formatMoney(order.delivery_cost);
  list.append(delivery);
  const total = document.createElement("li");
  total.innerHTML = "<strong>Итого</strong><strong></strong>";
  total.children[1].textContent = formatMoney(order.total);
  list.append(total);
}

function showPay(orderId) {
  const order = findOrder(orderId);
  if (!order) {
    showView("shop");
    return;
  }

  state.currentOrderId = order.id;
  document.getElementById("pay-title").textContent = "Заказ №" + order.id;
  document.getElementById("pay-lead").textContent =
    order.name + ", " + order.phone + " · " + statusLabel(order.status);
  renderPayList(order);
  document.getElementById("pay-actions").hidden = order.status !== "awaiting_payment";
  showView("pay");
}

function updateCurrentOrder(status) {
  const order = findOrder(state.currentOrderId);
  if (!order) return;
  order.status = status;
  saveOrder(order);
  document.getElementById("result-title").textContent =
    status === "paid" ? "Заказ №" + order.id + " оплачен" : "Заказ №" + order.id + " отменён";
  document.getElementById("result-lead").textContent =
    order.name +
    ", это учебная оплата: деньги с карты не снимали. Заказ записан в этом браузере и его видно в разделе «Заказы».";
  document.getElementById("result-total").textContent = formatMoney(order.total);
  showView("result");
}

function renderAdmin() {
  const loggedIn = sessionStorage.getItem("sianie-pay-admin") === "1";
  document.getElementById("admin-login").hidden = loggedIn;
  document.getElementById("admin-table").hidden = !loggedIn;
  if (!loggedIn) return;

  const orders = loadOrders();
  const rows = document.getElementById("admin-rows");
  const empty = document.getElementById("admin-empty");
  rows.replaceChildren();
  empty.hidden = orders.length > 0;

  orders.forEach((order) => {
    const row = document.createElement("tr");
    const cells = [
      order.id,
      order.created_at,
      order.name + "\n" + order.phone,
      order.items.map((item) => item.name + " × " + item.qty).join("\n"),
      formatMoney(order.total),
      statusLabel(order.status),
    ];
    cells.forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.append(cell);
    });
    rows.append(row);
  });
}

function toast(text) {
  const old = document.querySelector(".toast");
  if (old) old.remove();
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = text;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1800);
}

function setupUi() {
  document.getElementById("search-input").addEventListener("input", (event) => {
    state.query = event.target.value;
    renderCatalog();
  });

  document.getElementById("cart-open").addEventListener("click", () => {
    renderCartModal();
    showDialog(document.getElementById("cart-modal"));
  });

  document.getElementById("add-from-modal").addEventListener("click", () => {
    if (!state.modalProductId) return;
    addToCart(state.modalProductId);
    document.getElementById("product-modal").close();
  });

  document.querySelectorAll("[data-close]").forEach((button) => {
    button.addEventListener("click", () => {
      document.getElementById(button.getAttribute("data-close")).close();
    });
  });

  document.querySelectorAll("dialog").forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) modal.close();
    });
  });

  document.querySelectorAll('input[name="delivery"]').forEach((input) => {
    input.addEventListener("change", renderCartModal);
  });

  document.getElementById("checkout-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const cart = loadCart();
    if (!cartCount(cart)) return;

    const name = document.getElementById("order-name").value.trim();
    const phone = document.getElementById("order-phone").value.trim();
    const comment = document.getElementById("order-comment").value.trim();
    const delivery = selectedDelivery();
    const address = document.getElementById("order-address").value.trim();
    const deliveryCost = delivery === "courier" ? COURIER_PRICE : 0;
    const items = Object.entries(cart)
      .map(([id, qty]) => {
        const product = findProduct(id);
        if (!product) return null;
        return {
          name: product.name,
          qty,
          line_total: product.price * qty,
        };
      })
      .filter(Boolean);

    const order = {
      id: Date.now() % 100000,
      created_at: new Date().toLocaleString("ru-RU"),
      name,
      phone,
      comment,
      delivery,
      address,
      delivery_cost: deliveryCost,
      items,
      total: goodsTotal(cart) + deliveryCost,
      status: "awaiting_payment",
    };

    saveOrder(order);
    saveCart({});
    renderCartChrome();
    event.target.reset();
    document.getElementById("cart-modal").close();
    showPay(order.id);
  });

  document.getElementById("pay-confirm").addEventListener("click", () => {
    updateCurrentOrder("paid");
  });
  document.getElementById("pay-cancel").addEventListener("click", () => {
    updateCurrentOrder("cancelled");
  });
  document.getElementById("pay-back").addEventListener("click", (event) => {
    event.preventDefault();
    showView("shop");
  });
  document.getElementById("result-back").addEventListener("click", (event) => {
    event.preventDefault();
    showView("shop");
  });
  document.getElementById("nav-shop").addEventListener("click", (event) => {
    event.preventDefault();
    showView("shop");
  });
  document.getElementById("nav-admin").addEventListener("click", () => {
    showView("admin");
  });
  document.getElementById("admin-login").addEventListener("submit", (event) => {
    event.preventDefault();
    const error = document.getElementById("admin-error");
    if (document.getElementById("admin-password").value === ADMIN_PASSWORD) {
      sessionStorage.setItem("sianie-pay-admin", "1");
      error.hidden = true;
      renderAdmin();
      return;
    }
    error.hidden = false;
  });
  document.getElementById("admin-logout").addEventListener("click", () => {
    sessionStorage.removeItem("sianie-pay-admin");
    renderAdmin();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderFilters();
  renderCatalog();
  renderCartChrome();
  setupUi();
});
