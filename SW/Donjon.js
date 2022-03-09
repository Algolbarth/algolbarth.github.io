function donjon_liste () {
    initialiser();
    fonction("Retour","menu()");
    saut(2);
    for (let n=0;n<Jeu.donjons.length;n++) {
        let donjon = Jeu.donjons[n];
        fonction(donjon.nom,"donjon_voir(" + n + ")");
        saut();
    }
    actualiser();
}

function donjon_voir (donjon_slot) {
    let donjon = Jeu.donjons[donjon_slot];
    initialiser();
    fonction("Retour","donjon_liste()");
    saut(2);
    for (let n=0;n<donjon.etages.length;n++) {
        fonction("Etage " + n,"donjon_etage_voir(" + donjon_slot + "," + n + ")");
        saut();
    }
    actualiser();
}

function donjon_etage_voir (donjon_slot,etage_slot) {
    let donjon = Jeu.donjons[donjon_slot];
    let etage = donjon.etages[etage_slot];
    initialiser();
    fonction("Retour","donjon_voir(" + donjon_slot + ")");
    saut(2);
    for (let n=0;n<etage.length;n++) {
        let creature = etage[n];
        afficher(creature.nom + " Nv " + creature.niveau);
        saut();
    }
    saut();
    fonction("Commencer","donjon_combat(" + donjon_slot + "," + etage_slot + ")");
    actualiser();
}

function donjon_combat (donjon_slot,etage_slot) {
    let donjon = Jeu.donjons[donjon_slot];
    let etage = donjon.etages[etage_slot];
    combat_initialiser();
    for (let n=0;n<etage.length;n++) {
        let creature = etage[n];
        Jeu.combat.liste.push(creature);
        Jeu.combat.liste[Jeu.combat.liste.length - 1].ennemy = true;
        Jeu.combat.liste[Jeu.combat.liste.length - 1].atb = 0;
    }
    combat_equipe();
}

function donjon_initialiser () {
    let donjon;

    donjon = donjon_defaut();
    donjon.nom = "Forêt";
    donjon.etages.push([creature_creer(1,1)]);
    Jeu.donjons.push(donjon);
}

function donjon_defaut () {
    let donjon = {
        nom : "",
        etages : [],
    }
    return donjon;
}