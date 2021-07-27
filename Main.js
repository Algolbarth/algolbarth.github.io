function demarrage () {
    Jeu.or += 100;
    ajouter_personnage();
    menu();
}

function menu () {
    let zone = Jeu.zones[Jeu.emplacement.zone];
    let batiment = zone.batiments[Jeu.emplacement.batiment];
    let piece = batiment.pieces[Jeu.emplacement.piece];
    initialiser();
    fonction("Equipe","equipe()");
    afficher(" - ");
    fonction("Inventaire","inventaire()");
    afficher(" - " + Jeu.or + " Or");
    saut(1);
    afficher(zone.nom);
    if (Jeu.emplacement.batiment > 0) {
        afficher(" - " + batiment.nom + " - " + piece.nom);
    }
    saut(2);
    if (piece.deplacements.length > 0) {
        afficher("Déplacements :");
        saut(1);
        for (let n=0;n<piece.deplacements.length;n++) {
            fonction(piece.deplacements[n].nom(),"deplacer(" + n + ")");
            saut(1);
        }
        saut(1);
    }
    if (piece.pnjs.length > 0) {
        afficher("Personnages :");
        saut(1);
        for (let n=0;n<piece.pnjs.length;n++) {
            fonction(piece.pnjs[n].nom,"parler(" + n + ",0)");
            saut(1);
        }
    }
    if (piece.monstres.length > 0) {
        afficher("Monstres :");
        saut(1);
        for (let n=0;n<piece.monstres.length;n++) {
            fonction(obtenir_monstre(piece.monstres[n]).nom,"nouveau_combat(" + n + ")");
            saut(1);
        }
    }
    actualiser();
}

function deplacer (deplacement_id) {
    Jeu.emplacement = Jeu.zones[Jeu.emplacement.zone].batiments[Jeu.emplacement.batiment].pieces[Jeu.emplacement.piece].deplacements[deplacement_id];
    menu();
}

function parler (pnj_id,dialogue_id) {
    pnj_id = pnj_id;
    dialogue_id = dialogue_id;
    let pnj = Jeu.zones[Jeu.emplacement.zone].batiments[Jeu.emplacement.batiment].pieces[Jeu.emplacement.piece].pnjs[pnj_id];
    initialiser();
    afficher(pnj.nom + " : ");
    saut(1);
    pnj.dialogues[dialogue_id](pnj_id,dialogue_id);
    actualiser();
}

function achat (objet_id,pnj_id,dialogue_id) {
    let objet = obtenir_objet(objet_id);
    afficher(objet.nom + " : <i>" + objet.description + "</i>");
    if (objet_verifier(objet_id)) {
        afficher(" (Vous en avez " + Jeu.inventaire[objet_trouver(objet_id)].nombre + ")")
    }
    afficher(", ");
    fonction("Acheter","acheter(" + objet_id + "," + pnj_id + "," + dialogue_id + ")");
    afficher(" pour " + objet.valeur + " or");
    saut(1);
}

function acheter (objet_id,pnj_id,dialogue_id) {
    let objet = obtenir_objet(objet_id);
    if (Jeu.or >= objet.valeur) {
        Jeu.or -= objet.valeur;
        objet_ajouter(objet_id,1);
        parler(pnj_id,dialogue_id);
    }
}

function vendre (objet_id,pnj_id,dialogue_id) {
    Jeu.or += Jeu.inventaire[objet_id].valeur;
    objet_enlever(objet_id,1);
    parler(pnj_id,dialogue_id);
}

function objet_ajouter (objet_id,nombre) {
    if (objet_verifier(objet_id)) {
        Jeu.inventaire[objet_trouver(objet_id)].nombre += nombre;
    }
    else {
        Jeu.inventaire.push(obtenir_objet(objet_id,nombre));
    }
}

function objet_enlever (objet_id,nombre) {
    Jeu.inventaire[objet_id].nombre -= nombre;
    if (Jeu.inventaire[objet_id].nombre < 1) {
        Jeu.inventaire.splice(objet_id,1);
    }
}

function objet_verifier (objet_id) {
    for (let n=0;n<Jeu.inventaire.length;n++) {
        if (Jeu.inventaire[n].id == objet_id) {
            return true;
        }
    }
    return false;
}

function objet_trouver (objet_id) {
    for (let n=0;n<Jeu.inventaire.length;n++) {
        if (Jeu.inventaire[n].id == objet_id) {
            return n;
        }
    }
}

