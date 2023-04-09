function lore() {
    initialiser();
    fonction("Retour", "son_bouton();accueil()");
    saut(2);
    div("main");
    for (let n = 1; n <= Jeu.NOMBRE_HISTOIRE; n++) {
        div("", "carte");
        fonction(obtenir_histoire(n).nom, "son_carte();histoire_voir(" + n + ")");
        div_fin();
    }
    div_fin();
    div("side", "affichage");
    div_fin();
    div("choix", "");
    div_fin();
    actualiser();
}

function obtenir_histoire(id) {
    let histoire = {
        nom: "",
        resume: "",
        texte: ""
    }
    switch (id) {
        case 1:
            histoire.nom = "Génèse";
            histoire.resume = "Une légende qui raconte la création du monde par les 12 éléments.";
            histoire.texte = "<center>Génèse</center><br/>";
            histoire.texte += "Au début il n'y avait rien.";
            histoire.texte += "<br/><br/>";
            histoire.texte += "Puis la lumière et les ténèbres se sont partagé le monde, la première dominant les cieux et les seconds tapissant les profondeurs.";
            histoire.texte += "<br/><br/>";
            histoire.texte += "Ensuite l'eau recouvra le monde et laissa l'air s'installer au-dessus d'elle.";
            histoire.texte += "<br/><br/>";
            histoire.texte += "Dans l'eau émergea alors la terre chatouillant l'air tandis que le feu se regroupa sous forme de boule au-dessus de ces îles nouvellement créées.";
            histoire.texte += "<br/><br/>";
            histoire.texte += "Pour que ces éléments puissent agir entre eux, la foudre leur incita le mouvement et la glace limita ce dernier pour garantir un équilibre des forces.";
            histoire.texte += "<br/><br/>";
            histoire.texte += "Une fois que le changement et la continuité arrivèrent dans l'univers, la vie put prendre son essor et les végétaux poussèrent partout où ils pouvaient.";
            histoire.texte += "<br/><br/>";
            histoire.texte += "Mais la vie implique la mort et cette dernière emporta les êtres vivants trop faibles, ne laissant que les plus robustes pour dévellopper la faune et la flore.";
            histoire.texte += "<br/><br/>";
            histoire.texte += "Enfin la vie donna naissance à la conscience, et avec elle les croyances de l'arcane et les sciences des métaux.";
            break;
        case 2:
            histoire.nom = "Chroniques du temps";
            histoire.resume = "Depuis sa création l'Empire a chercher à contrôler et archiver toute connaissance, le temps n'a pas échappé à cette soif de savoir. Les historiens de l'Empire ont retranscris une frise chronologique connue sous le nom des ''Chroniques du temps'' où figurent tous les évenemnts marquants connues de la mémoire des Hommes.";
            histoire.texte = "<center>Chroniques du temps</center><br/>";
            histoire.texte += "- Liaison vers l'Enfer";
            histoire.texte += "<br/><br/>";
            histoire.texte += "- Liaison vers le Paradis";
            histoire.texte += "<br/><br/>";
            histoire.texte += "- Guerre des déités";
            histoire.texte += "<br/><br/>";
            histoire.texte += "- Apparition et mort de Golgoth";
            histoire.texte += "<br/><br/>";
            histoire.texte += "- Première expansion";
            histoire.texte += "<br/><br/>";
            histoire.texte += "- Seconde expansion";
            histoire.texte += "<br/><br/>";
            histoire.texte += "- Mondialisation";
            histoire.texte += "<br/><br/>";
            histoire.texte += "- Grande guerre";
            histoire.texte += "<br/><br/>";
            histoire.texte += "- Invasion des déités";
            histoire.texte += "<br/><br/>";
            histoire.texte += "- Fin de la grande guerre";
            histoire.texte += "<br/><br/>";
            histoire.texte += "- Naissance de l'Empire";
            histoire.texte += "<br/><br/>";
            histoire.texte += "- Règne de l'Empereur doré";
            histoire.texte += "<br/><br/>";
            histoire.texte += "- Guerre de l'Empire contre les 7 grands pêchés";
            histoire.texte += "<br/><br/>";
            histoire.texte += "- Règne de l'Empereur barbare";
            histoire.texte += "<br/><br/>";
            histoire.texte += "- Guerre contre les démons";
            histoire.texte += "<br/><br/>";
            histoire.texte += "- Mort de l'Empereur barbare contre un archidémon";
            histoire.texte += "<br/><br/>";
            histoire.texte += "- Règne de l'Empereur haut-elfe";
            histoire.texte += "<br/><br/>";
            histoire.texte += "- Guerre contre le néant";
            histoire.texte += "<br/><br/>";
            histoire.texte += "- Règne de l'Empereur dragon";
            histoire.texte += "<br/><br/>";
            histoire.texte += "- Avénement de la liche alliée au Néant";
            break;
        case 3:
            histoire.nom = "Histoire impériale";
            histoire.resume = "Centre du monde connu, l'Empire transmet son histoire à travers les générations pour que substiste l'autorité de l'Empereur dès le plus jeune âge et sur tous les continents.";
            histoire.texte = "<center>Histoire impériale</center><br/>";
            histoire.texte += "L'Empire est le plus grand royaume au monde, unissant toutes les races des terres connues autour d'un seul pouvoir.";
            histoire.texte += "<br/><br/>";
            histoire.texte += "Ce pouvoir est incarné autour de l'Empereur, autorité suprême du monde qui régit les peuples s'étant ralliés à l'Empire.";
            histoire.texte += "<br/><br/>";
            histoire.texte += "Autour de l'Empereur, chaque peuple peut envoyer un représentant siéger à la citadelle imperiale pour incarner les intérêts des siens et former le siège impérial, assistant l'empereur dans sa tâche.";
            histoire.texte += "<br/><br/>";
            histoire.texte += "L'Empereur est un individu désigné par l'Empereur précédent, garantissant une continuité de la bonne volonté de l'Empire et d'un règne cohérent.";
            histoire.texte += "<br/><br/>";
            histoire.texte += "Le nouvel Empereur étant un homme de confiance du précédent, il s'agit souvent d'un de ses plus proches conseillers parmi les membres du siège impérial.";
            histoire.texte += "<br/><br/>";
            histoire.texte += "L'Empire est centralisée autour d'une ville-continent faisant office de capitale impériale, construite aux abords de la citadelle impériale.";
            histoire.texte += "<br/><br/>";
            histoire.texte += "La capitale impériale regroupe les institutions commerciales, les ambassades des peuples mais aussi de nombreuses auberges, des entrepôts gigantesques et des commerces de toutes sortes.";
            histoire.texte += "<br/><br/>";
            histoire.texte += "Les plus grands artisans se sont installés ici pour bénéficier du flux de voyageurs et de la renommée qu'implique un tel emplacement. "
            histoire.texte += "<br/><br/>";
            histoire.texte += "L'Empire est né des cendres de la Grande guerre et de la nécessité d'unir les peuples quels que soient les éléments et par-delà les océans.";
            histoire.texte += "<br/><br/>";
            histoire.texte += "Autrefois, les races n'étaient régies que par des pouvoirs locaux et inévitablement des conflits éclataient pour d'innombrables raisons.";
            histoire.texte += "<br/><br/>";
            histoire.texte += "Le commerce amorcé par les humains pour réunir les continents était efficace mais la diversité des guildes marchandes menait à la création de plusieurs monnaies. Au final, les continents ne partageant pas la même monnaie étaient tout aussi éloigné qu'avant.";
            histoire.texte += "<br/><br/>";
            histoire.texte += "Avec l'obligation d'utiliser la monnaie impériale, tous les peuples étaient unis malgré la distance.";
            break;
        case 4:
            histoire.nom = "L'Empereur barbare";
            histoire.resume = "L'histoire d'un empereur atypique.";
            histoire.texte = "<center>L'Empereur barbare</center><br/>";
            histoire.texte += "Si les empereurs ont l'habitude de se faire discret pour incarner au mieux un pouvoir dépassant les citoyens et proche d'un dieu, ce n'est pas le cas de tous les empereurs qui ont traversé l'histoire.";
            histoire.texte += "<br/><br/>";
            histoire.texte += "En particulier pour celui qui fut surnommé l'Empereur barbare, en raison de son origine. Bruyant, extraverti et violent, cet Empereur déstabilisa le pouvoir en place et choqua le siège par sa manière de faire, en bien comme en mal.";
            histoire.texte += "<br/><br/>";
            histoire.texte += "Il restera dans l'histoire pour ses colères, son goût du combat et ses nombreuses apparitions en public faisant de lui l'Empereur le plus controversé de tous les temps.";
            histoire.texte += "<br/><br/>";
            histoire.texte += "Beaucoup voyaient en lui un héritier illégitime, incapable de veiller sur l'Empire et de remplir ses responsabilités.";
            histoire.texte += "<br/><br/>";
            histoire.texte += "Malgré les questions que soulevaient son attitude, il se montra à la hauteur de son titre en gagnant le respect des peuples les plus combattifs et en ralliant à l'Empire des camps considérés comme nuisibles.";
            histoire.texte += "<br/><br/>";
            histoire.texte += "Contrairement aux autres empereurs, il considérait ses plus proches conseillers comme de véritables compagnons d'armes et non seulement comme de futur héritiers à tester.";
            histoire.texte += "<br/><br/>";
            histoire.texte += "Sa combativité et son courage le poussèrent au combat en première ligne, indignant le siège impérial qui considérait cela comme de l'inconscience mais galvanisait les troupes.";
            histoire.texte += "<br/><br/>";
            histoire.texte += "Ces dernières ne se sentirent pas abandonné au combat par un chef lâche et inaccessible, mais mené par un chef de guerre compétent et invincible.";
            histoire.texte += "<br/><br/>";
            histoire.texte += "Fidèle à lui même jusqu'à sa mort, il tombera au combat contre un archidémon lors de la bataille contre les démons.";
            break;
    }
    return histoire;
}

function histoire_voir(id) {
    let texte = "";
    texte += "<center><br/>";
    texte += obtenir_histoire(id).nom + "<br/><br/>";
    texte += obtenir_histoire(id).resume + "<br/><br/>";
    texte += "<button onclick='javascript:son_carte();histoire_lire(" + id + ")'>Lire</button>";
    texte += "</center>";
    div_actualiser("side", texte);
}

function histoire_lire(id) {
    let texte = "";
    texte += "<button onclick='javascript:son_carte();fermer_choix()'>Fermer</button> <br/><br/>";
    texte += "<div class='lore'>";
    texte += obtenir_histoire(id).texte;
    texte += "</div>";
    afficher_choix(texte);
}