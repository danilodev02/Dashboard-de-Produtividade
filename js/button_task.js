const app = document.getElementById("app");
const panelAddTaskForm = document.getElementById("add_task_form");
const panelAddFilterForm = document.getElementById("add_filter_form");
const viewButtons = document.querySelectorAll(".view-buttons button");

function openAdd() {
    closeAll();
    app.classList.add("add-open");
}

function openEdit() {
    closeAll();
    app.classList.add("edit-open");
}

function openDelete() {
    closeAll();
    app.classList.add("delete-open");
}

function closeAll() {
    app.classList.remove("add-open", "edit-open", "delete-open");
}

function setViewButtonState(view) {
    viewButtons.forEach((button) => {
        const isActive =
            (view === "task" && button.textContent.includes("Tarefa")) ||
            (view === "filter" && button.textContent.includes("Filtro"));
        button.setAttribute("aria-pressed", String(isActive));
    });
}

function ViewAddTask() {
    if (!panelAddTaskForm || !panelAddFilterForm) return;
    panelAddTaskForm.style.display = "grid";
    panelAddFilterForm.style.display = "none";
    setViewButtonState("task");
}

function ViewAddFilter() {
    if (!panelAddTaskForm || !panelAddFilterForm) return;
    panelAddTaskForm.style.display = "none";
    panelAddFilterForm.style.display = "grid";
    setViewButtonState("filter");
}
