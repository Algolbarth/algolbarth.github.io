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
        "attaque",
        "defense",
        "vitesse",
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
                    fonction("Au revoir","menu()");
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
                            afficher(Jeu.inventaire[n].nom + " : " + Jeu.inventaire[n].description + " (Vous en avez " + Jeu.inventaire[n].nombre + "), ");
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
                    fonction("Au revoir","menu()");
                }
                pnj.dialogues.push(dialogue);
            piece.pnjs.push(pnj);
            piece.deplacements.push(nouveau_deplacement(0,0,0));
        batiment.pieces.push(piece);
    zone.batiments.push(batiment);
Jeu.zones.push(zone);

//zone 1
zone = nouvelle_zone("Plaine");
    batiment = nouveau_batiment("");
        piece = nouvelle_piece("");
            piece.deplacements.push(nouveau_deplacement(0,0,0));
            piece.monstres.push(1);
        batiment.pieces.push(piece);
    zone.batiments.push(batiment);
Jeu.zones.push(zone);

function obtenir_objet (objet_id,nombre) {
    let objet = {
        id : objet_id,
        nom : "",
        description : "",
        equip : false,
        equip_slot : 0,
        statistiques : {
            vie_max : 0,
            attaque : 0,
            defense : 0,
            vitesse : 0,
        },
        be_use : false,
        use : function () {

        },
        valeur : 10,
        nombre : nombre,
    }
    switch (objet_id) {
        case 1:
            objet.nom = "Herbe";
            objet.description = "Une herbe médicinale soignant celui qui la mange";
            objet.be_use = true;
            objet.use = function (objet_slot,step,joueur_id) {
                switch (step) {
                    case 1:
                        initialiser();
                        fonction("Retour","inventaire()");
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
            objet.description = "Une simple épée";
            objet.equip = true;
            objet.statistiques.attaque = 10;
            break;
        case 3:
            objet.nom = "Bouclier";
            objet.description = "Un simple bouclier";
            objet.equip = true;
            objet.equip_slot = 1;
            objet.statistiques.defense = 10;
            break;
        case 4:
            objet.nom = "Casque";
            objet.description = "Un simple casque";
            objet.equip = true;
            objet.equip_slot = 2;
            objet.statistiques.vie_max = 20;
            break;
        case 5:
            objet.nom = "Plastron";
            objet.description = "Un simple plastron";
            objet.equip = true;
            objet.equip_slot = 3;
            objet.statistiques.vie_max = 20;
            break;
        case 6:
            objet.nom = "Gantelets";
            objet.description = "De simples gantelets";
            objet.equip = true;
            objet.equip_slot = 4;
            objet.statistiques.vie_max = 20;
            break;
        case 7:
            objet.nom = "Jambières";
            objet.description = "De simples jambières";
            objet.equip = true;
            objet.equip_slot = 5;
            objet.statistiques.vie_max = 20;
            break;
        case 8:
            objet.nom = "Solerets";
            objet.description = "De simples solerets";
            objet.equip = true;
            objet.equip_slot = 6;
            objet.statistiques.vie_max = 20;
            break;
        case 9:
            objet.nom = "Anneau";
            objet.description = "Un simple anneau";
            objet.equip = true;
            objet.equip_slot = 7;
            objet.statistiques.defense = 10;
            break;
        case 10:
            objet.nom = "Peau";
            objet.description = "Une simple peau";
            break;
    }   
    return objet;
}

function obtenir_monstre (monstre_id) {
    let monstre = {
        nom : "",
        ennemi : true,
        mort : false,
        statistiques : {
            vie : 100,
            vie_max : 100,
            attaque : 35,
            defense : 0,
            vitesse : 40,
            atb : 0,
        },
        or : 0,
        loots : [],
        tour : function () {
            n = 0;
            while (Jeu.combat.liste[n].ennemi) {
                n++;
            }
            let degats = this.statistiques.attaque - Jeu.combat.liste[n].statistiques.defense;
            if (degats <= 0) {
                degats = 1;
            }
            Jeu.combat.liste[n].statistiques.vie -= degats;
            Jeu.combat.resultat = this.nom + " attaque et inflige " + degats + " dégats";
            if (Jeu.combat.liste[n].statistiques.vie <= 0) {
                Jeu.combat.liste[n].mort = true;
            }
        },
    }
    switch (monstre_id) {
        case 1:
            monstre.nom = "Loup";
            monstre.loots.push(nouveau_loot(10,100));
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