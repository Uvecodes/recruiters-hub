// auth.js

// Global Toast Notification System
function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    if (!toast) return;
    
    // Clear any existing timeout
    if (toast.timeoutId) {
        clearTimeout(toast.timeoutId);
    }
    
    // Set message and type
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    // Hide toast after 3 seconds
    toast.timeoutId = setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => {
            toast.classList.add("hidden");
        }, 300);
    }, 3000);
}

// 🔧 Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDbKv-4jOeu1b-_6nLAauRn-FtdClfMIu8",
    authDomain: "recruiters-hub-12246.firebaseapp.com",
    projectId: "recruiters-hub-12246",
    storageBucket: "recruiters-hub-12246.firebasestorage.app",
    messagingSenderId: "827201293697",
    appId: "1:827201293697:web:e638c7343af74862ddec80",
    measurementId: "G-Q7YWPT9TJS"
  };

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
// console.log({auth, db});

// ✅ Forgot Password Function
async function forgotPassword() {
    // Create a clean modal for email input
    const email = prompt("Please enter your email address to reset your password:");
    
    if (!email) {
        showToast("Email is required", "error");
        return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast("Please enter a valid email address", "error");
        return;
    }
    
    try {
        await auth.sendPasswordResetEmail(email);
        showToast("Password reset email sent!", "success");
    } catch (error) {
        showToast(error.message, "error");
    }
}

// ✅ Register with extra fields
async function register() {
  const name = document.getElementById("fullName").value.trim();
  const role = document.getElementById("registerRole").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const remember = document.getElementById("registerRemember").checked;

  if (!name || !role || !email || !password) {
    showToast("Please fill all fields.", "error");
    return;
  }

  // Handle "Remember me"
  auth.setPersistence(
    remember ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION
  ).then(async () => {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Save extra data to Firestore
    await db.collection("users").doc(user.uid).set({
      name,
      role,
      email,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    showToast("Registered and logged in!", "success");
    window.location.href = "../dashboard.html";
  }).catch((error) => {
    showToast(error.message, "error");
  });
}

// ✅ Login with remember me
async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const remember = document.getElementById("loginRememberMe").checked;

  auth.setPersistence(
    remember ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION
  ).then(async () => {
    await auth.signInWithEmailAndPassword(email, password);
    showToast("Logged in!", "success");
    window.location.href = "../dashboard.html";
  }).catch((err) => {
    showToast(err.message, "error");
  });
}

// ✅ Logout
async function logout() {
  await auth.signOut();
  showToast("Logged out!", "success");
  window.location.href = "./index.html";
}

// 🔐 Auth state monitor
firebase.auth().onAuthStateChanged(function (user) {
  const status = document.getElementById("userInfo");
  if (user) {
    if (status) status.innerText = `Logged in as: ${user.email}`;
  } else {
    if (window.location.pathname.includes("dashboard")) {
      window.location.href = "index.html";
    }
  }
});

// 📧 Add event listener for forgot password link
document.addEventListener('DOMContentLoaded', function() {
    const forgotPasswordLink = document.getElementById('forgotPassword');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            forgotPassword();
        });
    }
});


