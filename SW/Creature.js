function creature_liste () {
    initialiser();
    fonction("Retour","menu()");
    saut(2);
    for (let n=0;n<Jeu.creatures.stockage.length;n++) {
        let creature = Jeu.creatures.stockage[n];
        fonction(creature.nom,"creature_voir(" + n + ")");
        saut();
    }
    actualiser();
}

function creature_voir (creature_slot) {
    let creature = Jeu.creatures.stockage[creature_slot];
    initialiser();
    fonction("Retour","creature_liste()");
    saut(2);
    afficher(creature.nom + " Nv " + creature.niveau);
    saut(2);
    afficher("Vie : " + creature.vie);
    saut();
    afficher("Attaque : " + creature.attaque);
    saut();
    afficher("Vitesse : " + creature.vitesse);
    saut(2);
    for (let n=0;n<creature.sorts.length;n++) {
        afficher(creature.sorts[n].nom + " : " + creature.sorts[n].description);
        saut();
    }
    actualiser();
}

function creature_collection_liste () {
    initialiser();
    fonction("Retour","menu()");
    saut(2);
    for (let n=0;n<Jeu.creatures.bdd.length;n++) {
        let creature = Jeu.creatures.bdd[n];
        fonction(creature.nom,"creature_collection_voir(" + n + ")");
        saut();
    }
    actualiser();
}

function creature_collection_voir (creature_slot) {
    let creature = Jeu.creatures.bdd[creature_slot];
    initialiser();
    fonction("Retour","creature_collection_liste()");
    saut(2);
    afficher(creature.nom);
    saut(2);
    afficher("Vie : " + creature.vie);
    saut();
    afficher("Attaque : " + creature.attaque);
    saut();
    afficher("Vitesse : " + creature.vitesse);
    saut(2);
    for (let n=0;n<creature.sorts.length;n++) {
        afficher(creature.sorts[n].nom + " : " + creature.sorts[n].description);
        saut();
    }
    actualiser();
}

function creature_initialiser () {
    let creature;
    let sort;

    creature = creature_defaut();
    creature.nom = "Guerrier";
    sort = {
        nom : "Coup d'épée",
        description : "Inflige des dégats à une cible.",
        condition : function () {
            return true;
        },
        utilisation : function (etape,cible) {
            switch (etape) {
                case 1:
                    creature.utilisation(2,1);
                    break;
                case 2:
                    break;
            }
        }
    }
    creature.sorts.push(sort);
    Jeu.creatures.bdd.push(creature);

    creature = creature_defaut();
    creature.nom = "Loup";
    sort = {
        nom : "Griffures",
        description : "Inflige des dégats à une cible.",
        condition : function () {
            return true;
        },
        utilisation : function (etape,cible) {
            switch (etape) {
                case 1:
                    creature.utilisation(2,1);
                    break;
                case 2:
                    break;
            }
        }
    }
    creature.sorts.push(sort);
    Jeu.creatures.bdd.push(creature);
}

function creature_defaut () {
    let creature = {
        nom : "",
        vie : 100,
        attaque : 50,
        vitesse : 50,
        sorts : [],
    }
    return creature;
}

function creature_creer (creature_id,creature_niveau) {
    let creature = Jeu.creatures.bdd[creature_id];
    creature.niveau = creature_niveau;
    return creature;
}

function creature_ajouter (creature_id) {
    let creature = creature_creer(creature_id,1);
    Jeu.creatures.stockage.push(creature);
}