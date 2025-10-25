

 // دالة لتحميل HTML مع الحفاظ على فعالية السكربتات
    async function loadHTML(file, elementId) {
        try {
            const response = await fetch(file);
            const data = await response.text();
            const container = document.getElementById(elementId);
            container.innerHTML = data;
            
            // إعادة تهيئة الأحداث للعناصر المنقولة
            if (file === 'navbar.html') {
                initNavbar();
            }
            
            return true;
        } catch (error) {
            console.error('Error loading HTML:', error);
            return false;
        }
    }

    // دالة لتهيئة أحداث النافبار
    function initNavbar() {
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.getElementById('navLinks');
        
        if (!menuToggle || !navLinks) return;
        
        // تبديل القائمة في الجوال
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinks.classList.toggle('active');
        });
        
        // إغلاق القائمة عند النقر خارجها
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.navbar')) {
                navLinks.classList.remove('active');
                document.querySelectorAll('.dropdown').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
        
        // منع إغلاق القائمة عند النقر عليها
        if (navLinks) {
            navLinks.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
        
        // تفعيل dropdown في الشاشات الصغيرة
        document.querySelectorAll('.dropdown-toggle').forEach(item => {
            item.addEventListener('click', function(e) {
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    const dropdown = this.parentNode;
                    dropdown.classList.toggle('active');
                    
                    // إغلاق باقي القوائم
                    document.querySelectorAll('.dropdown').forEach(d => {
                        if (d !== dropdown) {
                            d.classList.remove('active');
                        }
                    });
                }
            });
        });
        
        // إغلاق القوائم المنسدلة عند تغيير حجم النافذة
        window.addEventListener('resize', function() {
            if (window.innerWidth > 992) {
                if (navLinks) navLinks.classList.remove('active');
                document.querySelectorAll('.dropdown').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
    }

    // تحميل العناصر عند بدء التشغيل
    window.addEventListener('DOMContentLoaded', function() {
        loadHTML('navbar.html', 'navbar-placeholder');
        loadHTML('footer.html', 'footer-placeholder');
    });

//**********************************swiper for cases-slider ******************************************************* */
// وظيفة جديدة لتحميل وعرض الحالات العاجلة وتحويلها إلى Swiper
async function loadUrgentCases() {
    const container = document.querySelector("#urgentCasesContainerSwiper .swiper-wrapper"); // 👈 الآن نستهدف عنصر الـ Swiper-wrapper
    const parentContainer = document.getElementById("urgentCasesContainerSwiper"); // لاختبار وجود الحاوية
    
    if (!container || !parentContainer) {
        console.error("Swiper container elements not found");
        return;
    }

    container.innerHTML = '<div class="loading swiper-slide">جاري تحميل الحالات العاجلة...</div>';

    try {
        const res = await fetch("cases.json");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const casesData = await res.json();

        const urgentCases = casesData.filter(c => isUrgent(c.deadline));

        container.innerHTML = ''; // مسح رسالة التحميل

        if (!urgentCases || urgentCases.length === 0) {
            container.innerHTML = '<div class="no-cases swiper-slide">لا توجد حالات عاجلة متاحة حالياً</div>';
            return;
        }
        
        // بناء بطاقات الحالات
        urgentCases.forEach(c => {
            const urgent = isUrgent(c.deadline);
            const remaining = c.total - c.donated;
            const percent = Math.floor((c.donated / c.total) * 100);

            const card = document.createElement("div");
            // 👈 **الخطوة الحاسمة: إضافة فئة Swiper-slide**
            card.className = "swiper-slide case"; 
            card.setAttribute("data-type", c.type);
            card.setAttribute("data-urgent", urgent);
            card.setAttribute("data-id", c.id);

            card.innerHTML = `
                ${urgent ? '<span class="urgent-label">عاجل</span>' : ""}
                <span class="case-badge ${c.type}-badge">${getTypeName(c.type)}</span>
                <img src="${c.image}" alt="صورة الحالة" class="case-image" onerror="this.src='images/default-case.jpg'">
                <div class="case-content">
                    <h3>${c.title}</h3>
                    <p>المبلغ المطلوب: ${c.total} د.أ</p>
                    <p>المبلغ المتبقي: <span class="remaining">${remaining}</span> د.أ</p>
                    <div class="progress-container">
                        <div class="progress-bar" style="width:${percent}%;"></div>
                    </div>
                    <p>نسبة الإنجاز: <span class="percentage">${percent}%</span></p>
                    <p class="deadline">الموعد النهائي: ${c.deadline}</p>
                    
                    <div class="case-actions">
                        <button class="btn-donate" onclick="window.location.href='DonateNow.html?id=${c.id}'">
                            <i class="fas fa-hand-holding-heart"></i> تبرع الآن
                        </button>
                        <button class="btn-details" onclick="window.location.href='casedetails.html?id=${c.id}'">
                            <i class="fas fa-eye"></i> التفاصيل
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

        // 👈 **الخطوة الأخيرة: تهيئة Swiper**
        initializeSwiper(); 

    } catch(err) {
        console.error("Error loading urgent cases:", err);
        container.innerHTML = '<div class="error swiper-slide">حدث خطأ أثناء تحميل الحالات العاجلة. يرجى المحاولة مرة أخرى.</div>';
    }
}

// دالة منفصلة لتهيئة Swiper
function initializeSwiper() {
    new Swiper('.cases-slider', {
        // الخيار الأهم: لجعل الشرائح تتراصف أفقيًا
        slidesPerView: 'auto', 
        spaceBetween: 25, // نفس قيمة الـ gap في CSS
        loop: false, // لا نريد تكرار الحالات
        
        // تفعيل أزرار التنقل (للتمرير بالضغط)
        navigation: {
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
        },
        
        // تفعيل مؤشر الصفحات (النقاط أسفل السلايدر)
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        
        // تحسينات للاستجابة عند تغيير حجم الشاشة (اختياري)
        breakpoints: {
            // عند عرض أجهزة الموبايل (أقل من 640 بكسل)
            320: {
                slidesPerView: 1.1, // عرض بطاقة واحدة و جزء من التالية
                spaceBetween: 15
            },
            // عند شاشات التابلت
            768: {
                slidesPerView: 2.5,
                spaceBetween: 25
            },
            // عند شاشات الديسكتوب
            1024: {
                slidesPerView: 3.5,
                spaceBetween: 25
            },
        }
    });
}

// استدعاء الدالة عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", loadUrgentCases);


//******************************swiper for servises*********************************************************** */
  // دالة لتهيئة Swiper الخدمات
    function initializeServicesSwiper() {
        new Swiper('.services-swiper', {
            slidesPerView: 'auto',
            spaceBetween: 25,
            loop: false,
            centeredSlides: false,
            
            navigation: {
                nextEl: '.services-swiper .swiper-button-next',
                prevEl: '.services-swiper .swiper-button-prev',
            },
            
            pagination: {
                el: '.services-swiper .swiper-pagination',
                clickable: true,
            },
            
            breakpoints: {
                320: {
                    slidesPerView: 1.1,
                    spaceBetween: 15
                },
                480: {
                    slidesPerView: 1.5,
                    spaceBetween: 15
                },
                640: {
                    slidesPerView: 2,
                    spaceBetween: 20
                },
                768: {
                    slidesPerView: 2.5,
                    spaceBetween: 20
                },
                1024: {
                    slidesPerView: 3.5,
                    spaceBetween: 25
                },
                1200: {
                    slidesPerView: 4,
                    spaceBetween: 25
                }
            }
        });
    }

    // استدعاء الدوال عند تحميل الصفحة
    document.addEventListener('DOMContentLoaded', function() {
        initializeServicesSwiper();
    });
//****************************************swiper for stories******************************************************************** */


// دالة لاختيار قصص عشوائية
function getRandomStories(count = 3) {
    const storyIds = Object.keys(stories);
    const randomStories = [];
    
    while (randomStories.length < count && randomStories.length < storyIds.length) {
        const randomIndex = Math.floor(Math.random() * storyIds.length);
        const randomStoryId = storyIds[randomIndex];
        const story = stories[randomStoryId];
        
        if (!randomStories.some(s => s.id === randomStoryId)) {
            randomStories.push({
                id: randomStoryId,
                ...story
            });
        }
    }
    
    return randomStories;
}

// دالة لإنشاء نص مختصر للقصة
function getShortExcerpt(content, maxLength = 150) {
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.length <= maxLength ? plainText : plainText.substring(0, maxLength) + '...';
}

// دالة لعرض القصص العشوائية في السلايدر
function displayRandomStories() {
    const swiperWrapper = document.querySelector('.testimonials-swiper .swiper-wrapper');
    if (!swiperWrapper) return; // التأكد من وجود العنصر

    swiperWrapper.innerHTML = '';

    const randomStories = getRandomStories(3);

    randomStories.forEach(story => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        
        // المحتوى الجديد مع زر يوجه لصفحة القصص
       slide.innerHTML = `
    <div class="testimonial-card">
        <div class="testimonial-text">
            ${getShortExcerpt(story.content)}
            <div style="margin-top: 15px; text-align: left;">
                <button 
                class="read-more-btn"
                 data-story="${story.id}" 
                    onclick="window.location.href='stories.html?id=${story.id}'"
                    style="
                        background: none;
                        border: none;
                        color: #2c5cc5;
                        cursor: pointer;
                        font-size: 14px;
                        text-decoration: underline;
                        padding: 0;
                    ">
                    اقرأ القصة كاملة
                </button>
            </div>
        </div>
        <div class="testimonial-author">
            <img src="${story.image}" alt="${story.title}">
            <div class="author-info">
                <h4>${story.title}</h4>
                <p>${story.type === 'متبرع' ? 'متبرع' : 'مستفيد'} - ${story.category}</p>
            </div>
        </div>
    </div>
`;
        swiperWrapper.appendChild(slide);
    });
}

// تهيئة السلايدر
function initTestimonialsSwiper() {
    if (typeof Swiper !== 'undefined') {
        return new Swiper('.testimonials-swiper', {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 20,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
            }
        });
    }
    return null;
}

// استدعاء الدوال عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    displayRandomStories();
    initTestimonialsSwiper();
});

   
//*************************************for share button ********************************************************************** */
// كود فتح وإغلاق المودال
        const shareBtn = document.getElementById('shareBtn');
        const shareModal = document.getElementById('shareModal');
        const closeBtn = document.querySelector('.close-btn');
        const copyToast = document.getElementById('copyToast');

        // فتح المودال
        shareBtn.addEventListener('click', function() {
            shareModal.classList.add('show');
        });

        // إغلاق المودال
        closeBtn.addEventListener('click', function() {
            shareModal.classList.remove('show');
        });

        // إغلاق المودال عند الضغط خارج المحتوى
        shareModal.addEventListener('click', function(e) {
            if (e.target === shareModal) {
                shareModal.classList.remove('show');
            }
        });

        // كود المشاركة
        document.addEventListener('DOMContentLoaded', function() {
            const shareData = {
                title: "حالة محتاجة للتبرع",
                text: "ساعد في نشر الخير بمشاركة هذه الحالة 🌸",
                url: window.location.href
            };

            // زر واتساب
            document.getElementById('whatsapp-share').addEventListener('click', function(e) {
                e.preventDefault();
                const encodedText = encodeURIComponent(shareData.text + '\n' + shareData.url);
                window.open('https://wa.me/?text=' + encodedText, '_blank');
            });

            // زر فيسبوك
            document.getElementById('facebook-share').addEventListener('click', function(e) {
                e.preventDefault();
                const encodedUrl = encodeURIComponent(shareData.url);
                window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodedUrl, '_blank');
            });

            // زر نسخ الرابط
            document.getElementById('copy-link').addEventListener('click', async function(e) {
                e.preventDefault();
                try {
                    await navigator.clipboard.writeText(shareData.url);
                    
                    // إظهار Toast
                    copyToast.classList.add('show');
                    
                    // إخفاء Toast بعد 3 ثواني
                    setTimeout(() => {
                        copyToast.classList.remove('show');
                    }, 3000);
                    
                    // إغلاق المودال بعد ثانية
                    setTimeout(() => {
                        shareModal.classList.remove('show');
                    }, 1000);
                    
                } catch (err) {
                    console.error('فشل في نسخ الرابط:', err);
                    alert('تعذر نسخ الرابط، يرجى المحاولة مرة أخرى');
                }
            });
        });
   
   //*****************************************chatbot****************************************************************** */


// بيانات الأسئلة الشائعة
const faq = {
    "ما هي GiveHope؟": "GiveHope هي منصة خيرية إلكترونية تساعد على مد يد العون للمحتاجين بسرية وأمان , لتفاصيل اكتر يمكنك زباره صفحه من نحن اخر الصفحه ",
    "هل يمكنني التبرع بطرق غير مادية؟": "حاليا للاسف لا , التبرع فقط مادي لكن يمكنك المساعده عن طريق مشاركه الاحالات ونشر الخير",
   "هل يجب أن أسجل حساب للتبرع؟": "يمكنك تصفح الحالات دون تسجيل، لكن لإتمام التبرع تحتاج إلى إنشاء حساب بسيط",
"ما الفرق بين خدماتكم؟": "🔹 الحالات المعروضة: دعم أفراد أو أسر بحاجة لمساعدة محددة (مثل قسط جامعة، علاج، حليب أطفال...)\n🔹 حملات التبرع: مبادرات جماعية تهدف لتحقيق هدف معين خلال فترة زمنية محددة (مثل حملة الشتاء لتوزيع بطانيات)\n🔹 الكفالات: التزام طويل المدى لدعم شخص محدد بشكل دوري (مثل كفالة يتيم أو طالب)\n🔹 المشاريع: أعمال خيرية كبيرة تخدم مجموعة من الناس أو منطقة كاملة (مثل بناء بئر ماء أو تجهيز مركز صحي)"


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



        //*********************************************************************************************************** */

        // Animation on scroll
        const animateElements = document.querySelectorAll('.slide-up, .fade-in');
        
        function checkAnimation() {
            animateElements.forEach(element => {
                const elementPosition = element.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (elementPosition < windowHeight - 100) {
                    element.style.animationPlayState = 'running';
                }
            });
        }
        
        window.addEventListener('scroll', checkAnimation);
        window.addEventListener('load', checkAnimation);
        
