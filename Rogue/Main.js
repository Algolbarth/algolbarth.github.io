function demarrage () {
    Jeu = {
        ressources : [
            {nom : "Or"},//0
            {nom : "Feu"},//1
            {nom : "Eau"},//2
            {nom : "Végétal"},//3
            {nom : "Terre"},//4
            {nom : "Air"},//5
            {nom : "Foudre"},//6
            {nom : "Metal"},//7
            {nom : "Arcane"},//8
            {nom : "Mort"},//9
            {nom : "Lumière"},//10
            {nom : "Ombre"},//11
            {nom : "Glace"}//12
        ],
        ressource_sup : 1,
        vie : 30,
        etage : 1,
        terrain : [],
        main : [],
        boutique : [],
        defausse : [],
        terrain_adverse : [],
        defausse_adverse : [],
        NOMBRE_CARTE : 44,
        combat : {
            etat : false,
            auto : true,
            vitesse : 1000,
            tour : 1,
            attaquant : "",
            defenseur : "",
        },
        boutique_niveau : 1,
        afficher_stat : true,
        raccourci_achat : true,
        afficher_cout : false,
        raccourci_vente : true,
        afficher_vente : false,
        raccourci_pose : true,
        texte_talent : true,
    }
    ecran_titre();
}

function ecran_titre () {
    initialiser();
    fonction("Jouer","nouvelle_partie()");
    actualiser();
}

function nouvelle_partie () {
    for (let n=0;n<Jeu.ressources.length;n++) {
        Jeu.ressources[n].courant = Jeu.ressources[n].max = 0;
    }
    Jeu.ressources[0].courant = Jeu.ressources[0].max = 3;
    Jeu.ressource_sup = 1;
    Jeu.vie = 30;
    Jeu.etage = 1;
    Jeu.terrain = [];
    Jeu.main = [];
    Jeu.terrain_adverse = [];
    Jeu.defausse = [];
    ajouter(obtenir_carte(31),"main");
    ajouter(obtenir_carte(7),"main");
    ajouter(obtenir_carte(1),"terrain");
    boutique_actualiser();
    adversaire_generer();
    menu();
}

