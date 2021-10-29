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
    or : 0,
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
        "attaque",
        "defense",
        "vitesse",
        "action_max",
    ],
    combat : {
        liste : [],
        resultat : "",
    }
}

function nouvelle_zone (nom) {
    let zone = {
        nom : nom,
        batiments : [],
    }
    return zone;
}

function nouveau_batiment (nom) {
    let batiment = {
        nom : nom,
        pieces : [],
    }
    return batiment;
}

function nouvelle_piece (nom) {
    let piece = {
        nom : nom,
        deplacements : [],
        pnjs : [],
        monstres : [],
    }
    return piece;
}

function nouveau_deplacement (zone,batiment,piece) {
    let deplacement = {
        zone : zone,
        batiment : batiment,
        piece : piece,
        nom () {
            if (this.batiment == 0) {
                return Jeu.zones[this.zone].nom;
            }
            else if (this.batiment == Jeu.emplacement.batiment) {
                return Jeu.zones[this.zone].batiments[this.batiment].pieces[this.piece].nom;
            }
            else {
                return Jeu.zones[this.zone].batiments[this.batiment].nom;
            }
        },
    }
    return deplacement;
}

function nouveau_pnj (nom) {
    let pnj = {
        nom : nom,
        dialogues : [],
    }
    return pnj;
}

let zone;
let batiment;
let piece;
let pnj;
let dialogue;

