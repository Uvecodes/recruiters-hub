// Authentication logic for login and signup

document.addEventListener('DOMContentLoaded', function() {
    // Initialize auth forms
    initializeAuthForms();
    
    // Initialize logout functionality
    initializeLogout();
});

// Initialize authentication forms
function initializeAuthForms() {
    console.log('Initializing auth forms...');
    
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    const forgotPasswordLink = document.getElementById('forgotPassword');
    
    console.log('Found forms:', { signupForm, loginForm, forgotPasswordLink });
    
    if (signupForm) {
        console.log('Adding event listener to signup form');
        signupForm.addEventListener('submit', function(event) {
            console.log('Signup form submitted!');
            handleSignup(event);
        });
    }
    
    if (loginForm) {
        console.log('Adding event listener to login form');
        loginForm.addEventListener('submit', function(event) {
            console.log('Login form submitted!');
            handleLogin(event);
        });
    }
    
    if (forgotPasswordLink) {
        console.log('Adding event listener to forgot password link');
        forgotPasswordLink.addEventListener('click', handleForgotPassword);
    }
}

// Handle user signup
async function handleSignup(event) {
    event.preventDefault();
    
    console.log('=== SIGNUP PROCESS STARTED ===');
    console.log('1. Event prevented from default behavior');
    console.log('2. Firebase available:', typeof window.firebase);
    console.log('3. Firebase functions available:', typeof window.firebaseFunctions);
    console.log('4. Utils available:', typeof window.utils);
    
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    console.log('5. Form and submit button found:', { form, submitBtn });
    
    // Get form data
    const formData = new FormData(form);
    const userData = {
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        role: formData.get('role'),
        terms: formData.get('terms')
    };
    
    console.log('6. Form data collected:', userData);
    
    // Validate form data
    console.log('7. Starting form validation...');
    const validation = validateSignupData(userData);
    console.log('8. Validation result:', validation);
    
    if (!validation.isValid) {
        console.log('9. Validation failed, showing error');
        utils.showNotification(validation.message, 'error');
        return;
    }
    
    console.log('10. Validation passed, setting loading state');
    // Set loading state
    utils.setLoadingState(submitBtn, true);
    
    try {
        console.log('11. Attempting to create user account...');
        console.log('12. Firebase functions:', window.firebaseFunctions);
        
        // Create user account
        const userCredential = await window.firebaseFunctions.createUserWithEmailAndPassword(
            userData.email,
            userData.password
        );
        
        console.log('13. User created successfully:', userCredential);
        
        console.log('14. Saving user data to Firestore...');
        // Save additional user data to Firestore
        await saveUserData(userCredential.user.uid, {
            fullName: userData.fullName,
            email: userData.email,
            role: userData.role,
            createdAt: new Date(),
            profileCompleted: false
        });
        
        console.log('15. User data saved to Firestore');
        utils.showNotification('Account created successfully!', 'success');
        
        console.log('16. Redirecting to dashboard...');
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
        
    } catch (error) {
        console.error('17. ERROR OCCURRED:', error);
        console.error('18. Error details:', {
            code: error.code,
            message: error.message,
            stack: error.stack
        });
        utils.showNotification(getErrorMessage(error), 'error');
    } finally {
        console.log('19. Cleaning up loading state');
        utils.setLoadingState(submitBtn, false);
    }
}

