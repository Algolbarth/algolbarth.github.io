function obtenir_carte (carte_id) {
    let carte = {
        id : carte_id,
        verrouillage : false,
        etage_mort : 0,
        exclusif : false,
        camp : "",
        zone : "",
        slot : 0,
        nom : "",
        type : "Créature",
        familles : [],
        cout : [0,0,0,0,0,0,0,0,0,0,0,0,0],
        vente : [0,0,0,0,0,0,0,0,0,0,0,0,0],
        attaque : 0,
        defense : 0,
        vie : 0,
        vie_max : 0,
        vie_sup : 0,
        action : 0,
        action_max : 0,
        percee : 0,
        protection : false,
        rapidite : false,
        vol_de_vie : false,
        mobile : false,
        sorcellerie : 0,
        portee : false,
        eternite : false,
        mortel : false,
        epine : 0,
        regeneration : 0,
        poison : 0,
        brulure : 0,
        maladie : 0,
        resistance : 0,
        ephemere : false,
        temporaire : false,
        decompte : 0,
        camouflage : false,
        gel : 0,
        etourdissement : false,
        saignement : 0,
        silence : false,
        texte : "Aucun",
        effet_pose : function () {
            deplacer(carte,carte.camp,"terrain");
            effet_pose(carte);
            menu();
            return true;
        },
        effet_pose_carte : function () {},
        effet_ajouter : function () {},
        effet_enlever : function () {},
        effet_attaque : function () {},
        effet_mort : function () {
            if (statistique(carte,"ephemere") && !statistique(carte,"silence")) {
                enlever(carte);
            }
            else {
                deplacer(carte,carte.camp,"defausse");
            }
        },
        effet_mort_carte : function () {},
        effet_tour_debut : function () {},
        effet_degat : function () {},
        effet_tuer : function () {},
        effet_soin : function () {},
        effet_soin_carte : function () {},
        effet_equiper : function () {},
        effet_decompte : function () {},
        effet_vente : function () {},
        effet_vente_carte : function () {},
        boutique_generer : function () {},
        equipements : [],
        equipement_max : 0
    }
    if (carte_id > 0) {
        carte.stat_etage = obtenir_carte(0);
        carte.stat_tour = obtenir_carte(0);
    }
    switch (carte_id) {
        case 1:
            carte.nom = "Humain";
            carte.familles.push("Humain");
            carte.cout[0] = 3;
            carte.vente[0] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 2:
            carte.nom = "Plastron";
            carte.type = "Objet";
            carte.familles.push("Équipement","Armure");
            carte.cout[0] = 2;
            carte.vente[0] = 1;
            carte.vie_max = 2;
            carte.texte = "Donne 2 vie à la Créature équipée.";
            carte.effet_pose = function (step,cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_equipement(carte.camp)) {
                                initialiser();
                                div("main");
                                fonction("Annuler","menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut();
                                afficher("Choisissez une Créature : ");
                                saut(2);
                                for (let n=0;n<Jeu.joueur.terrain.length;n++) {
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].equipements.length < Jeu.joueur.terrain[n].equipement_max) {
                                        afficher_carte("joueur","terrain",n);
                                        afficher(" ");
                                        fonction("Cibler","Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        saut();
                                    }
                                }
                                div_fin();
                                div("carte");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.joueur.terrain[cible].equipements.push(carte);
                            Jeu.joueur.terrain[cible].vie += 2;
                            if (!statistique(Jeu.joueur.terrain[cible],"silence")) {
                                Jeu.joueur.terrain[cible].effet_equiper(carte);
                            }
                            effet_pose(carte);
                            enlever(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_equipement(carte.camp)) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].equipements.length >= Jeu.adverse.terrain[best].equipement_max) {
                            best++;
                        }
                        Jeu.adverse.terrain[best].equipements.push(carte);
                        Jeu.adverse.terrain[best].vie += 2;
                        if (!statistique(Jeu.adverse.terrain[best],"silence")) {
                            Jeu.adverse.terrain[best].effet_equiper(carte);
                        }
                        effet_pose(carte);
                        enlever(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 3:
            carte.nom = "Potion de soin";
            carte.type = "Objet";
            carte.familles.push("Potion");
            carte.cout[0] = 3;
            carte.vente[0] = 1;
            carte.texte = "Soigne 3 à une Créature alliée sur le terrain.";
            carte.effet_pose = function (step,cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_soin_creature(carte.camp)) {
                                initialiser();
                                div("main");
                                fonction("Annuler","menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut();
                                afficher("Choisissez une Créature : ");
                                saut(2);
                                for (let n=0;n<Jeu.joueur.terrain.length;n++) {
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].vie < Jeu.joueur.terrain[n].vie_max) {
                                        afficher_carte("joueur","terrain",n);
                                        afficher(" ");
                                        fonction("Cibler","Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        saut();
                                    }
                                }
                                div_fin();
                                div("carte");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            soin(Jeu.joueur.terrain[cible],3);
                            deplacer(carte,"joueur","defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_soin_creature(carte.camp)) {
                        let best = 0;
                        for (let n=0;n<Jeu.adverse.terrain.length;n++) {
                            if ((Jeu.adverse.terrain[n].vie_max - Jeu.adverse.terrain[n].vie) > (Jeu.adverse.terrain[best].vie_max - Jeu.adverse.terrain[best].vie)) {
                                best = n;
                            }
                        }
                        soin(Jeu.adverse.terrain[best],3);
                        deplacer(carte,"adverse","defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 4:
            carte.nom = "Epée";
            carte.type = "Objet";
            carte.familles.push("Équipement","Arme");
            carte.cout[0] = 2;
            carte.vente[0] = 1;
            carte.attaque = 2;
            carte.texte = "Donne 2 attaque à la Créature équipée.";
            carte.effet_pose = function (step,cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_equipement(carte.camp)) {
                                initialiser();
                                div("main");
                                fonction("Annuler","menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut();
                                afficher("Choisissez une Créature : ");
                                saut(2);
                                for (let n=0;n<Jeu.joueur.terrain.length;n++) {
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].equipements.length < Jeu.joueur.terrain[n].equipement_max) {
                                        afficher_carte("joueur","terrain",n);
                                        afficher(" ");
                                        fonction("Cibler","Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        saut();
                                    }
                                }
                                div_fin();
                                div("carte");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.joueur.terrain[cible].equipements.push(carte);
                            if (!statistique(Jeu.joueur.terrain[cible],"silence")) {
                                Jeu.joueur.terrain[cible].effet_equiper(carte);
                            }
                            effet_pose(carte);
                            enlever(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_equipement(carte.camp)) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].equipements.length >= Jeu.adverse.terrain[best].equipement_max) {
                            best++;
                        }
                        Jeu.adverse.terrain[best].equipements.push(carte);
                        if (!statistique(Jeu.adverse.terrain[best],"silence")) {
                            Jeu.adverse.terrain[best].effet_equiper(carte);
                        }
                        effet_pose(carte);
                        enlever(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 5:
            carte.nom = "Araignée";
            carte.familles.push("Insecte","Araignée");
            carte.cout[9] = 1;
            carte.attaque = 1;
            carte.vie_max = carte.vie = 1;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 6:
            carte.nom = "Géant";
            carte.familles.push("Géant");
            carte.cout[0] = 9;
            carte.vente[0] = 4;
            carte.attaque = 5;
            carte.vie_max = carte.vie = 5;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 7:
            carte.nom = "Forgeron";
            carte.familles.push("Humain");
            carte.cout[0] = 5;
            carte.vente[0] = 2;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Crée un Objet Équipement aléatoire dans la boutique.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    if (!statistique(carte,"silence")) {
                        let verifier = false;
                        for (let n=0;n<Jeu.NOMBRE_CARTE;n++) {
                            if (Jeu.joueur.regions[Jeu.region_active].boutique_generer(obtenir_carte(n)) && obtenir_carte(n).familles.includes("Équipement")) {
                                verifier = true;
                            }
                        }
                        if (verifier) {
                            let nouvelle_carte = boutique_generer();
                            while (!nouvelle_carte.familles.includes("Équipement")) {
                                nouvelle_carte = boutique_generer();
                            }
                            ajouter(nouvelle_carte,"joueur","boutique");
                        }
                    }
                    deplacer(carte,"joueur","terrain");
                    effet_pose(carte);
                    menu();
                }
                else {
                    deplacer(carte,"adverse","terrain");
                    effet_pose(carte);
                    return true;
                }
            }
            break;
        case 8:
            carte.nom = "Roi";
            carte.familles.push("Humain");
            carte.cout[0] = 9;
            carte.vente[0] = 4;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Donne 1 attaque et 1 vie à toutes les Créatures alliées sur le terrain.";
            carte.effet_pose = function () {
                if (!statistique(carte,"silence")) {
                    for (let n=0;n<Jeu[carte.camp].terrain.length;n++) {
                        if (Jeu[carte.camp].terrain[n].type == "Créature") {
                            Jeu[carte.camp].terrain[n].attaque++;
                            Jeu[carte.camp].terrain[n].vie_max++;
                            Jeu[carte.camp].terrain[n].vie++;
                        }
                    }
                }
                deplacer(carte,carte.camp,"terrain");
                effet_pose(carte);
                menu();
                return true;
            }
            break;
        case 9:
            carte.nom = "Dragon";
            carte.familles.push("Dragon");
            carte.cout[0] = 5;
            carte.cout[1] = 2;
            carte.cout[5] = 2;
            carte.vente[0] = 2;
            carte.vente[1] = 1;
            carte.vente[5] = 1;
            carte.attaque = 5;
            carte.vie_max = carte.vie = 5;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 10:
            carte.nom = "Prêtre";
            carte.familles.push("Humain");
            carte.cout[0] = 6;
            carte.vente[0] = 3;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Soigne 3 à une Créature alliée sur le terrain.";
            carte.effet_pose = function (step,cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_soin_creature(carte.camp) && !statistique(carte,"silence")) {
                                initialiser();
                                div("main");
                                fonction("Annuler","menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut();
                                afficher("Choisissez une Créature : ");
                                saut(2);
                                for (let n=0;n<Jeu.joueur.terrain.length;n++) {
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].vie < Jeu.joueur.terrain[n].vie_max) {
                                        afficher_carte("joueur","terrain",n);
                                        afficher(" ");
                                        fonction("Cibler","Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        saut();
                                    }
                                }
                                div_fin();
                                div("carte");
                                div_fin();
                                actualiser();
                            }
                            else {
                                deplacer(carte,"joueur","terrain");
                                effet_pose(carte);
                                menu();
                            }
                            break;
                        case 2:
                            soin(Jeu.joueur.terrain[cible],3);
                            deplacer(carte,"joueur","terrain");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_soin_creature(carte.camp) && !statistique(carte,"silence")) {
                        let best = 0;
                        for (let n=0;n<Jeu.adverse.terrain.length;n++) {
                            if ((Jeu.adverse.terrain[n].vie_max - Jeu.adverse.terrain[n].vie) > (Jeu.adverse.terrain[best].vie_max - Jeu.adverse.terrain[best].vie) && Jeu.adverse.terrain[n].type == "Créature") {
                                best = n;
                            }
                        }
                        soin(Jeu.adverse.terrain[best],3);
                    }
                    deplacer(carte,"adverse","terrain");
                    effet_pose(carte);
                    return true;
                }
            }
            break;
        case 11:
            carte.nom = "Marchand";
            carte.familles.push("Humain");
            carte.cout[0] = 5;
            carte.vente[0] = 2;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Donne 1 Or max.";
            carte.effet_pose = function () {
                if (!statistique(carte,"silence")) {
                    Jeu[carte.camp].ressources[0].max++;
                }
                deplacer(carte,carte.camp,"terrain");
                effet_pose(carte);
                menu();
            }
            break;
        case 12:
            carte.nom = "Garde";
            carte.familles.push("Humain");
            carte.cout[0] = 5;
            carte.vente[0] = 2;
            carte.attaque = 2;
            carte.defense = 1;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 13:
            carte.nom = "Squelette";
            carte.familles.push("Mort-vivant","Squelette");
            carte.cout[0] = 1;
            carte.cout[9] = 1;
            carte.vente[0] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 1;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 14:
            carte.nom = "Nécromancien";
            carte.familles.push("Mort-vivant","Revenant","Mage");
            carte.cout[0] = 3;
            carte.cout[9] = 2;
            carte.vente[0] = 1;
            carte.vente[9] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand attaque : Crée <a href='javascript:carte_voir_id(13)'>Squelette</a> sur le terrain.";
            carte.effet_attaque = function () {
                let nouvelle_carte = obtenir_carte(13);
                nouvelle_carte.vente = [0,0,0,0,0,0,0,0,0,0,0,0,0];
                ajouter(nouvelle_carte,carte.camp,carte.zone);
            }
            break;
        case 15:
            carte.nom = "Roi des élements";
            carte.familles.push("Hydre");
            carte.cout = [0,5,5,5,5,5,5,5,5,5,5,5,5];
            carte.vente = [0,2,2,2,2,2,2,2,2,2,2,2,2];
            carte.attaque = 25;
            carte.vie_max = carte.vie = 26;
            carte.action_max = 3;
            carte.equipement_max = 1;
            break;
        case 16:
            carte.nom = "Bombe";
            carte.type = "Objet";
            carte.familles.push("Explosif");
            carte.cout[0] = 3;
            carte.vente[0] = 1;
            carte.texte = "Inflige 3 dégâts à une Créature ou un Bâtiment adverse sur le terrain.";
            carte.effet_pose = function (step,cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (Jeu.adverse.terrain.length > 0) {
                                initialiser();
                                div("main");
                                fonction("Annuler","menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut();
                                afficher("Choisissez une Créature ou un Bâtiment adverse : ");
                                saut(2);
                                for (let n=0;n<Jeu.adverse.terrain.length;n++) {
                                    afficher_carte("adverse","terrain",n);
                                    afficher(" ");
                                    fonction("Cibler","Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                    saut();
                                }
                                div_fin();
                                div("carte");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            degats(Jeu.adverse.terrain[cible],3);
                            deplacer(carte,"joueur","defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (Jeu.joueur.terrain.length > 0) {
                        let best = 0;
                        for (let n=0;n<Jeu.joueur.terrain.length;n++) {
                            if (Jeu.joueur.terrain[n].vie <= 3) {
                                best = n;
                            }
                        }
                        degats(Jeu.joueur.terrain[best],3);
                        deplacer(carte,"adverse","defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 17:
            carte.nom = "Pluie de flèche";
            carte.type = "Action";
            carte.cout[0] = 3;
            carte.vente[0] = 1;
            carte.texte = "Inflige 1 dégât à toutes les Créatures et Bâtiments adverses sur le terrain.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    if (Jeu.adverse.terrain.length > 0) {
                        for (let n=Jeu.adverse.terrain.length-1;n>=0;n--) {
                            degats(Jeu.adverse.terrain[n],1);
                        }
                        deplacer(carte,"joueur","defausse");
                        effet_pose(carte);
                        menu();
                    }
                }
                else {
                    if (Jeu.joueur.terrain.length > 0) {
                        for (let n=Jeu.joueur.terrain.length-1;n>=0;n--) {
                            degats(Jeu.joueur.terrain[n],1);
                        }
                        deplacer(carte,"adverse","defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 18:
            carte.nom = "Lancier";
            carte.type = "Créature";
            carte.familles.push("Humain");
            carte.cout[0] = 4;
            carte.vente[0] = 2;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.percee = 1;
            break;
        case 19:
            carte.nom = "Cheval";
            carte.type = "Créature";
            carte.familles.push("Bête");
            carte.cout[0] = 5;
            carte.vente[0] = 2;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.rapidite = true;
            break;
        case 20:
            carte.nom = "Gardien";
            carte.type = "Créature";
            carte.familles.push("Humain");
            carte.cout[0] = 5;
            carte.vente[0] = 2;
            carte.attaque = 1;
            carte.vie_max = carte.vie = 3;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.protection = true;
            break;
        case 21:
            carte.nom = "Vampire";
            carte.type = "Créature";
            carte.familles.push("Vampire");
            carte.cout[0] = 5;
            carte.cout[11] = 4;
            carte.vente[0] = 2;
            carte.vente[11] = 2;
            carte.attaque = 4;
            carte.vie_max = carte.vie = 4;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.vol_de_vie = true;
            break;
        case 22:
            carte.nom = "Automate embarqué";
            carte.type = "Créature";
            carte.familles.push("Machine","Automate");
            carte.cout[0] = 3;
            carte.cout[7] = 3;
            carte.vente[0] = 2;
            carte.vente[7] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand meurt : Crée <a href='javascript:carte_voir_id(23)'>Automate</a> sur le terrain.";
            carte.effet_mort = function () {
                if (!statistique(carte,"silence")) {
                    let nouvelle_carte = obtenir_carte(23);
                    nouvelle_carte.vente = [0,0,0,0,0,0,0,0,0,0,0,0,0];
                    ajouter(nouvelle_carte,carte.camp,carte.zone);
                }
                if (statistique(carte,"ephemere")) {
                    enlever(carte);
                }
                else {
                    deplacer(carte,carte.camp,"defausse");
                }
            }
            break;
        case 23:
            carte.nom = "Automate";
            carte.type = "Créature";
            carte.familles.push("Machine","Automate");
            carte.cout[0] = 2;
            carte.cout[7] = 1;
            carte.vente[0] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 24:
            carte.nom = "Mur";
            carte.type = "Bâtiment";
            carte.familles.push("Mur");
            carte.cout[0] = 3;
            carte.vente[0] = 1;
            carte.vie_max = carte.vie = 4;
            break;
        case 25:
            carte.nom = "Bateau pirate";
            carte.type = "Bâtiment";
            carte.familles.push("Bateau","Pirate");
            carte.cout[0] = 4;
            carte.cout[2] = 3;
            carte.vente[0] = 2;
            carte.vente[2] = 1;
            carte.vie_max = carte.vie = 4;
            carte.action_max = 1;
            carte.mobile = true;
            carte.texte = "Quand attaque : Crée <a href='javascript:carte_voir_id(26)'>Pirate</a> sur le terrain.";
            carte.effet_attaque = function () {
                let nouvelle_carte = obtenir_carte(26);
                nouvelle_carte.vente = [0,0,0,0,0,0,0,0,0,0,0,0,0];
                ajouter(nouvelle_carte,carte.camp,carte.zone);
            }
            break;
        case 26:
            carte.nom = "Pirate";
            carte.type = "Créature";
            carte.familles.push("Humain","Pirate");
            carte.cout[0] = 2;
            carte.cout[2] = 1;
            carte.vente[0] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 27:
            carte.nom = "Mage";
            carte.type = "Créature";
            carte.familles.push("Humain","Mage");
            carte.cout[0] = 4;
            carte.vente[0] = 2;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.sorcellerie = 1;
            carte.equipement_max = 1;
            break;
        case 28:
            carte.nom = "Boule de feu";
            carte.type = "Action";
            carte.familles.push("Sort");
            carte.cout[0] = 2;
            carte.cout[1] = 1;
            carte.vente[0] = 1;
            carte.texte = "Inflige 3 dégâts à une Créature ou un Bâtiment adverse sur le terrain.<br/>Sorcellerie (2) : Inflige 5 dégâts à une Créature ou un Bâtiment adverse sur le terrain.";
            carte.effet_pose = function (step,cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (Jeu.adverse.terrain.length > 0) {
                                initialiser();
                                div("main");
                                fonction("Annuler","menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut();
                                afficher("Choisissez une Créature ou un Bâtiment adverse : ");
                                saut(2);
                                for (let n=0;n<Jeu.adverse.terrain.length;n++) {
                                    afficher_carte("adverse","terrain",n);
                                    afficher(" ");
                                    fonction("Cibler","Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                    saut();
                                }
                                div_fin();
                                div("carte");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            let carte_cible = Jeu.adverse.terrain[cible];
                            if (sorcellerie("joueur") >= 2) {
                                degats(carte_cible,5);
                            }
                            else {
                                degats(carte_cible,3);
                            }
                            deplacer(carte,"joueur","defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (Jeu.joueur.terrain.length > 0) {
                        let best = 0;
                        if (sorcellerie("adverse") >= 2) {
                            for (let n=0;n<Jeu.adverse.terrain.length;n++) {
                                if (Jeu.joueur.terrain[n].vie <= 5) {
                                    best = n;
                                }
                            }
                            degats(Jeu.joueur.terrain[n],5);
                        }
                        else {
                            for (let n=0;n<Jeu.adverse.terrain.length;n++) {
                                if (Jeu.joueur.terrain[n].vie <= 3) {
                                    best = n;
                                }
                            }
                            degats(Jeu.joueur.terrain[n],3);
                        }
                        deplacer(carte,"adverse","defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 29:
            carte.nom = "Coffre";
            carte.type = "Objet";
            carte.cout[0] = 2;
            carte.vente[0] = 1;
            carte.texte = "Crée une carte aléatoire dans la boutique.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    ajouter(boutique_generer(),"joueur","boutique");
                    deplacer(carte,"joueur","defausse");
                    effet_pose(carte);
                    menu();
                }
                else {
                    return false;
                }
            }
            break;
        case 30:
            carte.nom = "Bottes";
            carte.type = "Objet";
            carte.familles.push("Équipement","Armure");
            carte.cout[0] = 2;
            carte.vente[0] = 1;
            carte.rapidite = true;
            carte.texte = "Applique Rapidité à la Créature équipée.";
            carte.effet_pose = function (step,cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_equipement(carte.camp)) {
                                initialiser();
                                div("main");
                                fonction("Annuler","menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut();
                                afficher("Choisissez une Créature : ");
                                saut(2);
                                for (let n=0;n<Jeu.joueur.terrain.length;n++) {
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].equipements.length < Jeu.joueur.terrain[n].equipement_max) {
                                        afficher_carte("joueur","terrain",n);
                                        afficher(" ");
                                        fonction("Cibler","Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        saut();
                                    }
                                }
                                div_fin();
                                div("carte");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.joueur.terrain[cible].equipements.push(carte);
                            if (!statistique(Jeu.joueur.terrain[cible],"silence")) {
                                Jeu.joueur.terrain[cible].effet_equiper(carte);
                            }
                            effet_pose(carte);
                            enlever(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_equipement(carte.camp)) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].equipements.length >= Jeu.adverse.terrain[best].equipement_max) {
                            best++;
                        }
                        Jeu.adverse.terrain[best].equipements.push(carte);
                        if (!statistique(Jeu.adverse.terrain[best],"silence")) {
                            Jeu.adverse.terrain[best].effet_equiper(carte);
                        }
                        effet_pose(carte);
                        enlever(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 31:
            carte.nom = "Seconde chance";
            carte.type = "Action";
            carte.cout[0] = 2;
            carte.vente[0] = 1;
            carte.texte = "Actualise la boutique.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    boutique_actualiser();
                    deplacer(carte,"joueur","defausse");
                    effet_pose(carte);
                    menu();
                }
                else {
                    return false;
                }
            }
            break;
        case 32:
            carte.nom = "Usine robotique";
            carte.type = "Bâtiment";
            carte.familles.push("Machine","Robot");
            carte.cout[0] = 5;
            carte.cout[6] = 1;
            carte.cout[7] = 1;
            carte.vente[0] = 1;
            carte.vente[6] = 1;
            carte.vente[7] = 1;
            carte.vie_max = carte.vie = 2;
            carte.mobile = false;
            carte.texte = "Au début d'un tour de combat : Crée <a href='javascript:carte_voir_id(33)'>Robot</a> sur le terrain.";
            carte.effet_tour_debut = function () {
                let nouvelle_carte = obtenir_carte(33);
                nouvelle_carte.vente = [0,0,0,0,0,0,0,0,0,0,0,0,0];
                ajouter(nouvelle_carte,carte.camp,carte.zone);
            }
            break;
        case 33:
            carte.nom = "Robot";
            carte.type = "Créature";
            carte.familles.push("Machine","Robot");
            carte.cout[0] = 1;
            carte.cout[6] = 1;
            carte.cout[7] = 1;
            carte.vente[0] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 34:
            carte.nom = "Berserker";
            carte.type = "Créature";
            carte.familles.push("Nordique");
            carte.cout[0] = 3;
            carte.cout[12] = 2;
            carte.vente[0] = 1;
            carte.vente[12] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 3;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand subit des dégâts : Se donne 1 attaque.";
            carte.effet_degat = function () {
                carte.attaque++;
            }
            break;
        case 35:
            carte.nom = "Maître d'armes";
            carte.type = "Créature";
            carte.familles.push("Humain");
            carte.cout[0] = 4;
            carte.vente[0] = 2;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 2;
            break;
        case 36:
            carte.nom = "Négociant";
            carte.type = "Créature";
            carte.familles.push("Humain");
            carte.cout[0] = 4;
            carte.vente[0] = 2;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Diminue le cout d'une carte de la boutique de 2 Or.";
            carte.effet_pose = function (step,cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_boutique_or() && !statistique(carte,"silence")) {
                                initialiser();
                                div("main");
                                fonction("Annuler","menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut();
                                afficher("Choisissez une carte : ");
                                saut(2);
                                for (let n=0;n<Jeu.joueur.boutique.length;n++) {
                                    afficher_carte("joueur","boutique",n);
                                    afficher(" ");
                                    fonction("Cibler","Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                    saut();
                                }
                                div_fin();
                                div("carte");
                                div_fin();
                                actualiser();
                            }
                            else {
                                deplacer(carte,"joueur","terrain");
                                effet_pose(carte);
                                menu();
                            }
                            break;
                        case 2:
                            Jeu.joueur.boutique[cible].cout[0] -= 2;
                            if (Jeu.joueur.boutique[cible].cout[0] < 0) {
                                Jeu.joueur.boutique[cible].cout[0] = 0;
                            }
                            deplacer(carte,"joueur","terrain");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    deplacer(carte,"adverse","terrain");
                    effet_pose(carte);
                    menu();
                    return true;
                }
            }
            break;
        case 37:
            carte.nom = "Démon";
            carte.type = "Créature";
            carte.familles.push("Démon");
            carte.cout[0] = 5;
            carte.cout[1] = 2;
            carte.cout[9] = 2;
            carte.vente[0] = 2;
            carte.vente[1] = 1;
            carte.vente[9] = 1;
            carte.attaque = 6;
            carte.vie_max = carte.vie = 6;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Inflige 2 dégâts au Meneur allié.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    if (!statistique(carte,"silence")) {
                        degats_direct("joueur",2);
                    }
                    deplacer(carte,carte.camp,"terrain");
                    effet_pose(carte);
                    if (Jeu.joueur.vie > 0) {
                        menu();
                    }
                    else {
                        game_over();
                    }
                }
                else {   
                    if (Jeu.adverse.vie >= 2) {
                        if (!statistique(carte,"silence")) {
                            degats_direct("adverse",2);
                        }
                        deplacer(carte,carte.camp,"terrain");
                        effet_pose(carte);
                        menu();
                    }
                }
                return true;
            }
            break;
        case 38:
            carte.nom = "Archer";
            carte.type = "Créature";
            carte.familles.push("Humain");
            carte.cout[0] = 4;
            carte.vente[0] = 2;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.portee = true;
            break;
        case 39:
            carte.nom = "Rappel";
            carte.type = "Action";
            carte.cout[0] = 5;
            carte.vente[0] = 2;
            carte.texte = "Place une carte située dans la défausse dans la main. Si c'est une Créature ou un Bâtiment, la soigne complétement.";
            carte.effet_pose = function (step,cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (Jeu.joueur.defausse.length > 0) {
                                initialiser();
                                div("main");
                                fonction("Annuler","menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut();
                                afficher("Choisissez une carte : ");
                                saut(2);
                                for (let n=0;n<Jeu.joueur.defausse.length;n++) {
                                        afficher_carte("joueur","defausse",n);
                                        afficher(" ");
                                        fonction("Cibler","Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        saut();
                                }
                                div_fin();
                                div("carte");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.joueur.defausse[cible].vie = Jeu.joueur.defausse[cible].vie_max;
                            deplacer(Jeu.joueur.defausse[cible],"joueur","main");
                            deplacer(carte,"joueur","defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (Jeu.adverse.defausse.length > 0) {
                        let best = 0;
                        for (let n=0;n < Jeu.adverse.defausse.length;n++) {
                            if (cout_total(Jeu.adverse.defausse[n]) > cout_total(Jeu.adverse.defausse[best])) {
                                best = n;
                            }
                        }
                        Jeu.adverse.defausse[best].vie = Jeu.adverse.defausse[best].vie_max;
                        deplacer(Jeu.adverse.defausse[best],"adverse","main");
                        deplacer(carte,"adverse","defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 40:
            carte.nom = "Revenant éternel";
            carte.type = "Créature";
            carte.familles.push("Mort-vivant","Revenant");
            carte.cout[0] = 2;
            carte.cout[9] = 2;
            carte.vente[0] = 1;
            carte.vente[9] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.eternite = true;
            break;
        case 41:
            carte.nom = "Phoenix";
            carte.type = "Créature";
            carte.familles.push("Phoenix");
            carte.cout[0] = 5;
            carte.cout[1] = 2;
            carte.cout[5] = 2;
            carte.vente[0] = 2;
            carte.vente[1] = 1;
            carte.vente[5] = 1;
            carte.attaque = 3;
            carte.vie_max = carte.vie = 3;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand meurt : Se soigne complétement et revient dans la main.";
            carte.effet_mort = function () {
                if (!statistique(carte,"silence")) {
                    if (statistique(carte,"ephemere")) {
                        enlever(carte);
                    }
                    else {
                        carte.vie = carte.vie_max;
                        deplacer(carte,carte.camp,"main");
                    } 
                }
                else {
                    deplacer(carte,carte.camp,"defausse");
                }
            }
            break;
        case 42:
            carte.nom = "Faucheuse";
            carte.type = "Créature";
            carte.familles.push("Faucheuse");
            carte.cout[0] = 5;
            carte.cout[9] = 4;
            carte.vente[0] = 2;
            carte.vente[9] = 2;
            carte.attaque = 1;
            carte.vie_max = carte.vie = 4;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.mortel = true;
            break;
        case 43:
            carte.nom = "Ogre";
            carte.type = "Créature";
            carte.familles.push("Ogre");
            carte.cout[0] = 5;
            carte.cout[9] = 4;
            carte.vente[0] = 2;
            carte.vente[9] = 2;
            carte.attaque = 4;
            carte.vie_max = carte.vie = 4;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand tue une Créature : Se soigne de 2.";
            carte.effet_tuer = function (defenseur) {
                soin(carte,2);
            }
            break;
        case 44:
            carte.nom = "Hérisson";
            carte.type = "Créature";
            carte.familles.push("Bête");
            carte.cout[0] = 1;
            carte.cout[3] = 1;
            carte.vente[0] = 1;
            carte.attaque = 1;
            carte.vie_max = carte.vie = 1;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.epine = 1;
            break;
        case 45:
            carte.nom = "Héros";
            carte.type = "Créature";
            carte.familles.push("Humain");
            carte.cout[0] = 9;
            carte.vente[0] = 4;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand une Créature alliée est posée : Se donne 1 attaque et 1 vie.";
            carte.effet_pose_carte = function (carte_pose) {
                if (carte_pose.camp == carte.camp && carte_pose.type == "Créature") {
                    carte.attaque++;
                    carte.vie++;
                    carte.vie_max++;
                }
            }
            break;
        case 46:
            carte.nom = "Liche mangeuse d'âme";
            carte.type = "Créature";
            carte.familles.push("Mort-vivant","Liche");
            carte.cout[0] = 6;
            carte.cout[8] = 3;
            carte.cout[9] = 3;
            carte.vente[0] = 3;
            carte.vente[8] = 1;
            carte.vente[9] = 1;
            carte.attaque = 5;
            carte.vie_max = carte.vie = 5;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand une Créature meurt : Se donne 1 vie.";
            carte.effet_mort_carte = function (carte_mort) {
                if (carte_mort.type == "Créature") {
                    carte.vie++;
                    carte.vie_max++;
                }
            }
            break;
        case 47:
            carte.nom = "Tréant";
            carte.type = "Créature";
            carte.familles.push("Plante","Tréant");
            carte.cout[0] = 5;
            carte.cout[3] = 4;
            carte.vente[0] = 2;
            carte.vente[3] = 2;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 6;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.regeneration = 2;
            break;
        case 48:
            carte.nom = "Araignée empoisonnée";
            carte.type = "Créature";
            carte.familles.push("Insecte","Araignée");
            carte.cout[0] = 1;
            carte.cout[9] = 1;
            carte.vente[0] = 1;
            carte.attaque = 1;
            carte.vie_max = carte.vie = 1;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand attaque : applique Poison 1 à la Créature attaquée.";
            carte.effet_attaque = function (defenseur) {
                if (defenseur.type == "Créature") {
                    defenseur.poison++;
                }
            }
            break;
        case 49:
            carte.nom = "Dague empoisonnée";
            carte.type = "Objet";
            carte.familles.push("Équipement","Arme");
            carte.cout[0] = 2;
            carte.vente[0] = 1;
            carte.texte = "Applique l'effet suivant à la Créature équipée : Quand attaque : applique Poison 1 à la Créature attaquée.<br/>ou<br/>Applique Poison 1 à une Créature adverse sur le terrain.";
            carte.effet_pose = function (step,cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            initialiser();
                            div("main");
                            fonction("Annuler","menu()");
                            saut(2);
                            afficher(carte.nom);
                            saut();
                            afficher(carte.texte);
                            saut();
                            afficher("Choisissez un effet : ");
                            saut(2);
                            fonction("Applique l'effet suivant à la Créature équipée : Quand attaque : applique Poison 1 à la Créature attaquée","Jeu.joueur.main[" + carte.slot + "].effet_pose(2)");
                            saut();
                            afficher("ou");
                            saut();
                            fonction("Applique Poison 1 à une Créature adverse sur le terrain","Jeu.joueur.main[" + carte.slot + "].effet_pose(4)");                   
                            div_fin();
                            div("carte");
                            div_fin();
                            actualiser();
                            break;
                        case 2:
                            if (verifier_equipement(carte.camp)) {
                                initialiser();
                                div("main");
                                fonction("Retour","Jeu.joueur.main[" + carte.slot + "].effet_pose(1)");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher("Applique l'effet suivant à la Créature équipée : Quand attaque : applique Poison 1 à la Créature attaquée.");
                                saut();
                                afficher("Choisissez une Créature : ");
                                saut(2);
                                for (let n=0;n<Jeu.joueur.terrain.length;n++) {
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].equipements.length < Jeu.joueur.terrain[n].equipement_max) {
                                        afficher_carte("joueur","terrain",n);
                                        afficher(" ");
                                        fonction("Cibler","Jeu.joueur.main[" + carte.slot + "].effet_pose(3," + n + ")");
                                        saut();
                                    }
                                }
                                div_fin();
                                div("carte");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 3:
                            Jeu.joueur.terrain[cible].equipements.push(carte);
                            if (!statistique(Jeu.joueur.terrain[cible],"silence")) {
                                Jeu.joueur.terrain[cible].effet_equiper(carte);
                            }
                            effet_pose(carte);
                            enlever(carte);
                            menu();
                            break;
                        case 4:
                            if (verifier_creature("adverse")) {
                                initialiser();
                                div("main");
                                fonction("Retour","Jeu.joueur.main[" + carte.slot + "].effet_pose(1)");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher("Applique Poison 1 à une Créature adverse sur le terrain.");
                                saut();
                                afficher("Choisissez une Créature : ");
                                saut(2);
                                for (let n=0;n<Jeu.adverse.terrain.length;n++) {
                                    if (Jeu.adverse.terrain[n].type == "Créature") {
                                        afficher_carte("adverse","terrain",n);
                                        afficher(" ");
                                        fonction("Cibler","Jeu.joueur.main[" + carte.slot + "].effet_pose(5," + n + ")");
                                        saut();
                                    }
                                }
                                div_fin();
                                div("carte");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 5:
                            Jeu.adverse.terrain[cible].poison++;
                            deplacer(carte,"joueur","defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_equipement(carte.camp)) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].equipements.length >= Jeu.adverse.terrain[best].equipement_max) {
                            best++;
                        }
                        Jeu.adverse.terrain[best].equipements.push(carte);
                        if (!statistique(Jeu.adverse.terrain[best],"silence")) {
                            Jeu.adverse.terrain[best].effet_equiper(carte);
                        }
                        effet_pose(carte);
                        enlever(carte);
                        return true;
                    }
                    else if (verifier_creature("joueur")) {
                        let best = 0;
                        while (Jeu.joueur.terrain[best].type != "Créature") {
                            best++;
                        }
                        Jeu.joueur.terrain[best].poison++;
                        deplacer(carte,"adverse","defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            carte.effet_attaque = function (defenseur) {
                if (defenseur.type == "Créature") {
                    defenseur.poison++;
                }
            }
            break;
        case 50:
            carte.nom = "Antidote";
            carte.type = "Objet";
            carte.familles.push("Potion");
            carte.cout[0] = 3;
            carte.vente[0] = 1;
            carte.texte = "Enlève Poison à une Créature alliée sur le terrain.";
            carte.effet_pose = function (step,cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_poison("joueur")) {
                                initialiser();
                                div("main");
                                fonction("Annuler","menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut();
                                afficher("Choisissez une Créature : ");
                                saut(2);
                                for (let n=0;n<Jeu.joueur.terrain.length;n++) {
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].poison > 0) {
                                        afficher_carte("joueur","terrain",n);
                                        afficher(" ");
                                        fonction("Cibler","Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        saut();
                                    }
                                }
                                div_fin();
                                div("carte");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.joueur.terrain[cible] = 0;
                            deplacer(carte,"joueur","defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_poison("adverse")) {
                        let best = 0;
                        for (let n=0;n<Jeu.adverse.terrain.length;n++) {
                            if (Jeu.adverse.terrain[n].poison > Jeu.adverse.terrain[best].poison) {
                                best = n;
                            }
                        }
                        Jeu.adverse.terrain[best].poison = 0;
                        deplacer(carte,"adverse","defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 51:
            carte.nom = "Ifrit";
            carte.type = "Créature";
            carte.familles.push("Ifrit");
            carte.cout[0] = 5;
            carte.cout[1] = 4;
            carte.vente[0] = 2;
            carte.vente[1] = 2;
            carte.attaque = 5;
            carte.vie_max = carte.vie = 4;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand attaque : Applique Brûlure 1 à la Créature ou au Bâtiment attaquée.";
            carte.effet_attaque = function (defenseur) {
                if (defenseur.brulure < 1) {
                    defenseur.brulure = 1;
                }
            }
            break;
        case 52:
            carte.nom = "Fidèle espérant";
            carte.type = "Créature";
            carte.familles.push("Humain","Église");
            carte.cout[0] = 3;
            carte.cout[10] = 2;
            carte.vente[0] = 1;
            carte.vente[10] = 1;
            carte.attaque = 1;
            carte.vie_max = carte.vie = 3;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand est soigné : Crée une carte aléatoire dans la boutique.";
            carte.effet_soin = function () {
                if (carte.camp == "joueur") {
                    ajouter(boutique_generer(),"joueur","boutique");
                }
            }
            break;
        case 53:
            carte.nom = "Paladin";
            carte.type = "Créature";
            carte.familles.push("Humain","Paladin");
            carte.cout[0] = 5;
            carte.cout[10] = 4;
            carte.vente[0] = 2;
            carte.vente[10] = 2;
            carte.attaque = 4;
            carte.vie_max = carte.vie = 5;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.vie_sup = 2;
            break;
        case 54:
            carte.nom = "Serpent de mer";
            carte.type = "Créature";
            carte.familles.push("Poisson","Serpent de mer");
            carte.cout[0] = 5;
            carte.cout[2] = 4;
            carte.vente[0] = 2;
            carte.vente[2] = 2;
            carte.attaque = 5;
            carte.vie_max = carte.vie = 5;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Détruit une carte dans la boutique et se donne 1 vie.";
            carte.effet_pose = function (step,cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (Jeu.joueur.boutique.length > 0 && !statistique(carte,"silence")) {
                                initialiser();
                                div("main");
                                fonction("Annuler","menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut();
                                afficher("Choisissez une carte : ");
                                saut(2);
                                for (let n=0;n<Jeu.joueur.boutique.length;n++) {
                                    afficher_carte("joueur","boutique",n);
                                    afficher(" ");
                                    fonction("Cibler","Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                    saut();
                                }
                                div_fin();
                                div("carte");
                                div_fin();
                                actualiser();
                            }
                            else {
                                deplacer(carte,"joueur","terrain");
                                effet_pose(carte);
                                menu();
                            }
                            break;
                        case 2:
                            carte.vie = ++carte.vie_max;
                            enlever(Jeu.joueur.boutique[cible]);
                            deplacer(carte,"joueur","terrain");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    deplacer(carte,"adverse","terrain");
                    effet_pose(carte);
                    menu();
                    return true;
                }
            }
            break;
        case 55:
            carte.nom = "Panacée";
            carte.type = "Objet";
            carte.familles.push();
            carte.cout[0] = 5;
            carte.vente[0] = 2;
            carte.texte = "Enlève tous les talents négatifs à une Créature alliée sur le terrain.";
            carte.effet_pose = function (step,cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_debuff("joueur")) {
                                initialiser();
                                div("main");
                                fonction("Annuler","menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut();
                                afficher("Choisissez une Créature : ");
                                saut(2);
                                for (let n=0;n<Jeu.joueur.terrain.length;n++) {
                                    if (Jeu.joueur.terrain[n].type == "Créature" && (Jeu.joueur.terrain[n].poison > 0 || Jeu.joueur.terrain[n].brulure > 0 || Jeu.joueur.terrain[n].saignement > 0 || Jeu.joueur.terrain[n].maladie > 0 || Jeu.joueur.terrain[n].etourdissement || Jeu.joueur.terrain[n].silence)) {
                                        afficher_carte("joueur","terrain",n);
                                        afficher(" ");
                                        fonction("Cibler","Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        saut();
                                    }
                                }
                                div_fin();
                                div("carte");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.joueur.terrain[cible].poison = 0;
                            Jeu.joueur.terrain[cible].brulure = 0;
                            Jeu.joueur.terrain[cible].saignement = 0;
                            Jeu.joueur.terrain[cible].maladie = 0;
                            Jeu.joueur.terrain[cible].gel = 0;
                            Jeu.joueur.terrain[cible].etourdissement = false;
                            Jeu.joueur.terrain[cible].silence = false;
                            deplacer(carte,"joueur","defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_debuff("adverse")) {
                        let best = 0;
                        for (let n=0;n<Jeu.adverse.terrain.length;n++) {
                            let debuff = Jeu.adverse.terrain[n].poison + Jeu.adverse.terrain[n].brulure*2 + Jeu.adverse.terrain[n].saignement + Jeu.adverse.terrain[n].maladie + Jeu.adverse.terrain[n].gel*2 + Jeu.adverse.terrain[n].etourdissement*3 + Jeu.adverse.terrain[n].silence*5;
                            let best_debuff = Jeu.adverse.terrain[best].poison + Jeu.adverse.terrain[best].brulure*2 + Jeu.adverse.terrain[best].saignement + Jeu.adverse.terrain[best].maladie + Jeu.adverse.terrain[best].gel*2 + Jeu.adverse.terrain[best].etourdissement*3 + Jeu.adverse.terrain[best].silence*5;
                            if (debuff > best_debuff) {
                                best = n;
                            }
                        }
                        Jeu.adverse.terrain[best].poison = 0;
                        Jeu.adverse.terrain[best].brulure = 0;
                        Jeu.adverse.terrain[best].saignement = 0;
                        Jeu.adverse.terrain[best].maladie = 0;
                        Jeu.adverse.terrain[best].gel = 0;
                        Jeu.adverse.terrain[best].etourdissement = false;
                        Jeu.adverse.terrain[best].silence = false;
                        deplacer(carte,"adverse","defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 56:
            carte.nom = "Oni";
            carte.type = "Créature";
            carte.familles.push("Oni");
            carte.cout[0] = 5;
            carte.cout[11] = 4;
            carte.vente[0] = 2;
            carte.vente[11] = 2;
            carte.attaque = 4;
            carte.vie_max = carte.vie = 5;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand attaque : Applique Maladie 1 à la Créature attaquée.";
            carte.effet_attaque = function (defenseur) {
                defenseur.maladie++;
            }
            break;
        case 57:
            carte.nom = "Mangeur de miasme";
            carte.type = "Créature";
            carte.familles.push("Oni");
            carte.cout[0] = 5;
            carte.cout[11] = 4;
            carte.vente[0] = 2;
            carte.vente[11] = 2;
            carte.attaque = 4;
            carte.vie_max = carte.vie = 5;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand attaque : Si la Créature attaquée possède Maladie, lui enlève et se soigne d'autant que le nombre de Maladie enlevé.";
            carte.effet_attaque = function (defenseur) {
                if (defenseur.maladie > 0) {
                    soin(carte,defenseur.maladie);
                    defenseur.maladie = 0;
                }
            }
            break;
        case 58:
            carte.nom = "Dague";
            carte.type = "Objet";
            carte.familles.push("Équipement","Arme");
            carte.cout[0] = 2;
            carte.vente[0] = 1;
            carte.attaque = 1;
            carte.texte = "Donne 1 attaque à la Créature équipée.<br/>ou<br/>Inflige 1 dégât à une Créature adverse sur le terrain.";
            carte.effet_pose = function (step,cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            initialiser();
                                div("main");
                                fonction("Annuler","menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut();
                                afficher("Choisissez un effet : ");
                                saut(2);
                                fonction("Donne 1 attaque à la Créature équipée","Jeu.joueur.main[" + carte.slot + "].effet_pose(2)");
                                saut();
                                afficher("ou");
                                saut();
                                fonction("Inflige 1 dégât à une Créature adverse sur le terrain","Jeu.joueur.main[" + carte.slot + "].effet_pose(4)");                   
                                div_fin();
                                div("carte");
                                div_fin();
                                actualiser();
                            break;
                        case 2:
                            if (verifier_equipement(carte.camp)) {
                                initialiser();
                                div("main");
                                fonction("Retour","Jeu.joueur.main[" + carte.slot + "].effet_pose(1)");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher("Donne 1 attaque à la Créature équipée.");
                                saut();
                                afficher("Choisissez une Créature : ");
                                saut(2);
                                for (let n=0;n<Jeu.joueur.terrain.length;n++) {
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].equipements.length < Jeu.joueur.terrain[n].equipement_max) {
                                        afficher_carte("joueur","terrain",n);
                                        afficher(" ");
                                        fonction("Cibler","Jeu.joueur.main[" + carte.slot + "].effet_pose(3," + n + ")");
                                        saut();
                                    }
                                }
                                div_fin();
                                div("carte");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 3:
                            Jeu.joueur.terrain[cible].equipements.push(carte);
                            if (!statistique(Jeu.joueur.terrain[cible],"silence")) {
                                Jeu.joueur.terrain[cible].effet_equiper(carte);
                            }
                            effet_pose(carte);
                            enlever(carte);
                            menu();
                            break;
                        case 4:
                            if (verifier_creature("adverse")) {
                                initialiser();
                                div("main");
                                fonction("Retour","Jeu.joueur.main[" + carte.slot + "].effet_pose(1)");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher("Inflige 1 dégât à une Créature adverse sur le terrain.");
                                saut();
                                afficher("Choisissez une Créature : ");
                                saut(2);
                                for (let n=0;n<Jeu.adverse.terrain.length;n++) {
                                    if (Jeu.adverse.terrain[n].type == "Créature") {
                                        afficher_carte("adverse","terrain",n);
                                        afficher(" ");
                                        fonction("Cibler","Jeu.joueur.main[" + carte.slot + "].effet_pose(5," + n + ")");
                                        saut();
                                    }
                                }
                                div_fin();
                                div("carte");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 5:
                            degats(Jeu.adverse.terrain[cible],1);
                            deplacer(carte,"joueur","defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_equipement(carte.camp)) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].equipements.length >= Jeu.adverse.terrain[best].equipement_max) {
                            best++;
                        }
                        Jeu.adverse.terrain[best].equipements.push(carte);
                        if (!statistique(Jeu.adverse.terrain[best],"silence")) {
                            Jeu.adverse.terrain[best].effet_equiper(carte);
                        }
                        effet_pose(carte);
                        enlever(carte);
                        return true;
                    }
                    else if (verifier_creature("joueur")) {
                        let best = 0;
                        while (Jeu.joueur.terrain[best].type != "Créature") {
                            best++;
                        }
                        for (let n=0;n<Jeu.joueur.terrain.length;n++) {
                            if (Jeu.joueur.terrain[n].vie == 1 && Jeu.joueur.terrain[n].type == "Créature") {
                                best = n;
                            }
                        }
                        degats(Jeu.joueur.terrain[n],1);
                        deplacer(carte,"adverse","defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 59:
            carte.nom = "Slime";
            carte.type = "Créature";
            carte.familles.push("Slime");
            carte.cout[0] = 2;
            carte.cout[2] = 2;
            carte.vente[0] = 1;
            carte.vente[2] = 1;
            carte.attaque = 1;
            carte.vie_max = carte.vie = 1;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.resistance = 1;
            break;
        case 60:
            carte.nom = "Fantôme";
            carte.type = "Créature";
            carte.familles.push("Fantôme");
            carte.cout[0] = 1;
            carte.cout[9] = 1;
            carte.vente[0] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.ephemere = true;
            break;
        case 61:
            carte.nom = "Mercenaire";
            carte.type = "Créature";
            carte.familles.push("Humain");
            carte.cout[0] = 3;
            carte.vente[0] = 1;
            carte.attaque = 3;
            carte.vie_max = carte.vie = 3;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.temporaire = true;
            break;
        case 62:
            carte.nom = "Gladiateur";
            carte.type = "Créature";
            carte.familles.push("Humain");
            carte.cout[0] = 4;
            carte.vente[0] = 2;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand est équipé d'un Objet Équipement Arme : Se donne 1 attaque.";
            carte.effet_equiper = function (equipement) {
                if (equipement.familles.includes("Arme")) {
                    carte.attaque++;
                }
            }
            break;
        case 63:
            carte.nom = "Oeuf de dragon";
            carte.type = "Bâtiment";
            carte.familles.push("Dragon","Oeuf");
            carte.cout[0] = 3;
            carte.cout[1] = 1;
            carte.cout[5] = 1;
            carte.vente[0] = 2;
            carte.vie_max = carte.vie = 1;
            carte.texte = "Quand arrive sur le terrain : Lance un décompte de 1.<br/>Quand le décompte de cette carte est écoulé : Se détruit et crée <a href='javascript:carte_voir_id(9)'>Dragon</a> sur le terrain.";
            carte.effet_ajouter = function () {
                if (carte.zone == "terrain") {
                    carte.decompte = 1;
                }
            }
            carte.effet_enlever = function () {
                if (carte.zone == "terrain") {
                    carte.decompte = 0;
                }
            }
            carte.effet_decompte = function () {
                let nouvelle_carte = obtenir_carte(9);
                nouvelle_carte.vente = [0,0,0,0,0,0,0,0,0,0,0,0,0];
                ajouter(nouvelle_carte,carte.camp,carte.zone);
                carte.vie = 0;
                deplacer(carte,carte.camp,"defausse");
            }
            break;
        case 64:
            carte.nom = "Assassin";
            carte.type = "Créature";
            carte.familles.push("Humain");
            carte.cout[0] = 5;
            carte.vente[0] = 2;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Inflige 2 dégâts au Meneur adverse.";
            carte.effet_pose = function () {
                deplacer(carte,carte.camp,"terrain");
                effet_pose(carte);
                if (!statistique(carte,"silence")) {
                    if (carte.camp == "joueur") {
                        degats_direct("adverse",2);
                        if (Jeu.adverse.vie > 0) {
                            menu();
                        }
                        else {
                            combat_victoire();
                        }
                    }
                    else {
                        degats_direct("joueur",2);
                        if (Jeu.joueur.vie <= 0) {
                            game_over();
                        }
                        return true;
                    }
                }
                else {
                    if (carte.camp == "joueur") {
                        menu();
                    }
                    else {
                        return true;
                    }
                }
            }
            break;
        case 65:
            carte.nom = "Ange";
            carte.type = "Créature";
            carte.familles.push("Ange");
            carte.cout[0] = 5;
            carte.cout[5] = 2;
            carte.cout[10] = 2;
            carte.vente[0] = 2;
            carte.vente[5] = 1;
            carte.vente[10] = 1;
            carte.attaque = 4;
            carte.vie_max = carte.vie = 4;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Soigne 2 au Meneur allié.";
            carte.effet_pose = function () {
                if (!statistique(carte,"silence")) {
                    soin_direct(carte.camp,2);
                }
                deplacer(carte,carte.camp,"terrain");
                effet_pose(carte);
                menu();
                return true;
            }
            break;
        case 66:
            carte.nom = "Évêque";
            carte.type = "Créature";
            carte.familles.push("Humain","Église");
            carte.cout[0] = 4;
            carte.cout[10] = 3;
            carte.vente[0] = 2;
            carte.vente[10] = 1;
            carte.attaque = 1;
            carte.vie_max = carte.vie = 4;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand une autre Créature alliée sur le terrain est soignée : Se soigne de 1.";
            carte.effet_soin_carte = function (carte_soin) {
                if (carte_soin.camp == carte.camp && carte_soin.zone == "terrain" && carte_soin.slot != carte.slot) {
                    soin(carte,1);
                }
            }
            break;
        case 67:
            carte.nom = "Griffon";
            carte.type = "Créature";
            carte.familles.push("Griffon");
            carte.cout[0] = 5;
            carte.cout[5] = 4;
            carte.vente[0] = 2;
            carte.vente[5] = 2;
            carte.attaque = 4;
            carte.vie_max = carte.vie = 4;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : diminue le cout d'amélioration de la boutique de 2 Or.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur" && !statistique(carte,"silence")) {
                    Jeu.boutique_amelioration -= 2;
                    if (Jeu.boutique_amelioration < 0) {
                        Jeu.boutique_amelioration = 0;
                    }
                }
                deplacer(carte,carte.camp,"terrain");
                effet_pose(carte);
                menu();
                return true;
            }
            break;
        case 68:
            carte.nom = "Tigre";
            carte.type = "Créature";
            carte.familles.push("Bête","Félin");
            carte.cout[0] = 3;
            carte.cout[3] = 3;
            carte.vente[0] = 2;
            carte.vente[3] = 1;
            carte.attaque = 3;
            carte.vie_max = carte.vie = 3;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.camouflage = true;
            break;
        case 69:
            carte.nom = "Troll";
            carte.type = "Créature";
            carte.familles.push("Troll");
            carte.cout[0] = 5;
            carte.cout[12] = 4;
            carte.vente[0] = 2;
            carte.vente[12] = 2;
            carte.attaque = 3;
            carte.vie_max = carte.vie = 4;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand attaque : Applique Gel 1 à la Créature ou au Bâtiment attaqué.";
            carte.effet_attaque = function (defenseur) {
                if (defenseur.gel < 1) {
                    defenseur.gel = 1;
                }
            }
            break;
        case 70:
            carte.nom = "Grappin";
            carte.type = "Objet";
            carte.cout[0] = 3;
            carte.vente[0] = 1;
            carte.texte = "Place en première position une Créature adverse sur le terrain.";
            carte.effet_pose = function (step,cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_creature("adverse")) {
                                initialiser();
                                div("main");
                                fonction("Annuler","menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut();
                                afficher("Choisissez une Créature adverse : ");
                                saut(2);
                                for (let n=0;n<Jeu.adverse.terrain.length;n++) {
                                    if (Jeu.adverse.terrain[n].type == "Créature") {
                                        afficher_carte("adverse","terrain",n);
                                        afficher(" ");
                                        fonction("Cibler","Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        saut();
                                    }
                                }
                                div_fin();
                                div("carte");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.adverse.terrain.unshift(Jeu.adverse.terrain[cible]);
                            Jeu.adverse.terrain.splice(cible+1,1);
                            Jeu.adverse.terrain[0].slot = 0;
                            for (let n=1;n<cible+1;n++) {
                                Jeu.adverse.terrain[n].slot++;
                            }
                            deplacer(carte,"joueur","defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_creature("joueur")) {
                        let best = 0;
                        while (Jeu.joueur.terrain[best].type != "Créature") {
                            best++;
                        }
                        for (let n=0;n<Jeu.joueur.terrain.length;n++) {
                            if (Jeu.joueur.terrain[n].vie < Jeu.joueur.terrain[best].vie && Jeu.joueur.terrain[n].type == "Créature") {
                                best = n;
                            }
                        }
                        Jeu.joueur.terrain.unshift(Jeu.joueur.terrain[best]);
                        Jeu.joueur.terrain.splice(best+1,1);
                        Jeu.joueur.terrain[0].slot = 0;
                        for (let n=1;n<best+1;n++) {
                            Jeu.joueur.terrain[n].slot++;
                        }
                        deplacer(carte,"adverse","defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 71:
            carte.nom = "Chercheur de sort";
            carte.type = "Créature";
            carte.familles.push("Humain","Mage");
            carte.cout[0] = 3;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand vendu : Crée une Action Sort aléatoire dans la boutique.";
            carte.effet_vente = function () {
                let verifier = false;
                for (let n=0;n<Jeu.NOMBRE_CARTE;n++) {
                    if (Jeu.joueur.regions[Jeu.region_active].boutique_generer(obtenir_carte(n)) && obtenir_carte(n).familles.includes("Sort")) {
                        verifier = true;
                    }
                }
                if (verifier) {
                    let nouvelle_carte = boutique_generer();
                    while (!nouvelle_carte.familles.includes("Sort")) {
                        nouvelle_carte = boutique_generer();
                    }
                    ajouter(nouvelle_carte,"joueur","boutique");
                }
            }
            break;
        case 72:
            carte.nom = "Assomer";
            carte.type = "Action";
            carte.cout[0] = 3;
            carte.vente[0] = 1;
            carte.texte = "Applique Etourdissement à une Créature adverse sur le terrain.";
            carte.effet_pose = function (step,cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_creature("adverse")) {
                                initialiser();
                                div("main");
                                fonction("Annuler","menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut();
                                afficher("Choisissez une Créature adverse : ");
                                saut(2);
                                for (let n=0;n<Jeu.adverse.terrain.length;n++) {
                                    if (Jeu.adverse.terrain[n].type == "Créature" && !Jeu.adverse.terrain[n].etourdissement) {
                                        afficher_carte("adverse","terrain",n);
                                        afficher(" ");
                                        fonction("Cibler","Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        saut();
                                    }
                                }
                                div_fin();
                                div("carte");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.adverse.terrain[cible].etourdissement = true;
                            deplacer(carte,"joueur","defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_creature("joueur")) {
                        let best = 0;
                        while (Jeu.joueur.terrain[best].type != "Créature") {
                            best++;
                        }
                        for (let n=0;n<Jeu.joueur.terrain.length;n++) {
                            if (!Jeu.joueur.terrain[n].etourdissement && Jeu.joueur.terrain[n].action_max > Jeu.joueur.terrain[best].action_maxc && Jeu.joueur.terrain[n].type == "Créature") {
                                best = n;
                            }
                        }
                        Jeu.joueur.terrain[best].etourdissement = true;
                        deplacer(carte,"adverse","defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 73:
            carte.nom = "Coup d'aile";
            carte.type = "Action";
            carte.cout[0] = 2;
            carte.cout[5] = 1;
            carte.vente[0] = 1;
            carte.texte = "Renvoie une Créature sur le terrain dans la main de son possesseur.";
            carte.effet_pose = function (step,cible_camp,cible_slot) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_creature("joueur") || verifier_creature("adverse")) {
                                initialiser();
                                div("main");
                                fonction("Annuler","menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut();
                                afficher("Choisissez une Créature : ");
                                saut(2);
                                for (let n=0;n<Jeu.joueur.terrain.length;n++) {
                                    if (Jeu.joueur.terrain[n].type == "Créature") {
                                        afficher_carte("joueur","terrain",n);
                                        afficher(" ");
                                        fonction("Cibler","Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + '"joueur",' + n + ")");
                                        saut();
                                    }
                                }
                                saut();
                                afficher("Choisissez une Créature adverse : ");
                                saut(2);
                                for (let n=0;n<Jeu.adverse.terrain.length;n++) {
                                    if (Jeu.adverse.terrain[n].type == "Créature") {
                                        afficher_carte("adverse","terrain",n);
                                        afficher(" ");
                                        fonction("Cibler","Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + '"adverse",' + n + ")");
                                        saut();
                                    }
                                }
                                div_fin();
                                div("carte");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            deplacer(Jeu[cible_camp].terrain[cible_slot],cible_camp,"main");
                            deplacer(carte,"joueur","defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_creature("joueur")) {
                        let best = 0;
                        while (Jeu.joueur.terrain[best].type != "Créature") {
                            best++;
                        }
                        for (let n=0;n < Jeu.joueur.terrain.length;n++) {
                            if (cout_total(Jeu.joueur.terrain[n]) > cout_total(Jeu.joueur.terrain[best]) && Jeu.joueur.terrain[n].type == "Créature") {
                                best = n;
                            }
                        }
                        deplacer(Jeu.joueur.terrain[best],"joueur","main");
                        deplacer(carte,"adverse","defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 74:
            carte.nom = "Baril explosif";
            carte.type = "Bâtiment";
            carte.familles.push("Explosif");
            carte.cout[0] = 1;
            carte.cout[1] = 1;
            carte.vie = carte.vie_max = 2;
            carte.texte = "Quand posé : Se place sur le terrain adverse.<br>Quand meurt : Inflige 2 dégâts à son possesseur.";
            carte.effet_pose = function () {
                if (!statistique(carte,"silence")) {
                    if (carte.camp == "joueur") {
                        deplacer(carte,"adverse","terrain");
                    }
                    else {
                        deplacer(carte,"joueur","terrain");
                    }
                }
                else {
                    deplacer(carte,carte.camp,"terrain");
                }
                effet_pose(carte);
                menu();
                return true;
            }
            carte.effet_mort = function () {
                if (!statistique(carte,"silence")) {
                    degats_direct(carte.camp,2);
                }
                if (statistique(carte,"ephemere")) {
                    enlever(carte);
                }
                else {
                    deplacer(carte,carte.camp,"defausse");
                }
            }
            break;
        case 75:
            carte.nom = "Chevalier monté";
            carte.type = "Créature";
            carte.familles.push("Humain");
            carte.cout[0] = 14;
            carte.vente[0] = 7;
            carte.attaque = 3;
            carte.vie = carte.vie_max = 3;
            carte.rapidite = true;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand meurt : Se transforme en <a href='javascript:carte_voir_id(76)'>Chevalier</a>.";
            carte.effet_mort = function () {
                if (!statistique(carte,"silence")) {
                    carte.nom = "Chevalier";
                    carte.cout[0] -= 5;
                    carte.vente[0] -= 3;
                    carte.defense += 1;
                    carte.vie = carte.vie_max;
                    carte.rapidite = false;
                    carte.texte = "Aucun";
                }
                else {
                    if (statistique(carte,"ephemere") && !statistique(carte,"silence")) {
                        enlever(carte);
                    }
                    else {
                        deplacer(carte,carte.camp,"defausse");
                    }
                }
            }
            break;
        case 76:
            carte.nom = "Chevalier";
            carte.type = "Créature";
            carte.familles.push("Humain");
            carte.cout[0] = 9;
            carte.vente[0] = 4;
            carte.attaque = 3;
            carte.defense = 1;
            carte.vie = carte.vie_max = 3;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 77:
            carte.nom = "Homme d'affaire";
            carte.type = "Créature";
            carte.familles.push("Humain");
            carte.cout[0] = 9;
            carte.vente[0] = 4;
            carte.attaque = 2;
            carte.vie = carte.vie_max = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand vous vendez une carte : Donne 1 Or.";
            carte.effet_vente_carte = function () {
                if (carte.camp == "joueur") {
                    Jeu.joueur.ressources[0].courant++;
                }
            }
            break;
        case 78:
            carte.nom = "Plaine";
            carte.type = "Région";
            carte.exclusif = true;
            carte.texte = "Toutes les cartes peuvent être créées dans la boutique.";
            carte.boutique_generer = function (nouvelle_carte) {
                if ((cout_total(nouvelle_carte) <= Jeu.boutique_niveau*3 || Jeu.boutique_niveau == 10) && !nouvelle_carte.exclusif) {
                    return true;
                }
                return false;
            }
            break;
        case 79:
            carte.nom = "Volcan";
            carte.type = "Région";
            carte.cout[0] = 5;
            carte.cout[1] = 4;
            carte.vente[0] = 2;
            carte.vente[1] = 2;
            carte.texte = "Les cartes créées dans la boutique ont un coût minimum de 1 Feu.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    deplacer(carte,"joueur","zones");
                    menu();
                }
                else {
                    return false;
                }
            }
            carte.boutique_generer = function (nouvelle_carte) {
                if ((cout_total(nouvelle_carte) <= Jeu.boutique_niveau*3 || Jeu.boutique_niveau == 10) && !nouvelle_carte.exclusif && nouvelle_carte.cout[1] > 0) {
                    return true;
                }
                return false;
            }
            break;
        case 80:
            carte.nom = "Taillade";
            carte.type = "Action";
            carte.cout[0] = 2;
            carte.vente[0] = 1;
            carte.texte = "Applique Saignement 2 à une Créature adverse sur le terrain.";
            carte.effet_pose = function (step,cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_creature("adverse")) {
                                initialiser();
                                div("main");
                                fonction("Annuler","menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut();
                                afficher("Choisissez une Créature adverse : ");
                                saut(2);
                                for (let n=0;n<Jeu.adverse.terrain.length;n++) {
                                    if (Jeu.adverse.terrain[n].type == "Créature") {
                                        afficher_carte("adverse","terrain",n);
                                        afficher(" ");
                                        fonction("Cibler","Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        saut();
                                    }
                                }
                                div_fin();
                                div("carte");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.adverse.terrain[cible].saignement += 2;
                            deplacer(carte,"joueur","defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_creature("joueur")) {
                        let best = 0;
                        while (Jeu.joueur.terrain[best].type != "Créature") {
                            best++;
                        }
                        for (let n=0;n<Jeu.joueur.terrain.length;n++) {
                            if (Jeu.joueur.terrain[n].action_max > Jeu.joueur.terrain[best].action_max && Jeu.joueur.terrain[n].type == "Créature") {
                                best = n;
                            }
                        }
                        Jeu.joueur.terrain[best].saignement += 2;
                        deplacer(carte,"adverse","defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 81:
            carte.nom = "Boost";
            carte.type = "Action";
            carte.cout[0] = 2;
            carte.vente[0] = 1;
            carte.texte = "Donne 2 attaque et 2 vie à une Créature alliée sur le terrain jusqu'à la fin de la phase de combat.";
            carte.effet_pose = function (step,cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_creature("joueur")) {
                                initialiser();
                                div("main");
                                fonction("Annuler","menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut();
                                afficher("Choisissez une Créature : ");
                                saut(2);
                                for (let n=0;n<Jeu.joueur.terrain.length;n++) {
                                    if (Jeu.joueur.terrain[n].type == "Créature") {
                                        afficher_carte("joueur","terrain",n);
                                        afficher(" ");
                                        fonction("Cibler","Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        saut();
                                    }
                                }
                                div_fin();
                                div("carte");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.joueur.terrain[cible].stat_etage.attaque += 2;
                            Jeu.joueur.terrain[cible].vie += 2;
                            Jeu.joueur.terrain[cible].stat_etage.vie_max += 2;
                            deplacer(carte,"joueur","defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_creature("adverse")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature") {
                            best++;
                        }
                        Jeu.adverse.terrain[best].stat_etage.attaque += 2;
                        Jeu.adverse.terrain[best].vie += 2;
                        Jeu.adverse.terrain[best].stat_etage.vie_max += 2;
                        deplacer(carte,"adverse","defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 82:
            carte.nom = "Mutisme";
            carte.type = "Action";
            carte.cout[0] = 5;
            carte.vente[0] = 2;
            carte.texte = "Applique Silence à une Créature sur le terrain.";
            carte.effet_pose = function (step,camp,cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_creature("joueur") || verifier_creature("adverse")) {
                                initialiser();
                                div("main");
                                fonction("Annuler","menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut();
                                afficher("Choisissez une Créature : ");
                                saut(2);
                                for (let n=0;n<Jeu.joueur.terrain.length;n++) {
                                    if (Jeu.joueur.terrain[n].type == "Créature") {
                                        afficher_carte("joueur","terrain",n);
                                        afficher(" ");
                                        fonction("Cibler","Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + '"joueur",' + n + ")");
                                        saut();
                                    }
                                }
                                saut();
                                afficher("Choisissez une Créature adverse : ");
                                saut(2);
                                for (let n=0;n<Jeu.adverse.terrain.length;n++) {
                                    if (Jeu.adverse.terrain[n].type == "Créature") {
                                        afficher_carte("adverse","terrain",n);
                                        afficher(" ");
                                        fonction("Cibler","Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + '"adverse",' + n + ")");
                                        saut();
                                    }
                                }
                                div_fin();
                                div("carte");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu[camp].terrain[cible].silence = true;
                            deplacer(carte,"joueur","defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_creature("adverse")) {
                        let best = 0;
                        while (Jeu.joueur.terrain[best].type != "Créature") {
                            best++;
                        }
                        Jeu.joueur.terrain[best].silence = true;
                        deplacer(carte,"adverse","defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 83:
            carte.nom = "Soldat courageux";
            carte.type = "Créature";
            carte.familles.push("Humain");
            carte.cout[0] = 6;
            carte.vente[0] = 3;
            carte.attaque = 2;
            carte.vie = carte.vie_max = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Au début d'un tour de combat : se donne 1 attaque pour chaque créature adverse sur le terrain jusqu'à la fin du tour de combat.";
            carte.effet_tour_debut = function () {
                if (carte.camp == "joueur") {
                    for (let n=0;n<Jeu.adverse.terrain.length;n++) {
                        if (Jeu.adverse.terrain[n].type == "Créature") {
                            carte.stat_tour.attaque++;
                        }
                    }
                }
                else {
                    for (let n=0;n<Jeu.joueur.terrain.length;n++) {
                        if (Jeu.joueur.terrain[n].type == "Créature") {
                            carte.stat_tour.attaque++;
                        }
                    }
                }
            }
            break;
        case 84:
            carte.nom = "Gobelin";
            carte.familles.push("Gobelin");
            carte.cout[0] = 2;
            carte.cout[1] = 1;
            carte.vente[0] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 85:
            carte.nom = "Ondin";
            carte.familles.push("Ondin");
            carte.cout[0] = 2;
            carte.cout[2] = 1;
            carte.vente[0] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 86:
            carte.nom = "Elfe";
            carte.familles.push("Elfe");
            carte.cout[0] = 2;
            carte.cout[3] = 1;
            carte.vente[0] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 87:
            carte.nom = "Nain";
            carte.familles.push("Nain");
            carte.cout[0] = 2;
            carte.cout[4] = 1;
            carte.vente[0] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 88:
            carte.nom = "Eolien";
            carte.familles.push("Eolien");
            carte.cout[0] = 2;
            carte.cout[5] = 1;
            carte.vente[0] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 89:
            carte.nom = "Satyre";
            carte.familles.push("Satyre");
            carte.cout[0] = 2;
            carte.cout[6] = 1;
            carte.vente[0] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 90:
            carte.nom = "Gnome";
            carte.familles.push("Gnome");
            carte.cout[0] = 2;
            carte.cout[7] = 1;
            carte.vente[0] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 91:
            carte.nom = "Arcaniste";
            carte.familles.push("Arcaniste");
            carte.cout[0] = 2;
            carte.cout[8] = 1;
            carte.vente[0] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 92:
            carte.nom = "Revenant";
            carte.familles.push("Mort-vivant","Revenant");
            carte.cout[0] = 2;
            carte.cout[9] = 1;
            carte.vente[0] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 93:
            carte.nom = "Fidèle";
            carte.familles.push("Humain","Église");
            carte.cout[0] = 2;
            carte.cout[10] = 1;
            carte.vente[0] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 94:
            carte.nom = "Elfe noir";
            carte.familles.push("Elfe noir");
            carte.cout[0] = 2;
            carte.cout[11] = 1;
            carte.vente[0] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 95:
            carte.nom = "Nordique";
            carte.familles.push("Nordique");
            carte.cout[0] = 2;
            carte.cout[12] = 1;
            carte.vente[0] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 96:
            carte.nom = "Île";
            carte.type = "Région";
            carte.cout[0] = 5;
            carte.cout[2] = 4;
            carte.vente[0] = 2;
            carte.vente[2] = 2;
            carte.texte = "Les cartes créées dans la boutique ont un coût minimum de 1 Eau.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    deplacer(carte,"joueur","zones");
                    menu();
                }
                else {
                    return false;
                }
            }
            carte.boutique_generer = function (nouvelle_carte) {
                if ((cout_total(nouvelle_carte) <= Jeu.boutique_niveau*3 || Jeu.boutique_niveau == 10) && !nouvelle_carte.exclusif && nouvelle_carte.cout[2] > 0) {
                    return true;
                }
                return false;
            }
            break;
        case 97:
            carte.nom = "Forêt";
            carte.type = "Région";
            carte.cout[0] = 5;
            carte.cout[3] = 4;
            carte.vente[0] = 2;
            carte.vente[3] = 2;
            carte.texte = "Les cartes créées dans la boutique ont un coût minimum de 1 Végétal.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    deplacer(carte,"joueur","zones");
                    menu();
                }
                else {
                    return false;
                }
            }
            carte.boutique_generer = function (nouvelle_carte) {
                if ((cout_total(nouvelle_carte) <= Jeu.boutique_niveau*3 || Jeu.boutique_niveau == 10) && !nouvelle_carte.exclusif && nouvelle_carte.cout[3] > 0) {
                    return true;
                }
                return false;
            }
            break;
        case 98:
            carte.nom = "Montagne";
            carte.type = "Région";
            carte.cout[0] = 5;
            carte.cout[4] = 4;
            carte.vente[0] = 2;
            carte.vente[4] = 2;
            carte.texte = "Les cartes créées dans la boutique ont un coût minimum de 1 Terre.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    deplacer(carte,"joueur","zones");
                    menu();
                }
                else {
                    return false;
                }
            }
            carte.boutique_generer = function (nouvelle_carte) {
                if ((cout_total(nouvelle_carte) <= Jeu.boutique_niveau*3 || Jeu.boutique_niveau == 10) && !nouvelle_carte.exclusif && nouvelle_carte.cout[4] > 0) {
                    return true;
                }
                return false;
            }
            break;
        case 99:
            carte.nom = "Île volante";
            carte.type = "Région";
            carte.cout[0] = 5;
            carte.cout[5] = 4;
            carte.vente[0] = 2;
            carte.vente[5] = 2;
            carte.texte = "Les cartes créées dans la boutique ont un coût minimum de 1 Air.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    deplacer(carte,"joueur","zones");
                    menu();
                }
                else {
                    return false;
                }
            }
            carte.boutique_generer = function (nouvelle_carte) {
                if ((cout_total(nouvelle_carte) <= Jeu.boutique_niveau*3 || Jeu.boutique_niveau == 10) && !nouvelle_carte.exclusif && nouvelle_carte.cout[5] > 0) {
                    return true;
                }
                return false;
            }
            break;
        case 100:
            carte.nom = "Haut plateau";
            carte.type = "Région";
            carte.cout[0] = 5;
            carte.cout[6] = 4;
            carte.vente[0] = 2;
            carte.vente[6] = 2;
            carte.texte = "Les cartes créées dans la boutique ont un coût minimum de 1 Foudre.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    deplacer(carte,"joueur","zones");
                    menu();
                }
                else {
                    return false;
                }
            }
            carte.boutique_generer = function (nouvelle_carte) {
                if ((cout_total(nouvelle_carte) <= Jeu.boutique_niveau*3 || Jeu.boutique_niveau == 10) && !nouvelle_carte.exclusif && nouvelle_carte.cout[6] > 0) {
                    return true;
                }
                return false;
            }
            break;
        case 101:
            carte.nom = "Mine";
            carte.type = "Région";
            carte.cout[0] = 5;
            carte.cout[7] = 4;
            carte.vente[0] = 2;
            carte.vente[7] = 2;
            carte.texte = "Les cartes créées dans la boutique ont un coût minimum de 1 Metal.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    deplacer(carte,"joueur","zones");
                    menu();
                }
                else {
                    return false;
                }
            }
            carte.boutique_generer = function (nouvelle_carte) {
                if ((cout_total(nouvelle_carte) <= Jeu.boutique_niveau*3 || Jeu.boutique_niveau == 10) && !nouvelle_carte.exclusif && nouvelle_carte.cout[7] > 0) {
                    return true;
                }
                return false;
            }
            break;
        case 102:
            carte.nom = "Terre illusoire";
            carte.type = "Région";
            carte.cout[0] = 5;
            carte.cout[8] = 4;
            carte.vente[0] = 2;
            carte.vente[8] = 2;
            carte.texte = "Les cartes créées dans la boutique ont un coût minimum de 1 Arcane.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    deplacer(carte,"joueur","zones");
                    menu();
                }
                else {
                    return false;
                }
            }
            carte.boutique_generer = function (nouvelle_carte) {
                if ((cout_total(nouvelle_carte) <= Jeu.boutique_niveau*3 || Jeu.boutique_niveau == 10) && !nouvelle_carte.exclusif && nouvelle_carte.cout[8] > 0) {
                    return true;
                }
                return false;
            }
            break;
        case 103:
            carte.nom = "Cimetière";
            carte.type = "Région";
            carte.cout[0] = 5;
            carte.cout[9] = 4;
            carte.vente[0] = 2;
            carte.vente[9] = 2;
            carte.texte = "Les cartes créées dans la boutique ont un coût minimum de 1 Mort.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    deplacer(carte,"joueur","zones");
                    menu();
                }
                else {
                    return false;
                }
            }
            carte.boutique_generer = function (nouvelle_carte) {
                if ((cout_total(nouvelle_carte) <= Jeu.boutique_niveau*3 || Jeu.boutique_niveau == 10) && !nouvelle_carte.exclusif && nouvelle_carte.cout[9] > 0) {
                    return true;
                }
                return false;
            }
            break;
        case 104:
            carte.nom = "Terre sacrée";
            carte.type = "Région";
            carte.cout[0] = 5;
            carte.cout[10] = 4;
            carte.vente[0] = 2;
            carte.vente[10] = 2;
            carte.texte = "Les cartes créées dans la boutique ont un coût minimum de 1 Lumière.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    deplacer(carte,"joueur","zones");
                    menu();
                }
                else {
                    return false;
                }
            }
            carte.boutique_generer = function (nouvelle_carte) {
                if ((cout_total(nouvelle_carte) <= Jeu.boutique_niveau*3 || Jeu.boutique_niveau == 10) && !nouvelle_carte.exclusif && nouvelle_carte.cout[10] > 0) {
                    return true;
                }
                return false;
            }
            break;
        case 105:
            carte.nom = "Caverne";
            carte.type = "Région";
            carte.cout[0] = 5;
            carte.cout[11] = 4;
            carte.vente[0] = 2;
            carte.vente[11] = 2;
            carte.texte = "Les cartes créées dans la boutique ont un coût minimum de 1 Ombre.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    deplacer(carte,"joueur","zones");
                    menu();
                }
                else {
                    return false;
                }
            }
            carte.boutique_generer = function (nouvelle_carte) {
                if ((cout_total(nouvelle_carte) <= Jeu.boutique_niveau*3 || Jeu.boutique_niveau == 10) && !nouvelle_carte.exclusif && nouvelle_carte.cout[11] > 0) {
                    return true;
                }
                return false;
            }
            break;
        case 106:
            carte.nom = "Toundra";
            carte.type = "Région";
            carte.cout[0] = 5;
            carte.cout[12] = 4;
            carte.vente[0] = 2;
            carte.vente[12] = 2;
            carte.texte = "Les cartes créées dans la boutique ont un coût minimum de 1 Glace.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    deplacer(carte,"joueur","zones");
                    menu();
                }
                else {
                    return false;
                }
            }
            carte.boutique_generer = function (nouvelle_carte) {
                if ((cout_total(nouvelle_carte) <= Jeu.boutique_niveau*3 || Jeu.boutique_niveau == 10) && !nouvelle_carte.exclusif && nouvelle_carte.cout[12] > 0) {
                    return true;
                }
                return false;
            }
            break;
        case 107:
            carte.nom = "Bouclier";
            carte.type = "Objet";
            carte.familles.push("Équipement","Armure");
            carte.cout[0] = 2;
            carte.vente[0] = 1;
            carte.defense = 1;
            carte.texte = "Donne 1 défense à la Créature équipée.";
            carte.effet_pose = function (step,cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_equipement(carte.camp)) {
                                initialiser();
                                div("main");
                                fonction("Annuler","menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut();
                                afficher("Choisissez une Créature : ");
                                saut(2);
                                for (let n=0;n<Jeu.joueur.terrain.length;n++) {
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].equipements.length < Jeu.joueur.terrain[n].equipement_max) {
                                        afficher_carte("joueur","terrain",n);
                                        afficher(" ");
                                        fonction("Cibler","Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        saut();
                                    }
                                }
                                div_fin();
                                div("carte");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.joueur.terrain[cible].equipements.push(carte);
                            if (!statistique(Jeu.joueur.terrain[cible],"silence")) {
                                Jeu.joueur.terrain[cible].effet_equiper(carte);
                            }
                            effet_pose(carte);
                            enlever(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_equipement(carte.camp)) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].equipements.length >= Jeu.adverse.terrain[best].equipement_max) {
                            best++;
                        }
                        Jeu.adverse.terrain[best].equipements.push(carte);
                        if (!statistique(Jeu.adverse.terrain[best],"silence")) {
                            Jeu.adverse.terrain[best].effet_equiper(carte);
                        }
                        effet_pose(carte);
                        enlever(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 108:
            carte.nom = "Arc";
            carte.type = "Objet";
            carte.familles.push("Équipement","Arme");
            carte.cout[0] = 2;
            carte.vente[0] = 1;
            carte.attaque = 1;
            carte.portee = true;
            carte.texte = "Donne 1 attaque et applique Portée à la Créature équipée.";
            carte.effet_pose = function (step,cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_equipement(carte.camp)) {
                                initialiser();
                                div("main");
                                fonction("Annuler","menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut();
                                afficher("Choisissez une Créature : ");
                                saut(2);
                                for (let n=0;n<Jeu.joueur.terrain.length;n++) {
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].equipements.length < Jeu.joueur.terrain[n].equipement_max) {
                                        afficher_carte("joueur","terrain",n);
                                        afficher(" ");
                                        fonction("Cibler","Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        saut();
                                    }
                                }
                                div_fin();
                                div("carte");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.joueur.terrain[cible].equipements.push(carte);
                            if (!statistique(Jeu.joueur.terrain[cible],"silence")) {
                                Jeu.joueur.terrain[cible].effet_equiper(carte);
                            }
                            effet_pose(carte);
                            enlever(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_equipement(carte.camp)) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].equipements.length >= Jeu.adverse.terrain[best].equipement_max) {
                            best++;
                        }
                        Jeu.adverse.terrain[best].equipements.push(carte);
                        if (!statistique(Jeu.adverse.terrain[best],"silence")) {
                            Jeu.adverse.terrain[best].effet_equiper(carte);
                        }
                        effet_pose(carte);
                        enlever(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 109:
            carte.nom = "Baguette";
            carte.type = "Objet";
            carte.familles.push("Équipement","Arme");
            carte.cout[0] = 2;
            carte.vente[0] = 1;
            carte.attaque = 1;
            carte.sorcellerie = 1;
            carte.texte = "Donne 1 attaque et applique Sorcellerie 1 à la Créature équipée.";
            carte.effet_pose = function (step,cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_equipement(carte.camp)) {
                                initialiser();
                                div("main");
                                fonction("Annuler","menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut();
                                afficher("Choisissez une Créature : ");
                                saut(2);
                                for (let n=0;n<Jeu.joueur.terrain.length;n++) {
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].equipements.length < Jeu.joueur.terrain[n].equipement_max) {
                                        afficher_carte("joueur","terrain",n);
                                        afficher(" ");
                                        fonction("Cibler","Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        saut();
                                    }
                                }
                                div_fin();
                                div("carte");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.joueur.terrain[cible].equipements.push(carte);
                            if (!statistique(Jeu.joueur.terrain[cible],"silence")) {
                                Jeu.joueur.terrain[cible].effet_equiper(carte);
                            }
                            effet_pose(carte);
                            enlever(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_equipement(carte.camp)) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].equipements.length >= Jeu.adverse.terrain[best].equipement_max) {
                            best++;
                        }
                        Jeu.adverse.terrain[best].equipements.push(carte);
                        if (!statistique(Jeu.adverse.terrain[best],"silence")) {
                            Jeu.adverse.terrain[best].effet_equiper(carte);
                        }
                        effet_pose(carte);
                        enlever(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 110:
            carte.nom = "Lance";
            carte.type = "Objet";
            carte.familles.push("Équipement","Arme");
            carte.cout[0] = 2;
            carte.vente[0] = 1;
            carte.attaque = 1;
            carte.percee = 1;
            carte.texte = "Donne 1 attaque et applique Percée 1 à la Créature équipée.";
            carte.effet_pose = function (step,cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_equipement(carte.camp)) {
                                initialiser();
                                div("main");
                                fonction("Annuler","menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut();
                                afficher("Choisissez une Créature : ");
                                saut(2);
                                for (let n=0;n<Jeu.joueur.terrain.length;n++) {
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].equipements.length < Jeu.joueur.terrain[n].equipement_max) {
                                        afficher_carte("joueur","terrain",n);
                                        afficher(" ");
                                        fonction("Cibler","Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        saut();
                                    }
                                }
                                div_fin();
                                div("carte");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.joueur.terrain[cible].equipements.push(carte);
                            if (!statistique(Jeu.joueur.terrain[cible],"silence")) {
                                Jeu.joueur.terrain[cible].effet_equiper(carte);
                            }
                            effet_pose(carte);
                            enlever(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_equipement(carte.camp)) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].equipements.length >= Jeu.adverse.terrain[best].equipement_max) {
                            best++;
                        }
                        Jeu.adverse.terrain[best].equipements.push(carte);
                        if (!statistique(Jeu.adverse.terrain[best],"silence")) {
                            Jeu.adverse.terrain[best].effet_equiper(carte);
                        }
                        effet_pose(carte);
                        enlever(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 111:
            carte.nom = "Double lame";
            carte.type = "Objet";
            carte.familles.push("Équipement","Arme");
            carte.cout[0] = 5;
            carte.vente[0] = 2;
            carte.action_max = 1;
            carte.texte = "Donne 1 action supplémentaire à la Créature équipée.";
            carte.effet_pose = function (step,cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_equipement(carte.camp)) {
                                initialiser();
                                div("main");
                                fonction("Annuler","menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut();
                                afficher("Choisissez une Créature : ");
                                saut(2);
                                for (let n=0;n<Jeu.joueur.terrain.length;n++) {
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].equipements.length < Jeu.joueur.terrain[n].equipement_max) {
                                        afficher_carte("joueur","terrain",n);
                                        afficher(" ");
                                        fonction("Cibler","Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        saut();
                                    }
                                }
                                div_fin();
                                div("carte");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.joueur.terrain[cible].equipements.push(carte);
                            if (!statistique(Jeu.joueur.terrain[cible],"silence")) {
                                Jeu.joueur.terrain[cible].effet_equiper(carte);
                            }
                            effet_pose(carte);
                            enlever(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_equipement(carte.camp)) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].equipements.length >= Jeu.adverse.terrain[best].equipement_max) {
                            best++;
                        }
                        Jeu.adverse.terrain[best].equipements.push(carte);
                        if (!statistique(Jeu.adverse.terrain[best],"silence")) {
                            Jeu.adverse.terrain[best].effet_equiper(carte);
                        }
                        effet_pose(carte);
                        enlever(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 112:
            carte.nom = "Loup";
            carte.familles.push("Bête");
            carte.cout[0] = 3;
            carte.vente[0] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 113:
            carte.nom = "Ville";
            carte.type = "Région";
            carte.cout[0] = 9;
            carte.vente[0] = 4;
            carte.texte = "Les cartes créées dans la boutique coûtent uniquement de l'Or.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    deplacer(carte,"joueur","regions");
                    menu();
                }
                else {
                    return false;
                }
            }
            carte.boutique_generer = function (nouvelle_carte) {
                if ((cout_total(nouvelle_carte) <= Jeu.boutique_niveau*3 || Jeu.boutique_niveau == 10) && !nouvelle_carte.exclusif && nouvelle_carte.cout[0] == cout_total(nouvelle_carte)) {
                    return true;
                }
                return false;
            }
            break;
        case 114:
            carte.nom = "Golem";
            carte.familles.push("Golem");
            carte.cout[0] = 5;
            carte.cout[4] = 4;
            carte.vente[0] = 2;
            carte.vente[4] = 2;
            carte.attaque = 1;
            carte.defense = 2;
            carte.vie_max = carte.vie = 5;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 115:
            carte.nom = "Minotaure";
            carte.familles.push("Minotaure");
            carte.cout[0] = 3;
            carte.cout[4] = 2;
            carte.vente[0] = 1;
            carte.vente[4] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand attaque un Bâtiment : Inflige 2 dégats au Bâtiment attaqué.";
            carte.effet_attaque = function (defenseur) {
                if (defenseur.type == "Bâtiment") {
                    degats(defenseur,2);
                }
            }
            break;
        case 116:
            carte.nom = "Centaure";
            carte.familles.push("Centaure");
            carte.cout[0] = 3;
            carte.cout[6] = 2;
            carte.vente[0] = 1;
            carte.vente[6] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.rapidite = true;
            break;
        case 117:
            carte.nom = "Archimage";
            carte.type = "Créature";
            carte.familles.push("Humain","Mage");
            carte.cout[0] = 9;
            carte.vente[0] = 4;
            carte.attaque = 4;
            carte.vie_max = carte.vie = 4;
            carte.action_max = 1;
            carte.sorcellerie = 2;
            carte.equipement_max = 1;
            break;
        case 118:
            carte.nom = "Grand automate";
            carte.type = "Créature";
            carte.familles.push("Machine","Automate");
            carte.cout[0] = 5;
            carte.cout[7] = 4;
            carte.vente[0] = 2;
            carte.vente[7] = 2;
            carte.attaque = 5;
            carte.vie_max = carte.vie = 5;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 119:
            carte.nom = "Faucon";
            carte.type = "Créature";
            carte.familles.push("Oiseau");
            carte.cout[0] = 2;
            carte.cout[5] = 1;
            carte.vente[0] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 120:
            carte.nom = "Hydre";
            carte.familles.push("Hydre");
            carte.cout[0] = 5;
            carte.cout[2] = 4;
            carte.vente[0] = 2;
            carte.vente[2] = 2;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 3;
            carte.action_max = 2;
            carte.equipement_max = 1;
            break;
        case 121:
            carte.nom = "Tir de flèche";
            carte.type = "Action";
            carte.cout[0] = 1;
            carte.texte = "Inflige 1 dégât à une Créature ou un Bâtiment adverse sur le terrain.";
            carte.effet_pose = function (step,cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (Jeu.adverse.terrain.length > 0) {
                                initialiser();
                                div("main");
                                fonction("Annuler","menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut();
                                afficher("Choisissez une Créature ou un Bâtiment adverse : ");
                                saut(2);
                                for (let n=0;n<Jeu.adverse.terrain.length;n++) {
                                    afficher_carte("adverse","terrain",n);
                                    afficher(" ");
                                    fonction("Cibler","Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                    saut();
                                }
                                div_fin();
                                div("carte");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            degats(Jeu.adverse.terrain[cible],1);
                            deplacer(carte,"joueur","defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (Jeu.joueur.terrain.length > 0) {
                        let best = 0;
                        for (let n=0;n<Jeu.joueur.terrain.length;n++) {
                            if (Jeu.joueur.terrain[n].vie == 1) {
                                best = n;
                            }
                        }
                        degats(Jeu.joueur.terrain[best],1);
                        deplacer(carte,"adverse","defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 122:
            carte.nom = "Carpe";
            carte.familles.push("Poisson");
            carte.cout[0] = 2;
            carte.cout[2] = 1;
            carte.vente[0] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 123:
            carte.nom = "Requin";
            carte.familles.push("Poisson");
            carte.cout[0] = 3;
            carte.cout[2] = 2;
            carte.vente[0] = 1;
            carte.vente[2] = 1;
            carte.attaque = 3;
            carte.vie_max = carte.vie = 3;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 124:
            carte.nom = "Sardine";
            carte.familles.push("Poisson");
            carte.cout[2] = 1;
            carte.attaque = 1;
            carte.vie_max = carte.vie = 1;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 125:
            carte.nom = "Tortue";
            carte.familles.push("Reptile");
            carte.cout[0] = 2;
            carte.cout[2] = 1;
            carte.vente[0] = 1;
            carte.attaque = 1;
            carte.defense = 1;
            carte.vie_max = carte.vie = 1;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 126:
            carte.nom = "Crabe";
            carte.cout[0] = 2;
            carte.cout[2] = 1;
            carte.vente[0] = 1;
            carte.attaque = 1;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.regeneration = 1;
            break;
        case 127:
            carte.nom = "Zombie";
            carte.familles.push("Mort-vivant","Zombie");
            carte.cout[0] = 2;
            carte.cout[9] = 2;
            carte.vente[0] = 1;
            carte.vente[9] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 3;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 128:
            carte.nom = "Cyclope";
            carte.familles.push("Cyclope");
            carte.cout[0] = 5;
            carte.cout[6] = 4;
            carte.vente[0] = 2;
            carte.vente[6] = 2;
            carte.attaque = 4;
            carte.vie_max = carte.vie = 4;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Crée un Eclair cyclopéen dans la boutique.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    if (!statistique(carte,"silence")) {
                        ajouter(obtenir_carte(129),"joueur","boutique");
                    }
                    deplacer(carte,"joueur","terrain");
                    effet_pose(carte);
                    menu();
                }
                else {
                    deplacer(carte,"adverse","terrain");
                    effet_pose(carte);
                    return true;
                }
            }
            break;
        case 129:
            carte.nom = "Eclair cyclopéen";
            carte.type = "Objet";
            carte.familles.push("Équipement","Arme");
            carte.cout[0] = 3;
            carte.cout[6] = 2;
            carte.vente[0] = 1;
            carte.vente[6] = 1;
            carte.attaque = 4;
            carte.sorcellerie = 1;
            carte.exclusif = true;
            carte.texte = "Donne 4 attaque et applique Sorcellerie 1 à la Créature équipée.";
            carte.effet_pose = function (step,cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_equipement(carte.camp)) {
                                initialiser();
                                div("main");
                                fonction("Annuler","menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut();
                                afficher("Choisissez une Créature : ");
                                saut(2);
                                for (let n=0;n<Jeu.joueur.terrain.length;n++) {
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].equipements.length < Jeu.joueur.terrain[n].equipement_max) {
                                        afficher_carte("joueur","terrain",n);
                                        afficher(" ");
                                        fonction("Cibler","Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        saut();
                                    }
                                }
                                div_fin();
                                div("carte");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.joueur.terrain[cible].equipements.push(carte);
                            if (!statistique(Jeu.joueur.terrain[cible],"silence")) {
                                Jeu.joueur.terrain[cible].effet_equiper(carte);
                            }
                            effet_pose(carte);
                            enlever(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_equipement(carte.camp)) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].equipements.length >= Jeu.adverse.terrain[best].equipement_max) {
                            best++;
                        }
                        Jeu.adverse.terrain[best].equipements.push(carte);
                        if (!statistique(Jeu.adverse.terrain[best],"silence")) {
                            Jeu.adverse.terrain[best].effet_equiper(carte);
                        }
                        effet_pose(carte);
                        enlever(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
    }
    return carte;
}