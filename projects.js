

  //  البحث
  document.getElementById("search").addEventListener("input", function() {
    let query = this.value.toLowerCase();
    document.querySelectorAll(".card-box").forEach(card => {
      let title = card.querySelector(".title").textContent.toLowerCase();
      card.style.display = title.includes(query) ? "block" : "none";
    });
  });

  function getTypeName(type) {
    const typeNames = {
        "health": "صحية",
        "education": "تعليمية",
        "living": "معيشية",
        "orphans": "رعاية أيتام"
    };
    return typeNames[type] || "أخرى";
}


  //  التصنيف
  document.querySelectorAll(".filter-btn").forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter; // جاب القيمة من الزر
    
    // غيّر حالة الـ active
    document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    // فلترة الكروت
    document.querySelectorAll(".card-box").forEach(card => {
      const category = card.dataset.filter; // جاب القيمة من الكرت
      
      if (filter === "all" || filter === category) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});

document.querySelectorAll(".sort-btn").forEach(button => {
  button.addEventListener("click", () => {
    const sortType = button.dataset.sort;

    // تحديث حالة الزر النشط
    document.querySelectorAll(".sort-btn").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    const cards = Array.from(document.querySelectorAll(".card-box"));

    if (sortType === "default") {
      // الأحدث:    

    } else if (sortType === "urgent") {
      // الأكثر إلحاحاً: نجيب الكروت اللي فيها .bg-danger للأعلى
      cards.sort((a, b) => {
        const aUrgent = a.querySelector(".bg-danger") ? 1 : 0;
        const bUrgent = b.querySelector(".bg-danger") ? 1 : 0;
        return bUrgent - aUrgent; 
      });
      cards.forEach(card => card.parentElement.appendChild(card));
    } else if (sortType === "remaining") {
      // المتبقي قليل: نرتب حسب المبلغ المتبقي تصاعدي
      cards.sort((a, b) => {
        const aRemaining = parseFloat(a.querySelector('.money div:nth-child(3) p').textContent) || 0;
        const bRemaining = parseFloat(b.querySelector('.money div:nth-child(3) p').textContent) || 0;
        return aRemaining - bRemaining; // تصاعدي
      });
      cards.forEach(card => card.parentElement.appendChild(card));
    }
  });
});


