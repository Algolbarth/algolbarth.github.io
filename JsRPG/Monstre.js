function obtenir_monstre (monstre_id,niveau) {
    let monstre = {
        nom : "",
        niveau : niveau,
        ennemi : true,
        mort : false,
        statistiques : {
            vie : 0,
            vie_max : 1000,
            mana : 0,
            mana_max : 1000,
            attaque_mel : 0,
            defense_mel : 100,
            attaque_dis : 0,
            defense_dis: 100,
            attaque_mag : 0,
            defense_mag : 100,
            taux_crit : 15,
            degat_crit : 150,
            resistance_crit : 10,
            esquive : 0,
            vitesse : 90,
            force : 100,
            agilite : 100,
            intelligence : 100,
            atb : 0,
            action : 6,
            action_max : 6,
        },
        or : 0,
        xp : 10,
        loots : [],
        tour : function () {},
    }
    switch (monstre_id) {
        case 1:
            monstre.nom = "Sanglier";
            monstre.statistiques.attaque_mel = 200;
            monstre.statistiques.force = 150;
            monstre.loots.push(nouveau_loot(10,niveau,50));
            monstre.tour = function () {
                if (this.statistiques.action >= 3) {
                    this.statistiques.action -= 3;
                    let cible = trouver_cible();
                    let crit = false;
                    let degats = (this.statistiques.attaque_mel + this.statistiques.force) - Jeu.combat.liste[cible].statistiques.defense_mel;
                    if (degats <= 0) {
                        degats = 1;
                    }
                    if (Math.random()*100 < this.statistiques.taux_crit - Jeu.combat.liste[cible].statistiques.resistance_crit) {
                        degats = parseInt(degats*this.statistiques.degat_crit/100);
                        crit = true;
                    }
                    if (Math.random()*100 > Jeu.combat.liste[cible].statistiques.esquive) {
                        Jeu.combat.liste[cible].statistiques.vie -= degats;
                        Jeu.combat.resultat = this.nom + " charge";
                        if (crit) {
                            Jeu.combat.resultat += ", réussis un coup critique";
                        }
                        Jeu.combat.resultat += " et inflige " + degats + " dégâts à " + Jeu.combat.liste[cible].nom;
                        if (Jeu.combat.liste[cible].statistiques.vie <= 0) {
                            mort(cible);
                        }
                    }
                    else {
                        Jeu.combat.resultat = this.nom + " charge";
                        if (crit) {
                            Jeu.combat.resultat += ", réussis un coup critique";
                        }
                        Jeu.combat.resultat += " mais " + Jeu.combat.liste[cible].nom + " évite l'attaque";
                    }
                    resultat_combat();
                }
                else {
                    continuer_combat();
                }
            }
            break;
        case 2:
            monstre.nom = "Loup";
            monstre.statistiques.attaque_mel = 200;
            monstre.statistiques.agilite = 150;
            monstre.loots.push(nouveau_loot(10,niveau,50));
            monstre.tour = function () {
                if (this.statistiques.action >= 3) {
                    this.statistiques.action -= 3;
                    let cible = trouver_cible();
                    let crit = false;
                    let degats = (this.statistiques.attaque_mel + this.statistiques.force) - Jeu.combat.liste[cible].statistiques.defense_mel;
                    if (degats <= 0) {
                        degats = 1;
                    }
                    if (Math.random()*100 < this.statistiques.taux_crit - Jeu.combat.liste[cible].statistiques.resistance_crit) {
                        degats = parseInt(degats*this.statistiques.degat_crit/100);
                        crit = true;
                    }
                    if (Math.random()*100 > Jeu.combat.liste[cible].statistiques.esquive) {
                        Jeu.combat.liste[cible].statistiques.vie -= degats;
                        Jeu.combat.resultat = this.nom + " mords";
                        if (crit) {
                            Jeu.combat.resultat += ", réussis un coup critique";
                        }
                        Jeu.combat.resultat += " et inflige " + degats + " dégâts à " + Jeu.combat.liste[cible].nom;
                        if (Jeu.combat.liste[cible].statistiques.vie <= 0) {
                            mort(cible);
                        }
                    }
                    else {
                        Jeu.combat.resultat = this.nom + " mords";
                        if (crit) {
                            Jeu.combat.resultat += ", réussis un coup critique";
                        }
                        Jeu.combat.resultat += " mais " + Jeu.combat.liste[cible].nom + " évite l'attaque";
                    }
                    resultat_combat();
                }
                else {
                    continuer_combat();
                }
            }
            break;
        case 3:
            monstre.nom = "Renard";
            monstre.statistiques.attaque_mel = 200;
            monstre.statistiques.intelligence = 150;
            monstre.loots.push(nouveau_loot(10,niveau,50));
            monstre.tour = function () {
                if (this.statistiques.action >= 3) {
                    this.statistiques.action -= 3;
                    let cible = trouver_cible();
                    let crit = false;
                    let degats = (this.statistiques.attaque_mel + this.statistiques.force) - Jeu.combat.liste[cible].statistiques.defense_mel;
                    if (degats <= 0) {
                        degats = 1;
                    }
                    if (Math.random()*100 < this.statistiques.taux_crit - Jeu.combat.liste[cible].statistiques.resistance_crit) {
                        degats = parseInt(degats*this.statistiques.degat_crit/100);
                        crit = true;
                    }
                    if (Math.random()*100 > Jeu.combat.liste[cible].statistiques.esquive) {
                        Jeu.combat.liste[cible].statistiques.vie -= degats;
                        Jeu.combat.resultat = this.nom + " griffe";
                        if (crit) {
                            Jeu.combat.resultat += ", réussis un coup critique";
                        }
                        Jeu.combat.resultat += " et inflige " + degats + " dégâts à " + Jeu.combat.liste[cible].nom;
                        if (Jeu.combat.liste[cible].statistiques.vie <= 0) {
                            mort(cible);
                        }
                    }
                    else {
                        Jeu.combat.resultat = this.nom + " griffe";
                        if (crit) {
                            Jeu.combat.resultat += ", réussis un coup critique";
                        }
                        Jeu.combat.resultat += " mais " + Jeu.combat.liste[cible].nom + " évite l'attaque";
                    }
                    resultat_combat();
                }
                else {
                    continuer_combat();
                }
            }
            break;
    }
    monstre.statistiques.vie_max = parseInt(monstre.statistiques.vie_max*Math.pow(2,parseInt(monstre.niveau/10))*(1 + (monstre.niveau%10)/10));
    monstre.statistiques.mana_max = parseInt(monstre.statistiques.mana_max*Math.pow(2,parseInt(monstre.niveau/10))*(1 + (monstre.niveau%10)/10));
    monstre.statistiques.attaque_mel = parseInt(monstre.statistiques.attaque_mel*Math.pow(2,parseInt(monstre.niveau/10))*(1 + (monstre.niveau%10)/10));
    monstre.statistiques.defense_mel = parseInt(monstre.statistiques.defense_mel*Math.pow(2,parseInt(monstre.niveau/10))*(1 + (monstre.niveau%10)/10));
    monstre.statistiques.attaque_dis = parseInt(monstre.statistiques.attaque_dis*Math.pow(2,parseInt(monstre.niveau/10))*(1 + (monstre.niveau%10)/10));
    monstre.statistiques.defense_dis = parseInt(monstre.statistiques.defense_dis*Math.pow(2,parseInt(monstre.niveau/10))*(1 + (monstre.niveau%10)/10));
    monstre.statistiques.attaque_mag = parseInt(monstre.statistiques.attaque_mag*Math.pow(2,parseInt(monstre.niveau/10))*(1 + (monstre.niveau%10)/10));
    monstre.statistiques.defense_mag = parseInt(monstre.statistiques.defense_mag*Math.pow(2,parseInt(monstre.niveau/10))*(1 + (monstre.niveau%10)/10));
    monstre.statistiques.force = parseInt(monstre.statistiques.force*Math.pow(2,parseInt(monstre.niveau/10))*(1 + (monstre.niveau%10)/10));
    monstre.statistiques.agilite = parseInt(monstre.statistiques.agilite*Math.pow(2,parseInt(monstre.niveau/10))*(1 + (monstre.niveau%10)/10));
    monstre.statistiques.intelligence = parseInt(monstre.statistiques.intelligence*Math.pow(2,parseInt(monstre.niveau/10))*(1 + (monstre.niveau%10)/10));
    monstre.statistiques.vie = monstre.statistiques.vie_max;
    monstre.statistiques.mana = monstre.statistiques.mana_max;
    return monstre;
}

function nouveau_loot (id,niveau,taux) {
    let loot = {
        id : id,
        niveau : niveau,
        taux : taux,
    }
    return loot;
}

function trouver_cible () {
    let cible;
    let cible_set = false;
    for (let n=0;n<Jeu.combat.liste.length;n++) {
        if (!Jeu.combat.liste[n].ennemi && !Jeu.combat.liste[n].mort) {
            if (cible_set) {
                if (Jeu.combat.liste[cible].statistiques.vie > Jeu.combat.liste[n].statistiques.vie) {
                    cible = n;
                }
            }
            else {
                cible = n;
                cible_set = true;
            }
        }
    }
    return cible;
}