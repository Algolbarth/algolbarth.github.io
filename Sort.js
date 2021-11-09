function obtenir_sort (sort_id,personnage) {
    let sort = {
        nom : "",
        id : sort_id,
        description : function () {
            afficher("");
        },
        condition : function () {
            return true;
        },
        use : function () {
            afficher("");
        },
    }
    switch (sort_id) {
        case 1:
            sort.nom = "Attaque";
            sort.description = function (character=true) {
                afficher("Inflige ");
                if (character) {
                    afficher((personnage.statistiques.attaque_mel + personnage.statistiques.force) + " ");
                }
                afficher("(100% de votre attaque en mêlée + 100% de votre force) dégats en mêlée à une cible. Coûte 2 actions.");
            }
            sort.condition = function () {return test_cout(personnage,2,0)}
            sort.use = function (spell,step=1,cible=undefined) {
                switch (step) {
                    case 1:
                        cible_ennemi(spell);
                        break;
                    case 2:
                        personnage.statistiques.action -= 2;
                        let degats = (personnage.statistiques.attaque_mel + personnage.statistiques.force) - Jeu.combat.liste[cible].statistiques.defense_mel;
                        if (degats <= 0) {
                            degats = 1;
                        }
                        Jeu.combat.liste[cible].statistiques.vie -= degats;
                        Jeu.combat.resultat = personnage.nom + " attaque et inflige " + degats + " dégats à " + Jeu.combat.liste[cible].nom;
                        if (Jeu.combat.liste[cible].statistiques.vie <= 0) {
                            Jeu.combat.liste[cible].mort = true;
                        }
                        resultat_combat();
                        break;
                }
            }
            break;
        case 2:
            sort.nom = "Tir";
            sort.description = function (character=true) {
                afficher("Inflige ");
                if (character) {
                    afficher((personnage.statistiques.attaque_dis + personnage.statistiques.agilite) + " ");
                }
                afficher("(100% de votre attaque à distance + 100% de votre agilité) dégats à distance à une cible. Coûte 2 actions.");
            }
            sort.condition = function () {return test_cout(personnage,2,0)}
            sort.use = function (spell,step=1,cible=undefined) {
                switch (step) {
                    case 1:
                        cible_ennemi(spell);
                        break;
                    case 2:
                        personnage.statistiques.action -= 2;
                        let degats = (personnage.statistiques.attaque_dis + personnage.statistiques.agilite) - Jeu.combat.liste[cible].statistiques.defense_dis;
                        if (degats <= 0) {
                            degats = 1;
                        }
                        Jeu.combat.liste[cible].statistiques.vie -= degats;
                        Jeu.combat.resultat = personnage.nom + " attaque et inflige " + degats + " dégats à " + Jeu.combat.liste[cible].nom;
                        if (Jeu.combat.liste[cible].statistiques.vie <= 0) {
                            Jeu.combat.liste[cible].mort = true;
                        }
                        resultat_combat();
                        break;
                }
            }
            break;
        case 3:
            sort.nom = "Tir d'arcane";
            sort.description = function (character=true) {
                afficher("Inflige ");
                if (character) {
                    afficher((personnage.statistiques.attaque_mag + personnage.statistiques.intelligence) + " ");
                }
                afficher("(100% de votre attaque magique + 100% de votre intelligence) dégats magiques à une cible. Coûte 2 actions.");
            }
            sort.condition = function () {return test_cout(personnage,2,0)}
            sort.use = function (spell,step=1,cible=undefined) {
                switch (step) {
                    case 1:
                        cible_ennemi(spell);
                        break;
                    case 2:
                        personnage.statistiques.action -= 2;
                        let degats = (personnage.statistiques.attaque_mag + personnage.statistiques.intelligence) - Jeu.combat.liste[cible].statistiques.defense_mag;
                        if (degats <= 0) {
                            degats = 1;
                        }
                        Jeu.combat.liste[cible].statistiques.vie -= degats;
                        Jeu.combat.resultat = personnage.nom + " attaque et inflige " + degats + " dégats à " + Jeu.combat.liste[cible].nom;
                        if (Jeu.combat.liste[cible].statistiques.vie <= 0) {
                            Jeu.combat.liste[cible].mort = true;
                        }
                        resultat_combat();
                        break;
                }
            }
            break;
        case 4:
            sort.nom = "Soin";
            sort.description = function () {
                afficher("Soigne 100 vie à une cible alliée. Coûte 3 actions et 10 mana.");
            }
            sort.condition = function () {return test_cout(personnage,3,10)}
            sort.use = function (spell,step=1,cible=undefined) {
                switch (step) {
                    case 1:
                        cible_allie(spell);
                        break;
                    case 2:
                        personnage.statistiques.action -= 3;
                        personnage.statistiques.mana -= 10;
                        Jeu.combat.liste[cible].statistiques.vie += 100;
                        if (Jeu.combat.liste[cible].statistiques.vie > Jeu.combat.liste[cible].statistiques.vie_max) {
                            Jeu.combat.liste[cible].statistiques.vie = Jeu.combat.liste[cible].statistiques.vie_max;
                        }
                        if (cible == 0) {
                            Jeu.combat.resultat = personnage.nom + " soigne 100 vie à " + Jeu.combat.liste[cible].nom;
                        }
                        resultat_combat();
                        break;
                }
            }
            break;
        case 5:
            sort.nom = "Attaque chargée";
            sort.description = function (character=true) {
                afficher("Inflige ");
                if (character) {
                    afficher(personnage.statistiques.attaque*2 + " ");
                }
                afficher(" (200% de votre attaque) dégats physiques à une cible. Coûte 3 actions et 10 mana.");
            }
            sort.condition = function () {return test_cout(personnage,3,10)}
            sort.use = function (spell,step=1,cible=undefined) {
                switch (step) {
                    case 1:
                        cible_ennemi(spell);
                        break;
                    case 2:
                        personnage.statistiques.action -= 3;
                        personnage.statistiques.mana -= 10;
                        let degats = personnage.statistiques.attaque*2 - Jeu.combat.liste[cible].statistiques.defense;
                        if (degats <= 0) {
                            degats = 1;
                        }
                        Jeu.combat.liste[cible].statistiques.vie -= degats;
                        Jeu.combat.resultat = personnage.nom + " attaque et inflige " + degats + " dégats à " + Jeu.combat.liste[cible].nom;
                        if (Jeu.combat.liste[cible].statistiques.vie <= 0) {
                            Jeu.combat.liste[cible].mort = true;
                        }
                        resultat_combat();
                        break;
                }
            }
            break;
    }
    return sort;
}

