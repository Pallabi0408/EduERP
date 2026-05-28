// main.js - Common utilities

// Initialize Local Storage if empty
if (!localStorage.getItem('erp_users')) {
    const initialData = {
        admin: null, // { id, name, password }
        teachers: [], // [{ id, name, password }]
        students: [] // [{ id, name, password }]
    };
    localStorage.setItem('erp_users', JSON.stringify(initialData));
}

// Helper to get users data
function getUsersData() {
    return JSON.parse(localStorage.getItem('erp_users'));
}

// Helper to save users data
function saveUsersData(data) {
    localStorage.setItem('erp_users', JSON.stringify(data));
}

// Helper to show alert
function showAlert(elementId, message, type = 'danger') {
    const alertEl = document.getElementById(elementId);
    if (alertEl) {
        alertEl.textContent = message;
        alertEl.className = `alert alert-${type}`;
        alertEl.style.display = 'block';
        
        setTimeout(() => {
            alertEl.style.display = 'none';
        }, 3000);
    } else {
        alert(message);
    }
}

// Handle Logout
function logout(role) {
    localStorage.removeItem(`active_${role}`);
    window.location.href = `${role}.html`;
}

// Check Authentication
function checkAuth(role) {
    const activeUser = localStorage.getItem(`active_${role}`);
    
    // If we are on a dashboard view (not auth view) and not logged in, redirect to login
    // We'll manage this by checking the DOM to see if dashboard is visible
    return activeUser ? JSON.parse(activeUser) : null;
}

// Toggle Views (Auth vs Dashboard)
function toggleView(showId, hideId) {
    const showEl = document.getElementById(showId);
    const hideEl = document.getElementById(hideId);
    if(showEl) showEl.classList.remove('hidden');
    if(hideEl) hideEl.classList.add('hidden');
}