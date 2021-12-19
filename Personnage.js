function equipe () {
    initialiser();
    fonction("Retour","menu()");
    saut(2);
    for (let n=0;n<Jeu.equipe.length;n++) {
        fonction(Jeu.equipe[n].nom,"personnage_voir(" + n + ")");
        afficher(" : ");
        if (!Jeu.equipe[n].mort) {
            afficher(Jeu.equipe[n].statistiques.vie + " / " + Jeu.equipe[n].statistiques.vie_max + " vie, " + Jeu.equipe[n].statistiques.mana + " / " + Jeu.equipe[n].statistiques.mana_max + " mana");
        }
        else {
            afficher("<i>mort</i>");
        }
		saut(1);
    }
    actualiser();
}

function personnage_voir (joueur_slot) {
    let joueur = Jeu.equipe[joueur_slot];
    initialiser();
    fonction("Retour","equipe()");
    saut(2);
    afficher(joueur.nom);
    if (joueur.mort) {
        afficher(" <i>mort</i>");
    }
    saut(2);
    afficher(joueur.xp + " expérience");
    saut(2);
    afficher("Vie : " + joueur.statistiques.vie + " / " + joueur.statistiques.vie_max);
    saut(1);
    afficher("Mana : " + joueur.statistiques.mana + " / " + joueur.statistiques.mana_max);
    saut(1);
    afficher("Attaque en mêlée : " + joueur.statistiques.attaque_mel);
    saut(1);
    afficher("Défense en mêlée : " + joueur.statistiques.defense_mel);
    saut(1);
    afficher("Attaque à distance : " + joueur.statistiques.attaque_dis);
    saut(1);
    afficher("Défense à distance : " + joueur.statistiques.defense_dis);
    saut(1);
    afficher("Attaque magique : " + joueur.statistiques.attaque_mag);
    saut(1);
    afficher("Défense magique : " + joueur.statistiques.defense_mag);
    saut(1);
    afficher("Force : " + joueur.statistiques.force);
    saut(1);
    afficher("Agilité : " + joueur.statistiques.agilite);
    saut(1);
    afficher("Intelligence : " + joueur.statistiques.intelligence);
    saut(1);
    afficher("Vitesse : " + joueur.statistiques.vitesse);
    saut(1);
    afficher("Actions : " + joueur.statistiques.action_max);
    saut(2);
    for (let n=0;n<Jeu.equipement.length;n++) {
        afficher(Jeu.equipement[n] + " : ");
        if (joueur.equipement[n].id > 0) {
            fonction("<b>" + joueur.equipement[n].nom + "</b>","voir_equipement(" + joueur_slot + "," + n + ")");
            afficher(", ");
            fonction("Enlever","desequiper(" + joueur_slot + "," + n + ")");
        }
        else {
            afficher("Vide");
        }
        saut(1);
    }
    saut(1);
    for (let n=0;n<joueur.sorts.length;n++) {
        afficher("<b>" + joueur.sorts[n].nom + "</b> : ");
        joueur.sorts[n].description();
        saut(1);
    }
    actualiser();
}

function voir_equipement (joueur_slot,equipement_slot) {
    let objet = Jeu.equipe[joueur_slot].equipement[equipement_slot];
    initialiser();
    fonction("Retour","personnage_voir(" + joueur_slot + ")");
    saut(2);
    afficher("<b>" + objet.nom + "</b>");
    if (objet.equip) {
        afficher(" (" + Jeu.equipement[objet.equip_slot] + ")");
    }
    saut(1);
    objet.effet();
    saut(2);
    afficher("<i>");
    objet.description();
    afficher("</i>");
    actualiser();
}

