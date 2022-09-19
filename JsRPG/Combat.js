function combat_nouveau() {
    Jeu.combat.tour = 0;
    combat_debut_tour();
    Jeu.combat.slot = -1;
    Jeu.combat.etat = true;
    if (Jeu.combat.auto) {
        Jeu.combat.affichage = setInterval("combat_continuer()", Jeu.combat.vitesse);
    }
    combat_afficher();
}

function combat_debut_tour() {
    Jeu.combat.tour++;
    Jeu.combat.attaquant = "joueur";
    Jeu.combat.defenseur = "adverse";
    for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
        Jeu.joueur.terrain[n].vie -= Jeu.joueur.terrain[n].stat_tour.vie_max;
        Jeu.joueur.terrain[n].stat_tour = obtenir_carte(0);
        Jeu.joueur.terrain[n].action = statistique(Jeu.joueur.terrain[n], "action_max");
        if (!statistique(Jeu.joueur.terrain[n], "silence")) {
            Jeu.joueur.terrain[n].effet_tour_debut();
            if (statistique(Jeu.joueur.terrain[n], "regeneration") > 0 && Jeu.joueur.terrain[n].vie < Jeu.joueur.terrain[n].vie_max) {
                soin(Jeu.joueur.terrain[n], statistique(Jeu.joueur.terrain[n], "regeneration"));
            }
            if (Jeu.joueur.terrain[n].brulure > 0) {
                degats(Jeu.joueur.terrain[n], Jeu.joueur.terrain[n].brulure);
                Jeu.joueur.terrain[n].brulure--;
            }
            if (Jeu.joueur.terrain[n].poison > 0) {
                degats(Jeu.joueur.terrain[n], 1);
                Jeu.joueur.terrain[n].poison--;
            }
        }
    }
    for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
        Jeu.adverse.terrain[n].vie -= Jeu.adverse.terrain[n].stat_tour.vie_max;
        Jeu.adverse.terrain[n].stat_tour = obtenir_carte(0);
        Jeu.adverse.terrain[n].action = statistique(Jeu.adverse.terrain[n], "action_max");
        if (!statistique(Jeu.adverse.terrain[n], "silence")) {
            Jeu.adverse.terrain[n].effet_tour_debut();
            if (statistique(Jeu.adverse.terrain[n], "regeneration") > 0 && Jeu.adverse.terrain[n].vie < Jeu.adverse.terrain[n].vie_max) {
                soin(Jeu.adverse.terrain[n], statistique(Jeu.adverse.terrain[n], "regeneration"));
            }
            if (Jeu.adverse.terrain[n].brulure > 0) {
                degats(Jeu.adverse.terrain[n], Jeu.adverse.terrain[n].brulure);
                Jeu.adverse.terrain[n].brulure--;
            }
            if (Jeu.adverse.terrain[n].poison > 0) {
                degats(Jeu.adverse.terrain[n], 1);
                Jeu.adverse.terrain[n].poison--;
            }
        }
    }
}

function combat_continuer() {
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
        action();
        combat_afficher();
        swap();
    }
}

function swap() {
    let trans = Jeu.combat.defenseur;
    Jeu.combat.defenseur = Jeu.combat.attaquant;
    Jeu.combat.attaquant = trans;
}

function combat_verifier_attaque() {
    for (let n = 0; n < Jeu[Jeu.combat.attaquant].terrain.length; n++) {
        if (Jeu[Jeu.combat.attaquant].terrain[n].action > 0) {
            Jeu.combat.slot = n;
            return true;
        }
    }
    return false;
}

function combat_verifier_rapidite() {
    for (let n = 0; n < Jeu[Jeu.combat.attaquant].terrain.length; n++) {
        if (Jeu[Jeu.combat.attaquant].terrain[n].action > 0 && statistique(Jeu[Jeu.combat.attaquant].terrain[n], "rapidite") && !statistique(Jeu[Jeu.combat.attaquant].terrain[n], "silence")) {
            Jeu.combat.slot = n;
            return true;
        }
    }
    return false;
}

