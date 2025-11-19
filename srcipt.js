import { db } from "./firebase-config.js";
import { collection, addDoc, deleteDoc, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

console.log("Firebase chargé :", db);

const matieresRef = collection(db, "matieresPremieres");
const produitsRef = collection(db, "produitsFinis");

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

const formMatiere = document.getElementById("form-matiere");
if (formMatiere) {
  formMatiere.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nom = document.getElementById("matiere-nom").value.trim();
    const fournisseur = document.getElementById("matiere-fournisseur").value.trim();
    const lot = document.getElementById("matiere-lot").value.trim();
    const dlc = document.getElementById("matiere-dlc").value;
    const prix = document.getElementById("matiere-prix").value ? parseFloat(document.getElementById("matiere-prix").value) : null;
    const dateLivraison = document.getElementById("matiere-date-livraison").value;
    const quantite = parseFloat(document.getElementById("matiere-quantite").value);
    if (!nom || isNaN(quantite)) return alert("Veuillez entrer des valeurs valides.");
    await addDoc(matieresRef, { nom, fournisseur, lot, dlc, prix, dateLivraison, quantite, createdAt: new Date() });
    e.target.reset();
  });
}

const formProduit = document.getElementById("form-produit");
if (formProduit) {
  formProduit.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nom = document.getElementById("produit-nom").value.trim();
    const type = document.getElementById("produit-type").value;
    const lot = document.getElementById("produit-lot").value;
    const prix = document.getElementById("produit-prix").value ? parseFloat(document.getElementById("produit-prix").value) : null;
    const dateConditionnement = document.getElementById("produit-date-cond").value;
    const dlc = document.getElementById("produit-dlc").value;
    const quantite = parseInt(document.getElementById("produit-quantite").value, 10);
    if (!nom || isNaN(quantite)) return alert("Veuillez entrer des valeurs valides.");
    await addDoc(produitsRef, { nom, type, lot, prix, dateConditionnement, dlc, quantite, createdAt: new Date() });
    e.target.reset();
  });
}

document.body.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const id = e.target.dataset.id;
    const type = e.target.dataset.type;
    if (confirm("Supprimer cet élément ?")) {
      await deleteDoc(doc(db, type === "matiere" ? "matieresPremieres" : "produitsFinis", id));
    }
  }
});

onSnapshot(matieresRef, snapshot => afficherMatieres(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
onSnapshot(produitsRef, snapshot => afficherProduits(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
