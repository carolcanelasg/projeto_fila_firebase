// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";
import {
  getAuth,
  signInWithRedirect,
  browserSessionPersistence,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  query,
  onValue,
  onChildAdded,
  orderByChild,
  orderByKey,
  equalTo,
  get,
  set,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAnwVECL8SAhShBFT4-nEYjkt4tZ34NiLo",
  authDomain: "prj-unilasalle-kevin-borba.firebaseapp.com",
  databaseURL: "https://prj-unilasalle-kevin-borba-default-rtdb.firebaseio.com",
  projectId: "prj-unilasalle-kevin-borba",
  storageBucket: "prj-unilasalle-kevin-borba.appspot.com",
  messagingSenderId: "1006054485314",
  appId: "1:1006054485314:web:478338e52308a5ac6d2cdb",
  measurementId: "G-PMCPZ9RGQ1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/userinfo.email");
provider.addScope("https://www.googleapis.com/auth/userinfo.profile");
//const analytics = getAnalytics(app);

const auth = getAuth(app);
auth.languageCode = "pt-BR";
auth.setPersistence(browserSessionPersistence);

onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "/paginas/init.html";
  } else {
    signInWithRedirect(auth, provider);
  }
});
