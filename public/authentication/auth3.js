// auth.js
// ✅ Firebase Config


  const firebaseConfig = {
    apiKey: "AIzaSyDbKv-4jOeu1b-_6nLAauRn-FtdClfMIu8",
    authDomain: "recruiters-hub-12246.firebaseapp.com",
    projectId: "recruiters-hub-12246",
    storageBucket: "recruiters-hub-12246.firebasestorage.app",
    messagingSenderId: "827201293697",
    appId: "1:827201293697:web:e638c7343af74862ddec80",
    measurementId: "G-Q7YWPT9TJS"
  };
  
  
  // ✅ Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  
  // Register
  async function register() {
    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      alert("Registered & Logged in!");
      window.location.href = "dashboard.html";
    } catch (err) {
      alert(err.message);
    }
  }
  
  // Login
  async function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    try {
      await auth.signInWithEmailAndPassword(email, password);
      alert("Logged in!");
      window.location.href = "dashboard.html";
    } catch (err) {
      alert(err.message);
    }
  }
  
  // Logout
  async function logout() {
    await auth.signOut();
    alert("Logged out!");
    window.location.href = "index.html";
  }
  
  // Auth State Monitor
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