//zone 0
zone = nouvelle_zone("Chérubelle");
    batiment = nouveau_batiment("");
        piece = nouvelle_piece("");
            piece.deplacements.push(nouveau_deplacement(1,0,0));
            piece.deplacements.push(nouveau_deplacement(0,1,0));
            piece.deplacements.push(nouveau_deplacement(0,2,0));
            piece.deplacements.push(nouveau_deplacement(0,3,0));
            piece.deplacements.push(nouveau_deplacement(0,4,0));
            piece.deplacements.push(nouveau_deplacement(0,5,0));
            piece.deplacements.push(nouveau_deplacement(0,6,0));
            piece.deplacements.push(nouveau_deplacement(0,7,0));
			piece.deplacements.push(nouveau_deplacement(0,8,0));
        batiment.pieces.push(piece);
    zone.batiments.push(batiment);
    batiment = nouveau_batiment("Maison");
        piece = nouvelle_piece("Entrée");
            piece.deplacements.push(nouveau_deplacement(0,0,0));
            piece.deplacements.push(nouveau_deplacement(0,1,1));
        batiment.pieces.push(piece);
        piece = nouvelle_piece("Etage");
            piece.deplacements.push(nouveau_deplacement(0,1,0));
            piece.deplacements.push(nouveau_deplacement(0,1,2));
        batiment.pieces.push(piece);
        piece = nouvelle_piece("Chambre");
            piece.deplacements.push(nouveau_deplacement(0,1,1));
        batiment.pieces.push(piece);
    zone.batiments.push(batiment);
    batiment = nouveau_batiment("Maison du maire");
        piece = nouvelle_piece("Entrée");
            piece.deplacements.push(nouveau_deplacement(0,0,0));
            piece.deplacements.push(nouveau_deplacement(0,2,1));
            piece.deplacements.push(nouveau_deplacement(0,2,2));
        batiment.pieces.push(piece);
        piece = nouvelle_piece("Salon");
            pnj = nouveau_pnj("Maire");
                dialogue = function () {
                    afficher("Bonjour.");
                    saut(2);
                    fonction("Au revoir","menu()");
                }
                pnj.dialogues.push(dialogue);
            piece.pnjs.push(pnj);
            piece.deplacements.push(nouveau_deplacement(0,2,0));
        batiment.pieces.push(piece);
        piece = nouvelle_piece("Etage");
            piece.deplacements.push(nouveau_deplacement(0,2,0));
            piece.deplacements.push(nouveau_deplacement(0,2,3));
        batiment.pieces.push(piece);
        piece = nouvelle_piece("Chambre");
            piece.deplacements.push(nouveau_deplacement(0,2,2));
        batiment.pieces.push(piece);
    zone.batiments.push(batiment);
    batiment = nouveau_batiment("Eglise");
        piece = nouvelle_piece("Hall");
            piece.deplacements.push(nouveau_deplacement(0,0,0));
            piece.deplacements.push(nouveau_deplacement(0,3,1));
        batiment.pieces.push(piece);
        piece = nouvelle_piece("Autel");
            pnj = nouveau_pnj("Prêtre");
                dialogue = function () {
                    afficher("Bonjour.");
                    saut(2);
                    fonction("J'aurais besoin de ressuciter un allié","parler(0,2)");
                    saut(1);
                    fonction("Prier","checkpoint(0,3,1);parler(0,1)");
                    saut(1);
                    fonction("Au revoir","menu()");
                }
                pnj.dialogues.push(dialogue);
                dialogue = function () {
                    afficher("Puisse le seigneur vous bénir.");
                    saut(2);
                    fonction("Merci","parler(0,0)");
                }
                pnj.dialogues.push(dialogue);
                dialogue = function () {
                    afficher("Mon dieu ! Qui puis-je aider à revenir parmis nous ? En échange bien sûr d'une petite rémuneration.");
                    saut(2);
                    for (let n=0;n<Jeu.equipe.length;n++) {
                        if (Jeu.equipe[n].mort) {
                            fonction(Jeu.equipe[n].nom,"if (Jeu.or >= 10) {Jeu.or -= 10;Jeu.equipe[" + n + "].statistiques.vie = 1;Jeu.equipe[" + n + "].mort = false;parler(0,2)}");
                            saut(1);
                        }
                    }
                    fonction("Merci","parler(0,0)");
                }
                pnj.dialogues.push(dialogue);
            piece.pnjs.push(pnj);
            piece.deplacements.push(nouveau_deplacement(0,3,0));
        batiment.pieces.push(piece);
    zone.batiments.push(batiment);
    batiment = nouveau_batiment("Marchand");
        piece = nouvelle_piece("Comptoir");
            pnj = nouveau_pnj("Marchand");
                dialogue = function () {
                    afficher("Bonjour.");
                    saut(2);
                    fonction("Je voudrais acheter quelque chose","parler(0,1)");
                    saut(1);
                    fonction("Je voudrais vendre quelque chose","parler(0,2)");
                    saut(1);
                    fonction("Au revoir","menu()");
                }
                pnj.dialogues.push(dialogue);
                dialogue = function (pnj_id,dialogue_id) {
                    afficher("Voilà ce que je peux vous proposer.");
                    saut(2);
                    afficher("Vous avez " + Jeu.or + " or");
                    saut(2);
                    achat(1,pnj_id,dialogue_id);
                    achat(2,pnj_id,dialogue_id);
                    achat(3,pnj_id,dialogue_id);
                    achat(4,pnj_id,dialogue_id);
                    achat(5,pnj_id,dialogue_id);
                    achat(6,pnj_id,dialogue_id);
                    achat(7,pnj_id,dialogue_id);
                    achat(8,pnj_id,dialogue_id);
                    achat(9,pnj_id,dialogue_id);
                    achat(11,pnj_id,dialogue_id);
                    achat(12,pnj_id,dialogue_id);
                    achat(13,pnj_id,dialogue_id);
                    saut(1);
                    fonction("Merci","parler(0,0)");
                }
                pnj.dialogues.push(dialogue);
                dialogue = function (pnj_id,dialogue_id) {
                    if (Jeu.inventaire.length > 0) {
                        afficher("Que voulez-vous vendre ?");
                        saut(2);
                        afficher("Vous avez " + Jeu.or + " or");
                        saut(2);
                        for (let n=0;n<Jeu.inventaire.length;n++) {
                            afficher("<b>" + Jeu.inventaire[n].nom + "</b> : " + Jeu.inventaire[n].effet + " " + Jeu.inventaire[n].description + " (Vous en avez " + Jeu.inventaire[n].nombre + "), ");
                            fonction("Vendre","vendre(" + n + "," + pnj_id + "," + dialogue_id + ")");
                            afficher(" pour " + Jeu.inventaire[n].valeur + " or");
                            saut(1);
                        }
                        saut(1);   
                    }
                    else {
                        afficher("Je suis désolé mais vous n'avez rien à vendre.");
                        saut(2);
                    }
                    fonction("Merci","parler(0,0)");
                }
                pnj.dialogues.push(dialogue);
            piece.pnjs.push(pnj);
            piece.deplacements.push(nouveau_deplacement(0,0,0));
        batiment.pieces.push(piece);
    zone.batiments.push(batiment);
    batiment = nouveau_batiment("Etable");
        piece = nouvelle_piece("Grange");
            pnj = nouveau_pnj("Fermier");
                dialogue = function () {
                    afficher("Bonjour.");
                    saut(2);
                    fonction("Au revoir","menu()");
                }
                pnj.dialogues.push(dialogue);
            piece.pnjs.push(pnj);
            piece.deplacements.push(nouveau_deplacement(0,0,0));
        batiment.pieces.push(piece);
    zone.batiments.push(batiment);
    batiment = nouveau_batiment("Auberge");
        piece = nouvelle_piece("Comptoir");
            pnj = nouveau_pnj("Aubergiste");
                dialogue = function () {
                    afficher("Bonjour.");
                    saut(2);
                    fonction("Je voudrais une chambre pour la nuit","parler(0,1)");
                    saut(1);
                    fonction("Au revoir","menu()");
                }
                pnj.dialogues.push(dialogue);
                dialogue = function () {
                    afficher("Très bien. Cela vous coutera " + Jeu.equipe.length*15 + " or.");
                    saut(2);
                    afficher("Vous avez " + Jeu.or + " or");
                    saut(2);
                    fonction("D'accord","if (Jeu.or >= " + Jeu.equipe.length*15 + ") {Jeu.or -= " + Jeu.equipe.length*15 + ";dormir()}");
                    saut(1);
                    fonction("Finalement non","parler(0,0)");
                }
                pnj.dialogues.push(dialogue);
            piece.pnjs.push(pnj);
            piece.deplacements.push(nouveau_deplacement(0,0,0));
        batiment.pieces.push(piece);
    zone.batiments.push(batiment);
    batiment = nouveau_batiment("Taverne");
        piece = nouvelle_piece("Tables");
            piece.deplacements.push(nouveau_deplacement(0,0,0));
            piece.deplacements.push(nouveau_deplacement(0,7,1));
        batiment.pieces.push(piece);
        piece = nouvelle_piece("Comptoir");
            piece.deplacements.push(nouveau_deplacement(0,7,0));
            pnj = nouveau_pnj("Tavernier");
                dialogue = function () {
                    afficher("Bonjour.");
                    saut(2);
					fonction("J'aimerai voir mes compagnons","liste_personnage(0,0)");
					saut(1);
					fonction("J'aimerai recruter un compagnon","creer_personnage(0,0)");
					saut(1);
                    fonction("Au revoir","menu()");
                }
                pnj.dialogues.push(dialogue);
            piece.pnjs.push(pnj);
        batiment.pieces.push(piece);
    zone.batiments.push(batiment);
	batiment = nouveau_batiment("Banque");
        piece = nouvelle_piece("Hall");
            piece.deplacements.push(nouveau_deplacement(0,0,0));
            pnj = nouveau_pnj("Banquier");
                dialogue = function () {
                    afficher("Bonjour.");
                    saut(2);
					fonction("J'aimerai voir mes comptes","banque_or(0,0)");
					saut(1);
					fonction("J'aimerai voir mes objets stockés","banque(0,0)");
					saut(1);
                    fonction("Au revoir","menu()");
                }
                pnj.dialogues.push(dialogue);
            piece.pnjs.push(pnj);
        batiment.pieces.push(piece);
    zone.batiments.push(batiment);
