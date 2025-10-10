// donate.js - المنطق الموحّد لنموذج الدفع

// === 1. تحميل الـ Navbar و Footer ===
function loadHTML(id, file) {
  fetch(file)
    .then((res) => res.text())
    .then((html) => (document.getElementById(id).innerHTML = html))
    .catch((err) => console.error("خطأ في تحميل", file, err));
}

// === 2. إعدادات أنواع الدفع ===
const PAYMENT_TYPES = {
  zakat: {
    title: "أخرج زكاتك الآن",
    verse:
      "﴿ خُذْ مِنْ أَمْوَالِهِمْ صَدَقَةً تُطَهِّرُهُمْ وَتُزَكِّيهِمْ بِهَا ﴾",
    amountLabel: "مبلغ الزكاة",
    btnText: "أخرج زكاتك",
    thankTitle: "شكرًا لإخراج زكاتك!",
    thankDesc: "سيتم إرسال إيصال الزكاة إلى بريدك الإلكتروني خلال دقائق.",
    minAmountCheck: true,
    pageType: "zakat", // ← هذا صحيح
  },
  donation: {
    title: "تبرع الآن",
    verse: "﴿ وَأَحْسِنُوٓا۟ ۛ إِنَّ ٱللَّهَ يُحِبُّ ٱلْمُحْسِنِينَ﴾",
    amountLabel: "مبلغ التبرع",
    btnText: "تبرع الآن",
    thankTitle: "شكرًا لتبرعك الكريم!",
    thankDesc: "سيتم إرسال إيصال التبرع إلى بريدك الإلكتروني خلال دقائق.",
    minAmountCheck: false,
    pageType: "donation", // ← غيرها من "default" إلى "donation"
  },
  sponsor: {
    title: "اكفل الآن",
    verse:
      "﴿ وَيَسْأَلُونَكَ عَنِ الْيَتَامَىٰ قُلْ إِصْلَاحٌ لَّهُمْ خَيْرٌ ﴾",
    amountLabel: "مبلغ الكفالة",
    btnText: "اكفل الآن",
    thankTitle: "شكرًا لكفالة هذه الحالة!",
    thankDesc: "سيتم إرسال تفاصيل الكفالة إلى بريدك الإلكتروني خلال دقائق.",
    minAmountCheck: false,
    pageType: "sponsor", // ← غيرها من "default" إلى "sponsor"
  },
};

// === 3. دالة تحميل تفاصيل الحالة (للكفالة) ===
function loadCaseDetails(caseId) {
  // محاكاة تحميل البيانات (في الواقع، ستأتي من ملف data.js أو API)
  // هنا نستخدم بيانات وهمية للعرض
  const mockCase = {
    id: caseId,
    title: "كفالة أسرة يتيم",
    image: "https://via.placeholder.com/120?text=حالة+كفالة",
    type: "orphans",
    duration: "سنة كاملة",
  };

  const typeMap = {
    orphans: "أيتام وأطفال",
    educational: "تعليمية",
    health: "صحية",
    living: "معيشية",
  };

  document.getElementById("caseInfo").innerHTML = `
    <div class="row align-items-center">
      <div class="col-md-3 text-center mb-3 mb-md-0">
        <img src="${mockCase.image}" alt="${
    mockCase.title
  }" class="img-fluid rounded" style="max-height: 120px; object-fit: cover;">
      </div>
      <div class="col-md-9">
        <h4>${mockCase.title}</h4>
        <p><strong>نوع الكفالة:</strong> ${
          typeMap[mockCase.type] || mockCase.type
        }</p>
        <p><strong>المدة:</strong> ${mockCase.duration}</p>
      </div>
    </div>
  `;
  document.getElementById("caseInfo").style.display = "block";
}

// === 4. التهيئة عند تحميل الصفحة ===
document.addEventListener("DOMContentLoaded", () => {
  // تحميل المكونات المشتركة
  loadHTML("navbar-placeholder", "navbar.html");
  loadHTML("footer-placeholder", "footer.html");

  // قراءة نوع الدفع من الرابط
  const urlParams = new URLSearchParams(window.location.search);
  const type = urlParams.get("type") || "donation";
  const caseId = urlParams.get("id");

  // التحقق من النوع
  const config = PAYMENT_TYPES[type] || PAYMENT_TYPES.donation;

  // تحديث واجهة المستخدم
  document.getElementById("pageTitle").textContent = config.title;
  document.getElementById("pageVerse").innerHTML = config.verse;
  document.getElementById("amountLabel").textContent = config.amountLabel;
  document.getElementById("btnText").textContent = config.btnText;
  document.getElementById("thankTitle").textContent = config.thankTitle;
  document.getElementById("thankDesc").textContent = config.thankDesc;

  // تعيين نوع الصفحة للشات بوت
  window.pageType = config.pageType;

  // إذا كان كفالة، اعرض تفاصيل الحالة
  if (type === "sponsor" && caseId) {
    loadCaseDetails(caseId);
  }

  // === 5. معالجة إرسال النموذج ===
  const form = document.getElementById("donationForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const amount = parseFloat(document.getElementById("custom-amount").value);
      if (!amount || amount <= 0) {
        Swal.fire({
          icon: "error",
          title: "خطأ",
          text: "الرجاء إدخال مبلغ صالح",
        });
        return;
      }

      // التحقق من نصاب الزكاة (إذا لزم)
      if (config.minAmountCheck) {
        const CASH_NISAB_ILS = 25500;
        const currency = document.getElementById("currency").value;
        let nisab = CASH_NISAB_ILS;
        switch (currency) {
          case "USD":
            nisab = CASH_NISAB_ILS / 3.65;
            break;
          case "JOD":
            nisab = CASH_NISAB_ILS / 5.14;
            break;
          case "AED":
            nisab = CASH_NISAB_ILS / 0.99;
            break;
        }

        if (amount < nisab) {
          Swal.fire({
            icon: "error",
            title: "المبلغ أقل من النصاب",
            text: `المبلغ الذي أدخلته (${amount.toLocaleString()} ${currency}) أقل من نصاب الزكاة (${nisab.toLocaleString()} ${currency}).`,
          });
          return;
        }
      }

      // التحقق من اختيار طريقة دفع
      const paymentSelected = document.querySelector(
        'input[name="payment"]:checked'
      );
      if (!paymentSelected) {
        Swal.fire({
          icon: "warning",
          title: "اختر طريقة الدفع",
          text: "الرجاء اختيار طريقة دفع واحدة.",
        });
        return;
      }

      // عرض رسالة الشكر
      const thankMsg = document.getElementById("thankMessage");
      thankMsg.style.display = "block";

      // إخفاء الرسالة بعد 3 ثوانٍ
      setTimeout(() => {
        thankMsg.style.display = "none";
      }, 3000);

      // مسح الحقول (ما عدا خانات الراديو)
      const inputs = document.querySelectorAll(
        '#donationForm input:not([type="radio"]):not([type="checkbox"]), #donationForm select'
      );
      inputs.forEach((input) => (input.value = ""));

      // إلغاء اختيار خانات الراديو
      document
        .querySelectorAll('input[type="radio"]')
        .forEach((radio) => (radio.checked = false));

      // خيار مجهول الهوية
      const isAnonymous = document.getElementById("anonymous-donation").checked;
      console.log("تبرع مجهول:", isAnonymous);
    });
  }
});