function menu () {
    initialiser();
    div("main");
    fonction("Options","option()");
    saut(2);
    afficher("Etage : " + Jeu.etage);
    saut();
    afficher("Vie restante : " + Jeu.vie);
    saut();
    for (let n=0;n<Jeu.ressources.length;n++) {
        if (Jeu.ressources[n].max > 0 || Jeu.ressources[n].courant > 0) {
            afficher(Jeu.ressources[n].nom + " : " + Jeu.ressources[n].courant + " / " + Jeu.ressources[n].max);
            saut();
        }
    }
    if (Jeu.ressource_sup > 0) {
        fonction("Ajouter une ressource","ressource_choisir()");
        saut();
    }
    saut();
    afficher("<u>Boutique Nv " + Jeu.boutique_niveau + " :</u> ");
    fonction("Actualiser","boutique_rafraichir()");
    afficher(" (2 Or)");
    if (Jeu.boutique_niveau < 10) {
        afficher(" - ");
        fonction("Améliorer","boutique_ameliorer()");
        let cout = Jeu.boutique_niveau*10 - Jeu.etage;
        if (cout < 0) {
            cout = 0;
        }
        afficher(" (" + cout + " Or)");
    }
    afficher(" - ");
    fonction("Verrouiller","boutique_verrouiller()");
    saut();
    if (Jeu.boutique.length > 0) {
        for (let n=0;n<Jeu.boutique.length;n++) {
            afficher_carte("boutique",n);
            afficher(" ");
            if (Jeu.raccourci_achat) {
                fonction("Acheter","acheter(" + n + ")");
            }
            if (Jeu.afficher_cout) {
                let premier_cout = true;
                afficher(" ");
                for (let i=0;i<Jeu.boutique[n].cout.length;i++) {
                    if (Jeu.boutique[n].cout[i] > 0) {
                        if (!premier_cout) {
                            afficher(", ");
                        }
                        premier_cout = false;
                        afficher(Jeu.boutique[n].cout[i] + " " + Jeu.ressources[i].nom);
                    }
                }
            }
            saut();
        }
    }
    else {
        afficher("<i>La boutique est vide</i>");
        saut();
    }
    saut();
    afficher("<u>Main :</u>");
    saut();
    if (Jeu.main.length > 0) {
        for (let n=0;n<Jeu.main.length;n++) {
            if (n > 0) {
                fonction("&#8679","monter(" + '"main",' + n + ")");
                afficher(" ");
            }
            if (n < Jeu.main.length-1) {
                fonction("&#8681","descendre(" + '"main",' + n + ")");
                afficher(" ");
            }
            afficher_carte("main",n);
            afficher(" ");
            if (Jeu.raccourci_pose) {
                fonction("Poser","Jeu.main[" + n + "].effet_pose(" + n + ",1)");
            }
            afficher(" ");
            if (Jeu.raccourci_vente) {
                fonction("Vendre","vendre(" + '"main",' + n + ")");
            }
            if (Jeu.afficher_vente) {
                let premiere_vente = true;
                afficher(" ");
                for (let i=0;i<Jeu.main[n].vente.length;i++) {
                    if (Jeu.main[n].vente[i] > 0) {
                        if (!premiere_vente) {
                            afficher(", ");
                        }
                        premiere_vente = false;
                        afficher(Jeu.main[n].vente[i] + " " + Jeu.ressources[i].nom);
                    }
                }
            }
            saut();
        }
    }
    else {
        afficher("<i>Votre main est vide</i>");
        saut();
    }
    saut();
    afficher("<u>Terrain :</u>");
    saut();
    if (Jeu.terrain.length > 0) {
        for (let n=0;n<Jeu.terrain.length;n++) {
            if (Jeu.terrain[n].type != "Bâtiment" || statistique(Jeu.terrain[n],"mobile")) {
                if (n > 0) {
                    fonction("&#8679","monter(" + '"terrain",' + n + ")");
                    afficher(" ");
                }
                if (n < Jeu.terrain.length-1) {
                    fonction("&#8681","descendre(" + '"terrain",' + n + ")");
                    afficher(" ");
                }
            }
            afficher_carte("terrain",n);
            afficher(" ");
            if (Jeu.raccourci_vente) {
                fonction("Vendre","vendre(" + '"terrain",' + n + ")");
            }
            if (Jeu.afficher_vente) {
                let premiere_vente = true;
                afficher(" ");
                for (let i=0;i<Jeu.terrain[n].vente.length;i++) {
                    if (Jeu.terrain[n].vente[i] > 0) {
                        if (!premiere_vente) {
                            afficher(", ");
                        }
                        premiere_vente = false;
                        afficher(Jeu.terrain[n].vente[i] + " " + Jeu.ressources[i].nom);
                    }
                }
            }
            saut();
        }
    }
    else {
        afficher("<i>Votre terrain est vide</i>");
        saut();
    }
    saut();
    afficher("<u>Défausse :</u>");
    saut();
    if (Jeu.defausse.length > 0) {
        for (let n=0;n<Jeu.defausse.length;n++) {
            afficher_carte("defausse",n);
            saut();
        }
    }
    else {
        afficher("<i>Votre défausse est vide</i>");
        saut();
    }
    saut();
    fonction("Inspecter l'équipe adverse","adversaire_voir()");
    saut();
    fonction("Combattre","combat_nouveau()");
    div_fin();
    div("carte");
    div_fin();
    actualiser();
}

function afficher_carte (zone,slot) {
    let carte = Jeu[zone][slot];
    if (carte.verrouillage) {
        afficher("[");
    }
    fonction(carte.nom,"carte_voir(" + '"' + zone + '"' + "," + slot + ")");
    if (carte.verrouillage) {
        afficher("]");
    }
    if (carte.type == "Créature" && Jeu.afficher_stat) {
        afficher(" " + statistique(carte,"attaque") + " ATT " + statistique(carte,"defense") + " DEF " + statistique(carte,"vie") + "/" + statistique(carte,"vie_max") + " VIE");
    }
    else if (carte.type == "Bâtiment" && Jeu.afficher_stat) {
        afficher(" " + statistique(carte,"defense") + " DEF " + carte.vie + "/" + statistique(carte,"vie_max") + " VIE");
    }
}

