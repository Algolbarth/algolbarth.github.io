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
        afficher("Ajout de 2 nouvelles créatures: Renard et Sanglier");
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