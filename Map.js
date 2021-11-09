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

function initialiser_zones () {
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
                        achat(16,pnj_id,dialogue_id);
                        achat(17,pnj_id,dialogue_id);
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
                        achat(14,pnj_id,dialogue_id);
                        achat(15,pnj_id,dialogue_id);
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
                piece.monstres.push([2]);
                piece.monstres.push([3]);
            batiment.pieces.push(piece);
        zone.batiments.push(batiment);
    Jeu.zones.push(zone);
}