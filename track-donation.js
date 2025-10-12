// Mock database for demonstration purposes
const mockRequests = {
    'DR-2024-001234': {
        id: 'DR-2024-001234',
        type: 'health',
        typeName: 'صحة',
        status: 'active',
        submissionDate: '2024-01-15',
        targetAmount: 15000,
        raisedAmount: 9500,
        applicant: {
            firstName: 'محمد',
            lastName: 'أحمد',
            city: 'غزة',
            email: 'mohammadahmad@gmail.com'
        },
        urgency: 'high',
        donations: [
            { donor: 'متبرع كريم', amount: 500, date: '2024-01-20', time: '14:30' },
            { donor: 'أم خالد', amount: 1000, date: '2024-01-19', time: '10:15' },
            { donor: 'متبرع مجهول', amount: 2000, date: '2024-01-18', time: '16:45' },
            { donor: 'عائلة السعيد', amount: 1500, date: '2024-01-17', time: '09:20' },
            { donor: 'متبرع كريم', amount: 3000, date: '2024-01-16', time: '11:00' },
            { donor: 'محسن', amount: 1500, date: '2024-01-15', time: '15:30' }
        ],
        timeline: [
            { status: 'submitted', date: '2024-01-15', time: '09:00', description: 'تم تقديم الطلب بنجاح' },
            { status: 'under_review', date: '2024-01-15', time: '14:30', description: 'قيد المراجعة من قبل الفريق' },
            { status: 'approved', date: '2024-01-16', time: '10:00', description: 'تمت الموافقة على الطلب' },
            { status: 'active', date: '2024-01-16', time: '11:00', description: 'الطلب نشط ويستقبل التبرعات' }
        ]
    },
    'DR-2024-002345': {
        id: 'DR-2024-002345',
        type: 'education',
        typeName: 'تعليم',
        status: 'completed',
        submissionDate: '2024-01-10',
        targetAmount: 8000,
        raisedAmount: 8000,
        applicant: {
            firstName: 'فاطمة',
            lastName: 'حسن',
            city: 'رام الله',
            
            email: 'mohammadahmad@gmail.com'
        },
        urgency: 'medium',
        donations: [
            { donor: 'جمعية الخير', amount: 3000, date: '2024-01-14', time: '13:00' },
            { donor: 'متبرع كريم', amount: 2000, date: '2024-01-13', time: '15:20' },
            { donor: 'عائلة محمود', amount: 2000, date: '2024-01-12', time: '10:45' },
            { donor: 'متبرع مجهول', amount: 1000, date: '2024-01-11', time: '16:30' }
        ],
        timeline: [
            { status: 'submitted', date: '2024-01-10', time: '10:30', description: 'تم تقديم الطلب بنجاح' },
            { status: 'under_review', date: '2024-01-10', time: '15:00', description: 'قيد المراجعة من قبل الفريق' },
            { status: 'approved', date: '2024-01-11', time: '09:00', description: 'تمت الموافقة على الطلب' },
            { status: 'active', date: '2024-01-11', time: '10:00', description: 'الطلب نشط ويستقبل التبرعات' },
            { status: 'completed', date: '2024-01-14', time: '14:00', description: 'تم الوصول للمبلغ المطلوب' }
        ]
    },
    'DR-2024-003456': {
        id: 'DR-2024-003456',
        type: 'living',
        typeName: 'معيشة',
        status: 'under_review',
        submissionDate: '2024-01-22',
        targetAmount: 25000,
        raisedAmount: 0,
        applicant: {
            firstName: 'أحمد',
            lastName: 'علي',
            city: 'الخليل',
            
            email: 'mohammadahmad@gmail.com'
        },
        urgency: 'critical',
        donations: [],
        timeline: [
            { status: 'submitted', date: '2024-01-22', time: '11:15', description: 'تم تقديم الطلب بنجاح' },
            { status: 'under_review', date: '2024-01-22', time: '14:00', description: 'قيد المراجعة من قبل الفريق' }
        ]
    },
    'DR-2024-004567': {
        id: 'DR-2024-004567',
        type: 'sponsoring',
        typeName: 'كفالة',
        status: 'active',
        submissionDate: '2024-01-18',
        targetAmount: 12000,
        raisedAmount: 7200,
        applicant: {
            firstName: 'سارة',
            lastName: 'خليل',
            city: 'نابلس',
            
            email: 'mohammadahmad@gmail.com'
        },
        urgency: 'medium',
        donations: [
            { donor: 'محسن مجهول', amount: 2000, date: '2024-01-21', time: '09:30' },
            { donor: 'جمعية البر', amount: 3000, date: '2024-01-20', time: '14:15' },
            { donor: 'عائلة كريمة', amount: 1200, date: '2024-01-19', time: '11:45' },
            { donor: 'متبرع', amount: 1000, date: '2024-01-18', time: '16:00' }
        ],
        timeline: [
            { status: 'submitted', date: '2024-01-18', time: '10:00', description: 'تم تقديم الطلب بنجاح' },
            { status: 'under_review', date: '2024-01-18', time: '15:30', description: 'قيد المراجعة من قبل الفريق' },
            { status: 'approved', date: '2024-01-19', time: '09:00', description: 'تمت الموافقة على الطلب' },
            { status: 'active', date: '2024-01-19', time: '10:00', description: 'الطلب نشط ويستقبل التبرعات' }
        ]
    }
};

