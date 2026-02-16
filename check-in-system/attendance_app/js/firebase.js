// firebase.js
import {
  initializeApp,
  getApps,
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCMVE79DYZYO7d-w7foy9sUOiJS1bZvsAk",
  authDomain: "qr-checkin-system-53a6a.firebaseapp.com",
  projectId: "qr-checkin-system-53a6a",
  storageBucket: "qr-checkin-system-53a6a.appspot.com",
  messagingSenderId: "1042416123664",
  appId: "1:1042416123664:web:880a03404ec4dfaf47ef95",
  measurementId: "G-SYVFJ3GY78",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Export Firestore
export const db = getFirestore(app);
console.log("Firestore initialized:", db);
