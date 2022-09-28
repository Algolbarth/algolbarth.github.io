function demarrage() {
    Jeu = {}
    main_afficher();
}

function main_afficher() {
    initialiser();
    fonction("Connexion", "compte_connexion_afficher()");
    saut(2);
    fonction("Créer un compte", "compte_creer_afficher()");
    actualiser();
}