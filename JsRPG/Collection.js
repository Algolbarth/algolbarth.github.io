function collection() {
    initialiser();
    fonction("Retour", "son_bouton();accueil()");
    afficher("<center>");
    fonction("Filtrer", "collection_filtre()");
    afficher(" Trier par <select id='tri' onchange='collection_tri_appliquer()'>")
    afficher("<option value='nom'");
    if (Jeu.collection_tri == "nom") {
        afficher(" selected=" + '"selected"');
    }
    afficher(">Nom</option>");
    afficher("<option value='id'");
    if (Jeu.collection_tri == "id") {
        afficher(" selected=" + '"selected"');
    }
    afficher(">Numéro</option>");
    afficher("<option value='cout'");
    if (Jeu.collection_tri == "cout") {
        afficher(" selected=" + '"selected"');
    }
    afficher(">Coût total</option>");
    afficher("</select> ");
    if (Jeu.collection_ordre == "croissant") {
        fonction("Croissant", "Jeu.collection_ordre=" + '"decroissant"' + ";collection()");
    }
    else {
        fonction("Décroissant", "Jeu.collection_ordre=" + '"croissant"' + ";collection()");
    }
    afficher(" - " + Jeu.collection.length + " résultats");
    afficher("</center>");
    div("main");
    if (Jeu.collection_ordre == "croissant") {
        for (let n = 0; n < Jeu.collection.length; n++) {
            div("", "carte");
            fonction(Jeu.collection[n].nom, "carte_voir_id(" + Jeu.collection[n].id + ',"carte_side")');
            div_fin();
        }
    }
    else if (Jeu.collection_ordre == "decroissant") {
        for (let n = Jeu.collection.length - 1; n >= 0; n--) {
            div("", "carte");
            fonction(Jeu.collection[n].nom, "carte_voir_id(" + Jeu.collection[n].id + ',"carte_side")');
            div_fin();
        }
    }
    div_fin();
    div("carte_side", "affichage");
    div_fin();
    actualiser();
}

function collection_init() {
    Jeu.collection = [];
    for (let n = 1; n <= Jeu.NOMBRE_CARTE; n++) {
        Jeu.collection.push(obtenir_carte(n));
    }
    for (let i = 0; i < Jeu.collection.length; i++) {
        let j = i;
        while (j > 0 && Jeu.collection[j - 1].nom.localeCompare(Jeu.collection[j].nom) > 0) {
            let a = Jeu.collection[j];
            let b = Jeu.collection[j - 1];
            Jeu.collection[j] = b;
            Jeu.collection[j - 1] = a;
            j--;
        }
    }
    Jeu.collection_ordre = "croissant";
}

function collection_tri_appliquer() {
    Jeu.collection_tri = document.getElementById("tri").value;
    collection_tri();
    collection();
}

function collection_tri() {
    switch (Jeu.collection_tri) {
        case "nom":
            for (let i = 0; i < Jeu.collection.length; i++) {
                let j = i;
                while (j > 0 && Jeu.collection[j - 1].nom.localeCompare(Jeu.collection[j].nom) > 0) {
                    let a = Jeu.collection[j];
                    let b = Jeu.collection[j - 1];
                    Jeu.collection[j] = b;
                    Jeu.collection[j - 1] = a;
                    j--;
                }
            }
            break;
        case "id":
            for (let i = 0; i < Jeu.collection.length; i++) {
                let j = i;
                while (j > 0 && Jeu.collection[j - 1].id > Jeu.collection[j].id) {
                    let a = Jeu.collection[j];
                    let b = Jeu.collection[j - 1];
                    Jeu.collection[j] = b;
                    Jeu.collection[j - 1] = a;
                    j--;
                }
            }
            break;
        case "cout":
            for (let i = 0; i < Jeu.collection.length; i++) {
                let j = i;
                while (j > 0 && cout_total(Jeu.collection[j - 1]) > cout_total(Jeu.collection[j])) {
                    let a = Jeu.collection[j];
                    let b = Jeu.collection[j - 1];
                    Jeu.collection[j] = b;
                    Jeu.collection[j - 1] = a;
                    j--;
                }
            }
            break;
    }
}

function collection_filtre() {
    initialiser();
    fonction("Retour", "collection()");
    saut(2);
    afficher("Type de carte : <select id='filtre_type'>")
    afficher("<option value=" + '"Tous"' + ">Tous</option>");
    for (let n = 0; n < Jeu.types.length; n++) {
        afficher("<option value=" + Jeu.types[n]);
        if (Jeu.collection_filtre.type == Jeu.types[n]) {
            afficher(" selected=" + '"selected"');
        }
        afficher(">" + Jeu.types[n] + "</option>");
    }
    afficher("</select>");
    saut(2);
    afficher("Famille : <select id='filtre_famille'>");
    afficher("<option value=" + '"Toutes"' + ">Toutes</option>");
    for (let n = 0; n < Jeu.familles.length; n++) {
        afficher("<option value=" + '"' + Jeu.familles[n]);
        if (Jeu.collection_filtre.famille == Jeu.familles[n]) {
            afficher('"' + " selected=" + '"selected"');
        }
        afficher('"' + ">" + Jeu.familles[n] + "</option>");
    }
    afficher("</select>");
    saut(2);
    afficher("Élément : <select id='filtre_element'>")
    afficher("<option value=" + '"Tous"' + ">Tous</option>");
    for (let n = 0; n < Jeu.ressources.length; n++) {
        afficher("<option value=" + n);
        if (Jeu.collection_filtre.element == n) {
            afficher(" selected=" + '"selected"');
        }
        afficher(">");
        if (n == 0) {
            afficher("Neutre");
        }
        else {
            afficher(Jeu.ressources[n].nom);
        }
        afficher("</option>");
    }
    afficher("</select>");
    saut(2);
    afficher("Niveau : <select id='filtre_boutique'>")
    afficher("<option value=" + '"Tous"' + ">Tous</option>");
    for (let n = 1; n <= 20; n++) {
        afficher("<option value=" + n);
        if (Jeu.collection_filtre.boutique == n) {
            afficher(" selected=" + '"selected"');
        }
        afficher(">" + n + "</option>");
    }
    afficher("</select>");
    saut(2);
    fonction("Filtrer", "collection_filtre_appliquer()");
    actualiser();
}

function collection_filtre_appliquer() {
    let filtre = {
        type: document.getElementById("filtre_type").value,
        famille: document.getElementById("filtre_famille").value,
        element: document.getElementById("filtre_element").value,
        boutique: document.getElementById("filtre_boutique").value
    }
    Jeu.collection_filtre = filtre;
    Jeu.collection = [];
    for (let n = 1; n <= Jeu.NOMBRE_CARTE; n++) {
        let carte = obtenir_carte(n);
        if ((filtre.type == carte.type || filtre.type == "Tous") && (carte.familles.includes(filtre.famille) || filtre.famille == "Toutes") && (((cout_total(carte) <= filtre.boutique * 5 || filtre.boutique == 20) && cout_total(carte) > (filtre.boutique - 1) * 5) || filtre.boutique == "Tous")) {
            if (filtre.element == "Tous") {
                Jeu.collection.push(obtenir_carte(n));
            }
            else if (filtre.element == 0 && cout_total(carte) == carte.cout[0]) {
                Jeu.collection.push(obtenir_carte(n));
            }
            else if (carte.elements.includes(Jeu.ressources[filtre.element].nom) > 0) {
                Jeu.collection.push(obtenir_carte(n));
            }
        }
    }
    collection_tri();
    collection();
}