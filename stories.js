
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
                title: "من اليأس إلى الأمل: قصة أحمد",
                category: "كفالة تعليمية",
               
                time:"",
                image: "images/dr.jpg",
                content: `
                  <p> أنا أحمد، طالب طب سابقًا وطبيب حاليًا. خلال فترة دراستي واجهت ظروفًا صعبة جدًا، والدي كان مريضًا ولم يعد قادرًا على العمل، وهذا أثر بشكل كبير على وضعنا المادي وكدت أترك الجامعة.</p>

          <p>في تلك الفترة تقدمت بطلب مساعدة من منظمة GiveHope، وبفضل الدعم الذي وصلني تمكنت من إكمال دراستي دون انقطاع. بعد التخرج تخصصت في الجراحة العامة وأعمل الآن في مستشفى حكومي.</p>

<p>اليوم أستطيع أن أساند أسرتي ماديًا وأقف بجانبهم بعد أن وقفوا بجانبي في أصعب الأوقات. كما أنني أخصص جزءًا من وقتي للعمل التطوعي في عيادات مجانية لدعم من يمرون بتجارب شبيهة بما مررت به   .</p>

<p> هذه التجربة أثبتت لي أن المساعدة في الوقت المناسب قادرة على تغيير مسار حياة كاملة.</p>
                `
            },
            2: {
                title: "محمد: عملية جراحية أنقذت حياته",
                category: "صحيه",
               
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
                title: "عائلة أبو محمد تعيد البناء",
                category: "معيشية",
               
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
    title: "سارة تحقق حلمها الدراسي",
    category: "كفالة تعليمية",
   
    time: "",
    image: "images/university.jpg",
    content: `
       <p>أنا سارة، كنت دايمًا أحلم أكمل دراستي الجامعية بس ظروف عائلتي المالية كانت صعبة جدًا. كنت خايفة إني أضطر أترك الدراسة.</p>

       <p>سمعت عن GiveHope وتقدمت بطلب للكفالة التعليمية. الحمد لله، المتبرعين ساعدوني أكمل دراستي بدون أي قلق عن المصاريف.</p>

       <p>اليوم أنا طالبة جامعية متفوقة وبستعد لأكون معلمة لمساعدة الطلاب اللي زيي. دعم الناس خلاني أقدر أحقق حلمي وأفكر أساعد غيري بعدين.</p>
    `
}
        };



//هاي عشان نعبي النص الي بال html
function getExcerpt(content) {
    const match = content.match(/<p>(.*?)<\/p>/);
    return match ? match[1] : "";
}

function calculateReadingTime(content) {
    const paragraphs = content.match(/<p>.*?<\/p>/g) || [];
    const minutes = Math.ceil(paragraphs.length * 0.5); // كل فقرة ≈ نصف دقيقة
    return `${minutes} دقائق قراءة`;
}

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

        // وقت القراءة
        const timeSpan = card.querySelector(".story-time");
        if(timeSpan) {
            timeSpan.innerHTML = `<i class="far fa-clock"></i> ${calculateReadingTime(story.content)}`;
        }

        
    }
});






        // فتح القصة الكاملة
        document.querySelectorAll('.read-more').forEach(button => {
            button.addEventListener('click', function() {
                const storyId = this.getAttribute('data-story');
                const story = stories[storyId];
                
                if (story) {
                    document.getElementById('modal-title').textContent = story.title;
                    document.getElementById('modal-category').textContent = story.category;
                    document.getElementById('modal-time').innerHTML = `<i class="far fa-clock"></i> ${story.time}`;
                    document.getElementById('modal-image').src = story.image;
                    document.getElementById('modal-content').innerHTML = story.content;
                    
                    document.getElementById('story-modal').style.display = 'block';
                    document.body.style.overflow = 'hidden'; // منع التمرير عند فتح النافذة
                }
            });
        });

        // إغلاق النافذة
        document.querySelector('.close-modal').addEventListener('click', function() {
            document.getElementById('story-modal').style.display = 'none';
            document.body.style.overflow = 'auto'; // إعادة التمرير
        });

        // إغلاق النافذة عند النقر خارج المحتوى
        window.addEventListener('click', function(event) {
            const modal = document.getElementById('story-modal');
            if (event.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });

     

        
// فتح المودال عند الضغط على زر المشاركة
const shareBtn = document.querySelector('.share-btn');
const modal = document.getElementById('storyModal');
const closeBtn = document.querySelector('.close-btn');
const cancelBtn = document.getElementById('cancelStory');
const submitBtn = document.getElementById('submitStory');
const storyInput = document.getElementById('storyInput');

shareBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
});

// إغلاق المودال
closeBtn.addEventListener('click', () => modal.style.display = 'none');
cancelBtn.addEventListener('click', () => modal.style.display = 'none');

// عند إرسال القصة
submitBtn.addEventListener('click', () => {
    if(storyInput.value.trim() === "") {
        alert("يرجى كتابة قصتك قبل الإرسال!");
        return;
    }
    modal.style.display = 'none';
    storyInput.value = ""; // مسح النص
    alert("شكراً لمشاركتك! ننتظر موافقة الأدمن وسيتم إدراج قصتك قريباً.");
});

// إغلاق المودال عند الضغط خارج المحتوى
window.addEventListener('click', e => {
    if(e.target === modal) modal.style.display = 'none';
});





//هاي عشان ينكيف مع اللغه يمين او يسار
function autoDirection(input) {
  input.addEventListener("input", function() {
    if (/^[\u0600-\u06FF]/.test(this.value)) {
      this.style.direction = "rtl";
      this.style.textAlign = "right";
    } else if (/^[A-Za-z0-9]/.test(this.value)) {
      this.style.direction = "ltr";
      this.style.textAlign = "left";
    } else if (this.value.trim() === "") {
      this.style.direction = "rtl";
      this.style.textAlign = "right";
    }
  });
}

// نطبقها على أكثر من input
autoDirection(document.getElementById("storyInput"));


// تحسين كود نافذة القصة الكاملة
function openStoryModal(storyId) {
    const story = stories[storyId];
    if (!story) return;
    
    const modal = document.getElementById('story-modal');
    const modalContent = modal.querySelector('.modal-content');
    
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