function carte_voir (zone,slot) {
    let texte = "";
    let carte = Jeu[zone][slot];
    texte += carte.zone + " - " + carte.slot + "<br/>";
    texte += "<u>Nom :</u> " + carte.nom + "<br/>";
    texte += "<u>Cout :</u> ";
    let premier_cout = true;
    for (let n=0;n<carte.cout.length;n++) {
        if (carte.cout[n] > 0) {
            if (!premier_cout) {
                texte += ", ";
            }
            premier_cout = false;
            texte += carte.cout[n] + " " + Jeu.ressources[n].nom;
        }
    }
    texte += "<br/>";
    texte += "<u>Vente :</u> ";
    let premiere_vente = true;
    for (let n=0;n<carte.vente.length;n++) {
        if (carte.vente[n] > 0) {
            if (!premiere_vente) {
                texte += ", ";
            }
            premiere_vente = false;
            texte += carte.vente[n] + " " + Jeu.ressources[n].nom;
        }
    }
    texte += "<br/>";
    texte += "<u>Type :</u> " + carte.type + "<br/>";
    texte += "<u>Familles :</u> ";
    for (let n=0;n<carte.familles.length;n++) {
        if (n > 0) {
            texte += ", ";
        }
        texte += carte.familles[n];
    }
    texte += "<br/>";
    texte += "<u>Effet :</u> " + carte.texte + "<br/>";
    if (statistique(carte,"protection")) {
        texte += "Protection : Les attaquent ennnemies le visent en priorité. <br/>";
    }
    if (carte.type == "Bâtiment") {
        if (carte.mobile) {
            texte += "Mobile";
            if (Jeu.texte_talent) {
                texte += " : Peut être déplacé sur le terrain.";
            }
            texte += "<br/>";
        }
    }
    if (carte.type == "Créature") {
        if (statistique(carte,"rapidite")) {
            texte += "Rapidité";
            if (Jeu.texte_talent) {
                texte += " : Attaque avant les autres créatures.";
            }
            texte += "<br/>";
        }
        if (statistique(carte,"equipement_max") > 1) {
            texte += "Maniement " + statistique(carte,"equipement_max");
            if (Jeu.texte_talent) {
                texte += " : Peut porter " + statistique(carte,"equipement_max") + " équipements.";
            }
            texte += "<br/>";
        }
        if (statistique(carte,"vol_de_vie")) {
            texte += "Vol de vie";
            if (Jeu.texte_talent) {
                texte += " : Quand attaque une créature, se soigne de la même quantité que les dégats infligés.";
            }
            texte += "<br/>";
        }
        if (statistique(carte,"action_max") > 1) {
            texte += statistique(carte,"action_max") + " attaques";
            if (Jeu.texte_talent) {
                texte += " : Peut attaquer " + statistique(carte,"action_max") + " fois par tour.";
            }
            texte += "<br/>";
        }
        if (statistique(carte,"percee") > 0) {
            texte += "Percée " + statistique(carte,"percee");
            if (Jeu.texte_talent) {
                texte += " : Ignore " + statistique(carte,"percee") + " défense quand attaque.";
            }
            texte += "<br/>";
        }
        if (statistique(carte,"sorcellerie") > 0) {
            texte += "Sorcellerie " + statistique(carte,"sorcellerie");
            if (Jeu.texte_talent) {
                texte += " : Débloque des effets supplémentaires de certaines cartes.";
            }
            texte += " <i>(votre sorcellerie totale est de " + sorcellerie() + ")</i> <br/>";
        }
        if (statistique(carte,"portee") > 0) {
            texte += "Portée";
            if (Jeu.texte_talent) {
                texte += " : Attaque en priorité la dernière Créature ou Bâtiment au lieu de la première.";
            }
            texte += "<br/>";
        }
        if (statistique(carte,"eternite") > 0) {
            texte += "Eternité";
            if (Jeu.texte_talent) {
                texte += " : Ne disparais pas de votre défausse.";
            }
            texte += "<br/>";
        }
        if (statistique(carte,"mortel")) {
            texte += "Mortel";
            if (Jeu.texte_talent) {
                texte += " : Quand attaque une créature, l'envoie à la défausse.";
            }
            texte += "<br/>";
        }
        if (statistique(carte,"epine") > 0) {
            texte += "Epine " + statistique(carte,"epine");
            if (Jeu.texte_talent) {
                texte += " : Quand est attaquée par une créature, lui inflige " + statistique(carte,"epine") + " dégats.";
            }
            texte += "<br/>";
        }
        texte += "<u>Attaque :</u> " + statistique(carte,"attaque") + "<br/>";
    }
    if (carte.type == "Créature" || carte.type == "Bâtiment") {
        texte += "<u>Défense :</u> " + statistique(carte,"defense") + "<br/>";
        texte += "<u>Vie :</u> " + carte.vie + " / " + statistique(carte,"vie_max") + "<br/>";
    }
    if (!Jeu.combat.etat) {
        if (zone == "boutique") {
            texte += "<a href='javascript:acheter(" + slot + ")'>Acheter</a> <br/>";
        }
        else if (zone == "main" || zone == "terrain") {
            texte += "<a href='javascript:vendre(" + '"' + zone + '",' + slot + ")'>Vendre</a> <br/>";
        }
        if (zone == "main") {
            texte += "<a href='javascript:Jeu.main[" + slot + "].effet_pose(" + slot + ",1)'>Poser</a> <br/>";
        }
    }
    if (carte.type == "Créature") {
        texte += "<u>Equipements :</u> <br/>";
        if (carte.equipements.length > 0) {
            for (let n=0;n<carte.equipements.length;n++) {
                texte += carte.equipements[n].nom + " : " + carte.equipements[n].texte + "<br/>";
            }
        }
        else {
            texte += "Aucun";
        }
    }
    div_actualiser("carte",texte);
}

