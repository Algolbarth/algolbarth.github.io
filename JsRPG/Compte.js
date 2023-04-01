function connecter () {
    initialiser();
    afficher("<center><img src='Images/Title.png' style='width:30em;border:solid;border-width:5px;'/>");
    saut();
    afficher("Version BETA");
    saut(3);
    fonction("Retour", "ecran_titre()", "menu");
    saut(2);
    afficher("Charger une sauvegarde : <input type='file' onchange='charger_sauvegarde(this.files[0])'>");
    afficher("</center>");
    actualiser();
}

function inscription () {
    initialiser();
    afficher("<center><img src='Images/Title.png' style='width:30em;border:solid;border-width:5px;'/>");
    saut();
    afficher("Version BETA");
    saut(3);
    fonction("Retour", "ecran_titre()", "menu");
    saut(2);
    afficher("Nom de compte");
    saut();
    afficher("<input id='nom' type='text'></input>");
    saut(2);
    fonction("Terminer", "creer_compte()", "menu");
    afficher("</center>");
    actualiser();
}

function compte () {
    initialiser();
    fonction("Retour", "son_bouton();accueil()");
    saut(2);
    afficher(Jeu.compte.nom);
    saut(2);
    fonction("Sauvegarder", "son_bouton();sauvegarder()");
    actualiser();
}

function creer_compte () {
    Jeu.compte = {};
    Jeu.compte.nom = document.getElementById("nom").value;
    musique();
    accueil();
}

function sauvegarder () {
    let save = "";
    save += Jeu.compte.nom + "_" + Jeu.combat.vitesse + "_" + Jeu.musique.audio.volume*100 + "_" + Jeu.musique.bruitage_volume*100 + "_";
    telecharger(Jeu.compte.nom, save);
}

async function charger_sauvegarde(file) {
    let save = await file.text();
    step = 0;
    Jeu.compte.nom = lire_valeur(save);
    Jeu.combat.vitesse = parseInt(lire_valeur(save));
    Jeu.musique.audio.volume = parseInt(lire_valeur(save))/100;
    Jeu.musique.bruitage_volume = parseInt(lire_valeur(save))/100;
    musique();
    accueil();
}

function lire_valeur (save) {
    let valeur = "";
    while (save[step] != "_") {
        valeur += save[step];
        step++;
    }
    step++;
    return valeur;
}