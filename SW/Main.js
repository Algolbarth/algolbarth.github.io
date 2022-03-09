function demarrage () {
    Jeu = {
        objets : [],
        creatures : {
            stockage : [],
            bdd : [],
        },
        combat : {
            liste : [],
        },
        equipe : [],
        donjons : [],
    }
    objet_initialiser();
    Jeu.objets[0].nombre += 5;
    creature_initialiser();
    creature_ajouter(0,1);
    Jeu.equipe.push(Jeu.creatures.stockage[0]);
    donjon_initialiser();
    menu();
}

function menu () {
    initialiser();
    fonction("Donjons","donjon_liste()");
    saut();
    fonction("Stockage","creature_liste()");
    saut();
    fonction("Collection","creature_collection_liste()");
    saut();
    fonction("Inventaire","objet_liste()");
    actualiser();
}