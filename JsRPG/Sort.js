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
                afficher("(100% de votre attaque en mêlée + 50% de votre force) dégâts en mêlée à une cible. Coûte 2 actions.");
            }
            sort.condition = function () {return test_cout(personnage,2,0)}
            sort.use = function (spell,step=1,cible=undefined) {
                switch (step) {
                    case 1:
                        cible_ennemi(spell);
                        break;
                    case 2:
                        personnage.statistiques.action -= 2;
                        let crit = false;
                        let degats = parseInt(personnage.statistiques.attaque_mel + personnage.statistiques.force) - Jeu.combat.liste[cible].statistiques.defense_mel;
                        if (degats <= 0) {
                            degats = 1;
                        }
                        if (Math.random()*100 < personnage.statistiques.taux_crit - Jeu.combat.liste[cible].statistiques.resistance_crit) {
                            degats = parseInt(degats*personnage.statistiques.degat_crit/100);
                            crit = true;
                        }
                        Jeu.combat.liste[cible].statistiques.vie -= degats;
                        Jeu.combat.resultat = personnage.nom + " frappe";
                        if (crit) {
                            Jeu.combat.resultat += ", réussis un coup critique";
                        }
                        Jeu.combat.resultat += " et inflige " + degats + " dégâts à " + Jeu.combat.liste[cible].nom;
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
                afficher("(100% de votre attaque à distance + 50% de votre agilité) dégâts à distance à une cible. Coûte 2 actions.");
            }
            sort.condition = function () {return test_cout(personnage,2,0)}
            sort.use = function (spell,step=1,cible=undefined) {
                switch (step) {
                    case 1:
                        cible_ennemi(spell);
                        break;
                    case 2:
                        personnage.statistiques.action -= 2;
                        let crit = false;
                        let degats = parseInt(personnage.statistiques.attaque_dis + personnage.statistiques.agilite) - Jeu.combat.liste[cible].statistiques.defense_dis;
                        if (degats <= 0) {
                            degats = 1;
                        }
                        if (Math.random()*100 < personnage.statistiques.taux_crit - Jeu.combat.liste[cible].statistiques.resistance_crit) {
                            degats = parseInt(degats*personnage.statistiques.degat_crit/100);
                            crit = true;
                        }
                        Jeu.combat.liste[cible].statistiques.vie -= degats;
                        Jeu.combat.resultat = personnage.nom + " tir";
                        if (crit) {
                            Jeu.combat.resultat += ", réussis un coup critique";
                        }
                        Jeu.combat.resultat += " et inflige " + degats + " dégâts à " + Jeu.combat.liste[cible].nom;
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
                afficher("(100% de votre attaque magique + 50% de votre intelligence) dégâts magiques à une cible. Coûte 2 actions.");
            }
            sort.condition = function () {return test_cout(personnage,2,0)}
            sort.use = function (spell,step=1,cible=undefined) {
                switch (step) {
                    case 1:
                        cible_ennemi(spell);
                        break;
                    case 2:
                        personnage.statistiques.action -= 2;
                        let crit = false;
                        let degats = parseInt(personnage.statistiques.attaque_mag + personnage.statistiques.intelligence) - Jeu.combat.liste[cible].statistiques.defense_mag;
                        if (degats <= 0) {
                            degats = 1;
                        }
                        if (Math.random()*100 < personnage.statistiques.taux_crit - Jeu.combat.liste[cible].statistiques.resistance_crit) {
                            degats = parseInt(degats*personnage.statistiques.degat_crit/100);
                            crit = true;
                        }
                        Jeu.combat.liste[cible].statistiques.vie -= degats;
                        Jeu.combat.resultat = personnage.nom + " envoie un projectile arcanique";
                        if (crit) {
                            Jeu.combat.resultat += ", réussis un coup critique";
                        }
                        Jeu.combat.resultat += " et inflige " + degats + " dégâts à " + Jeu.combat.liste[cible].nom;
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
            sort.description = function (character=true) {
                afficher("Soigne ");
                if (character) {
                    afficher(parseInt(330*Math.pow(2,parseInt(personnage.niveau/10))*(1 + (personnage.niveau%10)/10)) + " ");
                }
                else {
                    afficher("un peu de ");
                }
                afficher("vie à une cible alliée. Coûte 3 actions et 10 mana.");
            }
            sort.condition = function () {return test_cout(personnage,3,100)}
            sort.use = function (spell,step=1,cible=undefined) {
                switch (step) {
                    case 1:
                        cible_allie(spell);
                        break;
                    case 2:
                        personnage.statistiques.action -= 3;
                        personnage.statistiques.mana -= 100;
                        Jeu.combat.liste[cible].statistiques.vie += parseInt(330*Math.pow(2,parseInt(personnage.niveau/10))*(1 + (personnage.niveau%10)/10));
                        if (Jeu.combat.liste[cible].statistiques.vie > Jeu.combat.liste[cible].statistiques.vie_max) {
                            Jeu.combat.liste[cible].statistiques.vie = Jeu.combat.liste[cible].statistiques.vie_max;
                        }
                        if (cible == 0) {
                            Jeu.combat.resultat = personnage.nom + " se soigne " + parseInt(330*Math.pow(2,parseInt(personnage.niveau/10))*(1 + (personnage.niveau%10)/10)) + " vie";
                        }
                        else {
                            Jeu.combat.resultat = personnage.nom + " soigne " + parseInt(330*Math.pow(2,parseInt(personnage.niveau/10))*(1 + (personnage.niveau%10)/10)) + " vie à " + Jeu.combat.liste[cible].nom;
                        }
                        resultat_combat();
                        break;
                }
            }
            break;
        case 5:
            sort.nom = "Attaque double";
            sort.description = function (character=true) {
                afficher("Inflige 2 fois ");
                if (character) {
                    afficher((personnage.statistiques.attaque_mel + personnage.statistiques.force) + " ");
                }
                afficher("(100% de votre attaque en mêlée + 50% de votre force) dégâts en mêlée à une cible. Coûte 3 actions et 10 mana.");
            }
            sort.condition = function () {return test_cout(personnage,3,100)}
            sort.use = function (spell,step=1,cible=undefined) {
                switch (step) {
                    case 1:
                        cible_ennemi(spell);
                        break;
                    case 2:
                        personnage.statistiques.action -= 3;
                        personnage.statistiques.mana -= 100;
                        Jeu.combat.resultat = "";
                        for (let n=0;n<2;n++) {
                            let crit = false;
                            let degats = parseInt(personnage.statistiques.attaque_mel + personnage.statistiques.force) - Jeu.combat.liste[cible].statistiques.defense_mel;
                            if (degats <= 0) {
                                degats = 1;
                            }
                            if (Math.random()*100 < personnage.statistiques.taux_crit - Jeu.combat.liste[cible].statistiques.resistance_crit) {
                                degats = parseInt(degats*personnage.statistiques.degat_crit/100);
                                crit = true;
                            }
                            Jeu.combat.liste[cible].statistiques.vie -= degats;
                            if (n > 0) {
                                Jeu.combat.resultat += "<br/>";
                            }
                            Jeu.combat.resultat += personnage.nom + " frappe";
                            if (crit) {
                                Jeu.combat.resultat += ", réussis un coup critique";
                            }
                            Jeu.combat.resultat += " et inflige " + degats + " dégâts à " + Jeu.combat.liste[cible].nom;
                        }
                        if (Jeu.combat.liste[cible].statistiques.vie <= 0) {
                            Jeu.combat.liste[cible].mort = true;
                        }
                        resultat_combat();
                        break;
                }
            }
            break;
        case 6:
            sort.nom = "Tir chargé";
            sort.description = function (character=true) {
                afficher("Inflige ");
                if (character) {
                    afficher((personnage.statistiques.attaque_dis + personnage.statistiques.agilite)*2 + " ");
                }
                afficher("(200% de votre attaque à distance + 100% de votre agilité) dégâts à distance à une cible. Coûte 3 actions et 10 mana.");
            }
            sort.condition = function () {return test_cout(personnage,2,0)}
            sort.use = function (spell,step=1,cible=undefined) {
                switch (step) {
                    case 1:
                        cible_ennemi(spell);
                        break;
                    case 2:
                        personnage.statistiques.action -= 3;
                        personnage.statistiques.mana -= 100;
                        let crit = false;
                        let degats = parseInt(personnage.statistiques.attaque_dis + personnage.statistiques.agilite)*2 - Jeu.combat.liste[cible].statistiques.defense_dis;
                        if (degats <= 0) {
                            degats = 1;
                        }
                        if (Math.random()*100 < personnage.statistiques.taux_crit - Jeu.combat.liste[cible].statistiques.resistance_crit) {
                            degats = parseInt(degats*personnage.statistiques.degat_crit/100);
                            crit = true;
                        }
                        Jeu.combat.liste[cible].statistiques.vie -= degats;
                        Jeu.combat.resultat = personnage.nom + " charge son tir";
                        if (crit) {
                            Jeu.combat.resultat += ", réussis un coup critique";
                        }
                        Jeu.combat.resultat += " et inflige " + degats + " dégâts à " + Jeu.combat.liste[cible].nom;
                        if (Jeu.combat.liste[cible].statistiques.vie <= 0) {
                            Jeu.combat.liste[cible].mort = true;
                        }
                        resultat_combat();
                        break;
                }
            }
            break;
        case 7:
            sort.nom = "Vague arcanique";
            sort.description = function (character=true) {
                afficher("Inflige ");
                if (character) {
                    afficher((personnage.statistiques.attaque_mag + personnage.statistiques.intelligence) + " ");
                }
                afficher("(100% de votre attaque magique + 50% de votre intelligence) dégâts magiques à tous les ennemis. Coûte 3 actions et 10 mana.");
            }
            sort.condition = function () {return test_cout(personnage,3,100)}
            sort.use = function (spell,step=1,cible=undefined) {
                switch (step) {
                    case 1:
                        personnage.statistiques.action -= 3;
                        personnage.statistiques.mana -= 100;
                        Jeu.combat.resultat = "";
                        for (let n=0;n<Jeu.combat.liste.length;n++) {
                            if (Jeu.combat.liste[n].ennemi) {
                                cible = n;
                                let crit = false;
                                let degats = parseInt(personnage.statistiques.attaque_mag + personnage.statistiques.intelligence/2) - Jeu.combat.liste[cible].statistiques.defense_mag;
                                if (degats <= 0) {
                                    degats = 1;
                                }
                                if (Math.random()*100 < personnage.statistiques.taux_crit - Jeu.combat.liste[cible].statistiques.resistance_crit) {
                                    degats = parseInt(degats*personnage.statistiques.degat_crit/100);
                                    crit = true;
                                }
                                Jeu.combat.liste[cible].statistiques.vie -= degats;
                                if (n > 0) {
                                    Jeu.combat.resultat += "<br/>";
                                }
                                Jeu.combat.resultat += personnage.nom + " lance une vague arcanique";
                                if (crit) {
                                    Jeu.combat.resultat += ", réussis un coup critique";
                                }
                                Jeu.combat.resultat += " et inflige " + degats + " dégâts à " + Jeu.combat.liste[cible].nom;
                                if (Jeu.combat.liste[cible].statistiques.vie <= 0) {
                                    Jeu.combat.liste[cible].mort = true;
                                }
                            }
                        }
                        resultat_combat();
                        break;
                }
            }
            break;
        case 8:
            sort.nom = "Soin partiel";
            sort.description = function () {
                afficher("Soigne 25% de se vie maximale à une cible alliée. Coûte 3 actions et 10 mana.");
            }
            sort.condition = function () {return test_cout(personnage,3,100)}
            sort.use = function (spell,step=1,cible=undefined) {
                switch (step) {
                    case 1:
                        cible_allie(spell);
                        break;
                    case 2:
                        personnage.statistiques.action -= 3;
                        personnage.statistiques.mana -= 100;
                        Jeu.combat.liste[cible].statistiques.vie += parseInt(Jeu.combat.liste[cible].statistiques.vie_max/4);
                        if (Jeu.combat.liste[cible].statistiques.vie > Jeu.combat.liste[cible].statistiques.vie_max) {
                            Jeu.combat.liste[cible].statistiques.vie = Jeu.combat.liste[cible].statistiques.vie_max;
                        }
                        if (cible == 0) {
                            Jeu.combat.resultat = personnage.nom + " se soigne " + parseInt(Jeu.combat.liste[cible].statistiques.vie_max/4) + " vie";
                        }
                        else {
                            Jeu.combat.resultat = personnage.nom + " soigne " + parseInt(Jeu.combat.liste[cible].statistiques.vie_max/4) + " vie à " + Jeu.combat.liste[cible].nom;
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