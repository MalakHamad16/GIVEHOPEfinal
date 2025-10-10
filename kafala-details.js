// kafala-details.js

// نفس بيانات casesData من sponsor.js
const casesData = [
  {
    id: "ORP001",
    type: "educational",
    title: "أهلاً، أنا ياسمين وعمري 16 سنة",
    image: "images/girl.jpg",
    totalAmount: 400,
    duration: "6 أشهر",
    description:
      "أحتاج دعماً تعليمياً ونفسياً لأكمل دراستي وأحقق حلمي بأن أكون طبيبة.",
    isSponsored: false,
  },
  {
    id: "ORP002",
    type: "orphans",
    title: "أهلاً، أنا ليان وعمري 6 سنوات",
    image: "images/orphan2.jpg",
    totalAmount: 400,
    duration: "7 أشهر",
    description: "اسمي ليان ، عمري 6سنوات ، أحتاج من يدعمني لأوفر ملابس وغذاء ",
    isSponsored: true,
  },
  {
    id: "ORP003",
    type: "educational",
    title: "أهلاً، أنا عبدالله وعمري 16 سنة",
    image: "images/student.jpg",
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
    totalAmount: 400,
    duration: "5 أشهر",
    description:
      "أعيش مع جدتي المسنة وأحتاج دعماً لتأمين الغذاء والماء والكهرباء.",
    isSponsored: false,
  },
];

// دالة لتحويل نوع الكفالة إلى نص عربي
const getTypeText = (type) => {
  const types = {
    orphans: "أيتام وأطفال",
    educational: "تعليمية",
    health: "صحية",
    living: "معيشية",
  };
  return types[type] || type;
};

// دالة لحساب تاريخ الانتهاء
const calculateEndDate = (duration) => {
  const months = parseInt(duration);
  const today = new Date();
  const endDate = new Date(today);
  endDate.setMonth(endDate.getMonth() + months);

  return endDate.toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// عرض تفاصيل الحالة
const displayCaseDetails = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const caseId = urlParams.get("id");

  if (!caseId) {
    document.querySelector(".kafala-card").innerHTML =
      '<div class="alert alert-warning text-center m-4">لم يتم تحديد حالة للكفالة.</div>';
    return;
  }

  const caseItem = casesData.find((c) => c.id === caseId);
  if (!caseItem) {
    document.querySelector(".kafala-card").innerHTML =
      '<div class="alert alert-info text-center m-4">الحالة المطلوبة غير موجودة.</div>';
    return;
  }

  // عرض البيانات
  document.getElementById("caseTitle").textContent = caseItem.title;
  document.getElementById("caseImage").src = caseItem.image;
  document.getElementById("caseId").textContent = `رقم الحالة: ${caseItem.id}`;
  document.getElementById("caseDescription").textContent = caseItem.description;
  document.getElementById("caseType").textContent = getTypeText(caseItem.type);
  document.getElementById(
    "totalAmount"
  ).textContent = `${caseItem.totalAmount} ₪`;
  document.getElementById("duration").textContent = caseItem.duration;
  document.getElementById("endDate").textContent = calculateEndDate(
    caseItem.duration
  );

  // عرض ختم "مكفول" إذا كانت الحالة مكفولة
  const sponsoredBadge = document.getElementById("sponsoredBadge");
  const sponsorLink = document.getElementById("sponsorLink");

  if (caseItem.isSponsored) {
    sponsoredBadge.style.display = "block";
    sponsorLink.classList.add("disabled");
    sponsorLink.style.opacity = "0.6";
    sponsorLink.style.pointerEvents = "none";
    sponsorLink.innerHTML = '<i class="fas fa-check"></i> تم الكفالة';
  } else {
    sponsorLink.href = `sponsorform.html?id=${caseItem.id}`;
  }
};

// وظائف المشاركة
const setupShareFunctionality = () => {
  // زر فتح نافذة المشاركة
  document.getElementById("shareBtn").addEventListener("click", () => {
    const modal = new bootstrap.Modal(document.getElementById("shareModal"));
    modal.show();
  });

  // مشاركة عبر واتساب
  document.getElementById("whatsappShare").addEventListener("click", (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const caseId = urlParams.get("id");
    const caseItem = casesData.find((c) => c.id === caseId);
    const url = window.location.href;
    const text = caseItem
      ? `ادعم ${caseItem.title} في كفالته عبر GiveHope`
      : "ادعم هذه الكفالة عبر GiveHope";
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
      "_blank"
    );
  });

  // مشاركة عبر فيسبوك
  document.getElementById("facebookShare").addEventListener("click", (e) => {
    e.preventDefault();
    const url = window.location.href;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank",
      "width=600,height=400"
    );
  });

  // نسخ الرابط
  document.getElementById("copyLink").addEventListener("click", () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      const toast = new bootstrap.Toast(document.getElementById("copyToast"));
      toast.show();
    });
  });
};

// تشغيل عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
  displayCaseDetails();
  setupShareFunctionality();
});

document.addEventListener("DOMContentLoaded", () => {
  // اقرأ معرّف الحالة من الرابط
  const urlParams = new URLSearchParams(window.location.search);
  const caseId = urlParams.get("id");

  if (caseId) {
    // عيّن الرابط الصحيح لزر "اكفل الآن"
    const sponsorLink = document.getElementById("sponsorLink");
    sponsorLink.href = `donate.html?type=sponsor&id=${caseId}`;
  } else {
    // إذا ما في ID، اجعل الزر معطّلًا
    document.getElementById("sponsorLink").style.opacity = "0.5";
    document.getElementById("sponsorLink").style.pointerEvents = "none";
  }
});
