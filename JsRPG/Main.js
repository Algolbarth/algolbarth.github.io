function demarrage() {
    Jeu = {
        ressources: [
            { nom: "Or" },//0
            { nom: "Feu" },//1
            { nom: "Eau" },//2
            { nom: "Végétal" },//3
            { nom: "Terre" },//4
            { nom: "Air" },//5
            { nom: "Foudre" },//6
            { nom: "Métal" },//7
            { nom: "Arcane" },//8
            { nom: "Mort" },//9
            { nom: "Lumière" },//10
            { nom: "Ombre" },//11
            { nom: "Glace" }//12
        ],
        types: ["Créature", "Bâtiment", "Objet", "Action", "Région"],
        familles: [],
        NOMBRE_CARTE: 546,
        NOMBRE_HISTOIRE: 4,
        NOMBRE_MUSIQUE: 4,
        combat: {
            auto: true,
            vitesse: 1000
        },
        collection: [],
        collection_tri: "nom",
        collection_ordre: "croissant",
        collection_filtre: {
            type: "Tous",
            famille: "Toutes",
            cout: "Tous",
            boutique: "Tous"
        },
        en_jeu: false,
        musique: {
            audio: new Audio(),
            liste: [],
            slot: 0
        }
    }
    for (let n = 1; n <= Jeu.NOMBRE_CARTE; n++) {
        let carte = obtenir_carte(n);
        for (let i = 0; i < carte.familles.length; i++) {
            if (!verifier_famille(carte.familles[i])) {
                Jeu.familles.push(carte.familles[i]);
            }
        }
    }
    for (let i = 0; i < Jeu.familles.length; i++) {
        let j = i;
        while (j > 0 && Jeu.familles[j - 1].localeCompare(Jeu.familles[j]) > 0) {
            let a = Jeu.familles[j];
            let b = Jeu.familles[j - 1];
            Jeu.familles[j] = b;
            Jeu.familles[j - 1] = a;
            j--;
        }
    }
    ecran_titre();
}

function verifier_famille(famille) {
    for (let n = 0; n < Jeu.familles.length; n++) {
        if (Jeu.familles[n] == famille) {
            return true;
        }
    }
    return false;
}

function musique() {
    for (let n = 1; n <= Jeu.NOMBRE_MUSIQUE; n++) {
        Jeu.musique.liste.push(n);
    }
    shuffle(Jeu.musique.liste);
    Jeu.musique.slot = 0;
    Jeu.musique.audio.src = "Musique/" + Jeu.musique.liste[Jeu.musique.slot] + ".mp3";
    Jeu.musique.audio.play();
    Jeu.musique.audio.addEventListener('ended', function () {
        Jeu.musique.slot++;
        if (Jeu.musique.slot > Jeu.NOMBRE_MUSIQUE) {
            Jeu.musique.slot = 0;
        }
        Jeu.musique.audio.src = "Musique/" + Jeu.musique.liste[Jeu.musique.slot] + ".mp3";
        Jeu.musique.audio.play();
    }, true);
}

function ecran_titre() {
    initialiser();
    afficher("<center><img src='Images/Title.png' style='width:30em;border:solid;border-width:5px;'/>");
    saut();
    afficher("Version BETA");
    saut(3);
    fonction("Se connecter", "musique();accueil()", "menu");
    afficher("</center>");
    actualiser();
}

function accueil() {
    initialiser();
    afficher("<center><img src='Images/Title.png' style='width:30em;border:solid;border-width:5px;'/>");
    saut();
    afficher("Version BETA");
    saut(3);
    fonction("Jouer", "nouvelle_partie()", "menu");
    saut(2);
    fonction("Bibliothèque", "collection_init();collection()", "menu");
    saut(2);
    fonction("Univers", "lore()", "menu");
    saut(2);
    fonction("Options", "option_menu()", "menu");
    afficher("</center>");
    actualiser();
}
 
function nouvelle_partie() {
    Jeu.en_jeu = true;
    Jeu.joueur = {
        vie: 100,
        vie_max: 100,
        ressources: [],
        boutique: [],
        main: [],
        terrain: [],
        defausse: [],
        regions: []
    }
    Jeu.adverse = {
        vie: 10,
        vie_max: 10,
        ressources: [],
        boutique: [],
        main: [],
        terrain: [],
        defausse: [],
        regions: [],
        liste_regions: [],
    }
    for (let n = 0; n < Jeu.ressources.length; n++) {
        let ressource = {
            courant: 0,
            max: 0,
            reserve: 0
        }
        Jeu.joueur.ressources.push(ressource);
    }
    Jeu.joueur.ressources[0].courant = Jeu.joueur.ressources[0].max = 3;
    for (let n = 0; n < Jeu.ressources.length; n++) {
        let ressource = {
            courant: 0,
            max: 0
        }
        Jeu.adverse.ressources.push(ressource);
    }
    Jeu.etage = 1;
    Jeu.boutique_niveau = 1;
    Jeu.boutique_amelioration = 5;
    Jeu.ressource_sup = 1;
    Jeu.region_active = 0;
    Jeu.combat.etat = false;
    ajouter(obtenir_carte(113), "joueur", "regions");
    ajouter(obtenir_carte(78), "joueur", "regions");
    ajouter(obtenir_carte(31), "joueur", "main");
    ajouter(obtenir_carte(1), "joueur", "terrain");
    for (let n = 0; n < Jeu.joueur.main.length; n++) {
        Jeu.joueur.main[n].cache = true;
    }
    boutique_actualiser();
    adversaire_generer(1);
    adversaire_acheter();
    adversaire_generer(2);
    adversaire_jouer();
    adversaire_acheter();
    adversaire_generer(3);
    menu();
}

function menu() {
    initialiser();
    div("", "bar");
    div("", "flex");
    fonction("Options", "option_jeu()");
    div_fin();
    div("", "flex");
    fonction("Combattre", "combat_nouveau()");
    div_fin();
    div("", "flex");
    fonction("Options", "option_jeu()");
    div_fin();
    div_fin();
    afficher("<center>");
    afficher("Étage : " + Jeu.etage);
    afficher("</center>");
    joueur_voir();
    adversaire_voir();
    div("carte_main", "affichage");
    div_fin();
    div("carte_side", "affichage");
    div_fin();
    div("message", "affichage");
    div();
    actualiser();
    actualiser_zone();
}

function joueur_voir() {
    div("main");
    div("joueur_meneur", "zone");
    div_fin();
    saut();
    afficher("</i>");
    div("joueur_regions", "zone");
    div_fin();
    saut();
    div("joueur_boutique", "zone");
    div_fin();
    saut();
    div("joueur_main", "zone");
    div_fin();
    saut();
    div("joueur_terrain", "zone");
    div_fin();
    saut();
    div("joueur_defausse", "zone");
    div_fin();
    div_fin();
}

function adversaire_voir() {
    div("side");
    div("adverse_meneur", "zone");
    div_fin();
    saut();
    afficher("</i>");
    div("adverse_regions", "zone");
    div_fin();
    saut();
    div("adverse_boutique", "zone");
    div_fin();
    saut();
    div("adverse_main", "zone");
    div_fin();
    saut();
    div("adverse_terrain", "zone");
    div_fin();
    saut();
    div("adverse_defausse", "zone");
    div_fin();
    div_fin();
}

function afficher_meneur(camp) {
    let texte = "";
    texte += "<u>Meneur";
    if (camp == "adverse") {
        texte += " adverse";
    }
    texte += " :</u> " + Jeu[camp].vie + " / " + Jeu[camp].vie_max + " VIE";
    texte += "<br/>";
    for (let n = 0; n < Jeu.ressources.length; n++) {
        if (Jeu[camp].ressources[n].max > 0 || Jeu[camp].ressources[n].courant > 0 || Jeu[camp].ressources[n].reserve > 0) {
            texte += Jeu.ressources[n].nom + " : " + Jeu[camp].ressources[n].courant + " / " + Jeu[camp].ressources[n].max;
            if (Jeu[camp].ressources[n].reserve > 0) {
                texte += " + " + Jeu[camp].ressources[n].reserve;
            }
            texte += "<br/>";
        }
    }
    if (camp == "joueur" && Jeu.ressource_sup > 0) {
        texte += "<button onclick='javascript:ressource_choisir()'>Ajouter une ressource</button>";
        texte += "<br/>";
    }
    div_actualiser(camp + "_meneur", texte);
}

