// Employee Data (Single Employee)
const employee = {
    id: 1,
    name: "Employee 1",
    status: "UA", // Initial status
    checkInTime: null,
    checkOutTime: null,
    isCheckedIn: false,
    todayHours: 0,
    breakTime: 0.5
};

// Weekly activity data
const weeklyActivity = [
    { date: "Today", checkIn: "--:--", checkOut: "--:--", hours: 0.0, status: "Pending" },
    { date: "Yesterday", checkIn: "09:15", checkOut: "18:30", hours: 8.5, status: "Present" },
    { date: "Dec 12", checkIn: "09:10", checkOut: "18:20", hours: 8.2, status: "Present" },
    { date: "Dec 11", checkIn: "09:05", checkOut: "17:45", hours: 7.7, status: "Present" },
    { date: "Dec 10", checkIn: "--:--", checkOut: "--:--", hours: 0.0, status: "Absent" }
];

// DOM Elements
const currentTimeElement = document.getElementById('current-time');
const currentDateElement = document.getElementById('current-date');
const checkInBtn = document.getElementById('check-in-btn');
const checkOutBtn = document.getElementById('check-out-btn');
const helpBtn = document.getElementById('help-btn');
const reportBtn = document.getElementById('report-btn');
const supportBtn = document.getElementById('support-btn');
const closeHelpBtn = document.getElementById('close-help-btn');
const helpModal = document.getElementById('help-modal');

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Set current year
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Update time every second
    updateTime();
    setInterval(updateTime, 1000);
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize display
    updateDisplay();
    populateWeeklyActivity();
    
    // Check if already checked in today (from localStorage)
    checkSavedAttendance();
});

// Setup all event listeners
function setupEventListeners() {
    checkInBtn.addEventListener('click', handleCheckIn);
    checkOutBtn.addEventListener('click', handleCheckOut);
    helpBtn.addEventListener('click', showHelpModal);
    reportBtn.addEventListener('click', showReportIssue);
    supportBtn.addEventListener('click', contactSupport);
    closeHelpBtn.addEventListener('click', closeHelpModal);
    
    // Close modal when clicking outside
    helpModal.addEventListener('click', function(e) {
        if (e.target === helpModal) {
            closeHelpModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !helpModal.classList.contains('hidden')) {
            closeHelpModal();
        }
    });
}

// Check saved attendance from localStorage
function checkSavedAttendance() {
    const savedCheckIn = localStorage.getItem('employee_checkInTime');
    if (savedCheckIn) {
        employee.checkInTime = new Date(savedCheckIn);
        employee.isCheckedIn = true;
        employee.status = "Present";
        updateDisplay();
        showToast("Welcome back! You're already checked in today.", "info");
    }
}

// Update current time
function updateTime() {
    const now = new Date();
    
    // Format time
    const timeString = now.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false 
    });
    
    // Format date
    const dateString = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    currentTimeElement.textContent = timeString;
    currentDateElement.textContent = dateString;
}

// Handle check-in
function handleCheckIn() {
    if (employee.isCheckedIn) {
        showToast("You're already checked in today!", "warning");
        return;
    }
    
    employee.checkInTime = new Date();
    employee.isCheckedIn = true;
    employee.status = "Present";
    
    // Save to localStorage
    localStorage.setItem('employee_checkInTime', employee.checkInTime.toISOString());
    
    updateDisplay();
    showToast("Successfully checked in! Have a productive day.", "success");
    
    // Update weekly activity for today
    updateTodayActivity();
}

// Handle check-out
function handleCheckOut() {
    if (!employee.isCheckedIn) {
        showToast("Please check in first!", "error");
        return;
    }
    
    employee.checkOutTime = new Date();
    employee.isCheckedIn = false;
    employee.status = "Checked Out";
    
    // Calculate hours worked
    calculateTodayHours();
    
    // Update weekly activity
    updateTodayActivity();
    
    // Clear localStorage
    localStorage.removeItem('employee_checkInTime');
    
    updateDisplay();
    showToast("Successfully checked out! See you tomorrow.", "info");
}

// Calculate today's hours
function calculateTodayHours() {
    if (employee.checkInTime && employee.checkOutTime) {
        const hours = (employee.checkOutTime - employee.checkInTime) / (1000 * 60 * 60);
        employee.todayHours = parseFloat(hours.toFixed(2));
        weeklyActivity[0].hours = employee.todayHours;
    }
}

// Update today's activity
function updateTodayActivity() {
    if (employee.checkInTime) {
        const checkInTimeString = employee.checkInTime.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        weeklyActivity[0].checkIn = checkInTimeString;
    }
    
    if (employee.checkOutTime) {
        const checkOutTimeString = employee.checkOutTime.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        weeklyActivity[0].checkOut = checkOutTimeString;
    }
    
    // Update status based on current state
    weeklyActivity[0].status = employee.status;
    populateWeeklyActivity();
}

