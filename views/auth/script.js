document.addEventListener('DOMContentLoaded', function() {
    // Tab Navigation
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const phoneLoginForm = document.querySelector('.phone-login');
    const showPhoneLoginBtn = document.getElementById('showPhoneLoginBtn');
    const showPhoneSignupBtn = document.getElementById('showPhoneSignupBtn');
    const backBtn = document.querySelector('.back-btn');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    console.log('Tab buttons:', tabBtns.length); // Debug log
    console.log('Tab contents:', tabContents.length); // Debug log

    // Function to show phone login form
    function showPhoneLogin() {
        // Hide all tab contents
        tabContents.forEach(content => content.classList.remove('active'));
        // Show phone login form
        phoneLoginForm.classList.remove('hidden');
        // Reset OTP fields
        document.querySelector('.otp-group').classList.add('hidden');
        document.querySelector('.verify-otp-btn').classList.add('hidden');
        document.querySelector('.send-otp-btn').textContent = '<span><i class="fas fa-paper-plane"></i> Send OTP</span>';
    }

    // Function to go back to previous form
    function goBack() {
        // Hide phone login form
        phoneLoginForm.classList.add('hidden');
        // Show the active tab content
        const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
        document.getElementById(activeTab).classList.add('active');
    }

    // Event listeners for phone login buttons
    if (showPhoneLoginBtn) {
        showPhoneLoginBtn.addEventListener('click', showPhoneLogin);
    }

    if (showPhoneSignupBtn) {
        showPhoneLoginBtn.addEventListener('click', showPhoneLogin);
    }

    // Event listener for back button
    if (backBtn) {
        backBtn.addEventListener('click', goBack);
    }

    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            console.log('Tab clicked:', btn.getAttribute('data-tab')); // Debug log
            
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            const targetContent = document.getElementById(tabId);
            if (targetContent) {
                targetContent.classList.add('active');
                console.log('Activated content:', tabId); // Debug log
            } else {
                console.log('Could not find content:', tabId); // Debug log
            }
        });
    });

    // Password Toggle
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this;
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Password Strength Checker
    const signupPassword = document.getElementById('signupPassword');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');

    if (signupPassword) {
        signupPassword.addEventListener('input', function() {
            const strength = checkPasswordStrength(this.value);
            updateStrengthIndicator(strength);
        });
    }

    function checkPasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/)) strength++;
        if (password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[^a-zA-Z0-9]/)) strength++;
        return strength;
    }

    function updateStrengthIndicator(strength) {
        if (strengthBar && strengthText) {
            const percentage = (strength / 5) * 100;
            strengthBar.style.setProperty('--strength', `${percentage}%`);
            
            let color, text;
            if (strength <= 2) {
                color = '#ff4444';
                text = 'Weak';
            } else if (strength <= 3) {
                color = '#ffbb33';
                text = 'Medium';
            } else if (strength <= 4) {
                color = '#00C851';
                text = 'Strong';
            } else {
                color = '#007E33';
                text = 'Very Strong';
            }
            
            strengthBar.style.setProperty('--strength-color', color);
            strengthText.textContent = `Password Strength: ${text}`;
        }
    }

    // Form Validation
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
        }
        input.classList.add('error');
    }

    function clearError(input) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = '';
        }
        input.classList.remove('error');
    }

    // Login Form
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail');
            const password = document.getElementById('loginPassword');
            let isValid = true;

            // Clear previous errors
            clearError(email);
            clearError(password);

            // Validate email
            if (!email.value.trim()) {
                showError(email, 'Email is required');
                isValid = false;
            } else if (!validateEmail(email.value)) {
                showError(email, 'Please enter a valid email');
                isValid = false;
            }

            // Validate password
            if (!password.value.trim()) {
                showError(password, 'Password is required');
                isValid = false;
            }

            if (isValid) {
                const submitBtn = loginForm.querySelector('.submit-btn');
                submitBtn.classList.add('loading');
                
                // Simulate login (replace with actual authentication)
                setTimeout(() => {
                    submitBtn.classList.remove('loading');
                    alert('Login successful!');
                }, 1500);
            }
        });
    }

    // Signup Form
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('signupName');
            const email = document.getElementById('signupEmail');
            const password = document.getElementById('signupPassword');
            let isValid = true;

            // Clear previous errors
            clearError(name);
            clearError(email);
            clearError(password);

            // Validate name
            if (!name.value.trim()) {
                showError(name, 'Name is required');
                isValid = false;
            }

            // Validate email
            if (!email.value.trim()) {
                showError(email, 'Email is required');
                isValid = false;
            } else if (!validateEmail(email.value)) {
                showError(email, 'Please enter a valid email');
                isValid = false;
            }

            // Validate password
            if (!password.value.trim()) {
                showError(password, 'Password is required');
                isValid = false;
            } else if (password.value.length < 8) {
                showError(password, 'Password must be at least 8 characters');
                isValid = false;
            }

            if (isValid) {
                const submitBtn = signupForm.querySelector('.submit-btn');
                submitBtn.classList.add('loading');
                
                // Simulate signup (replace with actual registration)
                setTimeout(() => {
                    submitBtn.classList.remove('loading');
                    alert('Account created successfully!');
                }, 1500);
            }
        });
    }

    // Phone Login
    const sendOtpBtn = document.querySelector('.send-otp-btn');
    const otpGroup = document.querySelector('.otp-group');
    const phoneInput = document.getElementById('phoneNumber');
    const verifyOtpBtn = document.querySelector('.verify-otp-btn');
    const otpInputs = document.querySelectorAll('.otp-input');

    if (sendOtpBtn && phoneInput) {
        sendOtpBtn.addEventListener('click', function() {
            if (!phoneInput.value.trim()) {
                showError(phoneInput, 'Phone number is required');
                return;
            }

            this.classList.add('loading');
            
            // Simulate OTP sending
            setTimeout(() => {
                this.classList.remove('loading');
                otpGroup.classList.remove('hidden');
                verifyOtpBtn.classList.remove('hidden');
                this.textContent = '<span><i class="fas fa-paper-plane"></i> Resend OTP</span>';
            }, 1500);
        });
    }

    // OTP input handling
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', function() {
            if (this.value.length === 1) {
                if (index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
            }
        });

        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && !this.value && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });

    // Verify OTP
    if (verifyOtpBtn) {
        verifyOtpBtn.addEventListener('click', function() {
            let otp = '';
            otpInputs.forEach(input => {
                otp += input.value;
            });

            if (otp.length !== 4) {
                alert('Please enter the complete OTP');
                return;
            }

            this.classList.add('loading');
            
            // Simulate OTP verification
            setTimeout(() => {
                this.classList.remove('loading');
                alert('Phone number verified successfully!');
                goBack();
            }, 1500);
        });
    }

    // Google Sign-in
    const googleBtns = document.querySelectorAll('.google-btn');
    googleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.add('loading');
            
            // Simulate Google sign-in
            setTimeout(() => {
                this.classList.remove('loading');
                alert('Google sign-in successful!');
            }, 1500);
        });
    });
}); 