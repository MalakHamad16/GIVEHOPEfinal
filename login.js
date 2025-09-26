// JavaScript for Arabic Login Page

document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const loginForm = document.getElementById('loginForm');
    const toggleLoginPassword = document.getElementById('toggleLoginPassword');
    const loginPassword = document.getElementById('loginPassword');
    
    // Success modal
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    const successMessage = document.getElementById('successMessage');

    // Arabic messages
    const messages = {
        buttons: {
            signingIn: 'جاري تسجيل الدخول...',
            signIn: 'تسجيل الدخول'
        },
        success: {
            signIn: 'أهلاً بعودتك! تم تسجيل الدخول بنجاح باستخدام'
        },
        validation: {
            emailInvalid: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
            fieldRequired: 'هذا الحقل مطلوب'
        }
    };

    // Password visibility toggle functionality
    toggleLoginPassword.addEventListener('click', function() {
        const type = loginPassword.getAttribute('type') === 'password' ? 'text' : 'password';
        loginPassword.setAttribute('type', type);
        
        const icon = this.querySelector('i');
        if (type === 'text') {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });

    // Form validation
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required]');
        
        inputs.forEach(input => {
            const value = input.value.trim();
            
            // Remove previous validation classes
            input.classList.remove('is-valid', 'is-invalid');
            
            if (value === '') {
                input.classList.add('is-invalid');
                isValid = false;
            } else if (input.type === 'email' && !validateEmail(value)) {
                input.classList.add('is-invalid');
                isValid = false;
            } else {
                input.classList.add('is-valid');
            }
        });
        
        return isValid;
    }

    function clearValidation(form) {
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.classList.remove('is-valid', 'is-invalid');
        });
    }

    // Form submission handler
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm(this)) {
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm ms-2"></span>${messages.buttons.signingIn}`;
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                const email = document.getElementById('loginEmail').value;
                successMessage.textContent = `${messages.success.signIn} ${email}`;
                successModal.show();
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Clear form
                this.reset();
                clearValidation(this);
            }, 2000);
        }
    });

    // Real-time validation for better UX
    const allInputs = document.querySelectorAll('input');
    allInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() !== '') {
                if (this.type === 'email' && !validateEmail(this.value)) {
                    this.classList.add('is-invalid');
                    this.classList.remove('is-valid');
                } else {
                    this.classList.add('is-valid');
                    this.classList.remove('is-invalid');
                }
            }
        });
        
        input.addEventListener('input', function() {
            // Remove invalid class when user starts typing
            if (this.classList.contains('is-invalid')) {
                this.classList.remove('is-invalid');
            }
        });
    });

    // RTL-specific enhancements
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            // Ensure cursor starts at the right position for RTL
            setTimeout(() => {
                if (this.value === '') {
                    this.style.textAlign = 'right';
                }
            }, 10);
        });
        
        input.addEventListener('input', function() {
            // Maintain RTL alignment while typing
            this.style.textAlign = 'right';
        });
    });

    // Handle form auto-fill detection
    function checkAutoFill() {
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            if (input.value !== '') {
                input.classList.add('is-valid');
            }
        });
    }

    // Check for auto-filled inputs after a short delay
    setTimeout(checkAutoFill, 500);
    
    // Also check when the page becomes visible (user switches tabs)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            setTimeout(checkAutoFill, 100);
        }
    });
});
