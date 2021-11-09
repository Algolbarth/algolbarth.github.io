function obtenir_monstre (monstre_id) {
    let monstre = {
        nom : "",
        ennemi : true,
        mort : false,
        statistiques : {
            vie : 100,
            vie_max : 100,
            mana : 100,
            mana_max : 100,
            attaque_mel : 10,
            defense_mel : 0,
            attaque_dis : 0,
            defense_dis: 0,
            attaque_mag : 0,
            defense_mag : 0,
            vitesse : 40,
            force : 10,
            agilite : 10,
            intelligence : 10,
            atb : 0,
            action : 6,
            action_max : 6,
        },
        or : 0,
        xp : 1,
        loots : [],
        tour : function () {},
    }
    switch (monstre_id) {
        case 1:
            monstre.nom = "Sanglier";
            monstre.statistiques.force = 15;
            monstre.loots.push(nouveau_loot(10,50));
            monstre.tour = function () {
                if (this.statistiques.action >= 3) {
                    this.statistiques.action -= 3;
                    let cible = trouver_cible();
                    let degats = (this.statistiques.attaque_mel + this.statistiques.force) - Jeu.combat.liste[cible].statistiques.defense_mel;
                    if (degats <= 0) {
                        degats = 1;
                    }
                    Jeu.combat.liste[cible].statistiques.vie -= degats;
                    Jeu.combat.resultat = this.nom + " attaque et inflige " + degats + " dégats à " + Jeu.combat.liste[cible].nom;
                    if (Jeu.combat.liste[cible].statistiques.vie <= 0) {
                        mort(cible);
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
            monstre.statistiques.agilite = 15;
            monstre.loots.push(nouveau_loot(10,50));
            monstre.tour = function () {
                if (this.statistiques.action >= 3) {
                    this.statistiques.action -= 3;
                    let cible = trouver_cible();
                    let degats = (this.statistiques.attaque_mel + this.statistiques.agilite) - Jeu.combat.liste[cible].statistiques.defense_mel;
                    if (degats <= 0) {
                        degats = 1;
                    }
                    Jeu.combat.liste[cible].statistiques.vie -= degats;
                    Jeu.combat.resultat = this.nom + " attaque et inflige " + degats + " dégats à " + Jeu.combat.liste[cible].nom;
                    if (Jeu.combat.liste[cible].statistiques.vie <= 0) {
                        mort(cible);
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
            monstre.statistiques.intelligence = 15;
            monstre.loots.push(nouveau_loot(10,50));
            monstre.tour = function () {
                if (this.statistiques.action >= 3) {
                    this.statistiques.action -= 3;
                    let cible = trouver_cible();
                    let degats = (this.statistiques.attaque_mel + this.statistiques.intelligence) - Jeu.combat.liste[cible].statistiques.defense_mel;
                    if (degats <= 0) {
                        degats = 1;
                    }
                    Jeu.combat.liste[cible].statistiques.vie -= degats;
                    Jeu.combat.resultat = this.nom + " attaque et inflige " + degats + " dégats à " + Jeu.combat.liste[cible].nom;
                    if (Jeu.combat.liste[cible].statistiques.vie <= 0) {
                        mort(cible);
                    }
                    resultat_combat();
                }
                else {
                    continuer_combat();
                }
            }
            break;
    }
    return monstre;
}

function nouveau_loot (id,taux) {
    let loot = {
        id: id,
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