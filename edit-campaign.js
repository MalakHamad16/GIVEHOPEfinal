// edit-campaign.js

// بيانات تجريبية للحملة الحالية (أضف حقل العملة)
const currentCampaign = {
  id: 1,
  title: "سقيا ماء",
  goal: 20000,
  currency: "ILS", // ✅ أضف العملة هنا
  durationValue: 60,
  durationUnit: "days",
  description:
    "كن عوناً في توفير السقيا والمياه العذبة في المناطق والقرى الأشد احتياجا للماء",
  imageUrl: "images/water.jpg",
};

let originalData = { ...currentCampaign };

document.addEventListener("DOMContentLoaded", () => {
  // ملء الحقول بالبيانات الحالية (بما في ذلك العملة)
  document.getElementById("title").value = currentCampaign.title;
  document.getElementById("goal").value = currentCampaign.goal;
  document.getElementById("currency").value = currentCampaign.currency; // ✅
  document.getElementById("durationValue").value =
    currentCampaign.durationValue;
  document.getElementById("durationUnit").value = currentCampaign.durationUnit;
  document.getElementById("description").value = currentCampaign.description;

  // عرض الصورة الحالية
  const preview = document.getElementById("imagePreview");
  if (currentCampaign.imageUrl) {
    preview.innerHTML = `<img src="${currentCampaign.imageUrl}" alt="حملة" style="width:100%;height:100%;border-radius:12px;object-fit:cover;">`;
  }

  // معاينة صورة جديدة
  document.getElementById("image")?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        preview.innerHTML = `<img src="${ev.target.result}" alt="معاينة" style="width:100%;height:100%;border-radius:12px;object-fit:cover;">`;
      };
      reader.readAsDataURL(file);
    }
  });

  // زر الإلغاء
  document.getElementById("cancelBtn")?.addEventListener("click", () => {
    if (confirm("هل أنت متأكد من إلغاء التعديلات؟")) {
      document.getElementById("title").value = originalData.title;
      document.getElementById("goal").value = originalData.goal;
      document.getElementById("currency").value = originalData.currency;
      document.getElementById("durationValue").value =
        originalData.durationValue;
      document.getElementById("durationUnit").value = originalData.durationUnit;
      document.getElementById("description").value = originalData.description;

      if (originalData.imageUrl) {
        preview.innerHTML = `<img src="${originalData.imageUrl}" alt="حملة" style="width:100%;height:100%;border-radius:12px;object-fit:cover;">`;
      } else {
        preview.innerHTML = '<i class="fas fa-image"></i>';
      }

      document.getElementById("image").value = "";
    }
  });

  // ✅ حدث إرسال واحد فقط
  document.getElementById("editForm")?.addEventListener("submit", (e) => {
    e.preventDefault();

    // جمع جميع البيانات (بما في ذلك العملة)
    const title = document.getElementById("title").value;
    const goal = document.getElementById("goal").value;
    const currency = document.getElementById("currency").value;
    const durationValue = document.getElementById("durationValue").value;
    const durationUnit = document.getElementById("durationUnit").value;
    const description = document.getElementById("description").value;

    console.log("بيانات الحملة المعدّلة:", {
      title,
      goal,
      currency,
      durationValue,
      durationUnit,
      description,
    });

    // لاحقًا: إرسال البيانات إلى الباك-إند عبر fetch()

    // عرض رسالة النجاح
    const successMsg = document.getElementById("successMsg");
    successMsg.style.display = "block";
    successMsg.scrollIntoView({ behavior: "smooth", block: "center" });

    // إخفاء الرسالة بعد 3 ثوانٍ
    setTimeout(() => {
      successMsg.style.display = "none";
    }, 3000);
  });
});
