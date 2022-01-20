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
        nom : function () {
            let nom = "";
            let step = 0;
            if (Jeu.emplacement.zone != zone) {
                step++;
                nom += Jeu.zones[zone].nom;
            }
            if (Jeu.zones[zone].batiments[batiment].nom != "" && Jeu.emplacement.batiment != batiment && Jeu.emplacement.zone == zone) {
                if (step > 0) {
                    nom += " - ";
                }
                step++;
                nom += Jeu.zones[zone].batiments[batiment].nom;
            }
            if (Jeu.zones[zone].batiments[batiment].pieces[piece].nom != ""  && Jeu.emplacement.batiment == batiment && Jeu.emplacement.zone == zone) {
                if (step > 0) {
                    nom += " - ";
                }
                nom += Jeu.zones[zone].batiments[batiment].pieces[piece].nom;
            }
            return nom;
        }
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

function initialiser_zones () {
    //zone 0
    zone = nouvelle_zone("Chérubelle");
        //batiment 0
        batiment = nouveau_batiment("Extérieur");
            //piece 0
            piece = nouvelle_piece("Entrée");
                piece.deplacements.push(nouveau_deplacement(1,0,0));
                piece.deplacements.push(nouveau_deplacement(0,0,1));
                piece.deplacements.push(nouveau_deplacement(0,0,2));
                piece.deplacements.push(nouveau_deplacement(0,3,0));
                piece.deplacements.push(nouveau_deplacement(0,9,0));
            batiment.pieces.push(piece);
            //piece 1
            piece = nouvelle_piece("Ouest");
                piece.deplacements.push(nouveau_deplacement(0,0,0));
                piece.deplacements.push(nouveau_deplacement(0,2,0));
                piece.deplacements.push(nouveau_deplacement(0,5,0));
                piece.deplacements.push(nouveau_deplacement(0,6,0));
                piece.deplacements.push(nouveau_deplacement(0,7,0));
                piece.deplacements.push(nouveau_deplacement(0,8,0));
            batiment.pieces.push(piece);
            //piece 2
            piece = nouvelle_piece("Abords de la cascade");
                piece.deplacements.push(nouveau_deplacement(0,0,0));
                piece.deplacements.push(nouveau_deplacement(0,0,3));
            batiment.pieces.push(piece);
            //piece 3
            piece = nouvelle_piece("Est");
                piece.deplacements.push(nouveau_deplacement(0,0,2));
                piece.deplacements.push(nouveau_deplacement(0,0,4));
                piece.deplacements.push(nouveau_deplacement(0,1,0));
                piece.deplacements.push(nouveau_deplacement(0,4,0));
                piece.deplacements.push(nouveau_deplacement(0,10,0));
            batiment.pieces.push(piece);
            //piece 4
            piece = nouvelle_piece("Derrière la cascade");
                piece.deplacements.push(nouveau_deplacement(0,0,3));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 1
        batiment = nouveau_batiment("Maison");
            //piece 0
            piece = nouvelle_piece("Entrée");
                piece.deplacements.push(nouveau_deplacement(0,0,0));
                piece.deplacements.push(nouveau_deplacement(0,1,1));
            batiment.pieces.push(piece);
            //piece 1
            piece = nouvelle_piece("Etage");
                piece.deplacements.push(nouveau_deplacement(0,1,0));
                piece.deplacements.push(nouveau_deplacement(0,1,2));
            batiment.pieces.push(piece);
            //piece 2
            piece = nouvelle_piece("Chambre");
                piece.deplacements.push(nouveau_deplacement(0,1,1));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 2
        batiment = nouveau_batiment("Maison du maire");
            //piece 0
            piece = nouvelle_piece("Entrée");
                piece.deplacements.push(nouveau_deplacement(0,0,0));
                piece.deplacements.push(nouveau_deplacement(0,2,1));
                piece.deplacements.push(nouveau_deplacement(0,2,2));
            batiment.pieces.push(piece);
            //piece 1
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
            //piece 2
            piece = nouvelle_piece("Etage");
                piece.deplacements.push(nouveau_deplacement(0,2,0));
                piece.deplacements.push(nouveau_deplacement(0,2,3));
            batiment.pieces.push(piece);
            //piece 3
            piece = nouvelle_piece("Chambre");
                piece.deplacements.push(nouveau_deplacement(0,2,2));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 3
        batiment = nouveau_batiment("Eglise");
            //piece 0
            piece = nouvelle_piece("Hall");
                piece.deplacements.push(nouveau_deplacement(0,0,0));
                piece.deplacements.push(nouveau_deplacement(0,3,1));
            batiment.pieces.push(piece);
            //piece 1
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
                        afficher("Mon dieu ! Qui puis-je aider à revenir parmis nous ? En échange bien sûr d'une petite rémuneration pour aider notre église.");
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
        //batiment 4
        batiment = nouveau_batiment("Magasin");
            //piece 0
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
                        liste_achat([[1,1],[2,1],[16,1],[17,1],[3,1],[4,1],[18,1],[23,1],[5,1],[19,1],[24,1],[6,1],[20,1],[25,1],[7,1],[21,1],[26,1],[8,1],[22,1],[27,1],[9,1],[28,1],[29,1],[11,1],[12,1],[13,1],[14,1],[15,1],[30,1],[31,1],[32,1]],pnj_id,dialogue_id);
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
        //batiment 5
        batiment = nouveau_batiment("Etable");
            //piece 0
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
        //batiment 6
        batiment = nouveau_batiment("Auberge");
            //piece 0
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
        //batiment 7
        batiment = nouveau_batiment("Taverne");
            //piece 0
            piece = nouvelle_piece("Tables");
                piece.deplacements.push(nouveau_deplacement(0,0,0));
                piece.deplacements.push(nouveau_deplacement(0,7,1));
            batiment.pieces.push(piece);
            //piece 1
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
        //batiment 8
        batiment = nouveau_batiment("Banque");
            //piece 0
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
        //batiment 9
        batiment = nouveau_batiment("Moulin");
            //piece 0
            piece = nouvelle_piece("Entrée");
                piece.deplacements.push(nouveau_deplacement(0,0,0));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 10
        batiment = nouveau_batiment("Puit");
            //piece 0
            piece = nouvelle_piece("Intérieur");
                piece.deplacements.push(nouveau_deplacement(0,0,0));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
    Jeu.zones.push(zone);

    //zone 1
    zone = nouvelle_zone("Plaine de Chérubelle");
        batiment = nouveau_batiment("");
            piece = nouvelle_piece("");
                piece.deplacements.push(nouveau_deplacement(4,0,0));
                piece.deplacements.push(nouveau_deplacement(2,0,0));
                piece.deplacements.push(nouveau_deplacement(0,0,0));
                piece.monstres.push([[3,1]]);
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
    Jeu.zones.push(zone);

    //zone 2
    zone = nouvelle_zone("Forêt de Chérubelle");
        batiment = nouveau_batiment("");
            piece = nouvelle_piece("");
                piece.deplacements.push(nouveau_deplacement(3,0,0));
                piece.deplacements.push(nouveau_deplacement(1,0,0));
                piece.monstres.push([[1,1]]);
                piece.monstres.push([[1,1],[1,1]]);
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
    Jeu.zones.push(zone);

    //zone 3
    zone = nouvelle_zone("Hexatère");
        batiment = nouveau_batiment("");
            piece = nouvelle_piece("");
                piece.deplacements.push(nouveau_deplacement(2,0,0));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
    Jeu.zones.push(zone);

    //zone 4
    zone = nouvelle_zone("Route de Chérubelle");
        batiment = nouveau_batiment("");
            piece = nouvelle_piece("");
                piece.deplacements.push(nouveau_deplacement(5,0,0));
                piece.deplacements.push(nouveau_deplacement(1,0,0));
                piece.monstres.push([[2,1]]);
                piece.monstres.push([[2,1],[2,1],[2,1]]);
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
    Jeu.zones.push(zone);

    //zone 5
    zone = nouvelle_zone("Col d'Ablithia");
        batiment = nouveau_batiment("");
            piece = nouvelle_piece("");
                piece.deplacements.push(nouveau_deplacement(6,0,0));
                piece.deplacements.push(nouveau_deplacement(4,0,0));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
    Jeu.zones.push(zone);

    //zone 6
    zone = nouvelle_zone("Plaine d'Ablithia");
        batiment = nouveau_batiment("");
            piece = nouvelle_piece("");
                piece.deplacements.push(nouveau_deplacement(17,0,0));
                piece.deplacements.push(nouveau_deplacement(10,0,0));
                piece.deplacements.push(nouveau_deplacement(9,0,0));
                piece.deplacements.push(nouveau_deplacement(8,0,0));
                piece.deplacements.push(nouveau_deplacement(7,0,0));
                piece.deplacements.push(nouveau_deplacement(5,0,0));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
    Jeu.zones.push(zone);

    //zone 7
    zone = nouvelle_zone("Ablithia");
        //batiment 0
        batiment = nouveau_batiment("Extérieur");
            //piece 0
            piece = nouvelle_piece("Entrée");
                piece.deplacements.push(nouveau_deplacement(6,0,0));
                piece.deplacements.push(nouveau_deplacement(7,0,1));
                piece.deplacements.push(nouveau_deplacement(7,0,2));
                piece.deplacements.push(nouveau_deplacement(7,0,3));
                piece.deplacements.push(nouveau_deplacement(7,1,0));
                piece.deplacements.push(nouveau_deplacement(7,13,0));
                piece.deplacements.push(nouveau_deplacement(7,14,0));
            batiment.pieces.push(piece);
            //piece 1
            piece = nouvelle_piece("Centre-ville");
                piece.deplacements.push(nouveau_deplacement(7,0,0));
                piece.deplacements.push(nouveau_deplacement(7,0,2));
                piece.deplacements.push(nouveau_deplacement(7,0,3));
                piece.deplacements.push(nouveau_deplacement(7,0,4));
                piece.deplacements.push(nouveau_deplacement(7,2,0));
                piece.deplacements.push(nouveau_deplacement(7,3,0));
                piece.deplacements.push(nouveau_deplacement(7,4,0));
            batiment.pieces.push(piece);
            //piece 2
            piece = nouvelle_piece("Ouest");
                piece.deplacements.push(nouveau_deplacement(7,0,0));
                piece.deplacements.push(nouveau_deplacement(7,0,1));
                piece.deplacements.push(nouveau_deplacement(7,7,0));
                piece.deplacements.push(nouveau_deplacement(7,8,0));
                piece.deplacements.push(nouveau_deplacement(7,9,0));
            batiment.pieces.push(piece);
            //piece 3
            piece = nouvelle_piece("Est");
                piece.deplacements.push(nouveau_deplacement(7,0,0));
                piece.deplacements.push(nouveau_deplacement(7,0,1));
                piece.deplacements.push(nouveau_deplacement(7,5,0));
                piece.deplacements.push(nouveau_deplacement(7,6,0));
            batiment.pieces.push(piece);
            //piece 4
            piece = nouvelle_piece("Nord");
                piece.deplacements.push(nouveau_deplacement(7,0,1));
                piece.deplacements.push(nouveau_deplacement(7,0,5));
                piece.deplacements.push(nouveau_deplacement(7,10,0));
                piece.deplacements.push(nouveau_deplacement(7,11,0));
                piece.deplacements.push(nouveau_deplacement(7,15,0));
            batiment.pieces.push(piece);
            //piece 5
            piece = nouvelle_piece("Pont-levis");
                piece.deplacements.push(nouveau_deplacement(7,0,4));
                piece.deplacements.push(nouveau_deplacement(7,12,0));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 1
        batiment = nouveau_batiment("Auberge");
            //piece 0
            piece = nouvelle_piece("Tables");
                piece.deplacements.push(nouveau_deplacement(7,0,0));
                piece.deplacements.push(nouveau_deplacement(7,1,1));
            batiment.pieces.push(piece);
            //piece 1
            piece = nouvelle_piece("Comptoir");
                //pnj 0
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
                //pnj 1
                pnj = nouveau_pnj("Tavernier");
                    dialogue = function () {
                        afficher("Bonjour.");
                        saut(2);
                        fonction("J'aimerai voir mes compagnons","liste_personnage(1,0)");
                        saut(1);
                        fonction("J'aimerai recruter un compagnon","creer_personnage(1,0)");
                        saut(1);
                        fonction("Au revoir","menu()");
                    }
                    pnj.dialogues.push(dialogue);
                piece.pnjs.push(pnj);
                piece.deplacements.push(nouveau_deplacement(7,1,0));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 2
        batiment = nouveau_batiment("Magasin");
            //piece 0
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
                        liste_achat([[1,1],[2,1],[16,1],[17,1],[3,1],[4,1],[18,1],[23,1],[5,1],[19,1],[24,1],[6,1],[20,1],[25,1],[7,1],[21,1],[26,1],[8,1],[22,1],[27,1],[9,1],[28,1],[29,1],[11,1],[12,1],[13,1],[14,1],[15,1],[30,1],[31,1],[32,1]],pnj_id,dialogue_id);
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
                piece.deplacements.push(nouveau_deplacement(7,0,1));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 3
        batiment = nouveau_batiment("Armurerie");
            //piece 0
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
                        liste_achat([[1,1],[2,1],[16,1],[17,1],[3,1],[4,1],[18,1],[23,1],[5,1],[19,1],[24,1],[6,1],[20,1],[25,1],[7,1],[21,1],[26,1],[8,1],[22,1],[27,1],[9,1],[28,1],[29,1],[11,1],[12,1],[13,1],[14,1],[15,1],[30,1],[31,1],[32,1]],pnj_id,dialogue_id);
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
                piece.deplacements.push(nouveau_deplacement(7,0,1));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 4
        batiment = nouveau_batiment("Forge");
            //piece 0
            piece = nouvelle_piece("Atelier");
                pnj = nouveau_pnj("Forgeron");
                    dialogue = function () {
                        afficher("Bonjour.");
                        saut(2);
                        fonction("Au revoir","menu()");
                    }
                    pnj.dialogues.push(dialogue);
                piece.pnjs.push(pnj);
                piece.deplacements.push(nouveau_deplacement(7,0,1));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 5
        batiment = nouveau_batiment("Eglise");
            //piece 0
            piece = nouvelle_piece("Hall");
                pnj = nouveau_pnj("Religieuse");
                    dialogue = function () {
                        afficher("Bonjour.");
                        saut(2);
                        fonction("Au revoir","menu()");
                    }
                    pnj.dialogues.push(dialogue);
                piece.pnjs.push(pnj);
                piece.deplacements.push(nouveau_deplacement(7,0,3));
                piece.deplacements.push(nouveau_deplacement(7,5,1));
            batiment.pieces.push(piece);
            //piece 1
            piece = nouvelle_piece("Autel");
                pnj = nouveau_pnj("Prêtre");
                    dialogue = function () {
                        afficher("Bonjour.");
                        saut(2);
                        fonction("J'aurais besoin de ressuciter un allié","parler(0,2)");
                        saut(1);
                        fonction("Prier","checkpoint(7,5,1);parler(0,1)");
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
                        afficher("Mon dieu ! Qui puis-je aider à revenir parmis nous ? En échange bien sûr d'une petite rémuneration pour aider notre église.");
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
                piece.deplacements.push(nouveau_deplacement(7,5,0));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 6
        batiment = nouveau_batiment("Cimetière");
            //piece 0
            piece = nouvelle_piece("Tombes");
                pnj = nouveau_pnj("Vieille Dame");
                    dialogue = function () {
                        afficher("Bonjour.");
                        saut(2);
                        fonction("Au revoir","menu()");
                    }
                    pnj.dialogues.push(dialogue);
                piece.pnjs.push(pnj);
                piece.deplacements.push(nouveau_deplacement(7,0,3));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 7
        batiment = nouveau_batiment("Maison");
            //piece 0
            piece = nouvelle_piece("Entrée");
                piece.deplacements.push(nouveau_deplacement(7,0,2));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 8
        batiment = nouveau_batiment("Maison");
            //piece 0
            piece = nouvelle_piece("Entrée");
                piece.deplacements.push(nouveau_deplacement(7,0,2));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 9
        batiment = nouveau_batiment("Tour des mages");
            //piece 0
            piece = nouvelle_piece("Hall");
                pnj = nouveau_pnj("Mage");
                    dialogue = function () {
                        afficher("Bonjour.");
                        saut(2);
                        fonction("Au revoir","menu()");
                    }
                    pnj.dialogues.push(dialogue);
                piece.pnjs.push(pnj);
                piece.deplacements.push(nouveau_deplacement(7,0,2));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 10
        batiment = nouveau_batiment("Parc");
            //piece 0
            piece = nouvelle_piece("");
                piece.deplacements.push(nouveau_deplacement(7,0,4));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 11
        batiment = nouveau_batiment("Etable");
            //piece 0
            piece = nouvelle_piece("Grange");
                pnj = nouveau_pnj("Fermier");
                    dialogue = function () {
                        afficher("Bonjour.");
                        saut(2);
                        fonction("Au revoir","menu()");
                    }
                    pnj.dialogues.push(dialogue);
                piece.pnjs.push(pnj);
                piece.deplacements.push(nouveau_deplacement(7,0,4));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 12
        batiment = nouveau_batiment("Château");
            //piece 0
            piece = nouvelle_piece("Herse");
                pnj = nouveau_pnj("Garde");
                    dialogue = function () {
                        afficher("Bonjour.");
                        saut(2);
                        fonction("Au revoir","menu()");
                    }
                    pnj.dialogues.push(dialogue);
                piece.pnjs.push(pnj);
                pnj = nouveau_pnj("Garde");
                    dialogue = function () {
                        afficher("Bonjour.");
                        saut(2);
                        fonction("Au revoir","menu()");
                    }
                    pnj.dialogues.push(dialogue);
                piece.pnjs.push(pnj);
                piece.deplacements.push(nouveau_deplacement(7,0,5));
                piece.deplacements.push(nouveau_deplacement(7,12,1));
            batiment.pieces.push(piece);
            //piece 1
            piece = nouvelle_piece("Hall");
                piece.deplacements.push(nouveau_deplacement(7,12,0));
                piece.deplacements.push(nouveau_deplacement(7,12,2));
                piece.deplacements.push(nouveau_deplacement(7,12,3));
                piece.deplacements.push(nouveau_deplacement(7,12,7));
                piece.deplacements.push(nouveau_deplacement(7,12,11));
            batiment.pieces.push(piece);
            //piece 2
            piece = nouvelle_piece("Aile gauche");
                piece.deplacements.push(nouveau_deplacement(7,12,1));
                piece.deplacements.push(nouveau_deplacement(7,12,4));
                piece.deplacements.push(nouveau_deplacement(7,12,8));
                piece.deplacements.push(nouveau_deplacement(7,12,9));
                piece.deplacements.push(nouveau_deplacement(7,12,10));
            batiment.pieces.push(piece);
            //piece 3
            piece = nouvelle_piece("Aile droite");
                piece.deplacements.push(nouveau_deplacement(7,12,1));
                piece.deplacements.push(nouveau_deplacement(7,12,5));
                piece.deplacements.push(nouveau_deplacement(7,12,6));
            batiment.pieces.push(piece);
            //piece 4
            piece = nouvelle_piece("Bibliothèque");
                pnj = nouveau_pnj("Savant");
                    dialogue = function () {
                        afficher("Bonjour.");
                        saut(2);
                        fonction("Au revoir","menu()");
                    }
                    pnj.dialogues.push(dialogue);
                piece.pnjs.push(pnj);
                pnj = nouveau_pnj("Vieil homme");
                    dialogue = function () {
                        afficher("Bonjour.");
                        saut(2);
                        fonction("Au revoir","menu()");
                    }
                    pnj.dialogues.push(dialogue);
                piece.pnjs.push(pnj);
                piece.deplacements.push(nouveau_deplacement(7,12,2));
            batiment.pieces.push(piece);
            //piece 5
            piece = nouvelle_piece("Cuisine");
                pnj = nouveau_pnj("Cuisinier");
                    dialogue = function () {
                        afficher("Bonjour.");
                        saut(2);
                        fonction("Au revoir","menu()");
                    }
                    pnj.dialogues.push(dialogue);
                piece.pnjs.push(pnj);
                piece.deplacements.push(nouveau_deplacement(7,12,3));
                piece.deplacements.push(nouveau_deplacement(7,12,7));
            batiment.pieces.push(piece);
            //piece 6
            piece = nouvelle_piece("Jardin");
                piece.deplacements.push(nouveau_deplacement(7,12,3));
            batiment.pieces.push(piece);
            //piece 7
            piece = nouvelle_piece("Salle de souper");
                piece.deplacements.push(nouveau_deplacement(7,12,1));
                piece.deplacements.push(nouveau_deplacement(7,12,5));
            batiment.pieces.push(piece);
            //piece 8
            piece = nouvelle_piece("Prison");
                pnj = nouveau_pnj("Garde");
                    dialogue = function () {
                        afficher("Bonjour.");
                        saut(2);
                        fonction("Au revoir","menu()");
                    }
                    pnj.dialogues.push(dialogue);
                piece.pnjs.push(pnj);
                pnj = nouveau_pnj("Prisonnier");
                    dialogue = function () {
                        afficher("Bonjour.");
                        saut(2);
                        fonction("Au revoir","menu()");
                    }
                    pnj.dialogues.push(dialogue);
                piece.pnjs.push(pnj);
                piece.deplacements.push(nouveau_deplacement(7,12,2));
            batiment.pieces.push(piece);
            //piece 9
            piece = nouvelle_piece("Salle des gardes");
                pnj = nouveau_pnj("Garde");
                    dialogue = function () {
                        afficher("Bonjour.");
                        saut(2);
                        fonction("Au revoir","menu()");
                    }
                    pnj.dialogues.push(dialogue);
                piece.pnjs.push(pnj);
                piece.deplacements.push(nouveau_deplacement(7,12,2));
            batiment.pieces.push(piece);
            //piece 10
            piece = nouvelle_piece("Infirmerie");
                pnj = nouveau_pnj("Infirmière");
                    dialogue = function () {
                        afficher("Bonjour.");
                        saut(2);
                        fonction("Au revoir","menu()");
                    }
                    pnj.dialogues.push(dialogue);
                piece.pnjs.push(pnj);
                pnj = nouveau_pnj("Garde");
                    dialogue = function () {
                        afficher("Bonjour.");
                        saut(2);
                        fonction("Au revoir","menu()");
                    }
                    pnj.dialogues.push(dialogue);
                piece.pnjs.push(pnj);
                piece.deplacements.push(nouveau_deplacement(7,12,2));
            batiment.pieces.push(piece);
            //piece 11
            piece = nouvelle_piece("Escaliers");
                pnj = nouveau_pnj("Garde");
                    dialogue = function () {
                        afficher("Bonjour.");
                        saut(2);
                        fonction("Au revoir","menu()");
                    }
                    pnj.dialogues.push(dialogue);
                piece.pnjs.push(pnj);
                pnj = nouveau_pnj("Garde");
                    dialogue = function () {
                        afficher("Bonjour.");
                        saut(2);
                        fonction("Au revoir","menu()");
                    }
                    pnj.dialogues.push(dialogue);
                piece.pnjs.push(pnj);
                piece.deplacements.push(nouveau_deplacement(7,12,1));
                piece.deplacements.push(nouveau_deplacement(7,12,12));
            batiment.pieces.push(piece);
            //piece 12
            piece = nouvelle_piece("Salle du trône");
                pnj = nouveau_pnj("Roi");
                    dialogue = function () {
                        afficher("Bonjour.");
                        saut(2);
                        fonction("Au revoir","menu()");
                    }
                    pnj.dialogues.push(dialogue);
                piece.pnjs.push(pnj);
                pnj = nouveau_pnj("Reine");
                    dialogue = function () {
                        afficher("Bonjour.");
                        saut(2);
                        fonction("Au revoir","menu()");
                    }
                    pnj.dialogues.push(dialogue);
                piece.pnjs.push(pnj);
                piece.deplacements.push(nouveau_deplacement(7,12,11));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 13
        batiment = nouveau_batiment("Maison");
            //piece 0
            piece = nouvelle_piece("Entrée");
                piece.deplacements.push(nouveau_deplacement(7,0,0));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 14
        batiment = nouveau_batiment("Banque");
            //piece 0
            piece = nouvelle_piece("Comptoir");
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
                piece.deplacements.push(nouveau_deplacement(7,0,0));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 15
        batiment = nouveau_batiment("Puit");
            //piece 0
            piece = nouvelle_piece("Intérieur");
                piece.deplacements.push(nouveau_deplacement(7,0,0));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
    Jeu.zones.push(zone);

    //zone 8
    zone = nouvelle_zone("Montagnes d'Ablithia");
        batiment = nouveau_batiment("");
            piece = nouvelle_piece("");
                piece.deplacements.push(nouveau_deplacement(6,0,0));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
    Jeu.zones.push(zone);

    //zone 9
    zone = nouvelle_zone("Plage d'Ablithia");
        batiment = nouveau_batiment("");
            piece = nouvelle_piece("");
                piece.deplacements.push(nouveau_deplacement(6,0,0));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
    Jeu.zones.push(zone);

    //zone 10
    zone = nouvelle_zone("Champs d'Ablithia");
        batiment = nouveau_batiment("");
            piece = nouvelle_piece("");
                piece.deplacements.push(nouveau_deplacement(12,0,0));
                piece.deplacements.push(nouveau_deplacement(11,0,0));
                piece.deplacements.push(nouveau_deplacement(6,0,0));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
    Jeu.zones.push(zone);

    //zone 11
    zone = nouvelle_zone("Camps des bandits");
        batiment = nouveau_batiment("");
            piece = nouvelle_piece("");
                piece.deplacements.push(nouveau_deplacement(10,0,0));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
    Jeu.zones.push(zone);

    //zone 12
    zone = nouvelle_zone("Forêt d'Ablithia");
        batiment = nouveau_batiment("");
            piece = nouvelle_piece("");
                piece.deplacements.push(nouveau_deplacement(13,0,0));
                piece.deplacements.push(nouveau_deplacement(10,0,0));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
    Jeu.zones.push(zone);

    //zone 13
    zone = nouvelle_zone("Forêt de Plicata");
        batiment = nouveau_batiment("");
            piece = nouvelle_piece("");
                piece.deplacements.push(nouveau_deplacement(15,0,0));
                piece.deplacements.push(nouveau_deplacement(14,0,0));
                piece.deplacements.push(nouveau_deplacement(12,0,0));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
    Jeu.zones.push(zone);

    //zone 14
    zone = nouvelle_zone("Plicata");
        //batiment 0
        batiment = nouveau_batiment("Extérieur");
            //piece 0
            piece = nouvelle_piece("Entrée");
                piece.deplacements.push(nouveau_deplacement(13,0,0));
                piece.deplacements.push(nouveau_deplacement(14,0,1));
                piece.deplacements.push(nouveau_deplacement(14,1,0));
                piece.deplacements.push(nouveau_deplacement(14,2,0));
                piece.deplacements.push(nouveau_deplacement(14,3,0));
                piece.deplacements.push(nouveau_deplacement(14,4,0));
            batiment.pieces.push(piece);
            //piece 1
            piece = nouvelle_piece("Ouest");
                piece.deplacements.push(nouveau_deplacement(14,0,2));
                piece.deplacements.push(nouveau_deplacement(14,0,0));
                piece.deplacements.push(nouveau_deplacement(14,5,0));
                piece.deplacements.push(nouveau_deplacement(14,6,0));
                piece.deplacements.push(nouveau_deplacement(14,7,0));
            batiment.pieces.push(piece);
            //piece 2
            piece = nouvelle_piece("Nord");
                piece.deplacements.push(nouveau_deplacement(14,0,3));
                piece.deplacements.push(nouveau_deplacement(14,0,1));
                piece.deplacements.push(nouveau_deplacement(14,8,0));
                piece.deplacements.push(nouveau_deplacement(14,9,0));
            batiment.pieces.push(piece);
            //piece 3
            piece = nouvelle_piece("Est");
                piece.deplacements.push(nouveau_deplacement(14,0,2));
                piece.deplacements.push(nouveau_deplacement(14,10,0));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 1
        batiment = nouveau_batiment("Auberge");
            //piece 0
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
                piece.deplacements.push(nouveau_deplacement(14,0,0));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 2
        batiment = nouveau_batiment("Maison du bûcheron");
            //piece 0
            piece = nouvelle_piece("Entrée");
                pnj = nouveau_pnj("Bûcheron");
                    dialogue = function () {
                        afficher("Bonjour.");
                        saut(2);
                        fonction("Au revoir","menu()");
                    }
                    pnj.dialogues.push(dialogue);
                piece.pnjs.push(pnj);
                piece.deplacements.push(nouveau_deplacement(14,0,0));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 3
        batiment = nouveau_batiment("Scierie");
            //piece 0
            piece = nouvelle_piece("Atelier");
                piece.deplacements.push(nouveau_deplacement(14,0,0));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 4
        batiment = nouveau_batiment("Arbre");
            //piece 0
            piece = nouvelle_piece("Intérieur");
                pnj = nouveau_pnj("Dryade");
                    dialogue = function () {
                        afficher("Bonjour.");
                        saut(2);
                        fonction("Au revoir","menu()");
                    }
                    pnj.dialogues.push(dialogue);
                piece.pnjs.push(pnj);
                piece.deplacements.push(nouveau_deplacement(14,0,0));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 5
        batiment = nouveau_batiment("Magasin");
            //piece 0
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
                        liste_achat([[1,1],[2,1],[16,1],[17,1],[3,1],[4,1],[18,1],[23,1],[5,1],[19,1],[24,1],[6,1],[20,1],[25,1],[7,1],[21,1],[26,1],[8,1],[22,1],[27,1],[9,1],[28,1],[29,1],[11,1],[12,1],[13,1],[14,1],[15,1],[30,1],[31,1],[32,1]],pnj_id,dialogue_id);
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
                piece.deplacements.push(nouveau_deplacement(14,0,1));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 6
        batiment = nouveau_batiment("Taverne");
            //piece 0
            piece = nouvelle_piece("Tables");
                piece.deplacements.push(nouveau_deplacement(14,0,1));
                piece.deplacements.push(nouveau_deplacement(14,6,1));
            batiment.pieces.push(piece);
            //piece 1
            piece = nouvelle_piece("Comptoir");
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
                piece.deplacements.push(nouveau_deplacement(14,6,0));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 7
        batiment = nouveau_batiment("Maison du chasseur");
            //piece 0
            piece = nouvelle_piece("Entrée");
                pnj = nouveau_pnj("Chasseur");
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
                        liste_achat([[1,1],[2,1],[16,1],[17,1],[3,1],[4,1],[18,1],[23,1],[5,1],[19,1],[24,1],[6,1],[20,1],[25,1],[7,1],[21,1],[26,1],[8,1],[22,1],[27,1],[9,1],[28,1],[29,1],[11,1],[12,1],[13,1],[14,1],[15,1],[30,1],[31,1],[32,1]],pnj_id,dialogue_id);
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
                piece.deplacements.push(nouveau_deplacement(14,0,1));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 8
        batiment = nouveau_batiment("Eglise");
            //piece 0
            piece = nouvelle_piece("Hall");
                piece.deplacements.push(nouveau_deplacement(14,0,2));
                piece.deplacements.push(nouveau_deplacement(14,8,1));
            batiment.pieces.push(piece);
            //piece 1
            piece = nouvelle_piece("Autel");
                pnj = nouveau_pnj("Prêtre");
                    dialogue = function () {
                        afficher("Bonjour.");
                        saut(2);
                        fonction("J'aurais besoin de ressuciter un allié","parler(0,2)");
                        saut(1);
                        fonction("Prier","checkpoint(14,8,1);parler(0,1)");
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
                        afficher("Mon dieu ! Qui puis-je aider à revenir parmis nous ? En échange bien sûr d'une petite rémuneration pour aider notre église.");
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
                piece.deplacements.push(nouveau_deplacement(14,8,0));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 9
        batiment = nouveau_batiment("Bibliothèque");
            //piece 0
            piece = nouvelle_piece("Intérieur");
                pnj = nouveau_pnj("Sage");
                    dialogue = function () {
                        afficher("Bonjour.");
                        saut(2);
                        fonction("Au revoir","menu()");
                    }
                    pnj.dialogues.push(dialogue);
                piece.pnjs.push(pnj);
                piece.deplacements.push(nouveau_deplacement(14,0,2));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 10
        batiment = nouveau_batiment("Maison");
            //piece 0
            piece = nouvelle_piece("Entrée");
                piece.deplacements.push(nouveau_deplacement(14,0,3));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
    Jeu.zones.push(zone);

    //zone 15
    zone = nouvelle_zone("Forêt hantée");
        batiment = nouveau_batiment("");
            piece = nouvelle_piece("");
                piece.deplacements.push(nouveau_deplacement(16,0,0));
                piece.deplacements.push(nouveau_deplacement(13,0,0));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
    Jeu.zones.push(zone);

    //zone 16
    zone = nouvelle_zone("Château hanté");
        batiment = nouveau_batiment("");
            piece = nouvelle_piece("");
                piece.deplacements.push(nouveau_deplacement(15,0,0));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
    Jeu.zones.push(zone);

    //zone 17
    zone = nouvelle_zone("Pont Baccili");
        batiment = nouveau_batiment("");
            piece = nouvelle_piece("");
                piece.deplacements.push(nouveau_deplacement(18,0,0));
                piece.deplacements.push(nouveau_deplacement(6,0,0));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
    Jeu.zones.push(zone);

    //zone 18
    zone = nouvelle_zone("Plaine de Baccili");
        batiment = nouveau_batiment("");
            piece = nouvelle_piece("");
                piece.deplacements.push(nouveau_deplacement(19,0,0));
                piece.deplacements.push(nouveau_deplacement(17,0,0));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
    Jeu.zones.push(zone);

    //zone 19
    zone = nouvelle_zone("Champs de Baccili");
        batiment = nouveau_batiment("");
            piece = nouvelle_piece("");
                piece.deplacements.push(nouveau_deplacement(21,0,0));
                piece.deplacements.push(nouveau_deplacement(20,0,0));
                piece.deplacements.push(nouveau_deplacement(18,0,0));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
    Jeu.zones.push(zone);

    //zone 20
    zone = nouvelle_zone("Baccili");
        //batiment 0
        batiment = nouveau_batiment("Extérieur");
            //piece 0
            piece = nouvelle_piece("Basse-ville");
                piece.deplacements.push(nouveau_deplacement(19,0,0));
                piece.deplacements.push(nouveau_deplacement(20,0,1));
                piece.deplacements.push(nouveau_deplacement(20,0,2));
                piece.deplacements.push(nouveau_deplacement(20,1,0));
                piece.deplacements.push(nouveau_deplacement(20,3,0));
                piece.deplacements.push(nouveau_deplacement(20,4,0));
                piece.deplacements.push(nouveau_deplacement(20,5,0));
                piece.deplacements.push(nouveau_deplacement(20,6,0));
            batiment.pieces.push(piece);
            //piece 1
            piece = nouvelle_piece("Haute-ville ouest");
                piece.deplacements.push(nouveau_deplacement(20,0,0));
                piece.deplacements.push(nouveau_deplacement(20,0,2));
                piece.deplacements.push(nouveau_deplacement(20,0,3));
                piece.deplacements.push(nouveau_deplacement(20,2,0));
                piece.deplacements.push(nouveau_deplacement(20,7,0));
                piece.deplacements.push(nouveau_deplacement(20,8,0));
                piece.deplacements.push(nouveau_deplacement(20,9,0));
            batiment.pieces.push(piece);
            //piece 2
            piece = nouvelle_piece("Haute-ville est");
                piece.deplacements.push(nouveau_deplacement(20,0,0));
                piece.deplacements.push(nouveau_deplacement(20,0,1));
                piece.deplacements.push(nouveau_deplacement(20,0,3));
                piece.deplacements.push(nouveau_deplacement(20,2,0));
                piece.deplacements.push(nouveau_deplacement(20,10,0));
                piece.deplacements.push(nouveau_deplacement(20,11,0));
                piece.deplacements.push(nouveau_deplacement(20,12,0));
                piece.deplacements.push(nouveau_deplacement(20,13,0));
            batiment.pieces.push(piece);
            //piece 3
            piece = nouvelle_piece("Sommet");
                piece.deplacements.push(nouveau_deplacement(20,0,1));
                piece.deplacements.push(nouveau_deplacement(20,0,2));
                piece.deplacements.push(nouveau_deplacement(20,14,0));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 1
        batiment = nouveau_batiment("Taverne");
            //piece 0
            piece = nouvelle_piece("Tables");
                piece.deplacements.push(nouveau_deplacement(20,0,0));
                piece.deplacements.push(nouveau_deplacement(20,1,1));
                piece.deplacements.push(nouveau_deplacement(20,2,0));
            batiment.pieces.push(piece);
            //piece 1
            piece = nouvelle_piece("Comptoir");
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
                piece.deplacements.push(nouveau_deplacement(20,1,0));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 2
        batiment = nouveau_batiment("Auberge");
            //piece 0
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
                piece.deplacements.push(nouveau_deplacement(20,1,0));
                piece.deplacements.push(nouveau_deplacement(20,0,1));
                piece.deplacements.push(nouveau_deplacement(20,0,2));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 3
        batiment = nouveau_batiment("Forge");
            //piece 0
            piece = nouvelle_piece("Atelier");
                pnj = nouveau_pnj("Forgeron");
                    dialogue = function () {
                        afficher("Bonjour.");
                        saut(2);
                        fonction("Au revoir","menu()");
                    }
                    pnj.dialogues.push(dialogue);
                piece.pnjs.push(pnj);
                piece.deplacements.push(nouveau_deplacement(20,0,0));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 4
        batiment = nouveau_batiment("Laboratoire");
            //piece 0
            piece = nouvelle_piece("Atelier");
                pnj = nouveau_pnj("Savant");
                    dialogue = function () {
                        afficher("Bonjour.");
                        saut(2);
                        fonction("Au revoir","menu()");
                    }
                    pnj.dialogues.push(dialogue);
                piece.pnjs.push(pnj);
                piece.deplacements.push(nouveau_deplacement(20,0,0));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 5
        batiment = nouveau_batiment("Bibliothèque");
            //piece 0
            piece = nouvelle_piece("Intérieur");
                pnj = nouveau_pnj("Savant");
                    dialogue = function () {
                        afficher("Bonjour.");
                        saut(2);
                        fonction("Au revoir","menu()");
                    }
                    pnj.dialogues.push(dialogue);
                piece.pnjs.push(pnj);
                piece.deplacements.push(nouveau_deplacement(20,0,0));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 6
        batiment = nouveau_batiment("Entrepôt");
            //piece 0
            piece = nouvelle_piece("Intérieur");
                piece.deplacements.push(nouveau_deplacement(20,0,0));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 7
        batiment = nouveau_batiment("Eglise");
            //piece 0
            piece = nouvelle_piece("Hall");
                piece.deplacements.push(nouveau_deplacement(20,0,1));
                piece.deplacements.push(nouveau_deplacement(20,7,1));
            batiment.pieces.push(piece);
            //piece 1
            piece = nouvelle_piece("Autel");
                pnj = nouveau_pnj("Prêtre");
                    dialogue = function () {
                        afficher("Bonjour.");
                        saut(2);
                        fonction("J'aurais besoin de ressuciter un allié","parler(0,2)");
                        saut(1);
                        fonction("Prier","checkpoint(20,7,1);parler(0,1)");
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
                        afficher("Mon dieu ! Qui puis-je aider à revenir parmis nous ? En échange bien sûr d'une petite rémuneration pour aider notre église.");
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
                piece.deplacements.push(nouveau_deplacement(20,7,0));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 8
        batiment = nouveau_batiment("Maison");
            //piece 0
            piece = nouvelle_piece("Entrée");
                piece.deplacements.push(nouveau_deplacement(20,0,1));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 9
        batiment = nouveau_batiment("Maison");
            //piece 0
            piece = nouvelle_piece("Entrée");
                piece.deplacements.push(nouveau_deplacement(20,0,1));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 10
        batiment = nouveau_batiment("Magasin");
            //piece 0
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
                        liste_achat([[1,1],[2,1],[16,1],[17,1],[3,1],[4,1],[18,1],[23,1],[5,1],[19,1],[24,1],[6,1],[20,1],[25,1],[7,1],[21,1],[26,1],[8,1],[22,1],[27,1],[9,1],[28,1],[29,1],[11,1],[12,1],[13,1],[14,1],[15,1],[30,1],[31,1],[32,1]],pnj_id,dialogue_id);
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
                piece.deplacements.push(nouveau_deplacement(20,0,2));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 11
        batiment = nouveau_batiment("Banque");
            //piece 0
            piece = nouvelle_piece("Comptoir");
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
                piece.deplacements.push(nouveau_deplacement(20,0,2));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 12
        batiment = nouveau_batiment("Maison");
            //piece 0
            piece = nouvelle_piece("Entrée");
                piece.deplacements.push(nouveau_deplacement(20,0,2));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 13
        batiment = nouveau_batiment("Maison");
            //piece 0
            piece = nouvelle_piece("Entrée");
                piece.deplacements.push(nouveau_deplacement(20,0,2));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
        //batiment 14
        batiment = nouveau_batiment("Manoir");
            //piece 0
            piece = nouvelle_piece("Entrée");
                piece.deplacements.push(nouveau_deplacement(20,0,3));
                piece.deplacements.push(nouveau_deplacement(20,14,1));
                piece.deplacements.push(nouveau_deplacement(20,14,2));
            batiment.pieces.push(piece);
            //piece 1
            piece = nouvelle_piece("Cuisine");
                piece.deplacements.push(nouveau_deplacement(20,14,0));
            batiment.pieces.push(piece);
            //piece 2
            piece = nouvelle_piece("Etage");
                piece.deplacements.push(nouveau_deplacement(20,14,0));
                piece.deplacements.push(nouveau_deplacement(20,14,3));
                piece.deplacements.push(nouveau_deplacement(20,14,4));
            batiment.pieces.push(piece);
            //piece 3
            piece = nouvelle_piece("Chambre");
                piece.deplacements.push(nouveau_deplacement(20,14,2));
            batiment.pieces.push(piece);
            //piece 4
            piece = nouvelle_piece("Bureau");
                pnj = nouveau_pnj("Maire");
                    dialogue = function () {
                        afficher("Bonjour.");
                        saut(2);
                        fonction("Au revoir","menu()");
                    }
                    pnj.dialogues.push(dialogue);
                piece.pnjs.push(pnj);
                piece.deplacements.push(nouveau_deplacement(20,14,2));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
    Jeu.zones.push(zone);

    //zone 21
    zone = nouvelle_zone("Forêt de Baccili");
        batiment = nouveau_batiment("");
            piece = nouvelle_piece("");
                piece.deplacements.push(nouveau_deplacement(23,0,0));
                piece.deplacements.push(nouveau_deplacement(22,0,0));
                piece.deplacements.push(nouveau_deplacement(19,0,0));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
    Jeu.zones.push(zone);

    //zone 22
    zone = nouvelle_zone("Quarantombe");
        batiment = nouveau_batiment("");
            piece = nouvelle_piece("");
                piece.deplacements.push(nouveau_deplacement(21,0,0));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
    Jeu.zones.push(zone);

    //zone 23
    zone = nouvelle_zone("Montagnes de Baccili");
        batiment = nouveau_batiment("");
            piece = nouvelle_piece("");
                piece.deplacements.push(nouveau_deplacement(24,0,0));
                piece.deplacements.push(nouveau_deplacement(21,0,0));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
    Jeu.zones.push(zone);

    //zone 24
    zone = nouvelle_zone("Tour d'ascension");
        batiment = nouveau_batiment("");
            piece = nouvelle_piece("");
                piece.deplacements.push(nouveau_deplacement(23,0,0));
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
    Jeu.zones.push(zone);
}