function afficher_zone(camp, zone, nom, vide) {
    let texte = "";
    if (camp == "joueur" && zone == "boutique") {
        texte += "<div id='boutique'>";
        texte += "<u>Boutique Nv " + Jeu.boutique_niveau + " :</u> ";
        if (Jeu.boutique_niveau < 20) {
            texte += "<button onclick='javascript:boutique_ameliorer()'>Améliorer</button>";
            texte += " (" + Jeu.boutique_amelioration + " Or) - ";
        }
        texte += "<button onclick='javascript:boutique_rafraichir()'>Actualiser</button>";
        texte += " (" + (Jeu.boutique_niveau + 1) + " Or)";
        texte += " - ";
        texte += "<button onclick='javascript:boutique_verrouiller()'>Verrouiller</button>";
        texte += " - <i>" + Jeu.joueur.boutique.length + " carte";
        if (Jeu.joueur.boutique.length > 1) {
            texte += "s";
        }
        texte += "</i>";
        texte += "</div>";
    }
    else {
        texte += "<u>" + nom + " :</u> <i>" + Jeu[camp][zone].length + " carte";
        if (Jeu[camp][zone].length > 1) {
            texte += "s";
        }
        texte += "</i>";
        texte += "</br>";
    }
    if (Jeu[camp][zone].length > 0) {
        for (let n = 0; n < Jeu[camp][zone].length; n++) {
            texte += "<div class='carte'>";
            texte += "<div>";
            if (camp == "joueur" && ((zone == "terrain" && Jeu[camp][zone][n].type == "Créature" || (statistique(Jeu[camp][zone][n], "mobile") && !statistique(Jeu[camp][zone][n], "silence"))) || (zone == "main"))) {
                if (n > 0) {
                    texte += "<button onclick='javascript:monter(" + '"joueur","' + zone + '",' + n + ")'>&#8679</button>";
                    texte += " ";
                }
                if (n < Jeu[camp][zone].length - 1) {
                    texte += "<button onclick='javascript:descendre(" + '"joueur","' + zone + '",' + n + ")'>&#8681</button>";
                    texte += " ";
                }
            }
            if (camp == "joueur" || ((!Jeu[camp][zone][n].camouflage || Jeu[camp][zone][n].silence) && !Jeu[camp][zone][n].cache)) {
                texte += afficher_carte(camp, zone, n);
            }
            else {
                texte += "???";
            }
            texte += "</div>";
            texte += "<div>";
            if (camp == "joueur" && ["main", "terrain"].includes(zone)) {
                if (zone == "main") {
                    texte += "<button onclick='javascript:poser(" + n + ")'>Poser</button>";
                    texte += " ";
                }
                texte += "<button onclick='javascript:vendre(" + '"' + zone + '",' + n + ")'>Vendre</button>";
            }
            else if (camp == "joueur" && zone == "boutique") {
                texte += "<button onclick='javascript:acheter(" + '"joueur",' + n + ")'>Acheter</button>";
            }
            else if (camp == "joueur" && zone == "regions" && Jeu.region_active != n) {
                texte += "<button onclick='javascript:Jeu.region_active=" + n + ";actualiser_zone();'>Choisir</button>"; fonction("Choisir", "Jeu.region_active=" + n + ";menu();");
            }
            texte += "</div>";
            texte += "</div>";
        }
    }
    else {
        texte += "<i>" + vide + "</i>";
        texte += "<br/>";
    }
    div_actualiser(camp + "_" + zone, texte);
}

function actualiser_zone() {
    afficher_meneur("joueur");
    afficher_zone("joueur", "regions", "Régions");
    afficher_zone("joueur", "boutique", "Boutique", "Votre boutique est vide");
    afficher_zone("joueur", "main", "Main", "Votre main est vide");
    afficher_zone("joueur", "terrain", "Terrain", "Votre terrain est vide");
    afficher_zone("joueur", "defausse", "Défausse", "Votre défausse est vide");
    afficher_meneur("adverse");
    afficher_zone("adverse", "regions", "Régions adverses");
    afficher_zone("adverse", "boutique", "Boutique adverse", "La boutique adverse est vide");
    afficher_zone("adverse", "main", "Main adverse", "La main adverse est vide");
    afficher_zone("adverse", "terrain", "Terrain adverse", "La terrain adverse est vide");
    afficher_zone("adverse", "defausse", "Défausse adverse", "La défausse adverse est vide");
    fermer_carte("carte_main");
    fermer_carte("carte_side");
}

function afficher_carte(camp, zone, slot, div = "auto") {
    let carte = Jeu[camp][zone][slot];
    let texte = "";
    if (carte.verrouillage) {
        texte += "[";
    }
    if (!Jeu.combat.etat || !Jeu.combat.auto) {
        let string = "carte_voir(" + '"' + camp + '","' + zone + '",' + slot;
        if (div == "auto") {
            if (camp == "adverse") {
                string += ',"carte_main"';
            }
            else {
                string += ',"carte_side"';
            }
        }
        else {
            string += ',"' + div + '"';
        }
        string += ")";
        texte += "<button onclick='javascript:" + string + "'>" + carte.nom + "</button>";
    }
    else {
        texte += carte.nom;
    }
    if (carte.verrouillage) {
        texte += "]";
    }
    if (["Créature", "Bâtiment"].includes(carte.type)) {
        if (carte.type == "Créature") {
            texte += " " + statistique(carte, "attaque") + " ATT";
        }
        texte += " " + statistique(carte, "defense") + " DEF " + carte.vie + "/" + statistique(carte, "vie_max");
        if (carte.vie_sup > 0) {
            texte += " (+ " + carte.vie_sup + ")";
        }
        texte += " VIE";
    }
    return texte;
}

function carte_voir(camp, zone, slot, div) {
    carte_afficher(Jeu[camp][zone][slot], div);
}

function carte_voir_id(carte_id, div) {
    carte_afficher(obtenir_carte(carte_id), div);
}

