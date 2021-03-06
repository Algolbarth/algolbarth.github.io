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
        types : ["Créature","Bâtiment","Objet","Action","Région"],
        familles : [],
        NOMBRE_CARTE : 129,
        combat : {
            auto : true,
            vitesse : 1000,
        },
        afficher_stat : true,
        raccourci_achat : true,
        raccourci_vente : true,
        raccourci_pose : true,
        texte_talent : true,
        collection : [],
        collection_tri : "id",
        collection_ordre : "croissant",
        collection_filtre : {
            type : "Tous",
            famille : "Toutes",
            cout : "Tous"
        }
    }
    for (let n=1;n<=Jeu.NOMBRE_CARTE;n++) {
        let carte = obtenir_carte(n);
        for (let i=0;i<carte.familles.length;i++) {
            if (!verifier_famille(carte.familles[i])) {
                Jeu.familles.push(carte.familles[i]);
            }
        }
    }
    for (let i=0;i<Jeu.familles.length;i++) {
        let j = i;
        while (j > 0 && Jeu.familles[j-1] > Jeu.familles[j]) {
            let a = Jeu.familles[j];
            let b = Jeu.familles[j - 1];
            Jeu.familles[j] = b;
            Jeu.familles[j - 1] = a;
            j--;
        }
    }
    ecran_titre();
}

function verifier_famille (famille) {
    for (let n=0;n<Jeu.familles.length;n++) {
        if (Jeu.familles[n] == famille) {
            return true;
        }
    }
    return false;
}