// Update all displays
function updateDisplay() {
    updateEmployeeInfo();
    updateStatusDisplay();
    updateTimeDisplays();
    updateSummaryStats();
    updateButtonStates();
    updateStatusMessage();
    updateTimelineBadges();
}

// Update employee information
function updateEmployeeInfo() {
    document.getElementById('employee-name').textContent = employee.name;
    document.getElementById('employee-id').textContent = `ID: EMP${employee.id.toString().padStart(3, '0')}`;
}

// Update status display
function updateStatusDisplay() {
    const statusElement = document.getElementById('current-status');
    
    if (employee.status === "Present") {
        statusElement.innerHTML = '<span class="status-indicator status-present mr-2"></span><span>Present</span>';
        statusElement.className = "text-xl font-bold text-green-600 flex items-center justify-center";
    } else if (employee.status === "Checked Out") {
        statusElement.innerHTML = '<span class="status-indicator status-checked-out mr-2"></span><span>Checked Out</span>';
        statusElement.className = "text-xl font-bold text-red-600 flex items-center justify-center";
    } else {
        statusElement.innerHTML = '<span class="status-indicator status-absent mr-2"></span><span>Not Checked In</span>';
        statusElement.className = "text-xl font-bold text-gray-600 flex items-center justify-center";
    }
}

// Update time displays
function updateTimeDisplays() {
    // Check-in display
    const checkInDisplay = document.getElementById('check-in-display');
    if (employee.checkInTime) {
        checkInDisplay.textContent = formatTime(employee.checkInTime);
        document.getElementById('check-in-time-detail').textContent = formatTime(employee.checkInTime, true);
    } else {
        checkInDisplay.textContent = "--:--:--";
        document.getElementById('check-in-time-detail').textContent = "--:--";
    }
    
    // Check-out display
    if (employee.checkOutTime) {
        document.getElementById('check-out-time-detail').textContent = formatTime(employee.checkOutTime, true);
    } else {
        document.getElementById('check-out-time-detail').textContent = "--:--";
    }
}

// Format time for display
function formatTime(time, short = false) {
    if (!time) return short ? "--:--" : "--:--:--";
    
    return time.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        second: short ? undefined : '2-digit',
        hour12: false 
    });
}

// Update summary statistics
function updateSummaryStats() {
    document.getElementById('total-hours').textContent = `${employee.todayHours} hrs`;
    document.getElementById('work-hours').textContent = employee.todayHours;
    document.getElementById('break-time').textContent = employee.breakTime;
}

// Update button states
function updateButtonStates() {
    if (employee.isCheckedIn) {
        // Disable check-in button
        checkInBtn.disabled = true;
        checkInBtn.classList.add('btn-disabled');
        checkInBtn.innerHTML = `
            <i class="fas fa-check-circle text-2xl mb-2"></i>
            <span>CHECKED IN</span>
            <span class="text-sm font-normal mt-1 opacity-90">Already checked in today</span>
        `;
        
        // Enable check-out button
        checkOutBtn.disabled = false;
        checkOutBtn.classList.remove('btn-disabled');
        checkOutBtn.classList.add('pulse-animation');
    } else if (employee.status === "Checked Out") {
        // Both buttons disabled after checking out
        checkInBtn.disabled = true;
        checkInBtn.classList.add('btn-disabled');
        checkInBtn.innerHTML = `
            <i class="fas fa-clock text-2xl mb-2"></i>
            <span>CHECKED OUT</span>
            <span class="text-sm font-normal mt-1 opacity-90">Already checked out today</span>
        `;
        
        checkOutBtn.disabled = true;
        checkOutBtn.classList.add('btn-disabled');
        checkOutBtn.classList.remove('pulse-animation');
        checkOutBtn.innerHTML = `
            <i class="fas fa-sign-out-alt text-2xl mb-2"></i>
            <span>CHECKED OUT</span>
            <span class="text-sm font-normal mt-1 opacity-90">Already checked out today</span>
        `;
    } else {
        // Enable check-in button (not checked in yet)
        checkInBtn.disabled = false;
        checkInBtn.classList.remove('btn-disabled');
        checkInBtn.classList.add('pulse-animation');
        checkInBtn.innerHTML = `
            <i class="fas fa-sign-in-alt text-2xl mb-2"></i>
            <span>CHECK IN</span>
            <span class="text-sm font-normal mt-1 opacity-90">Start your workday</span>
        `;
        
        // Disable check-out button
        checkOutBtn.disabled = true;
        checkOutBtn.classList.add('btn-disabled');
        checkOutBtn.classList.remove('pulse-animation');
        checkOutBtn.innerHTML = `
            <i class="fas fa-sign-out-alt text-2xl mb-2"></i>
            <span>CHECK OUT</span>
            <span class="text-sm font-normal mt-1 opacity-90">End your workday</span>
        `;
    }
}

