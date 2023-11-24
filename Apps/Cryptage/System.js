function initialiser() {
    Affichage = "";
}

function actualiser() {
    document.getElementById("interface").innerHTML = Affichage;
}

function fonction(nom, link, classes = "") {
    Affichage += "<button onclick='javascript:" + link + "' class='" + classes + "'>" + nom + "</button>";
}

function lien(nom, link, classes = "") {
    Affichage += "<a href='" + link + "' class='" + classes + "'>" + nom + "</a>";
}

function afficher(texte) {
    Affichage += texte;
}

function saut(nombre = 1) {
    for (let n = 0; n < nombre; n++) {
        Affichage += "<br/>";
    }
}

function div(nom, classes = "") {
    Affichage += "<div id='" + nom + "' class='" + classes + "'>";
}

function div_fin() {
    Affichage += "</div>";
}

function div_actualiser(div, value) {
    document.getElementById(div).innerHTML = value;
}

function dupliquer_objet(a) {
    let b = {};
    for (i in a) {
        b[i] = a[i];
    }
    return b;
}

function telecharger(nom, texte) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(texte));
    element.setAttribute('download', nom);
    element.style.display = 'none';
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}