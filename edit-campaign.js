document.addEventListener("DOMContentLoaded", () => {
  // ---------- عناصر الفورم ----------
  const campaignCode = document.getElementById("campaignCode");
  const title = document.getElementById("title");
  const goal = document.getElementById("goal");
  const currency = document.getElementById("currency");
  const startDate = document.getElementById("startDate");
  const endDate = document.getElementById("endDate");
  const calculatedDuration = document.getElementById("calculatedDuration");
  const statusInput = document.getElementById("status");
  const description = document.getElementById("description");
  const pauseYes = document.getElementById("pauseYes");
  const pauseNo = document.getElementById("pauseNo");
  const editForm = document.getElementById("editForm");
  const successMsg = document.getElementById("successMsg");

  const imageInput = document.getElementById("image");
  const imagePreview = document.getElementById("imagePreview");
  const cancelBtn = document.getElementById("cancelBtn");

  // ---------- تحميل بيانات الحملة ----------
  let originalCampaignData = {}; // لتخزين البيانات الأصلية

  function loadCampaignData() {
    // بيانات وهمية مؤقتة قبل الربط بالباك اند
    const campaignData = {
      code: "CAMP123",
      title: "حملة علاجية للأطفال",
      goal: 5000,
      currency: "ILS",
      startDate: "2025-10-15",
      endDate: "2025-12-15",
      status: "نشطة",
      description: "وصف الحملة هنا...",
      imageUrl: "default-campaign.jpg"
    };

    // نسخ البيانات الأصلية
    originalCampaignData = { ...campaignData };

    campaignCode.value = campaignData.code;
    title.value = campaignData.title;
    goal.value = campaignData.goal;
    currency.value = campaignData.currency;
    startDate.value = campaignData.startDate;
    endDate.value = campaignData.endDate;
    description.value = campaignData.description;

    // عرض الصورة الحالية
    setImagePreview(campaignData.imageUrl);

    updateDuration();
    updateStatus();
  }

  // ---------- معاينة الصورة ----------
  function setImagePreview(url) {
    imagePreview.innerHTML = `<img src="${url}" alt="صورة الحملة" style="width:100%;height:auto;border-radius:5px;">`;
  }

  imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      // إذا لم يختار أي صورة جديدة، عرض الصورة القديمة
      setImagePreview(originalCampaignData.imageUrl);
    }
  });

  // ---------- حساب المدة ----------
  function updateDuration() {
    const start = new Date(startDate.value);
    const end = new Date(endDate.value);

    if (start && end) {
      if (end < start) {
        // إذا تاريخ النهاية قبل البداية، عرض تحذير في صندوق المدة
        calculatedDuration.value = "❌ التاريخ غير صحيح!";
        calculatedDuration.style.color = "red";
        return false;
      } else {
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

        calculatedDuration.value = durationText;
        calculatedDuration.style.color = "black"; // إعادة اللون الطبيعي
        return true;
      }
    } else {
      calculatedDuration.value = "";
      calculatedDuration.style.color = "black";
      return false;
    }
  }

  // ---------- تحديث الحالة ----------
  function updateStatus() {
    const today = new Date();
    const start = new Date(startDate.value);
    const end = new Date(endDate.value);

    if (statusInput.dataset.manual !== "true") {
      if (today < start) {
        statusInput.value = "مجدولة";
      } else if (today >= start && today <= end) {
        statusInput.value = "نشطة";
      } else if (today > end) {
        statusInput.value = "منتهية";
      }
    }
  }

  // ---------- زر التعليق ----------
  pauseYes.addEventListener("click", () => {
    statusInput.value = "معلقة";
    statusInput.dataset.manual = "true";
  });

  pauseNo.addEventListener("click", () => {
    statusInput.dataset.manual = "false";
    updateStatus();
  });

  // ---------- التحقق من التواريخ عند التغيير ----------
  startDate.addEventListener("change", () => {
    updateDuration();
    updateStatus();
  });

  endDate.addEventListener("change", () => {
    updateDuration();
    updateStatus();
  });

  // ---------- زر إلغاء التعديل ----------
  cancelBtn.addEventListener("click", () => {
    campaignCode.value = originalCampaignData.code;
    title.value = originalCampaignData.title;
    goal.value = originalCampaignData.goal;
    currency.value = originalCampaignData.currency;
    startDate.value = originalCampaignData.startDate;
    endDate.value = originalCampaignData.endDate;
    description.value = originalCampaignData.description;

    statusInput.dataset.manual = "false";
    updateStatus();

    setImagePreview(originalCampaignData.imageUrl);
    updateDuration();
  });

  // ---------- حفظ التعديلات ----------
  editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!updateDuration()) {
      // الادمن سيرى التحذير في صندوق المدة
      return;
    }

    const updatedCampaign = {
      code: campaignCode.value,
      title: title.value,
      goal: goal.value,
      currency: currency.value,
      startDate: startDate.value,
      endDate: endDate.value,
      status: statusInput.value,
      description: description.value,
      imageFile: imageInput.files[0] || null
    };

    // هنا يمكن إرسال البيانات للباك اند لاحقًا
    console.log("حفظ الحملة:", updatedCampaign);

    // رسالة نجاح مؤقتة
    successMsg.style.display = "block";
    setTimeout(() => {
      successMsg.style.display = "none";
    }, 3000);
  });

  // ---------- تحميل البيانات عند البداية ----------
  loadCampaignData();
});
