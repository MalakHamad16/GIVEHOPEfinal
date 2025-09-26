
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
//*********************************************************************************** */
document.addEventListener('DOMContentLoaded', function() {
    // الحصول على معرف الحالة من URL
    const urlParams = new URLSearchParams(window.location.search);
    const caseId = parseInt(urlParams.get('id'));
    
    // عناصر DOM
    const caseTitle = document.getElementById('caseTitle');
    const totalAmount = document.getElementById('totalAmount');
    const donatedAmount = document.getElementById('donatedAmount');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const thankMessage = document.getElementById('thankMessage');
    const donateBtn = document.getElementById('donate-btn');
    const customAmountInput = document.getElementById('custom-amount');
    const donationForm = document.getElementById('donationForm');

    // زر الرجوع
    document.getElementById('backButton').addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = `casedetails.html?id=${caseId}`;
    });

    // جلب بيانات الحالة
    fetch('cases.json')
        .then(response => response.json())
        .then(data => {
            const caseData = data.find(item => parseInt(item.id) === caseId);

            if (caseData) {
                caseTitle.textContent = `أنت الآن تتبرع لصالح حالة رقم ${caseData.id} - ${caseData.title}`;
                
                const progressPercentage = (caseData.donated / caseData.total) * 100;
                totalAmount.textContent = `الهدف: ${caseData.total} د.إ`;
                donatedAmount.textContent = `تم جمعه: ${caseData.donated} د.إ`;
                progressBar.style.width = `${progressPercentage}%`;
                progressText.textContent = `${Math.round(progressPercentage)}%`;
            } else {
                caseTitle.textContent = 'الحالة غير موجودة';
            }
        })
        .catch(error => {
            console.error('Error loading case data:', error);
            caseTitle.textContent = 'خطأ في تحميل البيانات';
        });

    // أزرار مبلغ التبرع
    const amountButtons = document.querySelectorAll('.amount-buttons button');
    let selectedAmount = 0;
    let currency = 'د.إ';

    amountButtons.forEach(button => {
        button.addEventListener('click', function() {
            amountButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            if (this.dataset.amount === 'custom') {
                customAmountInput.style.display = 'block';
                customAmountInput.focus();
            } else {
                customAmountInput.style.display = 'none';
                selectedAmount = parseFloat(this.dataset.amount);
            }
        });
    });

    // تحديث المبلغ المختار من الحقل المخصص
    customAmountInput.addEventListener('input', function() {
        selectedAmount = parseFloat(this.value) || 0;
    });

    // معالجة التبرع عند submit الفورم
    donationForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const idcard = document.getElementById('idcard').value.trim();
        const paymentMethod = document.querySelector('input[name="payment"]:checked');

        
        if (!name || !email || !phone || !idcard || !paymentMethod) {
            alert('⚠️ يرجى ملء جميع الحقول المطلوبة واختيار طريقة الدفع');
            return;
        }

        if (!selectedAmount || selectedAmount <= 0) {
            alert('⚠️ الرجاء إدخال مبلغ صحيح للتبرع');
            return;
        }

        if (!/^\d+$/.test(phone) || !/^\d+$/.test(idcard)) {
            alert("⚠️ رقم الهاتف والهوية يجب أن يكونا أرقام فقط");
            return;
        }

        donateBtn.disabled = true;
        donateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري المعالجة...';

        try {
            const paymentResult = await handlePayment(paymentMethod.value, selectedAmount, currency, {
                name, email, phone, idcard
            });

            if (paymentResult.success) {
                thankMessage.style.display = 'block';
                thankMessage.scrollIntoView({ behavior: 'smooth' });

                await updateDonationStatus(caseId, selectedAmount, {
                    name, email, phone, idcard,
                    anonymous: document.getElementById('anonymous').checked,
                    paymentMethod: paymentMethod.value,
                    transactionId: paymentResult.transactionId
                });

                setTimeout(() => {
                    donationForm.reset();
                    amountButtons.forEach(btn => btn.classList.remove("active"));
                    customAmountInput.style.display = "none";
                }, 3000);

            } else {
                alert(`❌ فشل في عملية الدفع: ${paymentResult.message}`);
            }

        } catch (error) {
            alert('❌ حدث خطأ أثناء عملية الدفع');
            console.error('Payment error:', error);
        } finally {
            donateBtn.disabled = false;
            donateBtn.innerHTML = '<i class="fas fa-heart"></i> تبرع الآن';
        }
    });

    // دالة اختيار طريقة الدفع
    async function handlePayment(method, amount, currency, donorInfo) {
        switch (method) {
            case "card":
                return await handleCardPayment(amount, currency, donorInfo);
            case "paypal":
                return await handlePayPalPayment(amount, currency, donorInfo);
            case "wallet":
                return await handleWalletPayment(amount, currency, donorInfo);
            case "transfer":
                return await handleBankTransfer(amount, currency, donorInfo);
            default:
                return { success: false, message: "طريقة دفع غير معروفة" };
        }
    }

    // الدفع بالبطاقة
    async function handleCardPayment(amount, currency, donorInfo) {
        return new Promise((resolve) => {
            const cardForm = `
<div id="cardPaymentModal" class="payment-modal">
    <div class="modal-content">
        <h3><i class="fas fa-credit-card"></i> الدفع بالبطاقة البنكية</h3>
        <div class="form-group"><label>رقم البطاقة</label><input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19"></div>
        <div class="form-row">
            <div class="form-group"><label>تاريخ الانتهاء</label><input type="text" id="expiryDate" placeholder="MM/YY" maxlength="5"></div>
            <div class="form-group"><label>CVV</label><input type="text" id="cvv" placeholder="123" maxlength="4"></div>
        </div>
        <div class="form-group"><label>اسم حامل البطاقة</label><input type="text" id="cardHolder" placeholder="${donorInfo.name}"></div>
        <div class="modal-buttons">
            <button id="cancelCard" type="button">إلغاء</button>
            <button id="payCard" type="button">دفع ${amount} ${currency}</button>
        </div>
    </div>
</div>
`;
            document.body.insertAdjacentHTML('beforeend', cardForm);

            document.getElementById('cancelCard').addEventListener('click', () => {
                closeModal('cardPaymentModal', () => resolve({ success: false, message: 'تم إلغاء عملية الدفع' }));
            });

            document.getElementById('payCard').addEventListener('click', () => {
                closeModal('cardPaymentModal');
                resolve({ success: true, transactionId: 'CARD_' + Date.now() });
            });
        });
    }

    // الدفع عبر PayPal
    async function handlePayPalPayment(amount, currency, donorInfo) {
        return new Promise((resolve) => {
            const paypalWindow = window.open('https://www.paypal.com/cgi-bin/webscr?cmd=_donations&amount=' + amount + '&currency_code=' + currency, 'paypalWindow', 'width=600,height=700');
            const interval = setInterval(() => {
                if (paypalWindow.closed) {
                    clearInterval(interval);
                    if (confirm('هل تمت عملية الدفع بنجاح عبر PayPal؟')) {
                        resolve({ success: true, transactionId: 'PAYPAL_' + Date.now() });
                    } else {
                        resolve({ success: false, message: 'فشل عملية الدفع عبر PayPal' });
                    }
                }
            }, 500);
        });
    }

    // الدفع بالمحفظة الإلكترونية
    async function handleWalletPayment(amount, currency, donorInfo) {
    return new Promise((resolve) => {
        const walletModalHTML = `
            <div id="walletPaymentModal" class="payment-modal">
                <div class="modal-content">
                    <h3><i class="fas fa-wallet"></i> الدفع بالمحفظة الإلكترونية</h3>
                    <div class="wallet-form">
                        <p><strong>المبلغ:</strong> ${amount} ${currency}</p>
                        <p><strong>المستفيد:</strong> GiveHope Foundation</p>
                        <p><strong>الرقم المرجعي:</strong> WALLET_${Date.now()}</p>
                        <label for="verificationCode">أدخل رمز التحقق:</label>
                        <input type="text" id="verificationCode" placeholder="أدخل الرمز المكون من 4 أرقام">
                    </div>
                    <div class="modal-buttons">
                        <button id="cancelWallet" type="button">إلغاء</button>
                        <button id="confirmWallet" type="button">تأكيد الدفع</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', walletModalHTML);

        const verificationCodeInput = document.getElementById('verificationCode');
        const confirmButton = document.getElementById('confirmWallet');

        const closeModal = (modalId, callback) => {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.remove();
            }
            if (callback) {
                callback();
            }
        };

        document.getElementById('cancelWallet').addEventListener('click', () => {
            closeModal('walletPaymentModal', () => resolve({ success: false, message: 'تم إلغاء عملية الدفع' }));
        });

        confirmButton.addEventListener('click', () => {
            const verificationCode = verificationCodeInput.value;
            if (verificationCode && verificationCode.length >= 4) {
                closeModal('walletPaymentModal');
                setTimeout(() => resolve({ success: true, transactionId: 'WALLET_' + Date.now() }), 1000);
            } else {
                alert('رمز التحقق غير صحيح أو لم يتم إدخاله بشكل صحيح');
            }
        });
    });
}

    // الدفع بالتحويل البنكي
    async function handleBankTransfer(amount, currency, donorInfo) {
        return new Promise((resolve) => {
            const transferInfo = `
<div id="bankTransferModal" class="payment-modal">
    <div class="modal-content">
        <h3><i class="fas fa-university"></i> التحويل البنكي</h3>
        <div class="transfer-details">
            <p><strong>اسم البنك:</strong> البنك الإسلامي الفلسطيني</p>
            <p><strong>رقم الحساب:</strong> PS00 PALS 0123 4567 8901 2345</p>
            <p><strong>اسم المستفيد:</strong> GiveHope Foundation</p>
            <p><strong>المبلغ:</strong> ${amount} ${currency}</p>
            <p><strong>الرقم المرجعي:</strong> REF_${Date.now()}</p>
        </div>
        <div class="instructions">
            <p>⏳ الرجاء إرسال صورة التحويل إلى Zaka.anb@hotmail.com</p>
            <p>✅ سيتم تفعيل التبرع خلال 24 ساعة من استلام التحويل</p>
        </div>
        <div class="modal-buttons">
            <button id="cancelBank" type="button">إلغاء</button>
            <button id="confirmBank" type="button">دفع ${amount} ${currency}</button>
        </div>
    </div>
</div>
`;
            document.body.insertAdjacentHTML('beforeend', transferInfo);

            document.getElementById('cancelBank').addEventListener('click', () => {
                closeModal('bankTransferModal', () => resolve({ success: false, message: 'تم إلغاء عملية الدفع' }));
            });

            document.getElementById('confirmBank').addEventListener('click', () => {
                closeModal('bankTransferModal');
                resolve({ success: true, transactionId: 'BANK_' + Date.now() });
            });
        });
    }

    // دالة إغلاق النوافذ
    function closeModal(modalId, onclose) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.remove();
            if (typeof onclose === 'function') onclose();
        }
    }

    // تحديث حالة التبرع (محاكاة إرسال البيانات)
    async function updateDonationStatus(caseId, amount, donationInfo) {
        console.log('تم التبرع بنجاح:', { caseId, amount, donationInfo });
        // هنا يمكن استدعاء API لإرسال البيانات للخادم
    }
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
autoDirection(document.getElementById("name"));
autoDirection(document.getElementById("email"));
autoDirection(document.getElementById("phone"));
autoDirection(document.getElementById("idcard"));







    //************************************************************************************************/
        // بيانات الأسئلة والأجوبة
    const faq = {
        "كيف أتبرع؟": "للتبرع، يرجى ملء النموذج أعلاه واختيار مبلغ التبرع وطريقة الدفع المناسبة",
        " طريقه الدفع؟": "بطاقة / باي بال / محفظة / حوالة",
        " كم المبلغ؟'": "إذا ضغطت على “مخصص” يدخل الرقم، أو اختر أحد الأزرار المسبقة (50,100...)",
        "  التبرع من مجهول ؟": "بشكل تلقائي تم تفعيل التبرع بالمجهول لكن اذا ارت اظهار اسمك الغي هذا التفعيل",
    };

    // رسائل ترحيب عشوائية
    const welcomeMessages = [
        "مرحباً! كيف يمكنني مساعدتك اليوم؟ 😊",
        "أهلاً بك! أنا هنا للإجابة على استفساراتك حول التبرع. 🤗",
        "مساء الخير! ما الذي يمكنني مساعدتك به اليوم؟ 🌟",
        "أهلاً! أسعدني تواصلك معنا. كيف يمكنني مساعدتك؟ 💙"
    ];

    function toggleChat() {
        const chatbotWindow = document.getElementById('chatbotWindow');
        if (chatbotWindow.style.display === 'flex') {
            chatbotWindow.classList.remove('active');
            setTimeout(() => {
                chatbotWindow.style.display = 'none';
            }, 300);
        } else {
            chatbotWindow.style.display = 'flex';
            setTimeout(() => {
                chatbotWindow.classList.add('active');
            }, 10);
            
            // إضافة رسالة ترحيب عشوائية عند فتح الشات
            setTimeout(() => {
                const randomWelcome = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
                addBotMessage(randomWelcome);
            }, 500);
        }
    }

    function sendQuickReply(question) {
        // إظهار مؤشر الكتابة
        const typingIndicator = document.getElementById('typingIndicator');
        typingIndicator.style.display = 'block';
        
        // إضافة رسالة المستخدم أولاً
        addUserMessage(question);
        
        // محاكاة وقت الكتابة ثم إظهار الرد
        setTimeout(() => {
            typingIndicator.style.display = 'none';
            sendMessage(question);
        }, 1000);
    }

    function sendMessage(question) {
        const chatbotBody = document.getElementById('chatbotBody');

        let response = "عذرًا، لم أفهم سؤالك. جرب سؤال آخر 🙏";
        if (faq[question]) {
            response = faq[question];
        }

        addBotMessage(response);
    }

    function addUserMessage(message) {
        const chatbotBody = document.getElementById('chatbotBody');
        const userMessage = document.createElement('div');
        userMessage.className = 'chatbot-message user-message';
        userMessage.textContent = message;
        chatbotBody.appendChild(userMessage);
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }

    function addBotMessage(message) {
        const chatbotBody = document.getElementById('chatbotBody');
        const botMessage = document.createElement('div');
        botMessage.className = 'chatbot-message bot-message';
        botMessage.textContent = message;
        chatbotBody.appendChild(botMessage);
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }

    function sendUserMessage() {
        const userInput = document.getElementById('userInput');
        const message = userInput.value.trim();
        
        if (message !== '') {
            // إظهار مؤشر الكتابة
            const typingIndicator = document.getElementById('typingIndicator');
            typingIndicator.style.display = 'block';
            
            // إضافة رسالة المستخدم أولاً
            addUserMessage(message);
            userInput.value = '';
            
            // محاكاة وقت الكتابة ثم إظهار الرد
            setTimeout(() => {
                typingIndicator.style.display = 'none';
                sendMessage(message);
            }, 1000);
        }
    }

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            sendUserMessage();
        }
    }

    document.addEventListener('click', function(event) {
        const chatbotWindow = document.getElementById('chatbotWindow');
        const chatbotIcon = document.querySelector('.chatbot-icon');
        
        if (!chatbotWindow.contains(event.target) && !chatbotIcon.contains(event.target)) {
            if (chatbotWindow.style.display === 'flex') {
                chatbotWindow.classList.remove('active');
                setTimeout(() => {
                    chatbotWindow.style.display = 'none';
                }, 300);
            }
        }
    });


