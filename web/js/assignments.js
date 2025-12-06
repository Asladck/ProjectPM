// ===================================
// Assignments Logic
// ===================================

// Check if api is loaded
if (typeof api === 'undefined') {
    console.error('API not loaded! Make sure api.js is included before assignments.js');
    alert('ERROR: API not loaded. Please check console.');
}

let currentFilter = 'all';
let allAssignments = [];

document.addEventListener('DOMContentLoaded', async () => {
    // Double check api is available
    if (typeof api === 'undefined') {
        console.error('API still not loaded in DOMContentLoaded');
        const container = document.getElementById('assignmentsList');
        if (container) {
            container.innerHTML = `
                <div class="error-state" style="text-align: center; padding: 3rem;">
                    <h3 style="color: red;">ERROR: API Module Not Loaded</h3>
                    <p>Please check browser console and ensure api.js is loading correctly.</p>
                    <p>Try refreshing the page or clearing cache (Ctrl+Shift+R)</p>
                </div>
            `;
        }
        return;
    }

    // Initialize user info
    loadUserInfo();
    setupLogout();

    // Check user role and show create button for teachers
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const createBtn = document.getElementById('createAssignmentBtn');
    
    if (userInfo.role === 'teacher' && createBtn) {
        createBtn.style.display = 'inline-flex';
        setupCreateAssignment();
    }

    // Setup filters
    setupFilters();

    // Load assignments
    await loadAssignments();
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
                api.logout();
            }
        });
    }
}

function setupFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update filter
            currentFilter = tab.dataset.filter;
            renderAssignments();
        });
    });
}

async function loadAssignments() {
    const container = document.getElementById('assignmentsList');
    
    try {
        container.innerHTML = '<div class="loading">Loading assignments...</div>';
        
        allAssignments = await api.getAllAssignments();
        
        renderAssignments();

    } catch (error) {
        console.error('Failed to load assignments:', error);
        container.innerHTML = `
            <div class="error-state" style="text-align: center; padding: 3rem; background: var(--glass-bg); backdrop-filter: blur(10px); border-radius: 1rem; border: 1px solid var(--glass-border);">
                <h3 style="color: var(--danger); margin-bottom: 0.5rem;">Failed to Load Assignments</h3>
                <p style="color: var(--text-secondary); margin-bottom: 1rem;">${error.message}</p>
                <button class="btn btn-primary" onclick="loadAssignments()">Try Again</button>
            </div>
        `;
    }
}

