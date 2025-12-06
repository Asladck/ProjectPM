// ===================================
// Chat Logic with WebSocket
// ===================================

let ws = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 3000;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize user info
    loadUserInfo();
    setupLogout();

    // Connect to WebSocket
    connectWebSocket();

    // Setup message form
    setupMessageForm();

    // Setup character counter
    setupCharCounter();
});

function loadUserInfo() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const userName = document.getElementById('userName');
    const userRole = document.getElementById('userRole');

    if (userName) {
        userName.textContent = userInfo.email?.split('@')[0] || 'User';
    }

    if (userRole) {
        userRole.textContent = userInfo.role || '';
    }
}

function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                if (ws) {
                    ws.close();
                }
                api.logout();
            }
        });
    }
}

function connectWebSocket() {
    try {
        updateConnectionStatus('connecting', 'Connecting...');

        ws = api.createWebSocket();

        if (!ws) {
            updateConnectionStatus('disconnected', 'Failed to connect');
            return;
        }

        ws.onopen = () => {
            console.log('WebSocket connected');
            updateConnectionStatus('connected', 'Connected');
            reconnectAttempts = 0;
            enableMessageInput();
        };

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                displayMessage(message);
            } catch (error) {
                console.error('Failed to parse message:', error);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            updateConnectionStatus('disconnected', 'Connection error');
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
            updateConnectionStatus('disconnected', 'Disconnected');
            disableMessageInput();

            // Attempt to reconnect
            if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                reconnectAttempts++;
                console.log(`Reconnecting... Attempt ${reconnectAttempts}`);
                setTimeout(connectWebSocket, RECONNECT_DELAY);
            } else {
                updateConnectionStatus('disconnected', 'Failed to connect. Please refresh.');
            }
        };

    } catch (error) {
        console.error('Failed to create WebSocket:', error);
        updateConnectionStatus('disconnected', 'Connection failed');
    }
}

function updateConnectionStatus(status, text) {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-text');

    if (statusDot) {
        statusDot.className = `status-dot ${status}`;
    }

    if (statusText) {
        statusText.textContent = text;
    }
}

function enableMessageInput() {
    const input = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');

    if (input) input.disabled = false;
    if (sendBtn) sendBtn.disabled = false;
}

function disableMessageInput() {
    const input = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');

    if (input) input.disabled = true;
    if (sendBtn) sendBtn.disabled = true;
}

function setupMessageForm() {
    const form = document.getElementById('chatForm');
    const input = document.getElementById('messageInput');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            sendMessage();
        });
    }

    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
}

function setupCharCounter() {
    const input = document.getElementById('messageInput');
    const counter = document.getElementById('charCount');

    if (input && counter) {
        input.addEventListener('input', () => {
            counter.textContent = input.value.length;

            if (input.value.length > 450) {
                counter.style.color = 'var(--danger)';
            } else {
                counter.style.color = '';
            }
        });
    }
}

function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();

    if (!text || !ws || ws.readyState !== WebSocket.OPEN) {
        return;
    }

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

    const message = {
        text: text,
        username: userInfo.email?.split('@')[0] || 'Anonymous',
        time: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        }),
        isMyMessage: true
    };

    try {
        ws.send(JSON.stringify(message));

        // Display own message immediately
        displayMessage(message);

        // Clear input
        input.value = '';
        document.getElementById('charCount').textContent = '0';

    } catch (error) {
        console.error('Failed to send message:', error);
        alert('Failed to send message. Please try again.');
    }
}

function displayMessage(message) {
    const messagesContainer = document.getElementById('chatMessages');
    const welcome = messagesContainer.querySelector('.chat-welcome');

    // Remove welcome message if exists
    if (welcome) {
        welcome.remove();
    }

    const isMyMessage = message.isMyMessage === true;
    const username = escapeHtml(message.username || 'Anonymous');
    const text = escapeHtml(message.text || '');
    const time = escapeHtml(message.time || '');

    const messageElement = document.createElement('div');
    messageElement.className = `message ${isMyMessage ? 'my-message' : ''}`;
    messageElement.innerHTML = `
        <div class="message-avatar">
            ${getInitials(username)}
        </div>
        <div class="message-content">
            <div class="message-header">
                <span class="message-username">${isMyMessage ? 'You' : username}</span>
                <span class="message-time">${time}</span>
            </div>
            <div class="message-bubble">
                ${text}
            </div>
        </div>
    `;

    messagesContainer.appendChild(messageElement);

    // Scroll to bottom
    scrollToBottom();
}

function scrollToBottom() {
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function getInitials(name) {
    if (!name) return '?';

    const parts = name.split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (ws) {
        ws.close();
    }
});

