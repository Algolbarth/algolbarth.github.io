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
    fonction("<img src='Images/file.svg' class='icone' /> Tout","liste_sites()");
    saut();
    for (let n=0;n<10;n++) {
        fonction("<img src='Images/file.svg' class='icone' /> " + Dossiers[n].nom,"voir_dossier(" + n + "," + '"menu()"' + ")");
        saut();
    }
    actualiser();
}

function liste_sites () {
    initialiser();
    fonction("Retour","menu()");
    saut(2);
    for (let n=0;n<Sites.length;n++) {
        fonction("<img src='Images/eye.svg' class='icone' />","voir_site(" + n + "," + '"web()"' + ")");
        afficher(" ");
        lien("<img src='Images/page.svg' class='icone' /> " + Sites[n].nom,Sites[n].url);
        saut();
    }
    div("site");
    div_fin();
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

function ajouter_dossier (nom,dossiers=[]) {
    let dossier = {
        nom : nom,
        sites : [],
        sous_dossiers : [],
        dossiers : dossiers,
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
            Dossiers[Sites[n].dossiers[i]].sites.push(n);
        }
    }
    for (let n=0;n<Dossiers.length;n++) {
        for (let i=0;i<Dossiers[n].dossiers.length;i++) {
            Dossiers[Dossiers[n].dossiers[i]].sous_dossiers.push(n);
        }
    }
}

function voir_site (n) {
    let texte = "";
    texte += Sites[n].nom + "<br/>";
    texte += "<a href='" + Sites[n].url + "'>" + Sites[n].url + "</a> <br/>";
    texte += Sites[n].description;
    div_actualiser("site",texte);
}

function voir_dossier (n,retour) {
    initialiser();
    fonction("Retour",retour);
    saut(2);
    afficher(Dossiers[n].nom);
    saut(2);
    for (let i=0;i<Dossiers[n].sous_dossiers.length;i++) {
        fonction("<img src='Images/file.svg' class='icone' /> " + Dossiers[Dossiers[n].sous_dossiers[i]].nom,"voir_dossier(" + Dossiers[n].sous_dossiers[i] + "," + '"menu()"' + ")");
        saut();
    }
    for (let i=0;i<Dossiers[n].sites.length;i++) {
        fonction("<img src='Images/eye.svg' class='icone' />","voir_site(" + Dossiers[n].sites[i] + "," + '"menu()"' + ")");
        afficher(" ");
        lien("<img src='Images/page.svg' class='icone' /> " + Sites[Dossiers[n].sites[i]].nom,Sites[Dossiers[n].sites[i]].url);
        saut();
    }
    div("site");
    div_fin();
    actualiser();
}