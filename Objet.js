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
    afficher(" :");
    if (objet.be_use) {
        afficher(" ");
        fonction("Utiliser","Jeu.inventaire[" + objet_slot + "].use(" + objet_slot + ",1)");
    }
    if (objet.equip) {
        afficher(" ");
        fonction("Equiper","choisir_equiper(" + objet_slot + ")");
    }
    saut(1);
    objet.effet();
    saut(2);
    afficher("<i>");
    objet.description();
    afficher("</i>");
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
    afficher(" : ");
    fonction("Acheter","acheter(" + objet_id + "," + pnj_id + "," + dialogue_id + ")");
    afficher(" pour " + objet.valeur + " or");
    saut(1);
    objet.effet();
    saut(2);
    afficher("<i>");
    objet.description();
    afficher("</i>");
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
    afficher("<b>" + Jeu.inventaire[objet_id].nom + "</b>");
    saut(1);
    Jeu.inventaire[objet_id].effet();
    saut(2);
    for (let n=0;n<Jeu.equipe.length;n++) {
        afficher(Jeu.equipe[n].nom + " : <b>" + Jeu.equipe[n].equipement[Jeu.inventaire[objet_id].equip_slot].nom + "</b>, ");
        fonction("Equiper","equiper(" + objet_id + "," + n + ")");
        saut(1);
        if (Jeu.equipe[n].equipement[Jeu.inventaire[objet_id].equip_slot].id > 0) {
            Jeu.equipe[n].equipement[Jeu.inventaire[objet_id].equip_slot].effet();
            saut(1);
        }
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

function objet_stat (objet) {
    let first_stat = true;
    for (let n=0;n<Jeu.statistiques.length;n++) {
        let stat = objet.statistiques[Jeu.statistiques[n]];
        if (stat > 0) {
            if (first_stat) {
                first_stat = false;
            }
            else {
                saut(1);
            }
            afficher("+" + stat + " " + Jeu.statistiques_nom[n]);
        }
    }
}

function parchemin_effet (sort_id) {
    let temp = function () {
        afficher("Un parchemin apprenant le sort " + obtenir_sort(sort_id).nom + ".");
    }
    return temp;
}

function parchemin_description (sort_id) {
    let temp = function () {
        obtenir_sort(sort_id).description(false);
    }
    return temp;
}

function parchemin_use (sort_id) {
    let use_parchemin = function (objet_slot,step,joueur_id,sort_slot) {
        switch (step) {
            case 1:
                initialiser();
                fonction("Retour","objet_voir(" + objet_slot + ")");
                saut(2);
                afficher("<b>" + obtenir_sort(sort_id).nom + "</b> : ");
                obtenir_sort(sort_id,Jeu.equipe[0]).description(false);
                saut(2);
                for (let n=0;n<Jeu.equipe.length;n++) {
                    afficher(Jeu.equipe[n].nom + " : ");
                    if (!verifier_sort(sort_id,Jeu.equipe[n])) {
                        fonction("Apprendre","Jeu.inventaire[" + objet_slot + "].use(" + objet_slot + ",2," + n + ")");
                    }
                    else {
                        afficher("<i>Déjà appris</i>");
                    }
                    saut(1);
                }
                actualiser();
                break;
            case 2:
                initialiser();
                fonction("Retour","Jeu.inventaire[" + objet_slot + "].use(" + objet_slot + ",1)");
                saut(2);
                afficher(Jeu.equipe[joueur_id].nom);
                saut(1);
                for (let n=0;n<Jeu.equipe[joueur_id].sorts.length;n++) {
                    afficher("<b>" + Jeu.equipe[joueur_id].sorts[n].nom + "</b> : ");
                    Jeu.equipe[joueur_id].sorts[n].description();
                    afficher(" ");
                    fonction("Remplacer","Jeu.inventaire[" + objet_slot + "].use(" + objet_slot + ",3," + joueur_id + "," + n + ")");
                    saut(1);
                }
                actualiser();
                break;
            case 3:
                Jeu.equipe[joueur_id].sorts[sort_slot] = obtenir_sort(sort_id,Jeu.equipe[joueur_id]);
                objet_enlever(objet_slot,1);
                inventaire();
                break;
        }
    }
    return use_parchemin;
}

function obtenir_objet (objet_id,nombre) {
    let objet = {
        id : objet_id,
        nom : "",
        effet : function () {},
        description : function () {},
        equip : false,
        equip_slot : 0,
        statistiques : {
            vie_max : 0,
            mana_max : 0,
            attaque_mel : 0,
            defense_mel : 0,
            attaque_dis : 0,
            defense_dis : 0,
            attaque_mag : 0,
            defense_mag : 0,
            force : 0,
            agilite : 0,
            intelligence : 0,
            vitesse : 0,
            action_max : 0,
        },
        be_use : false,
        use : function () {},
        valeur : 10,
        nombre : nombre,
    }
    switch (objet_id) {
        case 1:
            objet.nom = "Herbe";
            objet.effet = function () {
                afficher("Soigne 30 pv.");
            }
            objet.description = function () {
                afficher("Une herbe médicinale soignant celui qui la mange.");
            }
            objet.be_use = true;
            objet.use = function (objet_slot,step,joueur_id) {
                switch (step) {
                    case 1:
                        initialiser();
                        fonction("Retour","objet_voir(" + objet_slot + ")");
                        saut(2);
                        for (let n=0;n<Jeu.equipe.length;n++) {
                            afficher(Jeu.equipe[n].nom + " : " + Jeu.equipe[n].statistiques.vie + " / " + Jeu.equipe[n].statistiques.vie_max + ", ");
                            fonction("Utiliser","Jeu.inventaire[" + objet_slot + "].use(" + objet_slot + ",2," + n + ")");
                            saut(1);
                        }
                        actualiser();
                        break;
                    case 2:
                        soin(30,joueur_id);
                        objet_enlever(objet_slot,1);
                        inventaire();
                        break;
                }
            }
            break;
        case 2:
            objet.nom = "Epée";
            objet.description = function () {
                afficher("Une simple épée.");
            }
            objet.equip = true;
            objet.statistiques.attaque_mel = 10;
            objet.statistiques.force = 5;
            objet.effet = function () {
                objet_stat(objet);
            }
            break;
        case 3:
            objet.nom = "Bouclier";
            objet.description = function () {
                afficher("Un simple bouclier.");
            }
            objet.equip = true;
            objet.equip_slot = 1;
            objet.statistiques.defense_mel = 5;
            objet.statistiques.defense_dis = 5;
            objet.statistiques.defense_mag = 5;
            objet.effet = function () {
                objet_stat(objet);
            }
            break;
        case 4:
            objet.nom = "Casque en fer";
            objet.description = function () {
                afficher("Un simple casque.");
            }
            objet.equip = true;
            objet.equip_slot = 2;
            objet.statistiques.vie_max = 20;
            objet.statistiques.force = 5;
            objet.effet = function () {
                objet_stat(objet);
            }
            break;
        case 5:
            objet.nom = "Plastron en fer";
            objet.description = function () {
                afficher("Un simple plastron.");
            }
            objet.equip = true;
            objet.equip_slot = 3;
            objet.statistiques.vie_max = 20;
            objet.statistiques.force = 5;
            objet.effet = function () {
                objet_stat(objet);
            }
            break;
        case 6:
            objet.nom = "Gantelets en fer";
            objet.description = function () {
                afficher("De simples gantelets.");
            }
            objet.equip = true;
            objet.equip_slot = 4;
            objet.statistiques.vie_max = 20;
            objet.statistiques.force = 5;
            objet.effet = function () {
                objet_stat(objet);
            }
            break;
        case 7:
            objet.nom = "Jambières en fer";
            objet.description = function () {
                afficher("De simples jambières.");
            }
            objet.equip = true;
            objet.equip_slot = 5;
            objet.statistiques.vie_max = 20;
            objet.statistiques.force = 5;
            objet.effet = function () {
                objet_stat(objet);
            }
            break;
        case 8:
            objet.nom = "Solerets en fer";
            objet.description = function () {
                afficher("De simples solerets.");
            }
            objet.equip = true;
            objet.equip_slot = 6;
            objet.statistiques.vie_max = 20;
            objet.statistiques.force = 5;
            objet.effet = function () {
                objet_stat(objet);
            }
            break;
        case 9:
            objet.nom = "Anneau";
            objet.description = function () {
                afficher("Un simple anneau.");
            }
            objet.equip = true;
            objet.equip_slot = 7;
            objet.statistiques.force = 5;
            objet.statistiques.agilite = 5;
            objet.statistiques.intelligence = 5;
            objet.effet = function () {
                objet_stat(objet);
            }
            break;
        case 10:
            objet.nom = "Peau";
            objet.description = function () {
                afficher("Une simple peau.");
            }
            break;
        case 11:
            objet.nom = "Parchemin " + obtenir_sort(1).nom;
            objet.effet = parchemin_effet(1);
            objet.description = parchemin_description(1);
            objet.be_use = true;
            objet.use = parchemin_use(1);
            break;
        case 12:
            objet.nom = "Parchemin " + obtenir_sort(2).nom;
            objet.description = parchemin_description(2);
            objet.be_use = true;
            objet.use = parchemin_use(2);
            break;
        case 13:
            objet.nom = "Parchemin " + obtenir_sort(3).nom;
            objet.description = parchemin_description(3);
            objet.be_use = true;
            objet.use = parchemin_use(3);
            break;
        case 14:
            objet.nom = "Parchemin " + obtenir_sort(4).nom;
            objet.description = parchemin_description(4);
            objet.be_use = true;
            objet.use = parchemin_use(4);
            break;
        case 15:
            objet.nom = "Parchemin " + obtenir_sort(5).nom;
            objet.description = parchemin_description(5);
            objet.be_use = true;
            objet.use = parchemin_use(5);
            break;
        case 16:
            objet.nom = "Arc";
            objet.description = function () {
                afficher("Un simple arc.");
            }
            objet.equip = true;
            objet.statistiques.attaque_dis = 10;
            objet.statistiques.agilite = 5;
            objet.effet = function () {
                objet_stat(objet);
            }
            break;
        case 17:
            objet.nom = "Baguette";
            objet.description = function () {
                afficher("Une simple baguette.");
            }
            objet.equip = true;
            objet.statistiques.attaque_mag = 10;
            objet.statistiques.intelligence = 5;
            objet.effet = function () {
                objet_stat(objet);
            }
            break;
    }   
    return objet;
}