function carte_afficher(carte, div) {
    let texte = "";
    texte += "<div style='display: flex;justify-content: space-between;'><div><u>Nom :</u> " + carte.nom + "</div>";
    texte += "<div><button onclick='javascript:fermer_carte(" + '"' + div + '"' + ")'>Fermer</button></div>";
    texte += "</div>";
    if (carte.camp == "joueur") {
        texte += "<u>Visibilité :</u> <i>";
        if (carte.cache || (carte.camouflage && !carte.silence)) {
            texte += "Caché";
        }
        else {
            texte += "Visible";
        }
        texte += "</i> <br/>";
    }
    texte += "<u>Éléments :</u> ";
    if (carte.elements.length > 0) {
        for (let n = 0; n < carte.elements.length; n++) {
            if (n > 0) {
                texte += ", ";
            }
            texte += carte.elements[n];
        }
    }
    else {
        texte += "Neutre";
    }
    texte += "<br/>";
    texte += "<u>Coût :</u> ";
    let premier_cout = true;
    for (let n = 0; n < carte.cout.length; n++) {
        if (carte.cout[n] > 0) {
            if (!premier_cout) {
                texte += ", ";
            }
            premier_cout = false;
            texte += carte.cout[n] + " " + Jeu.ressources[n].nom;
        }
    }
    if (premier_cout) {
        texte += "Rien";
    }
    texte += "<br/>";
    texte += "<u>Vente :</u> ";
    let premiere_vente = true;
    for (let n = 0; n < carte.vente.length; n++) {
        if (carte.vente[n] > 0) {
            if (!premiere_vente) {
                texte += ", ";
            }
            premiere_vente = false;
            texte += carte.vente[n] + " " + Jeu.ressources[n].nom;
        }
    }
    if (premiere_vente) {
        texte += "Rien";
    }
    texte += "<br/>";
    texte += "<u>Type :</u> " + carte.type + "<br/>";
    texte += "<u>Familles :</u> ";
    if (carte.familles.length > 0) {
        for (let n = 0; n < carte.familles.length; n++) {
            if (n > 0) {
                texte += ", ";
            }
            texte += carte.familles[n];
        }
    }
    else {
        texte += "Aucune";
    }
    texte += "<br/>";
    texte += "<u>Effet :</u> " + carte.texte() + "<br/>";
    if (carte.exclusif) {
        texte += "Cette carte ne peut pas être piochée. <br/>";
    }
    if (statistique(carte, "eternite") > 0) {
        texte += effet_talent_voir("Éternité", carte) + "<br/>";
    }
    if (statistique(carte, "temporaire")) {
        texte += effet_talent_voir("Temporaire", carte) + "<br/>";
    }
    if (statistique(carte, "ephemere")) {
        texte += effet_talent_voir("Éphémère", carte) + "<br/>";
    }
    if (["Créature", "Bâtiment"].includes(carte.type)) {
        if (statistique(carte, "protection")) {
            texte += effet_talent_voir("Protection", carte) + "<br/>";
        }
        if (statistique(carte, "rapidite")) {
            texte += effet_talent_voir("Rapidité", carte) + "<br/>";
        }
        if (statistique(carte, "action_max") > 1) {
            texte += effet_talent_voir("Action", carte, statistique(carte, "action_max")) + "<br/>";
        }
        else if (statistique(carte, "action_max") == 0) {
            texte += effet_talent_voir("Inactif", carte) + "<br/>";
        }
        if (carte.brulure > 0) {
            texte += effet_talent_voir("Brûlure", carte, carte.brulure) + "<br/>";
        }
        if (statistique(carte, "sorcellerie") > 0) {
            texte += effet_talent_voir("Sorcellerie", carte, statistique(carte, "sorcellerie")) + "<br/>";
        }
        if (statistique(carte, "resistance") > 0) {
            texte += effet_talent_voir("Résistance", carte, statistique(carte, "resistance")) + "<br/>";
        }
        if (statistique(carte, "epine") > 0) {
            texte += effet_talent_voir("Épine", carte, statistique(carte, "epine")) + "<br/>";
        }
        if (statistique(carte, "regeneration") > 0) {
            texte += effet_talent_voir("Régénération", carte, statistique(carte, "regeneration")) + "<br/>";
        }
        if (carte.compteur > 0) {
            texte += effet_talent_voir("Compteur", carte, carte.compteur) + "<br/>";
        }
        if (carte.gel > 0) {
            texte += effet_talent_voir("Gel", carte, carte.gel) + "<br/>";
        }
        if (carte.camouflage) {
            texte += effet_talent_voir("Camouflage", carte) + "<br/>";
        }
        if (statistique(carte, "silence")) {
            texte += effet_talent_voir("Silence", carte) + "<br/>";
        }
        if (carte.esquive > 0) {
            texte += effet_talent_voir("Esquive", carte) + "<br/>";
        }
    }
    if (carte.type == "Bâtiment") {
        if (carte.mobile) {
            texte += effet_talent_voir("Mobile", carte) + "<br/>";
        }
    }
    if (carte.type == "Créature") {
        if (statistique(carte, "equipement_max") > 1) {
            texte += effet_talent_voir("Maniement", carte, statistique(carte, "equipement_max")) + "<br/>";
        }
        if (statistique(carte, "vol_de_vie")) {
            texte += effet_talent_voir("Vol de vie", carte, statistique(carte, "vol_de_vie")) + "<br/>";
        }
        if (statistique(carte, "percee") > 0) {
            texte += effet_talent_voir("Percée", carte, statistique(carte, "percee")) + "<br/>";
        }
        if (statistique(carte, "portee") > 0) {
            texte += effet_talent_voir("Portée", carte) + "<br/>";
        }
        if (statistique(carte, "letalite")) {
            texte += effet_talent_voir("Létalité", carte) + "<br/>";
        }
        if (carte.poison > 0) {
            texte += effet_talent_voir("Poison", carte, carte.poison) + "<br/>";
        }
        if (carte.contamination > 0) {
            texte += effet_talent_voir("Contamination", carte, carte.contamination) + "<br/>";
        }
        if (carte.etourdissement > 0) {
            texte += effet_talent_voir("Étourdissement", carte) + "<br/>";
        }
        if (carte.saignement > 0) {
            texte += effet_talent_voir("Saignement", carte, carte.saignement) + "<br/>";
        }
        if (statistique(carte, "erosion") > 0) {
            texte += effet_talent_voir("Érosion", carte, statistique(carte, "erosion")) + "<br/>";
        }
        if (statistique(carte, "charge")) {
            texte += effet_talent_voir("Charge", carte) + "<br/>";
        }
        texte += "<u>Attaque :</u> " + statistique(carte, "attaque");
        if (carte.stat_etage.attaque > 0 || carte.stat_tour.attaque > 0) {
            texte += " (" + carte.attaque + " de base";
            if (carte.stat_etage.attaque > 0) {
                texte += " + " + carte.stat_etage.attaque + " jusqu'à la fin de la phase de combat";
            }
            if (carte.stat_tour.attaque > 0) {
                texte += " + " + carte.stat_tour.attaque + " jusqu'à la fin du tour de combat";
            }
            texte += ")";
        }
        texte += "<br/>";
    }
    if (carte.type == "Créature" || carte.type == "Bâtiment") {
        texte += "<u>Défense :</u> " + statistique(carte, "defense");
        if (carte.stat_etage.defense > 0 || carte.stat_tour.defense > 0) {
            texte += " (" + carte.defense + " de base";
            if (carte.stat_etage.defense > 0) {
                texte += " + " + carte.stat_etage.defense + " jusqu'à la fin de la phase de combat";
            }
            if (carte.stat_tour.defense > 0) {
                texte += " + " + carte.stat_tour.defense + " jusqu'à la fin du tour de combat";
            }
            texte += ")";
        }
        texte += "<br/>";
        texte += "<u>Vie :</u> " + carte.vie + " / " + statistique(carte, "vie_max");
        if (carte.vie_sup > 0) {
            texte += " (+ " + carte.vie_sup + ")";
        }
        if (carte.stat_etage.vie_max > 0 || carte.stat_tour.vie_max > 0) {
            texte += " (" + carte.vie_max + " de base";
            if (carte.stat_etage.vie_max > 0) {
                texte += " + " + carte.stat_etage.vie_max + " jusqu'à la fin de la phase de combat";
            }
            if (carte.stat_tour.vie_max > 0) {
                texte += " + " + carte.stat_tour.vie_max + " jusqu'à la fin du tour de combat";
            }
            texte += ")";
        }
        texte += "<br/>";
    }
    if (carte.type == "Créature") {
        texte += "<u>Équipements :</u> <br/>";
        if (carte.equipements.length > 0) {
            for (let n = 0; n < carte.equipements.length; n++) {
                texte += "<button onclick='javascript:carte_afficher(Jeu[" + '"' + carte.camp + '"' + "][" + '"' + carte.zone + '"' + "][" + '"' + carte.slot + '"' + "].equipements[" + n + "], " + '"' + div + '"' + ")'>" + carte.equipements[n].nom + "</button> <br/>";
            }
        }
        else {
            texte += "Aucun <br/>";
        }
    }
    texte += "<br/> <div id='description'><span id='contenu'>" + carte.description + "</span></div>";
    div_actualiser(div, texte);
    document.getElementById(div).setAttribute("style", "display : block");
}

