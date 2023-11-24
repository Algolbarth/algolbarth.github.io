function demarrage() {
    console.log("Z".charCodeAt(0));
    menu();
}

function menu() {
    initialiser();
    afficher("TP1 Cybersécurité");
    saut(2);
    afficher("<input type=text id=texte placeholder='Mettez votre message à crypter/décrypter ici' />");
    saut(2);
    afficher("César");
    saut();
    fonction("Crypter", "bouton_cesar_encrypte()", "cesar");
    afficher(" ");
    fonction("Décrypter", "bouton_cesar_decrypte()", "cesar");
    saut(2);
    afficher("Vigenère");
    saut();
    fonction("Crypter", "bouton_vigenere_encrypte()", "vigenere");
    afficher(" ");
    fonction("Décrypter", "bouton_vigenere_decrypte()", "vigenere");
    saut(2);
    afficher("Résultat");
    saut();
    div("resultat");
    div_fin();
    actualiser();
}

function bouton_cesar_encrypte() {
    let texte = document.getElementById("texte").value;
    let resultat = "";
    for (let n = 0; n < texte.length; n++) {
        resultat += cesar_encrypte(texte[n], 1);
    }
    div_actualiser("resultat", resultat);
}

function cesar_encrypte(c, k) {
    if (minuscule(c)) {
        code_ascii = c.charCodeAt(0) + k;
        while (code_ascii > 122) {
            code_ascii -= 26;
        }
    }
    else if (majuscule(c)) {
        code_ascii = c.charCodeAt(0) + k;
        while (code_ascii > 90) {
            code_ascii -= 26;
        }
    }
    else {
        return c;
    }
    return String.fromCodePoint(code_ascii);
}

function bouton_cesar_decrypte() {
    let texte = document.getElementById("texte").value;
    let resultat = "";
    for (let n = 0; n < texte.length; n++) {
        resultat += cesar_decrypte(texte[n], 1);
    }
    div_actualiser("resultat", resultat);
}

function cesar_decrypte(c, k) {
    if (minuscule(c)) {
        code_ascii = c.charCodeAt(0) - k;
        while (code_ascii < 97) {
            code_ascii += 26;
        }
    }
    else if (majuscule(c)) {
        code_ascii = c.charCodeAt(0) - k;
        while (code_ascii < 65) {
            code_ascii += 26;
        }
    }
    else {
        return c;
    }
    return String.fromCodePoint(code_ascii);
}

function bouton_vigenere_encrypte() {
    let texte = document.getElementById("texte").value;
    let resultat = "";
    let cle = "isen";
    cle = convertir_ascii_alphabet(cle);
    let j = 0;
    for (let n = 0; n < texte.length; n++) {
        resultat += vigenere_encrypte(texte[n], cle, j);
        if (majuscule(texte[n]) || minuscule(texte[n])) {
            j++;
        }
    }
    div_actualiser("resultat", resultat);
}

function bouton_vigenere_decrypte() {
    let texte = document.getElementById("texte").value;
    let resultat = "";
    let cle = "isen";
    cle = convertir_ascii_alphabet(cle);
    for (let i = 0; i < cle.length; i++) {
        cle[i] = (26 - cle[i]) % 26;
    }
    let j = 0;
    for (let n = 0; n < texte.length; n++) {
        resultat += vigenere_encrypte(texte[n], cle, j);
        if (majuscule(texte[n]) || minuscule(texte[n])) {
            j++;
        }
    }
    div_actualiser("resultat", resultat);
}

function vigenere_encrypte(c, k, j) {
    if (minuscule(c)) {
        code_ascii = ((c.charCodeAt() - 97) + k[j % k.length]) % 26 + 97;
    }
    else if (majuscule(c)) {
        code_ascii = ((c.charCodeAt() - 65) + k[j % k.length]) % 26 + 65;
    }
    else {
        return c;
    }
    return String.fromCodePoint(code_ascii);
}

function convertir_ascii_alphabet(ascii) {
    let alphabet = [];
    for (let i = 0; i < ascii.length; i++) {
        let code_ascii = ascii.charCodeAt(i);
        if (code_ascii >= 65 && code_ascii <= 90) {
            alphabet.push(code_ascii - 65);
        }
        else if (code_ascii >= 97 && code_ascii <= 122) {
            alphabet.push(code_ascii - 97);
        }
    }
    return alphabet;
}

function minuscule(c) {
    return c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122;
}

function majuscule(c) {
    return c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90;
}