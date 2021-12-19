function demarrage () {
    Compte = {
        situation_nombre : 16,
        carte_nombre : 50,
        version : "0.0.1",
        jeu : {},
        nom : "",
        connexion : false,
        best_score : 0,
        argent : 0,
        cartes : [],
        nombre_partie : 0,
        carte_achat : 0,
        carte_obtenu : 0,
        argent_win : 0,
    }
    for (let n=0;n<Compte.carte_nombre;n++) {
        Compte.cartes.push(0);
    }
    ecran_titre();
}

function ecran_titre () {
    document.body.style.backgroundImage = "url('Images/ecran.png')";
    document.body.style.backgroundSize = "cover";
    initialiser();
    fonction("<div class='ecran_titre'>Cliquez pour démarrer</div>",'document.body.style.backgroundImage="none";menu()');
    actualiser();
}

function menu () {
    initialiser();
    afficher("<center>");
    afficher("<div class='titre'>Dimensions the Game</div>");
    afficher(Compte.version);
    saut(2);
    fonction("<div class='bouton'>Jouer</div>","nouvelle_partie()");
    saut(2);
    fonction("<div class='bouton'>Règles</div>","rules()");
    saut(2);
    if (Compte.connexion) {
        fonction("<div class='bouton'>Boutique</div>","shop()");
        saut(2);
        fonction("<div class='bouton'>Collection</div>","collection()");
        saut(2);
        fonction("<div class='bouton'>" + Compte.nom + "</div>","compte()");
        saut(2);
        afficher("<img src='Images/best.svg' style='width:1%;' /> Meilleur score : " + Compte.best_score);
        saut(1);
        afficher(Compte.argent + " <img src='Images/caillou.png' style='width:1%;' />");
        saut(2);
        fonction("<div class='bouton'>Se déconnecter</div>","deconnexion()");
    }
    else {
        fonction("<div class='bouton'>Se connecter</div>","connexion()");
    }
    afficher("</center>");
    actualiser();
}

function connexion () {
    initialiser();
    afficher("<center>");
    fonction("<div class='bouton'>Retour</div>","menu()");
    saut(2);
    afficher("Entrez votre code de sauvegarde");
    saut(1);
    afficher("<input id='save' type='text' />");
    saut(2);
    fonction("<div class='bouton'>Se connecter</div>","charger_save()");
    saut(2);
    fonction("<div class='bouton'>Créer un compte</div>","creer_compte()");
    afficher("</center>");
    actualiser();
}

function creer_compte () {
    initialiser();
    afficher("<center>");
    fonction("<div class='bouton'>Retour</div>","menu()");
    saut(2);
    afficher("Choississez votre nom de compte");
    saut(1);
    afficher("<input id='nom' type='text' />");
    saut(2);
    fonction("<div class='bouton'>Valider</div>","nouveau_compte()");
    saut(2);
    fonction("<div class='bouton'>J'ai déjà un compte</div>","connexion()");
    afficher("</center>");
    actualiser();
}

function nouveau_compte () {
    let nom = document.getElementById("nom").value;
    let verif = true;
    for (let n=0;n<nom.length;n++) {
        if (nom[n] == "_") {
            verif = false;
        }
    }
    if (nom == "" || nom == " ") {
        verif = false;
    }
    if (verif) {
        Compte.nom = nom;
        Compte.connexion = true;
        menu();
    }
}

function charger_save () {
    let save = document.getElementById("save").value;
    save = CryptoJS.AES.decrypt(save,"dimension");
    save = save.toString(CryptoJS.enc.Utf8);
    if (save[save.length-1] == "_") {
        let step = 0;
        let nom = "";
        while (save[step] != "_") {
            nom += save[step];
            step++;
        }
        Compte.nom = nom;
        step++;
        let score = "";
        while (save[step] != "_") {
            score += save[step];
            step++;
        }
        Compte.best_score = parseInt(score);
        step++;
        let nombre_partie = "";
        while (save[step] != "_") {
            nombre_partie += save[step];
            step++;
        }
        Compte.nombre_partie = parseInt(nombre_partie);
        step++;
        let carte_achat = "";
        while (save[step] != "_") {
            carte_achat += save[step];
            step++;
        }
        Compte.carte_achat = parseInt(carte_achat);
        step++;
        let carte_obtenu = "";
        while (save[step] != "_") {
            carte_obtenu += save[step];
            step++;
        }
        Compte.carte_obtenu = parseInt(carte_obtenu);
        step++;
        let argent = "";
        while (save[step] != "_") {
            argent += save[step];
            step++;
        }
        Compte.argent = parseInt(argent);
        step++;
        let argent_win = "";
        while (save[step] != "_") {
            argent_win += save[step];
            step++;
        }
        Compte.argent_win = parseInt(argent_win);
        for (let n=0;n<Compte.carte_obtenu;n++) {
            step++;
            let carte_id = "";
            while (save[step] != "_") {
                carte_id += save[step];
                step++;
            }
            carte_id = parseInt(carte_id);
            step++;
            let carte_nombre = "";
            while (save[step] != "_") {
                carte_nombre += save[step];
                step++;
            }
            carte_nombre = parseInt(carte_nombre);
            Compte.cartes[carte_id] = carte_nombre;
        }
        Compte.connexion = true;
        menu();
    }
}

