// ===================================
// Authentication Logic
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const errorMessage = document.getElementById('errorMessage');

    // Handle Login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const emailEl = document.getElementById('email');
            const passwordEl = document.getElementById('password');
            const roleEl = document.getElementById('role');

            const email = emailEl ? emailEl.value.trim() : '';
            const password = passwordEl ? passwordEl.value : '';
            const role = roleEl ? roleEl.value : '';

            if (!role) {
                showError('Please select a role');
                return;
            }

            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
            const btnLoader = submitBtn ? submitBtn.querySelector('.btn-loader') : null;

            try {
                // Show loading state
                if (btnText) btnText.style.display = 'none';
                if (btnLoader) btnLoader.classList.remove('hidden');
                if (submitBtn) submitBtn.disabled = true;
                hideError();

                // Use global api if available
                if (typeof api === 'undefined' || !api || !api.signIn) {
                    throw new Error('API is not available');
                }

                await api.signIn(email, password, role);

                // Get user role and redirect accordingly
                const userRole = localStorage.getItem('role');

                if (userRole === 'TEACHER') {
                    window.location.href = 'teacher-dashboard.html';
                } else if (userRole === 'STUDENT') {
                    window.location.href = 'student-dashboard.html';
                } else {
                    window.location.href = 'index.html';
                }

            } catch (err) {
                const message = (err && err.message) ? err.message : String(err);
                showError(message || 'Failed to sign in. Please try again.');

                // Reset button
                if (btnText) btnText.style.display = 'inline';
                if (btnLoader) btnLoader.classList.add('hidden');
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }

    // Handle Register
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name') ? document.getElementById('name').value.trim() : '';
            const surname = document.getElementById('surname') ? document.getElementById('surname').value.trim() : '';
            const email = document.getElementById('email') ? document.getElementById('email').value.trim() : '';
            const password = document.getElementById('password') ? document.getElementById('password').value : '';
            const role = document.getElementById('role') ? document.getElementById('role').value : '';

            if (!role) {
                showError('Please select a role');
                return;
            }

            if (password.length < 6) {
                showError('Password must be at least 6 characters long');
                return;
            }

            const submitBtn = registerForm.querySelector('button[type="submit"]');
            const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
            const btnLoader = submitBtn ? submitBtn.querySelector('.btn-loader') : null;

            try {
                // Show loading state
                if (btnText) btnText.style.display = 'none';
                if (btnLoader) btnLoader.classList.remove('hidden');
                if (submitBtn) submitBtn.disabled = true;
                hideError();

                if (typeof api === 'undefined' || !api || !api.signUp) {
                    throw new Error('API is not available');
                }

                await api.signUp(name, surname, email, password, role);

                // Success - show message and redirect
                showSuccess('Account created successfully! Redirecting to login...');

                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);

            } catch (err) {
                const message = (err && err.message) ? err.message : String(err);
                showError(message || 'Failed to create account. Please try again.');

                // Reset button
                if (btnText) btnText.style.display = 'inline';
                if (btnLoader) btnLoader.classList.add('hidden');
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }

    // Helper functions
    function showError(message) {
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.classList.remove('hidden');
            errorMessage.style.background = 'rgba(245, 87, 108, 0.1)';
            errorMessage.style.color = '#f5576c';
            errorMessage.style.border = '1px solid #f5576c';
            errorMessage.classList.add('animate-shake');

            setTimeout(() => {
                errorMessage.classList.remove('animate-shake');
            }, 500);
        } else {
            // Fallback alert
            console.error('Error:', message);
        }
    }

    function showSuccess(message) {
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.classList.remove('hidden');
            errorMessage.style.background = 'rgba(0, 242, 254, 0.1)';
            errorMessage.style.color = '#0987a0';
            errorMessage.style.border = '1px solid #00f2fe';
        } else {
            console.log('Success:', message);
        }
    }

    function hideError() {
        if (errorMessage) {
            errorMessage.classList.add('hidden');
        }
    }
});
