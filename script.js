// Initialize Lucide icons
lucide.createIcons();

// State management
let issues = JSON.parse(localStorage.getItem('issues') || '[]');
let isAuthenticated = false;

// Navigation functions
function showPage(pageId) {
    // Only check authentication for issues page
    if (pageId === 'issues' && !isAuthenticated) {
        handleActionsClick();
        return;
    }

    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.textContent.toLowerCase().includes(pageId)) {
            link.style.color = '#f97316';
            link.style.background = '#fff7ed';
        } else {
            link.style.color = '#6b7280';
            link.style.background = 'transparent';
        }
    });
}

// Landing page handlers
function handleUserClick() {
    document.getElementById('landingPage').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    showPage('home');
}

function handleActionsClick() {
    document.getElementById('passwordModal').classList.remove('hidden');
}

// Password modal handlers
function closePasswordModal() {
    document.getElementById('passwordModal').classList.add('hidden');
    document.getElementById('passwordInput').value = '';
    document.getElementById('passwordError').classList.add('hidden');
}

function handlePasswordSubmit() {
    const password = document.getElementById('passwordInput').value;
    if (password === 'Woman') {
        isAuthenticated = true;
        closePasswordModal();
        document.getElementById('landingPage').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
        showPage('issues');
    } else {
        document.getElementById('passwordError').classList.remove('hidden');
    }
}

// Form submission handlers
function handleComplaintSubmit(event) {
    event.preventDefault();
    const content = document.getElementById('complaintText').value;
    addIssue({
        type: 'complaint',
        content: content,
        resolved: false
    });
    event.target.reset();
    if (isAuthenticated) {
        showPage('issues');
    } else {
        alert('Complaint submitted successfully!');
        showPage('home');
    }
}

function handleEmergencySubmit(event) {
    event.preventDefault();
    const phone = document.getElementById('emergencyPhone').value;
    addIssue({
        type: 'emergency',
        content: `Emergency Contact: ${phone}`,
        resolved: false
    });
    event.target.reset();
    if (isAuthenticated) {
        showPage('issues');
    } else {
        alert('Emergency contact submitted successfully!');
        showPage('home');
    }
}

function handleCyberSubmit(event) {
    event.preventDefault();
    const phone = document.getElementById('cyberPhone').value;
    const problem = document.getElementById('cyberProblem').value;
    addIssue({
        type: 'cyber',
        content: `Contact: ${phone}\nProblem: ${problem}`,
        resolved: false
    });
    event.target.reset();
    if (isAuthenticated) {
        showPage('issues');
    } else {
        alert('Cyber security issue submitted successfully!');
        showPage('home');
    }
}

// SOS button handler
function handleSOSClick() {
    const alertMessage = document.getElementById('alertMessage');
    alertMessage.classList.remove('hidden');

    // Create new emergency issue
    const newIssue = {
        type: 'emergency',
        content: 'SOS Emergency Alert Triggered',
        resolved: false,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString()
    };

    // Get existing issues and add new one
    const existingIssues = JSON.parse(localStorage.getItem('issues') || '[]');
    const updatedIssues = [...existingIssues, newIssue];
    localStorage.setItem('issues', JSON.stringify(updatedIssues));

    // Show alert and redirect
    alert('Emergency alert has been raised. Help is on the way.');

    // Redirect to issues page after a delay
    setTimeout(() => {
        if (isAuthenticated) {
            showPage('issues');
        } else {
            handleActionsClick(); // Show password modal
        }
    }, 2000);
}

// Issue management
function addIssue(issue) {
    const newIssue = {
        ...issue,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString()
    };
    issues.push(newIssue);
    localStorage.setItem('issues', JSON.stringify(issues));
    renderIssues();
}

function toggleResolution(id) {
    issues = issues.map(issue =>
        issue.id === id ? { ...issue, resolved: !issue.resolved } : issue
    );
    localStorage.setItem('issues', JSON.stringify(issues));
    renderIssues();
}

function renderIssues() {
    const issuesList = document.getElementById('issuesList');
    issuesList.innerHTML = '';

    if (issues.length === 0) {
        issuesList.innerHTML = `
            <div class="text-center py-12" style="color: #6b7280;">
                No issues have been raised yet.
            </div>
        `;
        return;
    }

    issues.forEach(issue => {
        const card = document.createElement('div');
        card.className = 'issue-card';
        card.innerHTML = `
            <div class="issue-header">
                <div>
                    <span class="issue-type ${issue.type}">
                        ${issue.type.charAt(0).toUpperCase() + issue.type.slice(1)}
                    </span>
                    <p class="issue-content">${issue.content}</p>
                    <p class="issue-timestamp">
                        ${new Date(issue.timestamp).toLocaleString()}
                    </p>
                </div>
                <button class="resolution-btn" onclick="toggleResolution('${issue.id}')">
                    <i data-lucide="${issue.resolved ? 'check-circle' : 'x-circle'}" 
                       class="${issue.resolved ? 'text-green-500' : 'text-gray-400'}">
                    </i>
                </button>
            </div>
        `;
        issuesList.appendChild(card);
    });

    // Reinitialize Lucide icons for dynamically added content
    lucide.createIcons();
}

// Handle page refresh
window.addEventListener('load', () => {
    // Show landing page on refresh
    document.getElementById('landingPage').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('hidden');
    
    // Reset authentication
    isAuthenticated = false;
    
    // Render existing issues
    renderIssues();
});