const cercleNom = document.getElementById("nom-cercle");
const cercleError = document.getElementById("nom-cercle-erreur");

const daretForm = document.getElementById("daret-form");

const cotisation = document.getElementById("cotisation");
const cotisationError = document.getElementById("cotisation-erreur");

const selectPeriodicite = document.getElementById("periodicite");
const periodiciteError = document.getElementById("periodicite-erreur");

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

function errorPeriodicite(valure){
  const valides = ["hebdomadaire", "quinzaine", "mensuelle"];
  const o = valure.trim();
  for (const v of valides){
    if (o === v){
      return null
    }
  }
    return "Choisissez une périodicité valide"
}

daretForm.addEventListener("submit", (e)=> {
  e.preventDefault();
  validernom();
  validercotisation();
  validerPeriodicite();
});

function validerPeriodicite(){
  const message = errorPeriodicite(selectPeriodicite.value);
  if (message){
    return afficherErreur(selectPeriodicite,periodiciteError,message);
  }
  return effacerErreur(selectPeriodicite,periodiciteError);
}

function validercotisation(){
  const message = errorPrix(cotisation.value);
  if  (message){
    return afficherErreur(cotisation,cotisationError,message);
  }
  return effacerErreur(cotisation,cotisationError);
}

function validernom(){
  const message = erreurCercle(cercleNom.value);
  if (message) {
    return afficherErreur(cercleNom,cercleError,message);
  } 
  return effacerErreur(cercleNom,cercleError);
}


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

