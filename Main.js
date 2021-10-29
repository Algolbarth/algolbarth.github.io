function demarrage () {
    initialiser();
    afficher("JsRPG");
    saut(2);
    fonction("Jouer","nouvelle_partie()");
    saut(2);
    for (let n=Versions.length-1;n>=0;n--) {
        afficher("<b>" + Versions[n].nom + "</b> <i>" + Versions[n].date + "</i>");
        saut(1);
        Versions[n].description();
        saut(2);
    }
    actualiser();
}