function fermer_carte(div) {
    document.getElementById(div).setAttribute("style", "display : none");
}

function ressource_choisir() {
    initialiser();
    fonction("Retour", "menu()");
    saut(2);
    for (let n = 1; n < Jeu.ressources.length; n++) {
        fonction(Jeu.ressources[n].nom, "ressource_ajouter(" + n + ")");
        afficher(" : " + Jeu.joueur.ressources[n].courant + " / " + Jeu.joueur.ressources[n].max);
        saut();
    }
    actualiser();
}

function ressource_ajouter(ressource_slot) {
    Jeu.ressource_sup--;
    Jeu.joueur.ressources[ressource_slot].courant++;
    Jeu.joueur.ressources[ressource_slot].max++;
    menu();
}

function cout_total(carte) {
    let cout = 0;
    for (let n = 0; n < carte.cout.length; n++) {
        cout += carte.cout[n];
    }
    return cout;
}

function boutique_rafraichir() {
    if (Jeu.joueur.ressources[0].courant >= Jeu.boutique_niveau + 1) {
        Jeu.joueur.ressources[0].courant -= Jeu.boutique_niveau + 1;
        boutique_actualiser();
        actualiser_zone();
    }
}

function boutique_actualiser() {
    let nombre_actualisation = 3 + parseInt((Jeu.boutique_niveau - 1) / 2);
    for (let n = 0; n < Jeu.joueur.boutique.length; n++) {
        if (Jeu.joueur.boutique[n].verrouillage) {
            nombre_actualisation--;
        }
        else {
            enlever(Jeu.joueur.boutique[n]);
            n--;
        }
    }
    pioches("joueur", nombre_actualisation);
}

function boutique_generer() {
    let carte = obtenir_carte(parseInt(Math.random() * Jeu.NOMBRE_CARTE + 1));
    while (!Jeu.joueur.regions[Jeu.region_active].boutique_generer(carte)) {
        carte = obtenir_carte(parseInt(Math.random() * Jeu.NOMBRE_CARTE + 1));
    }
    return carte;
}

function boutique_ameliorer() {
    if (Jeu.joueur.ressources[0].courant + Jeu.joueur.ressources[0].reserve >= Jeu.boutique_amelioration) {
        if (Jeu.joueur.ressources[0].courant >= Jeu.boutique_amelioration) {
            Jeu.joueur.ressources[0].courant -= Jeu.boutique_amelioration;
        }
        else {
            Jeu.boutique_amelioration -= Jeu.joueur.ressources[0].courant;
            Jeu.joueur.ressources[0].courant = 0;
            Jeu.joueur.ressources[0].reserve -= Jeu.boutique_amelioration;
        }
        Jeu.boutique_niveau++;
        Jeu.boutique_amelioration = Jeu.boutique_niveau * 5;
        actualiser_zone();
    }
}

function boutique_verrouiller() {
    let verrou = false;
    for (let n = 0; n < Jeu.joueur.boutique.length; n++) {
        if (!Jeu.joueur.boutique[n].verrouillage) {
            verrou = true;
            break;
        }
    }
    for (let n = 0; n < Jeu.joueur.boutique.length; n++) {
        Jeu.joueur.boutique[n].verrouillage = verrou;
    }
    actualiser_zone();
}

function acheter(camp, boutique_slot) {
    let achat = true;
    for (let n = 0; n < Jeu.ressources.length; n++) {
        if (Jeu[camp].ressources[n].courant + Jeu[camp].ressources[n].reserve < Jeu[camp].boutique[boutique_slot].cout[n]) {
            achat = false;
        }
    }
    if (achat) {
        for (let n = 0; n < Jeu.ressources.length; n++) {
            if (Jeu[camp].ressources[n].courant > Jeu[camp].boutique[boutique_slot].cout[n]) {
                Jeu[camp].ressources[n].courant -= Jeu[camp].boutique[boutique_slot].cout[n];
            }
            else {
                Jeu[camp].ressources[n].reserve -= Jeu[camp].boutique[boutique_slot].cout[n] - Jeu[camp].ressources[n].courant;
                Jeu[camp].ressources[n].courant = 0;
            }
        }
        Jeu[camp].boutique[boutique_slot].verrouillage = false;
        deplacer(Jeu[camp].boutique[boutique_slot], camp, "main");
        if (camp == "joueur") {
            actualiser_zone();
        }
        return true;
    }
    return false;
}

function vendre(zone, slot) {
    if (!statistique(Jeu.joueur[zone][slot], "silence")) {
        Jeu.joueur[zone][slot].effet_vente();
    }
    for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
        if (!statistique(Jeu.joueur.terrain[n], "silence")) {
            Jeu.joueur.terrain[n].effet_vente_carte();
        }
    }
    for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
        if (!statistique(Jeu.adverse.terrain[n], "silence")) {
            Jeu.adverse.terrain[n].effet_vente_carte();
        }
    }
    for (let n = 0; n < Jeu.ressources.length; n++) {
        Jeu.joueur.ressources[n].courant += Jeu.joueur[zone][slot].vente[n];
    }
    enlever(Jeu.joueur[zone][slot]);
    actualiser_zone();
}

function etage_suivant() {
    Jeu.etage++;
    if (Jeu.etage <= 100) {
        Jeu.joueur.ressources[0].max++;
        Jeu.ressource_sup = 1;
        etage_fin();
        if (Jeu.etage == 100) {
            Jeu.adverse.vie = Jeu.adverse.vie_max = 100;
        }
        else if (Jeu.etage % 10 == 0) {
            Jeu.adverse.vie = Jeu.adverse.vie_max = 30;
        }
        else {
            Jeu.adverse.vie = Jeu.adverse.vie_max = 10;
        }
        adversaire_jouer();
        adversaire_acheter();
        if (Jeu.etage < 100) {
            adversaire_generer(Jeu.etage + 2);
        }
        etage_debut();
        menu();
    }
    else {
        victoire();
    }
}

