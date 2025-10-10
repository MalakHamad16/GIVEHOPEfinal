// بيانات الحالات — تم إضافة isSponsored
const casesData = [
  {
    id: "ORP001",
    type: "educational",
    title: "أهلاً، أنا ياسمين وعمري 16 سنة",
    image: "images/girl.jpg",
    progress: 50,
    totalAmount: 400,
    duration: "6 أشهر",
    description:
      "أحتاج دعماً تعليمياً ونفسياً لأكمل دراستي وأحقق حلمي بأن أكون طبيبة.",
    isSponsored: false, // غير مكفولة
  },
  {
    id: "ORP002",
    type: "orphans",
    title: "أهلاً، أنا ليان وعمري 6 سنوات",
    image: "images/orphan2.jpg",
    progress: 58,
    totalAmount: 400,
    duration: "7 أشهر",
    description: "اسمي ليان ، عمري 6سنوات ، أحتاج من يدعمني لأوفر ملابس وغذاء ",
    isSponsored: true, // مكفولة
  },
  {
    id: "ORP003",
    type: "educational",
    title: "أهلاً، أنا عبدالله وعمري 16 سنة",
    image: "images/student.jpg",
    progress: 67,
    totalAmount: 400,
    duration: "8 أشهر",
    description:
      "أحب القراءة وأريد أن أحصل على كتب ومصادر تعليمية لتطوير نفسي.",
    isSponsored: false,
  },
  {
    id: "EDU001",
    type: "educational",
    title: "أهلاً، أنا مبارك وعمري 16 سنة",
    image: "images/girl.jpg",
    progress: 29,
    totalAmount: 400,
    duration: "3 أشهر",
    description:
      "أحتاج مساعدة لشراء أدوات مدرسية وحاسوب لمواصلة دراستي عن بعد.",
    isSponsored: false,
  },
  {
    id: "HEA001",
    type: "health",
    title: "أهلاً، أنا مها وعمري 16 سنة",
    image: "images/sick.jpg",
    progress: 33,
    totalAmount: 400,
    duration: "4 أشهر",
    description:
      "أعاني من مشكلة صحية تحتاج لعلاج مستمر وأحتاج مساعدة لتغطية التكاليف.",
    isSponsored: true,
  },
  {
    id: "LIV001",
    type: "living",
    title: "أهلاً، أنا سعد وعمري 16 سنة",
    image: "images/family.jpg",
    progress: 42,
    totalAmount: 400,
    duration: "5 أشهر",
    description:
      "أعيش مع جدتي المسنة وأحتاج دعماً لتأمين الغذاء والماء والكهرباء.",
    isSponsored: false,
  },
];

// تحميل البطاقات حسب الفلتر + إعادة الترتيب (غير المكفولة أولًا)
function loadCases(filter = "all") {
  const container = document.getElementById("casesContainer");
  container.innerHTML = "";

  let filteredCases =
    filter === "all"
      ? casesData
      : casesData.filter((caseItem) => caseItem.type === filter);

  // إعادة الترتيب: غير المكفولة أولاً، ثم المكفولة
  filteredCases.sort((a, b) => {
    if (a.isSponsored && !b.isSponsored) return 1;
    if (!a.isSponsored && b.isSponsored) return -1;
    return 0;
  });

  filteredCases.forEach((caseItem) => {
    const card = document.createElement("div");
    card.className = "col-md-4";
    card.innerHTML = `
      <div class="sponsor-card ${caseItem.isSponsored ? "sponsored" : ""}">
        <div class="card-image">
          <img src="${caseItem.image}" alt="${caseItem.title}">
          ${
            caseItem.isSponsored
              ? '<div class="sponsored-badge">مكفول</div>'
              : ""
          }
          <div class="amount-tag">تكلفة الكفالة: ${caseItem.totalAmount} ₪</div>
        </div>
        <div class="card-body">
          <h3>${caseItem.title}</h3>
          <div class="duration-info">
            <div class="duration-item">
              <span>مدة الكفالة</span>
              <strong>${caseItem.duration}</strong>
            </div>
          </div>
          <div class="card-actions">
  <a href="kafala-details.html?id=${
    caseItem.id
  }" class="btn btn-outline-primary btn-sm">عرض التفاصيل</a>
  ${
    caseItem.isSponsored
      ? '<a href="#" class="btn btn-primary btn-sm disabled" style="pointer-events: none; opacity: 0.6;">اكفل الآن</a>'
      : `<a href="donate.html?type=sponsor&id=${caseItem.id}" class="btn btn-primary btn-sm">اكفل الآن</a>`
  }
</div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// تفعيل أزرار الفلترة
document.addEventListener("DOMContentLoaded", () => {
  loadCases("all");

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      loadCases(filter);
    });
  });
});
