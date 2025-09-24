// JavaScript for Arabic Signup Page

document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const registerForm = document.getElementById('registerForm');
    const toggleRegisterPassword = document.getElementById('toggleRegisterPassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const registerPassword = document.getElementById('registerPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    
    // Success modal
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    const successMessage = document.getElementById('successMessage');

    // Arabic messages
    const messages = {
        passwordStrength: {
            weak: 'ضعيفة',
            medium: 'متوسطة',
            strong: 'قوية',
            requirements: {
                length: 'على الأقل 8 أحرف',
                lowercase: 'حرف صغير',
                uppercase: 'حرف كبير',
                number: 'رقم',
                special: 'رمز خاص'
            },
            missing: 'مفقود',
            excellent: 'كلمة مرور ممتازة!',
            good: 'كلمة مرور جيدة!'
        },
        buttons: {
            creatingAccount: 'جاري إنشاء الحساب...',
            createAccount: 'إنشاء حساب'
        },
        success: {
            signUp: 'أهلاً {name}! تم إنشاء حسابك بنجاح. تم إرسال رسالة تأكيد إلى {email}'
        },
        validation: {
            emailInvalid: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
            passwordTooShort: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل',
            passwordMismatch: 'كلمات المرور غير متطابقة',
            fieldRequired: 'هذا الحقل مطلوب',
            agreeTerms: 'يجب الموافقة على الشروط والأحكام'
        }
    };

    // Password visibility toggle functionality
    function setupPasswordToggle(toggleBtn, passwordField) {
        toggleBtn.addEventListener('click', function() {
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            
            const icon = toggleBtn.querySelector('i');
            if (type === 'text') {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }

    // Setup password toggles
    setupPasswordToggle(toggleRegisterPassword, registerPassword);
    setupPasswordToggle(toggleConfirmPassword, confirmPassword);

    // Password strength indicator
    registerPassword.addEventListener('input', function() {
        const password = this.value;
        updatePasswordStrength(password);
        
        // Real-time password confirmation validation
        if (confirmPassword.value) {
            validatePasswordMatch();
        }
    });

    confirmPassword.addEventListener('input', validatePasswordMatch);

    function updatePasswordStrength(password) {
        // Remove existing strength indicator
        removePasswordStrengthIndicator();
        
        if (password.length === 0) return;
        
        const strength = calculatePasswordStrength(password);
        const strengthIndicator = document.createElement('div');
        strengthIndicator.className = `password-strength ${strength.class}`;
        strengthIndicator.id = 'passwordStrengthIndicator';
        
        const passwordGroup = registerPassword.closest('.mb-3');
        passwordGroup.appendChild(strengthIndicator);
        
        // Update form text with strength info
        const formText = passwordGroup.querySelector('.form-text');
        formText.textContent = `قوة كلمة المرور: ${strength.text}. ${strength.requirements}`;
        formText.className = `form-text text-${strength.textColor}`;
    }

    function calculatePasswordStrength(password) {
        let score = 0;
        let requirements = [];
        
        // Length check
        if (password.length >= 8) score += 1;
        else requirements.push(messages.passwordStrength.requirements.length);
        
        // Lowercase check
        if (/[a-z]/.test(password)) score += 1;
        else requirements.push(messages.passwordStrength.requirements.lowercase);
        
        // Uppercase check
        if (/[A-Z]/.test(password)) score += 1;
        else requirements.push(messages.passwordStrength.requirements.uppercase);
        
        // Number check
        if (/\d/.test(password)) score += 1;
        else requirements.push(messages.passwordStrength.requirements.number);
        
        // Special character check
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
        else requirements.push(messages.passwordStrength.requirements.special);
        
        if (score < 3) {
            return {
                class: 'weak',
                text: messages.passwordStrength.weak,
                textColor: 'danger',
                requirements: requirements.length > 0 ? `${messages.passwordStrength.missing}: ${requirements.join('، ')}` : ''
            };
        } else if (score < 5) {
            return {
                class: 'medium',
                text: messages.passwordStrength.medium,
                textColor: 'warning',
                requirements: requirements.length > 0 ? `${messages.passwordStrength.missing}: ${requirements.join('، ')}` : messages.passwordStrength.good
            };
        } else {
            return {
                class: 'strong',
                text: messages.passwordStrength.strong,
                textColor: 'success',
                requirements: messages.passwordStrength.excellent
            };
        }
    }

    function removePasswordStrengthIndicator() {
        const existing = document.getElementById('passwordStrengthIndicator');
        if (existing) {
            existing.remove();
        }
    }

    function validatePasswordMatch() {
        const password = registerPassword.value;
        const confirm = confirmPassword.value;
        
        if (confirm === '') {
            confirmPassword.classList.remove('is-valid', 'is-invalid');
            return;
        }
        
        if (password === confirm) {
            confirmPassword.classList.remove('is-invalid');
            confirmPassword.classList.add('is-valid');
        } else {
            confirmPassword.classList.remove('is-valid');
            confirmPassword.classList.add('is-invalid');
        }
    }

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
            } else if (input.id === 'registerPassword' && value.length < 8) {
                input.classList.add('is-invalid');
                isValid = false;
            } else if (input.id === 'confirmPassword' && value !== registerPassword.value) {
                input.classList.add('is-invalid');
                isValid = false;
            } else {
                input.classList.add('is-valid');
            }
        });
        
        // Check terms agreement
        const agreeTerms = document.getElementById('agreeTerms');
        if (!agreeTerms.checked) {
            agreeTerms.classList.add('is-invalid');
            isValid = false;
        } else {
            agreeTerms.classList.remove('is-invalid');
        }
        
        return isValid;
    }

    function clearValidation(form) {
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.classList.remove('is-valid', 'is-invalid');
        });
    }

    // Form submission handler
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm(this)) {
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm ms-2"></span>${messages.buttons.creatingAccount}`;
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                const firstName = document.getElementById('firstName').value;
                const email = document.getElementById('registerEmail').value;
                successMessage.textContent = messages.success.signUp
                    .replace('{name}', firstName)
                    .replace('{email}', email);
                successModal.show();
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Clear form
                this.reset();
                clearValidation(this);
                removePasswordStrengthIndicator();
                
                // Redirect to login page after modal is closed
                successModal._element.addEventListener('hidden.bs.modal', function() {
                    window.location.href = 'login.html';
                }, { once: true });
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
                } else if (this.id === 'registerPassword' && this.value.length < 8) {
                    this.classList.add('is-invalid');
                    this.classList.remove('is-valid');
                } else if (this.id === 'confirmPassword' && this.value !== registerPassword.value) {
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
});
