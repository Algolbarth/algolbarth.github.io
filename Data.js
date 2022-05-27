function obtenir_carte (carte_id) {
    let carte = {
        id : carte_id,
        verrouillage : false,
        etage_mort : 0,
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
        texte : "Aucun",
        effet_pose : function () {
            deplacer(carte,"terrain");
            effet_pose(carte);
            menu();
        },
        effet_allie_pose : function () {},
        effet_attaque : function () {},
        effet_mort : function () {
            if (carte.zone == "terrain_adverse") {
                deplacer(carte,"defausse_adverse");
            }
            else {
                deplacer(carte,"defausse");
            }
        },
        effet_carte_mort : function () {},
        effet_debut_tour : function () {},
        effet_degat : function () {},
        effet_tuer : function () {},
        effet_soin : function () {},
        equipements : [],
        equipement_max : 0,
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
            carte.nom = "Armure";
            carte.type = "Objet";
            carte.familles.push("Equipement");
            carte.cout[0] = 2;
            carte.vente[0] = 1;
            carte.vie_max = 2;
            carte.texte = "Donne 2 vie maximale à la Créature équipée.";
            carte.effet_pose = function (step,cible) {
                switch (step) {
                    case 1:
                        if (verifier_equipement()) {
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
                            for (let n=0;n<Jeu.terrain.length;n++) {
                                if (Jeu.terrain[n].type == "Créature" && Jeu.terrain[n].equipements.length < Jeu.terrain[n].equipement_max) {
                                    afficher_carte("terrain",n);
                                    afficher(" ");
                                    fonction("Cibler","Jeu.main[" + carte.slot + "].effet_pose(2," + n + ")");
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
                        Jeu.terrain[cible].equipements.push(carte);
                        enlever(carte);
                        effet_pose(carte);
                        menu();
                        break;
                }
            }
            break;
        case 3:
            carte.nom = "Potion de soin";
            carte.type = "Objet";
            carte.familles.push("Potion");
            carte.cout[0] = 3;
            carte.vente[0] = 1;
            carte.texte = "Soigne 3 à une Créature sur votre terrain.";
            carte.effet_pose = function (step,cible) {
                switch (step) {
                    case 1:
                        if (verifier_soin()) {
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
                            for (let n=0;n<Jeu.terrain.length;n++) {
                                if (Jeu.terrain[n].type == "Créature" && Jeu.terrain[n].vie < Jeu.terrain[n].vie_max) {
                                    afficher_carte("terrain",n);
                                    afficher(" ");
                                    fonction("Cibler","Jeu.main[" + carte.slot + "].effet_pose(2," + n + ")");
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
                        let carte_cible = Jeu.terrain[cible];
                        soin(carte_cible,3);
                        deplacer(carte,"defausse");
                        effet_pose(carte);
                        menu();
                        break;
                }
            }
            break;
        case 4:
            carte.nom = "Epée";
            carte.type = "Objet";
            carte.familles.push("Equipement","Arme");
            carte.cout[0] = 2;
            carte.vente[0] = 1;
            carte.attaque = 2;
            carte.texte = "Donne 2 attaque à la Créature équipée.";
            carte.effet_pose = function (step,cible) {
                switch (step) {
                    case 1:
                        if (verifier_equipement()) {
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
                            for (let n=0;n<Jeu.terrain.length;n++) {
                                if (Jeu.terrain[n].type == "Créature" && Jeu.terrain[n].equipements.length < Jeu.terrain[n].equipement_max) {
                                    afficher_carte("terrain",n);
                                    afficher(" ");
                                    fonction("Cibler","Jeu.main[" + carte.slot + "].effet_pose(2," + n + ")");
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
                        Jeu.terrain[cible].equipements.push(carte);
                        enlever(carte);
                        effet_pose(carte);
                        menu();
                        break;
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
            carte.texte = "Quand arrive sur le terrain : Crée un Objet Equipement aléatoire dans votre boutique.";
            carte.effet_pose = function () {
                let nouvelle_carte = boutique_generer();
                while (!nouvelle_carte.familles.includes("Equipement")) {
                    nouvelle_carte = boutique_generer();
                }
                ajouter(nouvelle_carte,"boutique");
                deplacer(carte,"terrain");
                effet_pose(carte);
                menu();
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
            carte.texte = "Quand arrive sur le terrain : Donne 1 attaque et 1 vie à toutes les Créatures sur votre terrain.";
            carte.effet_pose = function () {
                for (let n=0;n<Jeu.terrain.length;n++) {
                    if (Jeu.terrain[n].type == "Créature") {
                        Jeu.terrain[n].attaque++;
                        Jeu.terrain[n].vie_max++;
                        Jeu.terrain[n].vie++;
                    }
                }
                deplacer(carte,"terrain");
                effet_pose(carte);
                menu();
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
            carte.texte = "Quand arrive sur le terrain : Soigne 3 à une Créature sur votre terrain.";
            carte.effet_pose = function (step,cible) {
                switch (step) {
                    case 1:
                        if (verifier_soin()) {
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
                            for (let n=0;n<Jeu.terrain.length;n++) {
                                if (Jeu.terrain[n].type == "Créature" && Jeu.terrain[n].vie < Jeu.terrain[n].vie_max) {
                                    afficher_carte("terrain",n);
                                    afficher(" ");
                                    fonction("Cibler","Jeu.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                    saut();
                                }
                            }
                            div_fin();
                            div("carte");
                            div_fin();
                            actualiser();
                        }
                        else {
                            deplacer(carte,"terrain");
                            menu();
                        }
                        break;
                    case 2:
                        let carte_cible = Jeu.terrain[cible];
                        soin(carte_cible,3);
                        deplacer(carte,"terrain");
                        effet_pose(carte);
                        menu();
                        break;
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
            carte.texte = "Quand arrive sur le terrain : Donne 1 Or max.";
            carte.effet_pose = function () {
                Jeu.ressources[0].max++;
                deplacer(carte,"terrain");
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
            carte.familles.push("Mort-vivant","Revenant");
            carte.cout[0] = 3;
            carte.cout[9] = 2;
            carte.vente[0] = 1;
            carte.vente[9] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand attaque : Crée un Squelette sur votre terrain.";
            carte.effet_attaque = function () {
                let nouvelle_carte = obtenir_carte(13);
                nouvelle_carte.vente = [0,0,0,0,0,0,0,0,0,0,0,0,0];
                ajouter(nouvelle_carte,carte.zone);
            }
            break;
        case 15:
            carte.nom = "Roi des élements";
            carte.familles.push("Hydre");
            carte.cout = [0,5,5,5,5,5,5,5,5,5,5,5,5];
            carte.vente = [0,2,2,2,2,2,2,2,2,2,2,2,2];
            carte.attaque = 10;
            carte.vie_max = carte.vie = 10;
            carte.action_max = 3;
            carte.equipement_max = 1;
            break;
        case 16:
            carte.nom = "Bombe";
            carte.type = "Objet";
            carte.familles.push("Explosif");
            carte.cout[0] = 3;
            carte.vente[0] = 1;
            carte.texte = "Inflige 3 dégâts à une Créature ou un Bâtiment adverse.";
            carte.effet_pose = function (step,cible) {
                switch (step) {
                    case 1:
                        if (Jeu.terrain_adverse.length > 0) {
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
                            for (let n=0;n<Jeu.terrain_adverse.length;n++) {
                                afficher_carte("terrain_adverse",n);
                                afficher(" ");
                                fonction("Cibler","Jeu.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                saut();
                            }
                            div_fin();
                            div("carte");
                            div_fin();
                            actualiser();
                        }
                        break;
                    case 2:
                        let carte_cible = Jeu.terrain_adverse[cible];
                        degats(carte_cible,3);
                        deplacer(carte,"defausse");
                        effet_pose(carte);
                        menu();
                        break;
                }
            }
            break;
        case 17:
            carte.nom = "Pluie de flèche";
            carte.type = "Action";
            carte.cout[0] = 3;
            carte.vente[0] = 1;
            carte.texte = "Inflige 1 dégât à toutes les Créatures et Bâtiments adverses.";
            carte.effet_pose = function () {
                if (Jeu.terrain_adverse.length > 0) {
                    for (let n=Jeu.terrain_adverse.length-1;n>=0;n--) {
                        let carte_cible = Jeu.terrain_adverse[n];
                        degats(carte_cible,1);
                    }
                    deplacer(carte,"defausse");
                    effet_pose(carte);
                    menu();
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
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
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
            carte.texte = "Quand meurt : Crée un Automate sur votre terrain.";
            carte.effet_mort = function () {
                let nouvelle_carte = obtenir_carte(23);
                nouvelle_carte.vente = [0,0,0,0,0,0,0,0,0,0,0,0,0];
                ajouter(nouvelle_carte,carte.zone);
                if (carte.zone == "terrain_adverse") {
                    deplacer(carte,"defausse_adverse");
                }
                else {
                    deplacer(carte,"defausse");
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
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.mobile = true;
            carte.texte = "Quand attaque : Crée un Pirate sur votre terrain.";
            carte.effet_attaque = function () {
                let nouvelle_carte = obtenir_carte(26);
                nouvelle_carte.vente = [0,0,0,0,0,0,0,0,0,0,0,0,0];
                ajouter(nouvelle_carte,carte.zone);
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
            carte.texte = "Inflige 3 dégâts à une Créature ou un Bâtiment adverse. Sorcellerie (2) : Inflige 5 dégâts à une Créature ou un Bâtiment adverse.";
            carte.effet_pose = function (step,cible) {
                switch (step) {
                    case 1:
                        if (Jeu.terrain_adverse.length > 0) {
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
                            for (let n=0;n<Jeu.terrain_adverse.length;n++) {
                                afficher_carte("terrain_adverse",n);
                                afficher(" ");
                                fonction("Cibler","Jeu.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                saut();
                            }
                            div_fin();
                            div("carte");
                            div_fin();
                            actualiser();
                        }
                        break;
                    case 2:
                        let carte_cible = Jeu.terrain_adverse[cible];
                        if (sorcellerie() >= 2) {
                            degats(carte_cible,5);
                        }
                        else {
                            degats(carte_cible,3);
                        }
                        deplacer(carte,"defausse");
                        effet_pose(carte);
                        menu();
                        break;
                }
            }
            break;
        case 29:
            carte.nom = "Coffre";
            carte.type = "Objet";
            carte.cout[0] = 2;
            carte.vente[0] = 1;
            carte.texte = "Crée une carte aléatoire dans votre boutique.";
            carte.effet_pose = function () {
                Jeu.boutique.push(boutique_generer());
                deplacer(carte,"defausse");
                effet_pose(carte);
                menu();
            }
            break;
        case 30:
            carte.nom = "Bottes";
            carte.type = "Objet";
            carte.familles.push("Equipement");
            carte.cout[0] = 2;
            carte.vente[0] = 1;
            carte.rapidite = true;
            carte.texte = "Applique Rapidité à la Créature équipée.";
            carte.effet_pose = function (step,cible) {
                switch (step) {
                    case 1:
                        if (verifier_equipement()) {
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
                            for (let n=0;n<Jeu.terrain.length;n++) {
                                if (Jeu.terrain[n].type == "Créature" && Jeu.terrain[n].equipements.length < Jeu.terrain[n].equipement_max) {
                                    afficher_carte("terrain",n);
                                    afficher(" ");
                                    fonction("Cibler","Jeu.main[" + carte.slot + "].effet_pose(2," + n + ")");
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
                        Jeu.terrain[cible].equipements.push(carte);
                        enlever(carte);
                        effet_pose(carte);
                        menu();
                        break;
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
                boutique_actualiser();
                deplacer(carte,"defausse");
                effet_pose(carte);
                menu();
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
            carte.texte = "Au début du tour : Crée un Robot sur votre terrain.";
            carte.effet_debut_tour = function () {
                let nouvelle_carte = obtenir_carte(33);
                nouvelle_carte.vente = [0,0,0,0,0,0,0,0,0,0,0,0,0];
                ajouter(nouvelle_carte,carte.zone);
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
            carte.texte = "Quand arrive sur le terrain : Diminue le cout d'une carte de la boutique de 2 Or.";
            carte.effet_pose = function (step,cible) {
                switch (step) {
                    case 1:
                        let verifier_boutique_or = false;
                        for (let n=0;n<Jeu.boutique.length;n++) {
                            if (Jeu.boutique[n].ressources[0] > 0) {
                                verifier_boutique_or = true;
                            }
                        }
                        if (verifier_boutique_or) {
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
                            for (let n=0;n<Jeu.boutique.length;n++) {
                                afficher_carte("boutique",n);
                                afficher(" ");
                                fonction("Cibler","Jeu.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                saut();
                            }
                            div_fin();
                            div("carte");
                            div_fin();
                            actualiser();
                        }
                        break;
                    case 2:
                        Jeu.boutique[cible].cout[0] -= 2;
                        if (Jeu.boutique[cible].cout[0] < 0) {
                            Jeu.boutique[cible].cout[0] = 0;
                        }
                        deplacer(carte,"terrain");
                        effet_pose(carte);
                        menu();
                        break;
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
            carte.texte = "Quand arrive sur le terrain : Inflige 2 dégâts au joueur.";
            carte.effet_pose = function () {
                Jeu.vie -= 2;
                deplacer(carte,"terrain");
                effet_pose(carte);
                if (Jeu.vie > 0) {
                    menu();
                }
                else {
                    game_over();
                }
            }
            break;
        case 38:
            carte.nom = "Archer";
            carte.type = "Créature";
            carte.familles.push("Humain");
            carte.cout[0] = 5;
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
            carte.cout[0] = 3;
            carte.vente[0] = 1;
            carte.texte = "Renvoie une carte située dans votre défausse dans votre main.";
            carte.effet_pose = function (step,cible) {
                switch (step) {
                    case 1:
                        if (Jeu.defausse.length > 0) {
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
                            for (let n=0;n<Jeu.defausse.length;n++) {
                                    afficher_carte("defausse",n);
                                    afficher(" ");
                                    fonction("Cibler","Jeu.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                    saut();
                            }
                            div_fin();
                            div("carte");
                            div_fin();
                            actualiser();
                        }
                        break;
                    case 2:
                        Jeu.defausse[cible].vie = Jeu.defausse[cible].vie_max;
                        deplacer(Jeu.defausse[cible],"main");
                        deplacer(carte,"defausse");
                        effet_pose(carte);
                        menu();
                        break;
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
            carte.texte = "Quand meurt : Se soigne complétement et revient dans votre main.";
            carte.effet_mort = function () {
                if (carte.zone == "terrain") {
                    carte.vie = carte.vie_max;
                    deplacer(carte,"main");
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
            carte.vie_max = carte.vie = 5;
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
            carte.texte = "Quand tue une Créature : Se soigne d'autant que la vie maximale de la Créature tuée.";
            carte.effet_tuer = function (defenseur) {
                soin(carte,defenseur.vie_max);
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
            carte.texte = "Quand une Créature arrive sur le terrain : Se donne 1 attaque et 1 vie.";
            carte.effet_allie_pose = function (allie) {
                if (allie.type == "Créature") {
                    carte.attaque++;
                    carte.vie++;
                    carte.vie_max++;
                }
            }
            break;
        case 46:
            carte.nom = "Liche mangeuse d'âme";
            carte.type = "Créature";
            carte.familles.push("Liche");
            carte.cout[0] = 7;
            carte.cout[8] = 4;
            carte.cout[9] = 4;
            carte.vente[0] = 3;
            carte.vente[8] = 2;
            carte.vente[9] = 2;
            carte.attaque = 5;
            carte.vie_max = carte.vie = 5;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand une Créature meurt : Se donne 1 vie.";
            carte.effet_carte_mort = function (carte_mort) {
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
                defenseur.poison++;
            }
            break;
        case 49:
            carte.nom = "Dague empoisonnée";
            carte.type = "Objet";
            carte.familles.push("Equipement","Arme");
            carte.cout[0] = 2;
            carte.vente[0] = 1;
            carte.texte = "Quand attaque : applique Poison 1 à la Créature attaquée.";
            carte.effet_pose = function (step,cible) {
                switch (step) {
                    case 1:
                        if (verifier_equipement()) {
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
                            for (let n=0;n<Jeu.terrain.length;n++) {
                                if (Jeu.terrain[n].type == "Créature" && Jeu.terrain[n].equipements.length < Jeu.terrain[n].equipement_max) {
                                    afficher_carte("terrain",n);
                                    afficher(" ");
                                    fonction("Cibler","Jeu.main[" + carte.slot + "].effet_pose(2," + n + ")");
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
                        Jeu.terrain[cible].equipements.push(carte);
                        enlever(carte);
                        effet_pose(carte);
                        menu();
                        break;
                }
            }
            carte.effet_attaque = function (defenseur) {
                defenseur.poison++;
            }
            break;
        case 50:
            carte.nom = "Antidote";
            carte.type = "Objet";
            carte.familles.push("Potion");
            carte.cout[0] = 3;
            carte.vente[0] = 1;
            carte.texte = "Enlève Poison à une Créature sur votre terrain.";
            carte.effet_pose = function (step,cible) {
                switch (step) {
                    case 1:
                        let verifier_poison = false;
                        for (let n=0;n<Jeu.terrain.length;n++) {
                            if (Jeu.terrain[n].poison > 0) {
                                verifier_poison = true;
                            }
                        }
                        if (verifier_poison) {
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
                            for (let n=0;n<Jeu.terrain.length;n++) {
                                if (Jeu.terrain[n].type == "Créature" && Jeu.terrain[n].poison > 0) {
                                    afficher_carte("terrain",n);
                                    afficher(" ");
                                    fonction("Cibler","Jeu.main[" + carte.slot + "].effet_pose(2," + n + ")");
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
                        let carte_cible = Jeu.terrain[cible];
                        carte_cible.poison = 0;
                        deplacer(carte,"defausse");
                        effet_pose(carte);
                        menu();
                        break;
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
            carte.texte = "Quand attaque : applique Brûlure 1 à la Créature attaquée.";
            carte.effet_attaque = function (defenseur) {
                if (defenseur.brulure < 1) {
                    defenseur.brulure = 1;
                }
            }
            break;
        case 52:
            carte.nom = "Fidèle";
            carte.type = "Créature";
            carte.familles.push("Humain","Eglise");
            carte.cout[0] = 3;
            carte.cout[10] = 2;
            carte.vente[0] = 1;
            carte.vente[10] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 3;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand est soigné : crée une carte aléatoire dans votre boutique.";
            carte.effet_soin = function () {
                ajouter(boutique_generer(),"boutique");
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
    }
    return carte;
}