//اجراءات الادمن  
document.addEventListener('DOMContentLoaded', function() {
  const isAdmin = false; 
  const addButton = document.querySelector('#add-project'); 
  const projectsContainer = document.getElementById('projects');

  let currentEditCard = null;

  //progress bar
  function updateProgressBar(project) {
  const totalAmount = parseFloat(project.querySelector('.money div:nth-child(1) p').textContent) || 0;
  const collectedAmount = parseFloat(project.querySelector('.money div:nth-child(2) p').textContent) || 0;
  const remainingAmountElem = project.querySelector('.money div:nth-child(3) p');

  // نسبة الإنجاز
  const progressPercent = totalAmount ? Math.min((collectedAmount / totalAmount) * 100, 100) : 0;

  // تحديث progress bar
  const progressBar = project.querySelector('.progress-bar');
  progressBar.style.width = progressPercent + '%';
  progressBar.textContent = Math.round(progressPercent) + '%';

  // تحديث المبلغ المتبقي
  const remainingAmount = Math.max(totalAmount - collectedAmount, 0);
  remainingAmountElem.innerHTML = remainingAmount + `<small>د.أ</small>`;

  // تحديث حالة المشروع
  const statusBadge = project.querySelector('.badge.bg-warning, .badge.bg-success');
  let banner = project.querySelector('.completed-banner');
  if (progressPercent >= 100) {
    if (statusBadge) statusBadge.className = 'badge bg-success mt-2 p-2';
    statusBadge.textContent = 'مكتمل';
      // إضافة البانر إذا مش موجود
    if (!banner) {
      banner = document.createElement('div');
      banner.className = 'completed-banner';
      banner.textContent = 'مكتمل';
      project.appendChild(banner);
      project.querySelector('.card').classList.add('completed-card');
    }
  } else {
    if (statusBadge) statusBadge.className = 'badge bg-warning text-white mt-2 p-2';
    statusBadge.textContent = 'قيد التنفيذ';
   // إذا رجع غير مكتمل، نشيل البانر
    if (banner) {
      banner.remove();
    }
  }
}


  // دالة لتفعيل أزرار الأدمن
  function updateAdminButtons() {
    const adminCards = document.querySelectorAll('.card-box');

    adminCards.forEach(card => {
      const editBtn = card.querySelector('.btn-success');
      const deleteBtn = card.querySelector('.btn-danger');
      const adminSection = card.querySelector('.admin-actions');

      if (isAdmin) {
        adminSection.classList.remove('d-none');
      } else {
        adminSection.classList.add('d-none');
      }

      // زر التعديل
      editBtn.onclick = () => {
        currentEditCard = card;

        const title = card.querySelector('.card-title').textContent;
        const description = card.querySelector('.card-text').textContent;
        const amount = card.querySelector('.money p').textContent.replace('د.أ','').trim();
        
        const category = card.getAttribute('data-filter');

         

        document.getElementById('edit-title').value = title;
        document.getElementById('edit-description').value = description;
        document.getElementById('edit-amount').value = amount;
        document.getElementById('edit-category').value = category;
       const urgentCheckbox = document.getElementById('edit-urgent');
        urgentCheckbox.checked = !!card.querySelector('.badge.bg-danger');

        const editModal = new bootstrap.Modal(document.getElementById('editProjectModal'));
        editModal.show();
      };

      // زر الحذف
      deleteBtn.onclick = () => {
        if (confirm('هل أنت متأكد من حذف المشروع؟')) {
          card.remove();
        }
      };
    });
  }

  // حفظ التعديلات
  document.getElementById('save-edit').addEventListener('click', function() {
    if (!currentEditCard) return;

    const newTitle = document.getElementById('edit-title').value;
    const newDescription = document.getElementById('edit-description').value;
    const newAmount = document.getElementById('edit-amount').value;
    const newCategory = document.getElementById('edit-category').value;
    const newImageInput = document.getElementById('edit-image');
    const newImageUrl = newImageInput.files[0] 
      ? URL.createObjectURL(newImageInput.files[0]) 
      : currentEditCard.querySelector('img').src;

    // تحديث الكرت
    currentEditCard.querySelector('.card-title').textContent = newTitle;
    currentEditCard.querySelector('.card-text').textContent = newDescription;
    currentEditCard.querySelector('.money p').textContent = newAmount + 'د.أ';
    currentEditCard.setAttribute('data-filter', newCategory);
    currentEditCard.querySelector('.badge.bg-info').textContent = getTypeName(newCategory);
    currentEditCard.querySelector('img').src = newImageUrl;

    // استدعاء تحديث progress bar
updateProgressBar(currentEditCard);
updateProjectDistribution(); 
    
  // عاجل أو لا
    const isUrgent = document.getElementById('edit-urgent').checked;
    const urgentBadge = currentEditCard.querySelector('.badge.bg-danger');

    if (isUrgent && !urgentBadge) {
      const badgeHtml = `<div style="position: absolute; top: 17px; right: 24px;">
                          <span class="badge bg-danger">عاجل</span>
                        </div>`;
      currentEditCard.querySelector('.card').insertAdjacentHTML('afterbegin', badgeHtml);
      projectsContainer.prepend(currentEditCard);
    } else if (!isUrgent && urgentBadge) {
      urgentBadge.parentElement.remove();
      projectsContainer.appendChild(currentEditCard);
    }

    const editModalEl = document.getElementById('editProjectModal');
    const editModal = bootstrap.Modal.getInstance(editModalEl);
    editModal.hide();
  });

  // إضافة مشروع جديد
  const addProjectForm = document.querySelector('#addProjectModal form');
  addProjectForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const title = this.querySelector('input[type="text"]').value;
    const description = this.querySelector('textarea').value;
    const amount = this.querySelector('input[type="number"]').value;
    const category = this.querySelector('select').value;
    const imageInput = this.querySelector('input[type="file"]');
    const imageUrl = imageInput.files[0] ? URL.createObjectURL(imageInput.files[0]) : 'default.jpg';
    const isUrgent = this.querySelector('#urgent').checked;

    const newCard = document.createElement('div');
    newCard.className = 'col-lg-4 col-md-6 mb-4 card-box';
    newCard.setAttribute('data-filter', category);

    newCard.innerHTML = `
      <div class="card shadow-sm border-0">
        <img src="${imageUrl}" class="mx-3 mt-3 rounded-3" alt="صورة المشروع">
        ${isUrgent ? `
          <div style="position: absolute; top: 17px; right: 24px;">
            <span class="badge bg-danger">عاجل</span>
          </div>` : ''}
        <div style="position: absolute; top: 17px; left: 24px;">
            <span class="badge bg-info border border-2 ">${getTypeName(category)}</span>
          </div>
        <div class="card-body text-center">
          <h5 class="card-title title">${title}</h5>
          <p class="card-text small text-muted">${description}</p>
          <div class="progress mb-1" style="height: 13px; border-radius: 5px;">
            <div class="progress-bar bg-primary" role="progressbar" style="width: 0%;">0%</div>
          </div>
          <div class="bg-light money d-flex mt-3 p-2 rounded justify-content-between flex-wrap">
            <div>
              <span class="mb-1 text-primary">المبلغ المطلوب</span>
              <p>${amount}<small>د.أ</small></p>
            </div>
            <div>
              <span class="mb-1 text-primary">تم جمع</span>
              <p>0<small>د.أ</small></p>
            </div>
            <div>
              <span class="mb-1 text-primary">المبلغ المتبقي</span>
              <p>${amount}<small>د.أ</small></p>
            </div>
          </div>
          <span class="badge bg-warning text-white mt-2 p-2">قيد التنفيذ</span>
          <div class="mt-3 border-top w-100 project-details">
            <a href="#" class="p-2 d-block">تفاصيل المشروع</a>
          </div>
          <div class="admin-actions d-none mt-3 border-top pt-2 d-flex justify-content-center gap-2">
            <button class="btn btn-sm btn-success" title="تعديل"><i class="fa-solid fa-pen"></i></button>
            <button class="btn btn-sm btn-danger" title="حذف"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      </div>
    `;

    if (isUrgent) {
      projectsContainer.prepend(newCard);
    } else {
      projectsContainer.appendChild(newCard);
    }

    updateAdminButtons();

    const modalEl = document.getElementById('addProjectModal');
    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    modal.hide();
    this.reset();
    updateProjectDistribution();//
   
    document.querySelector('.filter-btn.active').click();
  });

  function updateProjectDistribution() {
  const allProjects = document.querySelectorAll("#projects .card-box, #completed-projects .card-box");
  const completedContainer = document.getElementById("completed-projects");
  const normalContainer = document.getElementById("projects");

  allProjects.forEach(project => {
    const progressBar = project.querySelector(".progress-bar");
    const completeBadge = project.querySelector(".badge.bg-success");

    // المشروع مكتمل إذا نسبة التقدم 100% أو لديه badge مكتمل
    if ((progressBar && parseInt(progressBar.style.width) >= 100) || completeBadge) {
      completedContainer.appendChild(project);
    } else {
      normalContainer.appendChild(project);
    }
  });
}
const allProjects = document.querySelectorAll("#projects .card-box, #completed-projects .card-box");
allProjects.forEach(project => {
  updateProgressBar(project); // يحدث شريط التقدم وبانر المكتمل
});
 updateProjectDistribution(); 
  // شغل الأزرار أول مرة
  updateAdminButtons();

  // زر إضافة مشروع يظهر/يختفي حسب الأدمن
  if (isAdmin) {
    addButton.style.display = 'block';
  } else {
    addButton.style.display = 'none';
  }
});





