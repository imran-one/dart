// =====================================================
// 1. SELECTORS
// =====================================================

// Formulaire
const daretForm = document.getElementById("daret-form");

const cercleNom = document.getElementById("nom-cercle");
const cercleError = document.getElementById("nom-cercle-erreur");

const cotisation = document.getElementById("cotisation");
const cotisationError = document.getElementById("cotisation-erreur");

const selectPeriodicite = document.getElementById("periodicite");
const periodiciteError = document.getElementById("periodicite-erreur");

const dateDebu = document.getElementById("date-debut");
const dateErreur = document.getElementById("date-debut-erreur");

// Participants
const participantCompteur = document.getElementById("participants-compteur");
const participantListe = document.getElementById("participants-liste");
const ajouterParticipant = document.getElementById("ajouter-participant");
const participantErreur = document.getElementById("participants-erreur");

// Résultat
const etatVide = document.getElementById("etat-vide");
const contenuResultat = document.getElementById("contenu-resultat");

// =====================================================
// 2. ÉTAT
// =====================================================

const min = Number(participantListe.dataset.min); // 2
const max = Number(participantListe.dataset.max); // 20
let compteurId = 0;

// =====================================================
// 3. FONCTIONS PURES (données -> résultat, pas de DOM)
// =====================================================

function errordateDebu(datedebu) {
  const today = new Date().toISOString().split("T")[0];
  if (datedebu === "") return "Champ obligatoire";
  if (today <= datedebu) {
    return null;
  }
  return "Choisissez une date valide (aujourd'hui ou plus tard)";
}

function errorPrix(prix) {
  const p = Number(prix);
  if (prix.trim() === "") return "Champ obligatoire";
  if (isNaN(p)) return "Saisissez un nombre";
  if (!Number.isInteger(p)) return "La cotisation doit être un nombre entier";
  if (p < 100 || p > 50000)
    return "La cotisation doit être comprise entre 100 et 50 000 MAD";
  return null;
}

function erreurCercle(cercle) {
  const n = cercle.trim();
  if (n === "") return "Champ obligatoire";
  if (n.length < 3) return "Au moins 3 caractères";
  if (n.length > 40) return "Au plus 40 caractères";
  if (!/^[- A-Za-z0-9\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF]+$/.test(n))
    return "Lettres, chiffres, espaces et tirets uniquement";
  return null;
}

function errorPeriodicite(valure) {
  const valides = ["hebdomadaire", "quinzaine", "mensuelle"];
  const o = valure.trim();
  for (const v of valides) {
    if (o === v) {
      return null;
    }
  }
  return "Choisissez une périodicité valide";
}