function etage_fin() {
    for (let n = 0; n < Jeu.ressources.length; n++) {
        Jeu.joueur.ressources[n].courant = Jeu.joueur.ressources[n].max;
    }
    let joueur_terrain = [];
    for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
        joueur_terrain.push(Jeu.joueur.terrain[n]);
    }
    let joueur_main = [];
    for (let n = 0; n < Jeu.joueur.main.length; n++) {
        joueur_main.push(Jeu.joueur.main[n]);
    }
    let joueur_defausse = [];
    for (let n = 0; n < Jeu.joueur.defausse.length; n++) {
        joueur_defausse.push(Jeu.joueur.defausse[n]);
    }
    let adverse_terrain = [];
    for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
        adverse_terrain.push(Jeu.adverse.terrain[n]);
    }
    let adverse_main = [];
    for (let n = 0; n < Jeu.adverse.main.length; n++) {
        adverse_main.push(Jeu.adverse.main[n]);
    }
    let adverse_defausse = [];
    for (let n = 0; n < Jeu.adverse.defausse.length; n++) {
        adverse_defausse.push(Jeu.adverse.defausse[n]);
    }
    for (let n = 0; n < joueur_terrain.length; n++) {
        if (joueur_terrain[n].type == "Créature" && joueur_terrain[n].equipements.length > 0) {
            for (let i = 0; i < joueur_terrain[n].equipements.length; i++) {
                if (joueur_terrain[n].equipements[i].temporaire) {
                    joueur_terrain[n].equipements.splice(i, 1);
                    i--;
                }
            }
        }
        joueur_terrain[n].vie -= joueur_terrain[n].stat_etage.vie_max;
        joueur_terrain[n].stat_etage = obtenir_carte(0);
        joueur_terrain[n].vie -= joueur_terrain[n].stat_tour.vie_max;
        joueur_terrain[n].stat_tour = obtenir_carte(0);
        if (!statistique(joueur_terrain[n], "silence")) {
            joueur_terrain[n].effet_etage_fin();
        }
        if (statistique(joueur_terrain[n], "temporaire") && !statistique(joueur_terrain[n], "silence")) {
            enlever(joueur_terrain[n]);
        }
        else if (joueur_terrain[n].vie <= 0) {
            mort(joueur_terrain[n]);
        }
    }
    for (let n = 0; n < joueur_main.length; n++) {
        if (joueur_main[n].type == "Créature" && joueur_main[n].equipements.length > 0) {
            for (let i = 0; i < joueur_main[n].equipements.length; i++) {
                if (joueur_main[n].equipements[i].temporaire) {
                    joueur_main[n].equipements.splice(i, 1);
                    i--;
                }
            }
        }
        if (["Créature", "Bâtiment"].includes(joueur_main[n].type)) {
            joueur_main[n].vie -= joueur_main[n].stat_etage.vie_max;
            joueur_main[n].stat_etage = obtenir_carte(0);
        }
        if (statistique(joueur_main[n], "temporaire") && !statistique(joueur_main[n], "silence")) {
            enlever(joueur_main[n]);
        }
        else if (["Créature", "Bâtiment"].includes(joueur_main[n].type) && joueur_main[n].vie <= 0) {
            mort(joueur_main[n]);
        }
    }
    for (let n = 0; n < joueur_defausse.length; n++) {
        if (joueur_defausse[n].type == "Créature" && joueur_defausse[n].equipements.length > 0) {
            for (let i = 0; i < joueur_defausse[n].equipements.length; i++) {
                if (joueur_defausse[n].equipements[i].temporaire) {
                    joueur_defausse[n].equipements.splice(i, 1);
                    i--;
                }
            }
        }
        if (["Créature", "Bâtiment"].includes(joueur_defausse[n].type)) {
            joueur_defausse[n].vie -= joueur_defausse[n].stat_etage.vie_max;
            joueur_defausse[n].stat_etage = obtenir_carte(0);
            if (joueur_defausse[n].vie < 0) {
                joueur_defausse[n].vie = 0;
            }
        }
        joueur_defausse[n].etage_mort++;
        if ((joueur_defausse[n].etage_mort > 1 && !(joueur_defausse[n].eternite && !statistique(joueur_defausse[n], "silence"))) || (statistique(joueur_defausse[n], "temporaire") && !statistique(joueur_defausse[n], "silence"))) {
            enlever(joueur_defausse[n]);
        }
    }
    for (let n = 0; n < adverse_terrain.length; n++) {
        if (adverse_terrain[n].type == "Créature" && adverse_terrain[n].equipements.length > 0) {
            for (let i = 0; i < adverse_terrain[n].equipements.length; i++) {
                if (adverse_terrain[n].equipements[i].temporaire) {
                    adverse_terrain[n].equipements.splice(i, 1);
                    i--;
                }
            }
        }
        adverse_terrain[n].vie -= adverse_terrain[n].stat_etage.vie_max;
        adverse_terrain[n].stat_etage = obtenir_carte(0);
        adverse_terrain[n].vie -= adverse_terrain[n].stat_tour.vie_max;
        adverse_terrain[n].stat_tour = obtenir_carte(0);
        if (!statistique(adverse_terrain[n], "silence")) {
            adverse_terrain[n].effet_etage_fin();
        }
        if (statistique(adverse_terrain[n], "temporaire") && !statistique(adverse_terrain[n], "silence")) {
            enlever(adverse_terrain[n]);
        }
        else if (adverse_terrain[n].vie <= 0) {
            mort(adverse_terrain[n]);
        }
    }
    for (let n = 0; n < adverse_main.length; n++) {
        if (adverse_main[n].type == "Créature" && adverse_main[n].equipements.length > 0) {
            for (let i = 0; i < adverse_main[n].equipements.length; i++) {
                if (adverse_main[n].equipements[i].temporaire) {
                    adverse_main[n].equipements.splice(i, 1);
                    i--;
                }
            }
        }
        if (["Créature", "Bâtiment"].includes(adverse_main[n].type)) {
            adverse_main[n].vie -= adverse_main[n].stat_etage.vie_max;
            adverse_main[n].stat_etage = obtenir_carte(0);
        }
        if (statistique(adverse_main[n], "temporaire") && !statistique(adverse_main[n], "silence")) {
            enlever(adverse_main[n]);
        }
        else if (["Créature", "Bâtiment"].includes(adverse_main[n].type) && adverse_main[n].vie <= 0) {
            mort(adverse_main[n]);
        }
    }
    for (let n = 0; n < adverse_defausse.length; n++) {
        if (adverse_defausse[n].type == "Créature" && adverse_defausse[n].equipements.length > 0) {
            for (let i = 0; i < adverse_defausse[n].equipements.length; i++) {
                if (adverse_defausse[n].equipements[i].temporaire) {
                    adverse_defausse[n].equipements.splice(i, 1);
                    i--;
                }
            }
        }
        if (["Créature", "Bâtiment"].includes(adverse_defausse[n].type)) {
            adverse_defausse[n].vie -= adverse_defausse[n].stat_etage.vie_max;
            adverse_defausse[n].stat_etage = obtenir_carte(0);
            if (adverse_defausse[n].vie < 0) {
                adverse_defausse[n].vie = 0;
            }
        }
        adverse_defausse[n].etage_mort++;
        if ((adverse_defausse[n].etage_mort > 1 && !(adverse_defausse[n].eternite && !statistique(adverse_defausse[n], "silence"))) || (statistique(adverse_defausse[n], "temporaire") && !statistique(adverse_defausse[n], "silence"))) {
            enlever(adverse_defausse[n]);
        }
    }
    if (Jeu.joueur.vie > 0) {
        menu();
    }
    else {
        game_over();
    }
}

function etage_debut() {
    boutique_actualiser();
    let array = [];
    for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
        array.push(Jeu.joueur.terrain[n]);
    }
    for (let n = 0; n < array.length; n++) {
        array[n].effet_etage_debut();
        for (let i = 0; i < array[n].equipements.length; i++) {
            array[n].equipements[i].stat_equipement.effet_etage_debut(array[n]);
        }
    }
    array = [];
    for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
        array.push(Jeu.adverse.terrain[n]);
    }
    for (let n = 0; n < array.length; n++) {
        array[n].effet_etage_debut();
        for (let i = 0; i < array[n].equipements.length; i++) {
            array[n].equipements[i].stat_equipement.effet_etage_debut(array[n]);
        }
    }
}

