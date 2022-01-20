function equipe () {
    initialiser();
    fonction("Retour","menu()");
    saut(2);
    for (let n=0;n<Jeu.equipe.length;n++) {
        let personnage = Jeu.equipe[n];
        fonction(personnage.nom,"personnage_voir(" + n + ")");
        afficher(" Nv " + personnage.niveau + " : ");
        if (!personnage.mort) {
            afficher(personnage.statistiques.vie + " / " + personnage.statistiques.vie_max + " vie, " + personnage.statistiques.mana + " / " + personnage.statistiques.mana_max + " mana");
        }
        else {
            afficher("<i>mort</i>");
        }
		saut(1);
    }
    actualiser();
}

function personnage_voir (personnage_slot) {
    let personnage = Jeu.equipe[personnage_slot];
    initialiser();
    fonction("Retour","equipe()");
    saut(2);
    afficher(personnage.nom);
    if (personnage.mort) {
        afficher(" <i>mort</i>");
    }
    saut(2);
    afficher("Niveau " + personnage.niveau);
    if (personnage.niveau < 100) {
        afficher(" : " + personnage.xp + " / " + parseInt(100*Math.pow(2,parseInt(personnage.niveau/10))*(1 + (personnage.niveau%10)/10)) + " expérience");
    }
    saut(2);
    afficher("Vie : " + personnage.statistiques.vie + " / " + personnage.statistiques.vie_max);
    saut(1);
    afficher("Mana : " + personnage.statistiques.mana + " / " + personnage.statistiques.mana_max);
    saut(1);
    afficher("Attaque en mêlée : " + personnage.statistiques.attaque_mel);
    saut(1);
    afficher("Défense en mêlée : " + personnage.statistiques.defense_mel);
    saut(1);
    afficher("Attaque à distance : " + personnage.statistiques.attaque_dis);
    saut(1);
    afficher("Défense à distance : " + personnage.statistiques.defense_dis);
    saut(1);
    afficher("Attaque magique : " + personnage.statistiques.attaque_mag);
    saut(1);
    afficher("Défense magique : " + personnage.statistiques.defense_mag);
    saut(1);
    afficher("Taux critique : " + personnage.statistiques.taux_crit);
    saut(1);
    afficher("Dégâts critiques : " + personnage.statistiques.degat_crit);
    saut(1);
    afficher("Résistance critique : " + personnage.statistiques.resistance_crit);
    saut(1);
    afficher("Esquive : " + personnage.statistiques.esquive);
    saut(1);
    afficher("Force : " + personnage.statistiques.force);
    saut(1);
    afficher("Agilité : " + personnage.statistiques.agilite);
    saut(1);
    afficher("Intelligence : " + personnage.statistiques.intelligence);
    saut(1);
    afficher("Vitesse : " + personnage.statistiques.vitesse);
    saut(1);
    afficher("Actions : " + personnage.statistiques.action_max);
    saut(2);
    for (let n=0;n<Jeu.equipement.length;n++) {
        afficher(Jeu.equipement[n] + " : ");
        if (personnage.equipement[n].id > 0) {
            fonction("<b>" + personnage.equipement[n].nom + "</b>","voir_equipement(" + personnage_slot + "," + n + ")");
            afficher(", ");
            fonction("Enlever","desequiper(" + personnage_slot + "," + n + ")");
        }
        else {
            afficher("Vide");
        }
        saut(1);
    }
    saut(1);
    for (let n=0;n<personnage.sorts.length;n++) {
        afficher("<b>" + personnage.sorts[n].nom + "</b> : ");
        personnage.sorts[n].description();
        saut(1);
    }
    actualiser();
}

