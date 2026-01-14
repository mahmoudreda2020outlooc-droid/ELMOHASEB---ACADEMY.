import { auth } from './firebase-config.js';
import { loginUser } from './auth.js';
import { initSecurity } from './security.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Security Modules (Anti-right click, etc.)
    initSecurity();

    // Check if we are on the login page
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageEl = document.getElementById('loginMessage');

    messageEl.style.display = 'none';
    messageEl.textContent = '';

    try {
        await loginUser(email, password);
        // Redirect handled in auth.js or here upon success
        window.location.href = 'dashboard.html';
    } catch (error) {
        messageEl.textContent = 'فشل تسجيل الدخول: ' + error.message;
        messageEl.style.display = 'block';
    }
}
