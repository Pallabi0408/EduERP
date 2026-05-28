// admin.js

document.addEventListener('DOMContentLoaded', () => {

    // Check Auth State
    const activeUser = checkAuth('admin');

    if (activeUser) {
        showDashboard(activeUser);
    }

    // Toggle Forms
    document.getElementById('showRegister').addEventListener('click', () => {
        toggleView('registerSection', 'loginSection');
    });

    document.getElementById('showLogin').addEventListener('click', () => {
        toggleView('loginSection', 'registerSection');
    });

    // Handle Registration
    document.getElementById('adminRegisterForm').addEventListener('submit', (e) => {

        e.preventDefault();

        const name = document.getElementById('regName').value.trim();
        const id = document.getElementById('regId').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;

        // Password Match Validation
        if (password !== confirmPassword) {

            showAlert(
                'registerAlert',
                'Passwords do not match!',
                'danger'
            );

            return;
        }

        const data = getUsersData();

        // Create admin array if not exists
        if (!data.admins) {
            data.admins = [];
        }

        // Check Duplicate Admin ID
        const existingAdmin = data.admins.find(
            admin => admin.id === id
        );

        if (existingAdmin) {

            showAlert(
                'registerAlert',
                'Admin ID already exists!',
                'danger'
            );

            return;
        }

        // Save New Admin
        data.admins.push({
            id,
            name,
            password
        });

        saveUsersData(data);

        showAlert(
            'registerAlert',
            'Admin account created successfully!',
            'success'
        );

        // Switch to Login
        setTimeout(() => {

            toggleView(
                'loginSection',
                'registerSection'
            );

        }, 1500);

    });

    // Handle Login
    document.getElementById('adminLoginForm').addEventListener('submit', (e) => {

        e.preventDefault();

        const id = document.getElementById('loginId').value.trim();
        const password = document.getElementById('loginPassword').value;

        const data = getUsersData();

        // Check if admins exist
        if (!data.admins || data.admins.length === 0) {

            showAlert(
                'loginAlert',
                'No admin account found. Please register first.',
                'danger'
            );

            return;
        }

        // Find Matching Admin
        const validAdmin = data.admins.find(
            admin =>
                admin.id === id &&
                admin.password === password
        );

        if (validAdmin) {

            // Save Session
            localStorage.setItem(
                'active_admin',
                JSON.stringify({
                    id: validAdmin.id,
                    name: validAdmin.name
                })
            );

            showDashboard({
                id: validAdmin.id,
                name: validAdmin.name
            });

        } else {

            showAlert(
                'loginAlert',
                'Invalid Admin ID or Password.',
                'danger'
            );

        }

    });

    // Handle Logout
    document.getElementById('logoutBtn').addEventListener('click', (e) => {

        e.preventDefault();

        logout('admin');

    });

});

function showDashboard(user) {

    toggleView('dashboardView', 'authView');

    document.getElementById('welcomeName').textContent =
        `Welcome, ${user.name}`;

    loadDashboardData();

}

function loadDashboardData() {

    const data = getUsersData();

    // Update Stats
    document.getElementById('totalStudents').textContent =
        data.students.length;

    document.getElementById('totalTeachers').textContent =
        data.teachers.length;

    // Populate Table
    const tbody = document.getElementById('usersTableBody');

    tbody.innerHTML = '';

    const allUsers = [

        ...data.teachers.map(t => ({
            role: 'Teacher',
            name: t.name,
            id: t.id
        })),

        ...data.students.map(s => ({
            role: 'Student',
            name: s.name,
            id: s.id
        }))

    ];

    if (allUsers.length === 0) {

        tbody.innerHTML =
            '<tr><td colspan="4" style="text-align:center;">No users registered yet.</td></tr>';

        return;
    }

    allUsers
        .slice(-5)
        .reverse()
        .forEach(u => {

            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>
                    <span style="
                        background: ${u.role === 'Teacher'
                            ? '#fce7f3'
                            : '#d1fae5'};
                        color: ${u.role === 'Teacher'
                            ? '#ec4899'
                            : '#10b981'};
                        padding: 0.25rem 0.5rem;
                        border-radius: 4px;
                        font-size: 0.75rem;
                        font-weight: bold;
                    ">
                        ${u.role}
                    </span>
                </td>

                <td>${u.name}</td>

                <td>${u.id}</td>

                <td>
                    <span style="color:#10b981;">
                        Active
                    </span>
                </td>
            `;

            tbody.appendChild(tr);

        });

}