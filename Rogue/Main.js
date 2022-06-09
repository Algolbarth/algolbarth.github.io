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
        NOMBRE_CARTE : 69,
        combat : {
            auto : true,
            vitesse : 1000,
        },
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
    Jeu.joueur = {
        vie : 30,
        vie_max : 30,
        ressources : [],
        boutique : [],
        main : [],
        terrain : [],
        defausse : [],
    }
    Jeu.adverse = {
        vie : 10,
        vie_max : 10,
        ressources : [],
        main : [],
        terrain : [],
        defausse : [],
    }
    for (let n=0;n<Jeu.ressources.length;n++) {
        let ressource = {
            courant : 0,
            max : 0,
        }
        Jeu.joueur.ressources.push(ressource);
    }
    Jeu.joueur.ressources[0].courant = Jeu.joueur.ressources[0].max = 3;
    for (let n=0;n<Jeu.ressources.length;n++) {
        let ressource = {
            courant : 0,
            max : 0,
        }
        Jeu.adverse.ressources.push(ressource);
    }
    Jeu.etage = 1;
    Jeu.boutique_niveau = 1;
    Jeu.boutique_amelioration = 9;
    Jeu.ressource_sup = 1;
    Jeu.combat.etat = false;
    ajouter(obtenir_carte(31),"joueur","main");
    ajouter(obtenir_carte(29),"joueur","main");
    ajouter(obtenir_carte(1),"joueur","terrain");
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
    afficher("Vie restante : " + Jeu.joueur.vie + " / " + Jeu.joueur.vie_max);
    saut();
    for (let n=0;n<Jeu.ressources.length;n++) {
        if (Jeu.joueur.ressources[n].max > 0 || Jeu.joueur.ressources[n].courant > 0) {
            afficher(Jeu.ressources[n].nom + " : " + Jeu.joueur.ressources[n].courant + " / " + Jeu.joueur.ressources[n].max);
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
        afficher(" (" + Jeu.boutique_amelioration + " Or)");
    }
    afficher(" - ");
    fonction("Verrouiller","boutique_verrouiller()");
    saut();
    if (Jeu.joueur.boutique.length > 0) {
        for (let n=0;n<Jeu.joueur.boutique.length;n++) {
            afficher_carte("joueur","boutique",n);
            afficher(" ");
            if (Jeu.raccourci_achat) {
                fonction("Acheter","acheter(" + n + ")");
            }
            if (Jeu.afficher_cout) {
                let premier_cout = true;
                afficher(" ");
                for (let i=0;i<Jeu.joueur.boutique[n].cout.length;i++) {
                    if (Jeu.joueur.boutique[n].cout[i] > 0) {
                        if (!premier_cout) {
                            afficher(", ");
                        }
                        premier_cout = false;
                        afficher(Jeu.joueur.boutique[n].cout[i] + " " + Jeu.ressources[i].nom);
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
    if (Jeu.joueur.main.length > 0) {
        for (let n=0;n<Jeu.joueur.main.length;n++) {
            if (n > 0) {
                fonction("&#8679","monter(" + '"joueur","main",' + n + ")");
                afficher(" ");
            }
            if (n < Jeu.joueur.main.length-1) {
                fonction("&#8681","descendre(" + '"joueur","main",' + n + ")");
                afficher(" ");
            }
            afficher_carte("joueur","main",n);
            afficher(" ");
            if (Jeu.raccourci_pose) {
                fonction("Poser","poser(" + n + ")");
            }
            afficher(" ");
            if (Jeu.raccourci_vente) {
                fonction("Vendre","vendre(" + '"main",' + n + ")");
            }
            if (Jeu.afficher_vente) {
                let premiere_vente = true;
                afficher(" ");
                for (let i=0;i<Jeu.joueur.main[n].vente.length;i++) {
                    if (Jeu.joueur.main[n].vente[i] > 0) {
                        if (!premiere_vente) {
                            afficher(", ");
                        }
                        premiere_vente = false;
                        afficher(Jeu.joueur.main[n].vente[i] + " " + Jeu.ressources[i].nom);
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
    if (Jeu.joueur.terrain.length > 0) {
        for (let n=0;n<Jeu.joueur.terrain.length;n++) {
            if (Jeu.joueur.terrain[n].type != "Bâtiment" || statistique(Jeu.joueur.terrain[n],"mobile")) {
                if (n > 0) {
                    fonction("&#8679","monter(" + '"joueur","terrain",' + n + ")");
                    afficher(" ");
                }
                if (n < Jeu.joueur.terrain.length-1) {
                    fonction("&#8681","descendre(" + '"joueur","terrain",' + n + ")");
                    afficher(" ");
                }
            }
            afficher_carte("joueur","terrain",n);
            afficher(" ");
            if (Jeu.raccourci_vente) {
                fonction("Vendre","vendre(" + '"terrain",' + n + ")");
            }
            if (Jeu.afficher_vente) {
                let premiere_vente = true;
                afficher(" ");
                for (let i=0;i<Jeu.joueur.terrain[n].vente.length;i++) {
                    if (Jeu.joueur.terrain[n].vente[i] > 0) {
                        if (!premiere_vente) {
                            afficher(", ");
                        }
                        premiere_vente = false;
                        afficher(Jeu.joueur.terrain[n].vente[i] + " " + Jeu.ressources[i].nom);
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
    if (Jeu.joueur.defausse.length > 0) {
        for (let n=0;n<Jeu.joueur.defausse.length;n++) {
            afficher_carte("joueur","defausse",n);
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

function afficher_carte (camp,zone,slot) {
    let carte = Jeu[camp][zone][slot];
    if (carte.verrouillage) {
        afficher("[");
    }
    fonction(carte.nom,"carte_voir(" + '"' + camp + '","' + zone + '",' + slot + ")");
    if (carte.verrouillage) {
        afficher("]");
    }
    if (Jeu.afficher_stat && ["Créature","Bâtiment"].includes(carte.type)) {
        if (carte.type == "Créature") {
            afficher(" " + statistique(carte,"attaque") + " ATT");
        }
        afficher(" " + statistique(carte,"defense") + " DEF " + carte.vie + "/" + statistique(carte,"vie_max"));
        if (carte.vie_sup > 0) {
            afficher(" (+ " + carte.vie_sup + ")");
        }
        afficher(" VIE");
    }
}

function carte_voir (camp,zone,slot) {
    let texte = "";
    let carte = Jeu[camp][zone][slot];
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
    if (["Créature","Bâtiment"].includes(carte.type)) {
        if (statistique(carte,"protection")) {
            texte += "Protection";
            if (Jeu.texte_talent) {
                texte += " : Les attaquent ennnemies ciblent cette carte en priorité.";
            }
            texte += "<br/>";
        }
        if (statistique(carte,"rapidite")) {
            texte += "Rapidité";
            if (Jeu.texte_talent) {
                texte += " : Joue avant les autres Créatures lors d'un tour de combat.";
            }
            texte += "<br/>";
        }
        if (statistique(carte,"action_max") > 1) {
            texte += statistique(carte,"action_max") + " attaques";
            if (Jeu.texte_talent) {
                texte += " : Peut jouer " + statistique(carte,"action_max") + " fois par tour de combat.";
            }
            texte += "<br/>";
        }
        if (carte.brulure > 0) {
            texte += "Brûlure " + carte.brulure;
            if (Jeu.texte_talent) {
                texte += " : Au début du prochain tour de combat, cette carte subit " + carte.brulure + " dégât(s).";
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
        if (statistique(carte,"resistance") > 0) {
            texte += "Résistance " + statistique(carte,"resistance");
            if (Jeu.texte_talent) {
                texte += " : A chaque fois que cette carte subit des dégats, en subis " + statistique(carte,"resistance") + " de moins.";
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
        if (statistique(carte,"epine") > 0) {
            texte += "Epine " + statistique(carte,"epine");
            if (Jeu.texte_talent) {
                texte += " : Quand est attaquée par une Créature, lui inflige " + statistique(carte,"epine") + " dégâts.";
            }
            texte += "<br/>";
        }
        if (statistique(carte,"regeneration") > 0) {
            texte += "Régénération " + statistique(carte,"regeneration");
            if (Jeu.texte_talent) {
                texte += " : Au début de chaque tour de combat, se soigne de " + statistique(carte,"regeneration") + ".";
            }
            texte += "<br/>";
        }
        if (carte.decompte > 0) {
            texte += "Compte à rebours " + carte.decompte;
            if (Jeu.texte_talent) {
                texte += " : Diminue de 1 à la fin de la phase de combat.";
            }
            texte += "<br/>";
        }
        if (carte.gel > 0) {
            texte += "Gel " + carte.gel;
            if (Jeu.texte_talent) {
                texte += " : Annule les " + carte.gel + " prochaines attaques.";
            }
            texte += "<br/>";
        }
        if (carte.temporaire > 0) {
            texte += "Temporaire ";
            if (Jeu.texte_talent) {
                texte += " : Est banni à la fin de la prochaine phase de combat.";
            }
            texte += "<br/>";
        }
        if (carte.camouflage) {
            texte += "Camouflage ";
            if (Jeu.texte_talent) {
                texte += " : Ne peut pas être ciblé par une attaque ennemie. S'enlève quand joue.";
            }
            texte += "<br/>";
        }
        if (statistique(carte,"ephemere")) {
            texte += "Ephémère ";
            if (Jeu.texte_talent) {
                texte += " : Quand meurt ou est détruit, est banni. (les effets qui se déclenche à la mort de la Créature se déclenche quand même, mais elle ne va pas à la défausse)";
            }
            texte += "<br/>";
        }
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
                texte += " : Quand attaque une Créature, se soigne d'autant que les dégâts infligés.";
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
        if (statistique(carte,"portee") > 0) {
            texte += "Portée";
            if (Jeu.texte_talent) {
                texte += " : Attaque en priorité la dernière Créature ou Bâtiment au lieu de la première.";
            }
            texte += "<br/>";
        }
        if (statistique(carte,"mortel")) {
            texte += "Mortel";
            if (Jeu.texte_talent) {
                texte += " : Quand attaque une Créature, l'envoie à la défausse.";
            }
            texte += "<br/>";
        }
        if (carte.poison > 0) {
            texte += "Poison " + carte.poison;
            if (Jeu.texte_talent) {
                texte += " : Au début de chaque tour pendant " + carte.poison + " tour(s), subit 1 dégât.";
            }
            texte += "<br/>";
        }
        if (carte.maladie > 0) {
            texte += "Maladie " + carte.maladie;
            if (Jeu.texte_talent) {
                texte += " : Débloque des effets supplémentaires de certaines cartes.";
            }
            texte += "<br/>";
        }
        texte += "<u>Attaque :</u> " + statistique(carte,"attaque") + "<br/>";
    }
    if (carte.type == "Créature" || carte.type == "Bâtiment") {
        texte += "<u>Défense :</u> " + statistique(carte,"defense") + "<br/>";
        texte += "<u>Vie :</u> " + carte.vie + " / " + statistique(carte,"vie_max");
        if (carte.vie_sup > 0) {
            texte += " (+ " + carte.vie_sup + ")";
        }
        texte += "<br/>";
    }
    if (!Jeu.combat.etat) {
        if (zone == "boutique") {
            texte += "<a href='javascript:acheter(" + slot + ")'>Acheter</a> <br/>";
        }
        else if (zone == "main" || zone == "terrain") {
            texte += "<a href='javascript:vendre(" + '"' + zone + '",' + slot + ")'>Vendre</a> <br/>";
        }
        if (zone == "main") {
            texte += "<a href='javascript:Jeu.joueur.main[" + slot + "].effet_pose(" + slot + ",1)'>Poser</a> <br/>";
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
        afficher(" : " + Jeu.joueur.ressources[n].courant + " / " + Jeu.joueur.ressources[n].max);
        saut();
    }
    actualiser();
}

function ressource_ajouter (ressource_slot) {
    Jeu.ressource_sup--;
    Jeu.joueur.ressources[ressource_slot].courant++;
    Jeu.joueur.ressources[ressource_slot].max++;
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
    if (Jeu.joueur.ressources[0].courant >= 2) {
        Jeu.joueur.ressources[0].courant -= 2;
        boutique_actualiser();
        menu();
    }
}

function boutique_actualiser () {
    let nombre_actualisation = 2+Jeu.boutique_niveau;
    for (let n=0;n<Jeu.joueur.boutique.length;n++) {
        if (Jeu.joueur.boutique[n].verrouillage) {
            nombre_actualisation--;
        }
        else {
            enlever(Jeu.joueur.boutique[n]);
            n--;
        }
    }
    for (let n=0;n<nombre_actualisation;n++) {
        ajouter(boutique_generer(),"joueur","boutique");
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
    if (Jeu.joueur.ressources[0].courant >= Jeu.boutique_amelioration) {
        Jeu.joueur.ressources[0].courant -= Jeu.boutique_amelioration;
        Jeu.boutique_niveau++;
        Jeu.boutique_amelioration = Jeu.boutique_niveau*10 - Jeu.etage;
        menu();
    }
}

function boutique_verrouiller () {
    let verrou = false;
    for (let n=0;n<Jeu.joueur.boutique.length;n++) {
        if (!Jeu.joueur.boutique[n].verrouillage) {
            verrou = true;
            break;
        }
    }
    for (let n=0;n<Jeu.joueur.boutique.length;n++) {
        Jeu.joueur.boutique[n].verrouillage = verrou;
    }
    menu();
}

function acheter (boutique_slot) {
    let achat = true;
    for (let n=0;n<Jeu.ressources.length;n++) {
        if (Jeu.joueur.ressources[n].courant < Jeu.joueur.boutique[boutique_slot].cout[n]) {
            achat = false;
        }
    }
    if (achat) {
        for (let n=0;n<Jeu.ressources.length;n++) {
            Jeu.joueur.ressources[n].courant -= Jeu.joueur.boutique[boutique_slot].cout[n];
        }
        Jeu.joueur.boutique[boutique_slot].verrouillage = false;
        deplacer(Jeu.joueur.boutique[boutique_slot],"joueur","main");
        menu();
    }
}

function vendre (zone,slot) {
    for (let n=0;n<Jeu.ressources.length;n++) {
        Jeu[camp].ressources[n].courant += Jeu[zone][slot].vente[n];
    }
    enlever(Jeu[zone][slot]);
    menu();
}

function etage_suivant () {
    Jeu.etage++;
    if (Jeu.etage <= 100) {
        Jeu.adverse.vie = 10;
        if (Jeu.boutique_amelioration > 0) {
            Jeu.boutique_amelioration--;
        }
        adversaire_generer();
        etage_fin();
    }
    else {
        victoire();        
    }
}

function etage_fin () {
    Jeu.joueur.ressources[0].max++;
    Jeu.ressource_sup = 1;
    for (let n=0;n<Jeu.ressources.length;n++) {
        Jeu.joueur.ressources[n].courant = Jeu.joueur.ressources[n].max;
    }
    for (let n=0;n<Jeu.joueur.terrain.length;n++) {
        if (Jeu.joueur.terrain[n].temporaire) {
            enlever(Jeu.joueur.terrain[n]);
            n--;
        }
        else if (Jeu.joueur.terrain[n].decompte > 0) {
            Jeu.joueur.terrain[n].decompte--;
            if (Jeu.joueur.terrain[n].decompte == 0) {
                Jeu.joueur.terrain[n].effet_decompte();
            }
        }
    }
    for (let n=0;n<Jeu.joueur.main.length;n++) {
        if (Jeu.joueur.main[n].temporaire) {
            enlever(Jeu.joueur.main[n]);
            n--;
        }
    }
    for (let n=0;n<Jeu.joueur.defausse.length;n++) {
        Jeu.joueur.defausse[n].etage_mort++;
        if ((Jeu.joueur.defausse[n].etage_mort > 1 && !Jeu.joueur.defausse[n].eternite) || Jeu.joueur.defausse[n].temporaire) {
            enlever(Jeu.joueur.defausse[n]);
            n--;
        }
    }
    for (let n=0;n<Jeu.adverse.defausse.length;n++) {
        Jeu.adverse.defausse[n].etage_mort++;
        if ((Jeu.adverse.defausse[n].etage_mort > 1 && !Jeu.adverse.defausse[n].eternite) || Jeu.adverse.defausse[n].temporaire) {
            enlever(Jeu.adverse.defausse[n]);
            n--;
        }
    }
    boutique_actualiser();
    menu();
}

function adversaire_generer () {
    Jeu.adverse.terrain = [];
    for (let n=0;n<Jeu.etage;n++) {
        ajouter(obtenir_carte(5),"adverse","main");
    }
    while (Jeu.adverse.main.length > 0) {
        Jeu.adverse.main[0].effet_pose();    
    }
}

function adversaire_voir () {
    initialiser();
    div("main");
    fonction("Retour","menu()");
    saut(2);
    afficher("Vie adverse : " + Jeu.adverse.vie + " / " + Jeu.adverse.vie_max);
    saut(2);
    afficher("<u>Terrain adverse :</u>");
    saut();
    if (Jeu.adverse.terrain.length > 0) {
        for (let n=0;n<Jeu.adverse.terrain.length;n++) {
            afficher_carte("adverse","terrain",n);
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
    if (Jeu.adverse.defausse.length > 0) {
        for (let n=0;n<Jeu.adverse.defausse.length;n++) {
            afficher_carte("adverse","defausse",n);
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

function monter (camp,zone,slot) {
    let carte = Jeu[camp][zone][slot];
    let trans = Jeu[camp][zone][slot-1];
    Jeu[camp][zone][slot] = trans;
    Jeu[camp][zone][slot-1] = carte;
    carte.slot--;
    trans.slot++;
    menu();
}

function descendre (camp,zone,slot) {
    let carte = Jeu[camp][zone][slot];
    let trans = Jeu[camp][zone][slot+1];
    Jeu[camp][zone][slot] = trans;
    Jeu[camp][zone][slot+1] = carte;
    carte.slot++;
    trans.slot--;
    menu();
}

function soin (carte,montant) {
    carte.vie += montant;
    if (carte.vie > statistique(carte,"vie_max")) {
        carte.vie = statistique(carte,"vie_max");
    }
    carte.effet_soin(montant);
    for (let n=0;n<Jeu[carte.zone].length;n++) {
        Jeu[carte.zone][n].effet_soin_allie(carte);
    }
}

function degats (carte,montant) {
    if (carte.resistance > 0) {
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
        carte.vie -= montant;
        carte.effet_degat();
        if (carte.vie <= 0) {
            mort(carte);
            return true;
        }
    }
    return false;
}

function mort (carte) {
    carte.vie = 0;
    carte.effet_mort();
    for (let n=0;n<Jeu.joueur.terrain.length;n++) {
        Jeu.joueur.terrain[n].effet_mort_carte(carte);
    }
    for (let n=0;n<Jeu.adverse.terrain.length;n++) {
        Jeu.adverse.terrain[n].effet_mort_carte(carte);
    }
}

function sorcellerie () {
    let montant = 0;
    for (let n=0;n<Jeu.joueur.terrain.length;n++) {
        montant += statistique(Jeu.joueur.terrain[n],"sorcellerie");
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
    Jeu.joueur.vie -= montant;
}

function degats_adverse (montant) {
    Jeu.adverse.vie -= montant;
}

function deplacer (carte,camp,zone) {
    enlever(carte);
    ajouter(carte,camp,zone);
}

function ajouter (carte,camp,zone) {
    Jeu[camp][zone].push(carte);
    carte.zone = zone;
    carte.camp = camp;
    carte.slot = Jeu[camp][zone].length - 1;
}

function enlever (carte) {
    Jeu[carte.camp][carte.zone].splice(carte.slot,1);
    for (let n=carte.slot;n<Jeu[carte.camp][carte.zone].length;n++) {
        Jeu[carte.camp][carte.zone][n].slot--;
    }
}

function poser (slot) {
    Jeu.joueur.main[slot].effet_pose(1);
}

function effet_pose (carte) {
    for (let n=0;n<Jeu[carte.camp][carte.zone].length-1;n++) {
        Jeu[carte.camp].terrain[n].effet_pose_allie(carte);
    }
}

function verifier_soin () {
    for (let n=0;n<Jeu.joueur.terrain.length;n++) {
        if (Jeu.joueur.terrain[n].vie < Jeu.joueur.terrain[n].vie_max) {
            return true;
        }
    }
    return false;
}

function verifier_equipement () {
    for (let n=0;n<Jeu.joueur.terrain.length;n++) {
        if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].equipements.length < Jeu.joueur.terrain[n].equipement_max) {
            return true;
        }
    }
    return false;
}

function victoire () {
    initialiser();
    afficher("Victoire");
    saut(2);
    fonction("Ecran titre","ecran_titre()");
    actualiser();
}