// DOM Elements
const loginForm = document.getElementById('loginForm');
const phoneLoginForm = document.getElementById('phoneLoginForm');
const verificationForm = document.getElementById('verificationForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const phoneNumberInput = document.getElementById('phoneNumber');
const verificationCodeInput = document.getElementById('verificationCode');
const rememberMeCheckbox = document.getElementById('rememberMe');
const googleLoginBtn = document.getElementById('googleLogin');
const phoneLoginBtn = document.getElementById('phoneLogin');
const backToLoginBtn = document.getElementById('backToLogin');
const backToPhoneBtn = document.getElementById('backToPhone');
const resendCodeBtn = document.getElementById('resendCode');
const togglePasswordBtn = document.querySelector('.toggle-password');

// Get Firebase auth instance
const auth = firebase.auth();

// Variables to store phone authentication data
let confirmationResult = null;

// Toggle password visibility
togglePasswordBtn.addEventListener('click', function() {
    const input = this.parentElement.querySelector('input');
    const icon = this.querySelector('i');
    
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

// Form validation
function validateForm() {
    let isValid = true;
    const errors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        errors.email = 'Please enter a valid email address';
        isValid = false;
    }

    // Password validation
    if (passwordInput.value.length < 6) {
        errors.password = 'Password must be at least 6 characters long';
        isValid = false;
    }

    // Display errors
    Object.keys(errors).forEach(field => {
        const errorElement = document.querySelector(`#${field}`).parentElement.querySelector('.error-message');
        errorElement.textContent = errors[field];
        errorElement.style.display = 'block';
    });

    return isValid;
}

// Form submission
loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    try {
        const email = emailInput.value;
        const password = passwordInput.value;

        // Sign in with email and password
        await auth.signInWithEmailAndPassword(email, password);

        // Set persistence based on remember me checkbox
        if (rememberMeCheckbox.checked) {
            await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        } else {
            await auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
        }

        // Show success message
        alert('Successfully logged in!');
        
        // Redirect to home page
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Login error:', error);
        let errorMessage = 'An error occurred during login. Please try again.';
        
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = 'No account found with this email. Please sign up.';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Incorrect password. Please try again.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Please enter a valid email address.';
                break;
            case 'auth/user-disabled':
                errorMessage = 'This account has been disabled. Please contact support.';
                break;
        }
        
        alert(errorMessage);
    }
});

// Google Sign In
googleLoginBtn.addEventListener('click', async function() {
    try {
        // Create a Google provider
        const provider = new firebase.auth.GoogleAuthProvider();
        
        // Add scopes if needed
        provider.addScope('profile');
        provider.addScope('email');
        
        // Sign in with popup
        const result = await auth.signInWithPopup(provider);
        
        // Show success message
        alert('Successfully signed in with Google!');
        
        // Redirect to home page
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Google login error:', error);
        let errorMessage = 'Failed to sign in with Google. Please try again.';
        
        if (error.code === 'auth/popup-blocked') {
            errorMessage = 'Pop-up was blocked by your browser. Please allow pop-ups for this site.';
        } else if (error.code === 'auth/popup-closed-by-user') {
            errorMessage = 'Sign-in was cancelled. Please try again.';
        } else if (error.code === 'auth/cancelled-popup-request') {
            errorMessage = 'Sign-in was cancelled. Please try again.';
        }
        
        alert(errorMessage);
    }
});

// Phone Login Button Click
phoneLoginBtn.addEventListener('click', function() {
    // Hide the regular login form
    loginForm.style.display = 'none';
    document.querySelector('.social-login').style.display = 'none';
    
    // Show the phone login form
    phoneLoginForm.style.display = 'block';
});

// Back to Login Button Click
backToLoginBtn.addEventListener('click', function() {
    // Hide the phone login form
    phoneLoginForm.style.display = 'none';
    
    // Show the regular login form
    loginForm.style.display = 'block';
    document.querySelector('.social-login').style.display = 'block';
});

// Back to Phone Button Click
backToPhoneBtn.addEventListener('click', function() {
    // Hide the verification form
    verificationForm.style.display = 'none';
    
    // Show the phone login form
    phoneLoginForm.style.display = 'block';
});

// Phone Login Form Submission
phoneLoginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const phoneNumber = phoneNumberInput.value.trim();
    
    if (!phoneNumber) {
        const errorElement = phoneNumberInput.parentElement.querySelector('.error-message');
        errorElement.textContent = 'Please enter your phone number';
        errorElement.style.display = 'block';
        return;
    }
    
    try {
        // Create a reCAPTCHA verifier
        const recaptchaVerifier = new firebase.auth.RecaptchaVerifier('phoneLoginBtn', {
            'size': 'invisible',
            'callback': (response) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
            }
        });
        
        // Sign in with phone number
        confirmationResult = await auth.signInWithPhoneNumber(phoneNumber, recaptchaVerifier);
        
        // Hide phone login form
        phoneLoginForm.style.display = 'none';
        
        // Show verification form
        verificationForm.style.display = 'block';
        
    } catch (error) {
        console.error('Phone login error:', error);
        let errorMessage = 'Failed to send verification code. Please try again.';
        
        if (error.code === 'auth/invalid-phone-number') {
            errorMessage = 'Please enter a valid phone number with country code.';
        }
        
        const errorElement = phoneNumberInput.parentElement.querySelector('.error-message');
        errorElement.textContent = errorMessage;
        errorElement.style.display = 'block';
    }
});

// Verification Form Submission
verificationForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const code = verificationCodeInput.value.trim();
    
    if (!code) {
        const errorElement = verificationCodeInput.parentElement.querySelector('.error-message');
        errorElement.textContent = 'Please enter the verification code';
        errorElement.style.display = 'block';
        return;
    }
    
    try {
        // Confirm the code
        await confirmationResult.confirm(code);
        
        // Show success message
        alert('Successfully signed in with phone!');
        
        // Redirect to home page
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Verification error:', error);
        let errorMessage = 'Failed to verify code. Please try again.';
        
        if (error.code === 'auth/invalid-verification-code') {
            errorMessage = 'Invalid verification code. Please try again.';
        } else if (error.code === 'auth/code-expired') {
            errorMessage = 'Verification code has expired. Please request a new one.';
        }
        
        const errorElement = verificationCodeInput.parentElement.querySelector('.error-message');
        errorElement.textContent = errorMessage;
        errorElement.style.display = 'block';
    }
});

// Resend Code Button Click
resendCodeBtn.addEventListener('click', async function() {
    try {
        const phoneNumber = phoneNumberInput.value.trim();
        
        if (!phoneNumber) {
            alert('Please enter your phone number first');
            return;
        }
        
        // Create a new reCAPTCHA verifier
        const recaptchaVerifier = new firebase.auth.RecaptchaVerifier('phoneLoginBtn', {
            'size': 'invisible',
            'callback': (response) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
            }
        });
        
        // Sign in with phone number again
        confirmationResult = await auth.signInWithPhoneNumber(phoneNumber, recaptchaVerifier);
        
        alert('New verification code sent!');
    } catch (error) {
        console.error('Resend code error:', error);
        alert('Failed to resend verification code. Please try again.');
    }
}); 