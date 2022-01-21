function demarrage () {
    Listes = [];
    Sites = [];
    ajouter_sites();
    trier_sites();
    menu();
}

function menu () {
    initialiser();
    afficher(Sites.length + " sites web référencés");
    saut(2);
    fonction("Web","web()");
    saut(1);
    fonction("Jeux","local()");
    actualiser();
}

function web () {
    initialiser();
    fonction("Retour","menu()");
    saut(2);
    for (let n=0;n<Sites.length;n++) {
        if (!Sites[n].islocal) {
            fonction("<b><></b>","voir_site(" + n + ")");
            afficher(" ");
            lien(Sites[n].nom,Sites[n].url);
            saut(1);
        }
    }
    actualiser();
}

function local () {
    initialiser();
    fonction("Retour","menu()");
    saut(2);
    for (let n=0;n<Sites.length;n++) {
        if (Sites[n].islocal) {
            lien(Sites[n].nom,Sites[n].url);
            saut(1);
        }
    }
    actualiser();
}

function ajouter_site (nom,url,islocal=false) {
    let site = {
        nom : nom,
        url : url,
        islocal : islocal,
    }
    Sites.push(site);
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

function voir_site (n) {
    initialiser();
    fonction("Retour","web()");
    saut(2);
    afficher(Sites[n].nom);
    saut(1);
    lien("<u>" + Sites[n].url + "</u>",Sites[n].url);
    actualiser();
}
