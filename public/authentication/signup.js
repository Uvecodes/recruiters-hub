alert('hello sign up')
// auth.js

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

// ✅ Register with extra fields
async function register() {
  const name = document.getElementById("fullName").value.trim();
  const role = document.getElementById("registerRole").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const remember = document.getElementById("registerRemember").checked;

  if (!name || !role || !email || !password) {
    alert("Please fill all fields.");
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

    alert("Registered and logged in!");
    window.location.href = "dashboard.html";
  }).catch((error) => {
    alert(error.message);
  });
}

// ✅ Login with remember me
async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const remember = document.getElementById("loginRemember").checked;

  auth.setPersistence(
    remember ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION
  ).then(async () => {
    await auth.signInWithEmailAndPassword(email, password);
    alert("Logged in!");
    window.location.href = "dashboard.html";
  }).catch((err) => {
    alert(err.message);
  });
}

// ✅ Logout
async function logout() {
  await auth.signOut();
  alert("Logged out!");
  window.location.href = "index.html";
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
