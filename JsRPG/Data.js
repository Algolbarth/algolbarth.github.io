function obtenir_carte(carte_id) {
    let carte = {
        id: carte_id,
        verrouillage: false,
        etage_mort: 0,
        exclusif: false,
        cache: false,
        camp: "",
        zone: "",
        slot: 0,
        nom: "",
        type: "Créature",
        familles: [],
        cout: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        vente: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        attaque: 0,
        defense: 0,
        vie: 0,
        vie_max: 0,
        vie_sup: 0,
        action: 0,
        action_max: 0,
        percee: 0,
        protection: false,
        rapidite: false,
        vol_de_vie: 0,
        mobile: false,
        sorcellerie: 0,
        portee: false,
        eternite: false,
        letalite: false,
        epine: 0,
        regeneration: 0,
        poison: 0,
        brulure: 0,
        contamination: 0,
        resistance: 0,
        ephemere: false,
        temporaire: false,
        decompte: 0,
        camouflage: false,
        gel: 0,
        etourdissement: false,
        saignement: 0,
        silence: false,
        esquive: false,
        erosion: 0,
        charge: false,
        texte: "Aucun",
        description: "...",
        effet_pose: function () {
            deplacer(carte, carte.camp, "terrain");
            effet_pose(carte);
            menu();
            return true;
        },
        effet_pose_carte: function () { },
        effet_ajouter: function () { },
        effet_enlever: function () { },
        effet_action: function () { },
        effet_attaque: function () { },
        effet_be_attaque: function () { },
        effet_mort: function () {
            if (statistique(carte, "ephemere") && !statistique(carte, "silence")) {
                enlever(carte);
            }
            else {
                deplacer(carte, carte.camp, "defausse");
            }
        },
        effet_mort_carte: function () { },
        effet_tour_debut: function () { },
        effet_degat: function () { },
        effet_tuer: function () { },
        effet_soin: function () { },
        effet_soin_carte: function () { },
        effet_equiper: function () { },
        effet_decompte: function () { },
        effet_vente: function () { },
        effet_vente_carte: function () { },
        effet_etage_debut: function () { },
        boutique_generer: function () { },
        equipements: [],
        equipement_max: 0
    }
    if (carte_id > 0) {
        carte.stat_etage = obtenir_carte(0);
        carte.stat_tour = obtenir_carte(0);
        carte.stat_equipement = obtenir_carte(0);
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
            carte.description = "Les humains ne sont affiliés à aucun des 12 éléments mais se sont servis de cette neutralité pour explorer le monde et s'implanter sur tous les continents.";
            break;
        case 2:
            carte.nom = "Plastron de cuir";
            carte.type = "Objet";
            carte.familles.push("Équipement", "Armure");
            carte.cout[0] = 4;
            carte.vente[0] = 2;
            carte.stat_equipement.vie_max = 4;
            carte.texte = "Donne 4 vie max à la Créature équipée.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_equipement("joueur")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée équipable sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].equipements.length < Jeu.joueur.terrain[n].equipement_max) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            equiper(Jeu.joueur.terrain[cible], carte);
                            effet_pose(carte);
                            enlever(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_equipement("adverse")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].equipements.length >= Jeu.adverse.terrain[best].equipement_max) {
                            best++;
                        }
                        equiper(Jeu.adverse.terrain[best], carte);
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
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_soin_creature("joueur")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée blessée sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].vie < Jeu.joueur.terrain[n].vie_max) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            soin(Jeu.joueur.terrain[cible], 3);
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_soin_creature("adverse")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].vie >= Jeu.adverse.terrain[best].vie_max) {
                            best++;
                        }
                        for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                            if ((Jeu.adverse.terrain[n].vie_max - Jeu.adverse.terrain[n].vie) > (Jeu.adverse.terrain[best].vie_max - Jeu.adverse.terrain[best].vie) && Jeu.adverse.terrain[n].type == "Créature") {
                                best = n;
                            }
                        }
                        soin(Jeu.adverse.terrain[best], 3);
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            carte.description = "Une petite fiole contenant un liquide rouge, à consomner pour se soigner d'éventuelles blessures.";
            break;
        case 4:
            carte.nom = "Épée de cuivre";
            carte.type = "Objet";
            carte.familles.push("Équipement", "Arme");
            carte.cout[0] = 4;
            carte.vente[0] = 2;
            carte.stat_equipement.attaque = 4;
            carte.texte = "Donne 4 attaque à la Créature équipée.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_equipement("joueur")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée équipable sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].equipements.length < Jeu.joueur.terrain[n].equipement_max) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            equiper(Jeu.joueur.terrain[cible], carte);
                            effet_pose(carte);
                            enlever(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_equipement("adverse")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].equipements.length >= Jeu.adverse.terrain[best].equipement_max) {
                            best++;
                        }
                        equiper(Jeu.adverse.terrain[best], carte);
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
            carte.familles.push("Insecte", "Araignée");
            carte.cout[9] = 1;
            carte.attaque = 1;
            carte.vie_max = carte.vie = 1;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 6:
            carte.nom = "Géant";
            carte.familles.push("Géant");
            carte.cout[0] = 19;
            carte.vente[0] = 9;
            carte.attaque = 10;
            carte.vie_max = carte.vie = 10;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.description = "Bien que semblables aux humains dans leur neutralité élémentaire, les géants rencontrent des difficultés à voyager à cause de leurs tailles imposantes.";
            break;
        case 7:
            carte.nom = "Forgeron";
            carte.familles.push("Humain");
            carte.cout[0] = 6;
            carte.vente[0] = 3;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Pioche un Objet Équipement.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    if (!statistique(carte, "silence")) {
                        let verifier = false;
                        for (let n = 0; n < Jeu.NOMBRE_CARTE; n++) {
                            if (Jeu.joueur.regions[Jeu.region_active].boutique_generer(obtenir_carte(n)) && obtenir_carte(n).familles.includes("Équipement")) {
                                verifier = true;
                            }
                        }
                        if (verifier) {
                            let nouvelle_carte = boutique_generer();
                            while (!nouvelle_carte.familles.includes("Équipement")) {
                                nouvelle_carte = boutique_generer();
                            }
                            pioche("joueur", nouvelle_carte);
                        }
                    }
                    deplacer(carte, "joueur", "terrain");
                    effet_pose(carte);
                    menu();
                }
                else {
                    deplacer(carte, "adverse", "terrain");
                    effet_pose(carte);
                    return true;
                }
            }
            break;
        case 8:
            carte.nom = "Roi";
            carte.familles.push("Humain");
            carte.cout[0] = 45;
            carte.vente[0] = 22;
            carte.attaque = 3;
            carte.vie_max = carte.vie = 3;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Donne 2 attaque et 1 vie à toutes les Créatures alliées sur le terrain.";
            carte.effet_pose = function () {
                if (!statistique(carte, "silence")) {
                    for (let n = 0; n < Jeu[carte.camp].terrain.length; n++) {
                        if (Jeu[carte.camp].terrain[n].type == "Créature") {
                            Jeu[carte.camp].terrain[n].attaque += 2;
                            Jeu[carte.camp].terrain[n].vie_max++;
                            Jeu[carte.camp].terrain[n].vie++;
                        }
                    }
                }
                deplacer(carte, carte.camp, "terrain");
                effet_pose(carte);
                menu();
                return true;
            }
            break;
        case 9:
            carte.nom = "Dragon";
            carte.familles.push("Dragon");
            carte.cout[0] = 11;
            carte.cout[1] = 4;
            carte.cout[5] = 4;
            carte.vente[0] = 5;
            carte.vente[1] = 2;
            carte.vente[5] = 2;
            carte.attaque = 8;
            carte.vie_max = carte.vie = 8;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Inflige 4 dégâts à une Unité adverse sur le terrain.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_cible("adverse", "terrain") && !statistique(carte, "silence")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Unité adverse sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain adverse :</u>");
                                saut();
                                for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        afficher_carte("adverse", "terrain", n);
                                    }
                                    else {
                                        afficher("???");
                                    }
                                    div_fin();
                                    if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            else {
                                deplacer(carte, "joueur", "terrain");
                                effet_pose(carte);
                                menu();
                            }
                            break;
                        case 2:
                            degats(Jeu.adverse.terrain[cible], 4);
                            deplacer(carte, "joueur", "terrain");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_cible("joueur", "terrain") && !statistique(carte, "silence")) {
                        let best = 0;
                        while (Jeu.joueur.terrain[best].camouflage && !Jeu.joueur.terrain[best].silence) {
                            best++;
                        }
                        for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                            if ((Jeu.joueur.terrain[n].vie <= 4 && Jeu.joueur.terrain[best].vie > 4) || Jeu.joueur.terrain[n].vie > Jeu.joueur.terrain[best].vie && (!Jeu.joueur.terrain[n].camouflage || Jeu.joueur.terrain[n].silence)) {
                                best = n;
                            }
                        }
                        degats(Jeu.joueur.terrain[best], 4);
                    }
                    deplacer(carte, "adverse", "terrain");
                    effet_pose(carte);
                    return true;
                }
            }
            carte.description = "De grands reptiles rouges aux larges ailes, les dragons dominent les sommets volcaniques chassant tout ce qui est à leur portée, rampant comme volant.";
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
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_soin_creature("joueur") && !statistique(carte, "silence")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée blessée sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].vie < Jeu.joueur.terrain[n].vie_max) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            else {
                                deplacer(carte, "joueur", "terrain");
                                effet_pose(carte);
                                menu();
                            }
                            break;
                        case 2:
                            soin(Jeu.joueur.terrain[cible], 3);
                            deplacer(carte, "joueur", "terrain");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_soin_creature("adverse") && !statistique(carte, "silence")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].vie >= Jeu.adverse.terrain[best].vie_max) {
                            best++;
                        }
                        for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                            if ((Jeu.adverse.terrain[n].vie_max - Jeu.adverse.terrain[n].vie) > (Jeu.adverse.terrain[best].vie_max - Jeu.adverse.terrain[best].vie) && Jeu.adverse.terrain[n].type == "Créature") {
                                best = n;
                            }
                        }
                        soin(Jeu.adverse.terrain[best], 3);
                    }
                    deplacer(carte, "adverse", "terrain");
                    effet_pose(carte);
                    return true;
                }
            }
            break;
        case 11:
            carte.nom = "Marchand";
            carte.familles.push("Humain");
            carte.cout[0] = 6;
            carte.vente[0] = 3;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Donne 1 Or max.";
            carte.effet_pose = function () {
                if (!statistique(carte, "silence")) {
                    Jeu[carte.camp].ressources[0].max++;
                }
                deplacer(carte, carte.camp, "terrain");
                effet_pose(carte);
                menu();
                return true;
            }
            carte.description = "L'implantation des humains sur un grand nombre de continent leur a permis de devenir les leaders du commerce et de réguler l'économie.";
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
            carte.description = "Les jeunes soldats passent leurs premières années à surveiller les villes et villages afin d'acquérir une expérience suffisante pour partir au front.";
            break;
        case 13:
            carte.nom = "Squelette";
            carte.familles.push("Mort-vivant", "Squelette");
            carte.cout[0] = 1;
            carte.cout[9] = 1;
            carte.vente[0] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 1;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.description = "Simple amas d'os manipulé, ils sont totalement dépourvus d'intelligence.";
            break;
        case 14:
            carte.nom = "Nécromancien";
            carte.familles.push("Mort-vivant", "Revenant");
            carte.cout[0] = 6;
            carte.cout[9] = 5;
            carte.vente[0] = 3;
            carte.vente[9] = 2;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand joue : Crée <button onclick='javascript:carte_voir_id(13)'>Squelette</button> sur le terrain.";
            carte.effet_action = function () {
                let nouvelle_carte = obtenir_carte(13);
                nouvelle_carte.vente = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                ajouter(nouvelle_carte, carte.camp, carte.zone);
            }
            carte.description = "La faible masse des squelettes permet aux revenants de les utiliser comme esclave pour des tâches basiques.";
            break;
        case 15:
            carte.nom = "Roi des élements";
            carte.familles.push("Hydre");
            carte.cout = [0, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
            carte.vente = [0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5];
            carte.attaque = 30;
            carte.defense = 7;
            carte.vie_max = carte.vie = 30;
            carte.action_max = 5;
            carte.equipement_max = 1;
            carte.percee = 10;
            carte.sorcellerie = 2;
            carte.rapidite = true;
            carte.percee = 10;
            carte.regeneration = 5;
            carte.description = "Une hydre légendaire dont chacune de ses 12 têtes maîtrise un élément, lui permettant de contrôler tout son envionnement comme bon lui semble.";
            break;
        case 16:
            carte.nom = "Bombe";
            carte.type = "Objet";
            carte.familles.push("Explosif");
            carte.cout[0] = 3;
            carte.vente[0] = 1;
            carte.texte = "Inflige 3 dégâts à une Unité adverse sur le terrain.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_cible("adverse", "terrain")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Unité adverse sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain adverse :</u>");
                                saut();
                                for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        afficher_carte("adverse", "terrain", n);
                                    }
                                    else {
                                        afficher("???");
                                    }
                                    div_fin();
                                    if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            degats(Jeu.adverse.terrain[cible], 3);
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_cible("joueur", "terrain")) {
                        let best = 0;
                        while (Jeu.joueur.terrain[best].camouflage && !Jeu.joueur.terrain[best].silence) {
                            best++;
                        }
                        for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                            if ((Jeu.joueur.terrain[n].vie <= 3 && Jeu.joueur.terrain[best].vie > 3) || Jeu.joueur.terrain[n].vie > Jeu.joueur.terrain[best].vie && (!Jeu.joueur.terrain[n].camouflage || Jeu.joueur.terrain[n].silence)) {
                                best = n;
                            }
                        }
                        degats(Jeu.joueur.terrain[best], 3);
                        deplacer(carte, "adverse", "defausse");
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
            carte.cout[0] = 10;
            carte.vente[0] = 5;
            carte.texte = "Inflige 1 dégât à toutes les Unités adverses sur le terrain.";
            carte.effet_pose = function () {
                if (Jeu[camp_oppose(carte.camp)].terrain.length > 0) {
                    for (let n = 0; n < Jeu[camp_oppose(carte.camp)].terrain.length; n++) {
                        if (degats(Jeu[camp_oppose(carte.camp)].terrain[n], 1).mort) {
                            n--;
                        }
                    }
                    deplacer(carte, carte.camp, "defausse");
                    effet_pose(carte);
                    menu();
                    return true;
                }
                return false;
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
            carte.percee = 2;
            break;
        case 19:
            carte.nom = "Cheval";
            carte.type = "Créature";
            carte.familles.push("Bête");
            carte.cout[0] = 6;
            carte.vente[0] = 3;
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
            carte.cout[0] = 10;
            carte.cout[11] = 9;
            carte.vente[0] = 5;
            carte.vente[11] = 4;
            carte.attaque = 7;
            carte.vie_max = carte.vie = 7;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.vol_de_vie = 2;
            carte.description = "Habitués à vivre la nuit, les vampires ont dévelloppés la capacité de voler le sang de leurs proies pour ne pas les réveiller dans leur sommeil et sans les tuer.";
            break;
        case 22:
            carte.nom = "Automate embarqué";
            carte.type = "Créature";
            carte.familles.push("Machine", "Automate");
            carte.cout[0] = 3;
            carte.cout[7] = 3;
            carte.vente[0] = 2;
            carte.vente[7] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand meurt : Crée <button onclick='javascript:carte_voir_id(23)'>Automate</button> sur le terrain.";
            carte.effet_mort = function () {
                if (!statistique(carte, "silence")) {
                    let nouvelle_carte = obtenir_carte(23);
                    nouvelle_carte.vente = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    ajouter(nouvelle_carte, carte.camp, carte.zone);
                }
                if (statistique(carte, "ephemere") && !statistique(carte, "silence")) {
                    enlever(carte);
                }
                else {
                    deplacer(carte, carte.camp, "defausse");
                }
            }
            carte.description = "Cet automate est conçu pour en transporter un autre plus petit sur son dos.";
            break;
        case 23:
            carte.nom = "Automate";
            carte.type = "Créature";
            carte.familles.push("Machine", "Automate");
            carte.cout[0] = 2;
            carte.cout[7] = 1;
            carte.vente[0] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.description = "Les gnomes ne pouvant effectuer des tâches particulièrement physique, ils ont préférés concevoir des outils puis des automate pour s'en occuper.";
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
            carte.familles.push("Bateau", "Pirate");
            carte.cout[0] = 8;
            carte.cout[2] = 8;
            carte.vente[0] = 4;
            carte.vente[2] = 4;
            carte.vie_max = carte.vie = 4;
            carte.action_max = 1;
            carte.mobile = true;
            carte.texte = "Quand joue : Crée <button onclick='javascript:carte_voir_id(26)'>Pirate</button> sur le terrain.";
            carte.effet_action = function () {
                let nouvelle_carte = obtenir_carte(26);
                nouvelle_carte.vente = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                ajouter(nouvelle_carte, carte.camp, carte.zone);
            }
            break;
        case 26:
            carte.nom = "Pirate";
            carte.type = "Créature";
            carte.familles.push("Humain", "Pirate");
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
            carte.familles.push("Humain", "Mage");
            carte.cout[0] = 5;
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
            carte.cout[1] = 2;
            carte.vente[0] = 1;
            carte.vente[1] = 1;
            carte.texte = "Inflige 3 dégâts à une Unité adverse sur le terrain.<br/>Sorcellerie 2 : Inflige 5 dégâts à une Unité adverse sur le terrain.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_cible("adverse", "terrain")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Unité adverse sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain adverse :</u>");
                                saut();
                                for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        afficher_carte("adverse", "terrain", n);
                                    }
                                    else {
                                        afficher("???");
                                    }
                                    div_fin();
                                    if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            let carte_cible = Jeu.adverse.terrain[cible];
                            if (sorcellerie("joueur") >= 2) {
                                degats(carte_cible, 5);
                            }
                            else {
                                degats(carte_cible, 3);
                            }
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_cible("joueur", "terrain")) {
                        let best = 0;
                        while (Jeu.joueur.terrain[best].camouflage && !Jeu.joueur.terrain[best].silence) {
                            best++;
                        }
                        if (sorcellerie("adverse") >= 2) {
                            for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                if ((Jeu.joueur.terrain[n].vie <= 5 && Jeu.joueur.terrain[best].vie > 5) || Jeu.joueur.terrain[n].vie > Jeu.joueur.terrain[best].vie && (!Jeu.joueur.terrain[n].camouflage || Jeu.joueur.terrain[n].silence)) {
                                    best = n;
                                }
                            }
                            degats(Jeu.joueur.terrain[best], 5);
                        }
                        else {
                            for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                if ((Jeu.joueur.terrain[n].vie <= 3 && Jeu.joueur.terrain[best].vie > 3) || Jeu.joueur.terrain[n].vie > Jeu.joueur.terrain[best].vie && (!Jeu.joueur.terrain[n].camouflage || Jeu.joueur.terrain[n].silence)) {
                                    best = n;
                                }
                            }
                            degats(Jeu.joueur.terrain[best], 3);
                        }
                        deplacer(carte, "adverse", "defausse");
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
            carte.texte = "Pioche une carte.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    pioche("joueur");
                    deplacer(carte, "joueur", "defausse");
                    effet_pose(carte);
                    menu();
                }
                else {
                    return false;
                }
            }
            carte.description = "Mais que peut-il y avoir à l'intérieur ?";
            break;
        case 30:
            carte.nom = "Bottes de cuir";
            carte.type = "Objet";
            carte.familles.push("Équipement", "Armure");
            carte.cout[0] = 3;
            carte.vente[0] = 1;
            carte.stat_equipement.rapidite = true;
            carte.texte = "Applique Rapidité à la Créature équipée.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_equipement("joueur")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée équipable sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].equipements.length < Jeu.joueur.terrain[n].equipement_max) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            equiper(Jeu.joueur.terrain[cible], carte);
                            enlever(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_equipement("adverse")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].equipements.length >= Jeu.adverse.terrain[best].equipement_max) {
                            best++;
                        }
                        equiper(Jeu.adverse.terrain[best], carte);
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
            carte.cout[0] = 6;
            carte.vente[0] = 3;
            carte.texte = "Actualise la boutique alliée.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    boutique_actualiser();
                    deplacer(carte, "joueur", "defausse");
                    effet_pose(carte);
                    menu();
                }
                else {
                    return false;
                }
            }
            carte.description = "On a tous droit à une seconde chance.";
            break;
        case 32:
            carte.nom = "Usine robotique";
            carte.type = "Bâtiment";
            carte.familles.push("Machine", "Robot");
            carte.cout[0] = 6;
            carte.cout[6] = 3;
            carte.cout[7] = 3;
            carte.vente[0] = 4;
            carte.vente[6] = 1;
            carte.vente[7] = 1;
            carte.vie_max = carte.vie = 4;
            carte.mobile = false;
            carte.texte = "Au début d'un tour de combat : Crée <button onclick='javascript:carte_voir_id(33)'>Robot</button> sur le terrain.";
            carte.effet_tour_debut = function () {
                let nouvelle_carte = obtenir_carte(33);
                nouvelle_carte.vente = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                ajouter(nouvelle_carte, carte.camp, carte.zone);
            }
            carte.description = "Contrairement aux automates qui sont une invention des gnomes, on ne sait pas vraiment qui a créé les robots. La plupart d'entre eux se sont eux même construit grâce à des usines.";
            break;
        case 33:
            carte.nom = "Robot";
            carte.type = "Créature";
            carte.familles.push("Machine", "Robot");
            carte.cout[0] = 1;
            carte.cout[6] = 1;
            carte.cout[7] = 1;
            carte.vente[0] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.description = "Contrairement aux automates, les robots ont dévelloper un semblant de conscience grâce à leurs circuits éléctoniques.";
            break;
        case 34:
            carte.nom = "Berserker";
            carte.type = "Créature";
            carte.familles.push("Goliath");
            carte.cout[0] = 5;
            carte.cout[12] = 4;
            carte.vente[0] = 2;
            carte.vente[12] = 2;
            carte.attaque = 4;
            carte.vie_max = carte.vie = 4;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand subit des dégâts : Se donne 1 attaque.";
            carte.effet_degat = function () {
                carte.attaque++;
            }
            carte.description = "Certains goliath ont choisis la voie de la guerre et sont devenus des berserkers, de redoutables guerriers devenant plus fort en étant blessés.";
            break;
        case 35:
            carte.nom = "Maître d'armes";
            carte.type = "Créature";
            carte.familles.push("Humain");
            carte.cout[0] = 10;
            carte.vente[0] = 5;
            carte.attaque = 3;
            carte.vie_max = carte.vie = 3;
            carte.action_max = 1;
            carte.equipement_max = 2;
            break;
        case 36:
            carte.nom = "Négociant";
            carte.type = "Créature";
            carte.familles.push("Humain");
            carte.cout[0] = 5;
            carte.vente[0] = 2;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Diminue le coût d'une carte alliée dans la boutique de 2 Or.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_boutique_or() && !statistique(carte, "silence")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une carte dans votre boutique : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Boutique :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.boutique.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "boutique", n);
                                    div_fin();
                                    if (Jeu.joueur.boutique[n].cout[0] > 0) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            else {
                                deplacer(carte, "joueur", "terrain");
                                effet_pose(carte);
                                menu();
                            }
                            break;
                        case 2:
                            Jeu.joueur.boutique[cible].cout[0] -= 2;
                            if (Jeu.joueur.boutique[cible].cout[0] < 0) {
                                Jeu.joueur.boutique[cible].cout[0] = 0;
                            }
                            deplacer(carte, "joueur", "terrain");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    deplacer(carte, "adverse", "terrain");
                    effet_pose(carte);
                    menu();
                    return true;
                }
            }
            carte.description = "Tout peut se négocier, même le prix d'une personne.";
            break;
        case 37:
            carte.nom = "Démon";
            carte.type = "Créature";
            carte.familles.push("Démon");
            carte.cout[0] = 11;
            carte.cout[1] = 4;
            carte.cout[9] = 4;
            carte.vente[0] = 5;
            carte.vente[1] = 2;
            carte.vente[9] = 2;
            carte.attaque = 13;
            carte.vie_max = carte.vie = 13;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Inflige 3 dégâts au Meneur allié.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    if (!statistique(carte, "silence")) {
                        degats_direct("joueur", 3);
                    }
                    deplacer(carte, carte.camp, "terrain");
                    effet_pose(carte);
                    if (Jeu.joueur.vie > 0) {
                        menu();
                    }
                    else {
                        game_over();
                    }
                }
                else {
                    if (Jeu.adverse.vie >= 3) {
                        if (!statistique(carte, "silence")) {
                            degats_direct("adverse", 3);
                        }
                        deplacer(carte, carte.camp, "terrain");
                        effet_pose(carte);
                        menu();
                    }
                }
                return true;
            }
            carte.description = "Les démons résident dans les enfers et sont les partisans du chaos. Ces créatures surpuissantes sont incontrôlables et imprévisibles.";
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
            carte.cout[0] = 10;
            carte.vente[0] = 5;
            carte.texte = "Place une carte alliée dans la défausse dans la main. Si c'est une Unité, la soigne de 1.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (Jeu.joueur.defausse.length > 0) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une carte alliée dans la défausse : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Défausse :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.defausse.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "defausse", n);
                                    div_fin();
                                    div();
                                    fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                    div_fin();
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            if (["Créature", "Bâtiment"].includes(Jeu.joueur.defausse[cible].type)) {
                                Jeu.joueur.defausse[cible].vie = 1;
                            }
                            deplacer(Jeu.joueur.defausse[cible], "joueur", "main");
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (Jeu.adverse.defausse.length > 0) {
                        let best = 0;
                        for (let n = 0; n < Jeu.adverse.defausse.length; n++) {
                            if (cout_total(Jeu.adverse.defausse[n]) > cout_total(Jeu.adverse.defausse[best])) {
                                best = n;
                            }
                        }
                        if (["Créature", "Bâtiment"].includes(Jeu.adverse.defausse[best].type)) {
                            Jeu.adverse.defausse[best].vie = 1;
                        }
                        deplacer(Jeu.adverse.defausse[best], "adverse", "main");
                        deplacer(carte, "adverse", "defausse");
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
            carte.familles.push("Mort-vivant", "Revenant");
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
            carte.cout[0] = 11;
            carte.cout[1] = 4;
            carte.cout[5] = 4;
            carte.vente[0] = 5;
            carte.vente[1] = 2;
            carte.vente[5] = 2;
            carte.attaque = 5;
            carte.vie_max = carte.vie = 5;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand meurt : Se soigne de 1 et se place dans la main puis perd cet effet.";
            carte.effet_mort = function () {
                if (!statistique(carte, "silence")) {
                    if (statistique(carte, "ephemere") && !statistique(carte, "silence")) {
                        enlever(carte);
                    }
                    else {
                        carte.vie = 1;
                        carte.texte = "Aucun";
                        carte.effet_mort = function () {
                            if (statistique(carte, "ephemere") && !statistique(carte, "silence")) {
                                enlever(carte);
                            }
                            else {
                                deplacer(carte, carte.camp, "defausse");
                            }
                        }
                        deplacer(carte, carte.camp, "main");
                    }
                }
                else {
                    deplacer(carte, carte.camp, "defausse");
                }
            }
            break;
        case 42:
            carte.nom = "Faucheuse";
            carte.type = "Créature";
            carte.familles.push("Faucheuse");
            carte.cout[0] = 10;
            carte.cout[9] = 9;
            carte.vente[0] = 5;
            carte.vente[9] = 4;
            carte.attaque = 5;
            carte.vie_max = carte.vie = 5;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Détruit une Créature adverse dont la vie est de 10 ou moins sur le terrain.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_cible_creature("adverse", "terrain") && !statistique(carte, "silence")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature adverse sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain adverse :</u>");
                                saut();
                                for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        afficher_carte("adverse", "terrain", n);
                                    }
                                    else {
                                        afficher("???");
                                    }
                                    div_fin();
                                    if (Jeu.adverse.terrain[n].type == "Créature" && Jeu.adverse.terrain[n].vie <= 10 && !Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            else {
                                deplacer(carte, "joueur", "terrain");
                                effet_pose(carte);
                                menu();
                            }
                            break;
                        case 2:
                            mort(Jeu.adverse.terrain[cible]);
                            deplacer(carte, "joueur", "terrain");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_cible_creature("joueur", "terrain") && !statistique(carte, "silence")) {
                        let best = 0;
                        while (Jeu.joueur.terrain[best].type != "Créature" && (Jeu.joueur.terrain[best].camouflage && !Jeu.joueur.terrain[best].silence)) {
                            best++;
                        }
                        for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                            if (Jeu.joueur.terrain[n].vie > Jeu.joueur.terrain[best].vie && Jeu.joueur.terrain[best].type == "Créature" && (!Jeu.joueur.terrain[n].camouflage || Jeu.joueur.terrain[n].silence)) {
                                best = n;
                            }
                        }
                        mort(Jeu.joueur.terrain[best]);
                    }
                    deplacer(carte, "adverse", "terrain");
                    effet_pose(carte);
                    return true;
                }
            }
            break;
        case 43:
            carte.nom = "Ogre";
            carte.type = "Créature";
            carte.familles.push("Ogre");
            carte.cout[0] = 10;
            carte.cout[9] = 9;
            carte.vente[0] = 5;
            carte.vente[9] = 4;
            carte.attaque = 8;
            carte.vie_max = carte.vie = 8;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand tue une Créature : Se soigne de 2.";
            carte.effet_tuer = function (defenseur) {
                soin(carte, 2);
            }
            break;
        case 44:
            carte.nom = "Hérisson";
            carte.type = "Créature";
            carte.familles.push("Bête");
            carte.cout[0] = 2;
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
            carte.cout[0] = 35;
            carte.vente[0] = 17;
            carte.attaque = 3;
            carte.vie_max = carte.vie = 3;
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
            carte.nom = "Mangeur d'âme";
            carte.type = "Créature";
            carte.familles.push("Mort-vivant", "Liche");
            carte.cout[0] = 19;
            carte.cout[8] = 15;
            carte.cout[9] = 15;
            carte.vente[0] = 10;
            carte.vente[8] = 7;
            carte.vente[9] = 7;
            carte.attaque = 10;
            carte.vie_max = carte.vie = 10;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand une Créature meurt : Se donne 1 attaque et 1 vie.";
            carte.effet_mort_carte = function (carte_mort) {
                if (carte_mort.type == "Créature") {
                    carte.attaque++;
                    carte.vie++;
                    carte.vie_max++;
                }
            }
            break;
        case 47:
            carte.nom = "Tréant";
            carte.type = "Créature";
            carte.familles.push("Plante", "Tréant");
            carte.cout[0] = 10;
            carte.cout[3] = 9;
            carte.vente[0] = 5;
            carte.vente[3] = 4;
            carte.attaque = 4;
            carte.vie_max = carte.vie = 10;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.regeneration = 2;
            break;
        case 48:
            carte.nom = "Araignée empoisonnée";
            carte.type = "Créature";
            carte.familles.push("Insecte", "Araignée");
            carte.cout[0] = 2;
            carte.cout[9] = 1;
            carte.vente[0] = 1;
            carte.vente[9] = 1;
            carte.attaque = 1;
            carte.vie_max = carte.vie = 1;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand attaque : applique Poison 2 à la Créature attaquée.";
            carte.effet_attaque = function (defenseur) {
                if (defenseur.type == "Créature") {
                    defenseur.poison += 2;
                }
            }
            break;
        case 49:
            carte.nom = "Dague empoisonnée";
            carte.type = "Objet";
            carte.familles.push("Équipement", "Arme");
            carte.cout[0] = 3;
            carte.vente[0] = 2;
            carte.stat_equipement.effet_attaque = function (defenseur) {
                if (defenseur.type == "Créature") {
                    defenseur.poison += 2;
                }
            }
            carte.texte = "Applique l'effet suivant à la Créature équipée : Quand attaque : applique Poison 2 à la Créature attaquée.<br/>ou<br/>Applique Poison 4 à une Créature adverse sur le terrain.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_equipement("joueur") || verifier_creature("adverse", "terrain")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez un effet : ");
                                saut(2);
                                fonction("Applique l'effet suivant à la Créature équipée : Quand attaque : applique Poison 2 à la Créature attaquée", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2)");
                                saut();
                                afficher("ou");
                                saut();
                                fonction("Applique Poison 4 à une Créature adverse sur le terrain", "Jeu.joueur.main[" + carte.slot + "].effet_pose(4)");
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            if (verifier_equipement("joueur")) {
                                initialiser();
                                div("main");
                                fonction("Retour", "Jeu.joueur.main[" + carte.slot + "].effet_pose(1)");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher("Applique l'effet suivant à la Créature équipée : Quand attaque : applique Poison 2 à la Créature attaquée.");
                                saut(2);
                                afficher("Choisissez une Créature alliée équipable sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].equipements.length < Jeu.joueur.terrain[n].equipement_max) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 3:
                            equiper(Jeu.joueur.terrain[cible], carte);
                            effet_pose(carte);
                            enlever(carte);
                            menu();
                            break;
                        case 4:
                            if (verifier_cible_creature("adverse", "terrain")) {
                                initialiser();
                                div("main");
                                fonction("Retour", "Jeu.joueur.main[" + carte.slot + "].effet_pose(1)");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher("Applique Poison 4 à une Créature adverse sur le terrain.");
                                saut(2);
                                afficher("Choisissez une Créature adverse sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain adverse :</u>");
                                saut();
                                for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        afficher_carte("adverse", "terrain", n);
                                    }
                                    else {
                                        afficher("???");
                                    }
                                    div_fin();
                                    if (Jeu.adverse.terrain[n].type == "Créature" && !Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(5," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 5:
                            Jeu.adverse.terrain[cible].poison += 4;
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_equipement("adverse")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].equipements.length >= Jeu.adverse.terrain[best].equipement_max) {
                            best++;
                        }
                        equiper(Jeu.adverse.terrain[best], carte);
                        effet_pose(carte);
                        enlever(carte);
                        return true;
                    }
                    else if (verifier_cible_creature("joueur", "terrain")) {
                        let best = 0;
                        while (Jeu.joueur.terrain[best].type != "Créature" || (Jeu.joueur.terrain[best].camouflage && !Jeu.joueur.terrain[best].silence)) {
                            best++;
                        }
                        Jeu.joueur.terrain[best].poison += 4;
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 50:
            carte.nom = "Antidote";
            carte.type = "Objet";
            carte.familles.push("Potion");
            carte.cout[0] = 5;
            carte.vente[0] = 2;
            carte.texte = "Enlève Poison à une Créature alliée sur le terrain.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_poison("joueur")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée avec Poison sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].poison > 0) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.joueur.terrain[cible].poison = 0;
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_poison("adverse")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].poison == 0) {
                            best++;
                        }
                        for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                            if (Jeu.adverse.terrain[n].poison > Jeu.adverse.terrain[best].poison && Jeu.adverse.terrain[n].type == "Créature") {
                                best = n;
                            }
                        }
                        Jeu.adverse.terrain[best].poison = 0;
                        deplacer(carte, "adverse", "defausse");
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
            carte.cout[0] = 10;
            carte.cout[1] = 9;
            carte.vente[0] = 5;
            carte.vente[1] = 4;
            carte.attaque = 9;
            carte.vie_max = carte.vie = 8;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Applique Brûlure 2 à une Unité adverse sur le terrain.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_cible("adverse", "terrain") && !statistique(carte, "silence")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Unité adverse sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain adverse :</u>");
                                saut();
                                for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        afficher_carte("adverse", "terrain", n);
                                    }
                                    else {
                                        afficher("???");
                                    }
                                    div_fin();
                                    if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            else {
                                deplacer(carte, "joueur", "terrain");
                                effet_pose(carte);
                                menu();
                            }
                            break;
                        case 2:
                            if (Jeu.adverse.terrain[cible].brulure < 2) {
                                Jeu.adverse.terrain[cible].brulure = 2;
                            }
                            deplacer(carte, "joueur", "terrain");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_cible("joueur", "terrain") && !statistique(carte, "silence")) {
                        let best = 0;
                        while (Jeu.joueur.terrain[best].camouflage && !Jeu.joueur.terrain[best].silence) {
                            best++;
                        }
                        for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                            if (Jeu.joueur.terrain[n].brulure < 2 && Jeu.joueur.terrain[n].brulure < Jeu.joueur.terrain[best].brulure && (!Jeu.joueur.terrain[n].camouflage || Jeu.joueur.terrain[n].silence)) {
                                best = n;
                            }
                        }
                        degats(Jeu.joueur.terrain[best], 4);
                    }
                    deplacer(carte, "adverse", "terrain");
                    effet_pose(carte);
                    return true;
                }
            }
            break;
        case 52:
            carte.nom = "Martyr";
            carte.type = "Créature";
            carte.familles.push("Aasimar", "Église");
            carte.cout[0] = 3;
            carte.cout[10] = 3;
            carte.vente[0] = 2;
            carte.vente[10] = 1;
            carte.attaque = 1;
            carte.vie_max = carte.vie = 3;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand est soigné : Pioche une carte.";
            carte.effet_soin = function () {
                if (carte.camp == "joueur") {
                    pioche("joueur");
                }
            }
            break;
        case 53:
            carte.nom = "Paladin";
            carte.type = "Créature";
            carte.familles.push("Aasimar", "Paladin");
            carte.cout[0] = 10;
            carte.cout[10] = 9;
            carte.vente[0] = 5;
            carte.vente[10] = 4;
            carte.attaque = 8;
            carte.vie_max = carte.vie = 10;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.vie_sup = 4;
            break;
        case 54:
            carte.nom = "Serpent de mer";
            carte.type = "Créature";
            carte.familles.push("Poisson", "Serpent de mer");
            carte.cout[0] = 10;
            carte.cout[2] = 9;
            carte.vente[0] = 5;
            carte.vente[2] = 4;
            carte.attaque = 10;
            carte.vie_max = carte.vie = 10;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Bannis une carte alliée dans la boutique et se donne 1 attaque et 1 vie max.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (Jeu.joueur.boutique.length > 0 && !statistique(carte, "silence")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une carte dans la boutique : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Boutique :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.boutique.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "boutique", n);
                                    div_fin();
                                    div();
                                    fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                    div_fin();
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            else {
                                deplacer(carte, "joueur", "terrain");
                                effet_pose(carte);
                                menu();
                            }
                            break;
                        case 2:
                            carte.attaque++;
                            carte.vie_max++;
                            enlever(Jeu.joueur.boutique[cible]);
                            deplacer(carte, "joueur", "terrain");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    deplacer(carte, "adverse", "terrain");
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
            carte.cout[0] = 10;
            carte.vente[0] = 5;
            carte.texte = "Enlève tous les talents négatifs à une Créature alliée sur le terrain.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_debuff("joueur")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature" && (Jeu.joueur.terrain[n].poison > 0 || Jeu.joueur.terrain[n].brulure > 0 || Jeu.joueur.terrain[n].saignement > 0 || Jeu.joueur.terrain[n].contamination > 0 || Jeu.joueur.terrain[n].etourdissement || Jeu.joueur.terrain[n].silence)) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.joueur.terrain[cible].poison = 0;
                            Jeu.joueur.terrain[cible].brulure = 0;
                            Jeu.joueur.terrain[cible].saignement = 0;
                            Jeu.joueur.terrain[cible].contamination = 0;
                            Jeu.joueur.terrain[cible].gel = 0;
                            Jeu.joueur.terrain[cible].etourdissement = false;
                            Jeu.joueur.terrain[cible].silence = false;
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_debuff("adverse")) {
                        let best = 0;
                        for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                            let debuff = Jeu.adverse.terrain[n].poison + Jeu.adverse.terrain[n].brulure * 2 + Jeu.adverse.terrain[n].saignement + Jeu.adverse.terrain[n].contamination + Jeu.adverse.terrain[n].gel * 2 + Jeu.adverse.terrain[n].etourdissement * 3 + Jeu.adverse.terrain[n].silence * 5;
                            let best_debuff = Jeu.adverse.terrain[best].poison + Jeu.adverse.terrain[best].brulure * 2 + Jeu.adverse.terrain[best].saignement + Jeu.adverse.terrain[best].contamination + Jeu.adverse.terrain[best].gel * 2 + Jeu.adverse.terrain[best].etourdissement * 3 + Jeu.adverse.terrain[best].silence * 5;
                            if (debuff > best_debuff) {
                                best = n;
                            }
                        }
                        Jeu.adverse.terrain[best].poison = 0;
                        Jeu.adverse.terrain[best].brulure = 0;
                        Jeu.adverse.terrain[best].saignement = 0;
                        Jeu.adverse.terrain[best].contamination = 0;
                        Jeu.adverse.terrain[best].gel = 0;
                        Jeu.adverse.terrain[best].etourdissement = false;
                        Jeu.adverse.terrain[best].silence = false;
                        deplacer(carte, "adverse", "defausse");
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
            carte.cout[0] = 10;
            carte.cout[11] = 9;
            carte.vente[0] = 5;
            carte.vente[11] = 4;
            carte.attaque = 9;
            carte.vie_max = carte.vie = 9;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand attaque : Applique Contamination 1 à la Créature attaquée.";
            carte.effet_attaque = function (defenseur) {
                if (defenseur.type == "Créature") {
                    defenseur.contamination++;
                }
            }
            break;
        case 57:
            carte.nom = "Mangeur de miasme";
            carte.type = "Créature";
            carte.familles.push("Oni");
            carte.cout[0] = 10;
            carte.cout[11] = 9;
            carte.vente[0] = 5;
            carte.vente[11] = 4;
            carte.attaque = 10;
            carte.vie_max = carte.vie = 10;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand attaque : Si la Créature attaquée possède Contamination, lui enlève et se soigne d'autant que le nombre de Contamination enlevé.";
            carte.effet_attaque = function (defenseur) {
                if (defenseur.type == "Créature" && defenseur.contamination > 0) {
                    soin(carte, defenseur.contamination);
                    defenseur.contamination = 0;
                }
            }
            break;
        case 58:
            carte.nom = "Dague de cuivre";
            carte.type = "Objet";
            carte.familles.push("Équipement", "Arme");
            carte.cout[0] = 2;
            carte.vente[0] = 1;
            carte.stat_equipement.attaque = 1;
            carte.texte = "Donne 1 attaque à la Créature équipée.<br/>ou<br/>Inflige 1 dégât à une Créature adverse sur le terrain.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_equipement("joueur") || verifier_creature("adverse", "terrain")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez un effet : ");
                                saut(2);
                                fonction("Donne 1 attaque à la Créature équipée", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2)");
                                saut();
                                afficher("ou");
                                saut();
                                fonction("Inflige 1 dégât à une Créature adverse sur le terrain", "Jeu.joueur.main[" + carte.slot + "].effet_pose(4)");
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            if (verifier_equipement("joueur")) {
                                initialiser();
                                div("main");
                                fonction("Retour", "Jeu.joueur.main[" + carte.slot + "].effet_pose(1)");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher("Donne 1 attaque à la Créature équipée.");
                                saut(2);
                                afficher("Choisissez une Créature alliée équipable sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].equipements.length < Jeu.joueur.terrain[n].equipement_max) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 3:
                            equiper(Jeu.joueur.terrain[cible], carte);
                            effet_pose(carte);
                            enlever(carte);
                            menu();
                            break;
                        case 4:
                            if (verifier_cible_creature("adverse", "terrain")) {
                                initialiser();
                                div("main");
                                fonction("Retour", "Jeu.joueur.main[" + carte.slot + "].effet_pose(1)");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher("Inflige 1 dégât à une Créature adverse sur le terrain.");
                                saut(2);
                                afficher("Choisissez une Créature adverse sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain adverse :</u>");
                                saut();
                                for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        afficher_carte("adverse", "terrain", n);
                                    }
                                    else {
                                        afficher("???");
                                    }
                                    div_fin();
                                    if (Jeu.adverse.terrain[n].type == "Créature" && !Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(5," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 5:
                            degats(Jeu.adverse.terrain[cible], 1);
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_equipement("adverse")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].equipements.length >= Jeu.adverse.terrain[best].equipement_max) {
                            best++;
                        }
                        equiper(Jeu.adverse.terrain[best], carte);
                        effet_pose(carte);
                        enlever(carte);
                        return true;
                    }
                    else if (verifier_cible_creature("joueur", "terrain")) {
                        let best = 0;
                        while (Jeu.joueur.terrain[best].type != "Créature" || (Jeu.joueur.terrain[best].camouflage && !Jeu.joueur.terrain[best].silence)) {
                            best++;
                        }
                        for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                            if (Jeu.joueur.terrain[n].vie == 1 && Jeu.joueur.terrain[n].type == "Créature" && (!Jeu.joueur.terrain[n].camouflage || Jeu.joueur.terrain[n].silence)) {
                                best = n;
                            }
                        }
                        degats(Jeu.joueur.terrain[n], 1);
                        deplacer(carte, "adverse", "defausse");
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
            carte.cout[0] = 4;
            carte.vente[0] = 1;
            carte.attaque = 5;
            carte.vie_max = carte.vie = 5;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.temporaire = true;
            break;
        case 62:
            carte.nom = "Gladiateur";
            carte.type = "Créature";
            carte.familles.push("Humain");
            carte.cout[0] = 5;
            carte.vente[0] = 2;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand est équipé d'un Objet Équipement Arme : Se donne 4 attaque.";
            carte.effet_equiper = function (equipement) {
                if (equipement.familles.includes("Arme")) {
                    carte.attaque += 4;
                }
            }
            break;
        case 63:
            carte.nom = "Oeuf de dragon";
            carte.type = "Bâtiment";
            carte.familles.push("Dragon", "Oeuf");
            carte.cout[0] = 7;
            carte.cout[1] = 3;
            carte.cout[5] = 3;
            carte.vente[0] = 3;
            carte.vente[1] = 2;
            carte.vente[5] = 2;
            carte.vie_max = carte.vie = 1;
            carte.texte = "Quand arrive sur le terrain : Lance un décompte de 2.<br/>Quand le décompte de cette carte est écoulé : Se détruit et crée <button onclick='javascript:carte_voir_id(9)'>Dragon</button> sur le terrain.";
            carte.effet_ajouter = function () {
                if (carte.zone == "terrain") {
                    carte.decompte = 2;
                }
            }
            carte.effet_enlever = function () {
                if (carte.zone == "terrain") {
                    carte.decompte = 0;
                }
            }
            carte.effet_decompte = function () {
                let nouvelle_carte = obtenir_carte(9);
                nouvelle_carte.vente = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                ajouter(nouvelle_carte, carte.camp, "terrain");
                carte.vie = 0;
            }
            break;
        case 64:
            carte.nom = "Assassin";
            carte.type = "Créature";
            carte.familles.push("Humain");
            carte.cout[0] = 7;
            carte.vente[0] = 3;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Inflige 2 dégâts au Meneur adverse.";
            carte.effet_pose = function () {
                deplacer(carte, carte.camp, "terrain");
                effet_pose(carte);
                if (!statistique(carte, "silence")) {
                    if (carte.camp == "joueur") {
                        degats_direct("adverse", 2);
                        if (Jeu.adverse.vie > 0) {
                            menu();
                        }
                        else {
                            combat_victoire();
                        }
                    }
                    else {
                        degats_direct("joueur", 2);
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
            carte.cout[0] = 11;
            carte.cout[5] = 4;
            carte.cout[10] = 4;
            carte.vente[0] = 5;
            carte.vente[5] = 2;
            carte.vente[10] = 2;
            carte.attaque = 8;
            carte.vie_max = carte.vie = 8;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Soigne 2 au Meneur allié.";
            carte.effet_pose = function () {
                if (!statistique(carte, "silence")) {
                    soin_direct(carte.camp, 2);
                }
                deplacer(carte, carte.camp, "terrain");
                effet_pose(carte);
                menu();
                return true;
            }
            break;
        case 66:
            carte.nom = "Évêque";
            carte.type = "Créature";
            carte.familles.push("Aasimar", "Église");
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
                    soin(carte, 1);
                }
            }
            break;
        case 67:
            carte.nom = "Griffon";
            carte.type = "Créature";
            carte.familles.push("Griffon");
            carte.cout[0] = 10;
            carte.cout[5] = 9;
            carte.vente[0] = 5;
            carte.vente[5] = 4;
            carte.attaque = 8;
            carte.vie_max = carte.vie = 8;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Diminue le coût d'amélioration de la boutique de 2 Or.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur" && !statistique(carte, "silence")) {
                    Jeu.boutique_amelioration -= 2;
                    if (Jeu.boutique_amelioration < 0) {
                        Jeu.boutique_amelioration = 0;
                    }
                }
                deplacer(carte, carte.camp, "terrain");
                effet_pose(carte);
                menu();
                return true;
            }
            break;
        case 68:
            carte.nom = "Tigre";
            carte.type = "Créature";
            carte.familles.push("Bête", "Félin");
            carte.cout[0] = 7;
            carte.cout[3] = 6;
            carte.vente[0] = 3;
            carte.vente[3] = 3;
            carte.attaque = 5;
            carte.vie_max = carte.vie = 5;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.camouflage = true;
            break;
        case 69:
            carte.nom = "Troll";
            carte.type = "Créature";
            carte.familles.push("Troll");
            carte.cout[0] = 10;
            carte.cout[12] = 9;
            carte.vente[0] = 5;
            carte.vente[12] = 4;
            carte.attaque = 8;
            carte.vie_max = carte.vie = 9;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Applique Gel 1 à une Unité adverse sur le terrain.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_cible("adverse", "terrain") && !statistique(carte, "silence")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Unité adverse sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain adverse :</u>");
                                saut();
                                for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        afficher_carte("adverse", "terrain", n);
                                    }
                                    else {
                                        afficher("???");
                                    }
                                    div_fin();
                                    if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            else {
                                deplacer(carte, "joueur", "terrain");
                                effet_pose(carte);
                                menu();
                            }
                            break;
                        case 2:
                            if (Jeu.adverse.terrain[cible].gel < 1) {
                                Jeu.adverse.terrain[cible].gel = 1;
                            }
                            deplacer(carte, "joueur", "terrain");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_cible("joueur", "terrain") && !statistique(carte, "silence")) {
                        let best = 0;
                        while (Jeu.joueur.terrain[best].camouflage && !Jeu.joueur.terrain[best].silence) {
                            best++;
                        }
                        for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                            if (Jeu.joueur.terrain[n].gel < 1 && (!Jeu.joueur.terrain[n].camouflage || Jeu.joueur.terrain[n].silence)) {
                                best = n;
                            }
                        }
                        if (Jeu.joueur.terrain[best].gel < 1) {
                            Jeu.joueur.terrain[best].gel = 1;
                        }
                    }
                    deplacer(carte, "adverse", "terrain");
                    effet_pose(carte);
                    return true;
                }
            }
            break;
        case 70:
            carte.nom = "Grappin";
            carte.type = "Objet";
            carte.cout[0] = 3;
            carte.vente[0] = 1;
            carte.texte = "Place en première position une Créature adverse sur le terrain.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_cible_creature("adverse", "terrain")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature adverse sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain adverse :</u>");
                                saut();
                                for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        afficher_carte("adverse", "terrain", n);
                                    }
                                    else {
                                        afficher("???");
                                    }
                                    div_fin();
                                    if (Jeu.adverse.terrain[n].type == "Créature" && !Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.adverse.terrain.unshift(Jeu.adverse.terrain[cible]);
                            Jeu.adverse.terrain.splice(cible + 1, 1);
                            Jeu.adverse.terrain[0].slot = 0;
                            for (let n = 1; n < cible + 1; n++) {
                                Jeu.adverse.terrain[n].slot++;
                            }
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_cible_creature("joueur", "terrain")) {
                        let best = 0;
                        while (Jeu.joueur.terrain[best].type != "Créature" || (Jeu.joueur.terrain[best].camouflage && !Jeu.joueur.terrain[best].silence)) {
                            best++;
                        }
                        for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                            if (Jeu.joueur.terrain[n].vie < Jeu.joueur.terrain[best].vie && Jeu.joueur.terrain[n].type == "Créature" && (!Jeu.joueur.terrain[n].camouflage || Jeu.joueur.terrain[n].silence)) {
                                best = n;
                            }
                        }
                        Jeu.joueur.terrain.unshift(Jeu.joueur.terrain[best]);
                        Jeu.joueur.terrain.splice(best + 1, 1);
                        Jeu.joueur.terrain[0].slot = 0;
                        for (let n = 1; n < best + 1; n++) {
                            Jeu.joueur.terrain[n].slot++;
                        }
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 71:
            carte.nom = "Vendeur de parchemin";
            carte.type = "Créature";
            carte.familles.push("Humain", "Mage");
            carte.cout[0] = 4;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand vendu : Pioche une Action Sort.";
            carte.effet_vente = function () {
                let verifier = false;
                for (let n = 0; n < Jeu.NOMBRE_CARTE; n++) {
                    if (Jeu.joueur.regions[Jeu.region_active].boutique_generer(obtenir_carte(n)) && obtenir_carte(n).familles.includes("Sort")) {
                        verifier = true;
                    }
                }
                if (verifier) {
                    let nouvelle_carte = boutique_generer();
                    while (!nouvelle_carte.familles.includes("Sort")) {
                        nouvelle_carte = boutique_generer();
                    }
                    pioche("joueur", nouvelle_carte);
                }
            }
            break;
        case 72:
            carte.nom = "Assomer";
            carte.type = "Action";
            carte.cout[0] = 5;
            carte.vente[0] = 2;
            carte.texte = "Applique Étourdissement à une Créature adverse sur le terrain.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_cible_creature("adverse", "terrain")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature adverse sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain adverse :</u>");
                                saut();
                                for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        afficher_carte("adverse", "terrain", n);
                                    }
                                    else {
                                        afficher("???");
                                    }
                                    div_fin();
                                    if (Jeu.adverse.terrain[n].type == "Créature" && !Jeu.adverse.terrain[n].etourdissement && !Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.adverse.terrain[cible].etourdissement = true;
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_cible_creature("joueur", "terrain")) {
                        let best = 0;
                        while (Jeu.joueur.terrain[best].type != "Créature" || (Jeu.joueur.terrain[best].camouflage && !Jeu.joueur.terrain[best].silence)) {
                            best++;
                        }
                        for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                            if (!Jeu.joueur.terrain[n].etourdissement && Jeu.joueur.terrain[n].action_max > Jeu.joueur.terrain[best].action_max && Jeu.joueur.terrain[n].type == "Créature" && (!Jeu.joueur.terrain[n].camouflage || Jeu.joueur.terrain[n].silence)) {
                                best = n;
                            }
                        }
                        Jeu.joueur.terrain[best].etourdissement = true;
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 73:
            carte.nom = "Battement d'aile";
            carte.type = "Action";
            carte.cout[0] = 2;
            carte.cout[5] = 2;
            carte.vente[0] = 1;
            carte.vente[5] = 1;
            carte.texte = "Place une Créature sur le terrain dans la main de son possesseur.";
            carte.effet_pose = function (step, cible_camp, cible_slot) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_cible_creature("joueur", "terrain") || verifier_creature("adverse", "terrain")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                if (Jeu.joueur.terrain.length > 0) {
                                    for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                        div("", "carte");
                                        div();
                                        afficher_carte("joueur", "terrain", n);
                                        div_fin();
                                        if (Jeu.joueur.terrain[n].type == "Créature") {
                                            div();
                                            fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + '"joueur",' + n + ")");
                                            div_fin();
                                        }
                                        div_fin();
                                    }
                                }
                                else {
                                    afficher("<i>Votre terrain est vide</i>");
                                    saut();
                                }
                                div_fin();
                                saut();
                                afficher("Choisissez une Créature adverse sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain adverse :</u>");
                                saut();
                                if (Jeu.adverse.terrain.length > 0) {
                                    for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                                        div("", "carte");
                                        div();
                                        if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                            afficher_carte("adverse", "terrain", n);
                                        }
                                        else {
                                            afficher("???");
                                        }
                                        div_fin();
                                        if (Jeu.adverse.terrain[n].type == "Créature" && !Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                            div();
                                            fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + '"adverse",' + n + ")");
                                            div_fin();
                                        }
                                        div_fin();
                                    }
                                }
                                else {
                                    afficher("<i>Le terrain adverse est vide</i>");
                                    saut();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            deplacer(Jeu[cible_camp].terrain[cible_slot], cible_camp, "main");
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_cible_creature("joueur", "terrain")) {
                        let best = 0;
                        while (Jeu.joueur.terrain[best].type != "Créature" || (Jeu.joueur.terrain[best].camouflage && !Jeu.joueur.terrain[best].silence)) {
                            best++;
                        }
                        for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                            if (cout_total(Jeu.joueur.terrain[n]) > cout_total(Jeu.joueur.terrain[best]) && Jeu.joueur.terrain[n].type == "Créature" && (!Jeu.joueur.terrain[n].camouflage || Jeu.joueur.terrain[n].silence)) {
                                best = n;
                            }
                        }
                        deplacer(Jeu.joueur.terrain[best], "joueur", "main");
                        deplacer(carte, "adverse", "defausse");
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
                if (!statistique(carte, "silence")) {
                    if (carte.camp == "joueur") {
                        deplacer(carte, "adverse", "terrain");
                    }
                    else {
                        deplacer(carte, "joueur", "terrain");
                    }
                }
                else {
                    deplacer(carte, carte.camp, "terrain");
                }
                effet_pose(carte);
                menu();
                return true;
            }
            carte.effet_mort = function () {
                if (!statistique(carte, "silence")) {
                    degats_direct(carte.camp, 2);
                }
                if (statistique(carte, "ephemere") && !statistique(carte, "silence")) {
                    enlever(carte);
                }
                else {
                    deplacer(carte, carte.camp, "defausse");
                }
            }
            break;
        case 75:
            carte.nom = "Chevalier monté";
            carte.type = "Créature";
            carte.familles.push("Humain");
            carte.cout[0] = 18;
            carte.vente[0] = 9;
            carte.attaque = 4;
            carte.vie = carte.vie_max = 3;
            carte.rapidite = true;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand meurt : Se transforme en <button onclick='javascript:carte_voir_id(76)'>Chevalier</button>.";
            carte.effet_mort = function () {
                if (!statistique(carte, "silence")) {
                    carte.nom = "Chevalier";
                    carte.cout[0] -= 9;
                    carte.vente[0] -= 5;
                    carte.defense += 1;
                    carte.vie = carte.vie_max;
                    carte.rapidite = false;
                    carte.texte = "Aucun";
                }
                else {
                    if (statistique(carte, "ephemere") && !statistique(carte, "silence")) {
                        enlever(carte);
                    }
                    else {
                        deplacer(carte, carte.camp, "defausse");
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
            carte.attaque = 4;
            carte.defense = 1;
            carte.vie = carte.vie_max = 4;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 77:
            carte.nom = "Homme d'affaire";
            carte.type = "Créature";
            carte.familles.push("Humain");
            carte.cout[0] = 8;
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
            carte.texte = "Toutes les cartes peuvent être piochées dans la boutique.";
            carte.effet_pose = function () {
                return false;
            }
            carte.boutique_generer = function (nouvelle_carte) {
                if ((cout_total(nouvelle_carte) <= Jeu.boutique_niveau * 5 || Jeu.boutique_niveau == 10) && !nouvelle_carte.exclusif) {
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
            carte.texte = "Les cartes piochées dans la boutique ont un coût minimum de 1 Feu.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    deplacer(carte, "joueur", "regions");
                    menu();
                }
                else {
                    return false;
                }
            }
            carte.boutique_generer = function (nouvelle_carte) {
                if ((cout_total(nouvelle_carte) <= Jeu.boutique_niveau * 5 || Jeu.boutique_niveau == 10) && !nouvelle_carte.exclusif && nouvelle_carte.cout[1] > 0) {
                    return true;
                }
                return false;
            }
            break;
        case 80:
            carte.nom = "Taillade";
            carte.type = "Action";
            carte.cout[0] = 4;
            carte.vente[0] = 2;
            carte.texte = "Applique Saignement 2 à une Créature adverse sur le terrain.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_cible_creature("adverse", "terrain")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature adverse sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain adverse :</u>");
                                saut();
                                for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        afficher_carte("adverse", "terrain", n);
                                    }
                                    else {
                                        afficher("???");
                                    }
                                    div_fin();
                                    if (Jeu.adverse.terrain[n].type == "Créature" && !Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.adverse.terrain[cible].saignement += 2;
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_cible_creature("joueur", "terrain")) {
                        let best = 0;
                        while (Jeu.joueur.terrain[best].type != "Créature" || (Jeu.joueur.terrain[best].camouflage && !Jeu.joueur.terrain[best].silence)) {
                            best++;
                        }
                        for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                            if (Jeu.joueur.terrain[n].action_max > Jeu.joueur.terrain[best].action_max && Jeu.joueur.terrain[n].type == "Créature" && (!Jeu.joueur.terrain[n].camouflage || Jeu.joueur.terrain[n].silence)) {
                                best = n;
                            }
                        }
                        Jeu.joueur.terrain[best].saignement += 2;
                        deplacer(carte, "adverse", "defausse");
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
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_creature("joueur", "terrain")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature") {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.joueur.terrain[cible].stat_etage.attaque += 2;
                            Jeu.joueur.terrain[cible].vie++;
                            Jeu.joueur.terrain[cible].stat_etage.vie_max++;
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_creature("adverse", "terrain")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature") {
                            best++;
                        }
                        Jeu.adverse.terrain[best].stat_etage.attaque += 2;
                        Jeu.adverse.terrain[best].vie++;
                        Jeu.adverse.terrain[best].stat_etage.vie_max++;
                        deplacer(carte, "adverse", "defausse");
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
            carte.effet_pose = function (step, camp, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_creature("joueur", "terrain") || verifier_creature("adverse", "terrain")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                if (Jeu.joueur.terrain.length > 0) {
                                    for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                        div("", "carte");
                                        div();
                                        afficher_carte("joueur", "terrain", n);
                                        div_fin();
                                        if (Jeu.joueur.terrain[n].type == "Créature") {
                                            div();
                                            fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + '"joueur",' + n + ")");
                                            div_fin();
                                        }
                                        div_fin();
                                    }
                                }
                                else {
                                    afficher("<i>Votre terrain est vide</i>");
                                    saut();
                                }
                                div_fin();
                                saut();
                                afficher("Choisissez une Créature adverse sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain adverse :</u>");
                                saut();
                                if (Jeu.adverse.terrain.length > 0) {
                                    for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                                        div("", "carte");
                                        div();
                                        if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                            afficher_carte("adverse", "terrain", n);
                                        }
                                        else {
                                            afficher("???");
                                        }
                                        div_fin();
                                        if (Jeu.adverse.terrain[n].type == "Créature") {
                                            div();
                                            fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + '"adverse",' + n + ")");
                                            div_fin();
                                        }
                                        div_fin();
                                    }
                                }
                                else {
                                    afficher("<i>Le terrain adverse est vide</i>");
                                    saut();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu[camp].terrain[cible].silence = true;
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_cible_creature("joueur", "terrain")) {
                        let best = 0;
                        while (Jeu.joueur.terrain[best].type != "Créature" || Jeu.joueur.terrain[best].silence) {
                            best++;
                        }
                        Jeu.joueur.terrain[best].silence = true;
                        deplacer(carte, "adverse", "defausse");
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
            carte.cout[0] = 8;
            carte.vente[0] = 4;
            carte.attaque = 3;
            carte.vie = carte.vie_max = 3;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Au début d'un tour de combat : se donne 1 attaque pour chaque Créature adverse sur le terrain jusqu'à la fin du tour de combat.";
            carte.effet_tour_debut = function () {
                for (let n = 0; n < Jeu[camp_oppose(carte.camp)].terrain.length; n++) {
                    if (Jeu[camp_oppose(carte.camp)].terrain[n].type == "Créature") {
                        carte.stat_tour.attaque++;
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
            carte.nom = "Céleste";
            carte.familles.push("Céleste");
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
            carte.nom = "Kalashtar";
            carte.familles.push("Kalashtar");
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
            carte.familles.push("Mort-vivant", "Revenant");
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
            carte.familles.push("Aasimar", "Église");
            carte.cout[0] = 2;
            carte.cout[10] = 1;
            carte.vente[0] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 94:
            carte.nom = "Drow";
            carte.familles.push("Drow");
            carte.cout[0] = 2;
            carte.cout[11] = 1;
            carte.vente[0] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 95:
            carte.nom = "Goliath";
            carte.familles.push("Goliath");
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
            carte.texte = "Les cartes piochées dans la boutique ont un coût minimum de 1 Eau.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    deplacer(carte, "joueur", "regions");
                    menu();
                }
                else {
                    return false;
                }
            }
            carte.boutique_generer = function (nouvelle_carte) {
                if ((cout_total(nouvelle_carte) <= Jeu.boutique_niveau * 5 || Jeu.boutique_niveau == 10) && !nouvelle_carte.exclusif && nouvelle_carte.cout[2] > 0) {
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
            carte.texte = "Les cartes piochées dans la boutique ont un coût minimum de 1 Végétal.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    deplacer(carte, "joueur", "regions");
                    menu();
                }
                else {
                    return false;
                }
            }
            carte.boutique_generer = function (nouvelle_carte) {
                if ((cout_total(nouvelle_carte) <= Jeu.boutique_niveau * 5 || Jeu.boutique_niveau == 10) && !nouvelle_carte.exclusif && nouvelle_carte.cout[3] > 0) {
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
            carte.texte = "Les cartes piochées dans la boutique ont un coût minimum de 1 Terre.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    deplacer(carte, "joueur", "regions");
                    menu();
                }
                else {
                    return false;
                }
            }
            carte.boutique_generer = function (nouvelle_carte) {
                if ((cout_total(nouvelle_carte) <= Jeu.boutique_niveau * 5 || Jeu.boutique_niveau == 10) && !nouvelle_carte.exclusif && nouvelle_carte.cout[4] > 0) {
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
            carte.texte = "Les cartes piochées dans la boutique ont un coût minimum de 1 Air.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    deplacer(carte, "joueur", "regions");
                    menu();
                }
                else {
                    return false;
                }
            }
            carte.boutique_generer = function (nouvelle_carte) {
                if ((cout_total(nouvelle_carte) <= Jeu.boutique_niveau * 5 || Jeu.boutique_niveau == 10) && !nouvelle_carte.exclusif && nouvelle_carte.cout[5] > 0) {
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
            carte.texte = "Les cartes piochées dans la boutique ont un coût minimum de 1 Foudre.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    deplacer(carte, "joueur", "regions");
                    menu();
                }
                else {
                    return false;
                }
            }
            carte.boutique_generer = function (nouvelle_carte) {
                if ((cout_total(nouvelle_carte) <= Jeu.boutique_niveau * 5 || Jeu.boutique_niveau == 10) && !nouvelle_carte.exclusif && nouvelle_carte.cout[6] > 0) {
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
            carte.texte = "Les cartes piochées dans la boutique ont un coût minimum de 1 Métal.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    deplacer(carte, "joueur", "regions");
                    menu();
                }
                else {
                    return false;
                }
            }
            carte.boutique_generer = function (nouvelle_carte) {
                if ((cout_total(nouvelle_carte) <= Jeu.boutique_niveau * 5 || Jeu.boutique_niveau == 10) && !nouvelle_carte.exclusif && nouvelle_carte.cout[7] > 0) {
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
            carte.texte = "Les cartes piochées dans la boutique ont un coût minimum de 1 Arcane.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    deplacer(carte, "joueur", "regions");
                    menu();
                }
                else {
                    return false;
                }
            }
            carte.boutique_generer = function (nouvelle_carte) {
                if ((cout_total(nouvelle_carte) <= Jeu.boutique_niveau * 5 || Jeu.boutique_niveau == 10) && !nouvelle_carte.exclusif && nouvelle_carte.cout[8] > 0) {
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
            carte.texte = "Les cartes piochées dans la boutique ont un coût minimum de 1 Mort.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    deplacer(carte, "joueur", "regions");
                    menu();
                }
                else {
                    return false;
                }
            }
            carte.boutique_generer = function (nouvelle_carte) {
                if ((cout_total(nouvelle_carte) <= Jeu.boutique_niveau * 5 || Jeu.boutique_niveau == 10) && !nouvelle_carte.exclusif && nouvelle_carte.cout[9] > 0) {
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
            carte.texte = "Les cartes piochées dans la boutique ont un coût minimum de 1 Lumière.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    deplacer(carte, "joueur", "regions");
                    menu();
                }
                else {
                    return false;
                }
            }
            carte.boutique_generer = function (nouvelle_carte) {
                if ((cout_total(nouvelle_carte) <= Jeu.boutique_niveau * 5 || Jeu.boutique_niveau == 10) && !nouvelle_carte.exclusif && nouvelle_carte.cout[10] > 0) {
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
            carte.texte = "Les cartes piochées dans la boutique ont un coût minimum de 1 Ombre.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    deplacer(carte, "joueur", "regions");
                    menu();
                }
                else {
                    return false;
                }
            }
            carte.boutique_generer = function (nouvelle_carte) {
                if ((cout_total(nouvelle_carte) <= Jeu.boutique_niveau * 5 || Jeu.boutique_niveau == 10) && !nouvelle_carte.exclusif && nouvelle_carte.cout[11] > 0) {
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
            carte.texte = "Les cartes piochées dans la boutique ont un coût minimum de 1 Glace.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    deplacer(carte, "joueur", "regions");
                    menu();
                }
                else {
                    return false;
                }
            }
            carte.boutique_generer = function (nouvelle_carte) {
                if ((cout_total(nouvelle_carte) <= Jeu.boutique_niveau * 5 || Jeu.boutique_niveau == 10) && !nouvelle_carte.exclusif && nouvelle_carte.cout[12] > 0) {
                    return true;
                }
                return false;
            }
            break;
        case 107:
            carte.nom = "Bouclier en cuir";
            carte.type = "Objet";
            carte.familles.push("Équipement", "Armure");
            carte.cout[0] = 4;
            carte.vente[0] = 2;
            carte.stat_equipement.defense = 2;
            carte.texte = "Donne 2 défense à la Créature équipée.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_equipement("joueur")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée équipable sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].equipements.length < Jeu.joueur.terrain[n].equipement_max) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            equiper(Jeu.joueur.terrain[cible], carte);
                            effet_pose(carte);
                            enlever(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_equipement("adverse")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].equipements.length >= Jeu.adverse.terrain[best].equipement_max) {
                            best++;
                        }
                        equiper(Jeu.adverse.terrain[best], carte);
                        effet_pose(carte);
                        enlever(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 108:
            carte.nom = "Arc en bois";
            carte.type = "Objet";
            carte.familles.push("Équipement", "Arme");
            carte.cout[0] = 4;
            carte.vente[0] = 1;
            carte.stat_equipement.attaque = 3;
            carte.stat_equipement.portee = true;
            carte.texte = "Donne 3 attaque et applique Portée à la Créature équipée.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_equipement("joueur")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée équipable sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].equipements.length < Jeu.joueur.terrain[n].equipement_max) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            equiper(Jeu.joueur.terrain[cible], carte);
                            effet_pose(carte);
                            enlever(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_equipement("adverse")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].equipements.length >= Jeu.adverse.terrain[best].equipement_max) {
                            best++;
                        }
                        equiper(Jeu.adverse.terrain[best], carte);
                        effet_pose(carte);
                        enlever(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 109:
            carte.nom = "Baguette en bois";
            carte.type = "Objet";
            carte.familles.push("Équipement", "Arme");
            carte.cout[0] = 4;
            carte.vente[0] = 2;
            carte.stat_equipement.attaque = 2;
            carte.stat_equipement.sorcellerie = 1;
            carte.texte = "Donne 2 attaque et applique Sorcellerie 1 à la Créature équipée.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_equipement("joueur")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée équipable sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].equipements.length < Jeu.joueur.terrain[n].equipement_max) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            equiper(Jeu.joueur.terrain[cible], carte);
                            effet_pose(carte);
                            enlever(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_equipement("adverse")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].equipements.length >= Jeu.adverse.terrain[best].equipement_max) {
                            best++;
                        }
                        equiper(Jeu.adverse.terrain[best], carte);
                        effet_pose(carte);
                        enlever(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 110:
            carte.nom = "Lance de cuivre";
            carte.type = "Objet";
            carte.familles.push("Équipement", "Arme");
            carte.cout[0] = 4;
            carte.vente[0] = 2;
            carte.stat_equipement.attaque = 3;
            carte.stat_equipement.percee = 2;
            carte.texte = "Donne 3 attaque et applique Percée 2 à la Créature équipée.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_equipement("joueur")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée équipable sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].equipements.length < Jeu.joueur.terrain[n].equipement_max) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            equiper(Jeu.joueur.terrain[cible], carte);
                            effet_pose(carte);
                            enlever(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_equipement("adverse")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].equipements.length >= Jeu.adverse.terrain[best].equipement_max) {
                            best++;
                        }
                        equiper(Jeu.adverse.terrain[best], carte);
                        effet_pose(carte);
                        enlever(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 111:
            carte.nom = "Double lame de cuivre";
            carte.type = "Objet";
            carte.familles.push("Équipement", "Arme");
            carte.cout[0] = 5;
            carte.vente[0] = 2;
            carte.stat_equipement.action_max = 1;
            carte.texte = "Donne 1 action supplémentaire à la Créature équipée.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_equipement("joueur")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée équipable sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].equipements.length < Jeu.joueur.terrain[n].equipement_max) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            equiper(Jeu.joueur.terrain[cible], carte);
                            effet_pose(carte);
                            enlever(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_equipement("adverse")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].equipements.length >= Jeu.adverse.terrain[best].equipement_max) {
                            best++;
                        }
                        equiper(Jeu.adverse.terrain[best], carte);
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
            carte.texte = "Les cartes piochées dans la boutique coûtent uniquement de l'Or.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    deplacer(carte, "joueur", "regions");
                    menu();
                }
                else {
                    return false;
                }
            }
            carte.boutique_generer = function (nouvelle_carte) {
                if ((cout_total(nouvelle_carte) <= Jeu.boutique_niveau * 5 || Jeu.boutique_niveau == 10) && !nouvelle_carte.exclusif && nouvelle_carte.cout[0] == cout_total(nouvelle_carte)) {
                    return true;
                }
                return false;
            }
            break;
        case 114:
            carte.nom = "Golem";
            carte.familles.push("Golem");
            carte.cout[0] = 10;
            carte.cout[4] = 9;
            carte.vente[0] = 5;
            carte.vente[4] = 4;
            carte.attaque = 4;
            carte.defense = 3;
            carte.vie_max = carte.vie = 10;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 115:
            carte.nom = "Minotaure";
            carte.familles.push("Minotaure");
            carte.cout[0] = 5;
            carte.cout[4] = 4;
            carte.vente[0] = 2;
            carte.vente[4] = 2;
            carte.attaque = 5;
            carte.vie_max = carte.vie = 4;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand attaque un Bâtiment : Inflige 4 dégâts au Bâtiment attaqué.";
            carte.effet_attaque = function (defenseur) {
                if (defenseur.type == "Bâtiment") {
                    degats(defenseur, 4);
                }
            }
            break;
        case 116:
            carte.nom = "Centaure";
            carte.familles.push("Centaure");
            carte.cout[0] = 5;
            carte.cout[6] = 4;
            carte.vente[0] = 2;
            carte.vente[6] = 2;
            carte.attaque = 3;
            carte.vie_max = carte.vie = 4;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.rapidite = true;
            break;
        case 117:
            carte.nom = "Archimage";
            carte.type = "Créature";
            carte.familles.push("Humain", "Mage");
            carte.cout[0] = 19;
            carte.vente[0] = 9;
            carte.attaque = 8;
            carte.vie_max = carte.vie = 8;
            carte.action_max = 1;
            carte.sorcellerie = 2;
            carte.equipement_max = 1;
            break;
        case 118:
            carte.nom = "Grand automate";
            carte.type = "Créature";
            carte.familles.push("Machine", "Automate");
            carte.cout[0] = 10;
            carte.cout[7] = 9;
            carte.vente[0] = 5;
            carte.vente[7] = 4;
            carte.attaque = 10;
            carte.vie_max = carte.vie = 10;
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
            carte.cout[0] = 10;
            carte.cout[2] = 9;
            carte.vente[0] = 5;
            carte.vente[2] = 4;
            carte.attaque = 7;
            carte.vie_max = carte.vie = 8;
            carte.action_max = 2;
            carte.equipement_max = 1;
            break;
        case 121:
            carte.nom = "Tir de flèche";
            carte.type = "Action";
            carte.cout[0] = 1;
            carte.texte = "Inflige 1 dégât à une Unité adverse sur le terrain.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_cible("adverse", "terrain")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Unité adverse : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain adverse :</u>");
                                saut();
                                for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        afficher_carte("adverse", "terrain", n);
                                    }
                                    else {
                                        afficher("???");
                                    }
                                    div_fin();
                                    if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            degats(Jeu.adverse.terrain[cible], 1);
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_cible("joueur", "terrain")) {
                        let best = 0;
                        while (Jeu.joueur.terrain[best].camouflage && !Jeu.joueur.terrain[best].silence) {
                            best++;
                        }
                        for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                            if (Jeu.joueur.terrain[n].vie == 1 && (!Jeu.joueur.terrain[n].camouflage || Jeu.joueur.terrain[n].silence)) {
                                best = n;
                            }
                        }
                        degats(Jeu.joueur.terrain[best], 1);
                        deplacer(carte, "adverse", "defausse");
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
            carte.cout[0] = 5;
            carte.cout[2] = 4;
            carte.vente[0] = 2;
            carte.vente[2] = 2;
            carte.attaque = 5;
            carte.vie_max = carte.vie = 5;
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
            carte.cout[0] = 3;
            carte.cout[2] = 2;
            carte.vente[0] = 1;
            carte.vente[2] = 1;
            carte.attaque = 1;
            carte.defense = 1;
            carte.vie_max = carte.vie = 3;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 126:
            carte.nom = "Crabe";
            carte.cout[0] = 3;
            carte.cout[2] = 2;
            carte.vente[0] = 1;
            carte.vente[2] = 1;
            carte.attaque = 1;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.regeneration = 1;
            break;
        case 127:
            carte.nom = "Zombie";
            carte.familles.push("Mort-vivant", "Zombie");
            carte.cout[0] = 3;
            carte.cout[9] = 2;
            carte.vente[0] = 1;
            carte.vente[9] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 4;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 128:
            carte.nom = "Cyclope";
            carte.familles.push("Cyclope");
            carte.cout[0] = 10;
            carte.cout[6] = 9;
            carte.vente[0] = 5;
            carte.vente[6] = 4;
            carte.attaque = 9;
            carte.vie_max = carte.vie = 9;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Crée un <button onclick='javascript:carte_voir_id(129)'>Éclair cyclopéen</button> dans la boutique.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    if (!statistique(carte, "silence")) {
                        let nouvelle_carte = obtenir_carte(129);
                        nouvelle_carte.cache = true;
                        ajouter(nouvelle_carte, "joueur", "boutique");
                    }
                    deplacer(carte, "joueur", "terrain");
                    effet_pose(carte);
                    menu();
                }
                else {
                    deplacer(carte, "adverse", "terrain");
                    effet_pose(carte);
                    return true;
                }
            }
            break;
        case 129:
            carte.nom = "Éclair cyclopéen";
            carte.type = "Objet";
            carte.familles.push("Équipement", "Arme", "Cyclope");
            carte.cout[0] = 5;
            carte.cout[6] = 4;
            carte.vente[0] = 2;
            carte.vente[6] = 2;
            carte.stat_equipement.attaque = 5;
            carte.stat_equipement.percee = 4;
            carte.stat_equipement.sorcellerie = 1;
            carte.exclusif = true;
            carte.texte = "Donne 5 attaque et applique Percée 4 et Sorcellerie 1 à la Créature équipée.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_equipement("joueur")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée équipable sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].equipements.length < Jeu.joueur.terrain[n].equipement_max) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            equiper(Jeu.joueur.terrain[cible], carte);
                            effet_pose(carte);
                            enlever(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_equipement("adverse")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].equipements.length >= Jeu.adverse.terrain[best].equipement_max) {
                            best++;
                        }
                        equiper(Jeu.adverse.terrain[best], carte);
                        effet_pose(carte);
                        enlever(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 130:
            carte.nom = "Porteur de torche";
            carte.familles.push("Gobelin");
            carte.cout[0] = 3;
            carte.cout[1] = 3;
            carte.vente[0] = 2;
            carte.vente[1] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Donne 1 Feu max.";
            carte.effet_pose = function () {
                if (!statistique(carte, "silence")) {
                    Jeu[carte.camp].ressources[1].max++;
                }
                deplacer(carte, carte.camp, "terrain");
                effet_pose(carte);
                menu();
                return true;
            }
            break;
        case 131:
            carte.nom = "Sourcier";
            carte.familles.push("Ondin");
            carte.cout[0] = 3;
            carte.cout[2] = 3;
            carte.vente[0] = 2;
            carte.vente[2] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Donne 1 Eau max.";
            carte.effet_pose = function () {
                if (!statistique(carte, "silence")) {
                    Jeu[carte.camp].ressources[2].max++;
                }
                deplacer(carte, carte.camp, "terrain");
                effet_pose(carte);
                menu();
                return true;
            }
            break;
        case 132:
            carte.nom = "Bûcheron";
            carte.familles.push("Elfe");
            carte.cout[0] = 3;
            carte.cout[3] = 3;
            carte.vente[0] = 2;
            carte.vente[3] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Donne 1 Végétal max.";
            carte.effet_pose = function () {
                if (!statistique(carte, "silence")) {
                    Jeu[carte.camp].ressources[3].max++;
                }
                deplacer(carte, carte.camp, "terrain");
                effet_pose(carte);
                menu();
                return true;
            }
            break;
        case 133:
            carte.nom = "Tailleur de pierre";
            carte.familles.push("Nain");
            carte.cout[0] = 3;
            carte.cout[4] = 3;
            carte.vente[0] = 2;
            carte.vente[4] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Donne 1 Terre max.";
            carte.effet_pose = function () {
                if (!statistique(carte, "silence")) {
                    Jeu[carte.camp].ressources[4].max++;
                }
                deplacer(carte, carte.camp, "terrain");
                effet_pose(carte);
                menu();
                return true;
            }
            break;
        case 134:
            carte.nom = "Manieur d'éventail";
            carte.familles.push("Céleste");
            carte.cout[0] = 3;
            carte.cout[5] = 3;
            carte.vente[0] = 2;
            carte.vente[5] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Donne 1 Air max.";
            carte.effet_pose = function () {
                if (!statistique(carte, "silence")) {
                    Jeu[carte.camp].ressources[5].max++;
                }
                deplacer(carte, carte.camp, "terrain");
                effet_pose(carte);
                menu();
                return true;
            }
            break;
        case 135:
            carte.nom = "Satyre frotte fourrure";
            carte.familles.push("Satyre");
            carte.cout[0] = 3;
            carte.cout[6] = 3;
            carte.vente[0] = 2;
            carte.vente[6] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Donne 1 Foudre max.";
            carte.effet_pose = function () {
                if (!statistique(carte, "silence")) {
                    Jeu[carte.camp].ressources[6].max++;
                }
                deplacer(carte, carte.camp, "terrain");
                effet_pose(carte);
                menu();
                return true;
            }
            break;
        case 136:
            carte.nom = "Mineur";
            carte.familles.push("Gnome");
            carte.cout[0] = 3;
            carte.cout[7] = 3;
            carte.vente[0] = 2;
            carte.vente[7] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Donne 1 Métal max.";
            carte.effet_pose = function () {
                if (!statistique(carte, "silence")) {
                    Jeu[carte.camp].ressources[7].max++;
                }
                deplacer(carte, carte.camp, "terrain");
                effet_pose(carte);
                menu();
                return true;
            }
            break;
        case 137:
            carte.nom = "Arcaniste";
            carte.familles.push("Kalashtar");
            carte.cout[0] = 3;
            carte.cout[8] = 3;
            carte.vente[0] = 2;
            carte.vente[8] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Donne 1 Arcane max.";
            carte.effet_pose = function () {
                if (!statistique(carte, "silence")) {
                    Jeu[carte.camp].ressources[8].max++;
                }
                deplacer(carte, carte.camp, "terrain");
                effet_pose(carte);
                menu();
                return true;
            }
            break;
        case 138:
            carte.nom = "Fossoyeur";
            carte.familles.push("Mort-vivant", "Revenant");
            carte.cout[0] = 3;
            carte.cout[9] = 3;
            carte.vente[0] = 2;
            carte.vente[9] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Donne 1 Mort max.";
            carte.effet_pose = function () {
                if (!statistique(carte, "silence")) {
                    Jeu[carte.camp].ressources[9].max++;
                }
                deplacer(carte, carte.camp, "terrain");
                effet_pose(carte);
                menu();
                return true;
            }
            break;
        case 139:
            carte.nom = "Illuminateur";
            carte.familles.push("Aasimar");
            carte.cout[0] = 3;
            carte.cout[10] = 3;
            carte.vente[0] = 2;
            carte.vente[10] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Donne 1 Lumière max.";
            carte.effet_pose = function () {
                if (!statistique(carte, "silence")) {
                    Jeu[carte.camp].ressources[10].max++;
                }
                deplacer(carte, carte.camp, "terrain");
                effet_pose(carte);
                menu();
                return true;
            }
            break;
        case 140:
            carte.nom = "Souffleur de bougie";
            carte.familles.push("Drow");
            carte.cout[0] = 3;
            carte.cout[11] = 3;
            carte.vente[0] = 2;
            carte.vente[11] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Donne 1 Ombre max.";
            carte.effet_pose = function () {
                if (!statistique(carte, "silence")) {
                    Jeu[carte.camp].ressources[11].max++;
                }
                deplacer(carte, carte.camp, "terrain");
                effet_pose(carte);
                menu();
                return true;
            }
            break;
        case 141:
            carte.nom = "Coupeur de glace";
            carte.familles.push("Goliath");
            carte.cout[0] = 3;
            carte.cout[12] = 3;
            carte.vente[0] = 2;
            carte.vente[12] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Donne 1 Glace max.";
            carte.effet_pose = function () {
                if (!statistique(carte, "silence")) {
                    Jeu[carte.camp].ressources[12].max++;
                }
                deplacer(carte, carte.camp, "terrain");
                effet_pose(carte);
                menu();
                return true;
            }
            break;
        case 142:
            carte.nom = "Cadenas";
            carte.type = "Objet";
            carte.cout[0] = 2;
            carte.vente[0] = 1;
            carte.texte = "Verrouille une carte dans la boutique.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            initialiser();
                            div("main");
                            fonction("Annuler", "menu()");
                            saut(2);
                            afficher(carte.nom);
                            saut();
                            afficher(carte.texte);
                            saut(2);
                            afficher("Choisissez une carte dans la boutique non-verrouillée : ");
                            saut(2);
                            div("", "zone");
                            afficher("<u>Boutique :</u>");
                            saut();
                            for (let n = 0; n < Jeu.joueur.boutique.length; n++) {
                                div("", "carte");
                                div();
                                afficher_carte("joueur", "boutique", n);
                                div_fin();
                                if (!Jeu.joueur.boutique.verrouillage) {
                                    div();
                                    fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                    div_fin();
                                }
                                div_fin();
                            }
                            div_fin();
                            div_fin();
                            div("side", "affichage");
                            div_fin();
                            actualiser();
                            break;
                        case 2:
                            Jeu.joueur.boutique[cible].verrouillage = true;
                            deplacer(carte, "joueur", "defausse");
                            menu();
                            break;
                    }
                }
                else {
                    return false;
                }
            }
            break;
        case 143:
            carte.nom = "Mage de feu";
            carte.type = "Créature";
            carte.familles.push("Gobelin", "Mage");
            carte.cout[0] = 3;
            carte.cout[1] = 2;
            carte.vente[0] = 1;
            carte.vente[1] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.sorcellerie = 1;
            carte.equipement_max = 1;
            break;
        case 144:
            carte.nom = "Mage d'eau";
            carte.type = "Créature";
            carte.familles.push("Ondin", "Mage");
            carte.cout[0] = 3;
            carte.cout[2] = 2;
            carte.vente[0] = 1;
            carte.vente[2] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.sorcellerie = 1;
            carte.equipement_max = 1;
            break;
        case 145:
            carte.nom = "Mage des plantes";
            carte.type = "Créature";
            carte.familles.push("Elfe", "Mage");
            carte.cout[0] = 3;
            carte.cout[3] = 2;
            carte.vente[0] = 1;
            carte.vente[3] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.sorcellerie = 1;
            carte.equipement_max = 1;
            break;
        case 146:
            carte.nom = "Mage de terre";
            carte.type = "Créature";
            carte.familles.push("Nain", "Mage");
            carte.cout[0] = 3;
            carte.cout[4] = 2;
            carte.vente[0] = 1;
            carte.vente[4] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.sorcellerie = 1;
            carte.equipement_max = 1;
            break;
        case 147:
            carte.nom = "Mage d'air";
            carte.type = "Créature";
            carte.familles.push("Céleste", "Mage");
            carte.cout[0] = 3;
            carte.cout[5] = 2;
            carte.vente[0] = 1;
            carte.vente[5] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.sorcellerie = 1;
            carte.equipement_max = 1;
            break;
        case 148:
            carte.nom = "Mage de foudre";
            carte.type = "Créature";
            carte.familles.push("Satyre", "Mage");
            carte.cout[0] = 3;
            carte.cout[6] = 2;
            carte.vente[0] = 1;
            carte.vente[6] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.sorcellerie = 1;
            carte.equipement_max = 1;
            break;
        case 149:
            carte.nom = "Mage des métaux";
            carte.type = "Créature";
            carte.familles.push("Gnome", "Mage");
            carte.cout[0] = 3;
            carte.cout[7] = 2;
            carte.vente[0] = 1;
            carte.vente[7] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.sorcellerie = 1;
            carte.equipement_max = 1;
            break;
        case 150:
            carte.nom = "Mage des arcanes";
            carte.type = "Créature";
            carte.familles.push("Kalashtar", "Mage");
            carte.cout[0] = 3;
            carte.cout[8] = 2;
            carte.vente[0] = 1;
            carte.vente[8] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.sorcellerie = 1;
            carte.equipement_max = 1;
            break;
        case 151:
            carte.nom = "Mage de la mort";
            carte.type = "Créature";
            carte.familles.push("Mort-vivant", "Revenant", "Mage");
            carte.cout[0] = 3;
            carte.cout[9] = 2;
            carte.vente[0] = 1;
            carte.vente[9] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.sorcellerie = 1;
            carte.equipement_max = 1;
            break;
        case 152:
            carte.nom = "Mage de lumière";
            carte.type = "Créature";
            carte.familles.push("Aasimar", "Mage");
            carte.cout[0] = 3;
            carte.cout[10] = 2;
            carte.vente[0] = 1;
            carte.vente[10] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.sorcellerie = 1;
            carte.equipement_max = 1;
            break;
        case 153:
            carte.nom = "Mage des ombres";
            carte.type = "Créature";
            carte.familles.push("Drow", "Mage");
            carte.cout[0] = 3;
            carte.cout[11] = 2;
            carte.vente[0] = 1;
            carte.vente[11] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.sorcellerie = 1;
            carte.equipement_max = 1;
            break;
        case 154:
            carte.nom = "Mage de glace";
            carte.type = "Créature";
            carte.familles.push("Goliath", "Mage");
            carte.cout[0] = 3;
            carte.cout[12] = 2;
            carte.vente[0] = 1;
            carte.vente[12] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.sorcellerie = 1;
            carte.equipement_max = 1;
            break;
        case 155:
            carte.nom = "Création hydraulique";
            carte.type = "Action";
            carte.familles.push("Sort");
            carte.cout[0] = 2;
            carte.cout[2] = 2;
            carte.cout[0] = 1;
            carte.vente[2] = 1;
            carte.texte = "Donne 1 Eau max.<br/>Sorcellerie 2 : Donne 1 Eau max et 2 Eau.";
            carte.effet_pose = function () {
                Jeu[carte.camp].ressources[2].max++;
                if (sorcellerie(carte.camp) >= 2) {
                    Jeu[carte.camp].ressources[2].courant += 2;
                }
                deplacer(carte, carte.camp, "defausse");
                menu();
                return true;
            }
            break;
        case 156:
            carte.nom = "Spores empoisonnées";
            carte.type = "Action";
            carte.familles.push("Sort");
            carte.cout[0] = 2;
            carte.cout[3] = 1;
            carte.vente[0] = 1;
            carte.texte = "Applique Poison 4 à une Créature adverse sur le terrain.<br/>Sorcellerie 2 : Applique Poison 8 à une Créature adverse sur le terrain.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_cible_creature("adverse", "terrain")) {
                                initialiser();
                                div("main");
                                fonction("Retour", "Jeu.joueur.main[" + carte.slot + "].effet_pose(1)");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature adverse sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain adverse :</u>");
                                saut();
                                for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        afficher_carte("adverse", "terrain", n);
                                    }
                                    else {
                                        afficher("???");
                                    }
                                    div_fin();
                                    if (Jeu.adverse.terrain[n].type == "Créature" && !Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            if (sorcellerie("joueur") >= 2) {
                                Jeu.adverse.terrain[cible].poison += 8;
                            }
                            else {
                                Jeu.adverse.terrain[cible].poison += 4;
                            }
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_cible_creature("joueur", "terrain")) {
                        let best = 0;
                        while (Jeu.joueur.terrain[best].type != "Créature" || (Jeu.joueur.terrain[best].camouflage && !Jeu.joueur.terrain[best].silence)) {
                            best++;
                        }
                        if (sorcellerie("adverse") >= 2) {
                            Jeu.joueur.terrain[best].poison += 8;
                        }
                        else {
                            Jeu.joueur.terrain[best].poison += 4;
                        }
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 157:
            carte.nom = "Édification boueuse";
            carte.type = "Action";
            carte.familles.push("Sort");
            carte.cout[0] = 2;
            carte.cout[4] = 2;
            carte.vente[0] = 1;
            carte.vente[4] = 1;
            carte.texte = "Crée un <button onclick='javascript:carte_voir_id(158)'>Mur de boue</button> sur le terrain en première position.<br/>Sorcellerie 4 : Crée un <button onclick='javascript:carte_voir_id(158)'>Mur de boue</button> sur le terrain en première position et lui donne 2 vie.";
            carte.effet_pose = function () {
                let nouvelle_carte = obtenir_carte(158);
                nouvelle_carte.vente = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                if (sorcellerie(carte.camp) >= 2) {
                    nouvelle_carte.vie = nouvelle_carte.vie_max += 2;
                }
                ajouter(nouvelle_carte, carte.camp, "terrain");
                Jeu[carte.camp].terrain.unshift(nouvelle_carte);
                Jeu[carte.camp].terrain.splice(Jeu[carte.camp].terrain.length - 1, 1);
                Jeu[carte.camp].terrain[0].slot = 0;
                for (let n = 1; n < Jeu[carte.camp].terrain.length; n++) {
                    Jeu[carte.camp].terrain[n].slot++;
                }
                deplacer(carte, carte.camp, "defausse");
                menu();
                return true;
            }
            break;
        case 158:
            carte.nom = "Mur de boue";
            carte.type = "Bâtiment";
            carte.familles.push("Mur");
            carte.cout[0] = 2;
            carte.cout[4] = 1;
            carte.vente[0] = 1;
            carte.vie_max = carte.vie = 4;
            break;
        case 159:
            carte.nom = "Coup de vent";
            carte.type = "Action";
            carte.familles.push("Sort");
            carte.cout[0] = 2;
            carte.cout[5] = 2;
            carte.vente[0] = 1;
            carte.vente[5] = 1;
            carte.texte = "Place une Créature adverse sur le terrain dans la main.<br/>Sorcellerie 2 : Place une Créature adverse sur le terrain dans la main et lui inflige 2 dégâts.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_cible_creature("adverse", "terrain")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature adverse sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain adverse :</u>");
                                saut();
                                for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        afficher_carte("adverse", "terrain", n);
                                    }
                                    else {
                                        afficher("???");
                                    }
                                    div_fin();
                                    if (Jeu.adverse.terrain[n].type == "Créature" && !Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            let carte_cible = Jeu.adverse.terrain[cible];
                            deplacer(carte_cible, "adverse", "main");
                            if (sorcellerie("joueur") >= 2) {
                                degats(carte_cible, 2);
                            }
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_cible_creature("joueur", "terrain")) {
                        let best = 0;
                        while (Jeu.joueur.terrain[best].type != "Créature" || (Jeu.joueur.terrain[best].camouflage && !Jeu.joueur.terrain[best].silence)) {
                            best++;
                        }
                        for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                            if (cout_total(Jeu.joueur.terrain[n]) > cout_total(Jeu.joueur.terrain[best]) && Jeu.joueur.terrain[n].type == "Créature" && (!Jeu.joueur.terrain[n].camouflage || Jeu.joueur.terrain[n].silence)) {
                                best = n;
                            }
                        }
                        let carte_cible = Jeu.joueur.terrain[best];
                        deplacer(carte_cible, "joueur", "main");
                        if (sorcellerie("adverse") >= 2) {
                            degats(carte_cible, 2);
                        }
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 160:
            carte.nom = "Éclair";
            carte.type = "Action";
            carte.familles.push("Sort");
            carte.cout[0] = 2;
            carte.cout[6] = 2;
            carte.vente[0] = 1;
            carte.vente[6] = 1;
            carte.texte = "Inflige 6 dégâts à l'Unité adverse en première position sur le terrain.<br/>Sorcellerie 2 : Inflige 10 dégâts à l'Unité adverse en première position sur le terrain.";
            carte.effet_pose = function () {
                if (Jeu[camp_oppose(carte.camp)].terrain.length > 0) {
                    if (sorcellerie(carte.camp) >= 2) {
                        degats(Jeu[camp_oppose(carte.camp)].terrain[0], 6);
                    }
                    else {
                        degats(Jeu[camp_oppose(carte.camp)].terrain[0], 4);
                    }
                    deplacer(carte, carte.camp, "defausse");
                    effet_pose(carte);
                    menu();
                    return true;
                }
                return false;
            }
            break;
        case 161:
            carte.nom = "Peau métallique";
            carte.type = "Action";
            carte.familles.push("Sort");
            carte.cout[0] = 2;
            carte.cout[7] = 2;
            carte.vente[0] = 1;
            carte.vente[7] = 1;
            carte.texte = "Donne 1 attaque et 1 vie à une Créature alliée sur le terrain.<br/>Sorcellerie 3 : Donne 2 attaque et 2 vie à une Créature alliée sur le terrain.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_creature("joueur", "terrain")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature") {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            if (sorcellerie("joueur") >= 2) {
                                Jeu.joueur.terrain[cible].attaque += 2;
                                Jeu.joueur.terrain[cible].vie += 2;
                                Jeu.joueur.terrain[cible].vie_max += 2;
                            }
                            else {
                                Jeu.joueur.terrain[cible].attaque++;
                                Jeu.joueur.terrain[cible].vie++;
                                Jeu.joueur.terrain[cible].vie_max++;
                            }
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_creature("adverse", "terrain")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature") {
                            best++;
                        }
                        if (sorcellerie("adverse") >= 2) {
                            Jeu.adverse.terrain[best].attaque += 2;
                            Jeu.adverse.terrain[best].vie += 2;
                            Jeu.adverse.terrain[best].vie_max += 2;
                        }
                        else {
                            Jeu.adverse.terrain[best].attaque++;
                            Jeu.adverse.terrain[best].vie++;
                            Jeu.adverse.terrain[best].vie_max++;
                        }
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 162:
            carte.nom = "Tir arcanique";
            carte.type = "Action";
            carte.familles.push("Sort");
            carte.cout[0] = 2;
            carte.cout[8] = 1;
            carte.vente[0] = 1;
            carte.texte = "Inflige 2 dégâts à une Unité adverse sur le terrain.<br/>Sorcellerie 2 : Inflige 2 dégâts à deux Unités adverses sur le terrain.";
            carte.effet_pose = function (step, cible1, cible2) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_cible("adverse", "terrain")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une première Unité adverse sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain adverse :</u>");
                                saut();
                                for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        afficher_carte("adverse", "terrain", n);
                                    }
                                    else {
                                        afficher("???");
                                    }
                                    div_fin();
                                    if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            if (sorcellerie("joueur") >= 2) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(1)");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une deuxième Unité adverse sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain adverse :</u>");
                                saut();
                                for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        afficher_carte("adverse", "terrain", n);
                                    }
                                    else {
                                        afficher("???");
                                    }
                                    div_fin();
                                    if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(3," + cible1 + "," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            else {
                                degats(Jeu.adverse.terrain[cible1], 2);
                                deplacer(carte, "joueur", "defausse");
                                effet_pose(carte);
                                menu();
                            }
                            break;
                        case 3:
                            let cible_mort = degats(Jeu.adverse.terrain[cible1], 2).mort;
                            if (cible1 != cible2 || !cible_mort) {
                                if (cible_mort && cible1 < cible2) {
                                    cible2--;
                                }
                                degats(Jeu.adverse.terrain[cible2], 2);
                            }
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_cible("joueur", "terrain")) {
                        let best = 0;
                        while (Jeu.joueur.terrain[best].camouflage && !Jeu.joueur.terrain[best].silence) {
                            best++;
                        }
                        for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                            if ((Jeu.joueur.terrain[n].vie <= 2 && Jeu.joueur.terrain[best].vie > 2) || Jeu.joueur.terrain[n].vie > Jeu.joueur.terrain[best].vie && (!Jeu.joueur.terrain[n].camouflage || Jeu.joueur.terrain[n].silence)) {
                                best = n;
                            }
                        }
                        degats(Jeu.joueur.terrain[best], 2);
                        if (sorcellerie("adverse") >= 2 && Jeu.joueur.terrain.length > 0) {
                            best = 0;
                            while (Jeu.joueur.terrain[best].camouflage && !Jeu.joueur.terrain[best].silence) {
                                best++;
                            }
                            for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                if ((Jeu.joueur.terrain[n].vie <= 2 && Jeu.joueur.terrain[best].vie > 2) || Jeu.joueur.terrain[n].vie > Jeu.joueur.terrain[best].vie && (!Jeu.joueur.terrain[n].camouflage || Jeu.joueur.terrain[n].silence)) {
                                    best = n;
                                }
                            }
                            degats(Jeu.joueur.terrain[best], 2);
                        }
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 163:
            carte.nom = "Réanimation";
            carte.type = "Action";
            carte.familles.push("Sort");
            carte.cout[0] = 2;
            carte.cout[9] = 2;
            carte.vente[0] = 1;
            carte.vente[9] = 1;
            carte.texte = "Place une Créature alliée dans la défausse dans la boutique et la soigne de 1.<br/>Sorcellerie 2 : Place une Créature alliée dans la défausse dans la boutique et la soigne de 1 et diminue son coût en Or de 2.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_creature("joueur", "defausse")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée dans la défausse : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Défausse :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.defausse.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "defausse", n);
                                    div_fin();
                                    if (Jeu.joueur.defausse[n].type == "Créature") {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            if (sorcellerie("joueur") >= 2) {
                                Jeu.joueur.defausse[cible].cout[0] -= 2;
                                if (Jeu.joueur.defausse[cible].cout[0] < 0) {
                                    Jeu.joueur.defausse[cible].cout[0] = 0;
                                }
                            }
                            Jeu.joueur.defausse[cible].vie = 1;
                            deplacer(Jeu.joueur.defausse[cible], "joueur", "boutique");
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    return false;
                }
            }
            break;
        case 164:
            carte.nom = "Rayon sacré";
            carte.type = "Action";
            carte.familles.push("Sort");
            carte.cout[0] = 2;
            carte.cout[10] = 2;
            carte.vente[0] = 1;
            carte.vente[10] = 1;
            carte.texte = "Soigne 2 à une Créature alliée sur le terrain.<br/>ou<br/>Inflige 2 dégâts à une Créature adverse sur le terrain.<br/>Sorcellerie 2 : Soigne 4 à une Créature alliée sur le terrain.<br/>ou<br/>Inflige 4 dégâts à une Créature adverse sur le terrain.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            initialiser();
                            div("main");
                            fonction("Annuler", "menu()");
                            saut(2);
                            afficher(carte.nom);
                            saut();
                            afficher(carte.texte);
                            saut(2);
                            afficher("Choisissez un effet : ");
                            saut(2);
                            if (sorcellerie("joueur") >= 2) {
                                fonction("Soigne 4 à une Créature alliée sur le terrain", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2)");
                                saut();
                                afficher("ou");
                                saut();
                                fonction("Inflige 4 dégâts à une Créature adverse sur le terrain", "Jeu.joueur.main[" + carte.slot + "].effet_pose(4)");
                            }
                            else {
                                fonction("Soigne 2 à une Créature alliée sur le terrain", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2)");
                                saut();
                                afficher("ou");
                                saut();
                                fonction("Inflige 2 dégâts à une Créature adverse sur le terrain", "Jeu.joueur.main[" + carte.slot + "].effet_pose(4)");
                            }
                            div_fin();
                            div("side", "affichage");
                            div_fin();
                            actualiser();
                            break;
                        case 2:
                            if (verifier_soin_creature("joueur")) {
                                initialiser();
                                div("main");
                                fonction("Retour", "Jeu.joueur.main[" + carte.slot + "].effet_pose(1)");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                if (sorcellerie("joueur") >= 2) {
                                    afficher("Soigne 4 à une Créature alliée sur le terrain.");
                                }
                                else {
                                    afficher("Soigne 2 à une Créature alliée sur le terrain.");
                                }
                                saut(2);
                                afficher("Choisissez une Créature alliée sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].vie < Jeu.joueur.terrain[n].vie_max) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(3," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 3:
                            if (sorcellerie("joueur") >= 2) {
                                soin(Jeu.joueur.terrain[cible], 4);
                            }
                            else {
                                soin(Jeu.joueur.terrain[cible], 2);
                            }
                            effet_pose(carte);
                            enlever(carte);
                            menu();
                            break;
                        case 4:
                            if (verifier_cible_creature("adverse", "terrain")) {
                                initialiser();
                                div("main");
                                fonction("Retour", "Jeu.joueur.main[" + carte.slot + "].effet_pose(1)");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                if (sorcellerie("joueur") >= 2) {
                                    afficher("Inflige 4 dégâts à une Créature adverse sur le terrain.");
                                }
                                else {
                                    afficher("Inflige 2 dégâts à une Créature adverse sur le terrain.");
                                }
                                saut(2);
                                afficher("Choisissez une Créature adverse sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain adverse :</u>");
                                saut();
                                for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        afficher_carte("adverse", "terrain", n);
                                    }
                                    else {
                                        afficher("???");
                                    }
                                    div_fin();
                                    if (Jeu.adverse.terrain[n].type == "Créature" && !Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(5," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 5:
                            if (sorcellerie("joueur") >= 2) {
                                degats(Jeu.adverse.terrain[cible], 4);
                            }
                            else {
                                degats(Jeu.adverse.terrain[cible], 2);
                            }
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_soin_creature("adverse")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].vie >= Jeu.adverse.terrain[best].vie_max) {
                            best++;
                        }
                        if (sorcellerie("adverse") >= 2) {
                            soin(Jeu.adverse.terrain[best], 4);
                        }
                        else {
                            soin(Jeu.adverse.terrain[best], 2);
                        }
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    else if (verifier_cible_creature("joueur", "terrain")) {
                        let best = 0;
                        while (Jeu.joueur.terrain[best].type != "Créature" || (Jeu.joueur.terrain[best].camouflage && !Jeu.joueur.terrain[best].silence)) {
                            best++;
                        }
                        for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                            if ((Jeu.joueur.terrain[n].vie <= 4 && sorcellerie("adverse") >= 2) || (Jeu.joueur.terrain[n].vie <= 2 && sorcellerie("adverse") < 2) && Jeu.joueur.terrain[n].type == "Créature" && (!Jeu.joueur.terrain[n].camouflage || Jeu.joueur.terrain[n].silence)) {
                                best = n;
                            }
                        }
                        if (sorcellerie("adverse") >= 2) {
                            degats(Jeu.joueur.terrain[best], 4);
                        }
                        else {
                            degats(Jeu.joueur.terrain[best], 2);
                        }
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 165:
            carte.nom = "Transfusion";
            carte.type = "Action";
            carte.familles.push("Sort");
            carte.cout[0] = 2;
            carte.cout[11] = 1;
            carte.vente[0] = 1;
            carte.texte = "Inflige 1 dégât à une Créature adverse sur le terrain et soigne 1 à une Créature alliée sur le terrain.<br/>Sorcellerie 2 : Inflige 2 dégâts à une Créature adverse sur le terrain et soigne 2 à une Créature alliée sur le terrain.";
            carte.effet_pose = function (step, cible1, cible2) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_cible_creature("adverse", "terrain")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature adverse sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain adverse :</u>");
                                saut();
                                for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        afficher_carte("adverse", "terrain", n);
                                    }
                                    else {
                                        afficher("???");
                                    }
                                    div_fin();
                                    if (Jeu.adverse.terrain[n].type == "Créature" && !Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            if (verifier_soin_creature("joueur")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(1)");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature") {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(3," + cible1 + "," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            else {
                                if (sorcellerie("joueur") >= 2) {
                                    degats(Jeu.adverse.terrain[cible1], 2);
                                }
                                else {
                                    degats(Jeu.adverse.terrain[cible1], 1);
                                }
                                deplacer(carte, "joueur", "defausse");
                                effet_pose(carte);
                                menu();
                            }
                            break;
                        case 3:
                            if (sorcellerie("joueur") >= 2) {
                                degats(Jeu.adverse.terrain[cible1], 2);
                                soin(Jeu.joueur.terrain[cible2], 2);
                            }
                            else {
                                degats(Jeu.adverse.terrain[cible1], 1);
                                soin(Jeu.joueur.terrain[cible2], 1);
                            }
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_cible_creature("joueur", "terrain")) {
                        let best = 0;
                        while (Jeu.joueur.terrain[best].type != "Créature" || (Jeu.joueur.terrain[best].camouflage && !Jeu.joueur.terrain[best].silence)) {
                            best++;
                        }
                        for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                            if (Jeu.joueur.terrain[n].vie <= 2 && Jeu.joueur.terrain[best].type == "Créature" && (!Jeu.joueur.terrain[n].camouflage || Jeu.joueur.terrain[n].silence)) {
                                best = n;
                            }
                        }
                        if (sorcellerie("adverse") >= 2) {
                            degats(Jeu.joueur.terrain[best], 2);
                        }
                        else {
                            degats(Jeu.joueur.terrain[best], 1);
                        }
                        if (verifier_soin_creature("adverse")) {
                            best = 0;
                            while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].vie >= Jeu.adverse.terrain[best].vie_max) {
                                best++;
                            }
                            for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                                if (Jeu.adverse.terrain[n].vie < Jeu.adverse.terrain[n].vie_max && Jeu.adverse.terrain[best].type == "Créature") {
                                    best = n;
                                }
                            }
                            if (sorcellerie("adverse") >= 2) {
                                soin(Jeu.adverse.terrain[best], 2);
                            }
                            else {
                                soin(Jeu.adverse.terrain[best], 1);
                            }
                        }
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 166:
            carte.nom = "Gelure";
            carte.type = "Action";
            carte.familles.push("Sort");
            carte.cout[0] = 2;
            carte.cout[12] = 2;
            carte.vente[0] = 1;
            carte.vente[12] = 1;
            carte.texte = "Applique Gel 1 à une Unité adverse sur le terrain.<br/>Sorcellerie 3 : Applique Gel 2 à une Unité adverse sur le terrain.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_cible("adverse", "terrain")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Unité adverse sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain adverse :</u>");
                                saut();
                                for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        afficher_carte("adverse", "terrain", n);
                                    }
                                    else {
                                        afficher("???");
                                    }
                                    div_fin();
                                    if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            if (sorcellerie("joueur") >= 2 && Jeu.adverse.terrain[cible].gel < 2) {
                                Jeu.adverse.terrain[cible].gel = 2;
                            }
                            else if (Jeu.adverse.terrain[cible].gel < 1) {
                                Jeu.adverse.terrain[cible].gel = 1;
                            }
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_cible("joueur", "terrain")) {
                        let best = 0;
                        while (Jeu.joueur.terrain[best].camouflage && !Jeu.joueur.terrain[best].silence) {
                            best++;
                        }
                        for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                            if (!Jeu.joueur.terrain[n].etourdissement && Jeu.joueur.terrain[n].gel < 1 && Jeu.joueur.terrain[n].action_max > 0 && (!Jeu.joueur.terrain[n].camouflage || Jeu.joueur.terrain[n].silence)) {
                                best = n;
                            }
                        }
                        if (sorcellerie("adverse") >= 2 && Jeu.joueur.terrain[best].gel < 2) {
                            Jeu.joueur.terrain[best].gel = 2;
                        }
                        else if (Jeu.adverse.terrain[cible].gel < 1) {
                            Jeu.joueur.terrain[best].gel = 1;
                        }
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 167:
            carte.nom = "Lion";
            carte.familles.push("Bête", "Félin");
            carte.cout[0] = 17;
            carte.cout[1] = 16;
            carte.vente[0] = 8;
            carte.vente[1] = 8;
            carte.attaque = 5;
            carte.vie_max = carte.vie = 5;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Donne 1 attaque et 1 vie à toutes les Créatures Bête alliées sur le terrain.";
            carte.effet_pose = function () {
                if (!statistique(carte, "silence")) {
                    for (let n = 0; n < Jeu[carte.camp].terrain.length; n++) {
                        if (Jeu[carte.camp].terrain[n].type == "Créature" && Jeu[carte.camp].terrain[n].familles.includes("Bête")) {
                            Jeu[carte.camp].terrain[n].attaque++;
                            Jeu[carte.camp].terrain[n].vie_max++;
                            Jeu[carte.camp].terrain[n].vie++;
                        }
                    }
                }
                deplacer(carte, carte.camp, "terrain");
                effet_pose(carte);
                menu();
                return true;
            }
            break;
        case 168:
            carte.nom = "Tour de mage";
            carte.type = "Bâtiment";
            carte.cout[0] = 5;
            carte.vente[0] = 2;
            carte.vie_max = carte.vie = 4;
            carte.sorcellerie = 1;
            break;
        case 169:
            carte.nom = "Ours des montagnes";
            carte.familles.push("Bête");
            carte.cout[0] = 5;
            carte.cout[4] = 4;
            carte.vente[0] = 2;
            carte.vente[4] = 2;
            carte.attaque = 5;
            carte.vie_max = carte.vie = 5;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 170:
            carte.nom = "Ours polaire";
            carte.familles.push("Bête");
            carte.cout[0] = 5;
            carte.cout[12] = 4;
            carte.vente[0] = 2;
            carte.vente[12] = 2;
            carte.attaque = 5;
            carte.vie_max = carte.vie = 5;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 171:
            carte.nom = "Loup des neiges";
            carte.familles.push("Bête");
            carte.cout[0] = 2;
            carte.cout[12] = 1;
            carte.vente[0] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 172:
            carte.nom = "Serpent";
            carte.familles.push("Reptile");
            carte.cout[0] = 2;
            carte.vente[0] = 1;
            carte.attaque = 1;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 173:
            carte.nom = "Caméléon";
            carte.familles.push("Reptile");
            carte.cout[0] = 2;
            carte.cout[3] = 2;
            carte.vente[0] = 1;
            carte.vente[3] = 1;
            carte.attaque = 1;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.camouflage = true;
            break;
        case 174:
            carte.nom = "Vipère";
            carte.familles.push("Reptile");
            carte.cout[0] = 3;
            carte.vente[0] = 1;
            carte.attaque = 1;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand attaque : applique Poison 2 à la Créature attaquée.";
            carte.effet_attaque = function (defenseur) {
                if (defenseur.type == "Créature") {
                    defenseur.poison += 2;
                }
            }
            break;
        case 175:
            carte.nom = "Chat";
            carte.familles.push("Bête", "Félin");
            carte.cout[0] = 2;
            carte.vente[0] = 1;
            carte.attaque = 1;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 176:
            carte.nom = "Chat du mage";
            carte.familles.push("Bête", "Félin");
            carte.cout[0] = 4;
            carte.vente[0] = 2;
            carte.attaque = 1;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.sorcellerie = 1;
            carte.description = "Les mages sont habitués à avoir un familier à leurs côtés. Ces derniers peuvent avoir des capacités magiques par nature mais également en dévelloper à force d'expérience ou de s'exposer à son maître.";
            break;
        case 177:
            carte.nom = "Cerf";
            carte.familles.push("Bête");
            carte.cout[0] = 3;
            carte.cout[3] = 3;
            carte.vente[0] = 2;
            carte.vente[3] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.rapidite = true;
            break;
        case 178:
            carte.nom = "Sanglier";
            carte.familles.push("Bête");
            carte.cout[0] = 3;
            carte.cout[3] = 2;
            carte.vente[0] = 1;
            carte.vente[3] = 1;
            carte.attaque = 3;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.percee = 2;
            break;
        case 179:
            carte.nom = "Voyage";
            carte.type = "Action";
            carte.cout[0] = 9;
            carte.vente[0] = 4;
            carte.texte = "Pioche 3 Régions dans la boutique.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    let verifier = false;
                    for (let n = 0; n < Jeu.NOMBRE_CARTE; n++) {
                        if (Jeu.joueur.regions[Jeu.region_active].boutique_generer(obtenir_carte(n)) && obtenir_carte(n).type == "Région") {
                            verifier = true;
                        }
                    }
                    if (verifier) {
                        for (let n = 0; n < 3; n++) {
                            let nouvelle_carte = boutique_generer();
                            while (nouvelle_carte.type != "Région") {
                                nouvelle_carte = boutique_generer();
                            }
                            pioche("joueur", nouvelle_carte);
                        }
                        deplacer(carte, "joueur", "defausse");
                        effet_pose(carte);
                        menu();
                    }
                }
                else {
                    return false;
                }
            }
            break;
        case 180:
            carte.nom = "Pyromancien";
            carte.familles.push("Gobelin");
            carte.cout[0] = 6;
            carte.cout[1] = 5;
            carte.vente[0] = 3;
            carte.vente[1] = 2;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand attaque : Inflige 4 dégâts à l'Unité attaquée.";
            carte.effet_attaque = function (defenseur) {
                Jeu.combat.defenseur_mort = degats(defenseur, 4).mort;
            }
            break;
        case 181:
            carte.nom = "Cryomancien";
            carte.familles.push("Goliath");
            carte.cout[0] = 5;
            carte.cout[12] = 4;
            carte.vente[0] = 4;
            carte.vente[12] = 3;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand attaque : Applique Gel 1 à l'Unité attaquée.";
            carte.effet_attaque = function (defenseur) {
                if (defenseur.gel < 1) {
                    defenseur.gel = 1;
                }
            }
            break;
        case 182:
            carte.nom = "Aquomancien";
            carte.familles.push("Ondin");
            carte.cout[0] = 6;
            carte.cout[2] = 5;
            carte.vente[0] = 3;
            carte.vente[2] = 2;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand joue : Ajoute 1 Eau en réserve.";
            carte.effet_action = function () {
                Jeu[carte.camp].ressources[2].reserve++;
            }
            break;
        case 183:
            carte.nom = "Électromancien";
            carte.familles.push("Satyre");
            carte.cout[0] = 5;
            carte.cout[6] = 4;
            carte.vente[0] = 3;
            carte.vente[6] = 2;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand attaque : Inflige 2 dégât aux Unités en avant et en arrière de l'Unité attaquée.";
            carte.effet_attaque = function (defenseur) {
                if (defenseur.slot > 0) {
                    degats(Jeu[defenseur.camp].terrain[defenseur.slot - 1], 1);
                }
                if (defenseur.slot < Jeu[defenseur.camp].terrain.length) {
                    degats(Jeu[defenseur.camp].terrain[defenseur.slot + 1], 1);
                }
            }
            break;
        case 184:
            carte.nom = "Phitomancien";
            carte.familles.push("Elfe");
            carte.cout[0] = 6;
            carte.cout[3] = 5;
            carte.vente[0] = 3;
            carte.vente[3] = 2;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand joue : Se soigne de 1.<br/>Quand attaque : Applique Poison 4 à la Créature attaquée.";
            carte.effet_action = function () {
                if (carte.vie < carte.vie_max) {
                    soin(carte, 1);
                }
            }
            carte.effet_attaque = function (defenseur) {
                if (defenseur.type == "Créature") {
                    defenseur.poison += 4;
                }
            }
            break;
        case 185:
            carte.nom = "Géomancien";
            carte.familles.push("Nain");
            carte.cout[0] = 8;
            carte.cout[4] = 7;
            carte.vente[0] = 4;
            carte.vente[4] = 3;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand joue : Crée un <button onclick='javascript:carte_voir_id(158)'>Mur de boue</button> sur le terrain en première position.";
            carte.effet_action = function () {
                let nouvelle_carte = obtenir_carte(158);
                nouvelle_carte.vente = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                ajouter(nouvelle_carte, carte.camp, "terrain");
                Jeu[carte.camp].terrain.unshift(nouvelle_carte);
                Jeu[carte.camp].terrain.splice(Jeu[carte.camp].terrain.length - 1, 1);
                Jeu[carte.camp].terrain[0].slot = 0;
                for (let n = 1; n < Jeu[carte.camp].terrain.length; n++) {
                    Jeu[carte.camp].terrain[n].slot++;
                }
            }
            break;
        case 186:
            carte.nom = "Aéromancien";
            carte.familles.push("Céleste");
            carte.cout[0] = 6;
            carte.cout[5] = 5;
            carte.vente[0] = 3;
            carte.vente[5] = 2;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand joue : Diminue le coût d'amélioration de la boutique de 1 Or.";
            carte.effet_action = function () {
                Jeu.boutique_amelioration--;
                if (Jeu.boutique_amelioration < 0) {
                    Jeu.boutique_amelioration = 0;
                }
            }
            break;
        case 187:
            carte.nom = "Métalomancien";
            carte.familles.push("Gnome");
            carte.cout[0] = 6;
            carte.cout[7] = 5;
            carte.vente[0] = 3;
            carte.vente[7] = 2;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand joue : Se donne 3 défense jusqu'à la fin du tour de combat.";
            carte.effet_action = function () {
                carte.stat_tour.defense += 3;
            }
            break;
        case 188:
            carte.nom = "Arcanomencien";
            carte.familles.push("Kalashtar");
            carte.cout[0] = 6;
            carte.cout[8] = 5;
            carte.vente[0] = 3;
            carte.vente[8] = 2;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand attaque : Inflige 2 fois 2 dégât à une Unité adverse aléatoire sur le terrain.";
            carte.effet_attaque = function (defenseur) {
                let n = 1;
                while (Jeu[defenseur.camp].terrain.length > 0 && n <= 2) {
                    n++;
                    let cible = Jeu[defenseur.camp].terrain[parseInt(Math.random() * Jeu[defenseur.camp].terrain.length)];
                    if (cible.slot == defenseur.slot) {
                        Jeu.combat.defenseur_mort = degats(cible, 1).mort;
                    }
                    else {
                        degats(cible, 1);
                    }
                }
            }
            break;
        case 189:
            carte.nom = "Luxomencien";
            carte.familles.push("Aasimar");
            carte.cout[0] = 6;
            carte.cout[10] = 5;
            carte.vente[0] = 3;
            carte.vente[10] = 2;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand joue : Soigne 2 à la Créature alliée la plus en avant dont la vie est plus basse que sa vie maximale.";
            carte.effet_action = function () {
                if (verifier_soin_creature(carte.camp)) {
                    let best = 0;
                    while (Jeu[carte.camp].terrain[best].type != "Créature" || Jeu[carte.camp].terrain[best].vie == Jeu[carte.camp].terrain[best].vie_max) {
                        best++;
                    }
                    soin(Jeu[carte.camp].terrain[best], 2);
                }
            }
            break;
        case 190:
            carte.nom = "Ombromancien";
            carte.familles.push("Drow");
            carte.cout[0] = 8;
            carte.cout[11] = 7;
            carte.vente[0] = 4;
            carte.vente[11] = 3;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand joue : Applique Camouflage à la Créature alliée sur le terrain la plus en avant et ne possèdant pas Camouflage.";
            carte.effet_action = function () {
                let verifier = false;
                for (let n = 0; n < Jeu[carte.camp].terrain.length; n++) {
                    if (Jeu[carte.camp].terrain[n].type == "Créature" && !Jeu[carte.camp].terrain[n].camouflage) {
                        verifier = true;
                    }
                }
                if (verifier) {
                    let best = 0;
                    while (Jeu[carte.camp].terrain[best].type != "Créature" || Jeu[carte.camp].terrain[best].camouflage) {
                        best++;
                    }
                    Jeu[carte.camp].terrain[best].camouflage = true;
                }
            }
            break;
        case 191:
            carte.nom = "Illithid";
            carte.familles.push("Illithid");
            carte.cout[0] = 10;
            carte.cout[8] = 9;
            carte.vente[0] = 5;
            carte.vente[8] = 4;
            carte.attaque = 8;
            carte.vie_max = carte.vie = 8;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Place une Créature adverse sur le terrain dont la vie est de 5 ou moins sur le terrain allié.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            let verifier = false;
                            for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                                if (Jeu.adverse.terrain[n].vie <= 5 && Jeu.adverse.terrain[n].type == "Créature" && !Jeu.adverse.terrain[n].camouflage) {
                                    verifier = true;
                                }
                            }
                            if (verifier && !statistique(carte, "silence")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature adverse sur le terrain dont le coût total est de 4 ou moins : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain adverse :</u>");
                                saut();
                                for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        afficher_carte("adverse", "terrain", n);
                                    }
                                    else {
                                        afficher("???");
                                    }
                                    div_fin();
                                    if (Jeu.adverse.terrain[n].type == "Créature" && Jeu.adverse.terrain[n].vie <= 5 && !Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin()
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            else {
                                deplacer(carte, "joueur", "terrain");
                                effet_pose(carte);
                                menu();
                            }
                            break;
                        case 2:
                            deplacer(carte, "joueur", "terrain");
                            deplacer(Jeu.adverse.terrain[cible], "joueur", "terrain");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    deplacer(carte, "adverse", "terrain");
                    let verifier = false;
                    for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                        if (Jeu.joueur.terrain[n].vie <= 5 && Jeu.joueur.terrain[n].type == "Créature" && (!Jeu.joueur.terrain[n].camouflage || Jeu.joueur.terrain[n].silence)) {
                            verifier = true;
                        }
                    }
                    if (verifier && !statistique(carte, "silence")) {
                        let best = 0;
                        while (Jeu.joueur.terrain[best].type != "Créature" && Jeu.joueur.terrain[best].vie <= 5 && (!Jeu.joueur.terrain[n].camouflage || Jeu.joueur.terrain[n].silence)) {
                            best++;
                        }
                        for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                            if (Jeu.joueur.terrain[n].vie > Jeu.joueur.terrain[best].vie && Jeu.joueur.terrain[best].vie <= 5 && Jeu.joueur.terrain[best].type == "Créature" && (!Jeu.joueur.terrain[n].camouflage || Jeu.joueur.terrain[n].silence)) {
                                best = n;
                            }
                        }
                        deplacer(Jeu.joueur.terrain[best], "adverse", "terrain");
                    }
                    effet_pose(carte);
                    return true;
                }
            }
            break;
        case 192:
            carte.nom = "Épée à louer";
            carte.type = "Objet";
            carte.familles.push("Équipement", "Arme");
            carte.cout[0] = 4;
            carte.vente[0] = 2;
            carte.stat_equipement.attaque = 9;
            carte.temporaire = true;
            carte.texte = "Donne 9 attaque à la Créature équipée.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_equipement("joueur")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée équipable sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].equipements.length < Jeu.joueur.terrain[n].equipement_max) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            equiper(Jeu.joueur.terrain[cible], carte);
                            effet_pose(carte);
                            enlever(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_equipement("adverse")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].equipements.length >= Jeu.adverse.terrain[best].equipement_max) {
                            best++;
                        }
                        equiper(Jeu.adverse.terrain[best], carte);
                        effet_pose(carte);
                        enlever(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 193:
            carte.nom = "Rubis";
            carte.type = "Objet";
            carte.familles.push("Joyau");
            carte.cout[0] = 2;
            carte.vente[1] = 1;
            carte.texte = "Donne 1 Feu en réserve.";
            carte.effet_pose = function () {
                Jeu[carte.camp].ressources[1].reserve++;
                deplacer(carte, carte.camp, "defausse");
                menu();
                return true;
            }
            break;
        case 194:
            carte.nom = "Azurite";
            carte.type = "Objet";
            carte.familles.push("Joyau");
            carte.cout[0] = 2;
            carte.vente[2] = 1;
            carte.texte = "Donne 1 Eau en réserve.";
            carte.effet_pose = function () {
                Jeu[carte.camp].ressources[2].reserve++;
                deplacer(carte, carte.camp, "defausse");
                menu();
                return true;
            }
            break;
        case 195:
            carte.nom = "Émeraude";
            carte.type = "Objet";
            carte.familles.push("Joyau");
            carte.cout[0] = 2;
            carte.vente[3] = 1;
            carte.texte = "Donne 1 Végétal en réserve.";
            carte.effet_pose = function () {
                Jeu[carte.camp].ressources[3].reserve++;
                deplacer(carte, carte.camp, "defausse");
                menu();
                return true;
            }
            break;
        case 196:
            carte.nom = "Topaze";
            carte.type = "Objet";
            carte.familles.push("Joyau");
            carte.cout[0] = 2;
            carte.vente[4] = 1;
            carte.texte = "Donne 1 Terre en réserve.";
            carte.effet_pose = function () {
                Jeu[carte.camp].ressources[4].reserve++;
                deplacer(carte, carte.camp, "defausse");
                menu();
                return true;
            }
            break;
        case 197:
            carte.nom = "Saphir";
            carte.type = "Objet";
            carte.familles.push("Joyau");
            carte.cout[0] = 2;
            carte.vente[5] = 1;
            carte.texte = "Donne 1 Air en réserve.";
            carte.effet_pose = function () {
                Jeu[carte.camp].ressources[5].reserve++;
                deplacer(carte, carte.camp, "defausse");
                menu();
                return true;
            }
            break;
        case 198:
            carte.nom = "Quartz";
            carte.type = "Objet";
            carte.familles.push("Joyau");
            carte.cout[0] = 2;
            carte.vente[6] = 1;
            carte.texte = "Donne 1 Foudre en réserve.";
            carte.effet_pose = function () {
                Jeu[carte.camp].ressources[6].reserve++;
                deplacer(carte, carte.camp, "defausse");
                menu();
                return true;
            }
            break;
        case 199:
            carte.nom = "Bronzite";
            carte.type = "Objet";
            carte.familles.push("Joyau");
            carte.cout[0] = 2;
            carte.vente[7] = 1;
            carte.texte = "Donne 1 Métal en réserve.";
            carte.effet_pose = function () {
                Jeu[carte.camp].ressources[7].reserve++;
                deplacer(carte, carte.camp, "defausse");
                menu();
                return true;
            }
            break;
        case 200:
            carte.nom = "Améthyste";
            carte.type = "Objet";
            carte.familles.push("Joyau");
            carte.cout[0] = 2;
            carte.vente[8] = 1;
            carte.texte = "Donne 1 Arcane en réserve.";
            carte.effet_pose = function () {
                Jeu[carte.camp].ressources[8].reserve++;
                deplacer(carte, carte.camp, "defausse");
                menu();
                return true;
            }
            break;
        case 201:
            carte.nom = "Onyx";
            carte.type = "Objet";
            carte.familles.push("Joyau");
            carte.cout[0] = 2;
            carte.vente[9] = 1;
            carte.texte = "Donne 1 Mort en réserve.";
            carte.effet_pose = function () {
                Jeu[carte.camp].ressources[9].reserve++;
                deplacer(carte, carte.camp, "defausse");
                menu();
                return true;
            }
            break;
        case 202:
            carte.nom = "Perle";
            carte.type = "Objet";
            carte.familles.push("Joyau");
            carte.cout[0] = 2;
            carte.vente[10] = 1;
            carte.texte = "Donne 1 Lumière en réserve.";
            carte.effet_pose = function () {
                Jeu[carte.camp].ressources[10].reserve++;
                deplacer(carte, carte.camp, "defausse");
                menu();
                return true;
            }
            break;
        case 203:
            carte.nom = "Obsidienne";
            carte.type = "Objet";
            carte.familles.push("Joyau");
            carte.cout[0] = 2;
            carte.vente[11] = 1;
            carte.texte = "Donne 1 Ombre en réserve.";
            carte.effet_pose = function () {
                Jeu[carte.camp].ressources[11].reserve++;
                deplacer(carte, carte.camp, "defausse");
                menu();
                return true;
            }
            break;
        case 204:
            carte.nom = "Aigue Marine";
            carte.type = "Objet";
            carte.familles.push("Joyau");
            carte.cout[0] = 2;
            carte.vente[12] = 1;
            carte.texte = "Donne 1 Glace en réserve.";
            carte.effet_pose = function () {
                Jeu[carte.camp].ressources[12].reserve++;
                deplacer(carte, carte.camp, "defausse");
                menu();
                return true;
            }
            break;
        case 205:
            carte.nom = "Squelette mage";
            carte.familles.push("Mort-vivant", "Squelette");
            carte.cout[0] = 2;
            carte.cout[9] = 2;
            carte.vente[0] = 1;
            carte.vente[9] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 1;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.sorcellerie = 1;
            break;
        case 206:
            carte.nom = "Archer squelette";
            carte.familles.push("Mort-vivant", "Squelette");
            carte.cout[0] = 2;
            carte.cout[9] = 2;
            carte.vente[0] = 1;
            carte.vente[9] = 1;
            carte.attaque = 3;
            carte.vie_max = carte.vie = 1;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.portee = true;
            break;
        case 207:
            carte.nom = "Soldat";
            carte.familles.push("Humain");
            carte.cout[0] = 5;
            carte.vente[0] = 2;
            carte.attaque = 3;
            carte.vie_max = carte.vie = 3;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 208:
            carte.nom = "Liche";
            carte.type = "Créature";
            carte.familles.push("Mort-vivant", "Liche");
            carte.cout[0] = 11;
            carte.cout[8] = 4;
            carte.cout[9] = 4;
            carte.vente[0] = 5;
            carte.vente[8] = 2;
            carte.vente[9] = 2;
            carte.attaque = 10;
            carte.vie_max = carte.vie = 10;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Détruis Créature alliée sur le terrain et se donne 1 attaque et 1 vie.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_creature("joueur", "terrain") && !statistique(carte, "silence")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature") {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            else {
                                deplacer(carte, "joueur", "terrain");
                                effet_pose(carte);
                                menu();
                            }
                            break;
                        case 2:
                            mort(Jeu.joueur.terrain[cible]);
                            carte.attaque++;
                            carte.vie++;
                            carte.vie_max++;
                            deplacer(carte, "joueur", "terrain");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_creature("adverse", "terrain") && !statistique(carte, "silence")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature") {
                            best++;
                        }
                        for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                            if (Jeu.adverse.terrain[n].vie < Jeu.adverse.terrain[best].vie && Jeu.adverse.terrain[n].type == "Créature") {
                                best = n;
                            }
                        }
                        mort(Jeu.adverse.terrain[best]);
                        carte.attaque++;
                        carte.vie++;
                        carte.vie_max++;
                    }
                    deplacer(carte, "adverse", "terrain");
                    effet_pose(carte);
                    return true;
                }
            }
            break;
        case 209:
            carte.nom = "Élimination";
            carte.type = "Action";
            carte.cout[0] = 20;
            carte.vente[0] = 10;
            carte.texte = "Détruit une Créature adverse sur le terrain.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_cible_creature("adverse", "terrain") && !statistique(carte, "silence")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature adverse sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain adverse :</u>");
                                saut();
                                for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        afficher_carte("adverse", "terrain", n);
                                    }
                                    else {
                                        afficher("???");
                                    }
                                    div_fin();
                                    if (Jeu.adverse.terrain[n].type == "Créature" && !Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            mort(Jeu.adverse.terrain[cible]);
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_cible_creature("joueur", "terrain") && !statistique(carte, "silence")) {
                        let best = 0;
                        while (Jeu.joueur.terrain[best].type != "Créature" || (Jeu.joueur.terrain[best].camouflage && !Jeu.joueur.terrain[best].silence)) {
                            best++;
                        }
                        for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                            if (Jeu.joueur.terrain[n].vie > Jeu.joueur.terrain[best].vie && Jeu.joueur.terrain[best].type == "Créature" && (!Jeu.joueur.terrain[n].camouflage || Jeu.joueur.terrain[n].silence)) {
                                best = n;
                            }
                        }
                        mort(Jeu.joueur.terrain[best]);
                    }
                    deplacer(carte, "adverse", "defausse");
                    effet_pose(carte);
                    return true;
                }
            }
            break;
        case 210:
            carte.nom = "Assassinat";
            carte.type = "Action";
            carte.cout[0] = 10;
            carte.vente[0] = 5;
            carte.texte = "Détruit une Créature adverse sur le terrain dont la vie est de 10 ou moins.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_cible_creature("adverse", "terrain") && !statistique(carte, "silence")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature adverse sur le terrain dont la vie est de 10 ou moins : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain adverse :</u>");
                                saut();
                                for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        afficher_carte("adverse", "terrain", n);
                                    }
                                    else {
                                        afficher("???");
                                    }
                                    div_fin();
                                    if (Jeu.adverse.terrain[n].type == "Créature" && Jeu.adverse.terrain[n].vie <= 10 && !Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            mort(Jeu.adverse.terrain[cible]);
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_cible_creature("joueur", "terrain") && !statistique(carte, "silence")) {
                        let best = 0;
                        while (Jeu.joueur.terrain[best].type != "Créature" || (Jeu.joueur.terrain[best].camouflage && !Jeu.joueur.terrain[best].silence)) {
                            best++;
                        }
                        for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                            if (Jeu.joueur.terrain[n].vie > Jeu.joueur.terrain[best].vie && Jeu.joueur.terrain[best].type == "Créature" && (!Jeu.joueur.terrain[n].camouflage || Jeu.joueur.terrain[n].silence)) {
                                best = n;
                            }
                        }
                        mort(Jeu.joueur.terrain[best]);
                        degats_direct("joueur", 2);
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
            break;
        case 211:
            carte.nom = "Rénovation";
            carte.type = "Action";
            carte.cout[0] = 3;
            carte.vente[0] = 1;
            carte.texte = "Soigne 3 à un Bâtiment allié sur le terrain.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_soin_batiment("joueur")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez un Bâtiment allié blessé sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Bâtiment" && Jeu.joueur.terrain[n].vie < Jeu.joueur.terrain[n].vie_max) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            soin(Jeu.joueur.terrain[cible], 3);
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_soin_batiment("adverse")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Bâtiment" || Jeu.adverse.terrain[best].vie >= Jeu.adverse.terrain[best].vie_max) {
                            best++;
                        }
                        for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                            if ((Jeu.adverse.terrain[n].vie_max - Jeu.adverse.terrain[n].vie) > (Jeu.adverse.terrain[best].vie_max - Jeu.adverse.terrain[best].vie) && Jeu.adverse.terrain[n].type == "Bâtiment") {
                                best = n;
                            }
                        }
                        soin(Jeu.adverse.terrain[best], 3);
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 212:
            carte.nom = "Fortification";
            carte.type = "Action";
            carte.cout[0] = 4;
            carte.vente[0] = 2;
            carte.texte = "Donne 1 défense et 1 vie à un Bâtiment allié sur le terrain.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_batiment("joueur", "terrain")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez un Bâtiment allié sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Bâtiment") {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.joueur.terrain[cible].defense++;
                            Jeu.joueur.terrain[cible].vie++;
                            Jeu.joueur.terrain[cible].vie_max++;
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_batiment("adverse", "terrain")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Bâtiment") {
                            best++;
                        }
                        Jeu.adverse.terrain[best].defense++;
                        Jeu.adverse.terrain[best].vie++;
                        Jeu.adverse.terrain[best].vie_max++;
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 213:
            carte.nom = "Baliste";
            carte.type = "Bâtiment";
            carte.cout[0] = 15;
            carte.vente[0] = 7;
            carte.vie_max = carte.vie = 4;
            carte.action_max = 1;
            carte.texte = "Quand joue : Inflige 6 dégâts à l'Unité adverse sur le terrain en première position.";
            carte.effet_action = function () {
                degats(Jeu[camp_oppose(carte.camp)].terrain[0], 6);
            }
            break;
        case 214:
            carte.nom = "Catapulte";
            carte.type = "Bâtiment";
            carte.cout[0] = 15;
            carte.vente[0] = 7;
            carte.vie_max = carte.vie = 4;
            carte.action_max = 1;
            carte.texte = "Quand joue : Inflige 4 dégâts à la Créature adverse sur le terrain en première position ou Inflige 8 dégâts au Bâtiment adverse sur le terrain en première position.";
            carte.effet_action = function () {
                if (Jeu[camp_oppose(carte.camp)].terrain[0].type == "Bâtiment") {
                    degats(Jeu[camp_oppose(carte.camp)].terrain[0], 6);
                }
                else {
                    degats(Jeu[camp_oppose(carte.camp)].terrain[0], 6);
                }
            }
            break;
        case 215:
            carte.nom = "Diamant";
            carte.type = "Objet";
            carte.familles.push("Joyau");
            carte.cout[0] = 25;
            carte.vente[0] = 12;
            carte.texte = "Dépense tout votre Or et, pour chaque 2 Or dépensé, donne 1 Or en réserve.";
            carte.effet_pose = function () {
                Jeu[carte.camp].ressources[0].reserve += parseInt(Jeu[carte.camp].ressources[0].courant / 2);
                Jeu[carte.camp].ressources[0].courant = 0;
                deplacer(carte, carte.camp, "defausse");
                menu();
                return true;
            }
            break;
        case 216:
            carte.nom = "Prisme";
            carte.type = "Objet";
            carte.familles.push("Joyau");
            carte.cout[0] = 24;
            carte.vente[0] = 12;
            carte.texte = "Donne 1 Feu, 1 Eau, 1 Végétal, 1 Terre, 1 Air, 1 Foudre, 1 Métal, 1 Arcane, 1 Mort, 1 Lumière, 1 Ombre et 1 Glace en réserve.";
            carte.effet_pose = function () {
                for (let n = 1; n < 13; n++) {
                    Jeu[carte.camp].ressources[n].reserve++;
                }
                deplacer(carte, carte.camp, "defausse");
                menu();
                return true;
            }
            break;
        case 217:
            carte.nom = "Grande faucheuse";
            carte.type = "Créature";
            carte.familles.push("Faucheuse");
            carte.cout[0] = 25;
            carte.cout[9] = 25;
            carte.vente[0] = 13;
            carte.vente[9] = 12;
            carte.attaque = 1;
            carte.vie_max = carte.vie = 10;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.letalite = true;
            break;
        case 218:
            carte.nom = "Fermier";
            carte.familles.push("Humain");
            carte.cout[0] = 5;
            carte.vente[0] = 2;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Au début de la phase de préparation : Donne 1 Or";
            carte.effet_etage_debut = function () {
                Jeu[carte.camp].ressources[0].courant++;
            }
            break;
        case 219:
            carte.nom = "Ferme";
            carte.type = "Bâtiment";
            carte.cout[0] = 9;
            carte.vente[0] = 1;
            carte.vie_max = carte.vie = 4;
            carte.equipement_max = 1;
            carte.texte = "Au début de la phase de préparation : Donne 3 Or";
            carte.effet_etage_debut = function () {
                Jeu[carte.camp].ressources[0].courant += 3;
            }
            break;
        case 220:
            carte.nom = "Peau d'écorce";
            carte.type = "Action";
            carte.familles.push("Sort");
            carte.cout[0] = 2;
            carte.cout[3] = 1;
            carte.vente[0] = 1;
            carte.texte = "Donne 2 vie max à une Créature alliée sur le terrain.<br/>Sorcellerie 2 : Donne 4 vie max à une Créature alliée sur le terrain.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_creature("joueur", "terrain")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature") {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            if (sorcellerie("joueur") >= 2) {
                                Jeu.joueur.terrain[cible].vie_max += 4;
                            }
                            else {
                                Jeu.joueur.terrain[cible].vie_max += 2;
                            }
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_creature("adverse", "terrain")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature") {
                            best++;
                        }
                        if (sorcellerie("adverse") >= 2) {
                            Jeu.adverse.terrain[best].vie_max += 4;
                        }
                        else {
                            Jeu.adverse.terrain[best].vie_max += 2;
                        }
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 221:
            carte.nom = "Peau de pierre";
            carte.type = "Action";
            carte.familles.push("Sort");
            carte.cout[0] = 2;
            carte.cout[4] = 1;
            carte.vente[0] = 1;
            carte.texte = "Donne 1 défense à une Créature alliée sur le terrain.<br/>Sorcellerie 2 : Donne 2 défense à une Créature alliée sur le terrain.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_creature("joueur", "terrain")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature") {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            if (sorcellerie("joueur") >= 2) {
                                Jeu.joueur.terrain[cible].defense += 2;
                            }
                            else {
                                Jeu.joueur.terrain[cible].defense++;
                            }
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_creature("adverse", "terrain")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature") {
                            best++;
                        }
                        if (sorcellerie("adverse") >= 2) {
                            Jeu.adverse.terrain[best].defense += 2;
                        }
                        else {
                            Jeu.adverse.terrain[best].defense++;
                        }
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 222:
            carte.nom = "Cape d'ombre";
            carte.type = "Objet";
            carte.familles.push("Équipement", "Armure");
            carte.cout[0] = 3;
            carte.cout[11] = 3;
            carte.vente[0] = 2;
            carte.vente[11] = 1;
            carte.stat_equipement.effet_etage_debut = function (creature) {
                creature.camouflage = true;
            }
            carte.texte = "Donne l'effet suivant à la Créature equipée : Au début de la phase de préparation : Se donne Camouflage.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_equipement("joueur")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée équipable sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].equipements.length < Jeu.joueur.terrain[n].equipement_max) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            equiper(Jeu.joueur.terrain[cible], carte);
                            effet_pose(carte);
                            enlever(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_equipement("adverse")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].equipements.length >= Jeu.adverse.terrain[best].equipement_max) {
                            best++;
                        }
                        equiper(Jeu.adverse.terrain[best], carte);
                        effet_pose(carte);
                        enlever(carte);
                        return true;
                    }
                    return false;
                }
            }
            carte.description = "Une cape d'un noir profond, garantissant votre discrétion dans un environnement sombre.";
            break;
        case 223:
            carte.nom = "Frappe";
            carte.type = "Action";
            carte.cout[0] = 10;
            carte.vente[0] = 5;
            carte.texte = "Inflige autant de dégâts à une Unité adverse sur le terrain que l'attaque d'une Créature alliée sur le terrain";
            carte.effet_pose = function (step, cible1, cible2) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_creature("joueur", "terrain") && verifier_cible_creature("adverse", "terrain")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature") {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            initialiser();
                            div("main");
                            fonction("Retour", "Jeu.joueur.main[" + carte.slot + "].effet_pose(1)");
                            saut(2);
                            afficher(carte.nom);
                            saut();
                            afficher(carte.texte);
                            saut(2);
                            afficher("Choisissez une Unité adverse sur le terrain : ");
                            saut(2);
                            div("", "zone");
                            afficher("<u>Terrain adverse :</u>");
                            saut();
                            for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                                div("", "carte");
                                div();
                                if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                    afficher_carte("adverse", "terrain", n);
                                }
                                else {
                                    afficher("???");
                                }
                                div_fin();
                                if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                    div();
                                    fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(3," + cible1 + "," + n + ")");
                                    div_fin();
                                }
                                div_fin();
                            }
                            div_fin();
                            div_fin();
                            div("side", "affichage");
                            div_fin();
                            actualiser();
                            break;
                        case 3:
                            degats(Jeu.adverse.terrain[cible2], statistique(Jeu.joueur.terrain[cible1], "attaque"));
                            effet_pose(carte);
                            deplacer(carte, "joueur", "defausse");
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_cible_creature("joueur", "terrain") && verifier_creature("adverse", "terrain")) {
                        let best1 = 0;
                        let best2 = 0;
                        while (Jeu.adverse.terrain[best1].type != "Créature") {
                            best1++;
                        }
                        while (Jeu.joueur.terrain[best2].camouflage) {
                            best2++;
                        }
                        for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                            if (statistique(Jeu.adverse.terrain[n], "attaque") > statistique(Jeu.adverse.terrain[best1], "attaque") && Jeu.adverse.terrain[n].type == "Créature") {
                                best1 = n;
                            }
                        }
                        for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                            if (Jeu.joueur.terrain[n].vie > Jeu.joueur.terrain[best2].vie && (!Jeu.joueur.terrain[n].camouflage || Jeu.joueur.terrain[n].silence)) {
                                best2 = n;
                            }
                        }
                        degats(Jeu.joueur.terrain[best2], statistique(Jeu.adverse.terrain[best1], "attaque"));
                        effet_pose(carte);
                        enlever(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 224:
            carte.nom = "Écrasement";
            carte.type = "Action";
            carte.cout[0] = 5;
            carte.vente[0] = 2;
            carte.texte = "Inflige autant de dégâts à une Unité adverse sur le terrain que la vie maximale d'une Créature alliée sur le terrain";
            carte.effet_pose = function (step, cible1, cible2) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_creature("joueur", "terrain") && verifier_cible_creature("adverse", "terrain")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature") {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            initialiser();
                            div("main");
                            fonction("Retour", "Jeu.joueur.main[" + carte.slot + "].effet_pose(1)");
                            saut(2);
                            afficher(carte.nom);
                            saut();
                            afficher(carte.texte);
                            saut(2);
                            afficher("Choisissez une Unité adverse sur le terrain : ");
                            saut(2);
                            div("", "zone");
                            afficher("<u>Terrain adverse :</u>");
                            saut();
                            for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                                div("", "carte");
                                div();
                                if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                    afficher_carte("adverse", "terrain", n);
                                }
                                else {
                                    afficher("???");
                                }
                                div_fin();
                                if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                    div();
                                    fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(3," + cible1 + "," + n + ")");
                                    div_fin();
                                }
                                div_fin();
                            }
                            div_fin();
                            div_fin();
                            div("side", "affichage");
                            div_fin();
                            actualiser();
                            break;
                        case 3:
                            degats(Jeu.adverse.terrain[cible2], statistique(Jeu.joueur.terrain[cible1], "vie_max"));
                            effet_pose(carte);
                            deplacer(carte, "joueur", "defausse");
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_cible_creature("joueur", "terrain") && verifier_creature("adverse", "terrain")) {
                        let best1 = 0;
                        let best2 = 0;
                        while (Jeu.adverse.terrain[best1].type != "Créature") {
                            best1++;
                        }
                        while (Jeu.joueur.terrain[best2].camouflage) {
                            best2++;
                        }
                        for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                            if (statistique(Jeu.adverse.terrain[n], "vie_max") > statistique(Jeu.adverse.terrain[best1], "vie_max") && Jeu.adverse.terrain[n].type == "Créature") {
                                best1 = n;
                            }
                        }
                        for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                            if (Jeu.joueur.terrain[n].vie > Jeu.joueur.terrain[best2].vie && (!Jeu.joueur.terrain[n].camouflage || Jeu.joueur.terrain[n].silence)) {
                                best2 = n;
                            }
                        }
                        degats(Jeu.joueur.terrain[best2], statistique(Jeu.adverse.terrain[best1], "vie_max"));
                        effet_pose(carte);
                        enlever(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 225:
            carte.nom = "Coup de boule";
            carte.type = "Action";
            carte.cout[0] = 5;
            carte.vente[0] = 2;
            carte.texte = "Inflige autant de dégâts à l'Unité adverse sur le terrain en première position que l'attaque d'une Créature alliée sur le terrain.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_creature("joueur", "terrain") && Jeu.adverse.terrain.length > 0) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature") {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            degats(Jeu.adverse.terrain[0], statistique(Jeu.joueur.terrain[cible], "attaque"));
                            effet_pose(carte);
                            deplacer(carte, "joueur", "defausse");
                            menu();
                            break;
                    }
                }
                else {
                    if (Jeu.joueur.terrain.length > 0 && verifier_creature("adverse", "terrain")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature") {
                            best++;
                        }
                        for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                            if (statistique(Jeu.adverse.terrain[n], "attaque") > statistique(Jeu.adverse.terrain[best], "attaque") && Jeu.adverse.terrain[n].type == "Créature") {
                                best = n;
                            }
                        }
                        degats(Jeu.joueur.terrain[0], statistique(Jeu.adverse.terrain[best], "attaque"));
                        effet_pose(carte);
                        enlever(carte);
                        return true;
                    }
                    return false;
                }
            }
            carte.description = "Se servir de sa tête est une leçon universelle, surtout si vous avez le crâne dur.";
            break;
        case 226:
            carte.nom = "Boisson fraîche";
            carte.type = "Objet";
            carte.familles.push("Potion");
            carte.cout[0] = 5;
            carte.vente[0] = 2;
            carte.texte = "Enlève Brûlure à une Créature alliée sur le terrain.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_brulure("joueur")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée avec Brûlure sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].brulure > 0) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.joueur.terrain[cible].brulure = 0;
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_brulure("adverse")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].brulure == 0) {
                            best++;
                        }
                        for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                            if (Jeu.adverse.terrain[n].brulure > Jeu.adverse.terrain[best].brulure && Jeu.adverse.terrain[n].type == "Créature") {
                                best = n;
                            }
                        }
                        Jeu.adverse.terrain[best].brulure = 0;
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 227:
            carte.nom = "Boisson chaude";
            carte.type = "Objet";
            carte.familles.push("Potion");
            carte.cout[0] = 6;
            carte.vente[0] = 3;
            carte.texte = "Enlève Gel à une Créature alliée sur le terrain.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_gel("joueur")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée avec Gel sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].gel > 0) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.joueur.terrain[cible].gel = 0;
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_gel("adverse")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].gel == 0) {
                            best++;
                        }
                        for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                            if (Jeu.adverse.terrain[n].gel > Jeu.adverse.terrain[best].gel && Jeu.adverse.terrain[n].type == "Créature") {
                                best = n;
                            }
                        }
                        Jeu.adverse.terrain[best].gel = 0;
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            carte.description = "L'autre solution est de lui verser de l'huile bouillante sur le crâne mais les résultats seront moins concluants...";
            break;
        case 228:
            carte.nom = "Sels";
            carte.type = "Objet";
            carte.familles.push("Potion");
            carte.cout[0] = 5;
            carte.vente[0] = 2;
            carte.texte = "Enlève Étourdissement à une Créature alliée sur le terrain.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_etourdissement("joueur")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée avec Étourdissement sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].etourdissement) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.joueur.terrain[cible].etourdissement = false;
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_etourdissement("adverse")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || !Jeu.adverse.terrain[best].etourdissement) {
                            best++;
                        }
                        for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                            if (Jeu.adverse.terrain[n].action > Jeu.adverse.terrain[best].action && Jeu.adverse.terrain[n].etourdissement && Jeu.adverse.terrain[n].type == "Créature") {
                                best = n;
                            }
                        }
                        Jeu.adverse.terrain[best].etourdissement = false;
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 229:
            carte.nom = "Pansement";
            carte.type = "Objet";
            carte.cout[0] = 5;
            carte.vente[0] = 2;
            carte.texte = "Enlève Saignement à une Créature alliée sur le terrain.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_saignement("joueur")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée avec Pansement sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].saignement > 0) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.joueur.terrain[cible].saignement = 0;
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_saignement("adverse")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].saignement == 0) {
                            best++;
                        }
                        for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                            if (Jeu.adverse.terrain[n].saignement > Jeu.adverse.terrain[best].saignement && Jeu.adverse.terrain[n].type == "Créature") {
                                best = n;
                            }
                        }
                        Jeu.adverse.terrain[best].saignement = 0;
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 230:
            carte.nom = "Contrôle mental";
            carte.type = "Action";
            carte.familles.push("Illithid");
            carte.cout[0] = 10;
            carte.cout[8] = 10;
            carte.vente[0] = 5;
            carte.vente[8] = 5;
            carte.texte = "Place une Créature adverse sur le terrain sur le terrain allié.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_cible_creature("adverse", "terrain")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature adverse sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain adverse :</u>");
                                saut();
                                for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        afficher_carte("adverse", "terrain", n);
                                    }
                                    else {
                                        afficher("???");
                                    }
                                    div_fin();
                                    if (Jeu.adverse.terrain[n].type == "Créature" && !Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            deplacer(carte, "joueur", "defausse");
                            deplacer(Jeu.adverse.terrain[cible], "joueur", "terrain");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_cible_creature("joueur", "terrain")) {
                        let best = 0;
                        while (Jeu.joueur.terrain[best].type != "Créature" || (Jeu.joueur.terrain[best].camouflage && !Jeu.joueur.terrain[best].silence)) {
                            best++;
                        }
                        for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                            if (cout_total(Jeu.joueur.terrain[n]) > cout_total(Jeu.joueur.terrain[best]) && Jeu.joueur.terrain[best].type == "Créature" && (!Jeu.joueur.terrain[n].camouflage || Jeu.joueur.terrain[n].silence)) {
                                best = n;
                            }
                        }
                        deplacer(Jeu.joueur.terrain[best], "adverse", "terrain");
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 231:
            carte.nom = "Caserne";
            carte.type = "Bâtiment";
            carte.cout[0] = 23;
            carte.vente[0] = 11;
            carte.vie_max = carte.vie = 4;
            carte.action_max = 1;
            carte.mobile = true;
            carte.texte = "Quand joue : Crée <button onclick='javascript:carte_voir_id(207)'>Soldat</button> sur le terrain.";
            carte.effet_action = function () {
                let nouvelle_carte = obtenir_carte(207);
                nouvelle_carte.vente = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                ajouter(nouvelle_carte, carte.camp, carte.zone);
            }
            break;
        case 232:
            carte.nom = "Capitaine pirate";
            carte.familles.push("Humain", "Pirate");
            carte.cout[0] = 13;
            carte.cout[2] = 13;
            carte.vente[0] = 7;
            carte.vente[2] = 6;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Donne 1 attaque et 1 vie à toutes les Créatures Pirate alliées sur le terrain.";
            carte.effet_pose = function () {
                if (!statistique(carte, "silence")) {
                    for (let n = 0; n < Jeu[carte.camp].terrain.length; n++) {
                        if (Jeu[carte.camp].terrain[n].type == "Créature" && Jeu[carte.camp].terrain[n].familles.includes("Pirate")) {
                            Jeu[carte.camp].terrain[n].attaque++;
                            Jeu[carte.camp].terrain[n].vie_max++;
                            Jeu[carte.camp].terrain[n].vie++;
                        }
                    }
                }
                deplacer(carte, carte.camp, "terrain");
                effet_pose(carte);
                menu();
                return true;
            }
            break;
        case 233:
            carte.nom = "Élémentaire de sang";
            carte.type = "Créature";
            carte.familles.push("Élémentaire");
            carte.cout[0] = 9;
            carte.vente[0] = 4;
            carte.attaque = 1;
            carte.vie_max = carte.vie = 3;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.vol_de_vie = 2;
            break;
        case 234:
            carte.nom = "Messager";
            carte.familles.push("Humain");
            carte.cout[0] = 5;
            carte.vente[0] = 2;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Pioche 1 carte.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    pioche("joueur");
                }
                deplacer(carte, carte.camp, "terrain");
                effet_pose(carte);
                menu();
                return true;
            }
            break;
        case 235:
            carte.nom = "Incendie";
            carte.type = "Action";
            carte.cout[0] = 15;
            carte.cout[1] = 15;
            carte.vente[0] = 7;
            carte.vente[1] = 7;
            carte.texte = "Applique Brûlure 2 à toutes les Unités adverses sur le terrain.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    if (Jeu.adverse.terrain.length > 0) {
                        for (let n = Jeu.adverse.terrain.length - 1; n >= 0; n--) {
                            if (Jeu.adverse.terrain[n].brulure < 2) {
                                Jeu.adverse.terrain[n].brulure = 2;
                            }
                        }
                        deplacer(carte, "joueur", "defausse");
                        effet_pose(carte);
                        menu();
                    }
                }
                else {
                    if (Jeu.joueur.terrain.length > 0) {
                        for (let n = Jeu.joueur.terrain.length - 1; n >= 0; n--) {
                            if (Jeu.joueur.terrain[n].brulure < 2) {
                                Jeu.joueur.terrain[n].brulure = 2;
                            }
                        }
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 236:
            carte.nom = "Blizzard";
            carte.type = "Action";
            carte.cout[0] = 15;
            carte.cout[12] = 15;
            carte.vente[0] = 7;
            carte.vente[12] = 7;
            carte.texte = "Applique Gel 1 à toutes les Unités adverses sur le terrain.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    if (Jeu.adverse.terrain.length > 0) {
                        for (let n = Jeu.adverse.terrain.length - 1; n >= 0; n--) {
                            if (Jeu.adverse.terrain[n].gel < 1) {
                                Jeu.adverse.terrain[n].gel = 1;
                            }
                        }
                        deplacer(carte, "joueur", "defausse");
                        effet_pose(carte);
                        menu();
                    }
                }
                else {
                    if (Jeu.joueur.terrain.length > 0) {
                        for (let n = Jeu.joueur.terrain.length - 1; n >= 0; n--) {
                            if (Jeu.joueur.terrain[n].gel < 1) {
                                Jeu.joueur.terrain[n].gel = 1
                            }
                        }
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 237:
            carte.nom = "Dague sacrificielle";
            carte.type = "Objet";
            carte.cout[0] = 1;
            carte.texte = "Inflige 2 dégâts puis soigne 2 à une Créature sur le terrain.";
            carte.effet_pose = function (step, cible_camp, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_creature("joueur", "terrain") || verifier_cible_creature("adverse", "terrain")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                if (Jeu.joueur.terrain.length > 0) {
                                    for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                        div("", "carte");
                                        div();
                                        afficher_carte("joueur", "terrain", n);
                                        div_fin();
                                        if (Jeu.joueur.terrain[n].type == "Créature") {
                                            div();
                                            fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + '"joueur",' + n + ")");
                                            div_fin();
                                        }
                                        div_fin();
                                    }
                                }
                                else {
                                    afficher("<i>Votre terrain est vide</i>");
                                    saut();
                                }
                                div_fin();
                                saut();
                                afficher("Choisissez une Créature adverse sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain adverse :</u>");
                                saut();
                                if (Jeu.adverse.terrain.length > 0) {
                                    for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                                        div("", "carte");
                                        div();
                                        if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                            afficher_carte("adverse", "terrain", n);
                                        }
                                        else {
                                            afficher("???");
                                        }
                                        div_fin();
                                        if (Jeu.adverse.terrain[n].type == "Créature" && !Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                            div();
                                            fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + '"adverse",' + n + ")");
                                            div_fin();
                                        }
                                        div_fin();
                                    }
                                }
                                else {
                                    afficher("<i>Le terrain adverse est vide</i>");
                                    saut();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            let mort = degats(Jeu[cible_camp].terrain[cible], 2).mort;
                            if (!mort) {
                                soin(Jeu[cible_camp].terrain[cible], 2);
                            }
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    let verifier1 = false;
                    let verifier2 = false;
                    for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                        if (Jeu.adverse.terrain[n].vie > 2 && [52].includes(Jeu.adverse.terrain[n].id)) {
                            verifier1 = true;
                        }
                    }
                    for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                        if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].vie <= 2 && (!Jeu.joueur.terrain[n].camouflage || Jeu.joueur.terrain[n].silence)) {
                            verifier2 = true;
                        }
                    }
                    if (verifier1) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].vie <= 2 || ![52].includes(Jeu.adverse.terrain[best].id)) {
                            best++;
                        }
                        let mort = degats(Jeu.adverse.terrain[best], 2).mort;
                        if (!mort) {
                            soin(Jeu.adverse.terrain[best], 2);
                        }
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    else if (verifier2) {
                        let best = 0;
                        while (Jeu.joueur.terrain[best].type != "Créature" || Jeu.joueur.terrain[best].vie > 2 || (Jeu.joueur.terrain[best].camouflage && !Jeu.joueur.terrain[best].silence)) {
                            best++;
                        }
                        for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                            if (Jeu.joueur.terrain[n].vie > Jeu.joueur.terrain[best].vie && Jeu.joueur.terrain[n].vie <= 2 && Jeu.joueur.terrain[n].type == "Créature" && (!Jeu.joueur.terrain[n].camouflage || Jeu.joueur.terrain[n].silence)) {
                                best = n;
                            }
                        }
                        let mort = degats(Jeu.joueur.terrain[best], 2).mort;
                        if (!mort) {
                            soin(Jeu.joueur.terrain[best], 2);
                        }
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 238:
            carte.nom = "Plastron de pique";
            carte.type = "Objet";
            carte.familles.push("Équipement", "Armure");
            carte.cout[0] = 8;
            carte.vente[0] = 4;
            carte.stat_equipement.vie_max = 4;
            carte.stat_equipement.epine = 2;
            carte.texte = "Donne 4 vie max et applique Épine 2 à la Créature équipée.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_equipement("joueur")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée équipable sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].equipements.length < Jeu.joueur.terrain[n].equipement_max) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            equiper(Jeu.joueur.terrain[cible], carte);
                            effet_pose(carte);
                            enlever(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_equipement("adverse")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].equipements.length >= Jeu.adverse.terrain[best].equipement_max) {
                            best++;
                        }
                        equiper(Jeu.adverse.terrain[best], carte);
                        effet_pose(carte);
                        enlever(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 239:
            carte.nom = "Plastron de plaque";
            carte.type = "Objet";
            carte.familles.push("Équipement", "Armure");
            carte.cout[0] = 6;
            carte.vente[0] = 3;
            carte.stat_equipement.vie_max = 4;
            carte.texte = "Donne 4 vie max et 4 vie supplémentaire à la Créature équipée.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_equipement("joueur")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée équipable sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].equipements.length < Jeu.joueur.terrain[n].equipement_max) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.joueur.terrain[cible].vie_sup += 4;
                            equiper(Jeu.joueur.terrain[cible], carte);
                            effet_pose(carte);
                            enlever(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_equipement("adverse")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].equipements.length >= Jeu.adverse.terrain[best].equipement_max) {
                            best++;
                        }
                        Jeu.adverse.terrain[best].vie_sup += 4;
                        equiper(Jeu.adverse.terrain[best], carte);
                        effet_pose(carte);
                        enlever(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 240:
            carte.nom = "Diablotin";
            carte.type = "Créature";
            carte.familles.push("Démon");
            carte.cout[0] = 3;
            carte.cout[1] = 1;
            carte.cout[9] = 1;
            carte.vente[1] = 1;
            carte.vente[9] = 1;
            carte.attaque = 4;
            carte.vie_max = carte.vie = 4;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Inflige 1 dégâts au Meneur allié.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    if (!statistique(carte, "silence")) {
                        degats_direct("joueur", 1);
                    }
                    deplacer(carte, carte.camp, "terrain");
                    effet_pose(carte);
                    if (Jeu.joueur.vie > 0) {
                        menu();
                    }
                    else {
                        game_over();
                    }
                }
                else {
                    if (Jeu.adverse.vie >= 1) {
                        if (!statistique(carte, "silence")) {
                            degats_direct("adverse", 1);
                        }
                        deplacer(carte, carte.camp, "terrain");
                        effet_pose(carte);
                        menu();
                    }
                }
                return true;
            }
            break;
        case 241:
            carte.nom = "Prière";
            carte.type = "Action";
            carte.familles.push("Église");
            carte.cout[0] = 2;
            carte.cout[10] = 1;
            carte.vente[0] = 1;
            carte.texte = "Soigne 2 à une Créature alliée sur le terrain.<br/>ou<br/>Pioche 1 carte.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            initialiser();
                            div("main");
                            fonction("Annuler", "menu()");
                            saut(2);
                            afficher(carte.nom);
                            saut();
                            afficher(carte.texte);
                            saut(2);
                            afficher("Choisissez un effet : ");
                            saut(2);
                            fonction("Soigne 2 à une Créature alliée sur le terrain", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2)");
                            saut();
                            afficher("ou");
                            saut();
                            fonction("Pioche 1 carte", "Jeu.joueur.main[" + carte.slot + "].effet_pose(4)");
                            div_fin();
                            div("side", "affichage");
                            div_fin();
                            actualiser();
                            break;
                        case 2:
                            if (verifier_soin_creature("joueur")) {
                                initialiser();
                                div("main");
                                fonction("Retour", "Jeu.joueur.main[" + carte.slot + "].effet_pose(1)");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher("Soigne 2 à une Créature alliée sur le terrain.");
                                saut(2);
                                afficher("Choisissez une Créature alliée sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].vie < Jeu.joueur.terrain[n].vie_max) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(3," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 3:
                            soin(Jeu.joueur.terrain[cible], 2);
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                        case 4:
                            pioche("joueur");
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_soin_creature("adverse")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].vie >= Jeu.adverse.terrain[best].vie_max) {
                            best++;
                        }
                        soin(Jeu.adverse.terrain[best], 2);
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 242:
            carte.nom = "Résurection";
            carte.type = "Action";
            carte.cout[0] = 20;
            carte.cout[10] = 20;
            carte.vente[0] = 10;
            carte.vente[10] = 10;
            carte.texte = "Place une Créature alliée dans la défausse sur le terrain et la soigne totalement.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_creature("joueur", "defausse")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée dans la défausse : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Défausse :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.defausse.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "defausse", n);
                                    div_fin();
                                    if (Jeu.joueur.defausse[n].type == "Créature") {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.joueur.defausse[cible].vie = Jeu.joueur.defausse[cible].vie_max;
                            deplacer(Jeu.joueur.defausse[cible], "joueur", "terrain");
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_creature("adverse", "defausse")) {
                        let best = 0;
                        while (Jeu.adverse.defausse[best].type != "Créature") {
                            best++;
                        }
                        for (let n = 0; n < Jeu.adverse.defausse.length; n++) {
                            if (cout_total(Jeu.adverse.defausse[n]) > cout_total(Jeu.adverse.defausse[best]) && Jeu.adverse.defausse[n].type == "Créature") {
                                best = n;
                            }
                        }
                        Jeu.adverse.defausse[best].vie = Jeu.adverse.defausse[best].vie_max;
                        deplacer(Jeu.adverse.defausse[best], "adverse", "terrain");
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 243:
            carte.nom = "Piège à loup";
            carte.type = "Bâtiment";
            carte.familles.push("Piège");
            carte.cout[0] = 3;
            carte.vente[0] = 1;
            carte.vie_max = carte.vie = 1;
            carte.camouflage = true;
            carte.texte = "Quand une Créature adverse est posée : Lui inflige 3 dégâts et se détruit.";
            carte.effet_pose_carte = function (carte_pose) {
                if (carte_pose.camp != carte.camp && carte_pose.type == "Créature") {
                    degats(carte_pose, 3);
                    mort(carte);
                }
            }
            break;
        case 244:
            carte.nom = "Golem de lave";
            carte.familles.push("Golem");
            carte.cout[0] = 12;
            carte.cout[1] = 5;
            carte.cout[4] = 5;
            carte.vente[0] = 5;
            carte.vente[1] = 3;
            carte.vente[4] = 3;
            carte.attaque = 4;
            carte.defense = 3;
            carte.vie_max = carte.vie = 10;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand attaqué : Applique Brûlure 1 à la Créature attaquante.";
            carte.effet_be_attaque = function (attaquant) {
                if (attaquant.brulure < 1) {
                    attaquant.brulure = 1;
                }
            }
            break;
        case 245:
            carte.nom = "Caisse à outils";
            carte.type = "Objet";
            carte.cout[0] = 3;
            carte.vente[0] = 1;
            carte.texte = "Pioche un Objet.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    let verifier = false;
                    for (let n = 0; n < Jeu.NOMBRE_CARTE; n++) {
                        if (Jeu.joueur.regions[Jeu.region_active].boutique_generer(obtenir_carte(n)) && obtenir_carte(n).type == "Objet") {
                            verifier = true;
                        }
                    }
                    if (verifier) {
                        let nouvelle_carte = boutique_generer();
                        while (nouvelle_carte.type != "Objet") {
                            nouvelle_carte = boutique_generer();
                        }
                        pioche("joueur", nouvelle_carte);
                        deplacer(carte, "joueur", "defausse");
                        effet_pose(carte);
                        menu();
                    }
                }
                else {
                    return false;
                }
            }
            break;
        case 246:
            carte.nom = "Parchemin";
            carte.type = "Objet";
            carte.cout[0] = 3;
            carte.vente[0] = 1;
            carte.texte = "Pioche une Action Sort.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    let verifier = false;
                    for (let n = 0; n < Jeu.NOMBRE_CARTE; n++) {
                        if (Jeu.joueur.regions[Jeu.region_active].boutique_generer(obtenir_carte(n)) && obtenir_carte(n).familles.includes("Sort")) {
                            verifier = true;
                        }
                    }
                    if (verifier) {
                        let nouvelle_carte = boutique_generer();
                        while (!nouvelle_carte.familles.includes("Sort")) {
                            nouvelle_carte = boutique_generer();
                        }
                        pioche("joueur", nouvelle_carte);
                        deplacer(carte, "joueur", "defausse");
                        effet_pose(carte);
                        menu();
                    }
                }
                else {
                    return false;
                }
            }
            break;
        case 247:
            carte.nom = "Navire marchand";
            carte.type = "Bâtiment";
            carte.familles.push("Bateau");
            carte.cout[0] = 6;
            carte.cout[2] = 6;
            carte.vente[0] = 3;
            carte.vente[2] = 3;
            carte.vie_max = carte.vie = 4;
            carte.action_max = 1;
            carte.mobile = true;
            carte.texte = "Quand joue : Donne 1 Or en réserve.";
            carte.effet_action = function () {
                Jeu[carte.camp].ressources[0].reserve++;
            }
            break;
        case 248:
            carte.nom = "Bateau de transport";
            carte.type = "Bâtiment";
            carte.familles.push("Bateau");
            carte.cout[0] = 4;
            carte.cout[2] = 4;
            carte.vente[0] = 2;
            carte.vente[2] = 2;
            carte.vie_max = carte.vie = 4;
            carte.action_max = 1;
            carte.mobile = true;
            carte.texte = "Au début de la phase de préparation : Pioche une carte.";
            carte.effet_etage_debut = function () {
                if (carte.camp == "joueur") {
                    pioche("joueur");
                }
            }
            break;
        case 249:
            carte.nom = "Écorce de tréant";
            carte.type = "Objet";
            carte.familles.push("Tréant");
            carte.cout[0] = 2;
            carte.cout[3] = 1;
            carte.vente[0] = 1;
            carte.texte = "Applique Régénération 1 à une Créature alliée sur le terrain.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_creature("joueur", "terrain")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature") {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.joueur.terrain[cible].regeneration++;
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_creature("adverse", "terrain")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature") {
                            best++;
                        }
                        Jeu.adverse.terrain[best].regeneration++;
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 250:
            carte.nom = "Coeur de pierre";
            carte.type = "Objet";
            carte.familles.push("Golem");
            carte.cout[0] = 3;
            carte.cout[4] = 2;
            carte.vente[0] = 1;
            carte.vente[4] = 1;
            carte.texte = "Enlève 2 vie maximale et donne 1 défense à une Créature alliée sur le terrain jusqu'à ce qu'il ne lui reste que 2 vie maximale ou moins.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            let verifier = false;
                            for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].vie_max > 2) {
                                    verifier = true;
                                }
                            }
                            if (verifier) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].vie_max > 2) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            while (Jeu.joueur.terrain[cible].vie_max > 2) {
                                Jeu.joueur.terrain[cible].vie_max -= 2;
                                Jeu.joueur.terrain[cible].defense++;
                            }
                            if (Jeu.joueur.terrain[cible].vie > Jeu.joueur.terrain[cible].vie_max) {
                                Jeu.joueur.terrain[cible].vie = Jeu.joueur.terrain[cible].vie_max;
                            }
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    let verifier = false;
                    for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                        if (Jeu.adverse.terrain[n].type == "Créature" && Jeu.adverse.terrain[n].vie_max > 2) {
                            verifier = true;
                        }
                    }
                    if (verifier) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].vie_max <= 2) {
                            best++;
                        }
                        for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                            if (Jeu.adverse.terrain[n].vie_max > Jeu.adverse.terrain[best].vie_max && Jeu.adverse.terrain[n].vie_max > 2 && Jeu.adverse.terrain[n].type == "Créature") {
                                best = n;
                            }
                        }
                        while (Jeu.adverse.terrain[best].vie_max > 2) {
                            Jeu.adverse.terrain[best].vie_max -= 2;
                            Jeu.adverse.terrain[best].defense++;
                        }
                        if (Jeu.adverse.terrain[best].vie > Jeu.adverse.terrain[best].vie_max) {
                            Jeu.adverse.terrain[best].vie = Jeu.adverse.terrain[best].vie_max;
                        }
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 251:
            carte.nom = "Graine";
            carte.type = "Objet";
            carte.familles.push("Plante");
            carte.cout[0] = 2;
            carte.cout[3] = 1;
            carte.vente[3] = 1;
            carte.texte = "Diminue le coût d'une carte alliée Plante dans la boutique de 3 Végétal.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            let verifier = false;
                            for (let n = 0; n < Jeu.joueur.boutique.length; n++) {
                                if (Jeu.joueur.boutique[n].familles.includes("Plante") && Jeu.joueur.boutique[n].cout[3] > 0) {
                                    verifier = true;
                                }
                            }
                            if (verifier) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une carte Plante dans la boutique : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Boutique :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.boutique.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "boutique", n);
                                    div_fin();
                                    if (Jeu.joueur.boutique[n].familles.includes("Plante") && Jeu.joueur.boutique[n].cout[3] > 0) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.joueur.boutique[cible].cout[3] -= 3;
                            if (Jeu.joueur.boutique[cible].cout[3] < 0) {
                                Jeu.joueur.boutique[cible].cout[3] = 0;
                            }
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    return false;
                }
            }
            break;
        case 252:
            carte.nom = "Engrais";
            carte.type = "Objet";
            carte.familles.push("Plante");
            carte.cout[0] = 2;
            carte.cout[3] = 1;
            carte.vente[0] = 1;
            carte.texte = "Donne 2 vie à une Unité alliée Plante sur le terrain.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            let verifier = false;
                            for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                if (["Créature", "Bâtiment"].includes(Jeu.joueur.terrain[n].type) && Jeu.joueur.terrain[n].familles.includes("Plante")) {
                                    verifier = true;
                                }
                            }
                            if (verifier) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Unité alliée Plante sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (["Créature", "Bâtiment"].includes(Jeu.joueur.terrain[n].type) && Jeu.joueur.terrain[n].familles.includes("Plante")) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.joueur.terrain[cible].vie += 2;
                            Jeu.joueur.terrain[cible].vie_max += 2;
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    let verifier = false;
                    for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                        if (["Créature", "Bâtiment"].includes(Jeu.adverse.terrain[n].type) && Jeu.adverse.terrain[n].familles.includes("Plante")) {
                            verifier = true;
                        }
                    }
                    if (verifier) {
                        let best = 0;
                        while (!["Créature", "Bâtiment"].includes(Jeu.adverse.terrain[best].type) || !Jeu.adverse.terrain[best].familles.includes("Plante")) {
                            best++;
                        }
                        Jeu.adverse.terrain[best].vie += 2;
                        Jeu.adverse.terrain[best].vie_max += 2;
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 253:
            carte.nom = "Oeuf de faucon";
            carte.type = "Bâtiment";
            carte.familles.push("Oiseau", "Oeuf");
            carte.cout[5] = 1;
            carte.vie_max = carte.vie = 1;
            carte.texte = "Quand arrive sur le terrain : Lance un décompte de 1.<br/>Quand le décompte de cette carte est écoulé : Se détruit et crée <button onclick='javascript:carte_voir_id(119)'>Faucon</button> sur le terrain.";
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
                let nouvelle_carte = obtenir_carte(119);
                nouvelle_carte.vente = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                ajouter(nouvelle_carte, carte.camp, "terrain");
                carte.vie = 0;
            }
            break;
        case 254:
            carte.nom = "Moineau";
            carte.type = "Créature";
            carte.familles.push("Oiseau");
            carte.cout[5] = 1;
            carte.attaque = 1;
            carte.vie_max = carte.vie = 1;
            carte.action_max = 1;
            carte.equipement_max = 1;
            break;
        case 255:
            carte.nom = "Oeufs de moineau";
            carte.type = "Bâtiment";
            carte.familles.push("Oiseau", "Oeuf");
            carte.cout[5] = 1;
            carte.vie_max = carte.vie = 1;
            carte.texte = "Quand arrive sur le terrain : Lance un décompte de 1.<br/>Quand le décompte de cette carte est écoulé : Se détruit et crée 3 <button onclick='javascript:carte_voir_id(254)'>Moineau</button> sur le terrain.";
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
                for (let n = 0; n < 3; n++) {
                    let nouvelle_carte = obtenir_carte(254);
                    nouvelle_carte.vente = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    ajouter(nouvelle_carte, carte.camp, "terrain");
                }
                carte.vie = 0;
            }
            break;
        case 256:
            carte.nom = "Vampirification";
            carte.type = "Action";
            carte.familles.push("Vampire");
            carte.cout[0] = 4;
            carte.cout[11] = 3;
            carte.vente[0] = 2;
            carte.vente[11] = 1;
            carte.texte = "Applique Vol de vie 2 et donne la famille Vampire à une Créature alliée non-Vampire sur le terrain.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            let verifier = false;
                            for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                if (Jeu.joueur.terrain[n].type == "Créature" && !Jeu.joueur.terrain[n].familles.includes("Vampire")) {
                                    verifier = true;
                                }
                            }
                            if (verifier) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée non-Vampire sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature" && !Jeu.joueur.terrain[n].familles.includes("Vampire")) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.joueur.terrain[cible].vol_de_vie += 2;
                            Jeu.joueur.terrain[cible].familles.push("Vampire");
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    let verifier = false;
                    for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                        if (Jeu.adverse.terrain[n].type == "Créature" && !Jeu.adverse.terrain[n].familles.includes("Vampire")) {
                            verifier = true;
                        }
                    }
                    if (verifier) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].familles.includes("Vampire")) {
                            best++;
                        }
                        Jeu.adverse.terrain[best].vol_de_vie += 2;
                        Jeu.adverse.terrain[best].familles.push("Vampire");
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 257:
            carte.nom = "Roulade";
            carte.type = "Action";
            carte.cout[0] = 3;
            carte.vente[0] = 1;
            carte.texte = "Applique Esquive à une Créature alliée sur le terrain.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            let verifier = false;
                            for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                if (Jeu.joueur.terrain[n].type == "Créature" && !Jeu.joueur.terrain[n].esquive) {
                                    verifier = true;
                                }
                            }
                            if (verifier) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature" && !Jeu.joueur.terrain[n].esquive) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.joueur.terrain[cible].esquive = true;
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_creature("adverse", "terrain")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" && !Jeu.adverse.terrain[best].esquive) {
                            best++;
                        }
                        Jeu.adverse.terrain[best].esquive = true;
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 258:
            carte.nom = "Hache de cuivre";
            carte.type = "Objet";
            carte.familles.push("Équipement", "Arme");
            carte.cout[0] = 5;
            carte.vente[0] = 2;
            carte.stat_equipement.attaque = 3;
            carte.stat_equipement.erosion = 1;
            carte.texte = "Donne 3 attaque et applique Érosion 1 à la Créature équipée.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_equipement("joueur")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée équipable sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].equipements.length < Jeu.joueur.terrain[n].equipement_max) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            equiper(Jeu.joueur.terrain[cible], carte);
                            effet_pose(carte);
                            enlever(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_equipement("adverse")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].equipements.length >= Jeu.adverse.terrain[best].equipement_max) {
                            best++;
                        }
                        equiper(Jeu.adverse.terrain[best], carte);
                        effet_pose(carte);
                        enlever(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 259:
            carte.nom = "Masse de cuivre";
            carte.type = "Objet";
            carte.familles.push("Équipement", "Arme");
            carte.cout[0] = 5;
            carte.vente[0] = 2;
            carte.stat_equipement.charge = true;
            carte.texte = "Applique Charge à la Créature équipée.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_equipement("joueur")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée équipable sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].equipements.length < Jeu.joueur.terrain[n].equipement_max) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            equiper(Jeu.joueur.terrain[cible], carte);
                            effet_pose(carte);
                            enlever(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_equipement("adverse")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].equipements.length >= Jeu.adverse.terrain[best].equipement_max) {
                            best++;
                        }
                        equiper(Jeu.adverse.terrain[best], carte);
                        effet_pose(carte);
                        enlever(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 260:
            carte.nom = "Balise de répérage";
            carte.type = "Objet";
            carte.cout[0] = 3;
            carte.vente[0] = 1;
            carte.texte = "Enlève Camouflage à une Unité adverse sur le terrain.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            let verifier = false;
                            for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                                if (Jeu.adverse.terrain[n].camouflage) {
                                    verifier = true;
                                }
                            }
                            if (verifier) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Unité adverse sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain adverse :</u>");
                                saut();
                                for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        afficher_carte("adverse", "terrain", n);
                                    }
                                    else {
                                        afficher("???");
                                    }
                                    div_fin();
                                    if (Jeu.adverse.terrain[n].camouflage) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.adverse.terrain[cible].camouflage = false;
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    let verifier = false;
                    for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                        if (Jeu.joueur.terrain[n].camouflage) {
                            verifier = true;
                        }
                    }
                    if (verifier) {
                        let best = 0;
                        while (!(Jeu.joueur.terrain[best].camouflage && !Jeu.joueur.terrain[best].silence)) {
                            best++;
                        }
                        Jeu.joueur.terrain[best].camouflage = false;
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 261:
            carte.nom = "Espion";
            carte.familles.push("Humain");
            carte.cout[0] = 4;
            carte.vente[0] = 2;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Révèle une carte adverse dans la main.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            let verifier = false;
                            for (let n = 0; n < Jeu.adverse.main.length; n++) {
                                if (Jeu.adverse.main[n].cache) {
                                    verifier = true;
                                }
                            }
                            if (verifier) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une carte adverse dans la main : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Main adverse :</u>");
                                saut();
                                for (let n = 0; n < Jeu.adverse.main.length; n++) {
                                    div("", "carte");
                                    div();
                                    if (!Jeu.adverse.main[n].cache) {
                                        afficher_carte("adverse", "main", n);
                                    }
                                    else {
                                        afficher("???");
                                    }
                                    div_fin();
                                    if (Jeu.adverse.main[n].cache) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            else {
                                deplacer(carte, "joueur", "terrain");
                                effet_pose(carte);
                                menu();
                            }
                            break;
                        case 2:
                            Jeu.adverse.main[cible].cache = Jeu.adverse.main[cible].camouflage = false;
                            deplacer(carte, "joueur", "terrain");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    let verifier = false;
                    for (let n = 0; n < Jeu.joueur.main.length; n++) {
                        if (Jeu.joueur.main[n].cache) {
                            verifier = true;
                        }
                    }
                    if (verifier) {
                        let best = 0;
                        while (!Jeu.joueur.main[best].cache) {
                            best++;
                        }
                        Jeu.joueur.main[best].cache = Jeu.joueur.main[best].camouflage = false;
                    }
                    deplacer(carte, "adverse", "terrain");
                    effet_pose(carte);
                    return true;
                }
            }
            break;
        case 262:
            carte.nom = "Voyante";
            carte.familles.push("Kalashtar");
            carte.cout[0] = 2;
            carte.cout[8] = 2;
            carte.vente[0] = 1;
            carte.vente[8] = 1;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Révèle une carte adverse dans la boutique.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            let verifier = false;
                            for (let n = 0; n < Jeu.adverse.boutique.length; n++) {
                                if (Jeu.adverse.boutique[n].cache) {
                                    verifier = true;
                                }
                            }
                            if (verifier) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une carte adverse dans la boutique : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Boutique adverse :</u>");
                                saut();
                                for (let n = 0; n < Jeu.adverse.boutique.length; n++) {
                                    div("", "carte");
                                    div();
                                    if (!Jeu.adverse.boutique[n].cache) {
                                        afficher_carte("adverse", "boutique", n);
                                    }
                                    else {
                                        afficher("???");
                                    }
                                    div_fin();
                                    if (Jeu.adverse.boutique[n].cache) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            else {
                                deplacer(carte, "joueur", "terrain");
                                effet_pose(carte);
                                menu();
                            }
                            break;
                        case 2:
                            Jeu.adverse.boutique[cible].cache = Jeu.adverse.boutique[cible].camouflage = false;
                            deplacer(carte, "joueur", "terrain");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    let verifier = false;
                    for (let n = 0; n < Jeu.joueur.boutique.length; n++) {
                        if (Jeu.joueur.boutique[n].cache) {
                            verifier = true;
                        }
                    }
                    if (verifier) {
                        let best = 0;
                        while (!Jeu.joueur.boutique[best].cache) {
                            best++;
                        }
                        Jeu.joueur.boutique[best].cache = Jeu.joueur.boutique[best].camouflage = false;
                    }
                    deplacer(carte, "adverse", "terrain");
                    effet_pose(carte);
                    return true;
                }
            }
            break;
        case 263:
            carte.nom = "Prédiction";
            carte.type = "Action";
            carte.cout[0] = 3;
            carte.cout[8] = 3;
            carte.vente[0] = 2;
            carte.vente[8] = 1;
            carte.texte = "Révèle 3 cartes adverses dans la boutique.";
            carte.effet_pose = function () {
                let verifier = false;
                for (let n = 0; n < Jeu[camp_oppose(carte.camp)].boutique.length; n++) {
                    if (Jeu[camp_oppose(carte.camp)].boutique[n].cache) {
                        verifier = true;
                    }
                }
                if (verifier) {
                    let compteur = 3;
                    for (let n = 0; n < Jeu[camp_oppose(carte.camp)].boutique.length; n++) {
                        if (Jeu[camp_oppose(carte.camp)].boutique[n].cache && compteur > 0) {
                            Jeu[camp_oppose(carte.camp)].boutique[n].cache = Jeu[camp_oppose(carte.camp)].boutique[n].camouflage = false;
                            compteur--;
                        }
                    }
                    deplacer(carte, carte.camp, "defausse");
                    effet_pose(carte);
                    menu();
                    return true;
                }
                return false;
            }
            break;
        case 264:
            carte.nom = "Écouter aux portes";
            carte.type = "Action";
            carte.cout[0] = 6;
            carte.vente[0] = 3;
            carte.texte = "Révèle 3 cartes adverses dans la main.";
            carte.effet_pose = function () {
                let verifier = false;
                for (let n = 0; n < Jeu[camp_oppose(carte.camp)].main.length; n++) {
                    if (Jeu[camp_oppose(carte.camp)].main[n].cache) {
                        verifier = true;
                    }
                }
                if (verifier) {
                    let compteur = 3;
                    for (let n = 0; n < Jeu[camp_oppose(carte.camp)].main.length; n++) {
                        if (Jeu[camp_oppose(carte.camp)].main[n].cache && compteur > 0) {
                            Jeu[camp_oppose(carte.camp)].main[n].cache = Jeu[camp_oppose(carte.camp)].main[n].camouflage = false;
                            compteur--;
                        }
                    }
                    deplacer(carte, carte.camp, "defausse");
                    effet_pose(carte);
                    menu();
                    return true;
                }
                return false;
            }
            break;
        case 265:
            carte.nom = "Espionnage";
            carte.type = "Action";
            carte.cout[0] = 20;
            carte.vente[0] = 10;
            carte.texte = "Révèle toutes les cartes adverses dans la main.";
            carte.effet_pose = function () {
                let verifier = false;
                for (let n = 0; n < Jeu[camp_oppose(carte.camp)].main.length; n++) {
                    if (Jeu[camp_oppose(carte.camp)].main[n].cache) {
                        verifier = true;
                    }
                }
                if (verifier) {
                    for (let n = 0; n < Jeu[camp_oppose(carte.camp)].main.length; n++) {
                        if (Jeu[camp_oppose(carte.camp)].main[n].cache) {
                            Jeu[camp_oppose(carte.camp)].main[n].cache = Jeu[camp_oppose(carte.camp)].main[n].camouflage = false;
                        }
                    }
                    deplacer(carte, carte.camp, "defausse");
                    effet_pose(carte);
                    menu();
                    return true;
                }
                return false;
            }
            break;
        case 266:
            carte.nom = "Visions de l'avenir";
            carte.type = "Action";
            carte.cout[0] = 10;
            carte.cout[8] = 10;
            carte.vente[0] = 5;
            carte.vente[8] = 5;
            carte.texte = "Révèle toutes les cartes adverses dans la boutique.";
            carte.effet_pose = function () {
                let verifier = false;
                for (let n = 0; n < Jeu[camp_oppose(carte.camp)].boutique.length; n++) {
                    if (Jeu[camp_oppose(carte.camp)].boutique[n].cache) {
                        verifier = true;
                    }
                }
                if (verifier) {
                    for (let n = 0; n < Jeu[camp_oppose(carte.camp)].boutique.length; n++) {
                        if (Jeu[camp_oppose(carte.camp)].boutique[n].cache) {
                            Jeu[camp_oppose(carte.camp)].boutique[n].cache = Jeu[camp_oppose(carte.camp)].boutique[n].camouflage = false;
                        }
                    }
                    deplacer(carte, carte.camp, "defausse");
                    effet_pose(carte);
                    menu();
                    return true;
                }
                return false;
            }
            break;
        case 267:
            carte.nom = "Révélation";
            carte.type = "Action";
            carte.cout[0] = 2;
            carte.cout[10] = 1;
            carte.vente[0] = 1;
            carte.texte = "Enlève Camouflage à une Unité adverse sur le terrain.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            let verifier = false;
                            for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                                if (Jeu.adverse.terrain[n].camouflage) {
                                    verifier = true;
                                }
                            }
                            if (verifier) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Unité adverse sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain adverse :</u>");
                                saut();
                                for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        afficher_carte("adverse", "terrain", n);
                                    }
                                    else {
                                        afficher("???");
                                    }
                                    div_fin();
                                    if (Jeu.adverse.terrain[n].camouflage) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.adverse.terrain[cible].camouflage = false;
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    let verifier = false;
                    for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                        if (Jeu.joueur.terrain[n].camouflage) {
                            verifier = true;
                        }
                    }
                    if (verifier) {
                        let best = 0;
                        while (!(Jeu.joueur.terrain[best].camouflage && !Jeu.joueur.terrain[best].silence)) {
                            best++;
                        }
                        Jeu.joueur.terrain[best].camouflage = false;
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 268:
            carte.nom = "Dissiper les ombres";
            carte.type = "Action";
            carte.cout[0] = 15;
            carte.cout[10] = 15;
            carte.vente[0] = 8;
            carte.vente[10] = 7;
            carte.texte = "Enlève Camouflage à toutes les Unités adverses sur le terrain.";
            carte.effet_pose = function () {
                let verifier = false;
                for (let n = 0; n < Jeu[camp_oppose(carte.camp)].terrain.length; n++) {
                    if (Jeu[camp_oppose(carte.camp)].terrain[n].camouflage) {
                        verifier = true;
                    }
                }
                if (verifier) {
                    for (let n = 0; n < Jeu[camp_oppose(carte.camp)].terrain.length; n++) {
                        if (Jeu[camp_oppose(carte.camp)].terrain[n].cache) {
                            Jeu[camp_oppose(carte.camp)].terrain[n].camouflage = false;
                        }
                    }
                    deplacer(carte, carte.camp, "defausse");
                    effet_pose(carte);
                    menu();
                    return true;
                }
                return false;
            }
            break;
        case 269:
            carte.nom = "Carte";
            carte.type = "Objet";
            carte.cout[0] = 4;
            carte.vente[0] = 2;
            carte.texte = "Bannis toutes les cartes alliées dans la boutique et pioche 4 cartes.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    Jeu.joueur.boutique = [];
                    pioches("joueur", 4);
                    deplacer(carte, "joueur", "defausse");
                    effet_pose(carte);
                    menu();
                }
                return false;
            }
            break;
        case 270:
            carte.nom = "Voleur";
            carte.familles.push("Humain");
            carte.cout[0] = 5;
            carte.vente[0] = 2;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Enlève 2 Or à l'adversaire.";
            carte.effet_pose = function () {
                Jeu[camp_oppose(carte.camp)].ressources[0].courant -= 2;
                if (Jeu[camp_oppose(carte.camp)].ressources[0].courant < 0) {
                    Jeu[camp_oppose(carte.camp)].ressources[0].courant = 0;
                }
                deplacer(carte, carte.camp, "terrain");
                effet_pose(carte);
                menu();
                return true;
            }
            break;
        case 271:
            carte.nom = "Vol à la tire";
            carte.type = "Action";
            carte.cout[0] = 6;
            carte.vente[0] = 3;
            carte.texte = "Enlève 5 Or à l'adversaire.";
            carte.effet_pose = function () {
                if (Jeu[camp_oppose(carte.camp)].ressources[0].courant > 0) {
                    Jeu[camp_oppose(carte.camp)].ressources[0].courant -= 5;
                    if (Jeu[camp_oppose(carte.camp)].ressources[0].courant < 0) {
                        Jeu[camp_oppose(carte.camp)].ressources[0].courant = 0;
                    }
                    deplacer(carte, carte.camp, "defausse");
                    effet_pose(carte);
                    menu();
                    return true;
                }
                return false;
            }
            break;
        case 272:
            carte.nom = "Bourse";
            carte.type = "Objet";
            carte.cout[0] = 10;
            carte.vente[0] = 5;
            carte.texte = "Ajoute 5 Or en réserve.";
            carte.effet_pose = function () {
                Jeu[carte.camp].ressources[0].reserve += 5;
                deplacer(carte, carte.camp, "defausse");
                effet_pose(carte);
                menu();
                return true;
            }
            break;
        case 273:
            carte.nom = "Pièce de monnaie";
            carte.type = "Objet";
            carte.cout[0] = 2;
            carte.vente[0] = 1;
            carte.texte = "Ajoute 1 Or en réserve.";
            carte.effet_pose = function () {
                Jeu[carte.camp].ressources[0].reserve++;
                deplacer(carte, carte.camp, "defausse");
                effet_pose(carte);
                menu();
                return true;
            }
            break;
        case 274:
            carte.nom = "Banquier";
            carte.familles.push("Humain");
            carte.cout[0] = 9;
            carte.vente[0] = 4;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Au début de la phase de préparation : Donne 1 Or max.";
            carte.effet_etage_debut = function () {
                Jeu[carte.camp].ressources[0].max++;
            }
            break;
        case 275:
            carte.nom = "Banque";
            carte.type = "Bâtiment";
            carte.cout[0] = 21;
            carte.vente[0] = 10;
            carte.vie_max = carte.vie = 4;
            carte.equipement_max = 1;
            carte.texte = "Au début de la phase de préparation : Donne 3 Or max.";
            carte.effet_etage_debut = function () {
                Jeu[carte.camp].ressources[0].max += 3;
            }
            break;
        case 276:
            carte.nom = "Trésor";
            carte.type = "Objet";
            carte.cout[0] = 7;
            carte.vente[0] = 3;
            carte.texte = "Pioche 3 cartes.<br/>ou<br/>Donne 2 Or max.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            initialiser();
                            div("main");
                            fonction("Annuler", "menu()");
                            saut(2);
                            afficher(carte.nom);
                            saut();
                            afficher(carte.texte);
                            saut(2);
                            afficher("Choisissez un effet : ");
                            saut(2);
                            fonction("Pioche 3 cartes", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2)");
                            saut();
                            afficher("ou");
                            saut();
                            fonction("Donne 2 Or max", "Jeu.joueur.main[" + carte.slot + "].effet_pose(3)");
                            div_fin();
                            div("side", "affichage");
                            div_fin();
                            actualiser();
                            break;
                        case 2:
                            pioches("joueur", 3);
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                        case 3:
                            Jeu.joueur.ressources[0].max += 2;
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    Jeu.adverse.ressources[0].max += 2;
                    deplacer(carte, "joueur", "defausse");
                    effet_pose(carte);
                    menu();
                    return true;
                }
            }
            break;
        case 277:
            carte.nom = "Pillage";
            carte.type = "Action";
            carte.cout[0] = 10;
            carte.vente[0] = 5;
            carte.texte = "Ajoute autant d'Or que de carte dans la défausse adverse.";
            carte.effet_pose = function () {
                Jeu[carte.camp].ressources[0].courant += Jeu[camp_oppose(carte.camp)].defausse.length;
                deplacer(carte, carte.camp, "defausse");
                effet_pose(carte);
                menu();
                return true;
            }
            break;
        case 278:
            carte.nom = "Lingot d'or";
            carte.type = "Objet";
            carte.cout[0] = 20;
            carte.vente[0] = 10;
            carte.texte = "Ajoute 10 Or en réserve.";
            carte.effet_pose = function () {
                Jeu[carte.camp].ressources[0].reserve += 10;
                deplacer(carte, carte.camp, "defausse");
                effet_pose(carte);
                menu();
                return true;
            }
            break;
        case 279:
            carte.nom = "Colère";
            carte.type = "Action";
            carte.cout[0] = 5;
            carte.vente[0] = 2;
            carte.texte = "Inflige autant de dégâts à une Unité adverse sur le terrain que de vie manquante du meneur allié.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_cible("adverse", "terrain") && Jeu.joueur.vie < Jeu.joueur.vie_max) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Unité adverse sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain adverse :</u>");
                                saut();
                                for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        afficher_carte("adverse", "terrain", n);
                                    }
                                    else {
                                        afficher("???");
                                    }
                                    div_fin();
                                    if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            degats(Jeu.adverse.terrain[cible], Jeu.joueur.vie_max - Jeu.joueur.vie);
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_cible("joueur", "terrain") && Jeu.adverse.vie < Jeu.adverse.vie_max) {
                        let best = 0;
                        while (Jeu.joueur.terrain[best].camouflage && !Jeu.joueur.terrain[best].silence) {
                            best++;
                        }
                        let dif_vie = Jeu.adverse.vie_max - Jeu.adverse.vie;
                        for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                            if ((Jeu.joueur.terrain[n].vie <= dif_vie && Jeu.joueur.terrain[best].vie > dif_vie) || Jeu.joueur.terrain[n].vie > Jeu.joueur.terrain[best].vie && (!Jeu.joueur.terrain[n].camouflage || Jeu.joueur.terrain[n].silence)) {
                                best = n;
                            }
                        }
                        degats(Jeu.joueur.terrain[best], dif_vie);
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 280:
            carte.nom = "Coffre doré";
            carte.type = "Objet";
            carte.cout[0] = 3;
            carte.vente[0] = 1;
            carte.texte = "Pioche une carte du niveau de boutique actuel.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    let nouvelle_carte = boutique_generer();
                    while (cout_total(nouvelle_carte) <= (Jeu.boutique_niveau - 1) * 5 || cout_total(nouvelle_carte) > Jeu.boutique_niveau * 5) {
                        nouvelle_carte = boutique_generer();
                    }
                    pioche("joueur", nouvelle_carte);
                    deplacer(carte, "joueur", "defausse");
                    effet_pose(carte);
                    menu();
                }
                return false;
            }
            break;
        case 281:
            carte.nom = "Rage";
            carte.type = "Action";
            carte.cout[0] = 5;
            carte.vente[0] = 2;
            carte.texte = "Donne autant d'attaque à une Créature alliée qu'elle a de vie manquante sur le terrain jusqu'à la fin de la phase de combat.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            let verifier = false;
                            for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].vie_max > Jeu.joueur.terrain[n].vie) {
                                    verifier = true;
                                }
                            }
                            if (verifier) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].vie_max > Jeu.joueur.terrain[n].vie) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.joueur.terrain[cible].stat_etage.attaque += Jeu.joueur.terrain[cible].vie_max - Jeu.joueur.terrain[cible].vie;
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    let verifier = false;
                    for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                        if (Jeu.adverse.terrain[n].type == "Créature" && Jeu.adverse.terrain[n].vie_max > Jeu.adverse.terrain[n].vie) {
                            verifier = true;
                        }
                    }
                    if (verifier) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[n].vie_max <= Jeu.adverse.terrain[n].vie) {
                            best++;
                        }
                        for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                            if (Jeu.adverse.terrain[n].type == "Créature" && Jeu.adverse.terrain[n].vie_max > Jeu.adverse.terrain[n].vie && (Jeu.adverse.terrain[n].vie_max - Jeu.adverse.terrain[n].vie) > (Jeu.adverse.terrain[best].vie_max - Jeu.adverse.terrain[best].vie)) {
                                best = n;
                            }
                        }
                        Jeu.adverse.terrain[best].stat_etage.attaque += Jeu.adverse.terrain[best].vie_max - Jeu.adverse.terrain[best].vie;
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 282:
            carte.nom = "Envie";
            carte.type = "Action";
            carte.cout[0] = 20;
            carte.vente[0] = 10;
            carte.texte = "Place une carte adverse dans la main dans la main alliée.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (Jeu.adverse.main.length > 0) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une carte adverse dans la main : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Main adverse :</u>");
                                saut();
                                for (let n = 0; n < Jeu.adverse.main.length; n++) {
                                    div("", "carte");
                                    div();
                                    if (!Jeu.adverse.main[n].cache) {
                                        afficher_carte("adverse", "main", n);
                                    }
                                    else {
                                        afficher("???");
                                    }
                                    div_fin();
                                    if (Jeu.adverse.main[n].cache) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.adverse.main[cible].cache = Jeu.adverse.main[cible].camouflage = false;
                            deplacer(Jeu.adverse.main[cible], "joueur", "main");
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (Jeu.joueur.main.length > 0) {
                        let best = 0;
                        for (let n = 0; n < Jeu.joueur.main.length; n++) {
                            if (!Jeu.joueur.main[n].cache && (Jeu.joueur.main[best].cache || (cout_total(Jeu.joueur.main[n]) > cout_total(Jeu.joueur.main[best])))) {
                                best = n;
                            }
                        }
                        Jeu.joueur.main[best].cache = Jeu.joueur.main[best].camouflage = false;
                        deplacer(Jeu.joueur.main[best], "adverse", "main");
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 283:
            carte.nom = "Éclosion";
            carte.type = "Action";
            carte.familles.push("Oeuf");
            carte.cout[0] = 6;
            carte.vente[0] = 3;
            carte.texte = "Met le décompte d'un Bâtiment allié Oeuf sur le terrain à 0.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            let verifier = false;
                            for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                if (Jeu.joueur.terrain[n].type == "Bâtiment" && Jeu.joueur.terrain[n].familles.includes("Oeuf")) {
                                    verifier = true;
                                }
                            }
                            if (verifier) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez un Bâtiment allié Oeuf sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Bâtiment" && Jeu.joueur.terrain[n].familles.includes("Oeuf")) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.joueur.terrain[cible].decompte = 0;
                            Jeu.joueur.terrain[cible].effet_decompte();
                            if (Jeu.joueur.terrain[cible].vie == 0) {
                                mort(Jeu.joueur.terrain[cible]);
                            }
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    let verifier = false;
                    for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                        if (Jeu.adverse.terrain[n].type == "Bâtiment" && Jeu.adverse.terrain[n].familles.includes("Oeuf")) {
                            verifier = true;
                        }
                    }
                    if (verifier) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Bâtiment" || !Jeu.adverse.terrain[best].familles.includes("Oeuf")) {
                            best++;
                        }
                        Jeu.adverse.terrain[best].decompte = 0;
                        Jeu.adverse.terrain[best].effet_decompte();
                        if (Jeu.adverse.terrain[best].vie == 0) {
                            mort(Jeu.adverse.terrain[best]);
                        }
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 284:
            carte.nom = "Potion d'attaque";
            carte.type = "Objet";
            carte.familles.push("Potion");
            carte.cout[0] = 3;
            carte.vente[0] = 1;
            carte.texte = "Donne 6 attaque à une Créature alliée sur le terrain jusqu'à la fin de la phase de combat.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (Jeu.joueur.terrain.length > 0) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée blessée sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature") {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.joueur.terrain[cible].stat_etage.attaque = 6;
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (Jeu.adverse.terrain.lengt > 0) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature") {
                            best++;
                        }
                        Jeu.adverse.terrain[best].stat_etage.attaque = 6;
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 285:
            carte.nom = "Potion de défense";
            carte.type = "Objet";
            carte.familles.push("Potion");
            carte.cout[0] = 4;
            carte.vente[0] = 2;
            carte.texte = "Donne 4 défense à une Créature alliée sur le terrain jusqu'à la fin de la phase de combat.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (Jeu.joueur.terrain.length > 0) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée blessée sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature") {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.joueur.terrain[cible].stat_etage.defense = 4;
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (Jeu.adverse.terrain.lengt > 0) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature") {
                            best++;
                        }
                        Jeu.adverse.terrain[best].stat_etage.defense = 4;
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 286:
            carte.nom = "Potion de vitalité";
            carte.type = "Objet";
            carte.familles.push("Potion");
            carte.cout[0] = 3;
            carte.vente[0] = 1;
            carte.texte = "Donne 6 vie à une Créature alliée sur le terrain jusqu'à la fin de la phase de combat.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (Jeu.joueur.terrain.length > 0) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée blessée sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature") {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.joueur.terrain[cible].stat_etage.vie_max = 6;
                            Jeu.joueur.terrain[cible].vie += 6;
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (Jeu.adverse.terrain.lengt > 0) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature") {
                            best++;
                        }
                        Jeu.adverse.terrain[best].stat_etage.vie_max = 6;
                        Jeu.adverse.terrain[best].vie += 6;
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 287:
            carte.nom = "Alchimiste";
            carte.familles.push("Humain");
            carte.cout[0] = 6;
            carte.vente[0] = 3;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand posé : Pioche un Objet Potion.";
            carte.effet_pose = function () {
                if (carte.camp == "joueur") {
                    if (!statistique(carte, "silence")) {
                        let verifier = false;
                        for (let n = 0; n < Jeu.NOMBRE_CARTE; n++) {
                            if (Jeu.joueur.regions[Jeu.region_active].boutique_generer(obtenir_carte(n)) && obtenir_carte(n).familles.includes("Potion")) {
                                verifier = true;
                            }
                        }
                        if (verifier) {
                            let nouvelle_carte = boutique_generer();
                            while (!nouvelle_carte.familles.includes("Potion")) {
                                nouvelle_carte = boutique_generer();
                            }
                            pioche("joueur", nouvelle_carte);
                        }
                    }
                    deplacer(carte, "joueur", "terrain");
                    effet_pose(carte);
                    menu();
                }
                else {
                    deplacer(carte, "adverse", "terrain");
                    effet_pose(carte);
                    return true;
                }
            }
            break;
        case 288:
            carte.nom = "Vendeur";
            carte.type = "Créature";
            carte.familles.push("Humain");
            carte.cout[0] = 3;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand vendu : Pioche une carte.";
            carte.effet_vente = function () {
                pioche("joueur");
            }
            break;
        case 289:
            carte.nom = "Vendeur de potion";
            carte.type = "Créature";
            carte.familles.push("Humain");
            carte.cout[0] = 4;
            carte.attaque = 2;
            carte.vie_max = carte.vie = 2;
            carte.action_max = 1;
            carte.equipement_max = 1;
            carte.texte = "Quand vendu : Pioche un Objet Potion.";
            carte.effet_vente = function () {
                let verifier = false;
                for (let n = 0; n < Jeu.NOMBRE_CARTE; n++) {
                    if (Jeu.joueur.regions[Jeu.region_active].boutique_generer(obtenir_carte(n)) && obtenir_carte(n).familles.includes("Potion")) {
                        verifier = true;
                    }
                }
                if (verifier) {
                    let nouvelle_carte = boutique_generer();
                    while (!nouvelle_carte.familles.includes("Potion")) {
                        nouvelle_carte = boutique_generer();
                    }
                    pioche("joueur", nouvelle_carte);
                }
            }
            break;
        case 290:
            carte.nom = "Grimoire d'apprenti";
            carte.type = "Objet";
            carte.familles.push("Équipement", "Arme");
            carte.cout[0] = 4;
            carte.vente[0] = 2;
            carte.stat_equipement.effet_etage_debut = function () {
                if (carte.camp == "joueur") {
                    let verifier = false;
                    for (let n = 0; n < Jeu.NOMBRE_CARTE; n++) {
                        if (Jeu.joueur.regions[Jeu.region_active].boutique_generer(obtenir_carte(n)) && obtenir_carte(n).familles.includes("Sort")) {
                            verifier = true;
                        }
                    }
                    let nouvelle_carte = boutique_generer();
                    while (!nouvelle_carte.familles.includes("Sort")) {
                        nouvelle_carte = boutique_generer();
                    }
                    pioche("joueur", nouvelle_carte);
                }
            }
            carte.texte = "Applique l'effet suivant à la Créature équipée : Au début de la phase de préparation : Pioche 1 Action Sort.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_equipement("joueur")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée équipable sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].equipements.length < Jeu.joueur.terrain[n].equipement_max) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            equiper(Jeu.joueur.terrain[cible], carte);
                            effet_pose(carte);
                            enlever(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_equipement("adverse")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].equipements.length >= Jeu.adverse.terrain[best].equipement_max) {
                            best++;
                        }
                        equiper(Jeu.adverse.terrain[best], carte);
                        effet_pose(carte);
                        enlever(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 291:
            carte.nom = "Fouet de cuir";
            carte.type = "Objet";
            carte.familles.push("Équipement", "Arme");
            carte.cout[0] = 4;
            carte.vente[0] = 2;
            carte.stat_equipement.effet_attaque = function (defenseur) {
                if (defenseur.slot > 0) {
                    degats(Jeu[defenseur.camp].terrain[defenseur.slot - 1], 1);
                }
                if (defenseur.slot < Jeu[defenseur.camp].terrain.length) {
                    degats(Jeu[defenseur.camp].terrain[defenseur.slot + 1], 1);
                }
            }
            carte.texte = "Applique l'effet suivant à la Créature équipée : Inflige 1 dégât aux Unités en avant et en arrière de l'Unité attaquée.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_equipement("joueur")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée équipable sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].equipements.length < Jeu.joueur.terrain[n].equipement_max) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            equiper(Jeu.joueur.terrain[cible], carte);
                            effet_pose(carte);
                            enlever(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_equipement("adverse")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].equipements.length >= Jeu.adverse.terrain[best].equipement_max) {
                            best++;
                        }
                        equiper(Jeu.adverse.terrain[best], carte);
                        effet_pose(carte);
                        enlever(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 292:
            carte.nom = "Casque en cuir";
            carte.type = "Objet";
            carte.familles.push("Équipement", "Armure");
            carte.cout[0] = 4;
            carte.vente[0] = 2;
            carte.stat_equipement.vie_max = 2;
            carte.texte = "Donne 2 vie à la Créature équipée.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_equipement("joueur")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée équipable sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].equipements.length < Jeu.joueur.terrain[n].equipement_max) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            Jeu.joueur.terrain[cible].vie += 2;
                            equiper(Jeu.joueur.terrain[cible], carte);
                            effet_pose(carte);
                            enlever(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_equipement("adverse")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].equipements.length >= Jeu.adverse.terrain[best].equipement_max) {
                            best++;
                        }
                        Jeu.adverse.terrain[best].vie += 2;
                        equiper(Jeu.adverse.terrain[best], carte);
                        effet_pose(carte);
                        enlever(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 293:
            carte.nom = "Pistolet en cuivre";
            carte.type = "Objet";
            carte.familles.push("Équipement", "Arme");
            carte.cout[0] = 5;
            carte.vente[0] = 2;
            carte.stat_equipement.portee = true;
            carte.stat_equipement.effet_attaque = function (defenseur) {
                degats(defenseur, 1);
            }
            carte.texte = "Applique Portée et l'effet suivant à la Créature équipée : Quand attaque : Inflige 2 dégât à l'unité attaquée.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_equipement("joueur")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée équipable sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].equipements.length < Jeu.joueur.terrain[n].equipement_max) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            equiper(Jeu.joueur.terrain[cible], carte);
                            effet_pose(carte);
                            enlever(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_equipement("adverse")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].equipements.length >= Jeu.adverse.terrain[best].equipement_max) {
                            best++;
                        }
                        equiper(Jeu.adverse.terrain[best], carte);
                        effet_pose(carte);
                        enlever(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 294:
            carte.nom = "Arbalète en bois";
            carte.type = "Objet";
            carte.familles.push("Équipement", "Arme");
            carte.cout[0] = 4;
            carte.vente[0] = 2;
            carte.stat_equipement.portee = true;
            carte.stat_equipement.percee = 2;
            carte.stat_equipement.attaque = 2;
            carte.texte = "Donne 2 attaque et applique Portée et Percée 2 à la créature équipée.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_equipement("joueur")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée équipable sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].equipements.length < Jeu.joueur.terrain[n].equipement_max) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            equiper(Jeu.joueur.terrain[cible], carte);
                            effet_pose(carte);
                            enlever(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_equipement("adverse")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].equipements.length >= Jeu.adverse.terrain[best].equipement_max) {
                            best++;
                        }
                        equiper(Jeu.adverse.terrain[best], carte);
                        effet_pose(carte);
                        enlever(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 295:
            carte.nom = "Pluie de feu";
            carte.type = "Action";
            carte.familles.push("Sort");
            carte.cout[0] = 11;
            carte.cout[1] = 10;
            carte.vente[0] = 5;
            carte.vente[1] = 5;
            carte.texte = "Inflige 2 dégâts à toutes les Unités adverses sur le terrain.<br/>Sorcellerie 10 : Inflige 3 dégâts à toutes les Unités adverses sur le terrain.";
            carte.effet_pose = function () {
                if (Jeu[camp_oppose(carte.camp)].terrain.length > 0) {
                    if (sorcellerie(carte.camp) >= 10) {
                        for (let n = 0; n < Jeu[camp_oppose(carte.camp)].terrain.length; n++) {
                            if (degats(Jeu[camp_oppose(carte.camp)].terrain[n], 3).mort) {
                                n--;
                            }
                        }
                    }
                    else {
                        for (let n = 0; n < Jeu[camp_oppose(carte.camp)].terrain.length; n++) {
                            if (degats(Jeu[camp_oppose(carte.camp)].terrain[n], 2).mort) {
                                n--;
                            }
                        }
                    }
                    deplacer(carte, carte.camp, "defausse");
                    effet_pose(carte);
                    menu();
                    return true;
                }
                return false;
            }
            break;
        case 296:
            carte.nom = "Éruption";
            carte.type = "Action";
            carte.familles.push("Sort");
            carte.cout[0] = 6;
            carte.cout[1] = 5;
            carte.vente[0] = 3;
            carte.vente[1] = 2;
            carte.texte = "Inflige 10 dégâts à une Unité adverse sur le terrain.<br/>Sorcellerie 10 : Inflige 20 dégâts à une Unité adverse sur le terrain.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_cible("adverse", "terrain")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Unité adverse sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain adverse :</u>");
                                saut();
                                for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        afficher_carte("adverse", "terrain", n);
                                    }
                                    else {
                                        afficher("???");
                                    }
                                    div_fin();
                                    if (!Jeu.adverse.terrain[n].camouflage || Jeu.adverse.terrain[n].silence) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            let carte_cible = Jeu.adverse.terrain[cible];
                            if (sorcellerie("joueur") >= 10) {
                                degats(carte_cible, 20);
                            }
                            else {
                                degats(carte_cible, 10);
                            }
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_cible("joueur", "terrain")) {
                        let best = 0;
                        while (Jeu.joueur.terrain[best].camouflage && !Jeu.joueur.terrain[best].silence) {
                            best++;
                        }
                        if (sorcellerie("adverse") >= 2) {
                            for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                if ((Jeu.joueur.terrain[n].vie <= 20 && Jeu.joueur.terrain[best].vie > 20) || Jeu.joueur.terrain[n].vie > Jeu.joueur.terrain[best].vie && (!Jeu.joueur.terrain[n].camouflage || Jeu.joueur.terrain[n].silence)) {
                                    best = n;
                                }
                            }
                            degats(Jeu.joueur.terrain[best], 20);
                        }
                        else {
                            for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                if ((Jeu.joueur.terrain[n].vie <= 10 && Jeu.joueur.terrain[best].vie > 10) || Jeu.joueur.terrain[n].vie > Jeu.joueur.terrain[best].vie && (!Jeu.joueur.terrain[n].camouflage || Jeu.joueur.terrain[n].silence)) {
                                    best = n;
                                }
                            }
                            degats(Jeu.joueur.terrain[best], 10);
                        }
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 297:
            carte.nom = "Bulle protectrice";
            carte.type = "Action";
            carte.familles.push("Sort");
            carte.cout[0] = 3;
            carte.cout[2] = 3;
            carte.vente[0] = 2;
            carte.vente[2] = 1;
            carte.texte = "Donne 10 vie supplémentaire à une Créature alliée sur le terrain.<br/>Sorcellerie 5 : Donne 20 vie supplémentaire à une Créature alliée sur le terrain.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_creature("joueur", "terrain")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature") {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            if (sorcellerie("joueur") >= 5) {
                                Jeu.joueur.terrain[cible].vie_sup = 20;
                            }
                            else {
                                Jeu.joueur.terrain[cible].vie_sup = 10;
                            }
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_creature("adverse", "terrain")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature") {
                            best++;
                        }
                        if (sorcellerie("adverse") >= 5) {
                            Jeu.adverse.terrain[best].vie_sup = 20;
                        }
                        else {
                            Jeu.adverse.terrain[best].vie_sup = 10;
                        }
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 298:
            carte.nom = "Vague déferlante";
            carte.type = "Action";
            carte.cout[0] = 10;
            carte.cout[2] = 10;
            carte.vente[0] = 5;
            carte.vente[2] = 5;
            carte.texte = "Inflige 2 dégâts à toutes les Unités adverses sur le terrain.";
            carte.effet_pose = function () {
                if (Jeu[camp_oppose(carte.camp)].terrain.length > 0) {
                    for (let n = 0; n < Jeu[camp_oppose(carte.camp)].terrain.length; n++) {
                        if (degats(Jeu[camp_oppose(carte.camp)].terrain[n], 2).mort) {
                            n--;
                        }
                    }
                    deplacer(carte, carte.camp, "defausse");
                    effet_pose(carte);
                    menu();
                    return true;
                }
                return false;
            }
            break;
        case 299:
            carte.nom = "Revigorer";
            carte.type = "Action";
            carte.cout[0] = 10;
            carte.cout[3] = 10;
            carte.vente[0] = 5;
            carte.vente[3] = 5;
            carte.texte = "Soigne totalement à une Créature alliée sur le terrain.";
            carte.effet_pose = function (step, cible) {
                if (carte.camp == "joueur") {
                    switch (step) {
                        case 1:
                            if (verifier_soin_creature("joueur")) {
                                initialiser();
                                div("main");
                                fonction("Annuler", "menu()");
                                saut(2);
                                afficher(carte.nom);
                                saut();
                                afficher(carte.texte);
                                saut(2);
                                afficher("Choisissez une Créature alliée blessée sur le terrain : ");
                                saut(2);
                                div("", "zone");
                                afficher("<u>Terrain :</u>");
                                saut();
                                for (let n = 0; n < Jeu.joueur.terrain.length; n++) {
                                    div("", "carte");
                                    div();
                                    afficher_carte("joueur", "terrain", n);
                                    div_fin();
                                    if (Jeu.joueur.terrain[n].type == "Créature" && Jeu.joueur.terrain[n].vie < Jeu.joueur.terrain[n].vie_max) {
                                        div();
                                        fonction("Cibler", "Jeu.joueur.main[" + carte.slot + "].effet_pose(2," + n + ")");
                                        div_fin();
                                    }
                                    div_fin();
                                }
                                div_fin();
                                div_fin();
                                div("side", "affichage");
                                div_fin();
                                actualiser();
                            }
                            break;
                        case 2:
                            soin(Jeu.joueur.terrain[cible], Jeu.joueur.terrain[cible].vie_max - Jeu.joueur.terrain[cible].vie);
                            deplacer(carte, "joueur", "defausse");
                            effet_pose(carte);
                            menu();
                            break;
                    }
                }
                else {
                    if (verifier_soin_creature("adverse")) {
                        let best = 0;
                        while (Jeu.adverse.terrain[best].type != "Créature" || Jeu.adverse.terrain[best].vie >= Jeu.adverse.terrain[best].vie_max) {
                            best++;
                        }
                        for (let n = 0; n < Jeu.adverse.terrain.length; n++) {
                            if ((Jeu.adverse.terrain[n].vie_max - Jeu.adverse.terrain[n].vie) > (Jeu.adverse.terrain[best].vie_max - Jeu.adverse.terrain[best].vie) && Jeu.adverse.terrain[n].type == "Créature") {
                                best = n;
                            }
                        }
                        soin(Jeu.adverse.terrain[best], Jeu.adverse.terrain[best].vie_max - Jeu.adverse.terrain[best].vie);
                        deplacer(carte, "adverse", "defausse");
                        effet_pose(carte);
                        return true;
                    }
                    return false;
                }
            }
            break;
        case 300:
            carte.nom = "Plantation";
            carte.type = "Action";
            carte.cout[0] = 8;
            carte.cout[3] = 7;
            carte.vente[0] = 4;
            carte.vente[3] = 3;
            carte.texte = "Pioche 5 cartes Plante.";
            carte.effet_pose = function () {
                let verifier = false;
                for (let n = 0; n < Jeu.NOMBRE_CARTE; n++) {
                    if (Jeu.joueur.regions[Jeu.region_active].boutique_generer(obtenir_carte(n)) && obtenir_carte(n).familles.includes("Plante")) {
                        verifier = true;
                    }
                }
                if (carte.camp == "joueur" && verifier) {
                    for (let n=0;n<5;n++) {
                        let nouvelle_carte = boutique_generer();
                        while (!nouvelle_carte.familles.includes("Plante")) {
                            nouvelle_carte = boutique_generer();
                        }
                        pioche("joueur", nouvelle_carte);
                    }
                    deplacer(carte, "joueur", "defausse");
                    effet_pose(carte);
                    menu();
                    return true;
                }
                return false;
            }
            break;
    }
    return carte;
}