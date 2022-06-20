function combat_nouveau () {
    Jeu.combat.tour = 0;
    combat_debut_tour();
    Jeu.combat.slot = -1;
    Jeu.combat.etat = true;
    if (Jeu.combat.auto) {
        Jeu.combat.affichage = setInterval("combat_continuer()", Jeu.combat.vitesse);
    }
    combat_afficher();
}

function combat_debut_tour () {
    Jeu.combat.tour++;
    Jeu.combat.attaquant = "joueur";
    Jeu.combat.defenseur = "adverse";
    for (let n=0;n<Jeu.joueur.terrain.length;n++) {
        Jeu.joueur.terrain[n].action = statistique(Jeu.joueur.terrain[n],"action_max");
        Jeu.joueur.terrain[n].effet_tour_debut();
        if (statistique(Jeu.joueur.terrain[n],"regeneration") > 0 && Jeu.joueur.terrain[n].vie < Jeu.joueur.terrain[n].vie_max) {
            soin(Jeu.joueur.terrain[n],statistique(Jeu.joueur.terrain[n],"regeneration"));
        }
        if (Jeu.joueur.terrain[n].brulure > 0) {
            degats(Jeu.joueur.terrain[n],Jeu.joueur.terrain[n].brulure);
            Jeu.joueur.terrain[n].brulure--;
        }
    }
    for (let n=0;n<Jeu.adverse.terrain.length;n++) {
        Jeu.adverse.terrain[n].action = statistique(Jeu.adverse.terrain[n],"action_max");
        Jeu.adverse.terrain[n].effet_tour_debut();
        if (statistique(Jeu.adverse.terrain[n],"regeneration") > 0 && Jeu.adverse.terrain[n].vie < Jeu.adverse.terrain[n].vie_max) {
            soin(Jeu.adverse.terrain[n],statistique(Jeu.adverse.terrain[n],"regeneration"));
        }
        if (Jeu.adverse.terrain[n].brulure > 0) {
            degats(Jeu.adverse.terrain[n],Jeu.adverse.terrain[n].brulure);
            Jeu.adverse.terrain[n].brulure--;
        }
    }
}

function combat_continuer () {
    if (Jeu.joueur.vie <= 0) {
        clearInterval(Jeu.combat.affichage);
        Jeu.combat.etat = false;
        game_over();
    }
    if (Jeu.adverse.terrain.length == 0 || Jeu.adverse.vie <= 0) {
        clearInterval(Jeu.combat.affichage);
        Jeu.combat.etat = false;
        combat_victoire();
    }
    else if (Jeu.joueur.terrain.length == 0) {
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
                        combat_debut_tour();
                        if (!combat_verifier_rapidite()) {
                            combat_verifier_attaque();
                        }
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
    for (let n=0;n<Jeu[Jeu.combat.attaquant].terrain.length;n++) {
        if (Jeu[Jeu.combat.attaquant].terrain[n].action > 0) {
            Jeu.combat.slot = n;
            return true;
        }
    }
    return false;
}

function combat_verifier_rapidite () {
    for (let n=0;n<Jeu[Jeu.combat.attaquant].terrain.length;n++) {
        if (Jeu[Jeu.combat.attaquant].terrain[n].action > 0 && statistique(Jeu[Jeu.combat.attaquant].terrain[n],"rapidite")) {
            Jeu.combat.slot = n;
            return true;
        }
    }
    return false;
}

function attaque () {
    let attaquant = Jeu[Jeu.combat.attaquant].terrain[Jeu.combat.slot];
    attaquant.action--;
    if (attaquant.gel > 0) {
        attaquant.gel--;
    }
    else if (attaquant.etourdissement) {
        attaquant.action = 0;
        attaquant.etourdissement = false;
    }
    else {
        let defenseur_slot = trouver_defenseur();
        if (defenseur_slot !== false) {
            let defenseur = Jeu[Jeu.combat.defenseur].terrain[defenseur_slot];
            let defenseur_save = dupliquer_objet(defenseur);
            attaquant.effet_attaque(defenseur);
            for (let n=0;n<attaquant.equipements.length;n++) {
                attaquant.equipements[n].effet_attaque(defenseur);
            }
            if (attaquant.type == "Créature") {
                if (attaquant.camouflage) {
                    attaquant.camouflage = false;
                }
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
    }
}

function trouver_defenseur () {
    let attaquant = Jeu[Jeu.combat.attaquant].terrain[Jeu.combat.slot];
    let defenseur_slot = 0;
    if (attaquant.portee) {
        defenseur_slot = Jeu[Jeu.combat.defenseur].terrain.length - 1;
        while (Jeu[Jeu.combat.defenseur].terrain[defenseur_slot].camouflage && defenseur_slot > 0) {
            defenseur_slot--;
        }
        if (Jeu[Jeu.combat.defenseur][defenseur_slot].camouflage) {
            return false;
        }
        for (let n=Jeu[Jeu.combat.defenseur].terrain.length - 1;n>=0;n--) {
            if (statistique(Jeu[Jeu.combat.defenseur][n],"protection") && Jeu[Jeu.combat.defenseur][n].camouflage == false) {
                defenseur_slot = n;
                break;
            }
        }
    }
    else {
        while (Jeu[Jeu.combat.defenseur].terrain[defenseur_slot].camouflage && defenseur_slot < Jeu[Jeu.combat.defenseur].terrain.length - 1) {
            defenseur_slot++;
        }
        if (Jeu[Jeu.combat.defenseur].terrain[defenseur_slot].camouflage) {
            return false;
        }
        for (let n=0;n<Jeu[Jeu.combat.defenseur].terrain.length;n++) {
            if (statistique(Jeu[Jeu.combat.defenseur].terrain[n],"protection") && Jeu[Jeu.combat.defenseur].terrain[n].camouflage == false) {
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
    afficher("Vie adverse : " + Jeu.adverse.vie + " / " + Jeu.adverse.vie_max);
    saut(2);
    afficher("<u>Terrain adverse :</u>");
    saut();
    if (Jeu.adverse.terrain.length > 0) {
        for (let n=0;n<Jeu.adverse.terrain.length;n++) {
            if (Jeu.combat.slot == n && Jeu.combat.attaquant == "adverse") {
                afficher("<b>");
            }
            afficher_carte("adverse","terrain",n);
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
    if (Jeu.joueur.terrain.length > 0) {
        for (let n=0;n<Jeu.joueur.terrain.length;n++) {
            if (Jeu.combat.slot == n && Jeu.combat.attaquant == "joueur") {
                afficher("<b>");
            }
            afficher_carte("joueur","terrain",n);
            afficher("</b>");
            saut();
        }
    }
    else {
        afficher("<i>Votre terrain est vide</i>");
        saut();
    }
    saut();
    afficher("Vie : " + Jeu.joueur.vie + " / " + Jeu.joueur.vie_max);
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
    if (Jeu.joueur.vie > 0) {
        afficher("Vous subissez " + combat_defaite_degats() + " dommages");
        saut();
        afficher("Il vous reste " + Jeu.joueur.vie + " vie");
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
    for (let n=0;n<Jeu.adverse.terrain.length;n++) {
        degats_montant += statistique(Jeu.adverse.terrain[n],"attaque");
    }
    degats_direct("joueur",degats_montant);
    return degats_montant;
}