function deconnexion () {
    Compte.connexion = false;
    Compte.best_score = 0;
    Compte.argent = 0;
    Compte.nom = "";
    for (let n=0;n<Compte.carte_nombre;n++) {
        Compte.cartes[n] = 0;
    }
    menu();
}

function nouvelle_partie () {
    Compte.jeu = {
        score : 0,
        sante : 10,
        intel : 10,
        reput : 10,
        social : 10,
        situation : obtenir_situation(parseInt(Math.random()*Compte.situation_nombre + 1)),
    }
    jeu_choix();
}

function jeu_choix () {
    initialiser();
    jeu_interface();
    afficher("<center>");
    afficher("<img src='Images/Situations/" + Compte.jeu.situation.id + ".png' class='image'>");
    saut(2);
    afficher("<div class='result'>" + Compte.jeu.situation.texte + "</div>");
    saut(2);
    for (let n=0;n<Compte.jeu.situation.choix.length;n++) {
        fonction("<div class='bouton'>" + Compte.jeu.situation.choix[n].nom + "</div>","choisir(" + n + ")");
        afficher(" ");
    }
    afficher("</center>");
    actualiser();
}

function choisir (choix_slot) {
    Compte.jeu.situation.choix[choix_slot].action();
    jeu_resultat(choix_slot);
}

function jeu_resultat (choix_slot) {
    initialiser();
    jeu_interface();
    afficher("<center>");
    afficher("<div class='result'>" + Compte.jeu.situation.choix[choix_slot].texte + "</div>");
    saut(2);
    fonction("<div class='bouton' style='width:50em'>Continuer</div>","jeu_suivant()");
    afficher("</center>");
    actualiser();
}

function jeu_suivant () {
    if (jeu_test()) {
        Compte.jeu.score++;
        let situation_id = parseInt(Math.random()*Compte.situation_nombre + 1);
        while (situation_id == Compte.situation.id) {
            situation_id = parseInt(Math.random()*Compte.situation_nombre + 1);
        }
        Compte.jeu.situation = obtenir_situation(situation_id);
        jeu_choix();
    }
    else {
        jeu_finish();
    }
}

function jeu_test () {
    if (Compte.jeu.sante <= 0 || Compte.jeu.intel <= 0 || Compte.jeu.reput <= 0 || Compte.jeu.social <= 0) {
        return false;
    }
    return true;
}

function jeu_finish () {
    Compte.nombre_partie++;
    initialiser();
    afficher("<center>");
    afficher("Score : " + Compte.jeu.score);
    if (Compte.connexion) {
        if (Compte.jeu.score > Compte.best_score) {
            Compte.best_score = Compte.jeu.score;
            saut(2);
            afficher("<img src='Images/best.svg' style='width:1%;' /> Meilleur score : " + Compte.best_score);
        }
        saut(2);
        afficher("<img src='Images/caillou.png' style='width:1%;' /> " + Compte.argent + " + " + Compte.jeu.score);
        Compte.argent += Compte.jeu.score;
        Compte.argent_win += Compte.jeu.score;
    }
    saut(2);
    fonction("<div class='bouton'>Petite dernière ?</div>","nouvelle_partie()");
    saut(2);
    fonction("<div class='bouton'>Menu</div>","menu()");
    afficher("</center>");
    actualiser();
}

