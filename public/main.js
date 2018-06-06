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
    document.getElementById("performers").style.display = "none";
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
    //
    var div = document.getElementById('availableRecord_Collection');
    while (div.hasChildNodes()) {
        div.removeChild(div.lastChild);
    }

    return firebase.database().ref('/records').once('value').then(function (snapshot) {
        // FOR_EACH
        snapshot.forEach(function (data) {
            // REAL_CAPTURE
            var newHTML = '<li id="' + data.val().id + '"class="w3-display-container w3-hover-black">' + data.val().name + '<span onclick="add_SelectedRecord_Collection(this)" class="w3-button w3-transparent w3-display-right">&dArr;</span></li>';
            document.getElementById("availableRecord_Collection").insertAdjacentHTML('beforeEnd', newHTML);
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
    document.getElementById("selectedRecord_Collection").insertAdjacentHTML('beforeEnd', newHTML);
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
    var div = document.getElementById('selectedRecord_Collection');
    while (div.hasChildNodes()) {
        div.removeChild(div.lastChild);
    }
    refreshRecords();
}

/* INTERPRETES._______________________________________________________________________________________________________________________________ */

var vocalist = false;
var role = -1;

function initPerformerPage() {
    document.getElementById('performerType').children[0].removeAttribute("class");
    document.getElementById('performerType').children[0].setAttribute("class", "w3-hover-blue cursor-pointer w3-blue");
    document.getElementById('performerType').children[1].removeAttribute("class");
    document.getElementById('performerType').children[1].setAttribute("class", "w3-hover-black cursor-pointer");
    document.getElementById('performerType').children[2].removeAttribute("class");
    document.getElementById('performerType').children[2].setAttribute("class", "w3-hover-orange cursor-pointer");

    document.getElementById('groupPerformer').style.display = "none";
    document.getElementById('lonePerformer').style.display = "block";
    document.getElementById('orchestraPerformer').style.display = "none";

    refresh_tablePerformers();
    role = -1;
    vocalist = false;
    typeMember_groupPerformer = 0;
    memberList_groupPerformer = "";
    counter_memberList_groupPerformer = 0;

    document.getElementById("nameMember_lonePerformer").value = "";
    document.getElementById("name_groupPerformer").value = "";
    document.getElementById("nameMember_groupPerformer").value = "";
    document.getElementById("ageMember_groupPerformer").value = 0;
    document.getElementById("name_orchestraPerformer").value = "";
    document.getElementById("origin_orchestraPerformer").value = "";
    document.getElementById("director_orchestraPerformer").value = "";
    // Reseteo de contenedor
    var div = document.getElementById('addedMember_groupPerformer');
    while (div.hasChildNodes()) {
        div.removeChild(div.lastChild);
    }
}

function refresh_tablePerformers() {
    // Vars
    var newRow = "";

    // Clean
    var div = document.getElementById('lone_tablePerformer');
    while (div.hasChildNodes()) {
        div.removeChild(div.lastChild);
    }
    div = document.getElementById('group_tablePerformer');
    while (div.hasChildNodes()) {
        div.removeChild(div.lastChild);
    }
    div = document.getElementById('orchestras_tablePerformer');
    while (div.hasChildNodes()) {
        div.removeChild(div.lastChild);
    }

    // Render
    return firebase.database().ref('/performers').once('value').then(function (snapshot) {
        // FOR_EACH
        snapshot.forEach(function (data) {
            // REAL_CAPTURE
            firebase.database().ref('/performers/' + data.key).once('value').then(function (intern) {

                newRow = "";
                // SINGLE 
                if (intern.val().type == "single") {
                    newRow = "<div class='w3-section w3-card'><h4 class='w3-wide w3-hover-dark-grey'>" + intern.val().name + "</h4><table class='w3-table w3-centered  w3-animate-opacity'>";
                    newRow += "<tr class='w3-light-gray w3-center'>";
                    if (intern.val().vocalist == true) {
                        newRow += "<th>Vocalista</th>";
                    }
                    if (intern.val().instrument == 0) { newRow += "<th>Guitarrista</th>"; }
                    else if (intern.val().instrument == 1) { newRow += "<th>Pianista</th>"; }
                    else if (intern.val().instrument == 2) { newRow += "<th>Baterista</th>"; }
                    else if (intern.val().instrument == 3) { newRow += "<th>Bajista</th>"; }
                    try {
                        newRow += "<th>Canciones</th>";
                    } catch (error) {

                    }
                    newRow += "</tr></table></div>";
                    document.getElementById("lone_tablePerformer").insertAdjacentHTML('beforeEnd', newRow);

                    // GROUP
                } else if (intern.val().type == "group") {
                    newRow = "<div class='w3-section w3-card'><h4 class='w3-wide w3-hover-dark-grey'>" + intern.val().name + "</h4><table id='in_group_tablePerformer'class='w3-table w3-centered w3-animate-opacity'>";
                    document.getElementById("group_tablePerformer").insertAdjacentHTML('beforeEnd', newRow);
                    firebase.database().ref('/performers/' + data.key + "/members").once('value').then(function (mems) {
                        mems.forEach(function (m) {
                            newRow = "<tr class=' w3-center'>";
                            newRow += "<th>" + m.val().name + "</th>";
                            newRow += "<th>" + m.val().age + " años</th>";
                            newRow += "<th>" + m.val().role + "</th>";
                            newRow += "</tr>";
                            document.getElementById("in_group_tablePerformer").insertAdjacentHTML('beforeEnd', newRow);
                        });
                    });
                    newRow = "</table></div>";
                    document.getElementById("group_tablePerformer").insertAdjacentHTML('beforeEnd', newRow);

                    // ORCHESTRA
                } else if (intern.val().type == "orchestra") {
                    newRow = "<div class='w3-section w3-card'><h4 class='w3-wide w3-hover-dark-grey'>" + intern.val().name + "</h4><table class='w3-table w3-centered w3-animate-opacity'>";
                    newRow += "<tr class=' w3-center'>";
                    newRow += "<th>" + intern.val().origin + "</th>";
                    newRow += "<th>" + intern.val().director + "</th>";
                    newRow += "</tr></table></div>";
                    document.getElementById("orchestras_tablePerformer").insertAdjacentHTML('beforeEnd', newRow);
                }
            });
            // END REAL_CAPTURE
        });
        // END FOR_EACH
    });

}

// Selecciona el tipo de interprete desde el menu: Tipo Interprete.
function selectType_Performer(o, k) {
    var div = document.getElementById('performerType');
    for (i = 0; i < 3; i++) {
        var temp = div.children[i].getAttribute("class");
        var color = "";
        var str = "asd";
        if (temp.includes(color = "blue")) { }
        else if (temp.includes(color = "black")) { }
        else if (temp.includes(color = "orange")) { }

        // BLUE        
        if (temp == o.getAttribute("class")) {
            div.children[i].removeAttribute("class");
            div.children[i].setAttribute("class", temp + " w3-" + color);

        } else {
            div.children[i].removeAttribute("class");
            div.children[i].setAttribute("class", temp.replace(" w3-" + color, ""));
        }
    }
    if (k == 0) {
        document.getElementById('groupPerformer').style.display = "none";
        document.getElementById('lonePerformer').style.display = "block";
        document.getElementById('orchestraPerformer').style.display = "none";
    }
    else if (k == 1) {
        document.getElementById('groupPerformer').style.display = "block";
        document.getElementById('lonePerformer').style.display = "none";
        document.getElementById('orchestraPerformer').style.display = "none";
    }
    else if (k == 2) {
        document.getElementById('groupPerformer').style.display = "none";
        document.getElementById('lonePerformer').style.display = "none";
        document.getElementById('orchestraPerformer').style.display = "block";
    }
}


function addPerformer(i) {
    // GENERATE A UNIQUE ID BY DATE
    var fecha = new Date();
    var UID = "Y" + fecha.getFullYear() + "M" + (fecha.getMonth() + 1) + "D" + fecha.getDate() + "H" + fecha.getHours() + "Mi" + fecha.getMinutes() + "S" + fecha.getSeconds() + "m" + fecha.getMilliseconds() + "";
    var json = "{ }";

    // SOLISTA
    if (i == 0) {
        var name = document.getElementById("nameMember_lonePerformer").value;
        if (name == "") {
            alert("Nombre en blanco.");
            return null;
        }
        // TRANSACCION PRINCIPAL
        firebase.database().ref('performers/' + UID).set({
            name: name,
            type: "single",
            vocalist: vocalist,
            instrument: role,
            songs: JSON && JSON.parse(json) || $.parseJSON(json)
        });
        document.getElementById("nameMember_lonePerformer").value = "";

        // GRUPO
    } else if (i == 1) {
        if (counter_memberList_groupPerformer == 0) {
            alert("No hay miembros.");
            return null;
        }
        var name = document.getElementById("name_groupPerformer").value;

        if (name == "") {
            alert("Nombre vacío.");
            return null;
        }
        var newMembers = "{" + memberList_groupPerformer.substring(0, memberList_groupPerformer.lastIndexOf(",")) + "}";

        // TRANSACCION PRINCIPAL
        firebase.database().ref('performers/' + UID).set({
            type: "group",
            name: name,
            members: JSON && JSON.parse(newMembers) || $.parseJSON(newMembers),
            songs: JSON && JSON.parse(json) || $.parseJSON(json)
        });

        // Reseteo de contenedor
        var div = document.getElementById('addedMember_groupPerformer');
        while (div.hasChildNodes()) {
            div.removeChild(div.lastChild);
        }
    } else {
        var name = document.getElementById("name_orchestraPerformer").value;
        if (name == "") {
            alert("Nombre vacío.");
            return null;
        }
        var origin = document.getElementById("origin_orchestraPerformer").value;
        if (origin == "") {
            alert("Orígen vacío.");
            return null;
        }
        var director = document.getElementById("director_orchestraPerformer").value;
        if (director == "") {
            alert("Director vacío.");
            return null;
        }

        // TRANSACCION PRINCIPAL
        firebase.database().ref('performers/' + UID).set({
            type: "orchestra",
            name: name,
            origin: origin,
            director: director,
            songs: JSON && JSON.parse(json) || $.parseJSON(json)
        });

    }


    // RESETEO DE VARIABLES Y CAMPOS
    initPerformerPage();
}

var typeMember_groupPerformer = 0;
var memberList_groupPerformer = "";
var counter_memberList_groupPerformer = 0;

function addMember_groupPerformer() {
    document.getElementById('add_typeMember_groupPerformer').style.display = 'none';
    if (document.getElementById("nameMember_groupPerformer").value == "") {
        alert("Nombre en blanco.");
        return null;
    }

    var temp = "";
    var color = "";
    if (typeMember_groupPerformer == 0) { temp = "Vocalista"; color = "pink"; }
    else if (typeMember_groupPerformer == 1) { temp = "Guitarrista"; color = "teal"; }
    else if (typeMember_groupPerformer == 2) { temp = "Pianista"; color = "green"; }
    else if (typeMember_groupPerformer == 3) { temp = "Baterista"; color = "brown"; }
    else { temp = "Bajista"; color = "purple"; }

    memberList_groupPerformer += '"' + counter_memberList_groupPerformer + '": {"name": "' + document.getElementById("nameMember_groupPerformer").value + '",' +
        '"role": "' + temp + '",'
        + '"age": ' + document.getElementById("ageMember_groupPerformer").value + '},';


    var newHTML = '<li class="w3-hover-' + color + '">' + document.getElementById("nameMember_groupPerformer").value + " - " + temp + '</li>';
    document.getElementById("addedMember_groupPerformer").insertAdjacentHTML('beforeEnd', newHTML);

    counter_memberList_groupPerformer += 1;
    document.getElementById("nameMember_groupPerformer").value = "";
    document.getElementById("ageMember_groupPerformer").value = 0;
}