function ecran_titre () {
    initialiser();
    fonction("Jouer","nouvelle_partie()");
    saut(2);
    fonction("Collection","collection_tri_init();collection()");
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
        regions : [],
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
    Jeu.region_active = 0;
    Jeu.combat.etat = false;
    ajouter(obtenir_carte(78),"joueur","regions");
    ajouter(obtenir_carte(31),"joueur","main");
    ajouter(obtenir_carte(1),"joueur","terrain");
    adversaire_generer(1);
    adversaire_jouer();
    adversaire_generer(2);
    boutique_actualiser();
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
    afficher("<u>Régions :</u>");
    saut();
    for (let n=0;n<Jeu.joueur.regions.length;n++) {
        afficher_carte("joueur","regions",n);
        if (Jeu.region_active != n) {
            afficher(" ");
            fonction("Choisir","Jeu.region_active=" + n + ";menu();");
        }
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
            if (Jeu.joueur.terrain[n].type == "Créature" || (statistique(Jeu.joueur.terrain[n],"mobile") && !statistique(Jeu.joueur.terrain[n],"silence"))) {
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
    carte_afficher(Jeu[camp][zone][slot]);
}

function carte_voir_id (carte_id) {
    carte_afficher(obtenir_carte(carte_id));
}

function carte_afficher (carte) {
    let texte = "";
    texte += "<u>Nom :</u> " + carte.nom + "<br/>";
    texte += "<u>Coût :</u> ";
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
    if (premier_cout) {
        texte += "Rien";
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
    if (premiere_vente) {
        texte += "Rien";
    }
    texte += "<br/>";
    texte += "<u>Type :</u> " + carte.type + "<br/>";
    texte += "<u>Familles :</u> ";
    if (carte.familles.length > 0) {
        for (let n=0;n<carte.familles.length;n++) {
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
    texte += "<u>Effet :</u> " + carte.texte + "<br/>";
    if (carte.exclusif) {
        texte += "Cette carte ne peut pas être créée dans la boutique. <br/>";
    }
    if (["Créature","Bâtiment"].includes(carte.type)) {
        if (statistique(carte,"protection")) {
            texte += "Protection";
            if (Jeu.texte_talent) {
                texte += " : Les attaques adverses ciblent cette carte en priorité.";
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
            texte += "Action " + statistique(carte,"action_max");
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
            if (carte.camp == "joueur" || carte.camp == "adverse") {
                texte += " <i>(votre sorcellerie totale est de " + sorcellerie(carte.camp) + ")</i>";
            }
            texte += "<br/>";
        }
        if (statistique(carte,"resistance") > 0) {
            texte += "Résistance " + statistique(carte,"resistance");
            if (Jeu.texte_talent) {
                texte += " : Quand cette carte subit des dégats, en subis " + statistique(carte,"resistance") + " de moins.";
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
            texte += "Décompte " + carte.decompte;
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
                texte += " : Est banni à la fin de la phase de combat.";
            }
            texte += "<br/>";
        }
        if (carte.camouflage) {
            texte += "Camouflage ";
            if (Jeu.texte_talent) {
                texte += " : Ne peut pas être ciblé par une attaque adverse. S'enlève quand joue.";
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
        if (statistique(carte,"silence")) {
            texte += "Silence ";
            if (Jeu.texte_talent) {
                texte += " : Empêche tous les effets de cette carte de se déclencher.";
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
                texte += " : Au début de chaque tour de combat pendant " + carte.poison + " tour(s), subit 1 dégât.";
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
        if (carte.etourdissement > 0) {
            texte += "Etourdissement ";
            if (Jeu.texte_talent) {
                texte += " : Annule les attaques du prochain tour de combat.";
            }
            texte += "<br/>";
        }
        if (carte.saignement > 0) {
            texte += "Saignement " + carte.saignement;
            if (Jeu.texte_talent) {
                texte += " : Quand attaque (pour les " + carte.saignement + " prochaines attaque), subit 1 dégât.";
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
    if (carte.type == "Créature") {
        texte += "<u>Équipements :</u> <br/>";
        if (carte.equipements.length > 0) {
            for (let n=0;n<carte.equipements.length;n++) {
                texte += carte.equipements[n].nom + " : " + carte.equipements[n].texte + "<br/>";
            }
        }
        else {
            texte += "Aucun <br/>";
        }
    }
    if (!Jeu.combat.etat && carte.camp == "joueur") {
        if (carte.zone == "main") {
            texte += "<a href='javascript:Jeu.joueur.main[" + carte.slot + "].effet_pose(" + carte.slot + ",1)'>Poser</a> <br/>";
        }
        if (carte.zone == "boutique") {
            texte += "<a href='javascript:acheter(" + carte.slot + ")'>Acheter</a> <br/>";
        }
        else if (carte.zone == "main" || carte.zone == "terrain") {
            texte += "<a href='javascript:vendre(" + '"' + carte.zone + '",' + carte.slot + ")'>Vendre</a> <br/>";
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
    while (!Jeu.joueur.regions[Jeu.region_active].boutique_generer(carte)) {
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
    if (!statistique(Jeu.joueur[zone][slot],"silence")) {
        Jeu.joueur[zone][slot].effet_vente();
    }
    for (let n=0;n<Jeu.joueur.terrain.length;n++) {
        if (!statistique(Jeu.joueur.terrain[n],"silence")) {
            Jeu.joueur.terrain[n].effet_vente_carte();
        }
    }
    for (let n=0;n<Jeu.adverse.terrain.length;n++) {
        if (!statistique(Jeu.adverse.terrain[n],"silence")) {
            Jeu.adverse.terrain[n].effet_vente_carte();
        }
    }
    for (let n=0;n<Jeu.ressources.length;n++) {
        Jeu.joueur.ressources[n].courant += Jeu.joueur[zone][slot].vente[n];
    }
    enlever(Jeu.joueur[zone][slot]);
    menu();
}

function etage_suivant () {
    Jeu.etage++;
    if (Jeu.etage <= 100) {
        etage_fin();
        if (Jeu.boutique_amelioration > 0) {
            Jeu.boutique_amelioration--;
        }
        if (Jeu.etage == 100) {
            Jeu.adverse.vie = Jeu.adverse.vie_max = 100;
        }
        else if (Jeu.etage%10 == 0) {
            Jeu.adverse.vie = Jeu.adverse.vie_max = 30;
        }
        else {
            Jeu.adverse.vie = Jeu.adverse.vie_max = 10;
        }
        adversaire_jouer();
        if (Jeu.etage < 100) {
            adversaire_generer(Jeu.etage+1);
        }
        menu();
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
        Jeu.joueur.terrain[n].vie -= Jeu.joueur.terrain[n].stat_etage.vie_max;
        Jeu.joueur.terrain[n].stat_etage = obtenir_carte(0);
        Jeu.joueur.terrain[n].vie -= Jeu.joueur.terrain[n].stat_tour.vie_max;
        Jeu.joueur.terrain[n].stat_tour = obtenir_carte(0);
        if (Jeu.joueur.terrain[n].decompte > 0 && !statistique(Jeu.joueur.terrain[n],"silence")) {
            Jeu.joueur.terrain[n].decompte--;
            if (Jeu.joueur.terrain[n].decompte == 0) {
                Jeu.joueur.terrain[n].effet_decompte();
            }
        }
        if (Jeu.joueur.terrain[n].temporaire && !statistique(Jeu.joueur.terrain[n],"silence")) {
            enlever(Jeu.joueur.terrain[n]);
            n--;
        }
        else if (Jeu.joueur.terrain[n].vie <= 0) {
            mort(Jeu.joueur.terrain[n]);
            n--;
        }
    }
    for (let n=0;n<Jeu.joueur.main.length;n++) {
        if (["Créature","Bâtiment"].includes(Jeu.joueur.main[n].type)) {
            Jeu.joueur.main[n].vie -= Jeu.joueur.main[n].stat_etage.vie_max;
            Jeu.joueur.main[n].stat_etage = obtenir_carte(0);
        }
        if (Jeu.joueur.main[n].temporaire && !statistique(Jeu.joueur.main[n],"silence")) {
            enlever(Jeu.joueur.main[n]);
            n--;
        }
        else if (["Créature","Bâtiment"].includes(Jeu.joueur.main[n].type) && Jeu.joueur.main[n].vie <= 0) {
            mort(Jeu.joueur.main[n]);
            n--;
        }
    }
    for (let n=0;n<Jeu.joueur.defausse.length;n++) {
        if (["Créature","Bâtiment"].includes(Jeu.joueur.defausse[n].type)) {
            Jeu.joueur.defausse[n].vie -= Jeu.joueur.defausse[n].stat_etage.vie_max;
            Jeu.joueur.defausse[n].stat_etage = obtenir_carte(0);
            if (Jeu.joueur.defausse[n].vie < 0) {
                Jeu.joueur.defausse[n].vie = 0;
            }
        }
        Jeu.joueur.defausse[n].etage_mort++;
        if ((Jeu.joueur.defausse[n].etage_mort > 1 && !(Jeu.joueur.defausse[n].eternite && !statistique(Jeu.joueur.defausse[n],"silence"))) || (Jeu.joueur.defausse[n].temporaire && !statistique(Jeu.joueur.defausse[n],"silence"))) {
            enlever(Jeu.joueur.defausse[n]);
            n--;
        }
    }
    for (let n=0;n<Jeu.adverse.terrain.length;n++) {
        Jeu.adverse.terrain[n].vie -= Jeu.adverse.terrain[n].stat_etage.vie_max;
        Jeu.adverse.terrain[n].stat_etage = obtenir_carte(0);
        Jeu.adverse.terrain[n].vie -= Jeu.adverse.terrain[n].stat_tour.vie_max;
        Jeu.adverse.terrain[n].stat_tour = obtenir_carte(0);
        if (Jeu.adverse.terrain[n].decompte > 0 && !statistique(Jeu.adverse.terrain[n],"silence")) {
            Jeu.adverse.terrain[n].decompte--;
            if (Jeu.adverse.terrain[n].decompte == 0) {
                Jeu.adverse.terrain[n].effet_decompte();
            }
        }
        if (Jeu.adverse.terrain[n].temporaire && !statistique(Jeu.adverse.terrain[n],"silence")) {
            enlever(Jeu.adverse.terrain[n]);
            n--;
        }
        else if (Jeu.adverse.terrain[n].vie <= 0) {
            mort(Jeu.adverse.terrain[n]);
            n--;
        }
    }
    for (let n=0;n<Jeu.adverse.main.length;n++) {
        if (["Créature","Bâtiment"].includes(Jeu.adverse.main[n].type)) {
            Jeu.adverse.main[n].vie -= Jeu.adverse.main[n].stat_etage.vie_max;
            Jeu.adverse.main[n].stat_etage = obtenir_carte(0);
        }
        if (Jeu.adverse.main[n].temporaire && !statistique(Jeu.adverse.main[n],"silence")) {
            enlever(Jeu.adverse.main[n]);
            n--;
        }
        else if (["Créature","Bâtiment"].includes(Jeu.adverse.main[n].type) && Jeu.adverse.main[n].vie <= 0) {
            mort(Jeu.adverse.main[n]);
            n--;
        }
    }
    for (let n=0;n<Jeu.adverse.defausse.length;n++) {
        if (["Créature","Bâtiment"].includes(Jeu.adverse.defausse[n].type)) {
            Jeu.adverse.defausse[n].vie -= Jeu.adverse.defausse[n].stat_etage.vie_max;
            Jeu.adverse.defausse[n].stat_etage = obtenir_carte(0);
            if (Jeu.adverse.defausse[n].vie < 0) {
                Jeu.adverse.defausse[n].vie = 0;
            }
        }
        Jeu.adverse.defausse[n].etage_mort++;
        if ((Jeu.adverse.defausse[n].etage_mort > 1 && (!Jeu.adverse.defausse[n].eternite && !statistique(Jeu.adverse.defausse[n],"silence"))) || (Jeu.adverse.defausse[n].temporaire && !statistique(Jeu.adverse.defausse[n],"silence"))) {
            enlever(Jeu.adverse.defausse[n]);
            n--;
        }
    }
    boutique_actualiser();
    if (Jeu.joueur.vie > 0) {
        menu();
    }
    else {
        game_over();
    }
}

function adversaire_generer (etage) {
    if (etage%10 != 0) {
        switch (Math.trunc(etage/10)) {
            case 0:
                Jeu.adverse.ressources[0].courant = Jeu.adverse.ressources[0].max = 5;
                ajouter(obtenir_carte(5),"adverse","main");
                ajouter(obtenir_carte(5),"adverse","main");
                break;
            case 1:
                Jeu.adverse.ressources[0].courant = Jeu.adverse.ressources[0].max = 15;
                ajouter(obtenir_carte(13),"adverse","main");
                ajouter(obtenir_carte(13),"adverse","main");
                break;
            case 2:
                Jeu.adverse.ressources[0].courant = Jeu.adverse.ressources[0].max = 25;
                ajouter(obtenir_carte(60),"adverse","main");
                ajouter(obtenir_carte(60),"adverse","main");
                break;
            case 3:
                Jeu.adverse.ressources[0].courant = Jeu.adverse.ressources[0].max = 35;
                ajouter(obtenir_carte(12),"adverse","main");
                ajouter(obtenir_carte(12),"adverse","main");
                break;
            case 4:
                Jeu.adverse.ressources[0].courant = Jeu.adverse.ressources[0].max = 45;
                ajouter(obtenir_carte(34),"adverse","main");
                ajouter(obtenir_carte(34),"adverse","main");
                break;
            case 5:
                Jeu.adverse.ressources[0].courant = Jeu.adverse.ressources[0].max = 55;
                ajouter(obtenir_carte(62),"adverse","main");
                ajouter(obtenir_carte(62),"adverse","main");
                ajouter(obtenir_carte(2),"adverse","main");
                break;
            case 6:
                Jeu.adverse.ressources[0].courant = Jeu.adverse.ressources[0].max = 65;
                ajouter(obtenir_carte(69),"adverse","main");
                ajouter(obtenir_carte(69),"adverse","main");
                break;
            case 7:
                Jeu.adverse.ressources[0].courant = Jeu.adverse.ressources[0].max = 75;
                ajouter(obtenir_carte(5),"adverse","main");
                ajouter(obtenir_carte(5),"adverse","main");
                break;
            case 8:
                Jeu.adverse.ressources[0].courant = Jeu.adverse.ressources[0].max = 85;
                ajouter(obtenir_carte(9),"adverse","main");
                ajouter(obtenir_carte(9),"adverse","main");
                ajouter(obtenir_carte(28),"adverse","main");
                break;
            case 9:
                Jeu.adverse.ressources[0].courant = Jeu.adverse.ressources[0].max = 85;
                ajouter(obtenir_carte(37),"adverse","main");
                ajouter(obtenir_carte(37),"adverse","main");
                ajouter(obtenir_carte(28),"adverse","main");
                break;
        }
    }
    else {
        switch (etage) {
            case 10:
                Jeu.adverse.ressources[0].courant = Jeu.adverse.ressources[0].max = 10;
                ajouter(obtenir_carte(6),"adverse","main");
                break;
        }
    }
}

function adversaire_jouer () {
    let verifier = true;
    while (Jeu.adverse.main.length > 0 && verifier) {
        verifier = false;
        for (let n=0;n<Jeu.adverse.main.length;n++) {
            if (Jeu.adverse.main[n].effet_pose()) {
                verifier = true;
                n--;
            }   
        }
    }
}

function adversaire_voir () {
    initialiser();
    div("main");
    fonction("Retour","menu()");
    saut(2);
    afficher("Etage : " + Jeu.etage);
    saut();
    afficher("Vie adverse : " + Jeu.adverse.vie + " / " + Jeu.adverse.vie_max);
    saut();
    for (let n=0;n<Jeu.ressources.length;n++) {
        if (Jeu.adverse.ressources[n].max > 0 || Jeu.adverse.ressources[n].courant > 0) {
            afficher(Jeu.ressources[n].nom + " : " + Jeu.adverse.ressources[n].courant + " / " + Jeu.adverse.ressources[n].max);
            saut();
        }
    }
    saut();
    afficher("<u>Main adverse :</u>");
    saut();
    if (Jeu.adverse.main.length > 0) {
        for (let n=0;n<Jeu.adverse.main.length;n++) {
            afficher_carte("adverse","main",n);
            saut();
        }
    }
    else {
        afficher("<i>La main adverse est vide</i>");
        saut();
    }
    saut();
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
    if (!statistique(carte,"silence")) {
        carte.effet_soin(montant);
    }
    for (let n=0;n<Jeu[carte.camp].terrain.length;n++) {
        if (!statistique(Jeu[carte.camp].terrain[n],"silence")) {
            Jeu[carte.camp].terrain[n].effet_soin_carte(carte);
        }
    }
}

function degats (carte,montant) {
    if (carte.resistance > 0 && !statistique(carte,"silence")) {
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
        if (!statistique(carte,"silence")) {
            carte.effet_degat();
        }
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
        if (!statistique(Jeu.joueur.terrain[n],"silence")) {
            Jeu.joueur.terrain[n].effet_mort_carte(carte);
        }
    }
    for (let n=0;n<Jeu.adverse.terrain.length;n++) {
        if (!statistique(Jeu.adverse.terrain[n],"silence")) {
            Jeu.adverse.terrain[n].effet_mort_carte(carte);
        }
    }
}

function sorcellerie (camp) {
    let montant = 0;
    for (let n=0;n<Jeu[camp].terrain.length;n++) {
        if (!statistique(Jeu[camp].terrain[n],"silence")) {
            montant += statistique(Jeu[camp].terrain[n],"sorcellerie");
        }
    }
    return montant;
}

function statistique (carte,nom) {
    let stat = carte[nom];
    stat += carte.stat_etage[nom];
    stat += carte.stat_tour[nom];
    for (let n=0;n<carte.equipements.length;n++) {
        stat += carte.equipements[n][nom];
    }
    return stat;
}

function degats_direct (camp,montant) {
    Jeu[camp].vie -= montant;
}

function soin_direct (camp,montant) {
    Jeu[camp].vie += montant;
    if (Jeu[camp].vie > Jeu[camp].vie_max) {
        Jeu[camp].vie = Jeu[camp].vie_max;
    }
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
    if (!statistique(carte,"silence")) {
        carte.effet_ajouter();
    }
}

function enlever (carte) {
    if (!statistique(carte,"silence")) {
        carte.effet_enlever();
    }
    Jeu[carte.camp][carte.zone].splice(carte.slot,1);
    for (let n=carte.slot;n<Jeu[carte.camp][carte.zone].length;n++) {
        Jeu[carte.camp][carte.zone][n].slot--;
    }
}

function poser (slot) {
    Jeu.joueur.main[slot].effet_pose(1);
}

function effet_pose (carte) {
    for (let n=0;n<Jeu[carte.camp].terrain.length;n++) {
        if (!statistique(Jeu[carte.camp].terrain[n],"silence")) {
            Jeu[carte.camp].terrain[n].effet_pose_carte(carte);
        }
    }
}

function verifier_soin_creature (camp) {
    for (let n=0;n<Jeu[camp].terrain.length;n++) {
        if (Jeu[camp].terrain[n].vie < Jeu[camp].terrain[n].vie_max && Jeu[camp].terrain[n].type == "Créature") {
            return true;
        }
    }
    return false;
}

function verifier_equipement (camp) {
    for (let n=0;n<Jeu[camp].terrain.length;n++) {
        if (Jeu[camp].terrain[n].type == "Créature" && Jeu[camp].terrain[n].equipements.length < Jeu[camp].terrain[n].equipement_max) {
            return true;
        }
    }
    return false;
}

function verifier_creature (camp) {
    for (let n=0;n<Jeu[camp].terrain.length;n++) {
        if (Jeu[camp].terrain[n].type == "Créature") {
            return true;
        }
    }
    return false;
}

function verifier_boutique_or () {
    for (let n=0;n<Jeu.joueur.boutique.length;n++) {
        if (Jeu.joueur.boutique[n].cout[0] > 0) {
            return true;
        }
    }
    return false;
}

function verifier_poison (camp) {
    for (let n=0;n<Jeu[camp].terrain.length;n++) {
        if (Jeu[camp].terrain[n].poison > 0) {
            return true;
        }
    }
    return false;
}

function verifier_debuff (camp) {
    for (let n=0;n<Jeu[camp].terrain.length;n++) {
        if (Jeu[camp].terrain[n].poison > 0 || Jeu[camp].terrain[n].brulure > 0 || Jeu[camp].terrain[n].saignement > 0 || Jeu[camp].terrain[n].maladie > 0 || Jeu[camp].terrain[n].gel > 0 || Jeu[camp].terrain[n].etourdissement || Jeu[camp].terrain[n].silence) {
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