// بيانات الأسئلة الشائعة
const faq = {
    "كيف أتبرع؟": "للتبرع، يمكنك اختيار مشروع من القائمة والنقر على زر 'تبرع الآن'، ثم اتباع خطوات الدفع.",
    "ما هي طرق الدفع المتاحة؟": "نقبل بطاقات الائتمان، PayPal، والمحفظه الالكترونيه والحوالات البنكية.",
    "هل التبرع آمن؟": "نعم، جميع عمليات التبرع مؤمنة بتقنية SSL ولا نخزن بيانات بطاقتك.",
    "كيف أتأكد من وصول تبرعي؟": "ستصلك إشعارات وتقارير عن المشروع الذي تبرعت له.",
    "كيف يتم استخدام تبرعاتي؟": "تبرعاتك تُخصص بالكامل للغرض الذي تبرعت من أجله.",
    "ماذا لو حدث خطأ أثناء عملية التبرع؟": "يرجى التواصل معنا على الرقم الموجود أسفل الصفحة."
};

// رسائل الترحيب للدردشة
const welcomeMessages = [
    "مرحباً! كيف يمكنني مساعدتك اليوم؟ 😊",
    "أهلاً بك! أنا هنا للإجابة على استفساراتك حول التبرع. 🤗",
    "مساء الخير! ما الذي يمكنني مساعدتك به اليوم؟ 🌟",
    "أهلاً! أسعدني تواصلك معنا. كيف يمكنني مساعدتك؟ 💙"
];

