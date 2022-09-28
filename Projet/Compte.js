function compte_creer_afficher() {
    initialiser();
    fonction("Retour", "main_afficher()");
    saut(2);
    afficher("<input type='text' id='compte_creer_nom'>");
    saut(2);
    fonction("Terminé", "compte_creer()");
    actualiser();
}

function compte_creer() {
    let compte_creer_nom = document.getElementById("compte_creer_nom").value;
    if (compte_creer_nom != "") {
        Jeu.compte = compte_nouveau();
        Jeu.compte.nom = compte_creer_nom;
        jeu_afficher();
    }
}

function compte_nouveau() {
    let compte = {
        nom: "",
    }
    return compte;
}

function compte_sauvegarde() {
    let save = Jeu.compte.nom;
    telecharger("save", save);
}

function compte_connexion_afficher() {
    initialiser();
    fonction("Retour", "main_afficher()");
    saut(2);
    afficher("<input type='file' id='compte_fichier_txt'>");
    saut(2);
    fonction("Terminé", "compte_connexion()");
    actualiser();
}

async function compte_connexion() {
    let compte_fichier_txt = await document.getElementById("compte_fichier_txt").files[0].text();
    console.log(compte_fichier_txt);
    jeu_afficher();
}