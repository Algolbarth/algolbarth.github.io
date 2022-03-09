function objet_liste () {
    initialiser();
    fonction("Retour","menu()");
    saut(2);
    for (let n=0;n<Jeu.objets.length;n++) {
        let objet = Jeu.objets[n];
        fonction(objet.nom,"objet_voir(" + n + ")");
        saut();
    }
    actualiser();
}

function objet_voir (objet_slot) {
    let objet = Jeu.objets[objet_slot];
    initialiser();
    fonction("Retour","objet_liste()");
    saut(2);
    afficher(objet.nombre + " x " + objet.nom);
    saut();
    afficher(objet.description);
    saut(2);
    fonction("Utiliser","Jeu.objets[" + objet_slot + "].utilisation(1)");
    actualiser();
}

function objet_initialiser () {
    let objet;

    objet = objet_defaut();
    objet.nom = "Parchemin";
    objet.description = "Permet d'invoquer une créature aléatoire.";
    objet.utilisable = true;
    objet.utilisation = function (etape) {
        switch (etape) {
            case 1:
                if (objet.nombre > 0) {
                    let creature_id = 0;
                    creature_ajouter(creature_id);
                    Jeu.objets[0].nombre--;
                    initialiser();
                    afficher("Vous avez invoqué " + Jeu.creatures.bdd[creature_id].nom);
                    saut();
                    fonction("Ok","objet_voir(0)");
                    actualiser();
                }
                else {
                    initialiser();
                    afficher("Vous n'avez aucun parchemin.");
                    saut();
                    fonction("Ok","objet_voir(0)");
                    actualiser();
                }
                break;
        }
    };
    Jeu.objets.push(objet);
}

function objet_defaut () {
    let objet = {
        nom : "",
        nombre : 0,
        description : "",
        utilisable : false,
        utilisation : function () {}
    }
    return objet;
}