function collection () {
    initialiser();
    div("main");
    fonction("Retour","ecran_titre()");
    saut(2);
    fonction("Filtrer","collection_filtre()");
    afficher(" Trier par <select id='tri' onchange='collection_tri()'>")
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
    saut(2);
    afficher(Jeu.collection.length + " résultats");
    saut(2);
    if (Jeu.collection_ordre == "croissant") {
        for (let n=0;n<Jeu.collection.length;n++) {
            fonction(Jeu.collection[n].nom,"carte_voir_id(" + Jeu.collection[n].id + ")");
            saut();
        }
    }
    else if (Jeu.collection_ordre == "decroissant") {
        for (let n=Jeu.collection.length-1;n>=0;n--) {
            fonction(Jeu.collection[n].nom,"carte_voir_id(" + Jeu.collection[n].id + ")");
            saut();
        }
    }
    div_fin();
    div("carte");
    div_fin();
    actualiser();
}

function collection_init () {
    Jeu.collection = [];
    for (let n=1;n<=Jeu.NOMBRE_CARTE;n++) {
        Jeu.collection.push(obtenir_carte(n));
    }
    for (let i=0;i<Jeu.collection.length;i++) {
        let j = i;
        while (j > 0 && Jeu.collection[j-1].nom.localeCompare(Jeu.collection[j].nom) > 0) {
            let a = Jeu.collection[j];
            let b = Jeu.collection[j - 1];
            Jeu.collection[j] = b;
            Jeu.collection[j - 1] = a;
            j--;
        }
    }
    Jeu.collection_ordre = "croissant";
}

function collection_tri () {
    Jeu.collection_tri = document.getElementById("tri").value;
    switch (Jeu.collection_tri) {
        case "nom":
            for (let i=0;i<Jeu.collection.length;i++) {
                let j = i;
                while (j > 0 && Jeu.collection[j-1].nom.localeCompare(Jeu.collection[j].nom) > 0) {
                    let a = Jeu.collection[j];
                    let b = Jeu.collection[j - 1];
                    Jeu.collection[j] = b;
                    Jeu.collection[j - 1] = a;
                    j--;
                }
            }
            break;
        case "id":
            for (let i=0;i<Jeu.collection.length;i++) {
                let j = i;
                while (j > 0 && Jeu.collection[j-1].id > Jeu.collection[j].id) {
                    let a = Jeu.collection[j];
                    let b = Jeu.collection[j - 1];
                    Jeu.collection[j] = b;
                    Jeu.collection[j - 1] = a;
                    j--;
                }
            }
            break;
        case "cout":
            for (let i=0;i<Jeu.collection.length;i++) {
                let j = i;
                while (j > 0 && cout_total(Jeu.collection[j-1]) > cout_total(Jeu.collection[j])) {
                    let a = Jeu.collection[j];
                    let b = Jeu.collection[j - 1];
                    Jeu.collection[j] = b;
                    Jeu.collection[j - 1] = a;
                    j--;
                }
            }
            break;
    }
    collection();
}

function collection_filtre () {
    initialiser();
    fonction("Retour","collection()");
    saut(2);
    afficher("Type de carte : <select id='filtre_type'>")
    afficher("<option value=" + '"Tous"' + ">Tous</option>");
    for (let n=0;n<Jeu.types.length;n++) {
        afficher("<option value=" + Jeu.types[n]);
        if (Jeu.collection_filtre.type == Jeu.types[n]) {
            afficher(" selected=" + '"selected"');
        }
        afficher(">" + Jeu.types[n] + "</option>");
    }
    afficher("</select>");
    saut(2);
    afficher("Famille : <select id='filtre_famille'>")
    afficher("<option value=" + '"Toutes"' + ">Toutes</option>");
    for (let n=0;n<Jeu.familles.length;n++) {
        afficher("<option value=" + Jeu.familles[n]);
        if (Jeu.collection_filtre.famille == Jeu.familles[n]) {
            afficher(" selected=" + '"selected"');
        }
        afficher(">" + Jeu.familles[n] + "</option>");
    }
    afficher("</select>");
    saut(2);
    afficher("Coût : <select id='filtre_cout'>")
    afficher("<option value=" + '"Tous"' + ">Tous</option>");
    for (let n=0;n<Jeu.ressources.length;n++) {
        afficher("<option value=" + n);
        if (Jeu.collection_filtre.cout == n) {
            afficher(" selected=" + '"selected"');
        }
        afficher(">" + Jeu.ressources[n].nom + "</option>");
    }
    afficher("</select>");
    saut(2);
    afficher("Niveau de boutique : <select id='filtre_boutique'>")
    afficher("<option value=" + '"Tous"' + ">Tous</option>");
    for (let n=1;n<=10;n++) {
        afficher("<option value=" + n);
        if (Jeu.collection_filtre.boutique == n) {
            afficher(" selected=" + '"selected"');
        }
        afficher(">" + n + "</option>");
    }
    afficher("</select>");
    saut(2);
    fonction("Filtrer","collection_filtre_appliquer()");
    actualiser();
}

function collection_filtre_appliquer () {
    let filtre = {
        type : document.getElementById("filtre_type").value,
        famille : document.getElementById("filtre_famille").value,
        cout : document.getElementById("filtre_cout").value,
        boutique : document.getElementById("filtre_boutique").value
    }
    Jeu.collection_filtre = filtre;
    Jeu.collection = [];
    for (let n=1;n<=Jeu.NOMBRE_CARTE;n++) {
        let carte = obtenir_carte(n);
        if ((filtre.type == carte.type || filtre.type == "Tous") && (carte.familles.includes(filtre.famille) || filtre.famille == "Toutes") && (carte.cout[filtre.cout] > 0 || filtre.cout == "Tous") && (((cout_total(carte) <= filtre.boutique*5 || filtre.boutique == 10) && cout_total(carte) > (filtre.boutique - 1)*5) || filtre.boutique == "Tous")) {
            Jeu.collection.push(obtenir_carte(n));
        }
    }
    switch (Jeu.collection_tri) {
        case "id":
            collection_tri_id();
            break
        case "nom":
            collection_tri_nom();
            break
        case "cout":
            collection_tri_cout();
            break
    }
    collection();
}