Jeu.zones.push(zone);

//zone 1
zone = nouvelle_zone("Plaine");
    batiment = nouveau_batiment("");
        piece = nouvelle_piece("");
            piece.deplacements.push(nouveau_deplacement(0,0,0));
            piece.monstres.push([1]);
			piece.monstres.push([1,1]);
        batiment.pieces.push(piece);
    zone.batiments.push(batiment);
Jeu.zones.push(zone);

function obtenir_objet (objet_id,nombre) {
    let objet = {
        id : objet_id,
        nom : "",
        effet : "",
        description : function () {},
        equip : false,
        equip_slot : 0,
        statistiques : {
            vie_max : 0,
            mana_max : 0,
            attaque : 0,
            defense : 0,
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
            objet.effet = "Soigne 30 pv.";
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
            objet.effet = "+10 attaque";
            objet.description = function () {
                afficher("Une simple épée.");
            }
            objet.equip = true;
            objet.statistiques.attaque = 10;
            break;
        case 3:
            objet.nom = "Bouclier";
            objet.effet = "+5 defense";
            objet.description = function () {
                afficher("Un simple bouclier.");
            }
            objet.equip = true;
            objet.equip_slot = 1;
            objet.statistiques.defense = 5;
            break;
        case 4:
            objet.nom = "Casque";
            objet.effet = "+20 vie";
            objet.description = function () {
                afficher("Un simple casque.");
            }
            objet.equip = true;
            objet.equip_slot = 2;
            objet.statistiques.vie_max = 20;
            break;
        case 5:
            objet.nom = "Plastron";
            objet.effet = "+20 vie";
            objet.description = function () {
                afficher("Un simple plastron.");
            }
            objet.equip = true;
            objet.equip_slot = 3;
            objet.statistiques.vie_max = 20;
            break;
        case 6:
            objet.nom = "Gantelets";
            objet.effet = "+20 vie";
            objet.description = function () {
                afficher("De simples gantelets.");
            }
            objet.equip = true;
            objet.equip_slot = 4;
            objet.statistiques.vie_max = 20;
            break;
        case 7:
            objet.nom = "Jambières";
            objet.effet = "+20 vie";
            objet.description = function () {
                afficher("De simples jambières.");
            }
            objet.equip = true;
            objet.equip_slot = 5;
            objet.statistiques.vie_max = 20;
            break;
        case 8:
            objet.nom = "Solerets";
            objet.effet = "+20 vie";
            objet.description = function () {
                afficher("De simples solerets.");
            }
            objet.equip = true;
            objet.equip_slot = 6;
            objet.statistiques.vie_max = 20;
            break;
        case 9:
            objet.nom = "Anneau";
            objet.effet = "+5 defense";
            objet.description = function () {
                afficher("Un simple anneau.");
            }
            objet.equip = true;
            objet.equip_slot = 7;
            objet.statistiques.defense = 5;
            break;
        case 10:
            objet.nom = "Peau";
            objet.description = function () {
                afficher("Une simple peau.");
            }
            break;
        case 11:
            objet.nom = "Parchemin " + obtenir_sort(1).nom;
            objet.description = function () {
                afficher("Un parchemin apprenant le sort " + obtenir_sort(1).nom + " : ");
                obtenir_sort(1,Jeu.equipe[0]).description(false);
            }
            objet.be_use = true;
            objet.use = parchemin(1);
            break;
        case 12:
            objet.nom = "Parchemin " + obtenir_sort(2).nom;
            objet.description = function () {
                afficher("Un parchemin apprenant le sort " + obtenir_sort(2).nom + " : ");
                obtenir_sort(2).description(false);
            }
            objet.be_use = true;
            objet.use = parchemin(2);
            break;
        case 13:
            objet.nom = "Parchemin " + obtenir_sort(3).nom;
            objet.description = function () {
                afficher("Un parchemin apprenant le sort " + obtenir_sort(3).nom + " : ");
                obtenir_sort(3).description(false);
            }
            objet.be_use = true;
            objet.use = parchemin(3);
            break;
    }   
    return objet;
}

function parchemin (sort_id) {
    let use_parchemin = function (objet_slot,step,joueur_id,sort_slot) {
        switch (step) {
            case 1:
                initialiser();
                fonction("Retour","voir_objet(" + objet_slot + ")");
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

function obtenir_monstre (monstre_id) {
    let monstre = {
        nom : "",
        ennemi : true,
        mort : false,
        statistiques : {
            vie : 100,
            vie_max : 100,
            mana : 100,
            mana_max : 100,
            attaque : 25,
            defense : 0,
            vitesse : 40,
            atb : 0,
            action : 6,
            action_max : 6,
        },
        or : 0,
        xp : 1,
        loots : [],
        tour : function () {
            if (this.statistiques.action >= 3) {
                this.statistiques.action -= 3;
                let cible;
                let cible_set = false;
                for (let n=0;n<Jeu.combat.liste.length;n++) {
                    if (!Jeu.combat.liste[n].ennemi && !Jeu.combat.liste[n].mort) {
                        if (cible_set) {
                            if (Jeu.combat.liste[cible].statistiques.vie > Jeu.combat.liste[n].statistiques.vie) {
                                cible = n;
                            }
                        }
                        else {
                            cible = n;
                            cible_set = true;
                        }
                    }
                }
                let degats = this.statistiques.attaque - Jeu.combat.liste[cible].statistiques.defense;
                if (degats <= 0) {
                    degats = 1;
                }
                Jeu.combat.liste[cible].statistiques.vie -= degats;
                Jeu.combat.resultat = this.nom + " attaque et inflige " + degats + " dégats à " + Jeu.combat.liste[cible].nom;
                if (Jeu.combat.liste[cible].statistiques.vie <= 0) {
                    mort(cible);
                }
                resultat_combat();
            }
            else {
                continuer_combat();
            }
        },
    }
    switch (monstre_id) {
        case 1:
            monstre.nom = "Loup";
            monstre.loots.push(nouveau_loot(10,50));
            break;
    }
    return monstre;
}

function nouveau_loot (id,taux) {
    let loot = {
        id: id,
        taux : taux,
    }
    return loot;
}

function obtenir_sort (sort_id,personnage) {
    let sort = {
        nom : "",
        id : sort_id,
        description : function () {
            afficher("");
        },
        condition : function () {
            return true;
        },
        use : function () {
            afficher("");
        },
    }
    switch (sort_id) {
        case 1:
            sort.nom = "Attaque";
            sort.description = function (character=true) {
                afficher("Inflige ");
                if (character) {
                    afficher(personnage.statistiques.attaque + " ");
                }
                afficher("(100% de votre attaque) dégats physiques à une cible. Coûte 2 actions.");
            }
            sort.condition = function () {
                if (personnage.statistiques.action >= 2) {
                    return true;
                }
                return false;
            }
            sort.use = function (spell,step=1,cible=undefined) {
                switch (step) {
                    case 1:
                        initialiser();
                        afficher("Adversaires :");
                        saut(1);
                        for (let n=0;n<Jeu.combat.liste.length;n++) {
                            if (Jeu.combat.liste[n].ennemi) {
                                if (Jeu.combat.liste[n].mort) {
                                    afficher(Jeu.combat.liste[n].nom + " <i>mort</i>");
                                }
                                else {
                                    fonction(Jeu.combat.liste[n].nom,"Jeu.combat.liste[0].sorts[" + spell + "].use(" + spell + ",2," + n + ")");
                                }
                                saut(1);
                            }
                        }
                        saut(1);
                        fonction("Retour","choix_combat()");
                        actualiser();
                        break;
                    case 2:
                        personnage.statistiques.action -= 2;
                        let degats = personnage.statistiques.attaque - Jeu.combat.liste[cible].statistiques.defense;
                        if (degats <= 0) {
                            degats = 1;
                        }
                        Jeu.combat.liste[cible].statistiques.vie -= degats;
                        Jeu.combat.resultat = personnage.nom + " attaque et inflige " + degats + " dégats à " + Jeu.combat.liste[cible].nom;
                        if (Jeu.combat.liste[cible].statistiques.vie <= 0) {
                            Jeu.combat.liste[cible].mort = true;
                        }
                        resultat_combat();
                        break;
                }
            }
            break;
        case 2:
            sort.nom = "Attaque chargée";
            sort.description = function (character = true) {
                afficher("Inflige ");
                if (character) {
                    afficher(personnage.statistiques.attaque*2 + " ");
                }
                afficher(" (200% de votre attaque) dégats physiques à une cible. Coûte 3 actions et 10 mana.");
            }
            sort.condition = function () {
                if (personnage.statistiques.action >= 3 && personnage.statistiques.mana >= 10) {
                    return true;
                }
                return false;
            }
            sort.use = function (spell,step=1,cible=undefined) {
                switch (step) {
                    case 1:
                        initialiser();
                        afficher("Adversaires :");
                        saut(1);
                        for (let n=0;n<Jeu.combat.liste.length;n++) {
                            if (Jeu.combat.liste[n].ennemi) {
                                if (Jeu.combat.liste[n].mort) {
                                    afficher(Jeu.combat.liste[n].nom + " <i>mort</i>");
                                }
                                else {
                                    fonction(Jeu.combat.liste[n].nom,"Jeu.combat.liste[0].sorts[" + spell + "].use(" + spell + ",2," + n + ")");
                                }
                                saut(1);
                            }
                        }
                        saut(1);
                        fonction("Retour","choix_combat()");
                        actualiser();
                        break;
                    case 2:
                        personnage.statistiques.action -= 3;
                        personnage.statistiques.mana -= 10;
                        let degats = personnage.statistiques.attaque*2 - Jeu.combat.liste[cible].statistiques.defense;
                        if (degats <= 0) {
                            degats = 1;
                        }
                        Jeu.combat.liste[cible].statistiques.vie -= degats;
                        Jeu.combat.resultat = personnage.nom + " attaque et inflige " + degats + " dégats à " + Jeu.combat.liste[cible].nom;
                        if (Jeu.combat.liste[cible].statistiques.vie <= 0) {
                            Jeu.combat.liste[cible].mort = true;
                        }
                        resultat_combat();
                        break;
                }
            }
            break;
        case 3:
            sort.nom = "Soin";
            sort.description = function () {
                afficher("Soigne 100 vie à une cible alliée. Coûte 3 actions et 10 mana.");
            }
            sort.condition = function () {
                if (personnage.statistiques.action >= 3 && personnage.statistiques.mana >= 10) {
                    return true;
                }
                return false;
            }
            sort.use = function (spell,step=1,cible=undefined) {
                switch (step) {
                    case 1:
                        initialiser();
                        afficher("Adversaires :");
                        saut(1);
                        for (let n=0;n<Jeu.combat.liste.length;n++) {
                            if (!Jeu.combat.liste[n].ennemi) {
                                if (Jeu.combat.liste[n].mort) {
                                    afficher(Jeu.combat.liste[n].nom + " <i>mort</i>");
                                }
                                else {
                                    fonction(Jeu.combat.liste[n].nom,"Jeu.combat.liste[0].sorts[" + spell + "].use(" + spell + ",2," + n + ")");
                                    afficher(" : " + Jeu.combat.liste[n].statistiques.vie + " / " + Jeu.combat.liste[n].statistiques.vie_max + " vie");
                                }
                                saut(1);
                            }
                        }
                        saut(1);
                        fonction("Retour","choix_combat()");
                        actualiser();
                        break;
                    case 2:
                        personnage.statistiques.action -= 3;
                        personnage.statistiques.mana -= 10;
                        Jeu.combat.liste[cible].statistiques.vie += 100;
                        if (Jeu.combat.liste[cible].statistiques.vie > Jeu.combat.liste[cible].statistiques.vie_max) {
                            Jeu.combat.liste[cible].statistiques.vie = Jeu.combat.liste[cible].statistiques.vie_max;
                        }
                        if (cible == 0) {
                            Jeu.combat.resultat = personnage.nom + " soigne 100 vie à " + Jeu.combat.liste[cible].nom;
                        }
                        resultat_combat();
                        break;
                }
            }
            break;
    }
    return sort;
}