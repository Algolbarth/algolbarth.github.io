function demarrage () {
    Dossiers = [];
    Sites = [];
    ajouter_sites();
    trier_sites();
    trier_dossiers();
    menu();
}

function menu () {
    initialiser();
    afficher("Navigator");
    saut(2);
    fonction("Web","web()");
    saut(1);
    for (let n=0;n<Dossiers.length;n++) {
        fonction(Dossiers[n].nom,"voir_dossier(" + n + "," + '"menu()"' + ")");
        saut(1);
    }
    actualiser();
}

function web () {
    initialiser();
    fonction("Retour","menu()");
    saut(2);
    for (let n=0;n<Sites.length;n++) {
        fonction("<img src='Images/eye.svg' />","voir_site(" + n + "," + '"web()"' + ")");
        afficher(" ");
        lien(Sites[n].nom,Sites[n].url);
        saut(1);
    }
    actualiser();
}

function ajouter_site (nom,url,dossiers=[],description="") {
    let site = {
        nom : nom,
        url : url,
        description : description,
        dossiers : dossiers,
    }
    Sites.push(site);
}

function ajouter_dossier (nom) {
    let dossier = {
        nom : nom,
        liste : [],
    }
    Dossiers.push(dossier);
}

function trier_sites () {
    for (let n=0;n<Sites.length;n++) {
        let i = n;
        while (i > 0 && Sites[i].nom < Sites[i-1].nom) {
            let a = Sites[i];
            let b = Sites[i - 1];
            Sites[i] = b;
            Sites[i-1] = a;
            i--;
        }
    }
}

function trier_dossiers () {
    for (let n=0;n<Sites.length;n++) {
        for (let i=0;i<Sites[n].dossiers.length;i++) {
            Dossiers[Sites[n].dossiers[i]].liste.push(n);
        }
    }
}

function voir_site (n,retour) {
    initialiser();
    fonction("Retour",retour);
    saut(2);
    afficher(Sites[n].nom);
    saut(1);
    lien("<u>" + Sites[n].url + "</u>",Sites[n].url);
    saut(1);
    afficher(Sites[n].description);
    actualiser();
}

function voir_dossier (n,retour) {
    initialiser();
    fonction("Retour",retour);
    saut(2);
    afficher(Dossiers[n].nom);
    saut(2);
    for (let i=0;i<Dossiers[n].liste.length;i++) {
        fonction("<img src='Images/eye.svg' />","voir_site(" + Dossiers[n].liste[i] + "," + '"menu()"' + ")");
        afficher(" ");
        lien(Sites[Dossiers[n].liste[i]].nom,Sites[Dossiers[n].liste[i]].url);
        saut(1);
    }
    actualiser();
}