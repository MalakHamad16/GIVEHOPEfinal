

// دوال تحميل HTML وتهيئة شريط التنقل (تم الإبقاء عليها كما هي)
async function loadHTML(file, elementId) {
    try {
        const response = await fetch(file);
        const data = await response.text();
        const container = document.getElementById(elementId);
        container.innerHTML = data;
        
        if (file === 'navbar.html') {
            initNavbar();
        }
        
        return true;
    } catch (error) {
        console.error('Error loading HTML:', error);
        return false;
    }
}

function initNavbar() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (!menuToggle || !navLinks) return;
    
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        navLinks.classList.toggle('active');
    });
    
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.navbar')) {
            navLinks.classList.remove('active');
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
    
    if (navLinks) {
        navLinks.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    document.querySelectorAll('.dropdown-toggle').forEach(item => {
        item.addEventListener('click', function(e) {
            if (window.innerWidth <= 992) {
                e.preventDefault();
                const dropdown = this.parentNode;
                dropdown.classList.toggle('active');
                
                document.querySelectorAll('.dropdown').forEach(d => {
                    if (d !== dropdown) {
                        d.classList.remove('active');
                    }
                });
            }
        });
    });
    
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992) {
            if (navLinks) navLinks.classList.remove('active');
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            }); 
        }
    });
}

window.addEventListener('DOMContentLoaded', function() {
    loadHTML('navbar.html', 'navbar-placeholder');
    loadHTML('footer.html', 'footer-placeholder');
});
 
//*********************************************************************************************************/

