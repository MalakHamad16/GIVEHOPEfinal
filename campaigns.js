// مؤقت: تحديد هل المستخدم إداري أم لا
const isAdmin = true; // ضع true إذا كان أدمن، false إذا مستخدم عادي

// بيانات تجريبية للحملات
const campaignsData = [
  {
    id: 1,
    campaignCode: "A001",
    title: "سقيا ماء",
    goal: 20000,
    currency: "₪",
    startDate: "2025-10-01",
    endDate: "2025-11-30",
    description:
      "كن عوناً في توفير السقيا والمياه العذبة في المناطق الأشد احتياجاً",
    progress: 95,
    image: "images/water.jpg",
    status: "active",
    duration: "2 شهر",
  },
  {
    id: 1,
    campaignCode: "A001",
    title: "سقيا ماء",
    goal: 20000,
    currency: "₪",
    startDate: "2025-10-01",
    endDate: "2025-11-30",
    description:
      "كن عوناً في توفير السقيا والمياه العذبة في المناطق الأشد احتياجاً",
    progress: 95,
    image: "images/water.jpg",
    status: "active",
    duration: "2 شهر",
  },
  {
    id: 2,
    campaignCode: "A002",
    title: "توفير أدوية",
    goal: 15000,
    currency: "₪",
    startDate: "2025-10-05",
    endDate: "2025-11-24",
    description: "ساهم في توفير أدوية لـ 50 مريضاً بحاجة ماسة للعلاج.",
    progress: 68,
    image: "images/meds.jpg",
    status: "paused",
    duration: "1 شهر و19 يوم",
  },
  {
    id: 3,
    campaignCode: "A003",
    title: "العودة إلى المدارس",
    goal: 10000,
    currency: "₪",
    startDate: "2025-09-01",
    endDate: "2025-10-01",
    description: "توفير حقائب مدرسية للأطفال المحتاجين.",
    progress: 100,
    image: "images/books.jpg",
    status: "completed",
    duration: "1 شهر",
  },
  {
    id: 4,
    campaignCode: "A004",
    title: "إغاثة عاجلة",
    goal: 25000,
    currency: "₪",
    startDate: "2025-09-20",
    endDate: "2025-10-10",
    description: "تقديم مساعدات عاجلة للأسر المتضررة.",
    progress: 80,
    image: "images/help.jpg",
    status: "ended",
    duration: "20 يوم",
  },
  {
    id: 5,
    campaignCode: "A005",
    title: "إفطار صائم",
    goal: 12000,
    currency: "₪",
    startDate: "2025-12-01",
    endDate: "2026-01-01",
    description:
      "حملة لتجهيز وجبات إفطار يومية للصائمين خلال شهر رمضان المبارك.",
    progress: 0,
    image: "images/iftar.jpg",
    status: "scheduled",
    duration: "1 شهر",
  },
];

// عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
  if (isAdmin) {
    document.getElementById("adminCreateBtn").style.display = "block";
  }

  renderFilterBar();
  renderCampaigns();

  // Modal
  const modal = document.getElementById("detailModal");
  document.querySelector(".modal-close").addEventListener("click", () => {
    modal.style.display = "none";
  });
  modal.addEventListener("click", (e) => {
    if (e.target.id === "detailModal") modal.style.display = "none";
  });
});

// ترجمة الحالة بالعربية مع اللون
function getStatusInfo(status) {
  switch (status) {
    case "active":
      return { text: "نشطة", color: "#16a34a" };
    case "paused":
      return { text: "معلقة", color: "#facc15", textColor: "#1e293b" };
    case "completed":
      return { text: "مكتملة بنجاح", color: "#3b82f6" };
    case "ended":
      return { text: "منتهية", color: "#ef4444" };
    case "scheduled":
      return { text: "مجدولة", color: "#90909bff" };

    default:
      return { text: "غير معروفة", color: "#5e4668ff" };
  }
}

// إنشاء بطاقة حملة
function createCampaignCard(camp) {
  const statusInfo = getStatusInfo(camp.status);

  const card = document.createElement("div");
  card.className = "campaign-card";

  // زر التبرع الآن للمستخدم فقط
  let donateBtnHtml = "";
  if (!isAdmin) {
    const isDisabled = ["completed", "ended", "paused"].includes(camp.status);
    donateBtnHtml = `<a href="${
      isDisabled ? "#" : `donate.html?type=donation&campaign=${camp.id}`
    }" class="btn btn-primary ${isDisabled ? "disabled" : ""}" ${
      isDisabled ? 'onclick="return false;"' : ""
    }>تبرع الآن</a>`;
  }

  card.innerHTML = `
    <div class="campaign-image">
      <img src="${camp.image}" alt="${camp.title}">
      <span class="status-badge" style="background:${statusInfo.color}; color:${
    statusInfo.textColor || "white"
  }">
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
        <div class="progress-fill" style="width:${camp.progress}%"></div>
      </div>
      <div class="progress-text">
        <span>${((camp.goal * camp.progress) / 100).toLocaleString()}${
    camp.currency
  }</span>
        <span>من ${camp.goal.toLocaleString()}${camp.currency}</span>
      </div>
      <div class="card-buttons">
        ${
          isAdmin
            ? `
              <a href="edit-campaign.html?id=${camp.id}" class="btn btn-admin-edit">تعديل</a>
              <button class="btn btn-admin-delete" onclick="deleteCampaign(${camp.id})">حذف</button>
              <button class="btn btn-outline" onclick="showDetails(${camp.id})">عرض التفاصيل</button>
              <button class="btn-share" onclick="shareCampaign(${camp.id})"><i class="fas fa-share-alt"></i></button>
            `
            : `
              ${donateBtnHtml}
              <button class="btn btn-outline" onclick="showDetails(${camp.id})">عرض التفاصيل</button>
              <button class="btn-share" onclick="shareCampaign(${camp.id})"><i class="fas fa-share-alt"></i></button>
            `
        }
      </div>
    </div>
  `;
  return card;
}

