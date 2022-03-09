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
    afficher("<center><img src='Images/title.png' class='title' /></center>");
    saut();
    fonction("<img src='Images/file.svg' class='icone' /> Web","web()");
    saut();
    for (let n=0;n<Dossiers.length;n++) {
        fonction("<img src='Images/file.svg' class='icone' /> " + Dossiers[n].nom,"voir_dossier(" + n + "," + '"menu()"' + ")");
        saut();
    }
    actualiser();
}

function web () {
    initialiser();
    fonction("Retour","menu()");
    saut(2);
    for (let n=0;n<Sites.length;n++) {
        fonction("<img src='Images/eye.svg' class='icone' />","voir_site(" + n + "," + '"web()"' + ")");
        afficher(" ");
        lien("<img src='Images/page.svg' class='icone' /> " + Sites[n].nom,Sites[n].url);
        saut();
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
    saut();
    lien("<u>" + Sites[n].url + "</u>",Sites[n].url);
    saut();
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
        fonction("<img src='Images/eye.svg' class='icone' />","voir_site(" + Dossiers[n].liste[i] + "," + '"menu()"' + ")");
        afficher(" ");
        lien("<img src='Images/page.svg' class='icone' /> " + Sites[Dossiers[n].liste[i]].nom,Sites[Dossiers[n].liste[i]].url);
        saut();
    }
    actualiser();
}