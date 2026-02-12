const app = document.getElementById("app")

function openAdd() {
    closeAll()
    
    app.classList.add('add-open')
}

function openEdit() {
    closeAll()
    app.classList.add('edit-open')
}

function openDelete() {
    closeAll()
    app.classList.add('delete-open')
}

function closeAll() {
    app.classList.remove('add-open', 'edit-open', 'delete-open');
}

function Add_Form_Task() {
    closeAllViewAdd()
    app.classList.add('view-task-add');
}

function Filter_Form_Task() {
    closeAllViewAdd()
    app.classList.add('view-filter-add');
}

function closeAllViewAdd() {
    app.classList.remove('view-filter-add', 'view-task-add');
}



