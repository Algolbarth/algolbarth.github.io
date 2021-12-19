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
            situation.texte = "Bartho veut tester votre bravoure et vous dévoile sa puissante musculature.";
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
                nom : "Bien sur j'adore Marvel",
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
            let random_intel = -parseInt(Math.random()*3 + 1);
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
    }
    return situation;
}