function ressource_choisir () {
    initialiser();
    fonction("Retour","menu()");
    saut(2);
    for (let n=1;n<Jeu.ressources.length;n++) {
        fonction(Jeu.ressources[n].nom,"ressource_ajouter(" + n + ")");
        afficher(" : " + Jeu.ressources[n].courant + " / " + Jeu.ressources[n].max);
        saut();
    }
    actualiser();
}

function ressource_ajouter (ressource_slot) {
    Jeu.ressource_sup--;
    Jeu.ressources[ressource_slot].courant++;
    Jeu.ressources[ressource_slot].max++;
    menu();
}

function cout_total (carte) {
    let cout = 0;
    for (let n=0;n<carte.cout.length;n++) {
        cout += carte.cout[n];
    }
    return cout;
}

function boutique_rafraichir () {
    if (Jeu.ressources[0].courant >= 2) {
        Jeu.ressources[0].courant -= 2;
        boutique_actualiser();
        menu();
    }
}

function boutique_actualiser () {
    let nombre_actualisation = 2+Jeu.boutique_niveau;
    for (let n=0;n<Jeu.boutique.length;n++) {
        if (Jeu.boutique[n].verrouillage) {
            nombre_actualisation--;
        }
        else {
            enlever(Jeu.boutique[n]);
            n--;
        }
    }
    for (let n=0;n<nombre_actualisation;n++) {
        ajouter(boutique_generer(),"boutique");
    }
}

function boutique_generer () {
    let carte = obtenir_carte(parseInt(Math.random()*Jeu.NOMBRE_CARTE + 1));
    while (cout_total(carte) > Jeu.boutique_niveau*3 || Jeu.boutique_niveau == 10) {
        carte = obtenir_carte(parseInt(Math.random()*Jeu.NOMBRE_CARTE + 1));
    }
    return carte;
}

function boutique_ameliorer () {
    let cout = Jeu.boutique_niveau*10 - Jeu.etage;
    if (cout < 0) {
        cout = 0;
    }
    if (Jeu.ressources[0].courant >= cout) {
        Jeu.ressources[0].courant -= cout;
        Jeu.boutique_niveau++;
        menu();
    }
}

function boutique_verrouiller () {
    let verrou = false;
    for (let n=0;n<Jeu.boutique.length;n++) {
        if (!Jeu.boutique[n].verrouillage) {
            verrou = true;
            break;
        }
    }
    for (let n=0;n<Jeu.boutique.length;n++) {
        Jeu.boutique[n].verrouillage = verrou;
    }
    menu();
}

function acheter (boutique_slot) {
    let achat = true;
    for (let n=0;n<Jeu.ressources.length;n++) {
        if (Jeu.ressources[n].courant < Jeu.boutique[boutique_slot].cout[n]) {
            achat = false;
        }
    }
    if (achat) {
        for (let n=0;n<Jeu.ressources.length;n++) {
            Jeu.ressources[n].courant -= Jeu.boutique[boutique_slot].cout[n];
        }
        Jeu.boutique[boutique_slot].verrouillage = false;
        deplacer(Jeu.boutique[boutique_slot],"main");
        menu();
    }
}

function vendre (zone,slot) {
    for (let n=0;n<Jeu.ressources.length;n++) {
        Jeu.ressources[n].courant += Jeu[zone][slot].vente[n];
    }
    enlever(Jeu[zone][slot]);
    menu();
}

