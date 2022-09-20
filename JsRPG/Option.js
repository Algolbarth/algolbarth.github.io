function option() {
    initialiser();
    fonction("Continuer", "menu()");
    saut(2);
    afficher("<u>Combat automatique :</u> ");
    if (Jeu.combat.auto) {
        afficher("Activé ");
        fonction("Désactivé", "Jeu.combat.auto=false;option()");
    }
    else {
        fonction("Activé", "Jeu.combat.auto=true;option()");
        afficher(" Désactivé");
    }
    saut();
    afficher("<u>Vitesse de combat automatique :</u> ");
    option_vitesse("Lente", 3000);
    option_vitesse("Normal", 1000);
    option_vitesse("Rapide", 500);
    saut();
    afficher("<u>Afficher les statistiques des créatures et des bâtiments hors combat :</u> ");
    if (Jeu.afficher_stat) {
        afficher("Activé ");
        fonction("Désactivé", "Jeu.afficher_stat=false;option()");
    }
    else {
        fonction("Activé", "Jeu.afficher_stat=true;option()");
        afficher(" Désactivé");
    }
    saut();
    afficher("<u>Description des talents :</u> ");
    if (Jeu.texte_talent) {
        afficher("Activé ");
        fonction("Désactivé", "Jeu.texte_talent=false;option()");
    }
    else {
        fonction("Activé", "Jeu.texte_talent=true;option()");
        afficher(" Désactivé");
    }
    saut(2);
    fonction("Retour à l'écran titre", "ecran_titre()");
    actualiser();
}

function option_vitesse(nom, vitesse) {
    if (Jeu.combat.vitesse == vitesse) {
        afficher(nom + " ");
    }
    else {
        fonction(nom, "Jeu.combat.vitesse=" + vitesse + ";option()");
        afficher(" ");
    }
}