function adversaire_generer(etage) {
    Jeu.adverse.boutique = [];
    for (let n = 0; n < Jeu.ressources.length; n++) {
        Jeu.adverse.ressources[n].courant = Jeu.adverse.ressources[n].max = Jeu.adverse.ressources[n].reserve = 0;
    }
    /*
    if (etage == 1) {
        for (let n = 1; n <= Jeu.NOMBRE_CARTE; n++) {
            ajouter(obtenir_carte(n), "adverse", "boutique");
        }
    }
    */
    if (etage % 10 != 0) {
        switch (Math.trunc(etage / 10)) {
            case 0:
                Jeu.adverse.liste_regions.push([103]);
                Jeu.adverse.ressources[9].courant = Jeu.adverse.ressources[9].max = 2;
                ajouter(obtenir_carte(5), "adverse", "boutique");
                ajouter(obtenir_carte(5), "adverse", "boutique");
                break;
            case 1:
                Jeu.adverse.liste_regions.push([103]);
                Jeu.adverse.ressources[0].courant = Jeu.adverse.ressources[0].max = 4;
                Jeu.adverse.ressources[9].courant = Jeu.adverse.ressources[9].max = 2;
                ajouter(obtenir_carte(13), "adverse", "boutique");
                ajouter(obtenir_carte(13), "adverse", "boutique");
                break;
            case 2:
                Jeu.adverse.liste_regions.push([103]);
                Jeu.adverse.ressources[0].courant = Jeu.adverse.ressources[0].max = 4;
                Jeu.adverse.ressources[9].courant = Jeu.adverse.ressources[9].max = 4;
                ajouter(obtenir_carte(60), "adverse", "boutique");
                ajouter(obtenir_carte(60), "adverse", "boutique");
                break;
            case 3:
                Jeu.adverse.liste_regions.push([103]);
                Jeu.adverse.ressources[0].courant = Jeu.adverse.ressources[0].max = 10;
                Jeu.adverse.ressources[9].courant = Jeu.adverse.ressources[9].max = 8;
                ajouter(obtenir_carte(127), "adverse", "boutique");
                ajouter(obtenir_carte(127), "adverse", "boutique");
                break;
            case 4:
                Jeu.adverse.liste_regions.push([103]);
                Jeu.adverse.ressources[0].courant = Jeu.adverse.ressources[0].max = 18;
                Jeu.adverse.ressources[9].courant = Jeu.adverse.ressources[9].max = 16;
                ajouter(obtenir_carte(14), "adverse", "boutique");
                ajouter(obtenir_carte(14), "adverse", "boutique");
                break;
            case 5:
                Jeu.adverse.liste_regions.push([105]);
                Jeu.adverse.ressources[0].courant = Jeu.adverse.ressources[0].max = 50;
                Jeu.adverse.ressources[11].courant = Jeu.adverse.ressources[11].max = 48;
                ajouter(obtenir_carte(383), "adverse", "boutique");
                ajouter(obtenir_carte(57), "adverse", "boutique");
                ajouter(obtenir_carte(57), "adverse", "boutique");
                break;
            case 6:
                Jeu.adverse.liste_regions.push([103]);
                Jeu.adverse.ressources[0].courant = Jeu.adverse.ressources[0].max = 42;
                Jeu.adverse.ressources[8].courant = Jeu.adverse.ressources[8].max = 20;
                Jeu.adverse.ressources[9].courant = Jeu.adverse.ressources[9].max = 22;
                ajouter(obtenir_carte(13), "adverse", "boutique");
                ajouter(obtenir_carte(13), "adverse", "boutique");
                ajouter(obtenir_carte(208), "adverse", "boutique");
                ajouter(obtenir_carte(208), "adverse", "boutique");
                break;
            case 7:
                Jeu.adverse.liste_regions.push([103]);
                Jeu.adverse.ressources[0].courant = Jeu.adverse.ressources[0].max = 29;
                Jeu.adverse.ressources[1].courant = Jeu.adverse.ressources[1].max = 10;
                Jeu.adverse.ressources[9].courant = Jeu.adverse.ressources[9].max = 10;
                ajouter(obtenir_carte(37), "adverse", "boutique");
                ajouter(obtenir_carte(279), "adverse", "boutique");
                ajouter(obtenir_carte(279), "adverse", "boutique");
                break;
            case 8:
                Jeu.adverse.liste_regions.push([103]);
                Jeu.adverse.ressources[0].courant = Jeu.adverse.ressources[0].max = 56;
                Jeu.adverse.ressources[8].courant = Jeu.adverse.ressources[8].max = 36;
                Jeu.adverse.ressources[9].courant = Jeu.adverse.ressources[9].max = 17;
                ajouter(obtenir_carte(46), "adverse", "boutique");
                ajouter(obtenir_carte(42), "adverse", "boutique");
                break;
            case 9:
                Jeu.adverse.liste_regions.push([78]);
                for (let n = 1; n < Jeu.ressources.length; n++) {
                    Jeu.adverse.ressources[n].courant = Jeu.adverse.ressources[n].max = 10;
                }
                ajouter(obtenir_carte(15), "adverse", "boutique");
                break;
        }
    }
    else {
        switch (etage) {
            case 10:
                Jeu.adverse.liste_regions.push([78]);
                Jeu.adverse.ressources[0].courant = Jeu.adverse.ressources[0].max = 39;
                ajouter(obtenir_carte(6), "adverse", "boutique");
                break;
            case 20:
                Jeu.adverse.liste_regions.push([78]);
                Jeu.adverse.ressources[0].courant = Jeu.adverse.ressources[0].max = 39;
                ajouter(obtenir_carte(6), "adverse", "boutique");
                break;
            case 30:
                Jeu.adverse.liste_regions.push([78]);
                Jeu.adverse.ressources[0].courant = Jeu.adverse.ressources[0].max = 39;
                ajouter(obtenir_carte(6), "adverse", "boutique");
                break;
            case 40:
                Jeu.adverse.liste_regions.push([78]);
                Jeu.adverse.ressources[0].courant = Jeu.adverse.ressources[0].max = 39;
                ajouter(obtenir_carte(6), "adverse", "boutique");
                break;
            case 50:
                Jeu.adverse.ressources[0].courant = Jeu.adverse.ressources[0].max = 39;
                ajouter(obtenir_carte(6), "adverse", "boutique");
                break;
            case 60:
                Jeu.adverse.liste_regions.push([78]);
                Jeu.adverse.ressources[0].courant = Jeu.adverse.ressources[0].max = 39;
                ajouter(obtenir_carte(6), "adverse", "boutique");
                break;
            case 70:
                Jeu.adverse.liste_regions.push([78]);
                Jeu.adverse.ressources[0].courant = Jeu.adverse.ressources[0].max = 39;
                ajouter(obtenir_carte(6), "adverse", "boutique");
                break;
            case 80:
                Jeu.adverse.liste_regions.push([78]);
                Jeu.adverse.ressources[0].courant = Jeu.adverse.ressources[0].max = 39;
                ajouter(obtenir_carte(6), "adverse", "boutique");
                break;
            case 90:
                Jeu.adverse.liste_regions.push([78]);
                Jeu.adverse.ressources[0].courant = Jeu.adverse.ressources[0].max = 39;
                ajouter(obtenir_carte(6), "adverse", "boutique");
                break;
            case 100:
                Jeu.adverse.liste_regions.push([78]);
                Jeu.adverse.ressources[0].courant = Jeu.adverse.ressources[0].max = 39;
                ajouter(obtenir_carte(6), "adverse", "boutique");
                break;
        }
    }
    for (let n = 0; n < Jeu.adverse.boutique.length; n++) {
        Jeu.adverse.boutique[n].cache = true;
    }
}

function adversaire_acheter() {
    for (let n = 0; n < Jeu.adverse.boutique.length; n++) {
        if (acheter("adverse", n)) {
            n--;
        }
    }
}

function adversaire_jouer() {
    Jeu.adverse.regions = [];
    for (let n = 0; n < Jeu.adverse.liste_regions[0].length; n++) {
        ajouter(obtenir_carte(Jeu.adverse.liste_regions[0][n]), "adverse", "regions");
    }
    Jeu.adverse.liste_regions.splice(0, 1);
    let verifier = true;
    while (Jeu.adverse.main.length > 0 && verifier) {
        verifier = false;
        for (let n = 0; n < Jeu.adverse.main.length; n++) {
            let carte = Jeu.adverse.main[n];
            if (carte.effet_pose()) {
                verifier = true;
                n--;
            }
        }
    }
}

function game_over() {
    initialiser();
    afficher("Vous avez dû abandonner à l'étage " + Jeu.etage);
    saut(2);
    fonction("Abandonner", "accueil()");
    actualiser();
}

function victoire() {
    initialiser();
    afficher("Victoire");
    saut(2);
    fonction("Ecran titre", "accueil()()");
    actualiser();
}

function monter(camp, zone, slot) {
    let carte = Jeu[camp][zone][slot];
    let trans = Jeu[camp][zone][slot - 1];
    Jeu[camp][zone][slot] = trans;
    Jeu[camp][zone][slot - 1] = carte;
    carte.slot--;
    trans.slot++;
    menu();
}

