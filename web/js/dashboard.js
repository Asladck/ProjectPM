// ===================================
// Dashboard Logic
// ===================================

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize user info
    loadUserInfo();

    // Setup logout
    setupLogout();

    // Load dashboard data
    await loadDashboardData();
});

function loadUserInfo() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const userName = document.getElementById('userName');
    const userRole = document.getElementById('userRole');
    const welcomeName = document.getElementById('welcomeName');

    if (userName) {
        userName.textContent = userInfo.email?.split('@')[0] || 'User';
    }

    if (userRole) {
        userRole.textContent = userInfo.role || '';
    }

    if (welcomeName) {
        welcomeName.textContent = userInfo.email?.split('@')[0] || 'Student';
    }
}

function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                api.logout();
            }
        });
    }
}

async function loadDashboardData() {
    try {
        // Load assignments count
        await loadAssignmentsCount();

        // Load recent assignments
        await loadRecentAssignments();

    } catch (error) {
        console.error('Failed to load dashboard data:', error);
    }
}

async function loadAssignmentsCount() {
    try {
        const assignments = await api.getAllAssignments();
        const assignmentsCount = document.getElementById('assignmentsCount');

        if (assignmentsCount && Array.isArray(assignments)) {
            assignmentsCount.textContent = assignments.length;

            // Animate count
            animateValue(assignmentsCount, 0, assignments.length, 1000);
        }
    } catch (error) {
        console.error('Failed to load assignments count:', error);
    }
}

async function loadRecentAssignments() {
    const recentAssignmentsContainer = document.getElementById('recentAssignments');

    if (!recentAssignmentsContainer) return;

    try {
        const assignments = await api.getAllAssignments();

        if (!Array.isArray(assignments) || assignments.length === 0) {
            recentAssignmentsContainer.innerHTML = `
                <div class="empty-state" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    <p>No assignments yet</p>
                </div>
            `;
            return;
        }

        // Show only recent 3 assignments
        const recentAssignments = assignments.slice(0, 3);

        recentAssignmentsContainer.innerHTML = recentAssignments.map((assignment, index) => `
            <div class="assignment-item stagger-item" style="animation-delay: ${index * 0.1}s;">
                <div style="display: flex; justify-content: space-between; align-items: start; padding: 1rem; background: white; border-radius: 0.75rem; margin-bottom: 0.75rem; transition: all 0.3s;">
                    <div style="flex: 1;">
                        <h4 style="color: var(--text-primary); margin-bottom: 0.25rem;">${escapeHtml(assignment.title || 'Untitled')}</h4>
                        <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.5rem;">${escapeHtml(assignment.description || '').substring(0, 100)}${assignment.description?.length > 100 ? '...' : ''}</p>
                        <div style="display: flex; gap: 1rem; font-size: 0.875rem; color: var(--text-secondary);">
                            <span>📅 ${formatDate(assignment.dueDate)}</span>
                        </div>
                    </div>
                    <span class="assignment-status status-${getAssignmentStatus(assignment.dueDate).toLowerCase()}">${getAssignmentStatus(assignment.dueDate)}</span>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Failed to load recent assignments:', error);
        recentAssignmentsContainer.innerHTML = `
            <div class="error-state" style="text-align: center; padding: 2rem; color: var(--danger);">
                <p>Failed to load assignments</p>
            </div>
        `;
    }
}

function getAssignmentStatus(dueDate) {
    if (!dueDate) return 'Pending';

    const due = new Date(dueDate);
    const now = new Date();

    if (due < now) {
        return 'Late';
    }

    return 'Pending';
}

function formatDate(dateString) {
    if (!dateString) return 'No date';

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return 'Overdue';
    } else if (diffDays === 0) {
        return 'Due today';
    } else if (diffDays === 1) {
        return 'Due tomorrow';
    } else if (diffDays < 7) {
        return `Due in ${diffDays} days`;
    } else {
        return date.toLocaleDateString();
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Set default values for stats
document.addEventListener('DOMContentLoaded', () => {
    const attendanceRate = document.getElementById('attendanceRate');
    const messagesCount = document.getElementById('messagesCount');
    const coursesCount = document.getElementById('coursesCount');

    if (attendanceRate) attendanceRate.textContent = '95%';
    if (messagesCount) animateValue(messagesCount, 0, 24, 1000);
    if (coursesCount) animateValue(coursesCount, 0, 5, 1000);
});

