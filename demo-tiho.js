const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (finePointer) {
  document.querySelectorAll("[data-magnetic]").forEach((button) => {
    button.addEventListener("mousemove", (event) => {
      const box = button.getBoundingClientRect();
      const x = event.clientX - box.left - box.width / 2;
      const y = event.clientY - box.top - box.height / 2;
      button.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
    });
    button.addEventListener("mouseleave", () => {
      button.style.transform = "translate(0, 0)";
    });
  });
}

const programs = [
  {
    id: "ocean",
    cat: "body",
    name: "Дыхание океана",
    time: "90 мин",
    price: "8 500 ₽",
    text: "Солевое обёртывание и длинные волны масла. Тело становится тяжелее, мысли — тише.",
  },
  {
    id: "cedar",
    cat: "body",
    name: "Магия кедра",
    time: "120 мин",
    price: "11 000 ₽",
    text: "Тёплые камни, кедровое масло и глубокая работа со спиной.",
  },
  {
    id: "linen",
    cat: "body",
    name: "Тёплый лён",
    time: "75 мин",
    price: "7 200 ₽",
    text: "Медленный масляный массаж под нагретыми льняными тканями.",
  },
  {
    id: "stones",
    cat: "body",
    name: "Камни и тишина",
    time: "100 мин",
    price: "9 800 ₽",
    text: "Базальт, паузы и давление. Без разговоров.",
  },
  {
    id: "clay",
    cat: "body",
    name: "Глина и масло",
    time: "80 мин",
    price: "7 900 ₽",
    text: "Тёплая глина на спине, затем масло и длинные линии рук.",
  },
  {
    id: "salt",
    cat: "body",
    name: "Соляной берег",
    time: "90 мин",
    price: "8 700 ₽",
    text: "Скраб морской соли и мягкое восстановление кожи.",
  },
  {
    id: "sculpt",
    cat: "face",
    name: "Скульптор скул и сияние",
    time: "60 мин",
    price: "6 000 ₽",
    text: "Буккальный контур, лифтинг и спокойный тон лица.",
  },
  {
    id: "moon",
    cat: "face",
    name: "Лунное молоко",
    time: "50 мин",
    price: "5 400 ₽",
    text: "Молочные ферменты, холодный фарфор и мягкий блеск.",
  },
  {
    id: "breath",
    cat: "face",
    name: "Глубокое дыхание кожи",
    time: "70 мин",
    price: "6 800 ₽",
    text: "Кислотный уход без агрессии. Кожа снова дышит.",
  },
  {
    id: "contour",
    cat: "face",
    name: "Тихий контур",
    time: "45 мин",
    price: "4 900 ₽",
    text: "Короткий ритуал для линии челюсти и взгляда.",
  },
  {
    id: "immerse",
    cat: "calm",
    name: "Полное погружение",
    time: "150 мин",
    price: "15 000 ₽",
    text: "Массаж, поющие чаши и тёмная комната. Выход из шума.",
  },
  {
    id: "silence",
    cat: "calm",
    name: "Тишина комнаты",
    time: "90 мин",
    price: "9 200 ₽",
    text: "Дыхание, тёплые руки и почти полный мрак.",
  },
  {
    id: "sound",
    cat: "calm",
    name: "Звук и вода",
    time: "120 мин",
    price: "12 500 ₽",
    text: "Чаши, капли на кожу и очень медленный темп.",
  },
  {
    id: "night",
    cat: "calm",
    name: "Ночной ритуал",
    time: "180 мин",
    price: "18 000 ₽",
    text: "Вечерний визит: тело, лицо и звук до полного затихания.",
  },
];

const masters = [
  {
    id: "anna",
    name: "Анна",
    spec: "Глубокий миофасциальный релиз",
    photo:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "li",
    name: "Ли",
    spec: "Восточные техники",
    photo:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "maria",
    name: "Мария",
    spec: "Лицо и тихий контур",
    photo:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=240&q=80",
  },
];

const bookingRoot = document.querySelector("[data-booking]");

