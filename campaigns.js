// campaigns.js

// 👇 غير هذا إلى true إذا كان المستخدم مسجّل دخوله كـ "إداري"
// لاحقًا: سيتم جلبه من API
const isAdmin = false; // غيّر إلى true لعرض واجهة الإداري

// بيانات تجريبية للحملات
const campaignsData = [
  {
    id: 1,
    title: "سقيا ماء ",
    goal: 20000,
    currency: "₪",
    duration: "60 يومًا",
    description:
      "كن عوناً في توفير السقيا والمياه العذبة في المناطق والقرى الأشد احتياجا للماء",
    progress: 72,
    image: "images/water.jpg",
  },
  {
    id: 2,
    title: "توفير أدوية",
    goal: 15000,
    currency: "₪",
    duration: "50 يومًا",
    description: "كن عوناً في توفير أدوية ل 50 مريضاً بحاجة ماسة ",
    progress: 68,
    image: "images/meds.jpg",
  },
  {
    id: 3,
    title: "العودة إلى المدارس",
    goal: 10000,
    currency: "₪",
    duration: "45 يومًا",
    description: "توفير حقائب مدرسية لأطفال المدارس، كن سبباً في نجاحهم",
    progress: 45,
    image: "images/books.jpg",
  },
];

document.addEventListener("DOMContentLoaded", () => {
  // إظهار زر الإنشاء للإداري فقط
  if (isAdmin) {
    document.getElementById("adminCreateBtn").style.display = "block";
  }

  // عرض الحملات
  renderCampaigns();

  // أحداث الـ Modal
  document.querySelector(".modal-close").addEventListener("click", () => {
    document.getElementById("detailModal").style.display = "none";
  });

  document.getElementById("detailModal").addEventListener("click", (e) => {
    if (e.target.id === "detailModal") {
      document.getElementById("detailModal").style.display = "none";
    }
  });
});

function renderCampaigns() {
  const container = document.getElementById("campaignsContainer");
  container.innerHTML = "";

  campaignsData.forEach((camp) => {
    const card = document.createElement("div");
    card.className = "campaign-card";

    // تحديد الصورة
    const imgSrc = camp.image || "images/default.jpg";
    const imgTag = `<img src="${imgSrc}" alt="${camp.title}">`;

    // تحديد الأزرار حسب الصلاحية
    let buttonsHtml = "";
    if (isAdmin) {
      buttonsHtml = `
        <a href="edit-campaign.html?id=${camp.id}" class="btn btn-admin-edit">تعديل</a>
        <button class="btn btn-admin-delete" onclick="deleteCampaign(${camp.id})">حذف</button>
      `;
    } else {
      buttonsHtml = `
        <a href="donate.html?type=donation&campaign=${camp.id}" class="btn btn-primary">تبرع الآن</a>
        <button class="btn btn-outline" onclick="showDetails(${camp.id})">عرض التفاصيل</button>
      `;
    }

    card.innerHTML = `
      <div class="campaign-image">${imgTag}</div>
      <div class="campaign-content">
        <h3 class="campaign-title">${camp.title}</h3>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${camp.progress}%"></div>
        </div>
        <div class="progress-text">
          <span>${((camp.goal * camp.progress) / 100).toLocaleString()}${
      camp.currency
    }</span>
          <span>من ${camp.goal.toLocaleString()}${camp.currency}</span>
        </div>
        <p style="font-size:0.95rem; color:#475569; margin:0.8rem 0;">${
          camp.description
        }</p>
        <p style="font-size:0.9rem; color:#64748b;"><i class="fas fa-clock"></i> ${
          camp.duration
        }</p>
        <div class="card-buttons">
          ${buttonsHtml}
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function showDetails(id) {
  const camp = campaignsData.find((c) => c.id === id);
  if (camp) {
    document.getElementById("modalTitle").textContent = camp.title;
    document.getElementById(
      "modalGoal"
    ).textContent = `${camp.goal.toLocaleString()}${camp.currency}`;
    document.getElementById("modalDuration").textContent = camp.duration;
    document.getElementById("modalDesc").textContent = camp.description;
    document.getElementById("detailModal").style.display = "flex";
  }
}

function deleteCampaign(id) {
  if (confirm("هل أنت متأكد من حذف هذه الحملة؟")) {
    // لاحقًا: إرسال طلب حذف إلى الباك-إند
    alert("تم حذف الحملة (تجريبي)");
    location.reload();
  }
}
