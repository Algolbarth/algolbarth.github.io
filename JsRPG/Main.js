function demarrage () {
    initialiser();
    afficher("JsRPG");
    saut(2);
    fonction("Jouer","nouvelle_partie()");
    saut(2);
    fonction("Historique des versions","liste_versions()");
    saut(2);
    afficher("<b>" + Versions[Versions.length-1].nom + "</b> <i>" + Versions[Versions.length-1].date + "</i>");
    saut(1);
    Versions[Versions.length-1].description();
    actualiser();
}

function liste_versions () {
    initialiser();
    fonction("Retour","demarrage()");
    saut(2);
    for (let n=Versions.length-1;n>=0;n--) {
        afficher("<b>" + Versions[n].nom + "</b> <i>" + Versions[n].date + "</i>");
        saut(1);
        Versions[n].description();
        saut(2);
    }
    actualiser();
}