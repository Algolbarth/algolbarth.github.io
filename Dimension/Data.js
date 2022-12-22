function obtenir_situation (situation_id) {
    let situation = {
        id : situation_id,
        texte : "",
        choix : [],
    }
    let choix;
    let random_sante;
    let random_intel;
    let random_reput;
    let random_social;
    switch (situation_id) {
        case 1:
            situation.texte = "Brasier vous dit Yo.";
            choix = {
                nom : "Yo",
                texte : "Tout le monde dit bonjour à samuel, c'est bien." + write_score(0,0,1,0),
                action : function () {
                    change_score(0,0,1,0);
                }
            }
            situation.choix.push(choix);
            choix = {
                nom : "Ignorer",
                texte : "T'es vraiment un fdp, ça t'aurais chier de lui répondre ?" + write_score(0,0,-2,0),
                action : function () {
                    change_score(0,0,-2,0);
                }
            }
            situation.choix.push(choix);
            break;
        case 2:
            situation.texte = "Ludo vous propose d'aller flood des serveurs d'une manière originale.";
            choix = {
                nom : "Let's go",
                texte : "La réputation de dim n'aura jamais été aussi basse mais au fond on sait que ça pouvais pas être pire." + write_score(0,0,1,-1),
                action : function () {
                    change_score(0,0,1,-1);
                }
            }
            situation.choix.push(choix);
            choix = {
                nom : "Pas pour cette fois.",
                texte : "Vous manquez une occasion de vous marrer, mais aussi de paraître ridicule." + write_score(0,0,-1,1),
                action : function () {
                    change_score(0,0,-1,1);
                }
            }
            situation.choix.push(choix);
            break;
        case 3:
            situation.texte = "Bartho vous censure ''invonlontairement''.";
            choix = {
                nom : "Dictateur !",
                texte : "Red n'aime pas qu'on prenne quelqu'un d'autre que lui pour le dictateur de ce serveur, il vous pète la gueule." + write_score(-1,0,0,0),
                action : function () {
                    change_score(-1,0,0,0);
                }
            }
            situation.choix.push(choix);
            choix = {
                nom : "Mais euh...",
                texte : "Bartho n'est pas un mauvais gars au fond et vous dédommage de cet affront." + write_score(0,0,-1,0),
                action : function () {
                    change_score(0,0,-1,0);
                }
            }
            situation.choix.push(choix);
            break;
        case 4:
            situation.texte = "Atchimays est devenu le seigneur des loups et vous invite à rejoindre sa secte.";
            choix = {
                nom : "Oui maître",
                texte : "Vous vous soumettez à la puissance des loups, vous mordez un facteur et vous vous battez contre des chiens sauvages pendant toute la nuit." + write_score(0,-1,0,-1),
                action : function () {
                    change_score(0,-1,0,-1);
                }
            }
            situation.choix.push(choix);
            choix = {
                nom : "Jamais !",
                texte : "Atchimays ordonne à ses subordonnées de vous bouffer, ce qu'ils manquent de faire mais de peu." + write_score(-2,0,1,1),
                action : function () {
                    change_score(-2,0,1,1);
                }
            }
            situation.choix.push(choix);
            break;
        case 5:
            situation.texte = "Nook se transforme en super Nook et veut tester votre bravoure, vous dévoilant sa puissante musculature.";
            choix = {
                nom : "Relever le défi",
                texte : "Vous luttez bravement mais sa force is over nine thousand." + write_score(-1,0,1,0),
                action : function () {
                    change_score(-1,0,1,0);
                }
            }
            situation.choix.push(choix);
            choix = {
                nom : "Il est trop fort, fuyons",
                texte : "Votre couardise est remarqué par tout le serveur mais à votre place, peu aurait fait autrement." + write_score(0,0,-1,0),
                action : function () {
                    change_score(0,0,-1,0);
                }
            }
            situation.choix.push(choix);
            break;
        case 6:
            situation.texte = "Red s'est converti en boulanger récemment et désire vous donner un pain (pas dans la gueule cette fois).";
            choix = {
                nom : "Accepter",
                texte : "C'est un bon pain fait avec amour et ça se sens. Malheureusement c'est un pain drogué pour vous faire rester plus longtemps sur dimension." + write_score(2,0,0,-1),
                action : function () {
                    change_score(2,0,0,-1);
                }
            }
            situation.choix.push(choix);
            choix = {
                nom : "It's a trap",
                texte : "Red est déçu, lui qui avait préparé ce pain avec amour... Raf, il va le donner à quelqu'un d'autre et vous lâche ''tu dégoutes''." + write_score(0,1,-1,0),
                action : function () {
                    change_score(0,1,-1,0);
                }
            }
            situation.choix.push(choix);
            break;
        case 7:
            situation.texte = "Jilhrook semble perturbé par un film assez particulier.";
            choix = {
                nom : "Voir le film en question",
                texte : "Vous vous sentez sale mais vous pouvez dès maintenant vous prévenir des risques de décharges éléctriques sur votre sexe." + write_score(1,-1,0,0),
                action : function () {
                    change_score(1,-1,0,0);
                }
            }
            situation.choix.push(choix);
            choix = {
                nom : "Regarder un anime sur jellyfin plutôt",
                texte : "Vous n'êtes pas curieux, ou trop prudent, tout dépend du point de vue." + write_score(0,1,0,-1),
                action : function () {
                    change_score(0,1,0,-1);
                }
            }
            situation.choix.push(choix);
            break;
        case 8:
            situation.texte = "Vous êtes témoins d'allégations racistes, que faire ?";
            choix = {
                nom : "A - Elle a raison surtout si c'est Nook",
                texte : "Bonne réponse. Si c'est Nook, crime compte double." + write_score(0,1,0,-1),
                action : function () {
                    change_score(0,1,0,-1);
                }
            }
            situation.choix.push(choix);
            choix = {
                nom : "B - Les noirs sont des gens normaux",
                texte : "Mauvaise réponse... Je vois que vous êtes dans le déni, ce n'est pas grave, vous êtes juste dans le faux." + write_score(0,-1,0,1),
                action : function () {
                    change_score(0,-1,0,1);
                }
            }
            situation.choix.push(choix);
            break;
        case 9:
            situation.texte = "Enfin les autorités se penchent sur le cas Pinv.";
            choix = {
                nom : "Témoigner",
                texte : "Le juge ne vous crois pas car vous avez plus de 10 ans. Et mentir à un juge c'est pas sympa. Il vous envoie donc en prison pendant 1 an. Bah oui." + write_score(-2,0,0,0),
                action : function () {
                    change_score(-2,0,0,0);
                }
            }
            situation.choix.push(choix);
            choix = {
                nom : "Faire l'avocat du diable",
                texte : "Si vous êtes un joueur de bang dream c'est normal. Dans tous les cas, nous avons communiqué votre adresse au FBI." + write_score(0,0,0,-2),
                action : function () {
                    change_score(0,0,0,-2);
                }
            }
            situation.choix.push(choix);
            break;
        case 10:
            situation.texte = "Red cherche à tout prix à faire taire Nook";
            choix = {
                nom : "L'enfoncer",
                texte : "Le cyberharcellement n'est pas la solution... Mais nous allons faire une exeption pour cette fois-ci." + write_score(0,-1,1,0),
                action : function () {
                    change_score(0,-1,1,0);
                }
            }
            situation.choix.push(choix);
            choix = {
                nom : "Le défendre",
                texte : "Tous les monstres ont droit à la défense et vous vous en portez garant, vous êtes un homme bien. Ceci dit ce n'est pas le cas de Nook donc vous perdrez le procès." + write_score(0,0,-1,1),
                action : function () {
                    change_score(0,0,-1,1);
                }
            }
            situation.choix.push(choix);
            break;
        case 11:
            situation.texte = "Un viking sonne à votre porte. Auriez-vous un instant pour parlez de notre seigneur Thor ?";
            choix = {
                nom : "Bien sûr j'adore Marvel",
                texte : "Vous perdrez 2 de QI mais pour vous remerciez de votre patience le viking vous offre une bière revigorante." + write_score(2,-2,0,0),
                action : function () {
                    change_score(2,-2,0,0);
                }
            }
            situation.choix.push(choix);
            choix = {
                nom : "Commence déjà par me parler poliment",
                texte : "Il vous marrave la gueule et écrase votre chien avec son drakkar." + write_score(-2,2,0,0),
                action : function () {
                    change_score(-2,2,0,0);
                }
            }
            situation.choix.push(choix);
            break;
        case 12:
            situation.texte = "Oh un message.";
            choix = {
                nom : "Alors, 6969...",
                texte : "Vous ne voullez raconter à personne ce qu'il c'est passé cette nuit là... Mais au moins c'est bon vous n'êtes plus puceau." + write_score(-1,-1,1,1),
                action : function () {
                    change_score(-1,-1,1,1);
                }
            }
            situation.choix.push(choix);
            choix = {
                nom : "Bloquer",
                texte : "Vous vous préservez d'un délicieux moment et d'une bonne baise, mais vous êtes toujours en vie et sain d'esprit." + write_score(1,1,-1,-1),
                action : function () {
                    change_score(1,1,-1,-1);
                }
            }
            situation.choix.push(choix);
            break;
        case 13:
            random_sante = parseInt(Math.random()*10 - 5);
            random_intel = parseInt(Math.random()*10 - 5);
            random_reput = parseInt(Math.random()*10 - 5);
            random_social = parseInt(Math.random()*10 - 5);
            situation.texte = "Votre crush vient vous voir à la pause";
            choix = {
                nom : "L'embrasser",
                texte : "C'était... particulier. Oui c'est le mot. Particulier." + write_score(random_sante,random_intel,random_reput,random_social),
                action : function () {
                    change_score(random_sante,random_intel,random_reput,random_social);
                }
            }
            situation.choix.push(choix);
            choix = {
                nom : "Appeller l'armée",
                texte : "Vous apprenez à la radio que la créature a été abattu en fin de soirée.",
                action : function () {
                }
            }
            situation.choix.push(choix);
            break;
        case 14:
            situation.texte = "Fairiver vous demande votre avis concernant sa candidature pour être admin de Dimension.";
            choix = {
                nom : "L'encourager",
                texte : "Malgré votre soutien, le conseil ne semble pas vouloir acceuillir un blairo parmis eux. Vous êtes triste mais Fairiver ne vous laisse pas seul et vous remercie de la part de tous les blairos." + write_score(-1,0,1,0),
                action : function () {
                    change_score(-1,0,1,0);
                }
            }
            situation.choix.push(choix);
            choix = {
                nom : "L'aider à refaire sa lettre de motivation",
                texte : "Vous passez du temps à aider Fairiver, mais il a préféré aller se bourrer. Vous êtes triste et seul, vous décidez donc d'en faire de même en sortant dans un bar." + write_score(0,0,0,-1),
                action : function () {
                    change_score(0,0,-1,1);
                }
            }
            situation.choix.push(choix);
            break;
        case 15:
            random_intel = -parseInt(Math.random()*3 + 1);
            situation.texte = "Le célèbre empereur des blaireaux dévoile sa véritable identité en se trompant de mp (ça arrive même aux empereurs). De ce message alien vous déduisez logiquement...";
            choix = {
                nom : "...que Polaris est un complot visant à cacher l'existence des aliens",
                texte : "Le costa rica serait donc un base alien ?" + write_score(0,random_intel,0,0),
                action : function () {
                    change_score(0,random_intel,0,0);
                }
            }
            situation.choix.push(choix);
            choix = {
                nom : "...que les blaireaux viennent d'une planète lointaine, très lointaine",
                texte : "La légende raconte qu'ils maîtrisent la force." + write_score(0,-2,0,0),
                action : function () {
                    change_score(0,-2,0,0);
                }
            }
            situation.choix.push(choix);
            break;
        case 16:
            situation.texte = "Vous croisez un homme habillé comme un pédophile et pourtant ce n'est pas Pinv mais ce cher Okhoon.";
            choix = {
                nom : "T'as du crack frère ?",
                texte : "Quel dommage, Nook n'aura à vous proposer que des pokemons shinys. Adieu la soirée Chapi-Chapo avec tous vos amis." + write_score(0,0,1,-1),
                action : function () {
                    change_score(0,0,1,-1);
                }
            }
            situation.choix.push(choix);
            choix = {
                nom : "Le dénoncer au flic le plus proche",
                texte : "Il s'enfuis en courant et se jure de vous retrouver, il voulait juste aller voir une 134ème fois Spider-Man et n'avait rien à ne se reprocher." + write_score(0,0,-1,1),
                action : function () {
                    change_score(0,0,-1,1);
                }
            }
            situation.choix.push(choix);
            break;
        case 17:
            situation.texte = "Vous venez de recevoir un alléchant cadeau de la part d'un inconnu.";
            choix = {
                nom : "Cliquer sur le lien",
                texte : "Eh non c'était un piège comme le disait si bien l'amiral Ackbar. Un hackeur russe réussit à pirater votre ordinateur." + write_score(0,-1,0,-1),
                action : function () {
                    change_score(0,-1,0,-1);
                }
            }
            situation.choix.push(choix);
            choix = {
                nom : "Bloquer",
                texte : "Bien vu champion, il vaut mieux attendre la vraie." + write_score(0,1,1,0),
                action : function () {
                    change_score(0,1,1,0);
                }
            }
            situation.choix.push(choix);
            break;
        case 18:
            situation.texte = "Un bel éphèbe veux causer cosinus avec votre personne.";
            choix = {
                nom : "Euh... Tangente ?",
                texte : "Au bout de plusieurs heures vous avez un sacré mal de crâne. Mais on ne dit pas non à un petit rappel sur les bases des mathématiques." + write_score(-1,3,0,-1),
                action : function () {
                    change_score(-1,3,0,-1);
                }
            }
            situation.choix.push(choix);
            choix = {
                nom : "Pi = 3",
                texte : "Allez hop ça dégage. Il est parti comme un vampire à la lumière du jour." + write_score(0,-2,0,1),
                action : function () {
                    change_score(0,-2,0,1);
                }
            }
            situation.choix.push(choix);
            break;
        case 19:
            situation.texte = "Une demande pour la moins osée apparait dans votre fil.";
            choix = {
                nom : "Envoyer la photo",
                texte : "Vous expliquer au policier pourquoi vous n'avez rien à voir avec ce traffic de photo pornographique prises à l'insu des modèles." + write_score(-1,0,1,-1),
                action : function () {
                    change_score(-1,0,1,-1);
                }
            }
            situation.choix.push(choix);
            choix = {
                nom : "Appeller la gendarmerie",
                texte : "Tant mieux c'est Marc qui répond. Il peut donc vous envoyer sans problème de nouvelles photos cronstillantes." + write_score(0,-1,1,-1),
                action : function () {
                    change_score(0,-1,1,-1);
                }
            }
            situation.choix.push(choix);
            break;
        case 20:
            situation.texte = "Bartho vous propose une concoction pas piqué des hannetons.";
            choix = {
                nom : "Accepter",
                texte : "Vous sentez une force mystérieuse traverser votre corps. Votre esprit chavire devant votre nouveau pouvoir. À moins que ça ne soit juste un coma éthylique..." + write_score(-3,0,0,0),
                action : function () {
                    change_score(-3,0,0,0);
                }
            }
            situation.choix.push(choix);
            choix = {
                nom : "Décliner",
                texte : "C'est lui il te décline." + write_score(-1,0,-2,0),
                action : function () {
                    change_score(-1,0,-2,0);
                }
            }
            situation.choix.push(choix);
            break;
        case 21:
            situation.texte = "Une jeune fille que vous croisez dans la rue semble avoir compris l'essence de ce qui fait Dimensions.";
            choix = {
                nom : "L'inviter à rejoindre le serveur",
                texte : "Inviter une jeune fille sur un serveur fréquenté par Pinv ? Ça va pas la tête ou bien ? Allez pour la peine vous perdez des stats. Oui c'est gratuit je m'en fous." + write_score(-1,-1,-1,-1),
                action : function () {
                    change_score(-1,-1,-1,-1);
                }
            }
            situation.choix.push(choix);
            choix = {
                nom : "Laisser tranquille",
                texte : "Vous avez épargné une âme de bien des maux, félicitations. Vous êtes sur le chemin de la rédemption." + write_score(0,0,-2,0),
                action : function () {
                    change_score(0,0,-2,0);
                }
            }
            situation.choix.push(choix);
            break;
        case 22:
            situation.texte = "Dur le travail d'informaticien de nos jours...";
            choix = {
                nom : "L'aider à résoudre le bogue",
                texte : "La solution était tout simplement de copier coller un code stack overflow, Red vous remercie pour ce geste de bonté qui vous a demandé quelques neurones en surchauffe." + write_score(-1,-1,2,0),
                action : function () {
                    change_score(-1,-1,2,0);
                }
            }
            situation.choix.push(choix);
            choix = {
                nom : "Lui donner des somnifères",
                texte : "Red s'endort pour au moins un hiver entier mais Nico veille sur la couronne, c'est con." + write_score(0,0,-1,1),
                action : function () {
                    change_score(0,0,-1,1);
                }
            }
            situation.choix.push(choix);
            break;
        case 23:
            situation.texte = "Atchi à une énorme bite. Et il en est très fier. En même temps il y a de quoi.";
            choix = {
                nom : "Comparer avec la vôtre",
                texte : "Tssss... C'est pas gagné, hein. Atchi est un bon gars il vous réconforte. Mais vous toujours une ptite bite. Y compris si vous êtes une fille." + write_score(0,0,1,-2),
                action : function () {
                    change_score(0,0,1,-2);
                }
            }
            situation.choix.push(choix);
            choix = {
                nom : "Admirer",
                texte : "Bravo vous êtes homosexuels. Même si c'est faux c'est bien plus drôle de dire l'inverse. Vous avez gagné le droit à une insulte de nook et a des doutes de zero sur votre santé mentale." + write_score(0,0,-2,1),
                action : function () {
                    change_score(0,0,-2,1);
                }
            }
            situation.choix.push(choix);
            break;
        case 24:
            situation.texte = "Zero partage son point de vue concernant l'union entre deux êtres qui s'aiment.";
            choix = {
                nom : "Agréer",
                texte : "Vous êtes un giga flemmard ou êtes juste intéressés par la levrette dans le vide. Dans les cas, vous n'êtes pas sur Dimension pour rien." + write_score(0,0,2,-3),
                action : function () {
                    change_score(0,0,2,-3);
                }
            }
            situation.choix.push(choix);
            choix = {
                nom : "Refuter",
                texte : "Vous gardez encore espoir en votre prochain et éspérez finir vos jours dans le creux des bras de votre moitié. C'est beau. Par contre c'est terriblement no fun et on a dit les copains d'abord." + write_score(0,0,-3,2),
                action : function () {
                    change_score(0,0,-3,2);
                }
            }
            situation.choix.push(choix);
            break;
        case 25:
            situation.texte = "Les meilleurs discussions parlent souvent d'alcools.";
            choix = {
                nom : "6L c'est un peu bcp quand même",
                texte : "Félicitations vous n'êtes pas drôles. Ok vous avez plus de chance de rentrer vivant chez vous mais ça reste très peu Coluche." + write_score(0,0,-1,-1),
                action : function () {
                    change_score(0,0,-1,-1);
                }
            }
            situation.choix.push(choix);
            choix = {
                nom : "Team no limit",
                texte : "C'est pas une question de chiffres, c'est une question de mo-rpho-lo-gie." + write_score(-2,0,0,0),
                action : function () {
                    change_score(-2,0,0,0);
                }
            }
            situation.choix.push(choix);
            break;
        case 26:
            situation.texte = "Je ne dis rien et vous laisse faire votre propre avis.";
            choix = {
                nom : "Attendez mais on dirait...",
                texte : "Eh oui on dirait skelerex, le célèbre koopa squelette des jeux Mario. Comment, vous pensiez à quelqu'un d'autre ?" + write_score(0,1,0,0),
                action : function () {
                    change_score(0,1,0,0);
                }
            }
            situation.choix.push(choix);
            choix = {
                nom : "Nook est mort ?",
                texte : "Malheureusement non pas encore. Mais au moins vous savez à quoi il ressemblera devant St Pierre." + write_score(0,0,1,0),
                action : function () {
                    change_score(0,0,1,0);
                }
            }
            situation.choix.push(choix);
            break;
        case 27:
            situation.texte = "Un rapide sondage sur la réputation de pinv ne semble faire aucun doute quand à la nature de cet individu. Qu'en pensez-vous ?";
            choix = {
                nom : "Pédophile",
                texte : "Malgré l'unanimité du serveur sur son attirance douteuse pour les fans de fornite, vous ne faites rien. Il est quand même sympa Pinv." + write_score(0,0,1,-1),
                action : function () {
                    change_score(0,0,1,-1);
                }
            }
            situation.choix.push(choix);
            choix = {
                nom : "Tant que ya pelouse ya match",
                texte : "Pour information, répondre avec cette proposition déclenche automatiquement une procédure signalgouv." + write_score(0,0,3,-3),
                action : function () {
                    change_score(0,0,3,-3);
                }
            }
            situation.choix.push(choix);
            break;
        case 28:
            situation.texte = "C'est beau l'amour. Et vous, êtes vous capable d'en faire autant ?";
            choix = {
                nom : "Je suis célibataire",
                texte : "Ce n'est pas une escuse, comment voulez vous trouver l'âme soeur si vous ne faites pas un effort ? Apprenez donc toutes les dates d'anniversaires des filles que vous connaissez de près ou de loin, on ne sait jamais." + write_score(0,1,0,-1),
                action : function () {
                    change_score(0,1,0,-1);
                }
            }
            situation.choix.push(choix);
            choix = {
                nom : "Oui bien sûr",
                texte : "Vous êtes un fidèle, un preux chevalier. Votre compagne est ravie de vous avoir à vos côtés sauf quand vous hurlez dans votre chambre devant un anime à 2h du mat." + write_score(0,0,-1,2),
                action : function () {
                    change_score(0,0,-1,2);
                }
            }
            situation.choix.push(choix);
            break;
        case 29:
            situation.texte = "Un savant semble avoir inventé un breuvage succulent.";
            choix = {
                nom : "Lui demander une ptite gorgée",
                texte : "Le soda mystique (comme il l'appelle) guérit quelques unes de vos blessures." + write_score(1,0,0,0),
                action : function () {
                    change_score(1,0,0,0);
                }
            }
            situation.choix.push(choix);
            choix = {
                nom : "Acheter le stock entier",
                texte : "Vous aviez sacrément soif. Votre bide est rempli et vous avez des gaz à en faire rougir Jupiter. Malgré tout la mystérieuse potion vous rend toute votre santé." + write_score(10,0,0,-3),
                action : function () {
                    change_score(10,0,0,-3);
                }
            }
            situation.choix.push(choix);
            break;
        case 30:
            situation.texte = "Un chevalier sonne à votre porte et vous propose d'embarquer pour de folles aventures en sa compagnie.";
            choix = {
                nom : "Grimper avec lui vers l'arc en ciel le plus proche",
                texte : "Vous vous réveillez porte de la chapelle, sans portefeuille et sans hymen. Pas sûr que c'était de la poudre de perlimpinpin..." + write_score(-2,-2,2,2),
                action : function () {
                    change_score(-2,-2,2,2);
                }
            }
            situation.choix.push(choix);
            choix = {
                nom : "Awai",
                texte : "Vous êtes en effet UN PEU chargé. Gardez les pieds sur terre vous prive d'un formidable épopée mais vous préservez vos reins." + write_score(0,0,0,1),
                action : function () {
                    change_score(0,0,0,1);
                }
            }
            situation.choix.push(choix);
            break;
        case 31:
            situation.texte = "L'armée française et un gang de gitan font équipe contre vous.";
            choix = {
                nom : "Tenter la bagar",
                texte : "Entre les chevaucheurs de sangliers et les M16 vous ne pouvez pas lutter. Vous vous faîtes tazer les poils de torses et on vous chie dessus." + write_score(-3,0,1,1),
                action : function () {
                    change_score(-3,0,1,1);
                }
            }
            situation.choix.push(choix);
            choix = {
                nom : "Se rendre",
                texte : "Votre capitulation vous sauve la mise, ils étaient juste à la recherche de votre jumeau diabolique séparé à la naissance. L'erreur est commune." + write_score(0,0,0,0),
                action : function () {
                    change_score(0,0,0,0);
                }
            }
            situation.choix.push(choix);
            break;
        case 32:
            situation.texte = "Pinv tente de renverser le conseil des 4 en manigancant dans l'ombre.";
            choix = {
                nom : "L'aider et conspirer",
                texte : "Niark niark niark... Vous et les autres rebelles profitez d'une faille dans le système pour vous cacher aux yeux du pouvoir en place (ne vous emballez pas vous êtes caché dans un fil dans les channels de jeux vidéos où personne ne va)." + write_score(0,-1,2,-1),
                action : function () {
                    change_score(0,-1,2,-1);
                }
            }
            situation.choix.push(choix);
            choix = {
                nom : "Prévenir le conseil",
                texte : "Ah bah pas besoin, Red a remarqué tout seul que Pinv avait des perms anormales en checkant les paramètres du serv. Des fois il s'en faut de peu pour détenir la couronne ou juste passer pour un con." + write_score(0,-1,1,0),
                action : function () {
                    change_score(0,-1,1,0);
                }
            }
            situation.choix.push(choix);
            break;
        case 33:
            situation.texte = "Le bitcoin a l'air de sacrément reprendre la côte.";
            choix = {
                nom : "Investir, VITE !",
                texte : "Vous perdez tout sur ce coup de tête. Vous vous sentez con mais dites vous qu'il y a pire : des gens achètent des skins sur League of Legends ou des packs dans des gachas..." + write_score(0,1,0,-3),
                action : function () {
                    change_score(0,1,0,-3);
                }
            }
            situation.choix.push(choix);
            choix = {
                nom : "Pas pour moi",
                texte : "Vous êtes déjà pauvre et vous le resterez, c'est une bonne protection aux risques d'une crise économique." + write_score(0,-1,0,-1),
                action : function () {
                    change_score(0,-1,0,-1);
                }
            }
            situation.choix.push(choix);
            break;
        case 34:
            situation.texte = "Red avale goulûment les dernières gouttes d'une boisson incroyable et vous demande d'en racheter d'autre. Mais au chemin du retour, vous hésitez.";
            choix = {
                nom : "Boire la bouteille en secret",
                texte : "Il voit tout. Au moment même où vous vous décidez d'ouvrir la sainte bouteille, un marteau fend l'air pour vous péter la gueule. On ne touche pas au bien d'autrui ok ?" + write_score(-2,0,-1,0),
                action : function () {
                    change_score(-2,0,-1,0);
                }
            }
            situation.choix.push(choix);
            choix = {
                nom : "Lui donner comme convenu",
                texte : "Red vous remercie et vous permet de goûter le précieux breuvage en guise de récompense." + write_score(1,0,1,0),
                action : function () {
                    change_score(1,0,1,0);
                }
            }
            situation.choix.push(choix);
            break;
        case 35:
            situation.texte = "Nook veut vous apprendre les arcanes du magnétisme.";
            choix = {
                nom : "Let's go devenir Magneto",
                texte : "Plaquer une cuillère sur son épaule ne faisant pas de vous un Xmen vous sortez très deçu de cette masterclass improvisée. Pa contre vous savez tirez des lasers avec vos yeux et ça c'est classe." + write_score(0,1,0,-1),
                action : function () {
                    change_score(0,1,0,-1);
                }
            }
            situation.choix.push(choix);
            choix = {
                nom : "S'amuser à lui lancer des objets en métal",
                texte : "Vous êtes malin, Nook est obligé de vous supplier d'arrêter ça et vous donne tous ses cailloux en échange." + write_score(0,-2,2,0),
                action : function () {
                    change_score(0,-2,2,0);
                }
            }
            situation.choix.push(choix);
            break;
        case 36:
            situation.texte = "Algolbarth nous partage sa vision du romantisme, pas sûr qu'il soit le mieux placé pour ça. Demandons à une personne plus avisée, c'est à dire vous.";
            choix = {
                nom : "Je suis un véritable gentleman",
                texte : "Et vous êtes un exemple à suivre. Toutes les femmes du monde vous en remercie et par vos dires emplies d'humanité, c'est même l'entiereté de la création qui vous encense. Par contre être en couple ça coûte cher, nah raf vous perdez des cailloux." + write_score(0,0,-1,3),
                action : function () {
                    change_score(0,0,-1,3);
                }
            }
            situation.choix.push(choix);
            choix = {
                nom : "Toutes des putes",
                texte : "Ça valait bien le coup de vous demandez votre avis. A force de penser comme ça vous finirez vos jours tous seuls vous savez ? Cependant l'absence de proche vous permet de jouir seul de vos biens. Etre un connard, ça a aussi des avantages." + write_score(0,-1,0,-1),
                action : function () {
                    change_score(0,-1,0,-1);
                }
            }
            situation.choix.push(choix);
            break;
        case 37:
            situation.texte = "Un petit débat sur la peine de mort ça vous dit dit ? Parfait car Dimensions regorge de personnes éclairées sur ce sujet.";
            choix = {
                nom : "Trop stylé la perpetuité",
                texte : "Mais oui l'ami Bartholomé a raison, c'est trop marrant. En plus si on coupait toutes les têtes on aurait plus d'évasion possible, pas de film avec Morgan Freeman, pas de fun quoi. Alors oui yen a qui deviennent fous mais c'est le jeu ma pauvre Lucette." + write_score(0,-1,1,0),
                action : function () {
                    change_score(0,-1,1,0);
                }
            }
            situation.choix.push(choix);
            choix = {
                nom : "Qu'on leur coupe la tête !",
                texte : "Vous êtes un nostalgique de l'époque de la Terreur, un fan de la guillotine, bref un français, un vrai. Vous faîtes rayonner la culture française dans le monde en cassant des nuques, c'est beau." + write_score(0,-1,0,1),
                action : function () {
                    change_score(0,-1,0,1);
                }
            }
            situation.choix.push(choix);
            break;
        case 38:
            situation.texte = "Un scientifique bien étrange vous propose durant une Japan expo de remonter dans le temps en entrant dans un micro-onde.";
            choix = {
                nom : "Le suivre",
                texte : "Il vous transforme en banane. Ce n'est pas désagréable mais vous avez passé plusieurs années pour revenir dans votre temporalité initiale." + write_score(-1,-1,3,-1),
                action : function () {
                    change_score(-1,-1,3,-1);
                }
            }
            situation.choix.push(choix);
            choix = {
                nom : "Vous êtes le vieux dans retour vers le futur ?",
                texte : "Eh non ce n'est pas lui. Du coup zêtes ban temporairement. Tout le monde n'a pas votre culture mon vieux." + write_score(0,2,-3,0),
                action : function () {
                    change_score(0,2,-3,0);
                }
            }
            situation.choix.push(choix);
            break;
    }
    return situation;
}