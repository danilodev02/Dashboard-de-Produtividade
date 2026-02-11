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