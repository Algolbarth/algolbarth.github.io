let Versions = [];
let version;

version = {
    nom : "0.0.1",
    date : "29-10-2021",
    description : function () {
        afficher("Version de base");
    },
}
Versions.push(version);

version = {
    nom : "0.0.2",
    date : "09-11-2021",
    description : function () {
        afficher("Refonte des statistiques d'attaque et de défense");
        saut(1);
        afficher("Ajout de 2 nouvelles créatures : Renard et Sanglier");
        saut(1);
        afficher("Ajout de 2 nouveaux sets d'équipement : Cuir et Tissu");
        saut(1);
        afficher("Ajout de 2 nouveaux sorts : Tir et Tir d'arcane");
        saut(1);
        afficher("Correction d'un bug qui indiquait ''Adversaire'' lors de l'utilisation du sort Soin alors qu'il s'agissait bien des alliés");
        saut(1);
        afficher("Correction d'un bug sur l'affichage de la description des objets lors d'un achat");
    },
}
Versions.push(version);

version = {
    nom : "0.0.3",
    date : "16-11-2021",
    description : function () {
        afficher("Nerf du sort Soin : le montant de vie rendu passe de 1000 à 500");
    },
}
Versions.push(version);

version = {
    nom : "0.0.4",
    date : "05-01-2022",
    description : function () {
        afficher("Ajout du système d'expérience et de niveau");
        saut(1);
        afficher("Ajout de 2 nouvelles zones : Forêt et Hexatère");
        saut(1);
        afficher("Ajout de 2 nouveaux équipements : Pendentif et Bracelet");
        saut(1);
        afficher("Changement du sort Soin : le montant de vie rendu se base sur le niveau du personnage utilisant le sort");
    },
}
Versions.push(version);

version = {
    nom : "0.0.5",
    date : "07-01-2022",
    description : function () {
        afficher("Ajout du système de coup critique");
        saut(1);
        afficher("Augmentation de des points d'expérience gagnés après un combat");
        saut(1);
        afficher("Modification des statistiques d'équipement");
        saut(1);
        afficher("Ajout d'une nouvelles zones : Route");
        saut(1);
        afficher("Ajout de nouveaux combats dans les zones Plaine, Forêt et Route");
        saut(1);
        afficher("Ajout de 4 nouveaux sorts : Attaque double, Tir chargé, Vague arcanique et Soin partiel");
        saut(1);
        afficher("Changement du sort Soin : le montant de vie rendu a été diminué");
        saut(1);
        afficher("Correction d'un bug sur la non-disparition des monstres après une défaite");
        saut(1);
        afficher("Correction d'un bug sur l'affichage de la description des objets dans la banque");
        saut(1);
        afficher("Correction d'un bug sur la description de l'objet Parchemin Soin");
    },
}
Versions.push(version);