function descendre(camp, zone, slot) {
    let carte = Jeu[camp][zone][slot];
    let trans = Jeu[camp][zone][slot + 1];
    Jeu[camp][zone][slot] = trans;
    Jeu[camp][zone][slot + 1] = carte;
    carte.slot++;
    trans.slot--;
    menu();
}

function soin(carte, montant) {
    if (carte.vie < carte.vie_max) {
        carte.vie += montant;
        if (carte.vie > statistique(carte, "vie_max")) {
            carte.vie = statistique(carte, "vie_max");
        }
        if (!statistique(carte, "silence")) {
            carte.effet_soin(montant);
        }
        for (let n = 0; n < Jeu[carte.camp].terrain.length; n++) {
            if (!statistique(Jeu[carte.camp].terrain[n], "silence")) {
                Jeu[carte.camp].terrain[n].effet_soin_carte(carte);
            }
        }
    }
}

function degats(carte, montant) {
    let degat_result = {
        mort: false,
        degats: 0,
        surplus: 0,
    }
    if (!carte.esquive) {
        if (carte.resistance > 0 && !statistique(carte, "silence")) {
            montant -= carte.resistance;
            if (carte.vie_sup < 0) {
                carte.vie_sup = 0;
            }
        }
        if (carte.vie_sup > 0) {
            let trans = montant;
            montant -= carte.vie_sup;
            carte.vie_sup -= trans;
            if (carte.vie_sup < 0) {
                carte.vie_sup = 0;
            }
        }
        if (montant > 0) {
            degat_result.degats = montant;
            if (carte.vie < montant) {
                degat_result.surplus = montant - carte.vie;
                degat_result.degats = carte.vie;
            }
            carte.vie -= montant;
            if (!statistique(carte, "silence")) {
                carte.effet_degat();
            }
            if (carte.vie <= 0) {
                mort(carte);
                degat_result.mort = true;
            }
        }
    }
    else {
        carte.esquive = false;
    }
    return degat_result;
}

function mort(carte) {
    carte.vie = carte.vie_sup = 0;
    carte.effet_mort();
    for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
        if (!statistique(Jeu.joueur.terrain[n], "silence")) {
            Jeu.joueur.terrain[n].effet_mort_carte(carte);
        }
    }
    for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
        if (!statistique(Jeu.adverse.terrain[n], "silence")) {
            Jeu.adverse.terrain[n].effet_mort_carte(carte);
        }
    }
}

function sorcellerie(camp) {
    let montant = 0;
    for (let n = 0; n < Jeu[camp].terrain.length; n++) {
        if (!statistique(Jeu[camp].terrain[n], "silence")) {
            montant += statistique(Jeu[camp].terrain[n], "sorcellerie");
        }
    }
    return montant;
}

function statistique(carte, nom) {
    let stat = carte[nom];
    stat += carte.stat_etage[nom];
    stat += carte.stat_tour[nom];
    for (let n = 0; n < carte.equipements.length; n++) {
        stat += carte.equipements[n].stat_equipement[nom];
    }
    return stat;
}

function degats_direct(camp, montant) {
    Jeu[camp].vie -= montant;
}

function soin_direct(camp, montant) {
    Jeu[camp].vie += montant;
    if (Jeu[camp].vie > Jeu[camp].vie_max) {
        Jeu[camp].vie = Jeu[camp].vie_max;
    }
}

function deplacer(carte, camp, zone) {
    enlever(carte);
    ajouter(carte, camp, zone);
}

function ajouter(carte, camp, zone) {
    Jeu[camp][zone].push(carte);
    carte.zone = zone;
    carte.camp = camp;
    carte.slot = Jeu[camp][zone].length - 1;
    if (!statistique(carte, "silence")) {
        carte.effet_ajouter();
    }
}

function enlever(carte) {
    if (!statistique(carte, "silence")) {
        carte.effet_enlever();
    }
    Jeu[carte.camp][carte.zone].splice(carte.slot, 1);
    for (let n = carte.slot; n < Jeu[carte.camp][carte.zone].length; n++) {
        Jeu[carte.camp][carte.zone][n].slot--;
    }
}

function poser(slot) {
    Jeu.joueur.main[slot].effet_pose(1);
}

function effet_pose(carte) {
    carte.cache = false;
    let joueur_terrain = [];
    for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
        joueur_terrain.push(Jeu.joueur.terrain[n]);
    }
    let adverse_terrain = [];
    for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
        adverse_terrain.push(Jeu.adverse.terrain[n]);
    }
    for (let n = 0; n < joueur_terrain.length; n++) {
        if (!statistique(joueur_terrain[n], "silence")) {
            joueur_terrain[n].effet_pose_carte(carte);
            for (let i = 0; i < joueur_terrain[n].equipements.length; i++) {
                joueur_terrain[n].equipements[i].effet_pose_carte(joueur_terrain[n], carte);
            }
        }
    }
    for (let n = 0; n < adverse_terrain.length; n++) {
        if (!statistique(adverse_terrain[n], "silence")) {
            adverse_terrain[n].effet_pose_carte(carte);
            for (let i = 0; i < adverse_terrain[n].equipements.length; i++) {
                adverse_terrain[n].equipements[i].effet_pose_carte(adverse_terrain[n], carte);
            }
        }
    }
}

function verifier_cible(camp, zone) {
    for (let n = 0; n < Jeu[camp][zone].length; n++) {
        if (!Jeu[camp][zone][n].camouflage) {
            return true;
        }
    }
    return false;
}

function verifier_creature(camp, zone) {
    for (let n = 0; n < Jeu[camp][zone].length; n++) {
        if (Jeu[camp][zone][n].type == "Créature") {
            return true;
        }
    }
    return false;
}

function verifier_batiment(camp, zone) {
    for (let n = 0; n < Jeu[camp][zone].length; n++) {
        if (Jeu[camp][zone][n].type == "Bâtiment") {
            return true;
        }
    }
    return false;
}

function verifier_cible_creature(camp, zone) {
    for (let n = 0; n < Jeu[camp][zone].length; n++) {
        if (Jeu[camp][zone][n].type == "Créature" && !Jeu[camp][zone][n].camouflage) {
            return true;
        }
    }
    return false;
}

function verifier_cible_batiment(camp, zone) {
    for (let n = 0; n < Jeu[camp][zone].length; n++) {
        if (Jeu[camp][zone][n].type == "Bâtiment" && !Jeu[camp][zone][n].camouflage) {
            return true;
        }
    }
    return false;
}

function verifier_soin_creature(camp) {
    for (let n = 0; n < Jeu[camp].terrain.length; n++) {
        if (Jeu[camp].terrain[n].vie < Jeu[camp].terrain[n].vie_max && Jeu[camp].terrain[n].type == "Créature") {
            return true;
        }
    }
    return false;
}

function verifier_soin_batiment(camp) {
    for (let n = 0; n < Jeu[camp].terrain.length; n++) {
        if (Jeu[camp].terrain[n].vie < Jeu[camp].terrain[n].vie_max && Jeu[camp].terrain[n].type == "Bâtiment") {
            return true;
        }
    }
    return false;
}

function verifier_equipement(camp) {
    for (let n = 0; n < Jeu[camp].terrain.length; n++) {
        if (Jeu[camp].terrain[n].type == "Créature" && Jeu[camp].terrain[n].equipements.length < Jeu[camp].terrain[n].equipement_max) {
            return true;
        }
    }
    return false;
}

function verifier_boutique_or() {
    for (let n = 0; n < Jeu.joueur.boutique.length; n++) {
        if (Jeu.joueur.boutique[n].cout[0] > 0) {
            return true;
        }
    }
    return false;
}

function verifier_poison(camp) {
    for (let n = 0; n < Jeu[camp].terrain.length; n++) {
        if (Jeu[camp].terrain[n].poison > 0) {
            return true;
        }
    }
    return false;
}

function verifier_brulure(camp) {
    for (let n = 0; n < Jeu[camp].terrain.length; n++) {
        if (Jeu[camp].terrain[n].brulure > 0) {
            return true;
        }
    }
    return false;
}

