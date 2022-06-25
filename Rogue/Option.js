function option () {
    initialiser();
    fonction("Continuer","menu()");
    saut(2);
    afficher("Mode automatique : ");
    if (Jeu.combat.auto) {
        afficher("Activé ");
        fonction("Désactivé","Jeu.combat.auto=false;option()");
    }
    else {
        fonction("Activé","Jeu.combat.auto=true;option()");
        afficher(" Désactivé");
    }
    saut();
    afficher("Vitesse de combat automatique : ");
    option_vitesse("Lente",3000);
    option_vitesse("Normal",1000);
    option_vitesse("Rapide",500);
    saut();
    afficher("Afficher les statistiques des créatures et des bâtiments : ");
    if (Jeu.afficher_stat) {
        afficher("Activé ");
        fonction("Désactivé","Jeu.afficher_stat=false;option()");
    }
    else {
        fonction("Activé","Jeu.afficher_stat=true;option()");
        afficher(" Désactivé");
    }
    saut();
    afficher("Raccourci d'achat : ");
    if (Jeu.raccourci_achat) {
        afficher("Activé ");
        fonction("Désactivé","Jeu.raccourci_achat=false;option()");
    }
    else {
        fonction("Activé","Jeu.raccourci_achat=true;option()");
        afficher(" Désactivé");
    }
    saut();
    afficher("Raccourci de vente : ");
    if (Jeu.raccourci_vente) {
        afficher("Activé ");
        fonction("Désactivé","Jeu.raccourci_vente=false;option()");
    }
    else {
        fonction("Activé","Jeu.raccourci_vente=true;option()");
        afficher(" Désactivé");
    }
    saut();
    afficher("Raccourci de pose : ");
    if (Jeu.raccourci_pose) {
        afficher("Activé ");
        fonction("Désactivé","Jeu.raccourci_pose=false;option()");
    }
    else {
        fonction("Activé","Jeu.raccourci_pose=true;option()");
        afficher(" Désactivé");
    }
    saut();
    afficher("Description des talents : ");
    if (Jeu.texte_talent) {
        afficher("Activé ");
        fonction("Désactivé","Jeu.texte_talent=false;option()");
    }
    else {
        fonction("Activé","Jeu.texte_talent=true;option()");
        afficher(" Désactivé");
    }
    saut(2);
    fonction("Retour à l'écran titre","ecran_titre()");
    actualiser();
}

function option_vitesse (nom,vitesse) {
    if (Jeu.combat.vitesse == vitesse) {
        afficher(nom + " ");
    }
    else {
        fonction(nom,"Jeu.combat.vitesse=" + vitesse + ";option()");
        afficher(" ");
    }
}