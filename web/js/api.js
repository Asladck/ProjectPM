// ===================================
// API Service - Backend Communication
// ===================================

const API_CONFIG = {
    AUTH_SERVICE: 'http://localhost:9090',
    ATTENDANCE_SERVICE: 'http://localhost:4061',
    ASSIGNMENT_SERVICE: 'http://localhost:4062',
    WS_SERVICE: 'ws://localhost:8085'
};

class API {
    constructor() {
        this.accessToken = localStorage.getItem('accessToken');
        this.refreshToken = localStorage.getItem('refreshToken');
    }

    // Get headers with auth token
    getHeaders(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (includeAuth && this.accessToken) {
            headers['Authorization'] = `Bearer ${this.accessToken}`;
        }

        return headers;
    }

    // Store tokens
    setTokens(accessToken, refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    }

    // Clear tokens
    clearTokens() {
        this.accessToken = null;
        this.refreshToken = null;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userInfo');
    }

    // Refresh access token
    async refreshAccessToken() {
        try {
            const response = await fetch(`${API_CONFIG.AUTH_SERVICE}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh_token: this.refreshToken })
            });

            if (!response.ok) {
                throw new Error('Failed to refresh token');
            }

            const data = await response.json();
            this.setTokens(data.access_token, data.refresh_token || this.refreshToken);
            return true;
        } catch (error) {
            console.error('Token refresh failed:', error);
            this.clearTokens();
            window.location.href = 'login.html';
            return false;
        }
    }

    // Make authenticated request with auto-retry on 401
    async request(url, options = {}) {
        try {
            let response = await fetch(url, options);

            // If unauthorized, try to refresh token
            if (response.status === 401 && this.refreshToken) {
                const refreshed = await this.refreshAccessToken();
                if (refreshed) {
                    // Retry request with new token
                    options.headers = {
                        ...options.headers,
                        'Authorization': `Bearer ${this.accessToken}`
                    };
                    response = await fetch(url, options);
                }
            }

            return response;
        } catch (error) {
            console.error('Request failed:', error);
            throw error;
        }
    }

    // ===================================
    // AUTH ENDPOINTS
    // ===================================

    async signUp(name, surname, email, password, role) {
        const response = await fetch(`${API_CONFIG.AUTH_SERVICE}/auth/sign-up`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, surname, email, password, role })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Sign up failed');
        }

        return await response.json();
    }

    async signIn(email, password, role) {
        const response = await fetch(`${API_CONFIG.AUTH_SERVICE}/auth/sign-in`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Sign in failed');
        }

        const data = await response.json();
        // Support both snake_case and camelCase tokens from backend
        const accessToken = data.access_token || data.accessToken || data.token || data.accessToken;
        const refreshToken = data.refresh_token || data.refreshToken || null;

        this.setTokens(accessToken, refreshToken);

        // Store user info with role (normalize)
        const normalizedRole = (role || data.role || '').toString().toUpperCase();
        localStorage.setItem('token', accessToken);
        localStorage.setItem('role', normalizedRole);
        localStorage.setItem('userInfo', JSON.stringify({
            email,
            role: normalizedRole
        }));

        return data;
    }

    logout() {
        this.clearTokens();
        window.location.href = 'login.html';
    }

    // ===================================
    // ATTENDANCE ENDPOINTS
    // ===================================

    async getCourse(courseId) {
        try {
            const response = await fetch(`${API_CONFIG.ATTENDANCE_SERVICE}/attendance/getCourse/${courseId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch course: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('getCourse error:', error);
            throw error;
        }
    }

    async getSession(sessionId, studentIds) {
        try {
            const params = new URLSearchParams();
            if (studentIds && studentIds.length > 0) {
                params.append('studentIds', studentIds.join(','));
            }

            const response = await fetch(`${API_CONFIG.ATTENDANCE_SERVICE}/attendance/session/${sessionId}?${params}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch session: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('getSession error:', error);
            throw error;
        }
    }

    async markAttendance(studentId, sessionId, status) {
        try {
            const response = await fetch(`${API_CONFIG.ATTENDANCE_SERVICE}/attendance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ studentId, sessionId, status })
            });

            if (!response.ok) {
                throw new Error(`Failed to mark attendance: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('markAttendance error:', error);
            throw error;
        }
    }

    // ===================================
    // ASSIGNMENT ENDPOINTS
    // ===================================

    async createAssignment(teacherId, title, description, dueDate, studentIds) {
        const response = await this.request(
            `${API_CONFIG.ASSIGNMENT_SERVICE}/uploadAssignment/create?teacherId=${teacherId}`,
            {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ title, description, dueDate, studentIds })
            }
        );

        if (!response.ok) {
            throw new Error('Failed to create assignment');
        }

        return await response.json();
    }

    async getAllAssignments() {
        try {
            const response = await fetch(`${API_CONFIG.ASSIGNMENT_SERVICE}/uploadAssignment/getAll`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch assignments: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('getAllAssignments error:', error);
            throw new Error(error.message || 'Failed to fetch assignments');
        }
    }

    async submitAssignment(studentId, assignmentId, file) {
        const formData = new FormData();
        formData.append('studentId', studentId);
        formData.append('assignmentId', assignmentId);
        formData.append('file', file);

        const response = await this.request(
            `${API_CONFIG.ASSIGNMENT_SERVICE}/submit/assignment`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                },
                body: formData
            }
        );

        if (!response.ok) {
            throw new Error('Failed to submit assignment');
        }

        return await response.json();
    }

    // ===================================
    // WEBSOCKET CONNECTION
    // ===================================

    createWebSocket() {
        // Prefer instance token, fallback to storage keys for compatibility
        const token = this.accessToken || localStorage.getItem('accessToken') || localStorage.getItem('token');
        if (!token) {
            console.error('No access token available');
            return null;
        }

        return new WebSocket(`${API_CONFIG.WS_SERVICE}/ws?token=${token}`);
    }
}

// Export singleton instance
const api = new API();

// Backwards-compatible globals for older code that expects `api` or `auth`
window.api = api;
window.auth = {
    signIn: api.signIn.bind(api),
    signUp: api.signUp.bind(api),
    logout: api.logout.bind(api),
    createWebSocket: api.createWebSocket.bind(api)
};

// Log successful API initialization
console.log('API module loaded successfully', {
    hasAccessToken: !!api.accessToken,
    hasRefreshToken: !!api.refreshToken,
    currentPath: window.location.pathname
});
