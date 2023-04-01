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
    afficher("<div class='slidecontainer'><input id='slider_musique' type='range' min='0' max='100' value=" + Jeu.musique.audio.volume*100 + " class='slider'></div>");
    div("volume_musique");
    afficher("Musique : " + parseInt(Jeu.musique.audio.volume*100) + "%");
    div_fin();
    saut();
    afficher("<div class='slidecontainer'><input id='slider_bruitage' type='range' min='0' max='100' value=" + Jeu.musique.bruitage_volume*100 + " class='slider'></div>");
    div("volume_bruitage");
    afficher("Bruitage : " + parseInt(Jeu.musique.bruitage_volume*100) + "% (BETA)");
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
    fonction("Continuer", "son_bouton();menu()");
    saut(2);
    option("option_jeu()");
    saut();
    fonction("Retour à l'écran titre", "Jeu.en_jeu = false;accueil()");
    actualiser();
    slider();
}

function option_combat() {
    initialiser();
    fonction("Continuer", "son_bouton();combat_afficher()");
    saut(2);
    option("option_combat()");
    saut();
    fonction("Retour à l'écran titre", "Jeu.en_jeu = false;accueil()");
    actualiser();
    slider();
}

function option_menu() {
    initialiser();
    fonction("Retour", "son_bouton();accueil()");
    saut(2);
    option("option_menu()");
    actualiser();
    slider();
}

function slider () {
    document.getElementById("slider_musique").oninput = function() {
        Jeu.musique.audio.volume = document.getElementById("slider_musique").value/100;
        div_actualiser("volume_musique", "Musique : " + parseInt(Jeu.musique.audio.volume*100) + "%");
    }
    document.getElementById("slider_bruitage").oninput = function() {
        Jeu.musique.bruitage_volume = document.getElementById("slider_bruitage").value/100;
        div_actualiser("volume_bruitage", "Bruitage : " + parseInt(Jeu.musique.bruitage_volume*100) + "% (BETA)");
        son_bouton();
    }
}