// وظائف الدردشة الآلية
function toggleChat() {
    const chatbotWindow = document.getElementById('chatbotWindow');
    if (!chatbotWindow) return;
    
    if (chatbotWindow.style.display === 'flex') {
        chatbotWindow.classList.remove('active');
        setTimeout(() => { chatbotWindow.style.display = 'none'; }, 300);
    } else {
        chatbotWindow.style.display = 'flex';
        setTimeout(() => { chatbotWindow.classList.add('active'); }, 10);
        setTimeout(() => {
            const randomWelcome = welcomeMessages[Math.floor(Math.random()*welcomeMessages.length)];
            addBotMessage(randomWelcome);
        }, 500);
    }
}

function sendQuickReply(question) {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) typingIndicator.style.display = 'block';
    
    addUserMessage(question);
    
    setTimeout(() => {
        if (typingIndicator) typingIndicator.style.display = 'none';
        sendMessage(question);
    }, 1000);
}

function sendMessage(question) {
    let response = faq[question] || "عذرًا، لم أفهم سؤالك. يرجى اختيار أحد الأسئلة من القائمة أدناه. 🙏";
    addBotMessage(response);
}

function addUserMessage(msg) {
    const chatbotBody = document.getElementById('chatbotBody');
    if (!chatbotBody) return;
    
    const userMessage = document.createElement('div');
    userMessage.className = 'chatbot-message user-message';
    userMessage.textContent = msg;
    chatbotBody.appendChild(userMessage);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
}

function addBotMessage(msg) {
    const chatbotBody = document.getElementById('chatbotBody');
    if (!chatbotBody) return;
    
    const botMessage = document.createElement('div');
    botMessage.className = 'chatbot-message bot-message';
    botMessage.textContent = msg;
    chatbotBody.appendChild(botMessage);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
}

// إغلاق الدردشة عند النقر خارجها
document.addEventListener('click', function(event) {
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotIcon = document.querySelector('.chatbot-icon');
    
    if (!chatbotWindow || !chatbotIcon) return;
    
    if (!chatbotWindow.contains(event.target) && !chatbotIcon.contains(event.target)) {
        if (chatbotWindow.style.display === 'flex') {
            chatbotWindow.classList.remove('active');
            setTimeout(() => { chatbotWindow.style.display = 'none'; }, 300);
        }
    }
});



