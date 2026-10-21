const cercleNom = document.getElementById("nom-cercle");
const cercleError = document.getElementById("nom-cercle-erreur");
const daretForm = document.getElementById("daret-form");
const cotisation = document.getElementById("cotisation");
const cotisationError = document.getElementById("cotisation-erreur");

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
