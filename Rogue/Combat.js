function combat_nouveau () {
    Jeu.combat.tour = 1;
    Jeu.combat.attaquant = "terrain";
    Jeu.combat.defenseur = "terrain_adverse";
    Jeu.combat.slot = -1;
    Jeu.combat.etat = true;
    for (let n=0;n<Jeu.terrain.length;n++) {
        Jeu.terrain[n].action = statistique(Jeu.terrain[n],"action_max");
        Jeu.terrain[n].effet_debut_tour("terrain");
        if (statistique(Jeu.terrain[n],"regeneration") > 0 && Jeu.terrain[n].vie < Jeu.terrain[n].vie_max) {
            soin(Jeu.terrain[n],statistique(Jeu.terrain[n],"regeneration"));
        }
        if (Jeu.terrain[n].brulure > 0) {
            degats(Jeu.terrain[n],Jeu.terrain[n].brulure);
            Jeu.terrain[n].brulure--;
        }
    }
    for (let n=0;n<Jeu.terrain_adverse.length;n++) {
        Jeu.terrain_adverse[n].action = statistique(Jeu.terrain_adverse[n],"action_max");
        Jeu.terrain_adverse[n].effet_debut_tour("terrain_adverse");
        if (statistique(Jeu.terrain_adverse[n],"regeneration") > 0 && Jeu.terrain_adverse[n].vie < Jeu.terrain_adverse[n].vie_max) {
            soin(Jeu.terrain_adverse[n],statistique(Jeu.terrain_adverse[n],"regeneration"));
        }
        if (Jeu.terrain_adverse[n].brulure > 0) {
            degats(Jeu.terrain_adverse[n],Jeu.terrain_adverse[n].brulure);
            Jeu.terrain_adverse[n].brulure--;
        }
    }
    if (Jeu.combat.auto) {
        Jeu.combat.affichage = setInterval("combat_continuer()", Jeu.combat.vitesse);
    }
    combat_afficher();
}

function combat_continuer () {
    if (Jeu.terrain_adverse.length == 0) {
        clearInterval(Jeu.combat.affichage);
        Jeu.combat.etat = false;
        combat_victoire();
    }
    else if (Jeu.terrain.length == 0) {
        clearInterval(Jeu.combat.affichage);
        Jeu.combat.etat = false;
        combat_defaite();
    }
    else {
        if (!combat_verifier_rapidite()) {
            swap();
            if (!combat_verifier_rapidite()) {
                swap();
                if (!combat_verifier_attaque()) {
                    swap();
                    if (!combat_verifier_attaque()) {
                        Jeu.combat.tour++;
                        Jeu.combat.attaquant = "terrain";
                        Jeu.combat.defenseur = "terrain_adverse";
                        for (let n=0;n<Jeu.terrain.length;n++) {
                            Jeu.terrain[n].action = Jeu.terrain[n].action_max;
                            Jeu.terrain[n].effet_debut_tour("terrain");
                            if (statistique(Jeu.terrain[n],"regeneration") > 0 && Jeu.terrain[n].vie < Jeu.terrain[n].vie_max) {
                                soin(Jeu.terrain[n],statistique(Jeu.terrain[n],"regeneration"));
                            }
                            if (Jeu.terrain[n].brulure > 0) {
                                degats(Jeu.terrain[n],Jeu.terrain[n].brulure);
                                Jeu.terrain[n].brulure--;
                            }
                        }
                        for (let n=0;n<Jeu.terrain_adverse.length;n++) {
                            Jeu.terrain_adverse[n].action = Jeu.terrain_adverse[n].action_max;
                            Jeu.terrain_adverse[n].effet_debut_tour("terrain_adverse");
                            if (statistique(Jeu.terrain_adverse[n],"regeneration") > 0 && Jeu.terrain_adverse[n].vie < Jeu.terrain_adverse[n].vie_max) {
                                soin(Jeu.terrain_adverse[n],statistique(Jeu.terrain_adverse[n],"regeneration"));
                            }
                            if (Jeu.terrain_adverse[n].brulure > 0) {
                                degats(Jeu.terrain_adverse[n],Jeu.terrain_adverse[n].brulure);
                                Jeu.terrain_adverse[n].brulure--;
                            }
                        }
                        combat_verifier_attaque();
                    }
                }
            }
        }
        attaque();
        combat_afficher();
        swap();
    }
}

function swap () {
    let trans = Jeu.combat.defenseur;
    Jeu.combat.defenseur = Jeu.combat.attaquant;
    Jeu.combat.attaquant = trans;
}

function combat_verifier_attaque () {
    for (let n=0;n<Jeu[Jeu.combat.attaquant].length;n++) {
        if (Jeu[Jeu.combat.attaquant][n].action > 0) {
            Jeu.combat.slot = n;
            return true;
        }
    }
    return false;
}

function combat_verifier_rapidite () {
    for (let n=0;n<Jeu[Jeu.combat.attaquant].length;n++) {
        if (Jeu[Jeu.combat.attaquant][n].action > 0 && statistique(Jeu[Jeu.combat.attaquant][n],"rapidite")) {
            Jeu.combat.slot = n;
            return true;
        }
    }
    return false;
}

