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
    document.getElementById("supports").style.display = "none";
    document.getElementById(id).style.display = "block";
}


/** RECORDS._______________________________________________________________________________________________________________________________ */

var recordList = "";

function refreshRecords() {
    var div = document.getElementById('records')
    while (div.hasChildNodes()) {
        console.log("CLEANING");
        div.removeChild(div.lastChild);
    }

    return firebase.database().ref('/records').once('value').then(function (snapshot) {
        // FOR_EACH
        snapshot.forEach(function (data) {
            // REAL_CAPTURE
            document.getElementById("records").insertAdjacentHTML('beforeEnd', '<option id="' + data.val().id + '" value="' + data.val().name + '" onselect="setSelectedRecord('+data.val().id+');">');
            // END REAL_CAPTURE
        });
        // END FOR_EACH
    });
}

/* Establece en la ariable selectRecord, el componente completo que es seleccionado en el datalist. */
var selectedRecord = "";
function setSelectedRecord(div) {
    console.log(div);
    selectedRecord = div;
    console.log(selectedRecord);
}

/** Agrega los records seleccionados a la lista de records seleccionados. */
function AddSelectedRecord() {
    if (document.getElementById("record").value != "") {
        // Doy formato al JSon
        recordList += '"title"' + ': "' + document.getElementById("record").value + '", ';

        // Agrega el componente HTML a la lista
        document.getElementById("records-selected").insertAdjacentHTML('beforeEnd', '<li>' + document.getElementById("record").value + '</li>');

        // Elimino el componente seleccionado de los disponibles a seleccionar
        var div = document.getElementById('records');
        while (div.hasChildNodes()) {
            console.log("CLEANING");
            div.removeChild(document.getElementById(selectedRecord));
        }

        // Reseteo los campos
        document.getElementById("record").value = "";
        selectedRecord = "";
    }
}

/** COLLECTION._______________________________________________________________________________________________________________________________ */

function addCollection() {
    // GENERATE A UNIQUE ID BY DATE
    var fecha = new Date();
    var UID = "Y" + fecha.getFullYear() + "M" + (fecha.getMonth() + 1) + "D" + fecha.getDate() + "H" + fecha.getHours() + "Mi" + fecha.getMinutes() + "S" + fecha.getSeconds() + "m" + fecha.getMilliseconds() + "";
    json = "{" + recordList.substring(0, recordList.lastIndexOf(",")) + "}";
    console.log(json);
    var title = document.getElementById("title-collection").value;
    firebase.database().ref('collections/' + UID).set({
        title: title,
        recordList: JSON && JSON.parse(json) || $.parseJSON(json)
    });
    recordList = "";
    document.getElementById("title-collection").value = "";
    document.getElementById("record").value = "";
    var div = document.getElementById('records-selected');
    while (div.hasChildNodes()) {
        console.log("CLEANING");
        div.removeChild(div.lastChild);
    }
    refreshRecords();
}
/** SUPPORT._______________________________________________________________________________________________________________________________ */