// بيانات القصص الكاملة
const stories = {
   1: {
    title: "قصه ليلى",
    type: "مستفيد",
    category: "مشاريع خيرية",
    time: "",
    image: "images/food.jpg",
    content: `
        <p>أنا ليلى، أم لأربعة أطفال، وكنا نعيش ظروف صعبة جدًا بعد فقدان زوجي لوظيفته. لم يكن لدينا القدرة على توفير الاحتياجات الأساسية اليومية، وكنت أخشى على مستقبل أولادي.</p>
        <p>سجلنا في مشروع دعم الأسر المحتاجة، وبفضل التبرعات والدعم الذي وصلنا، تمكنا من الحصول على سلال غذائية وأدوات مدرسية للأطفال، بالإضافة إلى دعم بسيط لتغطية الاحتياجات المنزلية.</p>
        <p>هذا المشروع لم يوفر لنا المواد فقط، بل أعاد لنا الأمل ورفع معنوياتنا. أشعر الآن بالطمأنينة لأن أولادي قادرون على متابعة دراستهم وأحسست أننا لسنا وحدنا.</p>
        <p>تجربتي أثبتت لي أن الدعم في الوقت المناسب قادر على تغيير حياة أسرة كاملة ومنحنا فرصة لمستقبل أفضل.</p>
    `
},

    2: {
        title: "قصه محمد",
        category: "صحيه",
        type: "مستفيد" ,
        time:"",
        image: "images/heartt.PNG",
        content:`<p>كنت أعاني من مرض بالقلب وكان لا بد من إجراء عملية جراحية عاجلة. الأطباء أخبروا عائلتي أن أي تأخير قد يشكل خطرًا على حياتي، لكن تكلفة العملية كانت أكبر من قدرة أسرتي المادية.</p>
<p>بعد محاولات كثيرة، تواصلت عائلتي مع منظمة GiveHope، وبفضل التبرعات التي وصلتنا تمكنا من جمع المبلغ المطلوب بسرعة، وتمت العملية في مستشفى متخصص بنجاح.</p>
<p>تقول والدتي: "لم نكن نعرف كيف سننقذ حياة محمد، لكن دعم الناس أعطانا أملًا جديدًا."</p>
<p>الآن أنا أتعافى بشكل جيد وأتابع جلسات المراجعة الطبية بانتظام. أحلم أن أصبح مهندسًا في المستقبل حتى أستطيع أن أقدم شيئًا لمجتمعي كما قدموا لي. عائلتي لا تزال تتذكر دعمكم في أصعب الأوقات.</p>
<p>هذه التجربة أثبتت لنا أن الدعم في الوقت المناسب قادر فعلاً على إنقاذ حياة وتغيير مستقبل عائلة بأكملها.</p>
`
    },
    3: {
        title: "قصه عائلة أبو محمد ",
        category: "معيشية",
        type: "مستفيد" ,
        time: "",
        image: "images/newhouse.jpg",
        content: `
            <p>أنا أبو محمد، قبل فترة بيتنا صار فيه حريق كبير وأكل كل شي تقريبًا. فجأة أنا وولادي الستة لقينا حالنا بلا مأوى ولا حتى أغراض نستر حالنا فيها.</p>
            <p>بمساعدة الجيران ضلّينا كم يوم عند قرايبنا، بس الوضع ما كان سهل، كنا محتاجين ندبّر حالنا من أول وجديد. بهديك الفترة سمعنا عن GiveHope وتواصلنا معهم. بصراحة ما توقعت إنه رح يوقفوا معنا بهالشكل. بفضل التبرعات قدرنا نأمن بيت نرجع نعيش فيه ونشتري الأساسيات اللي راحت بالحريق.</p>
            <p>أنا شخصيًا بقول: "خسرت كل شي بهديك الليلة، بس وقفة الناس معنا رجّعتلي الأمل من جديد. حسيت إنه لسه في خير بالدنيا."</p>
            <p>بعد أشهر تعب وجهد، رجعنا على بيت جديد. بالنسبة إلنا ما كان بس جدران وسقف، كان بداية جديدة وحياة أهدى وأأمن.</p>
            <p>اليوم الحمد لله مستقرين، وحتى صرنا نساعد عائلات ثانية محتاجة من خلال GiveHope، يمكن نرد جزء من المعروف اللي شفناه.</p>
            <p>تجربتي علمتني إنه بالشدّة بيبين معدن الناس، وإنه دايمًا في مجال نرجع نوقف على رجلينا إذا لقينا مين يمدلنا إيده.</p>
        `
    },
    4: {
        title:"قصه ساره ",
        category: "كفالة تعليمية",
        type: "مستفيد" ,
        time: "",
        image: "images/university.jpg",
        content: `
            <p>أنا سارة، كنت دايمًا أحلم أكمل دراستي الجامعية بس ظروف عائلتي المالية كانت صعبة جدًا. كنت خايفة إني أضطر أترك الدراسة.</p>
            <p>سمعت عن GiveHope وتقدمت بطلب للكفالة التعليمية. الحمد لله، المتبرعين ساعدوني أكمل دراستي بدون أي قلق عن المصاريف.</p>
            <p>اليوم أنا طالبة جامعية متفوقة وبستعد لأكون معلمة لمساعدة الطلاب اللي زيي. دعم الناس خلاني أقدر أحقق حلمي وأفكر أساعد غيري بعدين.</p>
        `
    },
    5: {
        title: "قصة خالد",
        category: "مشاريع",
        type: "متبرع",
        time: "",
        image: "https://randomuser.me/api/portraits/men/75.jpg",
        content: `
            <p>كمتبرع ل احدى المشاريع التي تم تنظيمها هنا ، أشعر بسعادة غامرة عندما أرى تأثير تبرعاتي على أرض الواقع.</p>
            <p>GiveHope توفر لي تقارير دورية عن الحالات التي ساهمت في مساعدتها، مما يعطيني الثقة في أن تبرعاتي تصل لمستحقيها.</p>
            <p>هذه التجربة جعلتني أكثر التزامًا بالاستمرار في العطاء، وأدركت أن كل مساهمة صغيرة قد تصنع فارقًا كبيرًا في حياة الآخرين.</p>
        `
    },
};

//*********************************************************************************************************/
// دوال مساعدة
//*********************************************************************************************************/

