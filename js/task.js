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

function AddTask() {
  const add_text_task = document.getElementById('add_text_task').value;
  const add_date_task = document.getElementById('add_date_task').value;
  
  const add_priority = document.getElementById('add_priority').value;
  const add_filter_task = document.getElementById('add_filter_task').value;

  ({
    text: add_text_task,
    date: add_date_task,
    priority: add_priority,
    filter: add_filter_task,
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