// Status configurations
const statusConfig = {
    submitted: {
        text: 'تم التقديم',
        description: 'تم استلام طلبك وسيتم مراجعته قريباً',
        icon: 'fas fa-check-circle',
        badgeClass: 'bg-info',
        alertClass: 'alert-info'
    },
    under_review: {
        text: 'قيد المراجعة',
        description: 'يقوم فريقنا بمراجعة طلبك والتحقق من المعلومات',
        icon: 'fas fa-hourglass-half',
        badgeClass: 'bg-warning',
        alertClass: 'alert-warning'
    },
    approved: {
        text: 'تمت الموافقة',
        description: 'تمت الموافقة على طلبك وسيتم نشره للمتبرعين',
        icon: 'fas fa-check-double',
        badgeClass: 'bg-success',
        alertClass: 'alert-success'
    },
    active: {
        text: 'نشط',
        description: 'طلبك نشط حالياً ويستقبل التبرعات',
        icon: 'fas fa-heart-pulse',
        badgeClass: 'bg-success',
        alertClass: 'alert-success'
    },
    completed: {
        text: 'مكتمل',
        description: 'تم الوصول للمبلغ المطلوب! شكراً للمتبرعين الكرام',
        icon: 'fas fa-trophy',
        badgeClass: 'bg-primary',
        alertClass: 'alert-primary'
    },
    rejected: {
        text: 'مرفوض',
        description: 'عذراً، لم يتم الموافقة على طلبك. يمكنك التواصل معنا للمزيد من المعلومات',
        icon: 'fas fa-times-circle',
        badgeClass: 'bg-danger',
        alertClass: 'alert-danger'
    },
    cancelled: {
        text: 'ملغى',
        description: 'تم إلغاء الطلب',
        icon: 'fas fa-ban',
        badgeClass: 'bg-secondary',
        alertClass: 'alert-secondary'
    }
};

// Urgency level configurations
const urgencyConfig = {
    low: { text: 'عادي', class: 'bg-secondary' },
    medium: { text: 'مهم', class: 'bg-info' },
    high: { text: 'عاجل', class: 'bg-warning' },
    critical: { text: 'طارئ', class: 'bg-danger' }
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Check if there's a request ID in URL params
    const urlParams = new URLSearchParams(window.location.search);
    const requestId = urlParams.get('id');
    
    // Auto-load request
    loadRequest(requestId || 'DR-2024-001234'); // Default to first request
});

// Load request by ID
function loadRequest(requestId) {
    // Show loading
    showLoading();

    // Simulate API call with timeout
    setTimeout(() => {
        const request = mockRequests[requestId];
        
        if (request) {
            displayRequest(request);
        } else {
            // If request not found, load the default one
            displayRequest(mockRequests['DR-2024-001234']);
        }
    }, 1000);
}

// Show loading spinner
function showLoading() {
    document.getElementById('loadingSpinner').classList.remove('d-none');
    document.getElementById('requestDetails').classList.add('d-none');
}