function action() {
    let attaquant = Jeu[Jeu.combat.attaquant].terrain[Jeu.combat.slot];
    Jeu.combat.attaquant_mort = false;
    attaquant.action--;
    if (attaquant.gel > 0 && !statistique(attaquant, "silence")) {
        attaquant.gel--;
    }
    else if (attaquant.etourdissement && !statistique(attaquant, "silence")) {
        attaquant.action = 0;
        attaquant.etourdissement = false;
    }
    else {
        if (!statistique(attaquant, "silence")) {
            attaquant.effet_action();
            if (attaquant.camouflage) {
                attaquant.camouflage = false;
            }
        }
        let defenseur_slot = trouver_defenseur();
        if (attaquant.type == "Créature" && defenseur_slot !== false) {
            attaque(attaquant, Jeu[Jeu.combat.defenseur].terrain[defenseur_slot]);
        }
    }
}

function attaque(attaquant, defenseur) {
    let defenseur_slot = defenseur.slot;
    Jeu.combat.defenseur_mort = false;
    if (!statistique(attaquant, "silence")) {
        attaquant.effet_attaque(defenseur);
        for (let n = 0; n < attaquant.equipements.length; n++) {
            attaquant.equipements[n].stat_equipement.effet_attaque(defenseur);
        }
    }
    if (attaquant.saignement > 0 && !statistique(attaquant, "silence")) {
        Jeu.combat.attaquant_mort = degats(attaquant, 2).mort;
        attaquant.saignement--;
    }
    if (!statistique(defenseur, "silence")) {
        defenseur.effet_be_attaque(attaquant);
        for (let n = 0; n < defenseur.equipements.length; n++) {
            defenseur.equipements[n].stat_equipement.effet_be_attaque(attaquant);
        }
    }
    if (!Jeu.combat.attaquant_mort) {
        let defense = statistique(defenseur, "defense");
        if (!statistique(attaquant, "silence")) {
            defense -= statistique(attaquant, "percee");
        }
        if (defense < 0) {
            defense = 0;
        }
        let degats_montant = statistique(attaquant, "attaque") - defense;
        if (degats_montant < 0) {
            degats_montant = 0;
        }
        let degats_result = degats(defenseur, degats_montant);
        Jeu.combat.defenseur_mort = degats_result.mort;
        if (statistique(attaquant, "erosion") > 0 && !statistique(attaquant, "silence")) {
            defenseur.vie_max -= statistique(attaquant, "erosion");
            if (defenseur.vie_max < 1) {
                defenseur.vie_max = 1;
            }
        }
        if (!statistique(defenseur, "silence")) {
            degats_montant -= defenseur.resistance;
        }
        if (Jeu.combat.defenseur_mort && !statistique(attaquant, "silence")) {
            if (statistique(attaquant, "charge") && Jeu[Jeu.combat.defenseur].terrain.length - 1 >= defenseur_slot) {
                degats(Jeu[Jeu.combat.defenseur].terrain[defenseur_slot], degats_result.surplus);
            }
            attaquant.effet_tuer(defenseur);
        }
        else {
            if (statistique(attaquant, "mortel") && !statistique(attaquant, "silence") && defenseur.type == "Créature") {
                mort(defenseur);
            }
        }
        if (statistique(defenseur, "epine") > 0 && !statistique(defenseur, "silence")) {
            Jeu.combat.attaquant_mort = degats(attaquant, statistique(defenseur, "epine")).mort;
        }
        if (!Jeu.combat.attaquant_mort && statistique(attaquant, "vol_de_vie") && !statistique(attaquant, "silence")) {
            soin(attaquant, statistique(attaquant, "vol_de_vie"));
        }
    }
}

