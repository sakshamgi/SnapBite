// DOM Elements
const signupForm = document.getElementById('signupForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const termsCheckbox = document.getElementById('terms');
const togglePasswordBtns = document.querySelectorAll('.toggle-password');
const strengthBar = document.querySelector('.strength-bar');
const strengthText = document.querySelector('.strength-text span');
const phoneSignupForm = document.getElementById('phoneSignupForm');
const verificationForm = document.getElementById('verificationForm');
const phoneSignupBtn = document.getElementById('phoneSignup');
const googleSignupBtn = document.getElementById('googleSignup');

// Get Firebase auth instance
const auth = firebase.auth();

// Global variables for phone auth
let confirmationResult = null;

// Password strength checker
function checkPasswordStrength(password) {
    let strength = 0;
    const feedback = [];

    // Length check
    if (password.length >= 8) {
        strength += 25;
    } else {
        feedback.push('at least 8 characters');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
        strength += 25;
    } else {
        feedback.push('uppercase letter');
    }

    // Number check
    if (/[0-9]/.test(password)) {
        strength += 25;
    } else {
        feedback.push('number');
    }

    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) {
        strength += 25;
    } else {
        feedback.push('special character');
    }

    // Update strength indicator
    strengthBar.style.width = `${strength}%`;
    
    if (strength === 0) {
        strengthBar.style.backgroundColor = '#ddd';
        strengthText.textContent = 'None';
    } else if (strength <= 25) {
        strengthBar.style.backgroundColor = '#ff4444';
        strengthText.textContent = 'Weak';
    } else if (strength <= 50) {
        strengthBar.style.backgroundColor = '#ffbb33';
        strengthText.textContent = 'Fair';
    } else if (strength <= 75) {
        strengthBar.style.backgroundColor = '#00C851';
        strengthText.textContent = 'Good';
    } else {
        strengthBar.style.backgroundColor = '#007E33';
        strengthText.textContent = 'Strong';
    }

    return {
        strength,
        feedback: feedback.length ? `Add ${feedback.join(', ')}` : null
    };
}

// Toggle password visibility
togglePasswordBtns.forEach(btn => {
    btn.addEventListener('click', function() {
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
});

// Real-time password strength checking
passwordInput.addEventListener('input', function() {
    const result = checkPasswordStrength(this.value);
    const errorMessage = this.parentElement.parentElement.querySelector('.error-message');
    
    if (result.feedback) {
        errorMessage.textContent = result.feedback;
        errorMessage.style.display = 'block';
    } else {
        errorMessage.style.display = 'none';
    }
});

// Form validation
function validateForm() {
    let isValid = true;
    const errors = {};

    // Name validation
    if (nameInput.value.trim().length < 2) {
        errors.name = 'Please enter a valid name';
        isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        errors.email = 'Please enter a valid email address';
        isValid = false;
    }

    // Password validation
    const passwordResult = checkPasswordStrength(passwordInput.value);
    if (passwordResult.strength < 50) {
        errors.password = 'Please create a stronger password';
        isValid = false;
    }

    // Confirm password validation
    if (passwordInput.value !== confirmPasswordInput.value) {
        errors.confirmPassword = 'Passwords do not match';
        isValid = false;
    }

    // Terms validation
    if (!termsCheckbox.checked) {
        errors.terms = 'Please accept the terms and conditions';
        isValid = false;
    }

    // Display errors
    Object.keys(errors).forEach(field => {
        const errorElement = document.querySelector(`#${field}`).parentElement.parentElement.querySelector('.error-message');
        errorElement.textContent = errors[field];
        errorElement.style.display = 'block';
    });

    return isValid;
}

// Form submission
signupForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    try {
        const email = emailInput.value;
        const password = passwordInput.value;
        const name = nameInput.value;

        // Create user with email and password
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        
        // Update user profile with name
        await userCredential.user.updateProfile({
            displayName: name
        });

        // Show success message
        alert('Account created successfully!');
        
        // Redirect to login page
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Signup error:', error);
        let errorMessage = 'An error occurred during signup. Please try again.';
        
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'This email is already registered. Please use a different email or login.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Please enter a valid email address.';
                break;
            case 'auth/operation-not-allowed':
                errorMessage = 'Email/password accounts are not enabled. Please contact support.';
                break;
            case 'auth/weak-password':
                errorMessage = 'Please create a stronger password.';
                break;
        }
        
        alert(errorMessage);
    }
});

// Google Sign In
googleSignupBtn.addEventListener('click', async function() {
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
        console.error('Google signup error:', error);
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

// Phone Sign In
phoneSignupBtn.addEventListener('click', () => {
    signupForm.style.display = 'none';
    phoneSignupForm.style.display = 'block';
    verificationForm.style.display = 'none';
});

// Handle phone number submission
phoneSignupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const phoneNumber = document.getElementById('phoneNumber').value;
    if (!phoneNumber) {
        showError('phoneError', 'Please enter your phone number');
        return;
    }

    try {
        const appVerifier = new firebase.auth.RecaptchaVerifier('phoneSignup', {
            size: 'invisible'
        });
        
        confirmationResult = await auth.signInWithPhoneNumber(phoneNumber, appVerifier);
        phoneSignupForm.style.display = 'none';
        verificationForm.style.display = 'block';
    } catch (error) {
        showError('phoneError', error.message);
    }
});

// Handle verification code submission
verificationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const code = document.getElementById('verificationCode').value;
    if (!code) {
        showError('verificationError', 'Please enter the verification code');
        return;
    }

    try {
        await confirmationResult.confirm(code);
        window.location.href = 'index.html';
    } catch (error) {
        showError('verificationError', 'Invalid verification code');
    }
});

// Utility functions
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
    });
} 