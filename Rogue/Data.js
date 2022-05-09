function obtenir_carte (carte_id) {
    let carte = {
        id : carte_id,
        verrouillage : false,
        nom : "",
        type : "Créature",
        familles : [],
        cout : [0,0,0,0,0,0,0,0,0,0,0,0,0],
        vente : [0,0,0,0,0,0,0,0,0,0,0,0,0],
        attaque : 0,
        defense : 0,
        vie : 0,
        vie_max : 0,
        action : 0,
        action_max : 0,
        percee : 0,
        protection : false,
        rapide : false,
        vol_de_vie : false,
        mobile : false,
        sorcellerie : 0,
        portee : false,
        texte : "Aucun",
        effet_pose : function (main_slot) {
            Jeu.terrain.push(Jeu.main[main_slot]);
            Jeu.main.splice(main_slot,1);
            menu();
        },
        effet_attaque : function () {},
        effet_mort : function () {},
        effet_debut_tour : function () {},
        effet_degat : function () {},
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
            carte.effet_pose = function (main_slot,step,cible) {
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
                        afficher("Choisissez une créature : ");
                        saut(2);
                        for (let n=0;n<Jeu.terrain.length;n++) {
                            if (Jeu.terrain[n].type == "Créature" && Jeu.terrain[n].equipements.length < Jeu.terrain[n].equipement_max) {
                                afficher_carte("terrain",n);
                                afficher(" ");
                                fonction("Cibler","Jeu.main[" + main_slot + "].effet_pose(" + main_slot + ",2," + n + ")");
                                saut();
                            }
                        }
                        div_fin();
                        div("carte");
                        div_fin();
                        actualiser();
                        break;
                    case 2:
                        Jeu.terrain[cible].equipements.push(Jeu.main[main_slot]);
                        Jeu.main.splice(main_slot,1);
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
            carte.texte = "Soigne 3 à une Créature sur le terrain.";
            carte.effet_pose = function (main_slot,step,cible) {
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
                        afficher("Choisissez une créature : ");
                        saut(2);
                        for (let n=0;n<Jeu.terrain.length;n++) {
                            if (Jeu.terrain[n].type == "Créature") {
                                afficher_carte("terrain",n);
                                afficher(" ");
                                fonction("Cibler","Jeu.main[" + main_slot + "].effet_pose(" + main_slot + ",2," + n + ")");
                                saut();
                            }
                        }
                        div_fin();
                        div("carte");
                        div_fin();
                        actualiser();
                        break;
                    case 2:
                        soin("terrain",cible,3);
                        Jeu.main.splice(main_slot,1);
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
            carte.effet_pose = function (main_slot,step,cible) {
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
                        afficher("Choisissez une créature : ");
                        saut(2);
                        for (let n=0;n<Jeu.terrain.length;n++) {
                            if (Jeu.terrain[n].type == "Créature" && Jeu.terrain[n].equipements.length < Jeu.terrain[n].equipement_max) {
                                afficher_carte("terrain",n);
                                afficher(" ");
                                fonction("Cibler","Jeu.main[" + main_slot + "].effet_pose(" + main_slot + ",2," + n + ")");
                                saut();
                            }
                        }
                        div_fin();
                        div("carte");
                        div_fin();
                        actualiser();
                        break;
                    case 2:
                        Jeu.terrain[cible].equipements.push(Jeu.main[main_slot]);
                        Jeu.main.splice(main_slot,1);
                        menu();
                        break;
                }
            }
            break;
        case 5:
            carte.nom = "Araignée";
            carte.familles.push("Insecte");
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
            carte.effet_pose = function (main_slot) {
                let carte = obtenir_carte(0);
                while (!carte.familles.includes("Equipement") || cout_total(carte) > Jeu.boutique_niveau*3) {
                    carte = obtenir_carte(parseInt(Math.random()*Jeu.NOMBRE_CARTE + 1));
                }
                Jeu.boutique.push(carte);
                Jeu.terrain.push(Jeu.main[main_slot]);
                Jeu.main.splice(main_slot,1);
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
            carte.texte = "Quand arrive sur le terrain : Donne 1 attaque et 1 vie à toutes les Créature Humain sur le terrain.";
            carte.effet_pose = function (main_slot) {
                for (let n=0;n<Jeu.terrain.length;n++) {
                    if (Jeu.terrain[n].familles.includes("Humain")) {
                        Jeu.terrain[n].attaque++;
                        Jeu.terrain[n].vie_max++;
                        Jeu.terrain[n].vie++;
                    }
                }
                Jeu.terrain.push(Jeu.main[main_slot]);
                Jeu.main.splice(main_slot,1);
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
            carte.texte = "Quand arrive sur le terrain : Soigne 3 à une Créature sur le terrain.";
            carte.effet_pose = function (main_slot,step,cible) {
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
                        afficher("Choisissez une créature : ");
                        saut(2);
                        for (let n=0;n<Jeu.terrain.length;n++) {
                            if (Jeu.terrain[n].type == "Créature") {
                                afficher_carte("terrain",n);
                                afficher(" ");
                                fonction("Cibler","Jeu.main[" + main_slot + "].effet_pose(" + main_slot + ",2," + n + ")");
                                saut();
                            }
                        }
                        div_fin();
                        div("carte");
                        div_fin();
                        actualiser();
                        break;
                    case 2:
                        soin("terrain",cible,3);
                        Jeu.terrain.push(Jeu.main[main_slot]);
                        Jeu.main.splice(main_slot,1);
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
            carte.effet_pose = function (main_slot) {
                Jeu.ressources[0].max++;
                Jeu.terrain.push(Jeu.main[main_slot]);
                Jeu.main.splice(main_slot,1);
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
            carte.texte = "Quand attaque : Crée un Squelette sur le terrain.";
            carte.effet_attaque = function (zone) {
                Jeu[zone].push(obtenir_carte(13));
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
            carte.effet_pose = function (main_slot,step,cible) {
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
                        afficher("Choisissez une créature adverse : ");
                        saut(2);
                        for (let n=0;n<Jeu.adversaire.length;n++) {
                            afficher_carte("adversaire",n);
                            afficher(" ");
                            fonction("Cibler","Jeu.main[" + main_slot + "].effet_pose(" + main_slot + ",2," + n + ")");
                            saut();
                        }
                        div_fin();
                        div("carte");
                        div_fin();
                        actualiser();
                        break;
                    case 2:
                        degats("adversaire",cible,3);
                        Jeu.main.splice(main_slot,1);
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
            carte.effet_pose = function (main_slot) {
                for (let n=Jeu.adversaire.length-1;n>=0;n--) {
                    degats("adversaire",n,1);
                }
                Jeu.main.splice(main_slot,1);
                menu();
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
            carte.rapide = true;
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
            carte.texte = "Quand meurt : Crée un Automate sur le terrain.";
            carte.effet_mort = function (zone) {
                Jeu[zone].push(obtenir_carte(23));
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
            carte.texte = "Quand attaque : Crée un Pirate sur le terrain.";
            carte.effet_attaque = function (zone) {
                Jeu[zone].push(obtenir_carte(26));
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
            carte.texte = "Inflige 3 dégâts à une Créature adverse. Sorcellerie (2) : Inflige 5 dégâts à une Créature adverse.";
            carte.effet_pose = function (main_slot,step,cible) {
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
                        afficher("Choisissez une créature adverse : ");
                        saut(2);
                        for (let n=0;n<Jeu.adversaire.length;n++) {
                            afficher_carte("adversaire",n);
                            afficher(" ");
                            fonction("Cibler","Jeu.main[" + main_slot + "].effet_pose(" + main_slot + ",2," + n + ")");
                            saut();
                        }
                        div_fin();
                        div("carte");
                        div_fin();
                        actualiser();
                        break;
                    case 2:
                        if (sorcellerie() >= 2) {
                            degats("adversaire",cible,5);
                        }
                        else {
                            degats("adversaire",cible,3);
                        }
                        Jeu.main.splice(main_slot,1);
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
            carte.effet_pose = function (main_slot) {
                let carte = obtenir_carte(parseInt(Math.random()*Jeu.NOMBRE_CARTE + 1));
                while (cout_total(carte) > Jeu.boutique_niveau*3) {
                    carte = obtenir_carte(parseInt(Math.random()*Jeu.NOMBRE_CARTE + 1));
                }
                Jeu.boutique.push(carte);
                Jeu.main.splice(main_slot,1);
                menu();
            }
            break;
        case 30:
            carte.nom = "Bottes";
            carte.type = "Objet";
            carte.familles.push("Equipement");
            carte.cout[0] = 2;
            carte.vente[0] = 1;
            carte.rapide = true;
            carte.texte = "Applique Rapide à la Créature équipée.";
            carte.effet_pose = function (main_slot,step,cible) {
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
                        afficher("Choisissez une créature : ");
                        saut(2);
                        for (let n=0;n<Jeu.terrain.length;n++) {
                            if (Jeu.terrain[n].type == "Créature" && Jeu.terrain[n].equipements.length < Jeu.terrain[n].equipement_max) {
                                afficher_carte("terrain",n);
                                afficher(" ");
                                fonction("Cibler","Jeu.main[" + main_slot + "].effet_pose(" + main_slot + ",2," + n + ")");
                                saut();
                            }
                        }
                        div_fin();
                        div("carte");
                        div_fin();
                        actualiser();
                        break;
                    case 2:
                        Jeu.terrain[cible].equipements.push(Jeu.main[main_slot]);
                        Jeu.main.splice(main_slot,1);
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
            carte.effet_pose = function (main_slot) {
                boutique_actualiser();
                Jeu.main.splice(main_slot,1);
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
            carte.texte = "Au début du tour : Crée un Robot sur le terrain.";
            carte.effet_debut_tour = function (zone) {
                Jeu[zone].push(obtenir_carte(33));
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
            carte.texte = "Quand subis des dégâts : Se donne 1 attaque.";
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
            carte.effet_pose = function (main_slot,step,cible) {
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
                        afficher("Choisissez une carte : ");
                        saut(2);
                        for (let n=0;n<Jeu.boutique.length;n++) {
                            afficher_carte("boutique",n);
                            afficher(" ");
                            fonction("Cibler","Jeu.main[" + main_slot + "].effet_pose(" + main_slot + ",2," + n + ")");
                            saut();
                        }
                        div_fin();
                        div("carte");
                        div_fin();
                        actualiser();
                        break;
                    case 2:
                        Jeu.boutique[cible].cout[0] -= 2;
                        if (Jeu.boutique[cible].cout[0]) {
                            Jeu.boutique[cible].cout[0] = 0;
                        }
                        Jeu.terrain.push(Jeu.main[main_slot]);
                        Jeu.main.splice(main_slot,1);
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
            carte.effet_pose = function (main_slot) {
                Jeu.vie -= 2;
                Jeu.terrain.push(Jeu.main[main_slot]);
                Jeu.main.splice(main_slot,1);
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
            carte.texte = "Renvoie une Créature située votre défausse dans votre main.";
            carte.effet_pose = function (main_slot,step,cible) {
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
                        afficher("Choisissez une créature : ");
                        saut(2);
                        for (let n=0;n<Jeu.defausse.length;n++) {
                            if (Jeu.defausse[n].type == "Créature") {
                                afficher_carte("defausse",n);
                                afficher(" ");
                                fonction("Cibler","Jeu.main[" + main_slot + "].effet_pose(" + main_slot + ",2," + n + ")");
                                saut();
                            }
                        }
                        div_fin();
                        div("carte");
                        div_fin();
                        actualiser();
                        break;
                    case 2:
                        Jeu.defausse[cible].vie = Jeu.defausse[cible].vie_max;
                        Jeu.main.push(Jeu.defausse[cible]);
                        Jeu.defausse.splice(cible,1);
                        Jeu.main.splice(main_slot,1);
                        menu();
                        break;
                }
            }
            break;
    }
    return carte;
}