function afficher_latitude () {
    navigator.geolocation.getCurrentPosition(function(position) {
        document.getElementById("lat").innerHTML = position.coords.latitude;
    });
}

function afficher_longitude () {
    navigator.geolocation.getCurrentPosition(function(position) {
        document.getElementById("long").innerHTML = position.coords.longitude;
    });
}

function reculer_historique () {
    window.history.go(-document.getElementById("nbpages").value);
}

function copier () {
    document.getElementById("textecopie").select();
    document.execCommand("copy");
}

function coller () {
    navigator.clipboard.readText().then(text => document.getElementById("textecolle").value = text);
}