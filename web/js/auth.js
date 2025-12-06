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

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;

            if (!role) {
                showError('Please select a role');
                return;
            }

            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoader = submitBtn.querySelector('.btn-loader');

            try {
                // Show loading state
                btnText.style.display = 'none';
                btnLoader.classList.remove('hidden');
                submitBtn.disabled = true;
                hideError();

                await api.signIn(email, password, role);

                // Success - redirect to dashboard
                window.location.href = '/dashboard';

            } catch (error) {
                showError(error.message || 'Failed to sign in. Please try again.');

                // Reset button
                btnText.style.display = 'inline';
                btnLoader.classList.add('hidden');
                submitBtn.disabled = false;
            }
        });
    }

    // Handle Register
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const surname = document.getElementById('surname').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;

            if (!role) {
                showError('Please select a role');
                return;
            }

            if (password.length < 6) {
                showError('Password must be at least 6 characters long');
                return;
            }

            const submitBtn = registerForm.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoader = submitBtn.querySelector('.btn-loader');

            try {
                // Show loading state
                btnText.style.display = 'none';
                btnLoader.classList.remove('hidden');
                submitBtn.disabled = true;
                hideError();

                await api.signUp(name, surname, email, password, role);

                // Success - show message and redirect
                showSuccess('Account created successfully! Redirecting to login...');

                setTimeout(() => {
                    window.location.href = '/sign-in';
                }, 2000);

            } catch (error) {
                showError(error.message || 'Failed to create account. Please try again.');

                // Reset button
                btnText.style.display = 'inline';
                btnLoader.classList.add('hidden');
                submitBtn.disabled = false;
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
        }
    }

    function showSuccess(message) {
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.classList.remove('hidden');
            errorMessage.style.background = 'rgba(0, 242, 254, 0.1)';
            errorMessage.style.color = '#0987a0';
            errorMessage.style.border = '1px solid #00f2fe';
        }
    }

    function hideError() {
        if (errorMessage) {
            errorMessage.classList.add('hidden');
        }
    }
});