// Display request details
function displayRequest(request) {
    document.getElementById('loadingSpinner').classList.add('d-none');
    document.getElementById('requestDetails').classList.remove('d-none');

    // Update status banner
    updateStatusBanner(request);

    // Update request information
    document.getElementById('displayRequestId').textContent = request.id;
    document.getElementById('requestType').textContent = request.typeName;
    document.getElementById('submissionDate').textContent = formatDate(request.submissionDate);
    document.getElementById('targetAmount').textContent = formatCurrency(request.targetAmount);
    
    // Update urgency level
    const urgency = urgencyConfig[request.urgency];
    const urgencyEl = document.getElementById('urgencyLevel');
    urgencyEl.textContent = urgency.text;
    urgencyEl.className = `badge ${urgency.class}`;

    // Update applicant information
    document.getElementById('applicantName').textContent = `${request.applicant.firstName} ${request.applicant.lastName}`;
    document.getElementById('applicantCity').textContent = request.applicant.city;
    document.getElementById('applicantEmail').textContent = request.applicant.email;

    // Update progress
    updateProgress(request);

    // Display donations
    displayDonations(request.donations);

    // Display timeline
    displayTimeline(request.timeline);

    // Scroll to results
    document.getElementById('requestDetails').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Update status banner
function updateStatusBanner(request) {
    const status = statusConfig[request.status];
    const banner = document.getElementById('statusBanner');
    
    banner.className = `alert ${status.alertClass}`;
    document.getElementById('statusIcon').className = `${status.icon} ms-2`;
    document.getElementById('statusText').textContent = status.text;
    document.getElementById('statusDescription').textContent = status.description;
    
    const badge = document.getElementById('statusBadge');
    badge.className = `badge fs-5 ${status.badgeClass}`;
    badge.textContent = status.text;
}

// Update progress display
function updateProgress(request) {
    const percentage = Math.min(100, Math.round((request.raisedAmount / request.targetAmount) * 100));
    const remaining = request.targetAmount - request.raisedAmount;

    // Update stats
    document.getElementById('raisedAmount').textContent = formatCurrency(request.raisedAmount);
    document.getElementById('progressPercentage').textContent = `${percentage}%`;
    document.getElementById('donorsCount').textContent = request.donations.length;
    document.getElementById('remainingAmount').textContent = `المتبقي: ${formatCurrency(remaining)}`;

    // Update progress bar
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = `${percentage}%`;
    progressBar.setAttribute('aria-valuenow', percentage);
    document.getElementById('progressBarText').textContent = `${percentage}%`;

    // Change color based on progress
    if (percentage >= 100) {
        progressBar.classList.remove('bg-warning', 'bg-success');
        progressBar.classList.add('bg-primary');
    } else if (percentage >= 50) {
        progressBar.classList.remove('bg-warning', 'bg-primary');
        progressBar.classList.add('bg-success');
    } else {
        progressBar.classList.remove('bg-success', 'bg-primary');
        progressBar.classList.add('bg-warning');
    }
}

// Display donations list
function displayDonations(donations) {
    const donationsList = document.getElementById('donationsList');
    
    if (donations.length === 0) {
        donationsList.innerHTML = `
            <div class="text-center py-4 text-muted">
                <i class="fas fa-heart-broken fa-3x mb-3 opacity-50"></i>
                <p class="mb-0">لا توجد تبرعات بعد</p>
                <small>كن أول من يتبرع لهذا الطلب</small>
            </div>
        `;
        return;
    }

    let html = '<div class="list-group list-group-flush">';
    
    // Show only last 5 donations
    const recentDonations = donations.slice(0, 5);
    
    recentDonations.forEach(donation => {
        html += `
            <div class="list-group-item border-0 px-0">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                        <div class="bg-success text-white rounded-circle p-2 ms-3" style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-hand-holding-heart"></i>
                        </div>
                        <div>
                            <strong class="d-block">${donation.donor}</strong>
                            <small class="text-muted">
                                <i class="fas fa-calendar ms-1"></i>
                                ${formatDate(donation.date)} - ${donation.time}
                            </small>
                        </div>
                    </div>
                    <div>
                        <span class="badge bg-success fs-6">${formatCurrency(donation.amount)}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    if (donations.length > 5) {
        html += `
            <div class="list-group-item border-0 px-0 text-center">
                <small class="text-muted">
                    <i class="fas fa-ellipsis-h ms-1"></i>
                    و ${donations.length - 5} تبرعات أخرى
                </small>
            </div>
        `;
    }
    
    html += '</div>';
    donationsList.innerHTML = html;
}

// Display status timeline
function displayTimeline(timeline) {
    const timelineContainer = document.getElementById('statusTimeline');
    
    let html = '<div class="timeline">';
    
    timeline.forEach((item, index) => {
        const status = statusConfig[item.status];
        const isLast = index === timeline.length - 1;
        
        html += `
            <div class="timeline-item ${isLast ? 'active' : ''}">
                <div class="timeline-marker">
                    <i class="${status.icon}"></i>
                </div>
                <div class="timeline-content">
                    <div class="d-flex justify-content-between align-items-start mb-1">
                        <strong class="text-primary">${status.text}</strong>
                        <small class="text-muted">
                            ${formatDate(item.date)} - ${item.time}
                        </small>
                    </div>
                    <p class="mb-0 text-muted">${item.description}</p>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    timelineContainer.innerHTML = html;
}

// Format currency
function formatCurrency(amount) {
    return `${amount.toLocaleString('ar-PS')} ₪`;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('ar', options);
}

// Share request functions
function shareRequest(platform) {
    const requestId = document.getElementById('displayRequestId').textContent;
    const url = `${window.location.origin}${window.location.pathname}?id=${requestId}`;
    const text = `ساعد في تحقيق هذا الطلب على Give Hope - ${requestId}`;
    
    let shareUrl = '';
    
    switch(platform) {
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// Copy link to clipboard
function copyLink() {
    const requestId = document.getElementById('displayRequestId').textContent;
    const url = `${window.location.origin}${window.location.pathname}?id=${requestId}`;
    
    // Create temporary input
    const tempInput = document.createElement('input');
    tempInput.value = url;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    
    // Show feedback
    const btn = event.target.closest('button');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check ms-1"></i> تم النسخ!';
    btn.classList.remove('btn-outline-secondary');
    btn.classList.add('btn-success');
    
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.classList.remove('btn-success');
        btn.classList.add('btn-outline-secondary');
    }, 2000);
}
