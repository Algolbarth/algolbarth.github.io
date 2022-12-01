function lore() {
    initialiser();
    div("main");
    fonction("Retour", "ecran_titre()");
    saut(2);
    for (let n = 1; n <= Jeu.NOMBRE_HISTOIRE; n++) {
        div("", "carte");
        fonction(obtenir_histoire(n).nom, "histoire_voir(" + n + ")");
        div_fin();
    }
    div_fin();
    div("side", "affichage");
    div_fin();
    actualiser();
}

function obtenir_histoire(id) {
    let histoire = {
        nom: "",
        texte: ""
    };
    switch (id) {
        case 1:
            histoire.nom = "Génèse";
            histoire.texte = "Au début il n'y avait rien. <br/>";
            histoire.texte += "Puis la lumière et les ténèbres se sont partagés le monde, la première dominant les cieux et les seconds tapissant les profondeurs. <br/>";
            histoire.texte += "Ensuite l'eau recouvra le monde et laissa l'air s'installer au-dessus d'elle. <br/>";
            histoire.texte += "Dans l'eau émergea alors la terre chatouillant l'air tandis que le feu se regroupa sous forme de boule au dessus de ces îles nouvellement créées. <br/>";
            histoire.texte += "Pour que ces éléments puisse agir entre eux, la foudre leur incita le mouvement et la glace limita ce dernier pour garantir un équilibre des forces. <br/>";
            histoire.texte += "Une fois que le changement et la contnuité arrivèrent dans l'univers, la vie put prendre son essort et les végétaux poussèrent partout où ils pouvaient. <br/>";
            histoire.texte += "Mais la vie implique la mort et cette dernière emporta les êtres vivants trop faibles, ne laissant que les plus robustes pour dévéllopper la faune et la flore. <br/>";
            histoire.texte += "Enfin la vie donna naissance à la conscience, et avec elle les croyances de l'arcane et les sciences des métaux.";
            break;
    }
    return histoire;
}

function histoire_voir(id) {
    let texte = obtenir_histoire(id).texte;
    div_actualiser("side", texte);
}