function jeu_interface () {
    fonction("<div class='bouton' style='width:12em'>Pause</div>","pause()");
    saut(2);
    afficher("Score : " + Compte.jeu.score);
    saut(2);
    afficher("<div class='flex'><div class='progress'><div class='bar' style='width:" + (Compte.jeu.sante*10) + "%;'></div></div> <img src='Images/sante.svg' style='width:1%;' /> Santé : " + Compte.jeu.sante + " / 10</div>");
    saut(1);
    afficher("<div class='flex'><div class='progress'><div class='bar' style='width:" + (Compte.jeu.intel*10) + "%;'></div></div> <img src='Images/intel.svg' style='width:1%;' /> Intelligence : " + Compte.jeu.intel + " / 10</div>");
    saut(1);
    afficher("<div class='flex'><div class='progress'><div class='bar' style='width:" + (Compte.jeu.reput*10) + "%;'></div></div> <img src='Images/reput.svg' style='width:1%;' /> Réputation : " + Compte.jeu.reput + " / 10</div>");
    saut(1);
    afficher("<div class='flex'><div class='progress'><div class='bar' style='width:" + (Compte.jeu.social*10) + "%;'></div></div> <img src='Images/social.svg' style='width:1%;' /> Vie sociale : " + Compte.jeu.social + " / 10</div>");
}

function pause () {
    initialiser();
    afficher("<center>");
    afficher("Partie en pause");
    saut(2);
    afficher("Votre score est de " + Compte.jeu.score);
    saut(2);
    if (Compte.jeu.score <= Compte.best_score) {
        afficher("Votre meilleur score <img src='Images/best.svg' style='width:1%;' /> est de " + Compte.best_score);
    }
    else {
        afficher("<img src='Images/best.svg' style='width:1%;' /> C'est un nouveau record ! <img src='Images/best.svg' style='width:1%;' />");
    }
    saut(2);
    fonction("<div class='bouton'>Continuer</div>","jeu_choix()");
    saut(2);
    fonction("<div class='bouton'>Quitter la partie</div>","jeu_finish()");
    afficher("</center>");
    actualiser();
}

function change_score (sante,intel,reput,social) {
    Compte.jeu.sante += sante;
    if (Compte.jeu.sante > 10) {
        Compte.jeu.sante = 10;
    }
    Compte.jeu.intel += intel;
    if (Compte.jeu.intel > 10) {
        Compte.jeu.intel = 10;
    }
    Compte.jeu.reput += reput;
    if (Compte.jeu.reput > 10) {
        Compte.jeu.reput = 10;
    }
    Compte.jeu.social += social;
    if (Compte.jeu.social > 10) {
        Compte.jeu.social = 10;
    }
}

function write_score (sante,intel,reput,social) {
    let text = "";
    if (sante != 0) {
        text += "<br/>";
        if (sante > 0) {
            text += "+" + sante;
        }
        else {
            text += sante;
        }
        text += " Santé";
    }
    if (intel != 0) {
        text += "<br/>";
        if (intel > 0) {
            text += "+" + intel;
        }
        else {
            text += intel;
        }
        text += " Intelligence";
    }
    if (reput != 0) {
        text += "<br/>";
        if (reput > 0) {
            text += "+" + reput;
        }
        else {
            text += reput;
        }
        text += " Réputation";
    }
    if (social != 0) {
        text += "<br/>";
        if (social > 0) {
            text += "+" + social;
        }
        else {
            text += social;
        }
        text += " Vie sociale";
    }
    return text;
}

function rules () {
    initialiser();
    afficher("<center>");
    fonction("<div class='bouton'>Retour</div>","menu()");
    saut(2);
    afficher("Comment jouer à Dimensions the Game ?");
    saut(2);
    afficher("Dimensions a beau être ouvert à tout le monde, ce n'est pas un endroit facile à vivre... Seuls les plus valeureux arriveront à survivre dans ce serveur hostile, étrange mais si sympathique !");
    saut(1);
    afficher("Dans ce jeu, vous incarnez un nouveau membre de dimensions.");
    saut(1);
    afficher("Votre but ? Restez le plus longtemps possible sur le serveur.");
    saut(1);
    afficher("Mais ce ne sera pas chose aisée car il vous faudra gérer votre santé (physique <img src='Images/sante.svg' style='width:1%;' /> ou mentale <img src='Images/intel.svg' style='width:1%;' />), votre réputation sur le serveur <img src='Images/reput.svg' style='width:1%;' /> et votre vie sociale <img src='Images/social.svg' style='width:1%;' />.");
    saut(1);
    afficher("Chacun de ses attributs est représenté par un score sur 10. Si une seule de ces ressources tombe à 0, vous devrez quitter le serveur, épuisé par tant d'aventures.");
    saut(1);
    afficher("Au fur et à mesure des jours qui passent sur Dimensions, vous rencontrerez des situations différentes et il vous faudra réagir à chacune d'entre elles.");
    saut(1);
    afficher("À chaque situation c'est à vous de faire vos choix, qui influeront sur vos ressources (oui vous pouvez aussi regagner des points on n'est pas des bêtes).");
    saut(1);
    afficher("Combien de jours tiendrez-vous face aux autres membres de Dimensions et son terrifiant conseil des 4 ?");
    saut(2);
    afficher("Si le jeu vous plaît, vous pouvez créer un compte pour garder votre progression.");
    saut(1);
    afficher("À chaque partie finie, vous gagnerez des cailloux <img src='Images/caillou.png' style='width:1%;' /> qui vous permettront <strike>de flex</strike> d'acheter des cartes à collectionner sur Dimensions.");
    saut(1);
    afficher("ATTENTION : Pour sauvegarder votre partie, allez dans l'onglet qui porte le nom de votre compte, puis récupérer le code de sauvegarde. Ce code vous permettra de récupérer votre compte dans l'état, ne le perdez pas.");
    afficher("</center>");
    actualiser();
}

