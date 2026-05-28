// student.js

document.addEventListener('DOMContentLoaded', () => {
    // Check Auth State
    const activeUser = checkAuth('student');
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
    document.getElementById('studentRegisterForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('regName').value.trim();
        const id = document.getElementById('regId').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;

        if (password !== confirmPassword) {
            showAlert('registerAlert', 'Passwords do not match!', 'danger');
            return;
        }

        const data = getUsersData();
        
        // Check if ID already exists
        if (data.students.find(s => s.id === id)) {
            showAlert('registerAlert', 'Student ID already registered. Please login.', 'danger');
            return;
        }

        data.students.push({ id, name, password });
        saveUsersData(data);
        
        showAlert('registerAlert', 'Registration successful! Please login.', 'success');
        setTimeout(() => {
            toggleView('loginSection', 'registerSection');
        }, 1500);
    });

    // Handle Login
    document.getElementById('studentLoginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const id = document.getElementById('loginId').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        const data = getUsersData();
        const student = data.students.find(s => s.id === id);

        if (!student) {
            showAlert('loginAlert', 'Student ID does not exist. Please register first.', 'danger');
            return;
        }

        if (student.password === password) {
            // Save session
            localStorage.setItem('active_student', JSON.stringify({ id: student.id, name: student.name }));
            showDashboard({ id: student.id, name: student.name });
        } else {
            showAlert('loginAlert', 'Invalid Password.', 'danger');
        }
    });

    // Handle Logout
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        logout('student');
    });
});

function showDashboard(user) {
    toggleView('dashboardView', 'authView');
    
    // Update Profile Info
    document.getElementById('welcomeName').textContent = `Welcome, ${user.name}`;
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileId').textContent = `ID: ${user.id}`;
    
    const initial = user.name.charAt(0).toUpperCase();
    document.getElementById('profileAvatar').textContent = initial;
    document.getElementById('profileInitial').textContent = initial;
}