function voir_equipement (personnage_slot,equipement_slot) {
    let objet = Jeu.equipe[personnage_slot].equipement[equipement_slot];
    initialiser();
    fonction("Retour","personnage_voir(" + personnage_slot + ")");
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
        niveau : 0,
        xp : 0,
        mort : false,
        equipement : [],
        statistiques : {
            vie : 0,
            vie_max : 1000,
            mana : 0,
            mana_max : 1000,
            attaque_mel : 100,
            defense_mel : 100,
            attaque_dis : 100,
            defense_dis : 100,
            attaque_mag : 100,
            defense_mag : 100,
            taux_crit : 10,
            degat_crit : 150,
            resistance_crit : 5,
            esquive : 0,
            vitesse : 100,
            force : 150,
            agilite : 150,
            intelligence : 150,
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
    for (let n=0;n<1;n++) {
        personnage.xp += parseInt(100*Math.pow(2,parseInt(personnage.niveau/10))*(1 + (personnage.niveau%10)/10));
        niveau_sup(personnage);
    }
    personnage.statistiques.vie = personnage.statistiques.vie_max;
    personnage.statistiques.mana = personnage.statistiques.mana_max;
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
        let personnage = Jeu.equipe[n];
		fonction(personnage.nom,"personnage_voir_stockage(" + pnj_id + "," + dialogue_id + "," + '"equipe"' + "," + n + ")");
		afficher(" Nv " + personnage.niveau + " ");
        if (personnage.mort) {
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
            let personnage = Jeu.reserve[n];
			fonction(personnage.nom,"personnage_voir_stockage(" + pnj_id + "," + dialogue_id + "," + '"reserve"' + "," + n + ")");
			afficher(" Nv " + personnage.niveau + " ");
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
    afficher("Nommez votre nouveau compagnon : ");
    saut(2);
	afficher("<input type=text id=nom />");
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

function ajouter_personnage (pnj_id,dialogue_id,personnage_slot) {
	if (Jeu.equipe.length < 4) {
		Jeu.equipe.push(Jeu.reserve[personnage_slot]);
		Jeu.reserve.splice(personnage_slot,1);
		liste_personnage(pnj_id,dialogue_id);
	}
}

function deposer_personnage (pnj_id,dialogue_id,personnage_slot) {
	if (Jeu.equipe.length > 1) {
		Jeu.reserve.push(Jeu.equipe[personnage_slot]);
		Jeu.equipe.splice(personnage_slot,1);
		liste_personnage(pnj_id,dialogue_id);
	}
}

function personnage_voir_stockage (pnj_id,dialogue_id,stockage,personnage_slot) {
	let personnage = Jeu[stockage][personnage_slot];
	initialiser();
	fonction("Retour","liste_personnage(" + pnj_id + "," + dialogue_id + ")");
	saut(2);
    afficher(personnage.nom);
    if (personnage.mort) {
        afficher(" <i>mort</i>");
    }
    saut(2);
    afficher("Niveau " + personnage.niveau);
    if (personnage.niveau < 100) {
        afficher(" : " + personnage.xp + " / " + parseInt(100*Math.pow(2,parseInt(personnage.niveau/10))*(1 + (personnage.niveau%10)/10)) + " expérience");
    }
    saut(2);
    afficher("Vie : " + personnage.statistiques.vie + " / " + personnage.statistiques.vie_max);
    saut(1);
    afficher("Mana : " + personnage.statistiques.mana + " / " + personnage.statistiques.mana_max);
    saut(1);
    afficher("Attaque en mêlée: " + personnage.statistiques.attaque_mel);
    saut(1);
    afficher("Défense en mêlée : " + personnage.statistiques.defense_mel);
    saut(1);
    afficher("Attaque à distance : " + personnage.statistiques.attaque_dis);
    saut(1);
    afficher("Défense à distance : " + personnage.statistiques.defense_dis);
    saut(1);
    afficher("Attaque magique : " + personnage.statistiques.attaque_mag);
    saut(1);
    afficher("Défense magique : " + personnage.statistiques.defense_mag);
    saut(1);
    afficher("Taux critique : " + personnage.statistiques.taux_crit);
    saut(1);
    afficher("Dégâts critiques : " + personnage.statistiques.degat_crit);
    saut(1);
    afficher("Résistance critique : " + personnage.statistiques.resistance_crit);
    saut(1);
    afficher("Esquive : " + personnage.statistiques.esquive);
    saut(1);
    afficher("Force : " + personnage.statistiques.force);
    saut(1);
    afficher("Agilité : " + personnage.statistiques.agilite);
    saut(1);
    afficher("Intelligence : " + personnage.statistiques.intelligence);
    saut(1);
    afficher("Vitesse : " + personnage.statistiques.vitesse);
    saut(1);
    afficher("Actions : " + personnage.statistiques.action_max);
    saut(2);
    for (let n=0;n<Jeu.equipement.length;n++) {
        afficher(Jeu.equipement[n] + " : <b>" + personnage.equipement[n].nom + "</b>");
        saut(1);
    }
    saut(1);
    for (let n=0;n<personnage.sorts.length;n++) {
        afficher("<b>" + personnage.sorts[n].nom + "</b> : ");
        personnage.sorts[n].description();
        saut(1);
    }
	actualiser();
}

function verifier_equipe_vivant (personnage_slot) {
    for (let n=0;n<Jeu.equipe.length;n++) {
        if (n != personnage_slot && !Jeu.equipe[n].mort) {
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

function niveau_sup (personnage) {
    personnage.xp -= parseInt(100*Math.pow(2,parseInt(personnage.niveau/10))*(1 + (personnage.niveau%10)/10));
    personnage.statistiques.vie_max += parseInt(100*Math.pow(2,parseInt(personnage.niveau/10)));
    personnage.statistiques.mana_max += parseInt(100*Math.pow(2,parseInt(personnage.niveau/10)));
    personnage.statistiques.attaque_mel += parseInt(10*Math.pow(2,parseInt(personnage.niveau/10)));
    personnage.statistiques.defense_mel += parseInt(10*Math.pow(2,parseInt(personnage.niveau/10)));
    personnage.statistiques.attaque_dis += parseInt(10*Math.pow(2,parseInt(personnage.niveau/10)));
    personnage.statistiques.defense_dis += parseInt(10*Math.pow(2,parseInt(personnage.niveau/10)));
    personnage.statistiques.attaque_mag += parseInt(10*Math.pow(2,parseInt(personnage.niveau/10)));
    personnage.statistiques.defense_mag += parseInt(10*Math.pow(2,parseInt(personnage.niveau/10)));
    personnage.statistiques.force += parseInt(15*Math.pow(2,parseInt(personnage.niveau/10)));
    personnage.statistiques.agilite += parseInt(15*Math.pow(2,parseInt(personnage.niveau/10)));
    personnage.statistiques.intelligence += parseInt(15*Math.pow(2,parseInt(personnage.niveau/10)));
    personnage.niveau++;
}

function soin (montant,personnage) {
    personnage.statistiques.vie += montant;
    if (personnage.statistiques.vie > personnage.statistiques.vie_max) {
        personnage.statistiques.vie = personnage.statistiques.vie_max;
    }
}