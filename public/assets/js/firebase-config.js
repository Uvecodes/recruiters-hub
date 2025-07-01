// Firebase configuration using ES6 modules
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
// import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
// import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";



const firebaseConfig = {
  apiKey: "AIzaSyDbKv-4jOeu1b-_6nLAauRn-FtdClfMIu8",
  authDomain: "recruiters-hub-12246.firebaseapp.com",
  projectId: "recruiters-hub-12246",
  storageBucket: "recruiters-hub-12246.firebasestorage.app",
  messagingSenderId: "827201293697",
  appId: "1:827201293697:web:e638c7343af74862ddec80",
  measurementId: "G-Q7YWPT9TJS"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);

// Initialize Firebase services
// const auth = getAuth(app);
// const db = getFirestore(app);
// const storage = getStorage(app);
// const analytics = getAnalytics(app);

// gpt check
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
} else {
  firebase.app(); // Use existing app
}

window.db = firebase.firestore();
console.log("✅ Firebase initialized and Firestore is available as window.db");

// Make Firebase services globally available
// window.firebase = {
    // auth,
    // db,
    // storage,
    // analytics
// };
// gpt check. declaring services properly
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// gpt check to make firebase services globally available

window.firebaseAuth = firebase.auth();
window.firebaseDB = firebase.firestore();
window.firebaseStorage = firebase.storage();

console.log("✅ Firebase initialized");

// ✅ Optionally expose globally still part of gpt check
window.firebaseAuth = auth;
window.firebaseDB = db;
window.firebaseStorage = storage;

// Auth state observer
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        console.log('User is signed in:', user.email);
        updateUIForAuthenticatedUser(user);
    } else {
        // User is signed out
        console.log('User is signed out');
        updateUIForUnauthenticatedUser();
    }
});

// Helper function to get current user
function getCurrentUser() {
    return auth.currentUser;
}

// Helper function to check if user is authenticated
function isAuthenticated() {
    return !!auth.currentUser;
}

// Export helper functions
window.firebaseHelpers = {
    getCurrentUser,
    isAuthenticated
};

// Export Firebase functions for use in other modules
window.firebaseFunctions = {
    createUserWithEmailAndPassword: auth.createUserWithEmailAndPassword.bind(auth),
    signInWithEmailAndPassword: auth.signInWithEmailAndPassword.bind(auth),
    signOut: auth.signOut.bind(auth),
    sendPasswordResetEmail: auth.sendPasswordResetEmail.bind(auth),
    // setDoc,
    // getDoc,
    // updateDoc,
    // doc
};

console.log('Firebase initialized successfully with ES6 modules');

// Update UI for authenticated user
function updateUIForAuthenticatedUser(user) {
    const logoutBtn = document.getElementById('logoutBtn');
    const navLinks = document.querySelector('.nav-links');
    
    if (logoutBtn) {
        logoutBtn.style.display = 'block';
    }
    
    // Update user info in dashboard if on dashboard page
    if (window.location.pathname.includes('dashboard.html')) {
        updateDashboardUserInfo(user);
    }
}

// Update UI for unauthenticated user
function updateUIForUnauthenticatedUser() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.style.display = 'none';
    }
    
    // Redirect to login if on protected pages
    const protectedPages = ['dashboard.html', 'user-setting.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        window.location.href = 'login.html';
    }
}

// Update dashboard user info
async function updateDashboardUserInfo(user) {
    try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            
            const userName = document.getElementById('userName');
            const userRole = document.getElementById('userRole');
            const userAvatar = document.getElementById('userAvatar');
            
            if (userName) userName.textContent = userData.fullName || user.displayName || 'User';
            if (userRole) userRole.textContent = userData.role || 'Developer';
            if (userAvatar && userData.avatarUrl) {
                userAvatar.src = userData.avatarUrl;
            }
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
} 