function shop () {
    initialiser();
    afficher("<center>");
    fonction("<div class='bouton'>Retour</div>","menu()");
    saut(2);
    afficher("Vous avez " + Compte.argent + " <img src='Images/caillou.png' style='width:1%;' />");
    saut(2);
    afficher("<img src='Images/Cartes/cache.png' class='carte' />");
    saut(2);
    fonction("<div class='bouton'>Acheter une carte 100 <img src='Images/caillou.png' style='width:1em;' /></div>","acheter()");
    afficher("</center>");
    actualiser();
}

function acheter () {
    if (Compte.argent >= 100) {
        Compte.argent -= 100;
        voir_achat();
    }
}

function voir_achat () {
    initialiser();
    afficher("<center>");
    fonction("<img src='Images/Cartes/cache.png' class='new_carte' />","resultat_achat()");
    afficher("</center>");
    actualiser();
}

function resultat_achat () {
    let carte_id = parseInt(Math.random()*Compte.carte_nombre + 1);
    Compte.cartes[carte_id-1]++;
    Compte.carte_achat++;
    if (Compte.cartes[carte_id-1] == 1) {
        Compte.carte_obtenu++;
    }
    initialiser();
    afficher("<center>");
    afficher("<img src='Images/Cartes/" + carte_id + ".png' class='new_carte' />");
    saut(2);
    fonction("<div class='bouton'>Suivant</div>","shop()");
    afficher("</center>");
    actualiser();
}

function collection () {
    initialiser();
    afficher("<center>");
    fonction("<div class='bouton'>Retour</div>","menu()");
    saut(2);
    afficher(Compte.carte_obtenu + " / " + Compte.carte_nombre + " obtenues");
    saut(2);
    for (let n=0;n<Compte.cartes.length;n++) {
        if (Compte.cartes[n] > 0) {
            afficher("<img src='Images/Cartes/" + (n+1) + ".png' class='carte' />");
            saut(1);
            afficher(Compte.cartes[n] + " exemplaire");
            if (Compte.cartes[n] > 1) {
                afficher("s");
            }
            saut(1);
        }
    }
    afficher("</center>");
    actualiser();
}

function compte () {
    initialiser();
    afficher("<center>");
    fonction("<div class='bouton'>Retour</div>","menu()");
    saut(2);
    afficher(Compte.nom);
    saut(2);
    afficher("<img src='Images/best.svg' style='width:1%;' /> Meilleur score : " + Compte.best_score);
    saut(1);
    afficher(Compte.nombre_partie + " parties jouées");
    saut(1);
    afficher(Compte.carte_achat + " cartes achetées");
    saut(1);
    afficher(Compte.carte_obtenu + " cartes différentes obtenues");
    saut(1);
    afficher(Compte.argent + " <img src='Images/caillou.png' style='width:1%;' /> actuels");
    saut(1);
    afficher(Compte.argent_win + " <img src='Images/caillou.png' style='width:1%;' /> gagnés au total");
    saut(2);
    afficher("Code de sauvegarde");
    saut(1);
    let save_code = Compte.nom + "_" + Compte.best_score + "_" + Compte.nombre_partie + "_" + Compte.carte_achat + "_" + Compte.carte_obtenu + "_" + Compte.argent + "_" + Compte.argent_win + "_";
    for (let n=0;n<Compte.carte_nombre;n++) {
        if (Compte.cartes[n] > 0) {
            save_code += n + "_" + Compte.cartes[n] + "_";
        }
    }
    save_code = CryptoJS.AES.encrypt(save_code,"dimension");
    afficher(save_code);
    afficher("</center>");
    actualiser();
}