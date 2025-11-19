// --- Firebase imports ---
import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

console.log("Firebase chargé :", db);

// === 🔹 COLLECTIONS FIRESTORE ===
const matieresRef = collection(db, "matieresPremieres");
const produitsRef = collection(db, "produitsFinis");

// === 🔹 AFFICHAGE MATIÈRES PREMIÈRES ===
function afficherMatieres(data) {
  const tbody = document.querySelector("#table-matiere tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  data.forEach(m => {
    tbody.innerHTML += `
      <tr>
        <td>${m.id}</td>
        <td>${m.nom}</td>
        <td>${m.fournisseur || ''}</td>
        <td>${m.lot || ''}</td>
        <td>${m.dlc || ''}</td>
        <td>${m.prix ?? ''}</td>
        <td>${m.dateLivraison || ''}</td>
        <td>${m.quantite}</td>
        <td><button class="delete-btn" data-id="${m.id}" data-type="matiere">Supprimer</button></td>
      </tr>`;
  });
}

// === 🔹 AFFICHAGE PRODUITS FINIS ===
function afficherProduits(data) {
  const tbody = document.querySelector("#table-produit tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  data.forEach(p => {
    tbody.innerHTML += `
      <tr>
        <td>${p.id}</td>
        <td>${p.nom}</td>
        <td>${p.type}</td>
        <td>${p.lot || ''}</td>
        <td>${p.prix ?? ''}</td>
        <td>${p.dateConditionnement || ''}</td>
        <td>${p.dlc || ''}</td>
        <td>${p.quantite}</td>
        <td><button class="delete-btn" data-id="${p.id}" data-type="produit">Supprimer</button></td>
      </tr>`;
  });
}

// === 🔹 AJOUT MATIÈRES PREMIÈRES ===
const formMatiere = document.getElementById("form-matiere");
if (formMatiere) {
  formMatiere.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nom = document.getElementById("matiere-nom").value.trim();
    const fournisseur = document.getElementById("matiere-fournisseur").value.trim();
    const lot = document.getElementById("matiere-lot").value.trim();
    const dlc = document.getElementById("matiere-dlc").value;
    const prixValue = document.getElementById("matiere-prix").value;
    const prix = prixValue ? parseFloat(prixValue) : null;
    const dateLivraison = document.getElementById("matiere-date-livraison").value;
    const quantiteValue = document.getElementById("matiere-quantite").value;
    const quantite = parseFloat(quantiteValue);

    if (!nom || isNaN(quantite)) return alert("Veuillez entrer des valeurs valides.");

    await addDoc(matieresRef, {
      nom, fournisseur, lot, dlc, prix, dateLivraison, quantite, createdAt: new Date()
    });

    e.target.reset();
  });
}

// === 🔹 AJOUT PRODUITS FINIS ===
const formProduit = document.getElementById("form-produit");
if (formProduit) {
  formProduit.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nom = document.getElementById("produit-nom").value.trim();
    const type = document.getElementById("produit-type").value;
    const lot = document.getElementById("produit-lot").value;
    const prixValue = document.getElementById("produit-prix").value;
    const prix = prixValue ? parseFloat(prixValue) : null;
    const dateConditionnement = document.getElementById("produit-date-cond").value;
    const dlc = document.getElementById("produit-dlc").value;
    const quantiteValue = document.getElementById("produit-quantite").value;
    const quantite = parseInt(quantiteValue, 10);

    if (!nom || isNaN(quantite)) return alert("Veuillez entrer des valeurs valides.");

    await addDoc(produitsRef, {
      nom, type, lot, prix, dateConditionnement, dlc, quantite, createdAt: new Date()
    });

    e.target.reset();
  });
}

// === 🔹 SUPPRESSION ===
document.body.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const id = e.target.dataset.id;
    const type = e.target.dataset.type;
    if (confirm("Supprimer cet élément ?")) {
      await deleteDoc(doc(db, type === "matiere" ? "matieresPremieres" : "produitsFinis", id));
    }
  }
});

// === 🔹 SYNCHRO EN TEMPS RÉEL ===
onSnapshot(matieresRef, (snapshot) => {
  const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  afficherMatieres(data);
});

onSnapshot(produitsRef, (snapshot) => {
  const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  afficherProduits(data);
});