function erreurPrenom(nom) {
  const n = nom.trim();
  if (n === "") return "Champ obligatoire";
  if (n.length < 2) return "Au moins 2 caractères";
  if (n.length > 30) return "Au plus 30 caractères";
  if (!/^[- 'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF]+$/.test(n))
    return "Lettres, espaces, apostrophes et tirets uniquement";
  return null;
}

function calculerResume(cotisation, nbParticipants) {
  const nbTours = nbParticipants;
  const cagnotte = cotisation * nbParticipants;
  const totalCycle = cotisation * nbTours;
  return { cagnotte, totalCycle, nbTours };
}

function calculerDates(dateDebut, periodicite, nbTours) {
  const [annee, mois, jour] = dateDebut.split("-").map(Number);
  const dates = [];
  for (let i = 0; i < nbTours; i++) {
    let d = new Date(annee, mois - 1, jour);
    if (periodicite === "hebdomadaire") {
      d.setDate(d.getDate() + 7 * i);
    } else if (periodicite === "quinzaine") {
      d.setDate(d.getDate() + 15 * i);
    } else {
      const moisCible = mois - 1 + i;
      const dernierJour = new Date(annee, moisCible + 1, 0).getDate();
      const jourFinal = Math.min(jour, dernierJour);
      d = new Date(annee, moisCible, jourFinal);
    }
    dates.push(d);
  }
  return dates;
}

// =====================================================
// 4. FONCTIONS DOM
// =====================================================

// ----- Erreurs (affichage) -----

function afficherErreur(champ, zone, message) {
  zone.textContent = message;
  zone.classList.remove("hidden");
  champ.setAttribute("aria-invalid", "true");
  champ.setAttribute("aria-describedby", zone.id);
}

function effacerErreur(champ, zone) {
  zone.textContent = "";
  zone.classList.add("hidden");
  champ.removeAttribute("aria-invalid");
  champ.removeAttribute("aria-describedby");
}

// ----- Validation des champs -----

function validernom() {
  const message = erreurCercle(cercleNom.value);
  if (message) {
    return afficherErreur(cercleNom, cercleError, message);
  }
  return effacerErreur(cercleNom, cercleError);
}

function validercotisation() {
  const message = errorPrix(cotisation.value);
  if (message) {
    return afficherErreur(cotisation, cotisationError, message);
  }
  return effacerErreur(cotisation, cotisationError);
}

function validerPeriodicite() {
  const message = errorPeriodicite(selectPeriodicite.value);
  if (message) {
    return afficherErreur(selectPeriodicite, periodiciteError, message);
  }
  return effacerErreur(selectPeriodicite, periodiciteError);
}

function validerdate() {
  const message = errordateDebu(dateDebu.value);
  if (message) {
    return afficherErreur(dateDebu, dateErreur, message);
  }
  return effacerErreur(dateDebu, dateErreur);
}

// ----- Participants -----

// lit le DOM (la liste des inputs), donc pas une fonction pure
function erreurDoublon(input) {
  const prenom = input.value.trim().toLowerCase();
  if (prenom === "") return null;
  const inputs = participantListe.querySelectorAll("input");
  for (const autre of inputs) {
    if (autre === input) break;
    if (autre.value.trim().toLowerCase() === prenom) {
      return "Ce prénom est déjà utilisé";
    }
  }
  return null;
}

function validerPrenom(input) {
  const zone = document.getElementById(`${input.id}-erreur`);
  const message = erreurPrenom(input.value) || erreurDoublon(input);
  if (message) {
    return afficherErreur(input, zone, message);
  }
  return effacerErreur(input, zone);
}

function validerParticipants() {
  const inputs = participantListe.querySelectorAll("input");
  for (const input of inputs) {
    validerPrenom(input);
  }
}

function mettreAJourCompteur() {
  const n = participantListe.children.length;
  if (n <= 1) {
    participantCompteur.textContent = `${n} participant`;
  } else {
    participantCompteur.textContent = `${n} participants`;
  }
}

function creerParticipant() {
  compteurId++;
  const li = document.createElement("li");

  const label = document.createElement("label");
  label.htmlFor = `prenom-${compteurId}`;
  label.textContent = `participant ${compteurId}`;

  const input = document.createElement("input");
  input.id = `prenom-${compteurId}`;
  input.type = "text";
  input.className = "mt-1 w-full rounded border border-daret-bordure px-3 py-2";
  input.placeholder = "prenom";

  const p = document.createElement("p");
  p.id = `prenom-${compteurId}-erreur`;
  p.className = "hidden mt-1 text-sm font-medium text-daret-erreur";

  const button = document.createElement("button");
  button.type = "button";
  button.dataset.action = "retirer";
  button.className = "mt-3 rounded border border-daret-vert px-4 py-2";
  button.textContent = "Retirer";

  li.append(label, input, p, button);

  participantListe.appendChild(li);
  mettreAJourCompteur();
}

// ----- Résultat -----

function afficherResume(resume, dates) {
  document.getElementById("resume-cagnotte").textContent =
    `${resume.cagnotte} MAD`;
  document.getElementById("resume-total-cycle").textContent =
    `${resume.totalCycle} MAD`;
  document.getElementById("resume-nb-tours").textContent = `${resume.nbTours}`;

  const premier = dates[0].toLocaleDateString("fr-FR");
  const dernier = dates[dates.length - 1].toLocaleDateString("fr-FR");
  document.getElementById("resume-dates").textContent =
    `${premier} · ${dernier}`;
}

function lireParticipants() {
  const inputs = participantListe.querySelectorAll("input");
  const noms = [];
  for (const input of inputs) {
    noms.push(input.value.trim());
  }
  return noms;
}

// =====================================================
// 5. LISTENERS
// =====================================================

daretForm.addEventListener("submit", (e) => {
  e.preventDefault();
  validernom();
  validercotisation();
  validerPeriodicite();
  validerdate();
  validerParticipants();

  const premierInvalide = daretForm.querySelector('[aria-invalid="true"]');
  if (premierInvalide) {
    premierInvalide.focus();
    return;
  }

  const nb = participantListe.children.length;
  const resume = calculerResume(Number(cotisation.value), nb);
  const dates = calculerDates(dateDebu.value, selectPeriodicite.value, nb);

  afficherResume(resume, dates);
  etatVide.classList.add("hidden");
  contenuResultat.classList.remove("hidden");
});

ajouterParticipant.addEventListener("click", () => {
  const n = participantListe.children.length;
  if (n >= max) {
    participantErreur.textContent = `Maximum ${max} participants.`;
    participantErreur.classList.remove("hidden");
  } else {
    creerParticipant();
    participantErreur.classList.add("hidden");
  }
});

// délégation : un seul écouteur sur le conteneur
participantListe.addEventListener("click", (e) => {
  if (e.target.dataset.action !== "retirer") return;

  const n = participantListe.children.length;
  if (n <= min) {
    participantErreur.textContent = `Minimum ${min} participants.`;
    participantErreur.classList.remove("hidden");
  } else {
    e.target.closest("li").remove();
    participantErreur.classList.add("hidden");
  }
  mettreAJourCompteur();
});

participantListe.addEventListener("input", (e) => {
  if (e.target.tagName === "INPUT") {
    validerPrenom(e.target);
  }
});

// =====================================================
// 6. INIT
// =====================================================

for (let i = 0; i < 3; i++) {
  creerParticipant();
}