if (bookingRoot) {
  const state = {
    cat: "body",
    program: new URLSearchParams(window.location.search).get("program") || "",
    master: "",
    date: "",
    time: "",
  };

  const found = programs.find((item) => item.id === state.program);
  if (found) {
    state.cat = found.cat;
  }

  const busy = new Set(["13:00-2", "17:00-4", "11:00-0", "19:00-6"]);

  const week = Array.from({ length: 8 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return date;
  });

  const hours = ["11:00", "13:00", "15:00", "17:00", "19:00"];

  const programBox = document.querySelector("#program-list");
  const masterBox = document.querySelector("#master-list");
  const dateBox = document.querySelector("#date-list");
  const timeBox = document.querySelector("#time-list");
  const summary = document.querySelector("#summary");
  const form = document.querySelector("#visit-form");
  const done = document.querySelector("#visit-done");

  const weekday = new Intl.DateTimeFormat("ru-RU", { weekday: "short" });
  const dayMonth = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
  });

  function currentProgram() {
    return programs.find((item) => item.id === state.program);
  }

  function currentMaster() {
    return masters.find((item) => item.id === state.master);
  }

  function renderPrograms() {
    programBox.innerHTML = programs
      .filter((item) => item.cat === state.cat)
      .map(
        (item) => `
        <button type="button" data-program="${item.id}" class="choice w-full rounded-2xl border border-[#EAE5D9]/15 bg-[#EAE5D9]/5 p-5 text-left backdrop-blur-md ${
          state.program === item.id ? "is-on" : ""
        }">
          <p class="font-serif text-2xl text-[#EAE5D9]">${item.name}</p>
          <p class="mt-2 text-sm tracking-wide text-[#EAE5D9]/70">${item.time} · ${item.price}</p>
          <p class="mt-3 max-w-md text-sm leading-relaxed text-[#EAE5D9]/60">${item.text}</p>
        </button>`
      )
      .join("");
  }

  function renderMasters() {
    masterBox.innerHTML = masters
      .map(
        (item) => `
        <button type="button" data-master="${item.id}" class="choice flex items-center gap-4 rounded-2xl border border-[#EAE5D9]/15 bg-[#EAE5D9]/5 p-4 text-left backdrop-blur-md ${
          state.master === item.id ? "is-on" : ""
        }">
          <img src="${item.photo}" alt="${item.name}" class="photo h-16 w-16 rounded-full object-cover" />
          <span>
            <span class="block font-serif text-xl">Мастер ${item.name}</span>
            <span class="mt-1 block text-sm text-[#EAE5D9]/60">${item.spec}</span>
          </span>
        </button>`
      )
      .join("");
  }

  function renderDates() {
    dateBox.innerHTML = week
      .map((date, index) => {
        const key = String(index);
        return `
        <button type="button" data-date="${key}" class="choice min-w-[5.4rem] rounded-2xl border border-[#EAE5D9]/15 bg-[#EAE5D9]/5 px-3 py-4 text-center backdrop-blur-md ${
          state.date === key ? "is-on" : ""
        }">
          <span class="block text-[10px] uppercase tracking-[0.2em] text-[#EAE5D9]/50">${weekday.format(date)}</span>
          <span class="mt-1 block font-serif text-lg">${dayMonth.format(date)}</span>
        </button>`;
      })
      .join("");
  }

  function renderTimes() {
    timeBox.innerHTML = hours
      .map((hour) => {
        const closed = busy.has(`${hour}-${state.date || "x"}`);
        return `
        <button type="button" data-time="${hour}" class="slot rounded-2xl border border-[#EAE5D9]/15 bg-[#EAE5D9]/5 px-4 py-3 backdrop-blur-md ${
          state.time === hour ? "is-on" : ""
        } ${closed ? "is-off" : ""}">${hour}</button>`;
      })
      .join("");
  }

  function renderSummary() {
    const program = currentProgram();
    const master = currentMaster();
    const date =
      state.date === "" ? "" : dayMonth.format(week[Number(state.date)]);
    summary.innerHTML = `
      <p>${program ? program.name : "Программа не выбрана"}</p>
      <p class="mt-2 text-[#EAE5D9]/65">${master ? `Мастер ${master.name}` : "Мастер не выбран"}</p>
      <p class="mt-2 text-[#EAE5D9]/65">${date || "Дата не выбрана"}${state.time ? `, ${state.time}` : ""}</p>
      <p class="mt-4 font-serif text-2xl">${program ? program.price : ""}</p>
    `;
  }

  function render() {
    document.querySelectorAll("[data-cat]").forEach((button) => {
      button.classList.toggle("is-on", button.dataset.cat === state.cat);
    });
    renderPrograms();
    renderMasters();
    renderDates();
    renderTimes();
    renderSummary();
  }

  bookingRoot.addEventListener("click", (event) => {
    const cat = event.target.closest("[data-cat]");
    const program = event.target.closest("[data-program]");
    const master = event.target.closest("[data-master]");
    const date = event.target.closest("[data-date]");
    const time = event.target.closest("[data-time]");

    if (cat) {
      state.cat = cat.dataset.cat;
      if (currentProgram()?.cat !== state.cat) {
        state.program = "";
      }
    }
    if (program) state.program = program.dataset.program;
    if (master) state.master = master.dataset.master;
    if (date) {
      state.date = date.dataset.date;
      state.time = "";
    }
    if (time && !time.classList.contains("is-off")) {
      state.time = time.dataset.time;
    }
    render();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!state.program || !state.master || !state.date || !state.time) {
      summary.classList.add("ring-1", "ring-[#EAE5D9]/40");
      summary.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    form.hidden = true;
    done.hidden = false;
  });

  render();
}