function renderAssignments() {
    const container = document.getElementById('assignmentsList');
    
    if (!Array.isArray(allAssignments) || allAssignments.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 3rem; background: var(--glass-bg); backdrop-filter: blur(10px); border-radius: 1rem; border: 1px solid var(--glass-border);">
                <div style="font-size: 4rem; margin-bottom: 1rem;">📚</div>
                <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">No Assignments Yet</h3>
                <p style="color: var(--text-secondary);">Assignments will appear here once they are created</p>
            </div>
        `;
        return;
    }

    // Filter assignments
    const filtered = filterAssignments(allAssignments);

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 3rem; background: var(--glass-bg); backdrop-filter: blur(10px); border-radius: 1rem; border: 1px solid var(--glass-border);">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🔍</div>
                <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">No ${currentFilter} Assignments</h3>
                <p style="color: var(--text-secondary);">Try selecting a different filter</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map((assignment, index) => `
        <div class="assignment-card animate-fade-in stagger-item" style="animation-delay: ${index * 0.1}s;">
            <div class="assignment-header">
                <div style="flex: 1;">
                    <h3 class="assignment-title">${escapeHtml(assignment.title || 'Untitled Assignment')}</h3>
                    <p class="assignment-description">${escapeHtml(assignment.description || 'No description provided')}</p>
                </div>
                <span class="assignment-status status-${getAssignmentStatus(assignment.dueDate).toLowerCase()}">${getAssignmentStatus(assignment.dueDate)}</span>
            </div>

            <div class="assignment-meta">
                <div class="meta-item">
                    📅 Due: ${formatDate(assignment.dueDate)}
                </div>
                <div class="meta-item">
                    👥 ${assignment.studentIds?.length || 0} students
                </div>
            </div>

            <div class="assignment-actions">
                <button class="btn btn-primary" onclick="openSubmitModal('${assignment.id || ''}')">
                    Submit Assignment
                </button>
                <button class="btn btn-secondary" onclick="viewAssignment('${assignment.id || ''}')">
                    View Details
                </button>
            </div>
        </div>
    `).join('');
}

function filterAssignments(assignments) {
    if (currentFilter === 'all') {
        return assignments;
    }

    return assignments.filter(assignment => {
        const status = getAssignmentStatus(assignment.dueDate).toLowerCase();
        return status === currentFilter;
    });
}

function getAssignmentStatus(dueDate) {
    if (!dueDate) return 'Pending';
    
    const due = new Date(dueDate);
    const now = new Date();
    
    if (due < now) {
        return 'Late';
    }
    
    // You would need to check if it's actually submitted
    // For now, we'll just mark as pending
    return 'Pending';
}

function formatDate(dateString) {
    if (!dateString) return 'No date';
    
    const date = new Date(dateString);
    return date.toLocaleString();
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===================================
// Submit Assignment Modal
// ===================================

function openSubmitModal(assignmentId) {
    const modal = document.getElementById('submitAssignmentModal');
    document.getElementById('submitAssignmentId').value = assignmentId;
    modal.classList.remove('hidden');
}

function closeSubmitModal() {
    const modal = document.getElementById('submitAssignmentModal');
    modal.classList.add('hidden');
    document.getElementById('submitAssignmentForm').reset();
    hideFileSelected();
}

// Setup submit modal
document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.getElementById('closeSubmitModal');
    const cancelBtn = document.getElementById('cancelSubmit');
    const overlay = document.querySelector('#submitAssignmentModal .modal-overlay');

    if (closeBtn) closeBtn.addEventListener('click', closeSubmitModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeSubmitModal);
    if (overlay) overlay.addEventListener('click', closeSubmitModal);

    // File upload
    setupFileUpload();

    // Submit form
    const submitForm = document.getElementById('submitAssignmentForm');
    if (submitForm) {
        submitForm.addEventListener('submit', handleSubmitAssignment);
    }
});

function setupFileUpload() {
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileInput = document.getElementById('assignmentFile');

    if (fileUploadArea && fileInput) {
        fileUploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                showFileSelected(file);
            }
        });

        // Drag and drop
        fileUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUploadArea.style.borderColor = 'var(--primary)';
        });

        fileUploadArea.addEventListener('dragleave', () => {
            fileUploadArea.style.borderColor = '';
        });

        fileUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUploadArea.style.borderColor = '';
            
            const file = e.dataTransfer.files[0];
            if (file) {
                fileInput.files = e.dataTransfer.files;
                showFileSelected(file);
            }
        });
    }

    const fileRemove = document.querySelector('.file-remove');
    if (fileRemove) {
        fileRemove.addEventListener('click', (e) => {
            e.stopPropagation();
            hideFileSelected();
            fileInput.value = '';
        });
    }
}

function showFileSelected(file) {
    const placeholder = document.querySelector('.file-upload-placeholder');
    const selected = document.getElementById('fileSelected');
    const fileName = selected.querySelector('.file-name');

    if (placeholder) placeholder.classList.add('hidden');
    if (selected) {
        selected.classList.remove('hidden');
        fileName.textContent = file.name;
    }
}

function hideFileSelected() {
    const placeholder = document.querySelector('.file-upload-placeholder');
    const selected = document.getElementById('fileSelected');

    if (placeholder) placeholder.classList.remove('hidden');
    if (selected) selected.classList.add('hidden');
}

async function handleSubmitAssignment(e) {
    e.preventDefault();

    const studentId = document.getElementById('submitStudentId').value;
    const assignmentId = document.getElementById('submitAssignmentId').value;
    const fileInput = document.getElementById('assignmentFile');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a file to upload');
        return;
    }

    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        await api.submitAssignment(studentId, assignmentId, file);

        alert('Assignment submitted successfully!');
        closeSubmitModal();
        await loadAssignments();

    } catch (error) {
        console.error('Failed to submit assignment:', error);
        alert('Failed to submit assignment: ' + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit';
    }
}

// ===================================
// Create Assignment Modal (Teacher)
// ===================================

function setupCreateAssignment() {
    const createBtn = document.getElementById('createAssignmentBtn');
    const modal = document.getElementById('createAssignmentModal');
    const closeBtn = document.getElementById('closeCreateModal');
    const cancelBtn = document.getElementById('cancelCreate');
    const overlay = document.querySelector('#createAssignmentModal .modal-overlay');

    if (createBtn) {
        createBtn.addEventListener('click', () => {
            modal.classList.remove('hidden');
        });
    }

    const closeModal = () => {
        modal.classList.add('hidden');
        document.getElementById('createAssignmentForm').reset();
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);

    // Handle form submit
    const form = document.getElementById('createAssignmentForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const title = document.getElementById('assignmentTitle').value;
            const description = document.getElementById('assignmentDescription').value;
            const dueDate = document.getElementById('assignmentDueDate').value;
            const studentIdsText = document.getElementById('studentIds').value;

            const studentIds = studentIdsText
                .split(',')
                .map(id => id.trim())
                .filter(id => id.length > 0);

            const submitBtn = e.target.querySelector('button[type="submit"]');

            try {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Creating...';

                // You'll need to get teacher ID from somewhere
                const teacherId = 'teacher-uuid-here';

                await api.createAssignment(teacherId, title, description, dueDate, studentIds);

                alert('Assignment created successfully!');
                closeModal();
                await loadAssignments();

            } catch (error) {
                console.error('Failed to create assignment:', error);
                alert('Failed to create assignment: ' + error.message);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Create Assignment';
            }
        });
    }
}

function viewAssignment(assignmentId) {
    // Implement view details functionality
    console.log('View assignment:', assignmentId);
    alert('View assignment details - coming soon!');
}