function test_cout (personnage,action,mana) {
    if (personnage.statistiques.action >= action && personnage.statistiques.mana >= mana) {
        return true;
    }
    return false;
}

function cible_ennemi (spell) {
    initialiser();
    afficher("Adversaires :");
    saut(1);
    for (let n=0;n<Jeu.combat.liste.length;n++) {
        if (Jeu.combat.liste[n].ennemi) {
            if (Jeu.combat.liste[n].mort) {
                afficher(Jeu.combat.liste[n].nom + " <i>mort</i>");
            }
            else {
                fonction(Jeu.combat.liste[n].nom,"Jeu.combat.liste[0].sorts[" + spell + "].use(" + spell + ",2," + n + ")");
            }
            saut(1);
        }
    }
    saut(1);
    fonction("Retour","choix_combat()");
    actualiser();
}

function cible_allie (spell) {
    initialiser();
    afficher("Alliés :");
    saut(1);
    for (let n=0;n<Jeu.combat.liste.length;n++) {
        if (!Jeu.combat.liste[n].ennemi) {
            if (Jeu.combat.liste[n].mort) {
                afficher(Jeu.combat.liste[n].nom + " <i>mort</i>");
            }
            else {
                fonction(Jeu.combat.liste[n].nom,"Jeu.combat.liste[0].sorts[" + spell + "].use(" + spell + ",2," + n + ")");
                afficher(" : " + Jeu.combat.liste[n].statistiques.vie + " / " + Jeu.combat.liste[n].statistiques.vie_max + " vie");
            }
            saut(1);
        }
    }
    saut(1);
    fonction("Retour","choix_combat()");
    actualiser();
}