function demarrage () {
    Jeu.or += 100;
    Jeu.equipe.push(obtenir_personnage("Joueur 1"));
    Jeu.equipe.push(obtenir_personnage("Joueur 2"));
    objet_ajouter(2,2);
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
			for (let i=0;i<piece.monstres[n].length;i++) {
				afficher(obtenir_monstre(piece.monstres[n][i]).nom + ", ");
			}
            fonction("Combattre","nouveau_combat(" + n + ")");
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

function soin (montant,joueur_id) {
    Jeu.equipe[joueur_id].statistiques.vie += montant;
    if (Jeu.equipe[joueur_id].statistiques.vie > Jeu.equipe[joueur_id].statistiques.vie_max) {
        Jeu.equipe[joueur_id].statistiques.vie = Jeu.equipe[joueur_id].statistiques.vie_max;
    }
}

function dormir () {
    for (let n=0;n<Jeu.equipe.length;n++) {
        if (!Jeu.equipe[n].mort) {
            Jeu.equipe[n].statistiques.vie = Jeu.equipe[n].statistiques.vie_max;
        }
    }
    menu();
}

function checkpoint (zone,batiment,piece) {
    Jeu.spawn.zone = zone;
    Jeu.spawn.batiment = batiment;
    Jeu.spawn.piece = piece;
}