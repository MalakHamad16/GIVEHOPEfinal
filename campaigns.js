// campaigns.js
// تحديد نوع المستخدم (في الإنتاج، يجب أن يأتي من JwtToken توكن)
const isAdmin = true; // غيّر إلى false لاختبار كمستخدم عادي
// جلب حالة المستخدم من localStorage (الذي سيُملأ بعد تسجيل الدخول)
//const isAdmin = localStorage.getItem('isAdmin') === 'true';

let campaignsData = [];

// دالة مساعدة لتحويل رمز العملة
function getCurrencySymbol(code) {
  const symbols = {
    ILS: '₪',
    USD: '$',
    JOD: 'د.أ',
    AED: 'د.إ'
  };
  return symbols[code] || '₪';
}

// تحويل تاريخ ISO إلى تنسيق محلي (مثلاً: 25/10/2025)
function formatDateForDisplay(isoDateString) {
  if (!isoDateString) return '';
  const date = new Date(isoDateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// دالة لجلب الحملات من الباك-إند
async function fetchCampaigns() {
  try {
    const res = await fetch('/api/campaigns');
    if (!res.ok) throw new Error('فشل جلب الحملات');
    const data = await res.json();

    campaignsData = data.map(camp => ({
      id: camp._id,
      campaignCode: camp._id.substring(0, 6).toUpperCase(),
      title: camp.title,
      goal: camp.goalAmount,
      collectedAmount: camp.collectedAmount || 0,
      currency: getCurrencySymbol(camp.currency || 'ILS'),
      // الاحتفاظ بالتواريخ الأصلية للمنطق الداخلي
      startDateRaw: camp.startDate,
      endDateRaw: camp.endDate,
      // التواريخ المنسّقة للعرض
      startDate: formatDateForDisplay(camp.startDate),
      endDate: formatDateForDisplay(camp.endDate),
      description: camp.description,
      image: camp.image || 'https://via.placeholder.com/300x200?text=No+Image',
      status: camp.status,
      duration: calculateDuration(camp.startDate, camp.endDate)
    }));
  } catch (err) {
    console.error('❌ خطأ في جلب الحملات:', err);
    alert('فشل تحميل الحملات. يرجى المحاولة لاحقًا.');
  }
}

function calculateDuration(startStr, endStr) {
  const start = new Date(startStr);
  const end = new Date(endStr);
  const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  if (diffDays < 30) return `${diffDays} يوم`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} شهر`;
  return `${Math.floor(diffDays / 365)} سنة`;
}

// تحديد الحالة المعروضة
function getDisplayStatus(camp) {
  const now = new Date();
  const start = new Date(camp.startDateRaw);
  const end = new Date(camp.endDateRaw);
  const collected = camp.collectedAmount || 0;
  const goal = camp.goalAmount || 1;

  if (camp.status === 'pending') return 'pending';
  if (start > now) return 'scheduled';
  if (end < now) return collected >= goal ? 'completed' : 'ended';
  return collected >= goal ? 'completed' : 'active';
}

// ترجمة الحالة إلى نص ولون
function getStatusInfo(displayStatus) {
  switch (displayStatus) {
    case 'active': return { text: 'نشطة', color: '#16a34a' };
    case 'completed': return { text: 'مكتملة بنجاح', color: '#3b82f6' };
    case 'ended': return { text: 'منتهية', color: '#d1d5db' };
    case 'scheduled': return { text: 'مجدولة', color: '#90909bff' };
    case 'pending': return { text: 'معلقة', color: '#f59e0b' };
    default: return { text: 'غير معروفة', color: '#5e4668ff' };
  }
}

// إنشاء بطاقة الحملة
function createCampaignCard(camp) {
  const displayStatus = getDisplayStatus(camp);
  const statusInfo = getStatusInfo(displayStatus);
  const isDonatable = (displayStatus === 'active');

  let donateBtnHtml = '';
  if (!isAdmin) {
    if (isDonatable) {
      donateBtnHtml = `<a href="DonateNow.html?type=donation&campaign=${camp.id}" class="btn btn-primary">تبرع الآن</a>`;
    } else {
      donateBtnHtml = `<button class="btn btn-primary disabled" disabled>غير متاح</button>`;
    }
  }

  const card = document.createElement('div');
  card.className = 'campaign-card';
  card.innerHTML = `
    <div class="campaign-image">
      <img src="${camp.image}" alt="${camp.title}">
      <span class="status-badge" style="background:${statusInfo.color}; color:white">
        ${statusInfo.text}
      </span>
    </div>
    <div class="campaign-content">
      <h3 class="campaign-title">${camp.title}</h3>
      <div class="campaign-info-row">
        <span>رقم الحملة: ${camp.campaignCode}</span>
        <span>المدة: ${camp.duration}</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${camp.goal ? Math.min(100, Math.round((camp.collectedAmount / camp.goal) * 100)) : 0}%"></div>
      </div>
      <div class="progress-text">
        <span>${camp.collectedAmount.toLocaleString()}${camp.currency}</span>
        <span>من ${camp.goal.toLocaleString()}${camp.currency}</span>
      </div>
      <div class="card-buttons">
        ${
          isAdmin
            ? `
              <a href="edit-campaign.html?id=${camp.id}" class="btn btn-admin-edit">تعديل</a>
              <button class="btn btn-admin-delete" onclick="deleteCampaign('${camp.id}')">حذف</button>
              <button class="btn btn-outline" onclick="showDetails('${camp.id}')">عرض التفاصيل</button>
              <button class="btn-share" onclick="shareCampaign('${camp.id}')"><i class="fas fa-share-alt"></i></button>
            `
            : `
              ${donateBtnHtml}
              <button class="btn btn-outline" onclick="showDetails('${camp.id}')">عرض التفاصيل</button>
              <button class="btn-share" onclick="shareCampaign('${camp.id}')"><i class="fas fa-share-alt"></i></button>
            `
        }
      </div>
    </div>
  `;
  return card;
}

// عرض الحملات مع ترتيب ذكي في جميع الفلاتر
function renderCampaigns(filterStatus = 'all') {
  const containers = {
    active: document.getElementById('campaignsContainer'),
    scheduled: document.getElementById('scheduledCampaigns'),
    ended: document.getElementById('endedCampaigns'),
    completed: document.getElementById('completedCampaigns'),
    pending: document.getElementById('pendingCampaigns')
  };

  Object.values(containers).forEach(container => {
    if (container) container.innerHTML = '';
  });

  let campaignsToRender = [...campaignsData];

  // تصفية حسب الحالة المطلوبة
  if (filterStatus !== 'all') {
    campaignsToRender = campaignsToRender.filter(camp => getDisplayStatus(camp) === filterStatus);
  }

  // ✅ ترتيب ذكي — في جميع الحالات
  campaignsToRender.sort((a, b) => {
    const statusA = getDisplayStatus(a);
    const statusB = getDisplayStatus(b);

    // إذا كان الفلتر "الكل"، نرتب حسب أولوية الحالة
    if (filterStatus === 'all') {
      const priority = { active: 1, scheduled: 2, ended: 3, pending: 4, completed: 5 };
      if (priority[statusA] !== priority[statusB]) {
        return priority[statusA] - priority[statusB];
      }
    }

    // الترتيب داخل نفس الفئة
    if (statusA === 'active' && statusB === 'active') {
      const ratioA = a.goal ? a.collectedAmount / a.goal : 0;
      const ratioB = b.goal ? b.collectedAmount / b.goal : 0;
      if (Math.abs(ratioA - ratioB) > 0.001) return ratioB - ratioA; // الأعلى نسبة أولًا
      const daysA = Math.ceil((new Date(a.endDateRaw) - new Date()) / (1000 * 60 * 60 * 24));
      const daysB = Math.ceil((new Date(b.endDateRaw) - new Date()) / (1000 * 60 * 60 * 24));
      return daysA - daysB; // الأقصر مدة أولًا
    }

    if (statusA === 'scheduled' && statusB === 'scheduled') {
      const startA = new Date(a.startDateRaw);
      const startB = new Date(b.startDateRaw);
      if (startA.getTime() !== startB.getTime()) return startA - startB; // الأقرب بداية أولًا
      const durA = new Date(a.endDateRaw) - new Date(a.startDateRaw);
      const durB = new Date(b.endDateRaw) - new Date(b.startDateRaw);
      return durA - durB; // الأقصر مدة أولًا
    }

    if (statusA === 'ended' && statusB === 'ended') {
      const ratioA = a.goal ? a.collectedAmount / a.goal : 0;
      const ratioB = b.goal ? b.collectedAmount / b.goal : 0;
      if (Math.abs(ratioA - ratioB) > 0.001) return ratioB - ratioA;
      const durA = new Date(a.endDateRaw) - new Date(a.startDateRaw);
      const durB = new Date(b.endDateRaw) - new Date(b.startDateRaw);
      return durA - durB;
    }

    if (statusA === 'pending' && statusB === 'pending') {
      const ratioA = a.goal ? a.collectedAmount / a.goal : 0;
      const ratioB = b.goal ? b.collectedAmount / b.goal : 0;
      if (Math.abs(ratioA - ratioB) > 0.001) return ratioB - ratioA;
      const durA = new Date(a.endDateRaw) - new Date(a.startDateRaw);
      const durB = new Date(b.endDateRaw) - new Date(b.startDateRaw);
      return durA - durB;
    }

    if (statusA === 'completed' && statusB === 'completed') {
      const endA = new Date(a.endDateRaw);
      const endB = new Date(b.endDateRaw);
      return endB - endA; // الأحدث انتهاءً أولًا
    }

    return 0;
  });

  // عرض البطاقات
  campaignsToRender.forEach(camp => {
    const displayStatus = getDisplayStatus(camp);
    const card = createCampaignCard(camp);
    let targetContainer = null;
    if (displayStatus === 'active') targetContainer = containers.active;
    else if (displayStatus === 'scheduled') targetContainer = containers.scheduled;
    else if (displayStatus === 'ended') targetContainer = containers.ended;
    else if (displayStatus === 'completed') targetContainer = containers.completed;
    else if (displayStatus === 'pending') targetContainer = containers.pending;

    if (targetContainer) {
      targetContainer.appendChild(card);
    } else if (containers.active) {
      containers.active.appendChild(card);
    }
  });
}

// شريط الفلترة
function renderFilterBar() {
  const filterBar = document.createElement('div');
  filterBar.className = 'filter-bar';
  const buttons = [
    { text: 'الكل', status: 'all' },
    { text: 'النشطة', status: 'active' },
    { text: 'المجدولة', status: 'scheduled' },
    { text: 'المعلقة', status: 'pending' },
    { text: 'المنتهية', status: 'ended' },
    { text: 'المكتملة', status: 'completed' }
  ];

  buttons.forEach(btn => {
    const buttonEl = document.createElement('button');
    buttonEl.textContent = btn.text;
    buttonEl.dataset.status = btn.status;
    if (btn.status === 'all') buttonEl.classList.add('active');
    buttonEl.addEventListener('click', () => {
      document.querySelectorAll('.filter-bar button').forEach(b => b.classList.remove('active'));
      buttonEl.classList.add('active');
      renderCampaigns(btn.status);
    });
    filterBar.appendChild(buttonEl);
  });

  const main = document.querySelector('main');
  const campaignsContainer = document.getElementById('campaignsContainer');
  if (main && campaignsContainer) {
    main.insertBefore(filterBar, campaignsContainer);
  }
}

// عرض التفاصيل
function showDetails(id) {
  const camp = campaignsData.find(c => c.id === id);
  if (!camp) return;

  const displayStatus = getDisplayStatus(camp);
  const statusInfo = getStatusInfo(displayStatus);
  const isDonatable = (displayStatus === 'active');

  document.getElementById('modalTitle').textContent = camp.title;
  document.getElementById('modalId').textContent = camp.campaignCode;
  document.getElementById('modalStart').textContent = camp.startDate;
  document.getElementById('modalEnd').textContent = camp.endDate;
  document.getElementById('modalGoal').textContent = `${camp.goal.toLocaleString()}${camp.currency}`;
  document.getElementById('modalRaised').textContent = `${camp.collectedAmount.toLocaleString()}${camp.currency}`;
  document.getElementById('modalDesc').textContent = camp.description;
  document.querySelector('.modal-info').style.borderLeft = `6px solid ${statusInfo.color}`;

  const modalDonateBtn = document.querySelector('.modal-donate-btn');
  if (modalDonateBtn) {
    if (!isAdmin) {
      if (isDonatable) {
        modalDonateBtn.innerHTML = `<a href="DonateNow.html?type=donation&campaign=${camp.id}" class="btn btn-primary">تبرع الآن</a>`;
      } else {
        modalDonateBtn.innerHTML = `<button class="btn btn-primary disabled" disabled>غير متاح</button>`;
      }
    } else {
      modalDonateBtn.innerHTML = '';
    }
  }

  document.getElementById('detailModal').style.display = 'flex';
}

// حذف الحملة
async function deleteCampaign(id) {
  if (!confirm('هل أنت متأكد من حذف هذه الحملة؟')) return;
  try {
    const res = await fetch(`/api/campaigns/${id}`, { method: 'DELETE' });
    if (res.ok) {
      alert('تم حذف الحملة بنجاح');
      await fetchCampaigns();
      renderCampaigns();
    } else {
      alert('فشل الحذف');
    }
  } catch (err) {
    console.error(err);
    alert('خطأ في الاتصال بالسيرفر');
  }
}

// مشاركة الحملة
function shareCampaign(id) {
  const camp = campaignsData.find(c => c.id === id);
  if (!camp) return;
  const url = `${window.location.origin}/DonateNow.html?type=donation&campaign=${id}`;
  const shareModal = document.createElement('div');
  shareModal.className = 'modal-overlay';
  shareModal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close">&times;</button>
      <h3>مشاركة الحملة: ${camp.title}</h3>
      <div class="share-icons">
        <a href="https://wa.me/?text=${encodeURIComponent(url)}" target="_blank"><i class="fab fa-whatsapp"></i></a>
        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" target="_blank"><i class="fab fa-facebook"></i></a>
        <button onclick="navigator.clipboard.writeText('${url}'); alert('تم نسخ الرابط');"><i class="fas fa-link"></i></button>
      </div>
    </div>
  `;
  document.body.appendChild(shareModal);
  shareModal.style.display = 'flex';
  shareModal.querySelector('.modal-close').addEventListener('click', () => shareModal.remove());
  shareModal.addEventListener('click', (e) => { if (e.target === shareModal) shareModal.remove(); });
}

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', async () => {
  if (isAdmin && document.getElementById('adminCreateBtn')) {
    document.getElementById('adminCreateBtn').style.display = 'block';
  }
  await fetchCampaigns();
  renderFilterBar();
  renderCampaigns();
  const modal = document.getElementById('detailModal');
  if (modal) {
    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => modal.style.display = 'none');
    }
    modal.addEventListener('click', (e) => {
      if (e.target.id === 'detailModal') modal.style.display = 'none';
    });
  }
});