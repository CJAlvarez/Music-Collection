// Initialize Firebase
var config = {
    apiKey: "AIzaSyDE5WY0Ifuah3CKFjnMbx-7nisMEuLcex0",
    authDomain: "musiccollection-0.firebaseapp.com",
    databaseURL: "https://musiccollection-0.firebaseio.com",
    projectId: "musiccollection-0",
    storageBucket: "musiccollection-0.appspot.com",
    messagingSenderId: "327055848394"
};
firebase.initializeApp(config);

function hideAll(id) {
    console.log(id);
    document.getElementById("collections").style.display = "none";
    document.getElementById(id).style.display = "block";
}


/* RECORDS._______________________________________________________________________________________________________________________________ */

// Variables
var recordList = "";
var track = 0;

/**
 * Refresca todas las grabaciones disponibles.
 */
function refreshRecords() {
    var div = document.getElementById('opciones');
    while (div.hasChildNodes()) {
        div.removeChild(div.lastChild);
    }

    return firebase.database().ref('/records').once('value').then(function (snapshot) {
        // FOR_EACH
        snapshot.forEach(function (data) {
            // REAL_CAPTURE
            var newHTML = '<li id="' + data.val().id + '"class="w3-display-container w3-hover-black">' + data.val().name + '<span onclick="add_SelectedRecord_Collection(this)" class="w3-button w3-transparent w3-display-right">&dArr;</span></li>';
            document.getElementById("opciones").insertAdjacentHTML('beforeEnd', newHTML);
            // END REAL_CAPTURE
        });
        // END FOR_EACH
    });

}

/**
 * Envía el objeto actual, lo oculta y lo agrega a la lista de Records Seleccionados para Collections.
 * @param {this} o 
 */
function add_SelectedRecord_Collection(o) {
    o.parentElement.style.display = 'none';
    var newNode = '"title"' + ': "' + o.parentElement.textContent.substring(0, o.parentElement.textContent.length - 1) + '", ';
    newNode += '"id"' + ': "' + o.parentElement.getAttribute("id") + '"';
    recordList += '"' + track + '": {' + newNode + "},";
    track += 1;
    var newHTML = '<li id="' + o.parentElement.getAttribute("id") + '"class="w3-display-container w3-hover-black">' + o.parentElement.textContent.substring(0, o.parentElement.textContent.length - 1) + '</li>';
    document.getElementById("seleccionados").insertAdjacentHTML('beforeEnd', newHTML);
}

/* COLLECTION._______________________________________________________________________________________________________________________________ */

/** Agrega la colección a la base de datos. */
function addCollection() {
    // GENERATE A UNIQUE ID BY DATE
    var fecha = new Date();
    var UID = "Y" + fecha.getFullYear() + "M" + (fecha.getMonth() + 1) + "D" + fecha.getDate() + "H" + fecha.getHours() + "Mi" + fecha.getMinutes() + "S" + fecha.getSeconds() + "m" + fecha.getMilliseconds() + "";
    json = "{" + recordList.substring(0, recordList.lastIndexOf(",")) + "}";
    alert(json);

    // TRANSACCION PRINCIPAL
    var title = document.getElementById("title-collection").value;
    firebase.database().ref('collections/' + UID).set({
        title: title,
        recordList: JSON && JSON.parse(json) || $.parseJSON(json)
    });

    // RESETEO DE VARIABLES Y CAMPOS
    recordList = "";
    track = 0;
    document.getElementById("title-collection").value = "";
    var div = document.getElementById('seleccionados');
    while (div.hasChildNodes()) {
        div.removeChild(div.lastChild);
    }
    refreshRecords();
}

/* INTERPRETES._______________________________________________________________________________________________________________________________ */


