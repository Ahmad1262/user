const apiUrl = 'https://jsonplaceholder.typicode.com/users'; 
const userTableBody = document.querySelector('#userTable tbody');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const addBtn = document.getElementById('addBtn');
const editPopup = document.getElementById('editPopup');
const editNameInput = document.getElementById('editName');
const editEmailInput = document.getElementById('editEmail');
const saveEditBtn = document.getElementById('saveEditBtn');
const closeEditBtn = document.getElementById('closeEditBtn');
let editingUserId = null;

function fetchUsers() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            userTableBody.innerHTML = '';
            data.forEach(user => {
                addUserToTable(user);
            });
        })
        .catch(error => console.error('Error fetching users:', error));
}

function addUserToTable(user) {
    const row = document.createElement('tr');
    row.dataset.id = user.id;
    row.innerHTML = `
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>
            <button class="editBtn">Edit</button>
            <button class="deleteBtn">Delete</button>
        </td>
    `;
    userTableBody.appendChild(row);
}

function addUser() {
    const name = nameInput.value;
    const email = emailInput.value;
    if (name && email) {
        const user = { name, email };

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(response => response.json())
            .then(data => {
                addUserToTable(data);
                nameInput.value = '';
                emailInput.value = '';
            })
            .catch(error => console.error('Error adding user:', error));
    }
}

function deleteUser(userId, rowElement) {
    fetch(`${apiUrl}/${userId}`, {
        method: 'DELETE'
    })
        .then(() => {
            rowElement.remove();
        })
        .catch(error => console.error('Error deleting user:', error));
}

function showEditPopup(user) {
    editPopup.style.display = 'flex';
    editNameInput.value = user.name;
    editEmailInput.value = user.email;
    editingUserId = user.id;
}

function hideEditPopup() {
    editPopup.style.display = 'none';
}

function saveEditedUser() {
    const updatedName = editNameInput.value;
    const updatedEmail = editEmailInput.value;
    const updatedUser = { name: updatedName, email: updatedEmail };

    fetch(`${apiUrl}/${editingUserId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
    })
        .then(response => response.json())
        .then(data => {
            const row = document.querySelector(`tr[data-id='${editingUserId}']`);
            row.querySelector('td:nth-child(1)').textContent = data.name;
            row.querySelector('td:nth-child(2)').textContent = data.email;
            hideEditPopup();
        })
        .catch(error => console.error('Error editing user:', error));
}

userTableBody.addEventListener('click', (e) => {
    const row = e.target.closest('tr');
    const userId = row.dataset.id;

    if (e.target.classList.contains('deleteBtn')) {
        deleteUser(userId, row);
    }

    if (e.target.classList.contains('editBtn')) {
        const name = row.querySelector('td:nth-child(1)').textContent;
        const email = row.querySelector('td:nth-child(2)').textContent;
        const user = { id: userId, name, email };
        showEditPopup(user);
    }
});

closeEditBtn.addEventListener('click', hideEditPopup);
saveEditBtn.addEventListener('click', saveEditedUser);
addBtn.addEventListener('click', addUser);

fetchUsers();