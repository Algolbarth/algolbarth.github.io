function option(option_afficher) {
    if (!Jeu.combat.etat) {
        afficher("<u>Combat automatique :</u> ");
        if (Jeu.combat.auto) {
            afficher("Activé ");
            fonction("Désactivé", "Jeu.combat.auto=false;" + option_afficher);
        }
        else {
            fonction("Activé", "Jeu.combat.auto=true;" + option_afficher);
            afficher(" Désactivé");
        }
        saut();
    }
    afficher("<u>Vitesse de combat automatique :</u> ");
    option_vitesse("Lente", 3000, option_afficher);
    option_vitesse("Normal", 1000, option_afficher);
    option_vitesse("Rapide", 500, option_afficher);
    saut(2);
    afficher("<div class='slidecontainer'><input id='slider' type='range' min='0' max='100' value=" + Jeu.musique.audio.volume*100 + " class='slider' id='myRange'></div>");
    div("volume");
    afficher("Volume : " + parseInt(Jeu.musique.audio.volume*100) + "%");
    div_fin();
}

function option_vitesse(nom, vitesse, option_afficher) {
    if (Jeu.combat.vitesse == vitesse) {
        afficher(nom + " ");
    }
    else {
        fonction(nom, "Jeu.combat.vitesse=" + vitesse + ";" + option_afficher);
        afficher(" ");
    }
}

function option_jeu() {
    initialiser();
    fonction("Continuer", "menu()");
    saut(2);
    option("option_jeu()");
    saut(2);
    fonction("Retour à l'écran titre", "Jeu.en_jeu = false;accueil()");
    actualiser();
    slider();
}

function option_combat() {
    initialiser();
    fonction("Continuer", "combat_afficher()");
    saut(2);
    option("option_combat()");
    saut(2);
    fonction("Retour à l'écran titre", "Jeu.en_jeu = false;accueil()");
    actualiser();
    slider();
}

function option_menu() {
    initialiser();
    fonction("Retour", "accueil()");
    saut(2);
    option("option_menu()");
    actualiser();
    slider();
}

function slider () {
    document.getElementById("slider").oninput = function() {
        Jeu.musique.audio.volume = document.getElementById("slider").value/100;
        div_actualiser("volume", "Volume : " + parseInt(Jeu.musique.audio.volume*100) + "%");
    }
}