function obtenir_personnage (nom) {
    let personnage = {
        nom : nom,
        xp : 0,
        mort : false,
        equipement : [],
        statistiques : {
            vie : 100,
            vie_max : 100,
            mana : 100,
            mana_max : 100,
            attaque_mel : 10,
            defense_mel : 10,
            attaque_dis : 10,
            defense_dis : 10,
            attaque_mag : 10,
            defense_mag : 10,
            vitesse : 50,
            force : 15,
            agilite : 15,
            intelligence : 15,
            atb : 0,
            action : 6,
            action_max : 6,
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
    personnage.sorts.push(obtenir_sort(1,personnage));
    personnage.sorts.push(obtenir_sort(2,personnage));
    personnage.sorts.push(obtenir_sort(3,personnage));
    personnage.sorts.push(obtenir_sort(4,personnage));
	return personnage;
}

function liste_personnage (pnj_id,dialogue_id) {
	initialiser();
	fonction("Retour","parler(" + pnj_id + "," + dialogue_id + ")");
	saut(2);
	afficher("<u>Equipe :</u> (" + Jeu.equipe.length + "/4)");
	saut(1);
	for (let n=0;n<Jeu.equipe.length;n++) {
		fonction(Jeu.equipe[n].nom,"voir_personnage(" + pnj_id + "," + dialogue_id + "," + '"equipe"' + "," + n + ")");
		afficher(" ");
        if (Jeu.equipe[n].mort) {
            afficher("<i>mort</i>");
        }
        else if (verifier_equipe_vivant(n)) {
            fonction("Déposer","deposer_personnage(" + pnj_id + "," + dialogue_id + "," + n + ")");
        }
		saut(1);
	}
	saut(1);
	afficher("<u>Réserve :</u>");
	saut(1);
	if (Jeu.reserve.length > 0) {
		for (let n=0;n<Jeu.reserve.length;n++) {
			fonction(Jeu.reserve[n].nom,"voir_personnage(" + pnj_id + "," + dialogue_id + "," + '"reserve"' + "," + n + ")");
			afficher(" ");
			fonction("Ajouter","ajouter_personnage(" + pnj_id + "," + dialogue_id + "," + n + ")");
			saut(1);
		}
	}
	else {
		afficher("Vous n'avez aucun compagnon en réserve");
	}
	actualiser();
}

function creer_personnage (pnj_id,dialogue_id) {
	initialiser();
	fonction("Retour","parler(" + pnj_id + "," + dialogue_id + ")");
	saut(2);
	afficher("Nom : <input type=text id=nom />");
	saut(2);
	fonction("Recruter","recruter_personnage(" + pnj_id + "," + dialogue_id + ")");
	actualiser();
}

function recruter_personnage (pnj_id,dialogue_id) {
	let nom = document.getElementById("nom").value;
	if (nom != "") {
		Jeu.reserve.push(obtenir_personnage(nom));
		parler(pnj_id,dialogue_id);
	}
}

function ajouter_personnage (pnj_id,dialogue_id,joueur_id) {
	if (Jeu.equipe.length < 4) {
		Jeu.equipe.push(Jeu.reserve[joueur_id]);
		Jeu.reserve.splice(joueur_id,1);
		liste_personnage(pnj_id,dialogue_id);
	}
}

function deposer_personnage (pnj_id,dialogue_id,joueur_id) {
	if (Jeu.equipe.length > 1) {
		Jeu.reserve.push(Jeu.equipe[joueur_id]);
		Jeu.equipe.splice(joueur_id,1);
		liste_personnage(pnj_id,dialogue_id);
	}
}

function voir_personnage (pnj_id,dialogue_id,stockage,joueur_slot) {
	let joueur = Jeu[stockage][joueur_slot];
	initialiser();
	fonction("Retour","liste_personnage(" + pnj_id + "," + dialogue_id + ")");
	saut(2);
    afficher(joueur.nom);
    if (joueur.mort) {
        afficher(" <i>mort</i>");
    }
    saut(2);
    afficher(joueur.xp + " expérience");
    saut(2);
    afficher("Vie : " + joueur.statistiques.vie + " / " + joueur.statistiques.vie_max);
    saut(1);
    afficher("Mana : " + joueur.statistiques.mana + " / " + joueur.statistiques.mana_max);
    saut(1);
    afficher("Attaque en mêlée: " + joueur.statistiques.attaque_mel);
    saut(1);
    afficher("Défense en mêlée : " + joueur.statistiques.defense_mel);
    saut(1);
    afficher("Attaque à distance : " + joueur.statistiques.attaque_dis);
    saut(1);
    afficher("Défense à distance : " + joueur.statistiques.defense_dis);
    saut(1);
    afficher("Attaque magique : " + joueur.statistiques.attaque_mag);
    saut(1);
    afficher("Défense magique : " + joueur.statistiques.defense_mag);
    saut(1);
    afficher("Force : " + joueur.statistiques.force);
    saut(1);
    afficher("Agilité : " + joueur.statistiques.agilite);
    saut(1);
    afficher("Intelligence : " + joueur.statistiques.intelligence);
    saut(1);
    afficher("Vitesse : " + joueur.statistiques.vitesse);
    saut(1);
    afficher("Actions : " + joueur.statistiques.action_max);
    saut(2);
    for (let n=0;n<Jeu.equipement.length;n++) {
        afficher(Jeu.equipement[n] + " : <b>" + joueur.equipement[n].nom + "</b>");
        saut(1);
    }
    saut(1);
    for (let n=0;n<joueur.sorts.length;n++) {
        afficher("<b>" + joueur.sorts[n].nom + "</b> : ");
        joueur.sorts[n].description();
        saut(1);
    }
	actualiser();
}

function verifier_equipe_vivant (joueur_slot) {
    for (let n=0;n<Jeu.equipe.length;n++) {
        if (n != joueur_slot && !Jeu.equipe[n].mort) {
            return true;
        }
    }
    return false;
}

function verifier_sort (sort_id,personnage) {
    let is_learned = false;
    for (let n=0;n<personnage.sorts.length;n++) {
        if (personnage.sorts[n].id == sort_id) {
            is_learned = true;
        }
    }
    return is_learned;
}