function inventaire () {
    initialiser();
    fonction("Retour","menu()");
    saut(2);
    if (Jeu.inventaire.length > 0) {
        for (let n=0;n<Jeu.inventaire.length;n++) {
            afficher(Jeu.inventaire[n].nombre + " x " + Jeu.inventaire[n].nom + " : <i>" + Jeu.inventaire[n].description + "</i>");
            if (Jeu.inventaire[n].be_use == true) {
                afficher(", ");
                fonction("Utiliser","Jeu.inventaire[" + n + "].use(" + n + ",1)");
            }
            if (Jeu.inventaire[n].equip == true) {
                afficher(", ");
                fonction("Equiper","choisir_equiper(" + n + ")");
            }
            saut(1);
        }
    }
    else {
        afficher("Votre inventaire est vide.");
    }
    actualiser();
}

function equipe () {
    initialiser();
    fonction("Retour","menu()");
    saut(2);
    for (let n=0;n<Jeu.equipe.length;n++) {
        fonction(Jeu.equipe[n].nom,"personnage(" + n + ")");
        afficher(" : " + Jeu.equipe[n].statistiques.vie + " / " + Jeu.equipe[n].statistiques.vie_max);
    }
    actualiser();
}

function personnage (joueur_id) {
    let joueur = Jeu.equipe[joueur_id];
    initialiser();
    fonction("Retour","equipe()");
    saut(2);
    afficher(joueur.nom);
    saut(2);
    afficher("Vie : " + joueur.statistiques.vie + " / " + joueur.statistiques.vie_max);
    saut(1);
    afficher("Attaque : " + joueur.statistiques.attaque);
    saut(1);
    afficher("Défense : " + joueur.statistiques.defense);
    saut(1);
    afficher("Vitesse : " + joueur.statistiques.vitesse);
    saut(2);
    for (let n=0;n<Jeu.equipement.length;n++) {
        afficher(Jeu.equipement[n] + " : " + joueur.equipement[n].nom);
        saut(1);
    }
    actualiser();
}

function ajouter_personnage () {
    let personnage = {
        nom : "Joueur",
        equipement : [],
        statistiques : {
            vie : 100,
            vie_max : 100,
            attaque : 50,
            defense : 25,
            vitesse : 50,
            atb : 0,
        },
        sorts : [],
        ennemi : false,
    }
    for (let n=0;n<Jeu.equipement.length;n++) {
        let vide = {
            id : 0,
            nom : "Vide",
        }
        personnage.equipement.push(vide);
    }
    let sort = {
        nom : "Attaque",
        use : function () {
            n = 0;
            while (!Jeu.combat.liste[n].ennemi) {
                n++;
            }
            let degats = personnage.statistiques.attaque - Jeu.combat.liste[n].statistiques.defense;
            if (degats <= 0) {
                degats = 1;
            }
            Jeu.combat.liste[n].statistiques.vie -= degats;
            Jeu.combat.resultat = personnage.nom + " attaque et inflige " + degats + " dégats";
            if (Jeu.combat.liste[n].statistiques.vie <= 0) {
                Jeu.combat.liste[n].mort = true;
            }
        }
    }
    personnage.sorts.push(sort);
    Jeu.equipe.push(personnage);
}

function choisir_equiper (objet_id) {
    initialiser();
    fonction("Retour","inventaire()");
    saut(2);
    afficher(Jeu.inventaire[objet_id].nom + " : " + Jeu.inventaire[objet_id].description);
    saut(2);
    for (let n=0;n<Jeu.equipe.length;n++) {
        afficher(Jeu.equipe[n].nom + " : " + Jeu.equipe[n].equipement[Jeu.inventaire[objet_id].equip_slot].nom + ", ");
        fonction("Equiper","equiper(" + objet_id + "," + n + ")");
        saut(1);
    }
    actualiser();
}

function equiper (objet_id,joueur_id) {
    let joueur = Jeu.equipe[joueur_id];
    let equipement = joueur.equipement[Jeu.inventaire[objet_id].equip_slot];
    if (equipement.id > 0) {
        for (let n=0;n<Jeu.statistiques.length;n++) {
            joueur.statistiques[Jeu.statistiques[n]] -= equipement.statistiques[Jeu.statistiques[n]];
        }
        objet_ajouter(equipement.id,1);
    }
    Jeu.equipe[joueur_id].equipement[Jeu.inventaire[objet_id].equip_slot] = Jeu.inventaire[objet_id];
    equipement = joueur.equipement[Jeu.inventaire[objet_id].equip_slot];
    for (let n=0;n<Jeu.statistiques.length;n++) {
        joueur.statistiques[Jeu.statistiques[n]] += equipement.statistiques[Jeu.statistiques[n]];
    }
    objet_enlever(objet_id,1);
    inventaire();
}

function soin (montant,joueur_id) {
    Jeu.equipe[joueur_id].statistiques.vie += montant;
    if (Jeu.equipe[joueur_id].statistiques.vie > Jeu.equipe[joueur_id].statistiques.vie_max) {
        Jeu.equipe[joueur_id].statistiques.vie = Jeu.equipe[joueur_id].statistiques.vie_max;
    }
}

