document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("campaignForm");
  const successMsg = document.getElementById("successMsg");
  const imageInput = document.getElementById("image");
  const preview = document.getElementById("imagePreview");
  const startDate = document.getElementById("startDate");
  const endDate = document.getElementById("endDate");
  const durationField = document.getElementById("calculatedDuration");
  const campaignCodeField = document.getElementById("campaignCode");
  const statusDisplay = document.getElementById("statusDisplay");

  // 🔹 توليد رقم تسلسلي تلقائي (A001, A002...) مؤقت
  let campaignCounter = 1;
  function generateCampaignCode() {
    const code = "A" + campaignCounter.toString().padStart(3, "0");
    campaignCounter++;
    return code;
  }

  // تعيين رقم الحملة عند فتح الصفحة
  campaignCodeField.value = generateCampaignCode();

  // 🔹 معاينة الصورة
  imageInput?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        preview.innerHTML = `<img src="${ev.target.result}" alt="معاينة" style="width:100%;height:100%;border-radius:12px;object-fit:cover;">`;
      };
      reader.readAsDataURL(file);
    } else {
      preview.innerHTML = '<i class="fas fa-image"></i>';
    }
  });

  // 🔹 حساب المدة تلقائيًا عند اختيار التواريخ
  function updateDuration() {
    if (startDate.value && endDate.value) {
      const start = new Date(startDate.value);
      const end = new Date(endDate.value);
      if (end >= start) {
        const diffTime = end - start;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        let durationText = "";
        if (diffDays < 30) {
          durationText = `${diffDays} يوم`;
        } else if (diffDays < 365) {
          const months = Math.floor(diffDays / 30);
          durationText = `${months} شهر`;
        } else {
          const years = Math.floor(diffDays / 365);
          durationText = `${years} سنة`;
        }

        durationField.value = durationText;
        durationField.style.color = "black"; // اللون الطبيعي عند التواريخ الصحيحة
        return true;
      } else {
        durationField.value = "❌ التاريخ غير صحيح!";
        durationField.style.color = "red"; // لون أحمر للتحذير
        return false;
      }
    } else {
      durationField.value = "";
      durationField.style.color = "black";
      return false;
    }
  }

  startDate.addEventListener("change", () => {
    updateDuration();
    updateStatus();
  });
  endDate.addEventListener("change", () => {
    updateDuration();
    updateStatus();
  });

  // 🔹 تحديث حالة الحملة تلقائيًا حسب تاريخ البداية
  function updateStatus() {
    if (!startDate.value) {
      statusDisplay.value = "";
      return;
    }

    const today = new Date();
    const start = new Date(startDate.value);

    let status = start <= today ? "نشطة (Active)" : "مجدولة (Scheduled)";
    statusDisplay.value = status;
  }

  startDate.addEventListener("change", updateStatus);

  // 🔹 إرسال النموذج
  form?.addEventListener("submit", (e) => {
    e.preventDefault();

    // التحقق من التواريخ
    if (!updateDuration()) {
      // التحذير يظهر مباشرة في حقل المدة باللون الأحمر
      return;
    }

    // جمع جميع البيانات
    const title = document.getElementById("title").value;
    const goal = parseFloat(document.getElementById("goal").value);
    const currency = document.getElementById("currency").value;
    const description = document.getElementById("description").value;
    const start = startDate.value;
    const end = endDate.value;
    const duration = durationField.value;
    const campaignCode = campaignCodeField.value;
    const imageFile = imageInput.files[0] || null;

    // 🔹 تحديد الحالة تلقائيًا (للإرسال)
    const today = new Date();
    const startObj = new Date(start);
    let status = startObj <= today ? "active" : "scheduled";

    // تحديث العرض في الصفحة أيضًا
    statusDisplay.value =
      status === "active" ? "نشطة (Active)" : "مجدولة (Scheduled)";

    const campaignData = {
      campaignCode,
      title,
      goal,
      currency,
      startDate: start,
      endDate: end,
      duration,
      status,
      description,
      imageFile,
    };

    console.log("📦 بيانات الحملة:", campaignData);

    // 🔹 لاحقًا: إرسال البيانات إلى الباك-إند عبر fetch()

    // مسح النموذج
    form.reset();
    preview.innerHTML = '<i class="fas fa-image"></i>';
    campaignCodeField.value = generateCampaignCode(); // رقم جديد للحملة التالية
    durationField.value = "";
    durationField.style.color = "black";
    statusDisplay.value = "";

    // 🔹 إظهار رسالة النجاح
    successMsg.style.display = "block";
    successMsg.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => {
      successMsg.style.display = "none";
    }, 3000);
  });
});
