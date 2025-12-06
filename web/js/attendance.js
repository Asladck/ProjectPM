// ===================================
// Attendance Logic
// ===================================

let currentCourse = null;
let currentSession = null;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize user info
    loadUserInfo();
    setupLogout();

    // Setup controls
    setupControls();

    // Load sample courses (in real app, this would come from API)
    loadCourses();
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

function setupControls() {
    const courseSelect = document.getElementById('courseSelect');
    const sessionSelect = document.getElementById('sessionSelect');
    const loadBtn = document.getElementById('loadAttendanceBtn');

    if (courseSelect) {
        courseSelect.addEventListener('change', async (e) => {
            const courseId = e.target.value;

            if (courseId) {
                sessionSelect.disabled = false;
                await loadSessions(courseId);
                await loadCourseInfo(courseId);
            } else {
                sessionSelect.disabled = true;
                sessionSelect.innerHTML = '<option value="">Choose a session...</option>';
                loadBtn.disabled = true;
                hideCourseInfo();
            }
        });
    }

    if (sessionSelect) {
        sessionSelect.addEventListener('change', (e) => {
            loadBtn.disabled = !e.target.value;
        });
    }

    if (loadBtn) {
        loadBtn.addEventListener('click', loadAttendance);
    }

    // Setup mark attendance form
    const markForm = document.getElementById('markAttendanceForm');
    if (markForm) {
        markForm.addEventListener('submit', handleMarkAttendance);
    }
}

function loadCourses() {
    const courseSelect = document.getElementById('courseSelect');

    // Sample courses - in real app, fetch from API
    const courses = [
        { id: '1', name: 'Database Systems', code: 'CS301' },
        { id: '2', name: 'Web Development', code: 'CS401' },
        { id: '3', name: 'Software Engineering', code: 'CS402' },
        { id: '4', name: 'Data Structures', code: 'CS201' }
    ];

    courseSelect.innerHTML = '<option value="">Choose a course...</option>' +
        courses.map(course => `
            <option value="${course.id}">${course.code} - ${course.name}</option>
        `).join('');
}

async function loadCourseInfo(courseId) {
    try {
        const course = await api.getCourse(courseId);

        currentCourse = course;
        displayCourseInfo(course);

    } catch (error) {
        console.error('Failed to load course info:', error);

        // Fallback to sample data
        displayCourseInfo({
            name: 'Database Systems',
            code: 'CS301',
            instructor: 'Dr. John Smith',
            schedule: 'Mon, Wed, Fri 10:00-11:30'
        });
    }
}

function displayCourseInfo(course) {
    const courseInfoCard = document.getElementById('courseInfo');
    const courseName = document.getElementById('courseName');
    const courseCode = document.getElementById('courseCode');
    const courseInstructor = document.getElementById('courseInstructor');
    const courseSchedule = document.getElementById('courseSchedule');
    const totalSessions = document.getElementById('totalSessions');

    if (courseInfoCard) courseInfoCard.classList.remove('hidden');
    if (courseName) courseName.textContent = course.name || 'Course Name';
    if (courseCode) courseCode.textContent = course.code || 'CODE';
    if (courseInstructor) courseInstructor.textContent = course.instructor || 'N/A';
    if (courseSchedule) courseSchedule.textContent = course.schedule || 'N/A';
    if (totalSessions) totalSessions.textContent = course.totalSessions || '0';
}

function hideCourseInfo() {
    const courseInfoCard = document.getElementById('courseInfo');
    if (courseInfoCard) courseInfoCard.classList.add('hidden');
}

async function loadSessions(courseId) {
    const sessionSelect = document.getElementById('sessionSelect');

    // Sample sessions - in real app, fetch from API
    const sessions = [
        { id: 'session-1', name: 'Lecture 1 - Introduction', date: '2025-12-01' },
        { id: 'session-2', name: 'Lecture 2 - SQL Basics', date: '2025-12-03' },
        { id: 'session-3', name: 'Lecture 3 - Advanced Queries', date: '2025-12-05' },
        { id: 'session-4', name: 'Lab Session 1', date: '2025-12-08' }
    ];

    sessionSelect.innerHTML = '<option value="">Choose a session...</option>' +
        sessions.map(session => `
            <option value="${session.id}">${session.name} (${session.date})</option>
        `).join('');
}

