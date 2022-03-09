function combat_initialiser () {
    Jeu.combat.liste = [];
}

function combat_equipe () {
    initialiser();
    fonction("Retour","menu()");
    saut(2);
    for (let n=0;n<Jeu.combat.liste.length;n++) {
        let creature = Jeu.combat.liste[n];
        afficher(creature.nom + " Nv " + creature.niveau);
        saut();
    }
    saut(2);
    for (let n=0;n<Jeu.equipe.length;n++) {
        let creature = Jeu.equipe[n];
        fonction(creature.nom + " Nv " + creature.niveau,"combat_choisir_equipe(" + n + ")");
        saut();
    }
    for (let n=0;n<4-Jeu.equipe.length;n++) {
        fonction("Vide","combat_choisir_equipe(" + (Jeu.equipe.length + n) + ")");
        saut();
    }
    saut();
    if (Jeu.equipe.length > 0) {
        fonction("Commencer","combat_demarrage()");
    }
    actualiser();
}

function combat_choisir_equipe (equipe_slot) {
    initialiser();
    fonction("Retour","combat_equipe()");
    saut(2);
    for (let n=0;n<Jeu.combat.liste.length;n++) {
        let creature = Jeu.combat.liste[n];
        afficher(creature.nom + " Nv " + creature.niveau);
        saut();
    }
    saut(2);
    if (Jeu.equipe.length <= equipe_slot) {
        afficher("Vide");
    }
    else {
        afficher(Jeu.equipe[equipe_slot].nom);
    }
    saut(2);
    for (let n=0;n<Jeu.creatures.stockage.length;n++) {
        fonction(Jeu.creatures.stockage[n].nom,"combat_changer_equipe(" + equipe_slot + "," + n + ")");
        saut();
    }
    actualiser();
}

function combat_changer_equipe (equipe_slot,creature_slot) {
    Jeu.equipe[equipe_slot] = Jeu.creatures.stockage[creature_slot];
    combat_equipe();
}

function combat_demarrage () {
    for (let n=0;n<Jeu.equipe.length;n++) {
        Jeu.combat.liste.push(Jeu.equipe[n]);
        Jeu.combat.liste[Jeu.combat.liste.length - 1].ennemy = false;
        Jeu.combat.liste[Jeu.combat.liste.length - 1].atb = 0;
    }
    combat_continuer();
}

function combat_continuer () {
    let liste = [];
    for (let n=0;n<Jeu.combat.liste.length;n++) {
        Jeu.combat.liste[n].atb += Jeu.combat.liste[n].vitesse;
        liste.push(Jeu.combat.liste[n]);
    }
    for (let n=1;n<liste.length;n++) {
        let i = n;
        while (liste[i].atb > liste[i-1].atb && i > 0) {
            let echange = liste[i];
            liste[i] = liste[i-1];
            liste[i-1] = echange;
            i--;
        }
    }
    if (liste[0].atb >= 1000) {
        liste[0].atb = 0;
        combat_afficher();
    }
    else {
        combat_continuer();
    }
}

function combat_afficher() {
    initialiser();
    for (let n=0;n<Jeu.combat.liste.length;n++) {
        if (Jeu.combat.liste[n].ennemy) {
            afficher(Jeu.combat.liste[n].nom + " Nv " + Jeu.combat.liste[n].niveau);
            saut();
        }
    }
    saut();
    for (let n=0;n<Jeu.combat.liste.length;n++) {
        if (!Jeu.combat.liste[n].ennemy) {
            afficher(Jeu.combat.liste[n].nom + " Nv " + Jeu.combat.liste[n].niveau);
            saut();
        }
    }
    saut();
    fonction("Continuer","combat_continuer()");
    actualiser();
}