function attaque () {
    let attaquant = Jeu[Jeu.combat.attaquant][Jeu.combat.slot];
    attaquant.action--;
    let defenseur_slot = trouver_defenseur();
    let defenseur = Jeu[Jeu.combat.defenseur][defenseur_slot];
    let defenseur_save = dupliquer_objet(defenseur);
    attaquant.effet_attaque(defenseur);
    for (let n=0;n<attaquant.equipements.length;n++) {
        attaquant.equipements[n].effet_attaque(defenseur);
    }
    if (attaquant.type == "Créature") {
        if (attaquant.poison > 0) {
            degats(attaquant,1);
            attaquant.poison;
        }
        let defense = statistique(defenseur,"defense") - statistique(attaquant,"percee");
        if (defense < 0) {
            defense = 0;
        }
        let degats_montant = statistique(attaquant,"attaque") - defense;
        if (degats_montant < 0) {
            degats_montant = 0;
        }
        let is_mort = degats(defenseur,degats_montant);
        if (!is_mort) {
            if (statistique(attaquant,"mortel")) {
                mort(Jeu.combat.defenseur,defenseur_slot);
            }
        }
        if (statistique(defenseur,"epine") > 0) {
            degats(attaquant,statistique(defenseur,"epine"));
        }
        if (is_mort) {
            attaquant.effet_tuer(defenseur_save);
        }
        if (degats_montant > defenseur_save.vie) {
            degats_montant = degats_montant + defenseur.vie;
        }
        if (statistique(attaquant,"vol_de_vie")) {
            soin(attaquant,degats_montant);
        }
    }
}

function trouver_defenseur () {
    let attaquant = Jeu[Jeu.combat.attaquant][Jeu.combat.slot];
    let defenseur_slot = 0;
    if (attaquant.portee) {
        defenseur_slot = Jeu[Jeu.combat.defenseur].length - 1;
        for (let n=Jeu[Jeu.combat.defenseur].length - 1;n>=0;n--) {
            if (statistique(Jeu[Jeu.combat.defenseur][n],"protection")) {
                defenseur_slot = n;
                break;
            }
        }
    }
    else {
        for (let n=0;n<Jeu[Jeu.combat.defenseur].length;n++) {
            if (statistique(Jeu[Jeu.combat.defenseur][n],"protection")) {
                defenseur_slot = n;
                break;
            }
        }
    }
    return defenseur_slot;
}

function combat_afficher () {
    initialiser();
    div("main");
    if (Jeu.combat.auto) {
        fonction("Désactiver mode auto","combat_auto_off()");
    }
    else {
        fonction("Activer mode auto","combat_auto_on()");
        afficher(" - ");
        fonction("Action suivante","combat_continuer()");
    }
    saut(2);
    afficher("<u>Adversaire :</u>");
    saut();
    if (Jeu.terrain_adverse.length > 0) {
        for (let n=0;n<Jeu.terrain_adverse.length;n++) {
            if (Jeu.combat.slot == n && Jeu.combat.attaquant == "terrain_adverse") {
                afficher("<b>");
            }
            afficher_carte("terrain_adverse",n);
            afficher("</b>");
            saut();
        }
    }
    else {
        afficher("<i>Le terrain adverse est vide</i>");
        saut();
    }
    saut();
    afficher("<u>Terrain :</u>");
    saut();
    if (Jeu.terrain.length > 0) {
        for (let n=0;n<Jeu.terrain.length;n++) {
            if (Jeu.combat.slot == n && Jeu.combat.attaquant == "terrain") {
                afficher("<b>");
            }
            afficher_carte("terrain",n);
            afficher("</b>");
            saut();
        }
    }
    else {
        afficher("<i>Votre terrain est vide</i>");
    }
    div_fin();
    div("carte");
    div_fin();
    actualiser();
}

function combat_auto_off () {
    Jeu.combat.auto = false;
    clearInterval(Jeu.combat.affichage);
    combat_afficher();
}

function combat_auto_on () {
    Jeu.combat.auto = true;
    Jeu.combat.affichage = setInterval("combat_continuer()", Jeu.combat.vitesse);
    combat_afficher();
}

function combat_victoire () {
    initialiser();
    afficher("Victoire");
    saut(2);
    fonction("Etage suivant","etage_suivant()");
    actualiser();
}

function combat_defaite () {
    initialiser();
    afficher("Défaite");
    saut(2);
    if (Jeu.vie > 0) {
        afficher("Vous subissez " + combat_defaite_degats() + " dommages");
        saut();
        afficher("Il vous reste " + Jeu.vie + " vie");
        saut(2);
        fonction("Continuer","etage_fin()");
    }
    else {
        afficher("Vous n'avez plus de vie");
        saut(2);
        fonction("Abandonner","game_over()");
    }
    actualiser();
}

function combat_defaite_degats () {
    let degats_montant = 0;
    for (let n=0;n<Jeu.terrain_adverse.length;n++) {
        degats_montant += statistique(Jeu.terrain_adverse[n],"attaque");
    }
    degats_joueur(degats_montant);
    return degats_montant;
}