function trouver_defenseur() {
    let attaquant = Jeu[Jeu.combat.attaquant].terrain[Jeu.combat.slot];
    let defenseur_slot = 0;
    if (attaquant.portee && !statistique(attaquant, "silence")) {
        defenseur_slot = Jeu[Jeu.combat.defenseur].terrain.length - 1;
        while (Jeu[Jeu.combat.defenseur].terrain[defenseur_slot].camouflage && !statistique(Jeu[Jeu.combat.defenseur].terrain[defenseur_slot], "silence") && defenseur_slot > 0) {
            defenseur_slot--;
        }
        if (Jeu[Jeu.combat.defenseur].terrain[defenseur_slot].camouflage && !statistique(Jeu[Jeu.combat.defenseur].terrain[defenseur_slot], "silence")) {
            return false;
        }
        for (let n = Jeu[Jeu.combat.defenseur].terrain.length - 1; n >= 0; n--) {
            if (statistique(Jeu[Jeu.combat.defenseur].terrain[n], "protection") && !Jeu[Jeu.combat.defenseur].terrain[n].camouflage && !statistique(Jeu[Jeu.combat.defenseur].terrain[n], "silence")) {
                defenseur_slot = n;
                break;
            }
        }
    }
    else {
        while (Jeu[Jeu.combat.defenseur].terrain[defenseur_slot].camouflage && !statistique(Jeu[Jeu.combat.defenseur].terrain[defenseur_slot], "silence") && defenseur_slot < Jeu[Jeu.combat.defenseur].terrain.length - 1) {
            defenseur_slot++;
        }
        if (Jeu[Jeu.combat.defenseur].terrain[defenseur_slot].camouflage && !statistique(Jeu[Jeu.combat.defenseur].terrain[defenseur_slot], "silence")) {
            return false;
        }
        for (let n = 0; n < Jeu[Jeu.combat.defenseur].terrain.length; n++) {
            if (statistique(Jeu[Jeu.combat.defenseur].terrain[n], "protection") && !Jeu[Jeu.combat.defenseur].terrain[n].camouflage && !statistique(Jeu[Jeu.combat.defenseur].terrain[n], "silence")) {
                defenseur_slot = n;
                break;
            }
        }
    }
    return defenseur_slot;
}

function combat_afficher() {
    initialiser();
    div("main");
    if (Jeu.combat.auto) {
        fonction("Désactiver mode auto", "combat_auto_off()");
    }
    else {
        fonction("Activer mode auto", "combat_auto_on()");
        afficher(" - ");
        fonction("Action suivante", "combat_continuer()");
    }
    saut(2);
    afficher("Vie adverse : " + Jeu.adverse.vie + " / " + Jeu.adverse.vie_max);
    saut(2);
    div("", "zone");
    afficher("<u>Terrain adverse :</u>");
    saut();
    if (Jeu.adverse.terrain.length > 0) {
        for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
            if (Jeu.combat.slot == n && Jeu.combat.attaquant == "adverse") {
                div("", "carte attaquant");
            }
            else {
                div("", "carte");
            }
            div();
            afficher_carte("adverse", "terrain", n);
            div_fin();
            div_fin();
        }
    }
    else {
        afficher("<i>Le terrain adverse est vide</i>");
        saut();
    }
    div_fin();
    saut();
    div("", "zone");
    afficher("<u>Terrain :</u>");
    saut();
    if (Jeu.joueur.terrain.length > 0) {
        for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
            if (Jeu.combat.slot == n && Jeu.combat.attaquant == "joueur") {
                div("", "carte attaquant");
            }
            else {
                div("", "carte");
            }
            div();
            afficher_carte("joueur", "terrain", n);
            div_fin();
            div_fin();
        }
    }
    else {
        afficher("<i>Votre terrain est vide</i>");
        saut();
    }
    div_fin();
    saut();
    afficher("Vie : " + Jeu.joueur.vie + " / " + Jeu.joueur.vie_max);
    div_fin();
    div("carte");
    div_fin();
    actualiser();
}

function combat_auto_off() {
    Jeu.combat.auto = false;
    clearInterval(Jeu.combat.affichage);
    combat_afficher();
}

function combat_auto_on() {
    Jeu.combat.auto = true;
    Jeu.combat.affichage = setInterval("combat_continuer()", Jeu.combat.vitesse);
    combat_afficher();
}

function combat_victoire() {
    initialiser();
    afficher("Victoire");
    saut(2);
    fonction("Etage suivant", "etage_suivant()");
    actualiser();
}

function combat_defaite() {
    initialiser();
    afficher("Défaite");
    saut(2);
    if (Jeu.joueur.vie > 0) {
        afficher("Vous subissez " + combat_defaite_degats() + " dommages");
        saut();
        afficher("Il vous reste " + Jeu.joueur.vie + " vie");
        saut(2);
        fonction("Continuer", "etage_fin()");
    }
    else {
        afficher("Vous n'avez plus de vie");
        saut(2);
        fonction("Abandonner", "game_over()");
    }
    actualiser();
}

function combat_defaite_degats() {
    let degats_montant = 0;
    for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
        degats_montant += statistique(Jeu.adverse.terrain[n], "attaque");
    }
    degats_direct("joueur", degats_montant);
    return degats_montant;
}