function banque_or (pnj_id,dialogue_id) {
	initialiser();
	fonction("Retour","parler(" + pnj_id + "," + dialogue_id + ")");
	saut(2);
	afficher("Or sur vous : " + Jeu.or);
	saut(1);
	afficher("Or en banque : " + Jeu.banque.or);
	saut(2);
	afficher("<input id='or' type='number'></input>");
	saut(2);
	fonction("Déposer","banque_or_deposer(" + pnj_id + "," + dialogue_id + ")");
	saut(1);
	fonction("Retirer","banque_or_retirer(" + pnj_id + "," + dialogue_id + ")");
	actualiser();
}

function banque_or_deposer (pnj_id,dialogue_id) {
	let or = parseInt(document.getElementById("or").value);
	if (Jeu.or >= or) {
		Jeu.or -= or;
		Jeu.banque.or += or;
		banque_or(pnj_id,dialogue_id);
	}
}

function banque_or_retirer (pnj_id,dialogue_id) {
	let or = parseInt(document.getElementById("or").value);
	if (Jeu.banque.or >= or) {
		Jeu.or += or;
		Jeu.banque.or -= or;
		banque_or(pnj_id,dialogue_id);
	}
}

function banque (pnj_id,dialogue_id) {
	initialiser();
	fonction("Retour","parler(" + pnj_id + "," + dialogue_id + ")");
	saut(2);
	fonction("Déposer des objets","banque_choisir_deposer(" + pnj_id + "," + dialogue_id + ")");
	saut(1);
	fonction("Retirer des objets","banque_choisir_retirer(" + pnj_id + "," + dialogue_id + ")");
	actualiser();
}

function banque_choisir_deposer (pnj_id,dialogue_id) {
	initialiser();
	fonction("Retour","banque(" + pnj_id + "," + dialogue_id + ")");
	saut(2);
	if (Jeu.inventaire.length > 0) {
		for (let n=0;n<Jeu.inventaire.length;n++) {
			afficher(Jeu.inventaire[n].nombre + " x ");
			fonction("<b>" + Jeu.inventaire[n].nom + "</b>","banque_voir_deposer(" + n + "," + pnj_id + "," + dialogue_id + ")");
			afficher(" Nv " + Jeu.inventaire[n].niveau);
            if (Jeu.inventaire[n].equip) {
                afficher(" (" + Jeu.equipement[Jeu.inventaire[n].equip_slot] + ")");
            }
			saut(1);
		}
	}
	else {
		afficher("Votre inventaire est vide");
	}
	actualiser();
}

function banque_voir_deposer (objet_slot,pnj_id,dialogue_id) {
	let objet = Jeu.inventaire[objet_slot];
	initialiser();
	fonction("Retour","banque_choisir_deposer(" + pnj_id + "," + dialogue_id + ")");
	saut(2);
	afficher(objet.nombre + " x <b>" + objet.nom + "</b> Nv " + objet.niveau);
	if (objet.equip) {
		afficher(" (" + Jeu.equipement[objet.equip_slot] + ")");
	}
	afficher(" : ");
	fonction("Déposer","banque_deposer(" + objet_slot + ",1," + pnj_id + "," + dialogue_id + ")");
	saut(1);
	objet.effet();
	saut(2);
	afficher("<i>");
    objet.description();
    afficher("</i>");
	actualiser();
}

function banque_deposer (objet_slot,nombre,pnj_id,dialogue_id) {
	banque_ajouter(Jeu.inventaire[objet_slot].id,Jeu.inventaire[objet_slot].niveau,nombre);
	objet_enlever(objet_slot,nombre);
	banque_choisir_deposer(pnj_id,dialogue_id);
}

function banque_choisir_retirer (pnj_id,dialogue_id) {
	initialiser();
	fonction("Retour","banque(" + pnj_id + "," + dialogue_id + ")");
	saut(2);
	if (Jeu.banque.inventaire.length > 0) {
		for (let n=0;n<Jeu.banque.inventaire.length;n++) {
			afficher(Jeu.banque.inventaire[n].nombre + " x ");
			fonction("<b>" + Jeu.banque.inventaire[n].nom + "</b>","banque_voir_retirer(" + n + "," + pnj_id + "," + dialogue_id + ")");
			afficher(" Nv " + Jeu.banque.inventaire[n].niveau);
            if (Jeu.banque.inventaire[n].equip) {
                afficher(" (" + Jeu.equipement[Jeu.banque.inventaire[n].equip_slot] + ")");
            }
			saut(1);
		}
	}
	else {
		afficher("Vous n'avez aucun objet stocké");
	}
	actualiser();
}

function banque_voir_retirer (objet_slot,pnj_id,dialogue_id) {
	let objet = Jeu.banque.inventaire[objet_slot];
	initialiser();
	fonction("Retour","banque_choisir_retirer(" + pnj_id + "," + dialogue_id + ")");
	saut(2);
	afficher(objet.nombre + " x <b>" + objet.nom + "</b> Nv " + objet.niveau);
	if (objet.equip) {
		afficher(" (" + Jeu.equipement[objet.equip_slot] + ")");
	}
	afficher(" : ");
	fonction("Retirer","banque_retirer(" + objet_slot + ",1," + pnj_id + "," + dialogue_id + ")");
	saut(1);
	objet.effet();
	saut(2);
	afficher("<i>");
    objet.description();
    afficher("</i>");
	actualiser();
}

function banque_retirer (objet_id,nombre,pnj_id,dialogue_id) {
	objet_ajouter(Jeu.banque.inventaire[objet_id].id,Jeu.banque.inventaire[objet_id].niveau,nombre);
	banque_enlever(objet_id,nombre);
	banque_choisir_retirer(pnj_id,dialogue_id);
}

function banque_ajouter (objet_id,niveau,nombre) {
	let verifier = banque_verifier(objet_id,niveau);
    if (verifier !== false) {
        Jeu.banque.inventaire[verifier].nombre += nombre;
    }
    else {
        Jeu.banque.inventaire.push(obtenir_objet(objet_id,niveau,nombre));
    }
}

function banque_enlever (objet_slot,nombre) {
    Jeu.banque.inventaire[objet_slot].nombre -= nombre;
    if (Jeu.banque.inventaire[objet_slot].nombre < 1) {
        Jeu.banque.inventaire.splice(objet_slot,1);
    }
}

function banque_verifier (objet_id,niveau) {
    for (let n=0;n<Jeu.banque.inventaire.length;n++) {
        if (Jeu.banque.inventaire[n].id == objet_id && Jeu.banque.inventaire[n].niveau == niveau) {
            return n;
        }
    }
    return false;
}