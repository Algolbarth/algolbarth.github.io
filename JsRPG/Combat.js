function nouveau_combat (monstre_id) {
    let liste = Jeu.zones[Jeu.emplacement.zone].batiments[Jeu.emplacement.batiment].pieces[Jeu.emplacement.piece].monstres[monstre_id];
    Jeu.combat.liste = [];
	for (let n=0;n<liste.length;n++) {
		Jeu.combat.liste.push(obtenir_monstre(liste[n][0],liste[n][1]));
	}
    for (let n=0;n<Jeu.equipe.length;n++) {
        Jeu.combat.liste.push(Jeu.equipe[n]);
    }
    continuer_combat();
}

function continuer_combat () {
    let liste = Jeu.combat.liste;
    for (let n=0;n<liste.length;n++) {
        if (!liste[n].mort) {
            liste[n].statistiques.atb += liste[n].statistiques.vitesse;
        }
    }
    for (let n=0;n<liste.length;n++) {
        let i = n;
        while (i > 0 && liste[i].statistiques.atb > liste[i-1].statistiques.atb) {
            let transition = liste[i];
            liste[i] = liste[i-1];
            liste[i-1] = transition;
        }
    }
    if (liste[0].statistiques.atb >= 1000) {
        liste[0].statistiques.action = liste[0].statistiques.action_max;
        liste[0].statistiques.atb = 0;
        if (liste[0].ennemi) {
            liste[0].tour();
        }
        else {
            choix_combat();
        }
    }
    else {
        continuer_combat();
    }
}

function resultat_combat () {
    initialiser();
    afficher_combat();
    saut(1);
    afficher(Jeu.combat.resultat);
    saut(2);
    if (defaite()) {
        fonction("Suivant","game_over()");
    }
    else if (victoire()) {
        fonction("Suivant","fin_combat()");
    } 
    else if (Jeu.combat.liste[0].ennemi) {
        fonction("Suivant","Jeu.combat.liste[0].tour()");
    }
    else {
        fonction("Suivant","choix_combat()");
    }
    actualiser();
}

function afficher_combat () {
    afficher("Adversaires :");
    saut(1);
    for (let n=0;n<Jeu.combat.liste.length;n++) {
        let monstre = Jeu.combat.liste[n];
        if (monstre.ennemi) {
            afficher(monstre.nom + " Nv " + monstre.niveau);
            if (monstre.mort) {
                afficher(" : <i>mort</i>");
            }
            saut(1);
        }
    }
    saut(1);
    afficher("Alliés :");
    saut(1);
    for (let n=0;n<Jeu.combat.liste.length;n++) {
        let personnage = Jeu.combat.liste[n];
        if (!personnage.ennemi) {
            afficher(personnage.nom + " Nv " + personnage.niveau + " : ");
            if (!personnage.mort) {
                afficher(personnage.statistiques.vie + " / " + personnage.statistiques.vie_max + " vie, " + personnage.statistiques.mana + " / " + personnage.statistiques.mana_max + " mana, " + personnage.statistiques.atb + "%");
            }
            else {
                afficher("<i>mort</i>");
            }
            saut(1);
        }
    }
}

function choix_combat () {
    let personnage = Jeu.combat.liste[0];
    initialiser();
    afficher_combat();
    saut(1);
    afficher(personnage.nom + " : " + personnage.statistiques.action + " / " + personnage.statistiques.action_max + " actions");
    saut(1);
    for (let n=0;n<personnage.sorts.length;n++) {
        let sort = personnage.sorts[n];
        if (sort.condition()) {
            fonction(sort.nom,"Jeu.combat.liste[0].sorts[" + n + "].use(" + n + ");");
        }
        else {
            afficher(sort.nom);
        }
        afficher(" : ");
        sort.description();
        saut(1);
    }
    saut(1);
    fonction("Fin du tour","continuer_combat()");
    actualiser();
}

function fin_combat () {
    initialiser();
    afficher("Adversaires :");
    saut(1);
    for (let n=0;n<Jeu.combat.liste.length;n++) {
        if (Jeu.combat.liste[n].ennemi) {
            let loot_nombre = 0;
            afficher(Jeu.combat.liste[n].nom + " : ");
            if (Jeu.combat.liste[n].xp > 0) {
                loot_nombre++;
                afficher(Jeu.combat.liste[n].xp + " expérience");
                for (let i=0;i<Jeu.equipe.length;i++) {
                    Jeu.equipe[i].xp += Jeu.combat.liste[n].xp;
                    if (Jeu.equipe[i].xp >= parseInt(100*Math.pow(2,parseInt(Jeu.combat.liste[n].niveau/10))*(1 + (Jeu.combat.liste[n].niveau%10)/10))) {
                        niveau_sup(Jeu.equipe[i]);
                        afficher(" Niveau " + Jeu.equipe[i].niveau + " !");
                    }
                }
            }
            if (Jeu.combat.liste[n].or > 0) {
                loot_nombre++;
                if (loot_nombre > 1) {
                    afficher(", ");
                }
                afficher(Jeu.combat.liste[n].or + " Or");
                Jeu.or += Jeu.combat.liste[n].or;
            }
            for (let i=0;i<Jeu.combat.liste[n].loots.length;i++) {
                if (Jeu.combat.liste[n].loots[i].taux > Math.random()*100) {
                    loot_nombre++;
                    if (loot_nombre > 1) {
                        afficher(", ");
                    }
                    afficher("1  x <b>" + obtenir_objet(Jeu.combat.liste[n].loots[i].id).nom + "</b>");
                    objet_ajouter(Jeu.combat.liste[n].loots[i].id,Jeu.combat.liste[n].loots[i].niveau,1);
                }
            }
            saut(1);
        }
    }
    saut(1);
    afficher("Alliés :");
    saut(1);
    for (let n=0;n<Jeu.equipe.length;n++) {
        afficher(Jeu.equipe[n].nom + " : " + Jeu.equipe[n].statistiques.vie + " / " + Jeu.equipe[n].statistiques.vie_max + " vie, " + Jeu.equipe[n].statistiques.mana + " / " + Jeu.equipe[n].statistiques.mana_max + " mana");
        saut(1);
    }
    saut(1);
    fonction("Terminé","menu()");
    actualiser();
    Jeu.combat = {
        liste : [],
        resultat : "",
    }
}

function victoire () {
    for (let n=0;n<Jeu.combat.liste.length;n++) {
        if (Jeu.combat.liste[n].ennemi && !Jeu.combat.liste[n].mort) {
            return false;
        }
    }
    return true;
}

function defaite () {
    for (let n=0;n<Jeu.combat.liste.length;n++) {
        if (!Jeu.combat.liste[n].ennemi && !Jeu.combat.liste[n].mort) {
            return false;
        }
    }
    return true;
}

function mort (slot) {
    Jeu.combat.liste[slot].mort = true;
    Jeu.combat.liste[slot].statistiques.vie = 0;
    Jeu.combat.liste[slot].statistiques.mana = 0;
    Jeu.combat.liste[slot].statistiques.atb = 0;
    Jeu.combat.liste[slot].statistiques.action = 0;

}

function game_over () {
    initialiser();
    Jeu.emplacement = Jeu.spawn;
    for (let n=0;n<Jeu.equipe.length;n++) {
        Jeu.equipe[n].mort = false;
        Jeu.equipe[n].statistiques.vie = Jeu.equipe[n].statistiques.vie_max;
        Jeu.equipe[n].statistiques.mana = Jeu.equipe[n].statistiques.mana_max;
    }
    afficher("Votre équipe est défaite...");
    saut(2);
    fonction("Revivre","menu();");
    actualiser();
}