function jeu_afficher() {
    initialiser();
    fonction("Menu", "menu_afficher()");
    actualiser();
}

function menu_afficher() {
    initialiser();
    fonction("Retour", "jeu_afficher()");
    saut(2);
    fonction("Sauvegarder", "compte_sauvegarde()");
    saut(2);
    fonction("Déconnexion", "main_afficher()");
    actualiser();
}