// عرض الحملات
function renderCampaigns(filterStatus = "all") {
  const activeContainer = document.getElementById("campaignsContainer");
  const completedContainer = document.getElementById("completedCampaigns");
  const scheduledContainer = document.getElementById("scheduledCampaigns");

  activeContainer.innerHTML = "";
  completedContainer.innerHTML = "";
  scheduledContainer.innerHTML = "";

  const filtered =
    filterStatus === "all"
      ? campaignsData
      : campaignsData.filter((c) => c.status === filterStatus);

  filtered.forEach((camp) => {
    const card = createCampaignCard(camp);
    if (camp.status === "completed" || camp.status === "ended") {
      completedContainer.appendChild(card);
    } else if (camp.status === "scheduled") {
      scheduledContainer.appendChild(card);
    } else {
      activeContainer.appendChild(card);
    }
  });
}

// شريط الفلترة
function renderFilterBar() {
  const filterBar = document.createElement("div");
  filterBar.className = "filter-bar";
  const buttons = [
    { text: "الكل", status: "all" },
    { text: "النشطة", status: "active" },
    { text: "المعلقة", status: "paused" },
    { text: "المنتهية", status: "ended" },
    { text: "المجدولة", status: "scheduled" },
    { text: "المكتملة بنجاح", status: "completed" },
  ];

  buttons.forEach((btn) => {
    const buttonEl = document.createElement("button");
    buttonEl.textContent = btn.text;
    buttonEl.dataset.status = btn.status;
    if (btn.status === "all") buttonEl.classList.add("active");
    buttonEl.addEventListener("click", () => {
      document
        .querySelectorAll(".filter-bar button")
        .forEach((b) => b.classList.remove("active"));
      buttonEl.classList.add("active");
      renderCampaigns(btn.status);
    });
    filterBar.appendChild(buttonEl);
  });

  const main = document.querySelector("main");
  main.insertBefore(filterBar, main.querySelector("#campaignsContainer"));
}

// عرض تفاصيل الحملة في المودال
function showDetails(id) {
  const camp = campaignsData.find((c) => c.id === id);
  if (!camp) return;

  const statusInfo = getStatusInfo(camp.status);

  document.getElementById("modalTitle").textContent = camp.title;
  document.getElementById("modalId").textContent = camp.campaignCode;
  document.getElementById("modalStart").textContent = camp.startDate;
  document.getElementById("modalEnd").textContent = camp.endDate;
  document.getElementById(
    "modalGoal"
  ).textContent = `${camp.goal.toLocaleString()}${camp.currency}`;
  document.getElementById("modalRaised").textContent = `${(
    (camp.goal * camp.progress) /
    100
  ).toLocaleString()}${camp.currency}`;
  document.getElementById("modalDesc").textContent = camp.description;
  document.querySelector(
    ".modal-info"
  ).style.borderLeft = `6px solid ${statusInfo.color}`;

  // زر التبرع يظهر فقط للمستخدم
  const modalDonateBtn = document.querySelector(".modal-donate-btn");
  if (!isAdmin) {
    const isDisabled = ["completed", "ended", "paused"].includes(camp.status);
    modalDonateBtn.innerHTML = `<a href="${
      isDisabled ? "#" : `donate.html?type=donation&campaign=${camp.id}`
    }" class="btn btn-primary ${isDisabled ? "disabled" : ""}" ${
      isDisabled ? 'onclick="return false;"' : ""
    }>تبرع الآن</a>`;
  } else {
    // للأدمن لا يظهر زر
    modalDonateBtn.innerHTML = "";
  }

  document.getElementById("detailModal").style.display = "flex";
}

// حذف حملة (تجريبي)
function deleteCampaign(id) {
  if (confirm("هل أنت متأكد من حذف هذه الحملة؟")) {
    alert("تم حذف الحملة (تجريبي)");
    renderCampaigns();
  }
}

// مشاركة الحملة
function shareCampaign(id) {
  const camp = campaignsData.find((c) => c.id === id);
  if (!camp) return;

  const url = `${window.location.origin}/donate.html?type=donation&campaign=${id}`;

  const shareModal = document.createElement("div");
  shareModal.className = "modal-overlay";
  shareModal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close">&times;</button>
      <h3>مشاركة الحملة: ${camp.title}</h3>
      <div class="share-icons">
        <a href="https://wa.me/?text=${encodeURIComponent(
          url
        )}" target="_blank">
          <i class="fab fa-whatsapp"></i>
        </a>
        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}" target="_blank">
          <i class="fab fa-facebook"></i>
        </a>
        <button onclick="navigator.clipboard.writeText('${url}'); alert('تم نسخ الرابط');">
          <i class="fas fa-link"></i>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(shareModal);
  shareModal.style.display = "flex";

  shareModal.querySelector(".modal-close").addEventListener("click", () => {
    shareModal.remove();
  });
  shareModal.addEventListener("click", (e) => {
    if (e.target === shareModal) shareModal.remove();
  });
}