function nouveau_combat (monstre_id) {
    Jeu.combat.liste.push(obtenir_monstre(Jeu.zones[Jeu.emplacement.zone].batiments[Jeu.emplacement.batiment].pieces[Jeu.emplacement.piece].monstres[monstre_id]));
    for (let n=0;n<Jeu.equipe.length;n++) {
        Jeu.combat.liste.push(Jeu.equipe[n]);
    }
    continuer_combat();
}

function continuer_combat () {
    if (defaite()) {
        mort();
    }
    else if (victoire()) {
        fin_combat();
    } 
    else {
        for (let n=0;n<Jeu.combat.liste.length;n++) {
            Jeu.combat.liste[n].statistiques.atb += Jeu.combat.liste[n].statistiques.vitesse;
        }
        for (let n=0;n<Jeu.combat.liste.length;n++) {
            let i = n;
            while (i > 0 && Jeu.combat.liste[i].statistiques.atb > Jeu.combat.liste[i-1].statistiques.atb) {
                let transition = Jeu.combat.liste[i];
                Jeu.combat.liste[i] = Jeu.combat.liste[i-1];
                Jeu.combat.liste[i-1] = transition;
            }
        }
        if (Jeu.combat.liste[0].statistiques.atb >= 100) {
            Jeu.combat.liste[0].statistiques.atb -= 100;
            if (Jeu.combat.liste[0].ennemi) {
                Jeu.combat.liste[0].tour();
                resultat_combat();
            }
            else {
                choix_combat();
            }
        }
        else {
            continuer_combat();
        }
    }
}

function resultat_combat () {
    initialiser();
    afficher_combat();
    saut(1);
    afficher(Jeu.combat.resultat);
    saut(2);
    fonction("Suivant","continuer_combat()");
    actualiser();
}

function afficher_combat () {
    afficher("Adversaires :");
    saut(1);
    for (let n=0;n<Jeu.combat.liste.length;n++) {
        if (Jeu.combat.liste[n].ennemi) {
            afficher(Jeu.combat.liste[n].nom);
            if (Jeu.combat.liste[n].mort) {
                afficher(" <i>mort</i>");
            }
            saut(1);
        }
    }
    saut(1);
    afficher("Alliés :");
    saut(1);
    for (let n=0;n<Jeu.combat.liste.length;n++) {
        if (!Jeu.combat.liste[n].ennemi) {
            afficher(Jeu.combat.liste[n].nom + " : " + Jeu.combat.liste[n].statistiques.vie + " / " + Jeu.combat.liste[n].statistiques.vie_max);
            saut(1);
        }
    }
}

function choix_combat () {
    initialiser();
    afficher_combat();
    saut(1);
    for (let n=0;n<Jeu.combat.liste[0].sorts.length;n++) {
        fonction(Jeu.combat.liste[0].sorts[n].nom,"Jeu.combat.liste[0].sorts[" + n + "].use();resultat_combat()");
    }
    saut(1);
    fonction("Passer son tour","continuer_combat()");
    actualiser();
}

function fin_combat () {
    initialiser();
    for (let n=0;n<Jeu.combat.liste.length;n++) {
        if (Jeu.combat.liste[n].ennemi) {
            afficher(Jeu.combat.liste[n].nom);
            if (Jeu.combat.liste[n].or > 0) {
                afficher(" + " + Jeu.combat.liste[n].or + " Or");
                Jeu.or += Jeu.combat.liste[n].or;
            }
            for (let i=0;i<Jeu.combat.liste[n].loots.length;i++) {
                if (Jeu.combat.liste[n].loots[i].taux > Math.random()*100) {
                    afficher(" + 1 " + obtenir_objet(Jeu.combat.liste[n].loots[i].id).nom);
                    objet_ajouter(10,1);
                }
            }
            saut(1);
        }
    }
    saut(1);
    Jeu.combat = {
        liste : [],
        resultat : "",
    }
    fonction("Terminé","menu()");
    actualiser();
}

function victoire () {
    for (let n=0;n<Jeu.combat.liste.length;n++) {
        if (Jeu.combat.liste[n].ennemi && !Jeu.combat.liste[n].mort) {
            return false;
        }
    }
    return true;
}

function defaite () {
    for (let n=0;n<Jeu.combat.liste.length;n++) {
        if (!Jeu.combat.liste[n].ennemi && !Jeu.combat.liste[n].mort) {
            return false;
        }
    }
    return true;
}

function mort () {
    initialiser();
    Jeu.emplacement = Jeu.spawn;
    for (let n=0;n<Jeu.equipe.length;n++) {
        Jeu.equipe[n].statistiques.vie = Jeu.equipe[n].statistiques.vie_max;
    }
    fonction("Revivre","menu();");
    actualiser();
}