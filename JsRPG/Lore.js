function lore() {
    initialiser();
    fonction("Retour", "accueil()");
    saut(2);
    div("main");
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
            histoire.texte = "<center>Génèse</center>";
            histoire.texte += "Au début il n'y avait rien. <br/>";
            histoire.texte += "Puis la lumière et les ténèbres se sont partagé le monde, la première dominant les cieux et les seconds tapissant les profondeurs. <br/>";
            histoire.texte += "Ensuite l'eau recouvra le monde et laissa l'air s'installer au-dessus d'elle. <br/>";
            histoire.texte += "Dans l'eau émergea alors la terre chatouillant l'air tandis que le feu se regroupa sous forme de boule au-dessus de ces îles nouvellement créées. <br/>";
            histoire.texte += "Pour que ces éléments puissent agir entre eux, la foudre leur incita le mouvement et la glace limita ce dernier pour garantir un équilibre des forces. <br/>";
            histoire.texte += "Une fois que le changement et la continuité arrivèrent dans l'univers, la vie put prendre son essor et les végétaux poussèrent partout où ils pouvaient. <br/>";
            histoire.texte += "Mais la vie implique la mort et cette dernière emporta les êtres vivants trop faibles, ne laissant que les plus robustes pour dévellopper la faune et la flore. <br/>";
            histoire.texte += "Enfin la vie donna naissance à la conscience, et avec elle les croyances de l'arcane et les sciences des métaux.";
            break;
        case 2:
            histoire.nom = "Chroniques du temps";
            histoire.texte = "<center>Chroniques du temps</center>";
            histoire.texte += "- Liaison vers l'Enfer <br/>";
            histoire.texte += "- Liaison vers le Paradis <br/>";
            histoire.texte += "- Guerre des déités <br/>";
            histoire.texte += "- Apparition et mort de Golgoth <br/>";
            histoire.texte += "- Première expansion <br/>";
            histoire.texte += "- Seconde expansion <br/>";
            histoire.texte += "- Mondialisation <br/>";
            histoire.texte += "- Grande guerre <br/>";
            histoire.texte += "- Invasion des déités <br/>";
            histoire.texte += "- Fin de la grande guerre <br/>";
            histoire.texte += "- Naissance de l'Empire <br/>";
            histoire.texte += "- Règne de l'Empereur doré <br/>";
            histoire.texte += "- Guerre de l'Empire contre les 7 grands pêchés <br/>";
            histoire.texte += "- Règne de l'Empereur barbare <br/>";
            histoire.texte += "- Guerre contre les démons <br/>";
            histoire.texte += "- Mort de l'Empereur barbare contre un archidémon <br/>";
            histoire.texte += "- Règne de l'Empereur haut-elfe <br/>";
            histoire.texte += "- Guerre contre le néant <br/>";
            histoire.texte += "- Règne de l'Empereur dragon <br/>";
            histoire.texte += "- Avénement de la liche alliée au Néant <br/>";
            break;
        case 3:
            histoire.nom = "Histoire impériale";
            histoire.texte = "<center>Histoire impériale</center>";
            histoire.texte += "L'Empire est le plus grand royaume au monde, unissant toutes les races des terres connues autour d'un seul pouvoir. <br/>";
            histoire.texte += "Ce pouvoir est incarné autour de l'Empereur, autorité suprême du monde qui régit les peuples s'étant ralliés à l'Empire. <br/>";
            histoire.texte += "Autour de l'Empereur, chaque peuple peut envoyer un représentant siéger à la citadelle imperiale pour incarner les intérêts des siens et former le siège impérial, assistant l'empereur dans sa tâche. <br/>";
            histoire.texte += "L'Empereur est un individu désigné par l'Empereur précédent, garantissant une continuité de la bonne volonté de l'Empire et d'un règne cohérent. <br/>";
            histoire.texte += "Le nouvel Empereur étant un homme de confiance du précédent, il s'agit souvent d'un de ses plus proches conseillers parmi les membres du siège impérial. <br/>";
            histoire.texte += "L'Empire est centralisée autour d'une ville-continent faisant office de capitale impériale, construite aux abords de la citadelle impériale. <br/>";
            histoire.texte += "La capitale impériale regroupe les institutions commerciales, les ambassades des peuples mais aussi de nombreuses auberges, des entrepôts gigantesques et des commerces de toutes sortes. <br/>";
            histoire.texte += "Les plus grands artisans se sont installés ici pour bénéficier du flux de voyageurs et de la renommée qu'implique un tel emplacement. <br/>"
            histoire.texte += "L'Empire est né des cendres de la Grande guerre et de la nécessité d'unir les peuples quels que soient les éléments et par-delà les océans. <br/>";
            histoire.texte += "Autrefois, les races n'étaient régies que par des pouvoirs locaux et inévitablement des conflits éclataient pour d'innombrables raisons. <br/>";
            histoire.texte += "Le commerce amorcé par les humains pour réunir les continents était efficace mais la diversité des guildes marchandes menait à la création de plusieurs monnaies. Au final, les continents ne partageant pas la même monnaie étaient tout aussi éloigné qu'avant. <br/>";
            histoire.texte += "Avec l'obligation d'utiliser la monnaie impériale, tous les peuples étaient unis malgré la distance. <br/>";
            break;
        case 4:
            histoire.nom = "L'Empereur barbare";
            histoire.texte = "<center>l'Empereur barbare</center>";
            histoire.texte += "Si les empereurs ont l'habitude de se faire discret pour incarner au mieux un pouvoir dépassant les citoyens et proche d'un dieu, ce n'est pas le cas de tous les empereurs qui ont traversé l'histoire. <br/>";
            histoire.texte += "En particulier pour celui qui fut surnommé l'Empereur barbare, en raison de son origine. Bruyant, extraverti et violent, cet Empereur déstabilisa le pouvoir en place et choqua le siège par sa manière de faire, en bien comme en mal. <br/>";
            histoire.texte += "Il restera dans l'histoire pour ses colères, son goût du combat et ses nombreuses apparitions en public faisant de lui l'Empereur le plus controversé de tous les temps. <br/>";
            histoire.texte += "Beaucoup voyaient en lui un héritier illégitime, incapable de veiller sur l'Empire et de remplir ses responsabilités. <br/>";
            histoire.texte += "Malgré les questions que soulevaient son attitude, il se montra à la hauteur de son titre en gagnant le respect des peuples les plus combattifs et en ralliant à l'Empire des camps considérés comme nuisibles. <br/>";
            histoire.texte += "Contrairement aux autres empereurs, il considérait ses plus proches conseillers comme de véritables compagnons d'armes et non seulement comme de futur héritiers à tester. <br/>";
            histoire.texte += "Sa combativité et son courage le poussèrent au combat en première ligne, indignant le siège impérial qui considérait cela comme de l'inconscience mais galvanisait les troupes. <br/>";
            histoire.texte += "Ces dernières ne se sentirent pas abandonné au combat par un chef lâche et inaccessible, mais mené par un chef de guerre compétent et invincible. <br/>";
            histoire.texte += "Fidèle à lui même jusqu'à sa mort, il tombera au combat contre un archidémon lors de la bataille contre les démons.";
            break;
    }
    return histoire;
}

function histoire_voir(id) {
    let texte = obtenir_histoire(id).texte;
    div_actualiser("side", texte);
}