// Update status message
function updateStatusMessage() {
    const statusMessage = document.getElementById('status-message');
    const messageText = document.getElementById('message-text');
    
    if (employee.isCheckedIn) {
        statusMessage.className = "mt-6 p-4 rounded-lg text-center status-message-success border";
        messageText.textContent = `You're currently checked in. Working since ${employee.checkInTime ? formatTime(employee.checkInTime, true) : '--:--'}`;
        statusMessage.classList.remove('hidden');
    } else if (employee.status === "Checked Out") {
        statusMessage.className = "mt-6 p-4 rounded-lg text-center status-message-warning border";
        messageText.textContent = `You checked out at ${formatTime(employee.checkOutTime, true)}. Total hours worked: ${employee.todayHours}`;
        statusMessage.classList.remove('hidden');
    } else {
        statusMessage.classList.add('hidden');
    }
}

// Update timeline badges
function updateTimelineBadges() {
    const checkInBadge = document.getElementById('check-in-badge');
    const checkOutBadge = document.getElementById('check-out-badge');
    
    // Update check-in badge
    if (employee.checkInTime) {
        checkInBadge.textContent = "COMPLETED";
        checkInBadge.className = "px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold";
    } else {
        checkInBadge.textContent = "PENDING";
        checkInBadge.className = "px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold";
    }
    
    // Update check-out badge
    if (employee.status === "Checked Out") {
        checkOutBadge.textContent = "COMPLETED";
        checkOutBadge.className = "px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold";
    } else if (employee.isCheckedIn) {
        checkOutBadge.textContent = "PENDING";
        checkOutBadge.className = "px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold";
    } else {
        checkOutBadge.textContent = "PENDING";
        checkOutBadge.className = "px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold";
    }
}

// Populate weekly activity table
function populateWeeklyActivity() {
    const tbody = document.getElementById('weekly-activity');
    tbody.innerHTML = '';
    
    weeklyActivity.forEach(day => {
        const row = document.createElement('tr');
        row.className = 'border-b table-row-hover';
        
        // Status badge color
        let statusClass = 'px-3 py-1 rounded-full text-xs font-semibold ';
        if (day.status === 'Present') {
            statusClass += 'bg-green-100 text-green-800';
        } else if (day.status === 'Checked Out') {
            statusClass += 'bg-red-100 text-red-800';
        } else if (day.status === 'Absent') {
            statusClass += 'bg-red-100 text-red-800';
        } else {
            statusClass += 'bg-yellow-100 text-yellow-800';
        }
        
        row.innerHTML = `
            <td class="py-4 font-medium ${day.date === 'Today' ? 'text-blue-600' : 'text-gray-700'}">${day.date}</td>
            <td class="py-4">${day.checkIn}</td>
            <td class="py-4">${day.checkOut}</td>
            <td class="py-4 font-medium">${day.hours} hrs</td>
            <td class="py-4"><span class="${statusClass}">${day.status}</span></td>
        `;
        
        tbody.appendChild(row);
    });
}

// Show toast notification
function showToast(message, type) {
    // Remove existing toast
    const existingToast = document.querySelector('.notification-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'notification-toast';
    
    // Set color based on type
    let bgColor = 'bg-blue-500';
    let icon = 'fas fa-info-circle';
    
    switch(type) {
        case 'success':
            bgColor = 'bg-green-500';
            icon = 'fas fa-check-circle';
            break;
        case 'error':
            bgColor = 'bg-red-500';
            icon = 'fas fa-times-circle';
            break;
        case 'warning':
            bgColor = 'bg-yellow-500';
            icon = 'fas fa-exclamation-triangle';
            break;
        case 'info':
            bgColor = 'bg-blue-500';
            icon = 'fas fa-info-circle';
            break;
    }
    
    toast.className = `notification-toast ${bgColor}`;
    toast.innerHTML = `
        <div class="flex items-center">
            <i class="${icon} mr-3"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }
    }, 4000);
}

// Help modal functions
function showHelpModal() {
    helpModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeHelpModal() {
    helpModal.classList.add('hidden');
    document.body.style.overflow = 'auto'; // Restore scrolling
}

function showReportIssue() {
    showToast("Issue reporting feature coming soon!", "info");
}

function contactSupport() {
    showToast("Contact support at support@company.com", "info");
}