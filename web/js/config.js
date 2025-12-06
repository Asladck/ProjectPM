/* ===================================
   Configuration & Environment Variables
   =================================== */

// You can customize these values based on your environment
const CONFIG = {
    // Backend service URLs
    AUTH_SERVICE: 'http://localhost:9090',
    ATTENDANCE_SERVICE: 'http://localhost:4061',
    ASSIGNMENT_SERVICE: 'http://localhost:4062',
    WS_SERVICE: 'ws://localhost:8085',

    // API Configuration
    REQUEST_TIMEOUT: 30000, // 30 seconds
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB

    // WebSocket Configuration
    WS_RECONNECT_ATTEMPTS: 5,
    WS_RECONNECT_DELAY: 3000, // 3 seconds

    // UI Configuration
    ANIMATION_DURATION: 300,
    ITEMS_PER_PAGE: 10,

    // Supported file types for assignments
    ALLOWED_FILE_TYPES: ['.pdf', '.doc', '.docx'],

    // Feature flags
    FEATURES: {
        CHAT_ENABLED: true,
        NOTIFICATIONS_ENABLED: false,
        DARK_MODE_ENABLED: false
    }
};

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.APP_CONFIG = CONFIG;
}

