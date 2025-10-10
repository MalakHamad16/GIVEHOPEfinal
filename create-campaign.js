// create-campaign.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("campaignForm");
  const successMsg = document.getElementById("successMsg");
  const imageInput = document.getElementById("image");
  const preview = document.getElementById("imagePreview");

  // معاينة الصورة
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

  // إرسال النموذج (حدث واحد فقط)
  form?.addEventListener("submit", (e) => {
    e.preventDefault();

    //  جمع جميع البيانات 
    const title = document.getElementById("title").value;
    const goal = document.getElementById("goal").value;
    const currency = document.getElementById("currency").value; // ← هنا
    const durationValue = document.getElementById("durationValue").value;
    const durationUnit = document.getElementById("durationUnit").value;
    const description = document.getElementById("description").value;

    //  طباعة البيانات للتحقق (اختياري)
    console.log({
      title,
      goal,
      currency,
      durationValue,
      durationUnit,
      description,
    });

    // لاحقًا: إرسال البيانات إلى الباك-إند عبر fetch()

    // مسح النموذج
    form.reset();
    preview.innerHTML = '<i class="fas fa-image"></i>';

    // إظهار رسالة النجاح
    successMsg.style.display = "block";
    successMsg.scrollIntoView({ behavior: "smooth", block: "center" });

    // إخفاء الرسالة بعد 3 ثوانٍ
    setTimeout(() => {
      successMsg.style.display = "none";
    }, 3000);
  });
});
