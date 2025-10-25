
//عرض الصور المصغرة 
   function changeImage(element) {
      document.getElementById('mainImage').src = element.src;
      document.querySelectorAll('.thumbs img').forEach(img => img.classList.remove('active'));
      element.classList.add('active');
    }

  

const isAdmin = false; 
  let reportToEdit = null;

  // تفعيل أدوات الأدمن
  if (isAdmin) {
    document.getElementById("adminControls").style.display = "block";
    document.querySelectorAll(".admin-actions").forEach(div => {
      div.style.display = "inline-flex";
    });
  }

  // إضافة تقرير جديد
  function saveReport() {
    const title = document.getElementById("reportTitle").value;
    const fileInput = document.getElementById("reportFile");
    
    if (!title || fileInput.files.length === 0) {
      alert("الرجاء إدخال العنوان واختيار ملف PDF ✅");
      return;
    }

    const reportsList = document.getElementById("reportsList");
    const newItem = document.createElement("li");
    newItem.className = "list-group-item d-flex justify-content-between align-items-center";
    newItem.innerHTML = `<span>📄 ${title} – <a href="#">تحميل PDF</a></span>`;

    if (isAdmin) {
      const actions = document.createElement("div");
      actions.className = " admin-actions";
      actions.style.display = "inline-flex";

      const editBtn = document.createElement("button");
      editBtn.className = "btn btn-warning btn-sm mx-1 text-white";
      editBtn.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> تعديل`;

      editBtn.onclick = function () {
        reportToEdit = newItem.querySelector("span");
        document.getElementById("editReportTitle").value = reportToEdit.textContent.split("–")[0].trim();
        const modal = new bootstrap.Modal(document.getElementById('editReportModal'));
        modal.show();
      };

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "btn btn-danger btn-sm text-white";
      deleteBtn.innerHTML=`<i class="fa-solid fa-trash"></i> حذف`;
      deleteBtn.onclick = function () {
        newItem.remove();
        alert("تم حذف التقرير ✅");
      };

      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);
      newItem.appendChild(actions);
    }

    reportsList.appendChild(newItem);

    bootstrap.Modal.getInstance(document.getElementById('addReportModal')).hide();
    document.getElementById("reportForm").reset();
    alert("تم رفع التقرير ");
  }

  // تحديث التقرير بعد التعديل
  function updateReport() {
    const newTitle = document.getElementById("editReportTitle").value;
    if (!newTitle) {
      alert("الرجاء إدخال عنوان جديد ✅");
      return;
    }
    reportToEdit.innerHTML =`<span> 📄 ${newTitle} – <a href="#">تحميل PDF</a></span>`;
    bootstrap.Modal.getInstance(document.getElementById('editReportModal')).hide();
    alert("تم تعديل التقرير ✅");
  }

  // تفعيل الحذف والتعديل للتقارير الحالية
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.onclick = function () {
      reportToEdit = btn.closest("li").querySelector("span");
      document.getElementById("editReportTitle").value = reportToEdit.textContent.split("–")[0].trim();
      const modal = new bootstrap.Modal(document.getElementById('editReportModal'));
      modal.show();
    };
  });

  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.onclick = function () {
      btn.closest("li").remove();
      alert("تم حذف التقرير ✅");
    };
  });

  //مشاركة المشروع
  function copyLink() {
    const link = window.location.href; 
    navigator.clipboard.writeText(link).then(() => {
     
      const msg = document.createElement("div");
      msg.innerText = "✅ تم نسخ الرابط";
      msg.style.color = "green";
      msg.style.fontSize = "14px";
      msg.style.marginTop = "10px";

      const modalBody = document.querySelector("#shareModal .modal-body");
      modalBody.appendChild(msg);

      setTimeout(() => msg.remove(), 2000);
    });
  }
  //رسالة عدم وجود تقارير بعد
  function checkReports() {
  const reportsList = document.getElementById("reportsList");
  const noReportsMsg = document.getElementById("noReportsMsg");

  if (reportsList.children.length === 0) {
    noReportsMsg.style.display = "block"; // أظهر الرسالة
  } else {
    noReportsMsg.style.display = "none";  // أخفي الرسالة
  }
}

// تشغيل عند بداية الصفحة
checkReports();

// عند الضغط على زر الحذف
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete-btn")) {
    const reportItem = e.target.closest("li");
    if (reportItem) {
      reportItem.remove(); 
      checkReports(); // فحص بعد الحذف
    }
  }
});