// Handle user login
async function handleLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Get form data
    const formData = new FormData(form);
    const loginData = {
        email: formData.get('email'),
        password: formData.get('password'),
        rememberMe: formData.get('rememberMe')
    };
    
    // Validate form data
    if (!loginData.email || !loginData.password) {
        utils.showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!utils.validateEmail(loginData.email)) {
        utils.showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Set loading state
    utils.setLoadingState(submitBtn, true);
    
    try {
        // Sign in user
        await window.firebaseFunctions.signInWithEmailAndPassword(
            loginData.email,
            loginData.password
        );
        
        utils.showNotification('Login successful!', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
        
    } catch (error) {
        console.error('Login error:', error);
        utils.showNotification(getErrorMessage(error), 'error');
    } finally {
        utils.setLoadingState(submitBtn, false);
    }
}

// Handle forgot password
async function handleForgotPassword(event) {
    event.preventDefault();
    
    const email = prompt('Please enter your email address:');
    if (!email) return;
    
    if (!utils.validateEmail(email)) {
        utils.showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    try {
        await window.firebaseFunctions.sendPasswordResetEmail(email);
        utils.showNotification('Password reset email sent! Check your inbox.', 'success');
    } catch (error) {
        console.error('Password reset error:', error);
        utils.showNotification(getErrorMessage(error), 'error');
    }
}

// Initialize logout functionality
function initializeLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

// Handle user logout
async function handleLogout() {
    try {
        await window.firebaseFunctions.signOut();
        utils.showNotification('Logged out successfully', 'success');
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        
    } catch (error) {
        console.error('Logout error:', error);
        utils.showNotification('Error logging out', 'error');
    }
}

// Save user data to Firestore
async function saveUserData(userId, userData) {
    try {
        await window.firebaseFunctions.setDoc(window.firebaseFunctions.doc(window.firebase.db, 'users', userId), userData);
    } catch (error) {
        console.error('Error saving user data:', error);
        throw error;
    }
}

// Validate signup data
function validateSignupData(data) {
    // Check required fields
    if (!data.fullName || !data.email || !data.password || !data.confirmPassword || !data.role) {
        return {
            isValid: false,
            message: 'Please fill in all required fields'
        };
    }
    
    // Validate email
    if (!utils.validateEmail(data.email)) {
        return {
            isValid: false,
            message: 'Please enter a valid email address'
        };
    }
    
    // Validate password
    const passwordValidation = utils.validatePassword(data.password);
    if (!passwordValidation.isValid) {
        return {
            isValid: false,
            message: 'Password must be at least 8 characters long and contain uppercase, lowercase, and numbers'
        };
    }
    
    // Check password confirmation
    if (data.password !== data.confirmPassword) {
        return {
            isValid: false,
            message: 'Passwords do not match'
        };
    }
    
    // Check terms acceptance
    if (!data.terms) {
        return {
            isValid: false,
            message: 'Please accept the terms and conditions'
        };
    }
    
    return {
        isValid: true,
        message: 'Validation successful'
    };
}

// Get user-friendly error message
function getErrorMessage(error) {
    switch (error.code) {
        case 'auth/user-not-found':
            return 'No account found with this email address';
        case 'auth/wrong-password':
            return 'Incorrect password';
        case 'auth/email-already-in-use':
            return 'An account with this email already exists';
        case 'auth/weak-password':
            return 'Password is too weak. Please choose a stronger password';
        case 'auth/invalid-email':
            return 'Invalid email address';
        case 'auth/too-many-requests':
            return 'Too many failed attempts. Please try again later';
        case 'auth/network-request-failed':
            return 'Network error. Please check your connection';
        default:
            return 'An error occurred. Please try again';
    }
}

// Check if user is authenticated
function checkAuthStatus() {
    return new Promise((resolve) => {
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            unsubscribe();
            resolve(user);
        });
    });
}

// Get current user data from Firestore
async function getCurrentUserData() {
    try {
        const user = firebase.auth().currentUser;
        if (!user) return null;
        
        const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
        return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}

// Update user data
async function updateUserData(updates) {
    try {
        const user = firebase.auth().currentUser;
        if (!user) throw new Error('No authenticated user');
        
        await firebase.firestore().collection('users').doc(user.uid).update(updates);
        return true;
    } catch (error) {
        console.error('Error updating user data:', error);
        throw error;
    }
}



// Export auth functions
window.auth = {
    handleSignup,
    handleLogin,
    handleLogout,
    handleForgotPassword,
    checkAuthStatus,
    getCurrentUserData,
    updateUserData,
    validateSignupData,
    getErrorMessage
}; 