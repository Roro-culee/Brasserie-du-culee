// ================================
// 🔥 Configuration Firebase globale
// ================================

// Import du SDK Firebase de base et du module Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// ================================
// 🧩 CONFIGURATION DE TON PROJET
// ================================
// ⚠️ Remplace les valeurs ci-dessous par celles de ton projet Firebase !
// Tu les trouves dans Firebase console → Paramètres du projet → Config SDK

const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXX",
  authDomain: "brasserie-gestion.firebaseapp.com",
  projectId: "brasserie-gestion",
  storageBucket: "brasserie-gestion.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

// ================================
// 🚀 Initialisation de Firebase
// ================================

const app = initializeApp(firebaseConfig);

// Initialisation de Firestore (base de données)
export const db = getFirestore(app);

// Tu peux aussi exporter `app` si tu veux l’utiliser ailleurs
export default app;
