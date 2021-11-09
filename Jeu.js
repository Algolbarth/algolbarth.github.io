function nouvelle_partie () {
    Jeu = {
        emplacement : {
            zone : 0,
            batiment : 0,
            piece : 0,
        },
        spawn : {
            zone : 0,
            batiment : 3,
            piece : 1,
        },
        zones : [],
        inventaire : [],
        or : 100,
        equipe : [],
        reserve : [],
        banque : {
            or : 0,
            inventaire : [],
        },
        equipement : [
            "Main principale",
            "Main secondaire",
            "Tête",
            "Buste",
            "Mains",
            "Jambes",
            "Pieds",
            "Accessoire",
        ],
        statistiques : [
            "vie_max",
            "mana_max",
            "attaque_mel",
            "defense_mel",
            "attaque_dis",
            "defense_dis",
            "attaque_mag",
            "defense_mag",
            "force",
            "agilite",
            "intelligence",
            "vitesse",
            "action_max",
        ],
        statistiques_nom : [
            "Vie",
            "Mana",
            "Attaque en mêlée",
            "Défense en mêlée",
            "Attaque à distance",
            "Défense à distance",
            "Attaque magique",
            "Défense magique",
            "Force",
            "Agilité",
            "Intelligence",
            "Vitesse",
            "Action",
        ],
        combat : {
            liste : [],
            resultat : "",
        }
    }
    initialiser_zones();
    premier_personnage();
}

function premier_personnage () {
    initialiser();
    afficher("Nom : <input type=text id=nom />");
	saut(2);
	fonction("Fini","premier_personnage_creer()");
    actualiser();
}

function premier_personnage_creer () {
    let nom = document.getElementById("nom").value;
    if (nom != "") {
        Jeu.equipe.push(obtenir_personnage(nom));
        Jeu.equipe.push(obtenir_personnage("Jean"));
        Jeu.equipe.push(obtenir_personnage("Philippe"));
        Jeu.equipe.push(obtenir_personnage("Karine"));
        menu();
    }
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