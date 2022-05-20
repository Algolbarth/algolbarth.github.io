function initialiser () {
    Affichage = "";
}

function actualiser () {
    document.getElementById("interface").innerHTML = Affichage;
}

function fonction (nom,link,classes="") {
    Affichage += "<a href='javascript:" + link + "' class='" + classes + "'>" + nom + "</a>";
}

function lien (nom,link,classes="") {
    Affichage += "<a href='" + link + "' class='" + classes + "'>" + nom + "</a>";
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

function div_actualiser (div,value) {
    document.getElementById(div).innerHTML = value;
}

function dupliquer_objet (a) {
    let b = {};
    for (i in a)
    {
        b[i]=a[i];
    }
    return b;
}