function getExcerpt(content) {
    const match = content.match(/<p>(.*?)<\/p>/);
    return match ? match[1] : "";
}

function calculateReadingTime(content) {
    const paragraphs = content.match(/<p>.*?<\/p>/g) || [];
    const minutes = Math.ceil(paragraphs.length * 0.5); // كل فقرة ≈ نصف دقيقة
    return `${minutes} دقائق قراءة`;
}

// دالة توجيه النص
function autoDirection(inputElement) {
    if (!inputElement) return;
    
    inputElement.addEventListener("input", function() {
        const value = this.value.trim();

        if (/^[\u0600-\u06FF]/.test(value)) {
            this.style.direction = "rtl";
            this.style.textAlign = "right";
        } else if (/^[A-Za-z0-9]/.test(value)) {
            this.style.direction = "ltr";
            this.style.textAlign = "left";
        } else if (value === "") {
            this.style.direction = "rtl";
            this.style.textAlign = "right";
        }
    });
}

//*********************************************************************************************************/
// منطق تعبئة بطاقات القصص
//*********************************************************************************************************/

document.querySelectorAll(".story-card").forEach(card => {
    const id = card.querySelector(".read-more").dataset.story; 
    const story = stories[id];
    if (story) {
        // عنوان القصة
        const titleElem = card.querySelector("h3");
        if(titleElem) titleElem.textContent = story.title;

        // الصورة
        const imgElem = card.querySelector(".story-image img");
        if(imgElem) imgElem.src = story.image;

        // نص أول فقرة (excerpt)
        const excerpt = getExcerpt(story.content);
        card.querySelector(".story-excerpt").textContent = excerpt;

        // category ديناميكي
        const categoryDiv = card.querySelector(".story-category");
        if(categoryDiv) {
            categoryDiv.textContent = story.category;
        }

        // تحديث شريط البيانات الوصفية (story-meta) لضمان ظهور النوع والوقت معاً
        const readingTime = calculateReadingTime(story.content);
        const metaContainer = card.querySelector(".story-meta");
        if(metaContainer) {
            metaContainer.innerHTML = `
                <span class="story-type">
                    <i class="${story.type === 'متبرع' ? 'fas fa-hand-holding-heart' : 'fas fa-user-check'}"></i> 
                    <span class="type-text">${story.type}</span>
                </span>
                <span class="story-time">
                    <i class="far fa-clock"></i> ${readingTime}
                </span>
            `;
        }
    }
});

//*********************************************************************************************************/
// منطق نافذة القصة الكاملة (openStoryModal)
//*********************************************************************************************************/

function openStoryModal(storyId) {
    const story = stories[storyId];
    if (!story) return;
    
    const modal = document.getElementById('story-modal');
      if (!modal) return;
    const modalContent = modal.querySelector('.modal-content');
    if (!modalContent) return;
    
    // إنشاء محتوى النافذة ديناميكياً
    modalContent.innerHTML = `
        <div class="modal-header">
            <img src="${story.image}" alt="${story.title}">
            <div class="modal-category">${story.category}</div>
            <button class="close-modal">&times;</button>
        </div>
        <div class="modal-body">
            <h2>${story.title}</h2>
            <div class="modal-meta">
                <span class="modal-type">
                    <i class="${story.type === 'متبرع' ? 'fas fa-hand-holding-heart' : 'fas fa-user-check'}"></i> 
                    ${story.type}
                </span>
                <span><i class="far fa-clock"></i> ${calculateReadingTime(story.content)}</span>
            </div>
            <div class="story-full-content">
                ${story.content}
            </div>
        </div>
    `;
    
    // إضافة مستمعي الأحداث
    const closeBtn = modalContent.querySelector('.close-modal');
    closeBtn.addEventListener('click', closeStoryModal);
    
    // عرض النافذة
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // إغلاق النافذة عند النقر خارج المحتوى
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeStoryModal();
        }
    });
}

