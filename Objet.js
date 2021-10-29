function objet_ajouter (objet_id,nombre) {
    let verifier = objet_verifier(objet_id);
    if (verifier !== false) {
        Jeu.inventaire[verifier].nombre += nombre;
    }
    else {
        Jeu.inventaire.push(obtenir_objet(objet_id,nombre));
    }
}

function objet_enlever (objet_slot,nombre) {
    Jeu.inventaire[objet_slot].nombre -= nombre;
    if (Jeu.inventaire[objet_slot].nombre < 1) {
        Jeu.inventaire.splice(objet_slot,1);
    }
}

function objet_verifier (objet_id) {
    for (let n=0;n<Jeu.inventaire.length;n++) {
        if (Jeu.inventaire[n].id == objet_id) {
            return n;
        }
    }
    return false;
}

function inventaire () {
    initialiser();
    fonction("Retour","menu()");
    saut(2);
    if (Jeu.inventaire.length > 0) {
        for (let n=0;n<Jeu.inventaire.length;n++) {
            afficher(Jeu.inventaire[n].nombre + " x <b>");
            fonction(Jeu.inventaire[n].nom,"objet_voir(" + n + ")");
            afficher("</b>");
            if (Jeu.inventaire[n].equip) {
                afficher(" (" + Jeu.equipement[Jeu.inventaire[n].equip_slot] + ")");
            }
            saut(1);
        }
    }
    else {
        afficher("Votre inventaire est vide.");
    }
    actualiser();
}

function objet_voir (objet_slot) {
    let objet = Jeu.inventaire[objet_slot];
    initialiser();
    fonction("Retour","inventaire()");
    saut(2);
    afficher(objet.nombre + " x <b>" + objet.nom + "</b>");
    if (objet.equip) {
        afficher(" (" + Jeu.equipement[objet.equip_slot] + ")");
    }
    afficher(" : " + objet.effet + " <i>");
    objet.description();
    afficher("</i>");
    if (objet.be_use) {
        afficher(" ");
        fonction("Utiliser","Jeu.inventaire[" + objet_slot + "].use(" + objet_slot + ",1)");
    }
    if (objet.equip) {
        afficher(" ");
        fonction("Equiper","choisir_equiper(" + objet_slot + ")");
    }
    actualiser();
}

function achat (objet_id,pnj_id,dialogue_id) {
    let objet = obtenir_objet(objet_id);
    fonction("<b>" + objet.nom + "</b>","voir_achat(" + objet_id + "," + pnj_id + "," + dialogue_id +")");
    if (objet.equip) {
        afficher(" (" + Jeu.equipement[objet.equip_slot] + ")");
    }
    afficher(" pour " + objet.valeur + " or");
    saut(1);
}

function voir_achat (objet_id,pnj_id,dialogue_id) {
    let objet = obtenir_objet(objet_id);
    initialiser();
    fonction("Retour","parler(" + pnj_id + "," + dialogue_id + ")");
    saut(2);
    afficher("<b>" + objet.nom + "</b>");
    let verifier = objet_verifier(objet_id);
    if (verifier !== false) {
        afficher("(Vous en avez " + Jeu.inventaire[verifier].nombre + ")");
    }
    if (objet.equip) {
        afficher(" (" + Jeu.equipement[objet.equip_slot] + ")");
    }
    afficher(" : " + objet.effet + " <i>" + objet.description + "</i> ");
    fonction("Acheter","acheter(" + objet_id + "," + pnj_id + "," + dialogue_id + ")");
    afficher(" pour " + objet.valeur + " or");
    actualiser();
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

function choisir_equiper (objet_id) {
    initialiser();
    fonction("Retour","inventaire()");
    saut(2);
    afficher("<b>" + Jeu.inventaire[objet_id].nom + "</b> : " + Jeu.inventaire[objet_id].effet);
    saut(2);
    for (let n=0;n<Jeu.equipe.length;n++) {
        afficher(Jeu.equipe[n].nom + " : <b>" + Jeu.equipe[n].equipement[Jeu.inventaire[objet_id].equip_slot].nom + "</b>");
        if (Jeu.equipe[n].equipement[Jeu.inventaire[objet_id].equip_slot].id > 0) {
            afficher(" : " + Jeu.equipe[n].equipement[Jeu.inventaire[objet_id].equip_slot].effet);
        }
        afficher(", ");
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
    joueur.equipement[Jeu.inventaire[objet_id].equip_slot] = Jeu.inventaire[objet_id];
    equipement = joueur.equipement[Jeu.inventaire[objet_id].equip_slot];
    for (let n=0;n<Jeu.statistiques.length;n++) {
        joueur.statistiques[Jeu.statistiques[n]] += equipement.statistiques[Jeu.statistiques[n]];
    }
    objet_enlever(objet_id,1);
    inventaire();
}

function desequiper (joueur_id,equipement) {
	objet_ajouter(Jeu.equipe[joueur_id].equipement[equipement].id,1);
	for (let n=0;n<Jeu.statistiques.length;n++) {
		Jeu.equipe[joueur_id].statistiques[Jeu.statistiques[n]] -= Jeu.equipe[joueur_id].equipement[equipement].statistiques[Jeu.statistiques[n]];
	}
	Jeu.equipe[joueur_id].equipement[equipement] = {
		id : 0,
        nom : "Vide",
	}
	personnage_voir(joueur_id);
}