function etage_suivant () {
    Jeu.etage++;
    Jeu.ressources[0].max++;
    Jeu.ressource_sup = 1;
    for (let n=0;n<Jeu.ressources.length;n++) {
        Jeu.ressources[n].courant = Jeu.ressources[n].max;
    }
    for (let n=0;n<Jeu.defausse.length;n++) {
        Jeu.defausse[n].etage_mort++;
        if (Jeu.defausse[n].etage_mort > 1 && !Jeu.defausse[n].eternite) {
            enlever(Jeu.defausse[n]);
            n--;
        }
    }
    for (let n=0;n<Jeu.defausse_adverse.length;n++) {
        Jeu.defausse_adverse[n].etage_mort++;
        if (Jeu.defausse_adverse[n].etage_mort > 1 && !Jeu.defausse_adverse[n].eternite) {
            enlever(Jeu.defausse_adverse[n]);
            n--;
        }
    }
    boutique_actualiser();
    adversaire_generer();
    menu();
}

function adversaire_generer () {
    Jeu.terrain_adverse = [];
    for (let n=0;n<Jeu.etage;n++) {
        ajouter(obtenir_carte(5),"terrain_adverse");
    }
}

function adversaire_voir () {
    initialiser();
    div("main");
    fonction("Retour","menu()");
    saut(2);
    afficher("<u>Terrain adverse :</u>");
    saut();
    if (Jeu.terrain_adverse.length > 0) {
        for (let n=0;n<Jeu.terrain_adverse.length;n++) {
            afficher_carte("terrain_adverse",n);
            saut();
        }
    }
    else {
        afficher("<i>Le terrain adverse est vide</i>");
        saut();
    }
    saut();
    afficher("<u>Défausse adverse :</u>");
    saut();
    if (Jeu.defausse_adverse.length > 0) {
        for (let n=0;n<Jeu.defausse_adverse.length;n++) {
            afficher_carte("defausse_adverse",n);
            saut();
        }
    }
    else {
        afficher("<i>La défausse adverse est vide</i>");
    }
    div_fin();
    div("carte");
    div_fin();
    actualiser();
}

function game_over () {
    initialiser();
    afficher("Vous avez dû abandonner à l'étage " + Jeu.etage);
    saut(2);
    fonction("Abandonner","ecran_titre()");
    actualiser();
}

function monter (zone,slot) {
    let carte = Jeu[zone][slot];
    let trans = Jeu[zone][slot-1];
    Jeu[zone][slot] = trans;
    Jeu[zone][slot-1] = carte;
    carte.slot--;
    trans.slot++;
    menu();
}

function descendre (zone,slot) {
    let carte = Jeu[zone][slot];
    let trans = Jeu[zone][slot+1];
    Jeu[zone][slot] = trans;
    Jeu[zone][slot+1] = carte;
    carte.slot++;
    trans.slot--;
    menu();
}

function soin (carte,montant) {
    carte.vie += montant;
    if (carte.vie > statistique(carte,"vie_max")) {
        carte.vie = carte.vie_max;
    }
}

function degats (carte,montant) {
    carte.vie -= montant;
    carte.effet_degat();
    if (carte.vie <= 0) {
        mort(carte);
        return true;
    }
    return false;
}

function mort (carte) {
    carte.vie = 0;
    carte.effet_mort();
}

function sorcellerie () {
    let montant = 0;
    for (let n=0;n<Jeu.terrain.length;n++) {
        montant += statistique(Jeu.terrain[n],"sorcellerie");
    }
    return montant;
}

function statistique (carte,nom) {
    let stat = carte[nom];
    for (let n=0;n<carte.equipements.length;n++) {
        stat += carte.equipements[n][nom];
    }
    return stat;
}

function degats_joueur (montant) {
    Jeu.vie -= montant;
}

function deplacer (carte,zone) {
    enlever(carte);
    ajouter(carte,zone);
}

function ajouter (carte,zone) {
    Jeu[zone].push(carte);
    carte.zone = zone;
    carte.slot = Jeu[zone].length - 1;
}

function enlever (carte) {
    Jeu[carte.zone].splice(carte.slot,1);
    for (let n=carte.slot;n<Jeu[carte.zone].length;n++) {
        Jeu[carte.zone][n].slot--;
    }
}