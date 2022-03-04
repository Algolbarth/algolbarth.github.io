function initialiser () {
    Affichage = "";
}

function actualiser () {
    document.getElementById("interface").innerHTML = Affichage;
}

function fonction (nom,link) {
    Affichage += "<a href='javascript:" + link + "'>" + nom + "</a>";
}

function lien (nom,link) {
    Affichage += "<a href='" + link + "'>" + nom + "</a>";
}

function afficher (texte) {
    Affichage += texte;
}

function saut (nombre=1) {
    for (let n=0;n<nombre;n++) {
        Affichage += "<br/>";
    }
}

function div (nom) {
    Affichage += "<div id='" + nom + "'>";
}

function div_fin () {
    Affichage += "</div>";
}

function actualiser_id (id,value) {
    document.getElementById(id).innerHTML = value;
}