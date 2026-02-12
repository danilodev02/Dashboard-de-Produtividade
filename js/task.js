const DB_KEY = "app_db";

function readDB() {
  return JSON.parse(localStorage.getItem(DB_KEY)) || { version: 1, users: {} };;
}

function writeDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function getLoggedEmail () {
  return sessionStorage.getItem("usuario_logado"); // ex: "ana@email.com"
}

function ensureUser(db, email) {
  if(!db.users[email]) {
    db.users[email] = {
      profile: { email },
      filters: [],
      tasks: []
    }
  }
}

function uid(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function AddFilter(name, color = "#3B82F6") {
  const email = getLoggedEmail();
  if (!email || !name?.trim()) return null;

  const db = readDB();
  const user = ensureUser(db, email);
  const normalized = name.trim().toLowerCase()

  const exists = user.filters.some(f => f.name.toLowerCase() == normalized)
  if (exists) return null;

  const filter = {
    id: uid("f"),
    name: name.trim(),
    color,
    createdAt: new Date().toISOString()
  };

  user.filters.push(filter);
  writeDB(db);
  return filter;
}

function renderFilterSelect() {
  const email = getLoggedEmail();
  if (!email) return;

  const db = readDB();
  const user = ensureUser(db, email);
  const select = document.getElementById("add_filter_task");
  if (!select) return;

  select.innerHTML = `<option value="">Sem filtro</option>`;
  user.filters.forEach((f) => {
    select.innerHTML += `<option value="${f.id}">${f.name}</option>`;
  });
}

function AddTask() {
  const email = getLoggedEmail();
  if (!email) return null;

  const text = document.getElementById("add_text_task").value.trim();
  const date = document.getElementById("add_date_task").value;
  const priority = document.getElementById("add_priority").value;
  const filterId = document.getElementById("add_filter_task").value || null;

  if (!text || !date) return null;

  const db = readDB();
  const user = ensureUser(db, email);
  const now = new Date().toISOString();

  const task = {
    id: uid("t"),
    text,
    date,
    priority,
    filterId,
    completed: false,
    createdAt: now,
    updatedAt: now
  };

  user.tasks.push(task);
  writeDB(db);
  return task;
}

function renderTasks() {
  const email = getLoggedEmail();
  if (!email) return;

  const db = readDB();
  const user = ensureUser(db, email);
  const list = document.querySelector(".container-list");
  if (!list) return;

  list.innerHTML = "";

  user.tasks.forEach((task) => {
    const filter = user.filters.find((f) => f.id === task.filterId);
    const filterName = filter ? filter.name : "Sem filtro";

    list.innerHTML = `
    <li>
                    <div class="card-task-top">
                        <p>${task.priority}</p>
                        <p>${filterName}</p>
                    </div>
                    <h2>${task.text}</h2>
                    <div class="buttons-crud">
                        <button id="finalizar-task" type="button">Finalizar</button>
                        <button id="edit-task" type="button" onclick="openEdit()">
                            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.839 1.5675C13.0144 0.810902 14.0913 0.810903 14.2667 1.5675C14.7604 3.69877 17.4336 4.41524 18.9269 2.81653C19.4571 2.24876 20.3907 2.78735 20.1642 3.5304C19.526 5.62305 21.4827 7.57967 23.5753 6.94153C24.3184 6.71502 24.857 7.64862 24.2892 8.17883C22.6905 9.67208 23.4069 12.3453 25.5382 12.839C26.2948 13.0144 26.2948 14.0913 25.5382 14.2667C23.4069 14.7604 22.6905 17.4336 24.2892 18.9269C24.8569 19.4571 24.3184 20.3907 23.5753 20.1642C21.4827 19.526 19.526 21.4827 20.1642 23.5753C20.3907 24.3184 19.4571 24.8569 18.9269 24.2892C17.4336 22.6905 14.7604 23.4069 14.2667 25.5382C14.0913 26.2948 13.0144 26.2948 12.839 25.5382C12.3453 23.4069 9.67208 22.6905 8.17883 24.2892C7.64862 24.8569 6.71502 24.3184 6.94153 23.5753C7.57967 21.4827 5.62305 19.526 3.5304 20.1642C2.78735 20.3907 2.24876 19.4571 2.81653 18.9269C4.41524 17.4336 3.69878 14.7604 1.5675 14.2667C0.810902 14.0913 0.810903 13.0144 1.5675 12.839C3.69877 12.3453 4.41524 9.67208 2.81653 8.17883C2.24876 7.64862 2.78735 6.71502 3.5304 6.94153C5.62304 7.57967 7.57967 5.62304 6.94153 3.5304C6.71502 2.78735 7.64862 2.24876 8.17883 2.81653C9.67208 4.41524 12.3453 3.69878 12.839 1.5675Z" stroke="black" stroke-width="2"/>
                            </svg>
                        </button>
                        <button id="remove-task" type="button" onclick="openDelete()">
                            <svg width="30" height="32" viewBox="0 0 30 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.12695 7.16663H28.873L26.1133 30.1666H3.88672L1.12695 7.16663Z" stroke="#FF7678" stroke-width="2"/>
                                <path d="M12.1934 1.51172C12.286 1.37303 12.4074 1.26022 12.5449 1.1748C12.4193 1.27729 12.3013 1.38964 12.1934 1.51172ZM17.4541 1.1748C17.5922 1.2604 17.7138 1.37347 17.8066 1.5127L17.8086 1.51562C17.6997 1.39215 17.5811 1.27831 17.4541 1.1748Z" stroke="#FF7678" stroke-width="2"/>
                                <path d="M5.5293 3H24.4707C25.268 3.00006 26.0471 3.23852 26.708 3.68457L28.2979 4.75781C28.7368 5.0543 29 5.54938 29 6.0791V6.20898C29 6.29386 28.9858 6.37845 28.959 6.45898C28.8514 6.78181 28.5493 7 28.209 7H1.72656C1.3976 6.99979 1.10945 6.77877 1.02441 6.46094C1.00806 6.3998 1.00004 6.33672 1 6.27344V6.14355C1 5.57358 1.28344 5.04056 1.75586 4.72168L3.29199 3.68457C3.87032 3.29425 4.53907 3.06248 5.23145 3.01074L5.5293 3Z" stroke="#FF7678" stroke-width="2"/>
                            </svg>
                        </button>
                    </div>
                    <div class="info-task">
                        <div class="time-info-task">
                            <svg width="22" height="25" viewBox="0 0 22 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="7" y="1" width="8" height="2" rx="1" fill="black" stroke="black" stroke-width="2"/>
                                <circle cx="10.8684" cy="13.1565" r="9.86845" stroke="black" stroke-width="2"/>
                                <path d="M10.8684 8.00827C11.5003 8.00827 12.5845 14.0035 12.5845 15.1268C12.5845 16.2501 11.5003 17.1606 10.8684 17.1606C10.2366 17.1606 9.15237 16.2501 9.15237 15.1268C9.15237 14.0035 10.2366 8.00827 10.8684 8.00827Z" fill="black"/>
                            </svg>
                            <p>00:00</p>
                        </div>
                        <div class="xp-info-task">
                            <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.1639 1.52246C10.5424 0.825652 11.5431 0.825651 11.9217 1.52246L14.5858 6.42871C14.8467 6.90912 15.2342 7.30961 15.7059 7.58594L20.5906 10.4463C21.2501 10.8325 21.2501 11.7866 20.5906 12.1729L15.7059 15.0332C15.2342 15.3095 14.8467 15.71 14.5858 16.1904L11.9217 21.0967C11.5431 21.7935 10.5424 21.7935 10.1639 21.0967L7.49982 16.1904C7.23889 15.71 6.85141 15.3095 6.3797 15.0332L1.49493 12.1729C0.835474 11.7866 0.835478 10.8325 1.49493 10.4463L6.3797 7.58594C6.85141 7.30961 7.23889 6.90912 7.49982 6.42871L10.1639 1.52246Z" stroke="black" stroke-width="2"/>
                            </svg>
                            <p>0</p>
                        </div>
                        <div class="money-info-task">
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21.2214 10.6107C21.2214 16.4709 16.4709 21.2214 10.6107 21.2214C4.75058 21.2214 0 16.4709 0 10.6107C0 4.75058 4.75058 0 10.6107 0C16.4709 0 21.2214 4.75058 21.2214 10.6107ZM1.53859 10.6107C1.53859 15.6211 5.60032 19.6829 10.6107 19.6829C15.6211 19.6829 19.6829 15.6211 19.6829 10.6107C19.6829 5.60032 15.6211 1.53859 10.6107 1.53859C5.60032 1.53859 1.53859 5.60032 1.53859 10.6107Z" fill="black"/>
                                <path d="M10.2402 17.1182V3.48179H11.1138V17.1182H10.2402ZM13.1806 7.5727C13.1166 7.03293 12.8574 6.61389 12.4029 6.3156C11.9483 6.0173 11.3908 5.86815 10.7303 5.86815C10.2473 5.86815 9.82474 5.94628 9.46253 6.10253C9.10386 6.25878 8.82332 6.47362 8.62091 6.74706C8.42205 7.0205 8.32261 7.33122 8.32261 7.67923C8.32261 7.97043 8.39186 8.22078 8.53036 8.4303C8.6724 8.63626 8.85351 8.80849 9.07368 8.94699C9.29385 9.08193 9.52467 9.19379 9.76615 9.28257C10.0076 9.3678 10.2296 9.43704 10.432 9.49031L11.5399 9.78861C11.824 9.86318 12.1401 9.96616 12.4881 10.0976C12.8397 10.2289 13.1752 10.4083 13.4948 10.6356C13.818 10.8593 14.0843 11.1469 14.2939 11.4985C14.5034 11.85 14.6081 12.2815 14.6081 12.7929C14.6081 13.3824 14.4537 13.915 14.1447 14.3909C13.8393 14.8667 13.3919 15.2449 12.8024 15.5255C12.2164 15.806 11.5044 15.9463 10.6664 15.9463C9.88511 15.9463 9.20862 15.8202 8.63689 15.5681C8.06871 15.316 7.62126 14.9644 7.29456 14.5134C6.97141 14.0624 6.78852 13.5386 6.74591 12.942H8.10955C8.14506 13.3539 8.28355 13.6949 8.52503 13.9647C8.77006 14.2311 9.07901 14.4299 9.45188 14.5613C9.8283 14.6892 10.2331 14.7531 10.6664 14.7531C11.1706 14.7531 11.6234 14.6714 12.0247 14.5081C12.426 14.3412 12.7438 14.1103 12.9782 13.8156C13.2125 13.5173 13.3297 13.1693 13.3297 12.7716C13.3297 12.4093 13.2285 12.1146 13.0261 11.8873C12.8237 11.6601 12.5573 11.4754 12.2271 11.3334C11.8968 11.1913 11.5399 11.067 11.1564 10.9605L9.81409 10.577C8.96182 10.3319 8.2871 9.98214 7.78994 9.5276C7.29278 9.07305 7.0442 8.47824 7.0442 7.74315C7.0442 7.13236 7.20933 6.59969 7.53959 6.14514C7.8734 5.68704 8.32084 5.33193 8.88192 5.0798C9.44655 4.82412 10.0769 4.69628 10.7729 4.69628C11.476 4.69628 12.101 4.82234 12.6479 5.07447C13.1948 5.32305 13.628 5.66396 13.9476 6.0972C14.2708 6.53044 14.4412 7.02227 14.459 7.5727H13.1806Z" fill="black"/>
                            </svg>
                            <p>0</p>
                        </div>
                    </div>
                </li>
    `;
    list.appendChild();
  });
}


document.getElementById("add_filter_form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("name_filter_add");
  const filter = AddFilter(input.value);
  if (filter) {
    input.value = "";
    renderFilterSelect();
  }
});

document.getElementById("add_task_form").addEventListener("submit", (e) => {
  e.preventDefault();
  const created = AddTask();
  if (created) {
    e.target.reset();
    renderTasks();
  }
});