function closeStoryModal() {
    const modal = document.getElementById('story-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// تحديث مستمعي الأحداث للبطاقات
document.querySelectorAll('.read-more').forEach(button => {
    button.addEventListener('click', function() {
        const storyId = this.getAttribute('data-story');
        openStoryModal(storyId);
    });
});

// إضافة مستمع حدث لإغلاق النافذة بالزر ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeStoryModal();
    }
});

//*********************************************************************************************************/
// منطق نافذة مشاركة القصة (storyModal) - التعديل الرئيسي لدمج بيانات النموذج
//*************************************************************************/********************************/

document.addEventListener("DOMContentLoaded", function() {
    // العناصر الخاصة بنافذة المشاركة
    const formModal = document.getElementById('storyModal'); 
    if (formModal) { // تحقق إذا كان المودال موجودًا في الصفحة
        const shareBtn = document.querySelector('.share-btn');
        const closeBtnShare = formModal.querySelector('.close-btn'); // تم تغيير الاسم لتجنب التضارب
        const cancelBtn = document.getElementById('cancelStory');
        const storyForm = document.getElementById('storyForm'); 
        const storyTitleInput = document.getElementById('storyTitle');
        const storyCategoryInput = document.getElementById('storyCategory');
        const storyContentInput = document.getElementById('storyContent');

        // 1. فتح المودال عند الضغط على زر المشاركة
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                formModal.style.display = 'flex';
            });
        }

        // 2. إغلاق المودال
        if (closeBtnShare) closeBtnShare.addEventListener('click', () => formModal.style.display = 'none');
        if (cancelBtn) cancelBtn.addEventListener('click', () => formModal.style.display = 'none');

        // 3. التعامل مع إرسال النموذج الجديد
        if (storyForm) {
            storyForm.addEventListener('submit', function(e) {
                e.preventDefault(); // منع الإرسال الافتراضي للصفحة

                // جمع البيانات المدخلة من المستخدم
                const title = storyTitleInput.value.trim();
                const category = storyCategoryInput.value;
                const typeElement = document.querySelector('input[name="storyType"]:checked');
                const type = typeElement ? typeElement.value : null;
                const contentText = storyContentInput.value.trim();

                // التحقق من ملء جميع الحقول
                if (!title || !category || !type || !contentText) {
                    alert("يرجى ملء جميع الحقول المطلوبة (العنوان، الفئة، النوع، والقصة).");
                    return;
                }

                // تحويل محتوى النص إلى صيغة HTML
                const contentHTML = `<p>${contentText.split('\n').join('</p><p>')}</p>`; 

                // إنشاء كائن القصة الجديد
                const newStoryData = {
                    title: title,
                    category: category,
                    type: type,
                    time: calculateReadingTime(contentHTML),
                    image: "images/default-new-story.jpg",
                    content: contentHTML
                };

                console.log("تم جمع بيانات القصة الجديدة بنجاح:", newStoryData);

                // إغلاق المودال ومسح النموذج
                formModal.style.display = 'none';
                storyForm.reset();

                // تنبيه المستخدم
                Swal.fire({
                    icon: 'success',
                    title: 'شكراً لمشاركتك!',
                    text: 'تم إرسال قصتك بنجاح، سيتم مراجعتها ونشرها قريباً.',
                    confirmButtonText: 'حسنا ✅'
                });
            });
        }

        // 4. إغلاق المودال عند الضغط خارج المحتوى
        window.addEventListener('click', e => {
            if(e.target === formModal) formModal.style.display = 'none';
        });

        // 5. تطبيق التوجيه التلقائي على الحقول الجديدة
        autoDirection(storyTitleInput);
        autoDirection(storyContentInput);
    }
});

// دالة لجلب قيمة id من الرابط
function getStoryIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// عرض القصة مباشرة إذا كان هناك id
function displayStoryFromURL() {
    const storyId = getStoryIdFromURL();
    if (storyId && stories[storyId]) {
        openStoryModal(storyId); // نستخدم نفس الدالة لفتح المودال
    }
}

// عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', function() {
    displayStoryFromURL();
});