function verifier_gel(camp) {
    for (let n = 0; n < Jeu[camp].terrain.length; n++) {
        if (Jeu[camp].terrain[n].gel > 0) {
            return true;
        }
    }
    return false;
}

function verifier_saignement(camp) {
    for (let n = 0; n < Jeu[camp].terrain.length; n++) {
        if (Jeu[camp].terrain[n].saignement > 0) {
            return true;
        }
    }
    return false;
}

function verifier_etourdissement(camp) {
    for (let n = 0; n < Jeu[camp].terrain.length; n++) {
        if (Jeu[camp].terrain[n].etourdissement) {
            return true;
        }
    }
    return false;
}

function verifier_contamination(camp) {
    for (let n = 0; n < Jeu[camp].terrain.length; n++) {
        if (Jeu[camp].terrain[n].contamination > 0) {
            return true;
        }
    }
    return false;
}

function verifier_debuff(camp) {
    for (let n = 0; n < Jeu[camp].terrain.length; n++) {
        if (Jeu[camp].terrain[n].poison > 0 || Jeu[camp].terrain[n].brulure > 0 || Jeu[camp].terrain[n].saignement > 0 || Jeu[camp].terrain[n].contamination > 0 || Jeu[camp].terrain[n].gel > 0 || Jeu[camp].terrain[n].etourdissement || Jeu[camp].terrain[n].silence) {
            return true;
        }
    }
    return false;
}

function verifier_region(camp, region_id) {
    for (let n = 0; n < Jeu[camp].regions.length; n++) {
        if (Jeu[camp].regions[n].id == region_id) {
            return true;
        }
    }
    return false;
}

function equiper(creature, equipement) {
    creature.equipements.push(equipement);
    if (!statistique(creature, "silence")) {
        creature.effet_equiper(equipement);
    }
}

function camp_oppose(camp) {
    if (camp == "joueur") {
        return "adverse";
    }
    return "joueur";
}

function pioche(camp, carte = boutique_generer()) {
    carte.cache = true;
    ajouter(carte, camp, "boutique");
}

function pioches(camp, nombre) {
    for (let n = 0; n < nombre; n++) {
        pioche(camp);
    }
}

function effet_carte_voir_id(id, carte) {
    let string = "<button onclick='javascript:carte_voir_id(" + id + ", ";
    if (Jeu.combat.etat && carte.camp == "adverse") {
        string += '"carte_main"';
    }
    else {
        string += '"carte_side"';
    }
    string += ")'>" + obtenir_carte(id).nom + "</button>";
    return string;
}

function effet_talent_voir(talent, carte, stack = false) {
    let string = "<button onclick='javascript:talent_voir(" + '"' + talent + '", ';
    if (carte.camp == "adverse") {
        string += '"carte_main"';
    }
    else {
        string += '"carte_side"';
    }
    if (stack !== false) {
        string += "," + stack;
    }
    string += ")'>" + talent;
    if (stack !== false) {
        string += " " + stack;
    }
    string += "</button>";
    return string;
}

function talent_voir(talent, div, stack = false) {
    console.log(div);
    let texte = "";
    texte += "<div style='display: flex;justify-content: space-between;'><div>" + talent;
    if (stack !== false) {
        texte += " " + stack;
    }
    texte += "</div>";
    texte += "<div><button onclick='javascript:fermer_carte(" + '"' + div + '"' + ")'>Fermer</button></div>";
    texte += "</div>";
    texte += "<br/>";
    switch (talent) {
        case "Éternité":
            texte += "Ne disparais pas de votre défausse.";
            break;
        case "Temporaire":
            texte += "Est banni à la fin de la phase de combat.";
            break;
        case "Éphémère":
            texte += "Quand meurt ou est détruit, est banni. (les effets qui se déclenche à la mort de la Créature se déclenche quand même, mais elle ne va pas à la défausse).";
            break;
        case "Protection":
            texte += "Les attaques adverses ciblent cette carte en priorité.";
            break;
        case "Rapidité":
            texte += "Joue avant les autres Créatures lors d'un tour de combat.";
            break;
        case "Action":
            texte += "Peut jouer " + stack + " fois par tour de combat.";
            break;
        case "Inactif":
            texte += "Ne joue pas durant la phase de combat.";
            break;
        case "Brûlure":
            texte += "Au début du prochain tour de combat, cette carte subit " + stack + " dégât(s).";
            break;
        case "Sorcellerie":
            texte += "Débloque des effets supplémentaires pour les cartes Action Sort. <br/>";
            if (Jeu.en_jeu) {
                if (sorcellerie("joueur") > 0) {
                    texte += "<i>Votre sorcellerie totale est de " + sorcellerie("joueur") + ".</i><br/>";
                }
                if (sorcellerie("adverse") > 0) {
                    texte += "<i>La sorcellerie adverse totale est de " + sorcellerie("adverse") + ".</i>";
                }
            }
            break;
        case "Résistance":
            texte += "Quand cette carte subit des dégâts :  En subis " + stack + " de moins.";
            break;
        case "Épine":
            texte += "Quand attaqué :  Lui inflige " + stack + " dégât(s).";
            break;
        case "Régénération":
            texte += "Au début de chaque tour de combat, se soigne de " + stack + ".";
            break;
        case "Compteur":
            texte += "Débloque des effets supplémentaires.";
            break;
        case "Gel":
            texte += "Annule les " + stack + " prochaines attaques.";
            break;
        case "Camouflage":
            texte += "Ne peut pas être ciblé par une attaque adverse ni par des effets adverses. S'enlève quand joue. Est affecté par les effets ne la ciblant pas directement (par exemple des effets qui s'applique à toutes les Unités sur le terrain ou qui visent une Unité à une position particulière).";
            break;
        case "Silence":
            texte += "Empêche tous les effets de cette carte de se déclencher.";
            break;
        case "Esquive":
            texte += "Réduits à 0 les dégâts reçus puis s'enlève.";
            break;
        case "Mobile":
            texte += "Peut être déplacé sur le terrain.";
            break;
        case "Maniement":
            texte += "Peut porter " + stack + " équipements.";
            break;
        case "Vol de vie":
            texte += "Quand attaque une Créature, se soigne de " + stack + ".";
            break;
        case "Percée":
            texte += "Ignore " + stack + " défense quand attaque.";
            break;
        case "Portée":
            texte += "Attaque en priorité l'Unité en dernière position au lieu de celle en première position.";
            break;
        case "Létalité":
            texte += "Quand attaque une Créature : envoie la Créature attaquée à la défausse.";
            break;
        case "Poison":
            texte += "Au début de chaque tour de combat pendant " + stack + " tour(s), subit 1 dégât.";
            break;
        case "Contamination":
            texte += "Débloque des effets supplémentaires pour certaines cartes.";
            break;
        case "Étourdissement":
            texte += "Annule les attaques du prochain tour de combat.";
            break;
        case "Saignement":
            texte += "Quand attaque (pour les " + stack + " prochaines attaque), subit 2 dégâts.";
            break;
        case "Érosion":
            texte += "Quand attaque diminue de " + stack + " la vie maximale de l'Unité attaquée (la vie maximale ne peut pas descendre en-dessous de 1).";
            break;
        case "Charge":
            texte += "Quand tue une Unité : Inflige le surplus de dégât à l'Unité juste derrière.";
            break;
    }
    div_actualiser(div, texte);
}

function define_creature(carte) {
    carte.type == "Créature";
    carte.action_max = 1;
    carte.equipement_max = 1;
}

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

function afficher_message(message) {
    let texte = "";
    texte += message;
    texte += "<br/>";
    texte += "<div><button onclick='javascript:fermer_message()'>Fermer</button></div>";
    div_actualiser("message", texte);
    document.getElementById("message").setAttribute("style", "display : block");
}

function fermer_message() {
    document.getElementById("message").setAttribute("style", "display : none");
}