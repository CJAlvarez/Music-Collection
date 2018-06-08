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

// Script for side navigation
function w3_open() {
    var x = document.getElementById("mySidebar");
    x.style.width = "300px";
    x.style.paddingTop = "10%";
    x.style.display = "block";
}

// Close side navigation
function w3_close() {
    document.getElementById("mySidebar").style.display = "none";
}

// Used to toggle the menu on smaller screens when clicking on the menu button
function openNav() {
    var x = document.getElementById("navDemo");
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else { 
        x.className = x.className.replace(" w3-show", "");
    }
}

function hideAll(id) {
    console.log(id);
    document.getElementById("home").style.display = "none";
    document.getElementById("performers").style.display = "none";
    document.getElementById("producers").style.display = "none";
    document.getElementById("songs").style.display = "none";
    document.getElementById("texts").style.display = "none";
    document.getElementById("styles").style.display = "none";
    document.getElementById("supports").style.display = "none";
    document.getElementById(id).style.display = "block";
}

function removeDivs(id) {
    var div = document.getElementById(id);
    while (div.hasChildNodes()) {
        div.removeChild(div.lastChild);
    }
}

function addHtml(id, info) {
    document.getElementById(id).insertAdjacentHTML('beforeEnd', info);
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
    removeDivs('availableRecord_Collection');

    return firebase.database().ref('/records').once('value').then(function (snapshot) {
        // FOR_EACH
        snapshot.forEach(function (data) {
            // REAL_CAPTURE
            var newHTML = '<li id="' + data.val().id + '"class="w3-display-container w3-hover-black">' + data.val().name + '<span onclick="add_SelectedRecord_Collection(this)" class="w3-button w3-transparent w3-display-right">&dArr;</span></li>';
            addHtml('availableRecord_Collection', newHTML);
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
    addHtml('selectedRecord_Collection', newHTML);
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
    removeDivs('selectedRecord_Collection');
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
    removeDivs('addedMember_groupPerformer');
}

function refresh_tablePerformers() {
    // Vars
    var newRow = "";

    // Clean
    removeDivs('lone_tablePerformer');
    removeDivs('group_tablePerformer');
    removeDivs('orchestras_tablePerformer');

    // Render
    return firebase.database().ref('/performers').once('value').then(function (snapshot) {
        // FOR_EACH
        snapshot.forEach(function (data) {
            // REAL_CAPTURE
            firebase.database().ref('/performers/' + data.key).once('value').then(function (intern) {

                newRow = "";
                // SINGLE 
                if (intern.val().type == "single") {
                    newRow = "<div class='w3-section w3-card'><h4 class='w3-wide w3-hover-dark-grey'>" + intern.val().name + "</h4><table class='w3-table w3-centered   w3-animate-opacity'>";
                    newRow += "<tr class=' w3-center'>";
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
                    addHtml('lone_tablePerformer', newRow);

                    // GROUP
                } else if (intern.val().type == "group") {

                    firebase.database().ref('/performers/' + data.key + "/members").once('value').then(function (mems) {
                        newRow = "<div class='w3-section w3-card'><h4 class='w3-wide w3-hover-dark-grey'>" + intern.val().name + "</h4><table id='in_group_tablePerformer" + data.key + "' class='w3-table w3-centered w3-animate-opacity'>";
                        addHtml('group_tablePerformer', newRow);
                        mems.forEach(function (m) {
                            newRow = "<tr class=' w3-center'>";
                            newRow += "<th>" + m.val().name + "</th>";
                            newRow += "<th>" + m.val().age + " años</th>";
                            newRow += "<th>" + m.val().role + "</th>";
                            newRow += "</tr>";
                            addHtml('in_group_tablePerformer' + data.key, newRow);
                        });
                        newRow = "</table></div>";
                        addHtml('group_tablePerformer', newRow);
                    });

                    // ORCHESTRA
                } else if (intern.val().type == "orchestra") {
                    newRow = "<div class='w3-section w3-card'><h4 class='w3-wide w3-hover-dark-grey'>" + intern.val().name + "</h4><table class='w3-table w3-centered w3-animate-opacity'>";
                    newRow += "<tr class=' w3-center'>";
                    newRow += "<th>" + intern.val().origin + "</th>";
                    newRow += "<th>" + intern.val().director + "</th>";
                    newRow += "</tr></table></div>";
                    addHtml('orchestras_tablePerformer', newRow);
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

        console.log(newMembers);
        // TRANSACCION PRINCIPAL
        firebase.database().ref('performers/' + UID).set({
            type: "group",
            name: name,
            members: JSON && JSON.parse(newMembers) || $.parseJSON(newMembers),
            songs: JSON && JSON.parse(json) || $.parseJSON(json)
        });

        // Reseteo de contenedor
        removeDivs('addedMember_groupPerformer');
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
        + '"age": "' + document.getElementById("ageMember_groupPerformer").value + '"},';


    var newHTML = '<li class="w3-hover-' + color + '">' + document.getElementById("nameMember_groupPerformer").value + " - " + temp + '</li>';
    addHtml('addedMember_groupPerformer', newHTML);

    counter_memberList_groupPerformer += 1;
    document.getElementById("nameMember_groupPerformer").value = "";
    document.getElementById("ageMember_groupPerformer").value = 0;
}

/* PRODUCTORAS._______________________________________________________________________________________________________________________________ */

function initProducerPage() {
    removeDivs('table_producers');

    document.getElementById("nameProducer").value = "";
    document.getElementById("locationProducer").value = "";
    document.getElementById("ratingProducer").value = "";
    refreshProducers();
}
function refreshProducers() {

    // Render
    return firebase.database().ref('/producers').once('value').then(function (snapshot) {
        // FOR_EACH
        snapshot.forEach(function (data) {
            var newRow = "<div class='w3-section w3-card'><h4 class='w3-wide w3-hover-dark-grey'>" + data.val().name + "</h4><table class='w3-table w3-centered  w3-animate-opacity'>";
            newRow += "<tr class='w3-light-gray w3-center'>";
            newRow += "<th>Localidad: " + data.val().location + "</th>";
            newRow += "<th>Rating: " + data.val().rating + "</th>";
            newRow += "</tr></table></div>";
            addHtml('table_producers', newRow);
        });
    });
}
function addProducer() {
    if (document.getElementById("nameProducer").value == "") {
        alert("Nombre en blanco.");
        return null;
    }
    // GENERATE A UNIQUE ID BY DATE
    var fecha = new Date();
    var UID = "Y" + fecha.getFullYear() + "M" + (fecha.getMonth() + 1) + "D" + fecha.getDate() + "H" + fecha.getHours() + "Mi" + fecha.getMinutes() + "S" + fecha.getSeconds() + "m" + fecha.getMilliseconds() + "";

    // TRANSACCION PRINCIPAL
    firebase.database().ref('producers/' + UID).set({
        name: document.getElementById("nameProducer").value,
        location: document.getElementById("locationProducer").value,
        rating: document.getElementById("ratingProducer").value
    });
    initProducerPage();
}

/* CANCIONES._______________________________________________________________________________________________________________________________ */
var songStyleBase = "";
var authorType = 0;
var authorLyrics_counter = 0;
var authorLyrics_List = "";
var authorMusic_counter = 0;
var authorMusic_List = "";
var songPerformer_List = "";
var songPerformer_counter = 0;
var songSupport_List = "";
var songSupport_counter = 0;
var songStyle_List = "";
var songStyle_counter = 0;

function initSongPage() {
    songStyleBase = "";
    authorType = 0;
    authorLyrics_counter = 0;
    authorLyrics_List = "";
    authorMusic_counter = 0;
    authorMusic_List = "";
    songPerformer_List = "";
    songPerformer_counter = 0;
    songSupport_List = "";
    songSupport_counter = 0;
    songStyle_List = "";
    songStyle_counter = 0;
    document.getElementById("nameAuthor").value = "";
    document.getElementById("nameSong").value = "";

    removeDivs('added_authorLyrics');
    removeDivs('songSupports_Selected');
    removeDivs('songPerformers_Selected');
    removeDivs('styleExtra_Selected');

    refreshSongSupports();
    refreshSongPerformers();
    refreshSongs();
    refreshSongStyles();
}

function addSong() {
    if (authorLyrics_counter == 0) {
        var temp = "Autor de Letra";
        var color = "blue";
        authorLyrics_List += '"' + authorLyrics_counter + '": {"name": "Desconocido"},';
        authorLyrics_counter += 1;
    }
    if (authorMusic_counter == 0) {
        var temp = "Autor de Música";
        var color = "orange";
        authorMusic_List += '"' + authorMusic_counter + '": {"name": "Desconocido"},';
        authorMusic_counter += 1;
    }
    if (songStyle_counter == 0) {
        var newNode = '"id": "0"';
        songStyle_List += '"' + songStyle_counter + '": {' + newNode + "},";
        songStyle_counter += 1;
    }

    if (songPerformer_counter == 0) {
        alert("Es requerido un interprete.");
        return null;
    }
    // if (songSupport_counter == 0) {
    //     alert("Nombre en blanco.");
    //     return null;
    // }


    // GENERATE A UNIQUE ID BY DATE
    var fecha = new Date();
    var UID = "Y" + fecha.getFullYear() + "M" + (fecha.getMonth() + 1) + "D" + fecha.getDate() + "H" + fecha.getHours() + "Mi" + fecha.getMinutes() + "S" + fecha.getSeconds() + "m" + fecha.getMilliseconds() + "";

    var json0 = "{" + songPerformer_List.substring(0, songPerformer_List.lastIndexOf(",")) + "}";
    var json1 = "{" + songSupport_List.substring(0, songSupport_List.lastIndexOf(",")) + "}";
    var json2 = "{" + authorLyrics_List.substring(0, authorLyrics_List.lastIndexOf(",")) + "}";
    var json3 = "{" + authorMusic_List.substring(0, authorMusic_List.lastIndexOf(",")) + "}";
    var json4 = "{" + songStyle_List.substring(0, songStyle_List.lastIndexOf(",")) + "}";

    // TRANSACCION PRINCIPAL
    var name = document.getElementById("nameSong").value;
    for (i = 0; i < document.getElementById("styleBase").childElementCount; i++) {
        if (document.getElementById("styleBase").children[i].value == document.getElementById("styleBase").value) {
            songStyleBase = document.getElementById("styleBase").children[i].getAttribute("id");
            break;
        }
    }

    var jsonPerformers = JSON && JSON.parse(json0) || $.parseJSON(json0);
    firebase.database().ref('songs/' + UID).set({
        name: name,
        performers: jsonPerformers,
        styleBase: songStyleBase,
        supports: JSON && JSON.parse(json1) || $.parseJSON(json1),
        authorLyrics: JSON && JSON.parse(json2) || $.parseJSON(json2),
        authorMusic: JSON && JSON.parse(json3) || $.parseJSON(json3),
        styles: JSON && JSON.parse(json4) || $.parseJSON(json4)
    });

    for (i = 0; i < Object.keys(jsonPerformers).length; i++) {
        jsonSong = '{"' + UID + '": {"name":"' + name + '"}}';
        firebase.database().ref('performers/' + jsonPerformers[i].id + "/songs").update(JSON && JSON.parse(jsonSong) || $.parseJSON(jsonSong), );

    }

    // RESETEO DE VARIABLES Y CAMPOS
    initSongPage();
}

function refreshSongs() {
    removeDivs('table_songs');

    return firebase.database().ref('/songs').once('value').then(function (snapshot) {
        // FOR_EACH
        snapshot.forEach(function (data) {
            var newRow = "<div class='w3-section w3-card'><h4 class='w3-wide w3-dark-grey w3-hover-grey'>" + data.val().name + "</h4>";
            // Autores Letras
            newRow += "<h4 class='w3-wide w3-hover-dark-grey'>Autores Letras</h4><table class='w3-table w3-centered  w3-animate-opacity'>";
            newRow += "<tr class='w3-light-gray w3-center'>";
            for (i = 0; i < Object.keys(data.val().authorLyrics).length; i++) {
                newRow += "<th>" + data.val().authorLyrics[i].name + "</th>";
            }
            newRow += "</tr></table>";
            // Autores Musica
            newRow += "<h4 class='w3-wide w3-hover-dark-grey'>Autores Música</h4><table class='w3-table w3-centered  w3-animate-opacity'>";
            newRow += "<tr class='w3-light-gray w3-center'>";
            for (i = 0; i < Object.keys(data.val().authorMusic).length; i++) {
                newRow += "<th>" + data.val().authorMusic[i].name + "</th>";
            }
            newRow += "</tr></table>";
            // Estilo Base
            newRow += "<h4 class='w3-wide w3-hover-dark-grey'>Estilo Base</h4><table class='w3-table w3-centered  w3-animate-opacity'>";
            newRow += "<tr id='songStyleBase" + data.key + "' class='w3-light-gray w3-center'>";
            firebase.database().ref('/styles/' + data.val().styleBase).once('value').then(function (m) {
                console.log(m.val().nameStyle);
                var newRow1 = "<th>" + m.val().nameStyle + "</th>";
                addHtml("songStyleBase" + data.key, newRow1);
            });
            newRow += "</tr></table>";
            // Estilos influyentes
            newRow += "<h4 class='w3-wide w3-hover-dark-grey'>Estilos Influyentes</h4><table class='w3-table w3-centered  w3-animate-opacity'>";
            newRow += "<tr id='songStyles_list" + data.key + "' class='w3-light-gray w3-center'>";
            for (i = 0; i < Object.keys(data.val().styles).length; i++) {
                firebase.database().ref('/styles/' + data.val().styles[i].id).once('value').then(function (m) {
                    console.log(m.val().nameStyle);
                    var newRow1 = "<th>" + m.val().nameStyle + "</th>";
                    addHtml("songStyles_list" + data.key, newRow1);
                });
            }
            newRow += "</tr></table>";
            // Interpretes
            newRow += "<h4 class='w3-wide w3-hover-dark-grey'>Interpretes</h4><table class='w3-table w3-centered  w3-animate-opacity'>";
            newRow += "<tr id='songPerformers_list" + data.key + "' class='w3-light-gray w3-center'>";
            for (i = 0; i < Object.keys(data.val().performers).length; i++) {
                firebase.database().ref('/performers/' + data.val().performers[i].id).once('value').then(function (m) {
                    console.log(m.val().name);
                    var newRow1 = "<th>" + m.val().name + "</th>";
                    addHtml("songPerformers_list" + data.key, newRow1);
                });
            }
            newRow += "</tr></table>";
            // Soporte
            newRow += "<h4 class='w3-wide w3-hover-dark-grey'>Soportes</h4><table class='w3-table w3-centered  w3-animate-opacity'>";
            newRow += "<tr id='songSupports_list" + data.key + "' class='w3-light-gray w3-center'>";
            for (i = 0; i < Object.keys(data.val().supports).length; i++) {
                firebase.database().ref('/supports/' + data.val().supports[i].id).once('value').then(function (m) {
                    console.log(m.val().name);
                    var newRow1 = "<th>" + m.val().name + "</th>";
                    addHtml("songSupports_list" + data.key, newRow1);
                });
            }
            newRow += "</tr></table>";
            // Partituras
            newRow += "<h4 class='w3-wide w3-hover-dark-grey'>Partituras</h4><table class='w3-table w3-centered  w3-animate-opacity'>";
            newRow += "<tr id='songPartituras_list' class='w3-light-gray w3-center'>";
            // for (i = 0; i < Object.keys(data.val().performers).length; i++) {
            //     firebase.database().ref('/performers/' + data.val().performers[i].id).once('value').then(function (m) {
            //         console.log(m.val().name);
            //         var newRow1 = "<th>" + m.val().name + "</th>";

            //         document.getElementById("songPerformers_list").insertAdjacentHTML('beforeEnd', newRow1);
            //     });
            // }
            newRow += "</tr></table>";
            // Letras
            newRow += "<h4 class='w3-wide w3-hover-dark-grey'>Letras</h4><table class='w3-table w3-centered  w3-animate-opacity'>";
            newRow += "<tr id='songLetras_list' class='w3-light-gray w3-center'>";
            // for (i = 0; i < Object.keys(data.val().performers).length; i++) {
            //     firebase.database().ref('/performers/' + data.val().performers[i].id).once('value').then(function (m) {
            //         console.log(m.val().name);
            //         var newRow1 = "<th>" + m.val().name + "</th>";

            //         document.getElementById("songPerformers_list").insertAdjacentHTML('beforeEnd', newRow1);
            //     });
            // }
            newRow += "</tr></table>";
            newRow += "</div>";
            addHtml('table_songs', newRow);
        });
    });
}


function addAuthor() {
    if (document.getElementById("nameAuthor").value == "") {
        alert("Nombre en blanco.");
        return null;
    }
    document.getElementById('add_author').style.display = 'none';

    var temp = "";
    var color = "blue";
    if (authorType == 0) {
        temp = "Autor de Letra";
        color = "blue";
        authorLyrics_List += '"' + authorLyrics_counter + '": {"name": "' + document.getElementById("nameAuthor").value + '"},';
        authorLyrics_counter += 1;
    } else {
        temp = "Autor de Música";
        color = "orange";
        authorMusic_List += '"' + authorMusic_counter + '": {"name": "' + document.getElementById("nameAuthor").value + '"},';
        authorMusic_counter += 1;
    }
    var newHTML = '<li class="w3-hover-' + color + '">' + document.getElementById("nameAuthor").value + " - " + temp + '</li>';
    addHtml('added_authorLyrics', newHTML);
    document.getElementById("nameAuthor").value = "";
}

function refreshSongStyles() {
    removeDivs('styleExtra_available');
    removeDivs('styleBase');

    return firebase.database().ref('/styles').once('value').then(function (snapshot) {
        // FOR_EACH
        var flag = false;
        snapshot.forEach(function (data) {
            // REAL_CAPTURE
            if (data.key != "0") {
                var newHTML = '<li id="' + data.key + '"class="w3-display-container w3-hover-black">' + data.val().nameStyle + '<span onclick=" add_Selected_SongStyles(this)" class="w3-button w3-transparent w3-display-right">&dArr;</span></li>';
                addHtml('styleExtra_available', newHTML);
            }
            if (flag == false) {
                songStyleBase = data.key;
                flag = true;
            }
            var newHTML = '<option id="' + data.key + '"class="w3-display-container w3-hover-black">' + data.val().nameStyle + '</option>';
            addHtml('styleBase', newHTML);
            // END REAL_CAPTURE
        });
        // END FOR_EACH
    });
}

function add_Selected_SongStyles(o) {
    o.parentElement.style.display = 'none';
    var newNode = '"id"' + ': "' + o.parentElement.getAttribute("id") + '"';
    songStyle_List += '"' + songStyle_counter + '": {' + newNode + "},";
    songStyle_counter += 1;
    var newHTML = '<li id="' + o.parentElement.getAttribute("id") + '"class="w3-display-container w3-hover-black">' + o.parentElement.textContent.substring(0, o.parentElement.textContent.length - 1) + '</li>';
    addHtml('styleExtra_Selected', newHTML);
}

function refreshSongPerformers() {
    removeDivs('songPerformers_available');


    return firebase.database().ref('/performers').once('value').then(function (snapshot) {
        // FOR_EACH
        snapshot.forEach(function (data) {
            var type = "";
            if (data.val().type == "single") {
                type = "Solista";
            } else if (data.val().type == "group") {
                type = "Grupo";
            } else if (data.val().type == "orchestra") {
                type = "Orquesta";
            }
            // REAL_CAPTURE
            var newHTML = '<li id="' + data.key + '"class="w3-display-container w3-hover-black">' + data.val().name + " - " + type + '<span onclick="add_SelectedSongPerformer(this)" class="w3-button w3-transparent w3-display-right">&dArr;</span></li>';
            addHtml('songPerformers_available', newHTML);
            // END REAL_CAPTURE
        });
        // END FOR_EACH
    });
}

function add_SelectedSongPerformer(o) {
    o.parentElement.style.display = 'none';
    var newNode = '"id"' + ': "' + o.parentElement.getAttribute("id") + '"';
    songPerformer_List += '"' + songPerformer_counter + '": {' + newNode + "},";
    songPerformer_counter += 1;
    var newHTML = '<li id="' + o.parentElement.getAttribute("id") + '"class="w3-display-container w3-hover-black">' + o.parentElement.textContent.substring(0, o.parentElement.textContent.length - 1) + '</li>';
    addHtml('songPerformers_Selected', newHTML);
}

function refreshSongSupports() {
    removeDivs('songSupports_available');
    return firebase.database().ref('/supports').once('value').then(function (snapshot) {
        // FOR_EACH
        snapshot.forEach(function (data) {
            // REAL_CAPTURE
            var newHTML = '<li id="' + data.key + '"class="w3-display-container w3-hover-black">' + data.val().name + " - " + data.val().location + '<span onclick="add_SelectedSong_Support(this)" class="w3-button w3-transparent w3-display-right">&dArr;</span></li>';
            addHtml('songSupports_available', newHTML);
            // END REAL_CAPTURE
        });
        // END FOR_EACH
    });

}

function add_SelectedSong_Support(o) {
    o.parentElement.style.display = 'none';
    songSupport_List += '"' + songSupport_counter + '":{"id" :"' + o.parentElement.getAttribute("id") + '"},';
    songSupport_counter += 1;
    var newHTML = '<li id="' + o.parentElement.getAttribute("id") + '"class="w3-display-container w3-hover-black">' + o.parentElement.textContent.substring(0, o.parentElement.textContent.length - 1) + '</li>';
    addHtml('songSupports_Selected', newHTML);
}


/* ESTILOS._______________________________________________________________________________________________________________________________ */

var influences_List = "";
var influencesTo_List = "";
var influences_counter = 0;
var influencesTo_counter = 0;

function initStylePage() {
    influences_List = "";
    influencesTo_List = "";
    influences_counter = 0;
    influencesTo_counter = 0;
    var div = document.getElementById('table_styles');
    while (div.hasChildNodes()) {
        div.removeChild(div.lastChild);
    }
    var div = document.getElementById('added_Styles');
    while (div.hasChildNodes()) {
        div.removeChild(div.lastChild);
    }

    document.getElementById("nameStyle").value = "";
    document.getElementById("baseStyle").value = "";
    document.getElementById("originStyle").value = "";
    document.getElementById("fatherStyle").value = "";

    refreshStyles();
}
function refreshStyles() {
    console.log('refresca Estilos');
    // Render
    return firebase.database().ref('/styles').once('value').then(function (snapshot) {
        // FOR_EACH
        snapshot.forEach(function (data) {
            if (data.key != "0") {
                var newRow = "<div class='w3-section w3-card'><h4 class='w3-wide w3-hover-dark-grey'>" + data.val().nameStyle + "</h4><table class='w3-table w3-centered  w3-animate-opacity'>";
                newRow += "<tr class='w3-light-gray w3-center'>";
                newRow += "<th>" + data.val().father + "</th>";
                newRow += "<th>" + data.val().origin + "</th>";

                newRow += "</tr></table></div>";
                document.getElementById("table_styles").insertAdjacentHTML('beforeEnd', newRow);
            }
        });
    });
}
function addStyles() {


    if (document.getElementById("nameStyle").value == "") {
        alert("Nombre en blanco.");
        return null;
    }
    // GENERATE A UNIQUE ID BY DATE
    var fecha = new Date();
    var UID = "Y" + fecha.getFullYear() + "M" + (fecha.getMonth() + 1) + "D" + fecha.getDate() + "H" + fecha.getHours() + "Mi" + fecha.getMinutes() + "S" + fecha.getSeconds() + "m" + fecha.getMilliseconds() + "";

    var json2 = "{" + influences_List.substring(0, influences_List.lastIndexOf(",")) + "}";
    var json1 = "{" + influencesTo_List.substring(0, influencesTo_List.lastIndexOf(",")) + "}";

    // TRANSACCION PRINCIPAL
    firebase.database().ref('styles/' + UID).set({
        nameStyle: document.getElementById("nameStyle").value,
        origin: document.getElementById("originStyle").value,
        baseStyle: document.getElementById("baseStyle").value,
        father: document.getElementById("fatherStyle").value,
        influences: JSON && JSON.parse(json2) || $.parseJSON(json2),
        influencesTo: JSON && JSON.parse(json1) || $.parseJSON(json1)
    });
    initStylePage();
}

function add_influences() {
    if (document.getElementById("name_Style").value == "") {
        alert("Nombre en blanco.");
        return null;
    }
    document.getElementById('add_style').style.display = 'none';

    var temp = "";
    var color = "blue";
    if (styleType == 0) {
        temp = "Influencias";
        color = "blue";
        influences_List += '"' + influences_counter + '": {"name": "' + document.getElementById("name_Style").value + '"},';
        influences_counter += 1;
    } else {
        temp = "Influye";
        color = "orange";
        influencesTo_List += '"' + influencesTo_counter + '": {"name": "' + document.getElementById("name_Style").value + '"},';
        influencesTo_counter += 1;
    }
    var newHTML = '<li class="w3-hover-' + color + '">' + document.getElementById("name_Style").value + " - " + temp + '</li>';
    document.getElementById("added_Styles").insertAdjacentHTML('beforeEnd', newHTML);
    document.getElementById("name_Style").value = "";

}


/* SOPORTES._______________________________________________________________________________________________________________________________ */

var locationSupport = "";
var recordSupport = "";
var producersSupport = "";

function initSupportPage() {
    producersSupport = "";
    refreshSupports();
    refreshProducers_Support();
    removeDivs('producers_Selected');
    document.getElementById('producer-available').style.display = 'block';
    document.getElementById("nameSupport").value = "";
}


function refreshSupports() {
    removeDivs('table_supports');
    // Render
    return firebase.database().ref('/supports').once('value').then(function (snapshot) {
        // FOR_EACH
        snapshot.forEach(function (data) {
            var newRow = "<div class='w3-section w3-card'><h4 class='w3-wide w3-hover-dark-grey'>" + data.val().name + "</h4><table class='w3-table w3-centered  w3-animate-opacity'>";
            newRow += "<tr id='supportsData" + data.key + "' class='w3-light-gray w3-center'>";
            newRow += "<th>Ubicación: " + data.val().location + "</th>";
            newRow += "<th>Grabación: " + data.val().record + "</th>";
            if (data.val().record == "Comercial") {
                firebase.database().ref('/producers/' + data.val().producer).once('value').then(function (m) {
                    var newRow1 = "<th>Productora: " + m.val().name + "</th>";
                    addHtml("supportsData" + data.key, newRow1);
                });
            }
            newRow += "</tr></table></div>";
            addHtml('table_supports', newRow);
        });
    });
}

function refreshProducers_Support() {
    removeDivs('producers_Available');
    return firebase.database().ref('/producers').once('value').then(function (snapshot) {
        // FOR_EACH
        snapshot.forEach(function (data) {
            // REAL_CAPTURE
            var newHTML = '<li id="' + data.key + '"class="w3-display-container w3-hover-black">' + data.val().name + '<span onclick="add_SelectedProducer(this)" class="w3-button w3-transparent w3-display-right">&dArr;</span></li>';
            addHtml('producers_Available', newHTML);
            // END REAL_CAPTURE
        });
        // END FOR_EACH
    });
}

function add_SelectedProducer(o) {
    document.getElementById('producer-available').style.display = 'none';
    o.parentElement.style.display = 'none';
    producersSupport = o.parentElement.getAttribute("id");
    var newHTML = '<li id="' + o.parentElement.getAttribute("id") + '"class="w3-display-container w3-hover-black">' + o.parentElement.textContent.substring(0, o.parentElement.textContent.length - 1) + '</li>';
    addHtml('producers_Selected', newHTML);
}

function addSupport() {
    if (document.getElementById("nameSupport").value == "") {
        alert("Nombre en blanco.");
        return null;
    }
    if (locationSupport == "") {
        alert("La ubicación es requerida.");
        return null;
    }
    if (recordSupport == "") {
        alert("El tipo de grabación es requerido.");
        return null;
    }
    if (recordSupport == "Comercial" && producersSupport == "") {
        alert("La productora es requerida.");
        return null;
    }
    // GENERATE A UNIQUE ID BY DATE
    var fecha = new Date();
    var UID = "Y" + fecha.getFullYear() + "M" + (fecha.getMonth() + 1) + "D" + fecha.getDate() + "H" + fecha.getHours() + "Mi" + fecha.getMinutes() + "S" + fecha.getSeconds() + "m" + fecha.getMilliseconds() + "";
    json = "{ }";

    // TRANSACCION PRINCIPAL
    var name = document.getElementById("nameSupport").value;
    if (recordSupport == "Propia") {
        firebase.database().ref('supports/' + UID).set({
            name: name,
            location: locationSupport,
            record: recordSupport,
            songs: JSON && JSON.parse(json) || $.parseJSON(json)
        });
    } else {
        firebase.database().ref('supports/' + UID).set({
            name: name,
            producer: producersSupport,
            location: locationSupport,
            record: recordSupport,
            songs: JSON && JSON.parse(json) || $.parseJSON(json)
        });
    }
    initSupportPage();
}


/* TEXTOS._______________________________________________________________________________________________________________________________ */

var songLyric_List = "";
var songLyric_counter = 0;
var songText_List = "";
var songText_counter = 0;
var typeTextjs = "";
var elementTextjs = "";
var typeLyricjs = "";
function initTextPage() {
    songLyric_List = "";
    songLyric_counter = 0;
    songText_List = "";
    songText_counter = 0;
    document.getElementById("priceText").value = "";
    refreshTexts();
    refreshSongTexts();
    removeDivs('songTexts_available');
    removeDivs('songTexts_Selected');
    removeDivs('OriginalSong_Available');
    document.getElementById('origialSong-available').style.display = 'block';
    removeDivs('OriginalSong_Selected');
    document.getElementById("priceText").value = "";
    document.getElementById("originText").value = "";
}

function refreshTexts() {
    // Render
    return firebase.database().ref('/texts').once('value').then(function (snapshot) {
        // FOR_EACH
        snapshot.forEach(function (data) {
            var newRow = "<div class='w3-section w3-card'><h4 class='w3-wide w3-hover-dark-grey'>" + data.val().element + "</h4><table class='w3-table w3-centered  w3-animate-opacity'>";
            newRow += "<tr id='textData" + data.key + "' class='w3-light-gray w3-center w3-centered '>";
            newRow += "<th>Tipo: " + data.val().type + "</th>";
            if (data.val().element == "Partitura") {
                if (data.val().type == "Propia") {
                    newRow += "<th>Origen: " + data.val().origin + "</th>";
                    newRow += "<th>Precio: " + data.val().price + "</th>";
                }
            } else {
                firebase.database().ref('/songs/' + data.val().originalSong).once('value').then(function (m) {
                    var newRow1 = "<th>Canción Original: " + m.val().name + "</th>";
                    addHtml("textData" + data.key, newRow1);
                });
            }
            newRow += "</tr><tr id='songsRow" + data.key + "' class='w3-center w3-centered '><th>Otras Canciones</th></tr></table></div>";
            addHtml('tabla_texts', newRow);
            try {
                for (i = 0; i < Object.keys(data.val().songs).length; i++) {
                    firebase.database().ref('/songs/' + data.val().songs[i].id).once('value').then(function (m) {
                        var newRow1 = "<th>" + m.val().name + "</th>";
                        document.getElementById('songsRow' + data.key).insertAdjacentHTML('afterEnd', newRow1);
                    });
                }
            } catch (error) {
                var newRow1 = "<th>Ninguna</th>";
                document.getElementById('songsRow' + data.key).insertAdjacentHTML('afterEnd', newRow1);
            }
        });
    });
}

function refreshSongTexts() {
    removeDivs('songTexts_available');
    removeDivs('OriginalSong_Available');
    return firebase.database().ref('/songs').once('value').then(function (snapshot) {
        // FOR_EACH
        snapshot.forEach(function (data) {
            // REAL_CAPTURE
            var newHTML = '<li id="' + data.key + '"class="w3-display-container w3-hover-black">' + data.val().name + '<span onclick="add_SelectedSong_Text(this)" class="w3-button w3-transparent w3-display-right">&dArr;</span></li>';
            addHtml('songTexts_available', newHTML);
            var newHTML = '<li id="' + data.key + '"class="w3-display-container w3-hover-black">' + data.val().name + '<span onclick="add_SelectedSong_Lyric(this)" class="w3-button w3-transparent w3-display-right">&dArr;</span></li>';
            addHtml('OriginalSong_Available', newHTML);
            // END REAL_CAPTURE
        });
        // END FOR_EACH
    });

}

function add_SelectedSong_Text(o) {
    o.parentElement.style.display = 'none';
    songText_List += '"' + songText_counter + '":{"id" :"' + o.parentElement.getAttribute("id") + '"},';
    songText_counter += 1;
    var newHTML = '<li id="' + o.parentElement.getAttribute("id") + '"class="w3-display-container w3-hover-black">' + o.parentElement.textContent.substring(0, o.parentElement.textContent.length - 1) + '</li>';
    addHtml('songTexts_Selected', newHTML);
}

function add_SelectedSong_Lyric(o) {
    document.getElementById('origialSong-available').style.display = 'none';
    songLyric_List += o.parentElement.getAttribute("id");
    songLyric_counter += 1;
    var newHTML = '<li id="' + o.parentElement.getAttribute("id") + '"class="w3-display-container w3-hover-black">' + o.parentElement.textContent.substring(0, o.parentElement.textContent.length - 1) + '</li>';
    addHtml('OriginalSong_Selected', newHTML);
}

function addMusicSheet() {
    if (elementTextjs == "") {
        alert("Debe seleccionar un Tipo de texto.");
        return null;
    } else if (elementTextjs == "Partitura") {
        if (songText_counter == 0) {
            alert("Debe seleccionar una canción.");
            return null;
        }

        if (typeTextjs == "Propia") {
            if (document.getElementById("priceText").value == "") {
                alert("Precio en blanco.");
                return null;
            }
            if (document.getElementById("originText").value == "") {
                alert("Origen en blanco.");
                return null;
            }
            // GENERATE A UNIQUE ID BY DATE
            var fecha = new Date();
            var UID = "Y" + fecha.getFullYear() + "M" + (fecha.getMonth() + 1) + "D" + fecha.getDate() + "H" + fecha.getHours() + "Mi" + fecha.getMinutes() + "S" + fecha.getSeconds() + "m" + fecha.getMilliseconds() + "";

            var json1 = "{" + songText_List.substring(0, songText_List.lastIndexOf(",")) + "}";

            // TRANSACCION PRINCIPAL
            firebase.database().ref('texts/' + UID).set({
                element: elementTextjs,
                type: typeTextjs,
                origin: document.getElementById("priceText").value,
                price: document.getElementById("originText").value,
                songs: JSON && JSON.parse(json1) || $.parseJSON(json1)
            });
            addText_SongList(json1, UID);

        } else if (typeTextjs == "Comercial") {
            // GENERATE A UNIQUE ID BY DATE
            var fecha = new Date();
            var UID = "Y" + fecha.getFullYear() + "M" + (fecha.getMonth() + 1) + "D" + fecha.getDate() + "H" + fecha.getHours() + "Mi" + fecha.getMinutes() + "S" + fecha.getSeconds() + "m" + fecha.getMilliseconds() + "";

            var json1 = "{" + songText_List.substring(0, songText_List.lastIndexOf(",")) + "}";

            // TRANSACCION PRINCIPAL
            firebase.database().ref('texts/' + UID).set({
                element: elementTextjs,
                type: typeTextjs,
                songs: JSON && JSON.parse(json1) || $.parseJSON(json1)
            });
            addText_SongList(json1, UID);

        } else {
            alert("Seleccione un tipo de Partitura");
            return null;
        }
    } else if (elementTextjs == "Letra") {
        if (songLyric_counter == 0) {
            alert("Debe seleccionar una canción Original.");
            return null;
        }

        if (typeLyricjs == "Propia") {

            // GENERATE A UNIQUE ID BY DATE
            var fecha = new Date();
            var UID = "Y" + fecha.getFullYear() + "M" + (fecha.getMonth() + 1) + "D" + fecha.getDate() + "H" + fecha.getHours() + "Mi" + fecha.getMinutes() + "S" + fecha.getSeconds() + "m" + fecha.getMilliseconds() + "";

            var json1 = "{" + songText_List.substring(0, songText_List.lastIndexOf(",")) + "}";
            alert(json1);
            // TRANSACCION PRINCIPAL
            firebase.database().ref('texts/' + UID).set({
                element: elementTextjs,
                type: typeLyricjs,
                originalSong: songLyric_List,
                songs: JSON && JSON.parse(json1) || $.parseJSON(json1)
            });
            addText_SongList(json1, UID);

        } else if (typeLyricjs == "Obtenida") {
            // GENERATE A UNIQUE ID BY DATE
            var fecha = new Date();
            var UID = "Y" + fecha.getFullYear() + "M" + (fecha.getMonth() + 1) + "D" + fecha.getDate() + "H" + fecha.getHours() + "Mi" + fecha.getMinutes() + "S" + fecha.getSeconds() + "m" + fecha.getMilliseconds() + "";

            var json1 = "{" + songText_List.substring(0, songText_List.lastIndexOf(",")) + "}";

            // TRANSACCION PRINCIPAL
            firebase.database().ref('texts/' + UID).set({
                element: elementTextjs,
                originalSong: songLyric_List,
                type: typeLyricjs,
                songs: JSON && JSON.parse(json1) || $.parseJSON(json1)
            });
            addText_SongList(json1, UID);

        } else {
            alert("Seleccione un tipo de Letra");
            return null;
        }
    }
    initTextPage();
}

function addText_SongList(json, UID) {
    alert(json);
    var jsonTexts = JSON && JSON.parse(json) || $.parseJSON(json);
    var jsonFinal = "";

    for (i = 0; i < Object.keys(jsonTexts).length; i++) {
        jsonFinal += '"' + i + '": {"id":"' + UID + '"}';
    
    jsonFinal = "{" + jsonFinal + "}";

    firebase.database().ref('songs/' + jsonTexts[i].id + "/texts").update(JSON && JSON.parse(jsonFinal) || $.parseJSON(jsonFinal), );}
}