async function loadAttendance() {
    const sessionId = document.getElementById('sessionSelect').value;

    if (!sessionId) return;

    const attendanceSection = document.getElementById('attendanceSection');
    const loadingState = document.getElementById('loadingState');
    const tableBody = document.getElementById('attendanceTableBody');

    try {
        loadingState.innerHTML = '<div class="loading">Loading attendance records...</div>';
        attendanceSection.classList.add('hidden');

        // Sample student IDs
        const studentIds = ['student-1', 'student-2', 'student-3'];

        const attendance = await api.getSession(sessionId, studentIds);

        currentSession = sessionId;
        displayAttendance(attendance);

    } catch (error) {
        console.error('Failed to load attendance:', error);

        // Fallback to sample data
        displayAttendance([
            { studentId: 'student-1', status: 'PRESENT', time: '10:05 AM' },
            { studentId: 'student-2', status: 'LATE', time: '10:15 AM' },
            { studentId: 'student-3', status: 'ABSENT', time: '-' }
        ]);
    }
}

function displayAttendance(records) {
    const attendanceSection = document.getElementById('attendanceSection');
    const loadingState = document.getElementById('loadingState');
    const tableBody = document.getElementById('attendanceTableBody');

    loadingState.classList.add('hidden');
    attendanceSection.classList.remove('hidden');

    if (!Array.isArray(records) || records.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state">No attendance records found</td>
            </tr>
        `;
        updateSummary(0, 0, 0);
        return;
    }

    // Count statuses
    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;

    records.forEach(record => {
        const status = record.status?.toUpperCase();
        if (status === 'PRESENT') presentCount++;
        else if (status === 'ABSENT') absentCount++;
        else if (status === 'LATE') lateCount++;
    });

    updateSummary(presentCount, absentCount, lateCount);

    tableBody.innerHTML = records.map(record => `
        <tr class="animate-fade-in">
            <td>${escapeHtml(record.studentId || 'Unknown')}</td>
            <td>
                <span class="status-badge ${(record.status || 'absent').toLowerCase()}">
                    ${record.status || 'ABSENT'}
                </span>
            </td>
            <td>${escapeHtml(record.time || '-')}</td>
            <td>
                <button class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.875rem;" 
                        onclick="editAttendance('${record.studentId}')">
                    Edit
                </button>
            </td>
        </tr>
    `).join('');
}

function updateSummary(present, absent, late) {
    const presentCount = document.getElementById('presentCount');
    const absentCount = document.getElementById('absentCount');
    const lateCount = document.getElementById('lateCount');

    if (presentCount) presentCount.textContent = present;
    if (absentCount) absentCount.textContent = absent;
    if (lateCount) lateCount.textContent = late;
}

async function handleMarkAttendance(e) {
    e.preventDefault();

    const studentId = document.getElementById('studentId').value;
    const status = document.querySelector('input[name="status"]:checked').value;
    const sessionId = currentSession;

    if (!sessionId) {
        alert('Please select a session first');
        return;
    }

    const submitBtn = e.target.querySelector('button[type="submit"]');

    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Marking...';

        await api.markAttendance(studentId, sessionId, status);

        alert('Attendance marked successfully!');

        // Reload attendance
        await loadAttendance();

        // Reset form
        document.getElementById('studentId').value = '';
        document.querySelector('input[name="status"][value="PRESENT"]').checked = true;

    } catch (error) {
        console.error('Failed to mark attendance:', error);
        alert('Failed to mark attendance: ' + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Mark Attendance';
    }
}

function editAttendance(studentId) {
    // Implement edit functionality
    console.log('Edit attendance for:', studentId);
    alert('Edit attendance - coming soon!');
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

