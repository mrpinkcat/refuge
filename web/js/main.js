var socket = io(),
    myID;

socket.on('connect', function() {
    socket.emit('client_user_waiting_id');
    console.info('Successfully connected to server.');
    $('.materialboxed').materialbox();
    $('.button-collapse').sideNav();
    $('.modal').modal();
});
socket.on('getUserID', function(userID) {
    myID = userID;
    console.info('Your id is now : ' + myID);
    socket.emit('client_user_connect_with_id', myID);
});

socket.on('showPet', function(info) {
    if (info.onSite)
        printCard(info);
});
socket.on('removeCard', function(uid) {
    $('#card-div-' + uid).remove();
    $('#' + uid + '-modal').remove();
});
socket.on('init-after-load', function() {
    $('.materialboxed').materialbox();
    $('.button-collapse').sideNav();
    $('.modal').modal();
});
socket.on('init-pralax', function() {
    $('.parallax').parallax();
    $('.collapsible').collapsible();
    $('.button-collapse').sideNav();
});
socket.on('getClickOnModal', function(uid, numOfClick) {
        $('#' + uid + '-modal-view').text('A été vu ' + numOfClick + ' fois sur le site');
});
socket.on('simpleToast', function(clientOrAdmin, text, classs, time) {
    if (clientOrAdmin == 'client')
        Materialize.toast(text, time, classs);
});

/********\
|* CATS *|
\********/

socket.on('checkingDbFail-catDirEmpty', function() {
    $('#progressLogo').remove();
    $('#cards').prepend('<div class="row"><div class="col s12 m5"><div class="card-panel red darken-4"><span class="white-text center-align"><b><i class="fa fa-exclamation-triangle"></i> <u>ERREUR</u> <i class="fa fa-exclamation-triangle"></i></b><br><br>IL N\'Y A PAS DE CHATS DANS LA BASE DE DONNEE</span></div></div></div>');
});
socket.on('checkingDbFail-catDirDontExist', function() {
    $('#progressLogo').remove();
    $('#cards').prepend('<div class="row"><div class="col s12 m5"><div class="card-panel red darken-4"><span class="white-text center-align"><b><i class="fa fa-exclamation-triangle"></i> <u>ERREUR</u> <i class="fa fa-exclamation-triangle"></i></b><br><br>IL N\'Y A DE DE DOSSIER CHAT DANS LA BASE DE DONNEE</span></div></div></div>');
});
socket.on('initCatPage', function(allCats) {
    $.each(allCats, function(i, cat) {
        if (cat.onSite == true)
            printCard(cat);
        else
            return;
    });
    $('#progressLogo').remove();
});

/********\
|* DOGS *|
\********/

socket.on('checkingDbFail-dogDirEmpty', function() {
    $('#cards').prepend('<div class="row"><div class="col s12 m5"><div class="card-panel red darken-4"><span class="white-text center-align"><b><i class="fa fa-exclamation-triangle"></i> <u>ERREUR</u> <i class="fa fa-exclamation-triangle"></i></b><br><br>IL N\'Y A PAS DE CHIEN DANS LA BASE DE DONNEE</span></div></div></div>');
    $('#progressLogo').remove();
});
socket.on('checkingDbFail-dogDirDontExist', function() {
    $('#cards').prepend('<div class="row"><div class="col s12 m5"><div class="card-panel red darken-4"><span class="white-text center-align"><b><i class="fa fa-exclamation-triangle"></i> <u>ERREUR</u> <i class="fa fa-exclamation-triangle"></i></b><br><br>IL N\'Y A DE DE DOSSIER CHIEN DANS LA BASE DE DONNEE</span></div></div></div>');
    $('#progressLogo').remove();
});
socket.on('initDogPage', function(allDogs) {
    $.each(allDogs, function(i, dog) {
        printCard(dog);
    });
    $('#progressLogo').remove();
});

/*********************\
|* BROWSER DETECTION *|
\*********************/

function get_browser_info() {
    var ua = navigator.userAgent,
        tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return {
            name: 'IE ',
            version: (tem[1] || '')
        };
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR\/(\d+)/)
        if (tem != null) {
            return {
                name: 'Opera',
                version: tem[1]
            };
        }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) {
        M.splice(1, 1, tem[1]);
    }
    return {
        name: M[0],
        version: M[1]
    };
}

function isChrome() {
    var browser = (get_browser_info().name).toLocaleLowerCase();
    if (browser != 'chrome')
        return false;
    return true;
}

function chromeActivate(ObjId, classToAdd) {
    if (isChrome()) {
        $('#' + ObjId).addClass(classToAdd);
        return;
    }
}

/********\
|* CORE *|
\********/

function printCard(info) {
    var card,
        modal;

    if (info.adopt == true) {
        if (info.sex == 'male') {
            card = '<div id="card-div-' + info.uid + '" class="col s3"><div id="' + info.uid + '" class="card hoverable scale-transition"><div class="card-image valign-wrapper"><img id ="cardImage" src="' + info.imageURL + '"><span class="card-title red-text text-accent-3"><b>ADOPTÉ</b></span><a href="#' + info.uid + '-modal" class="btn-floating halfway-fab waves-effect waves-light blue" onclick="clickOnModal(\'' + info.category + '\', \'' + info.uid + '\', \'' + info.name + '\', \'' + myID + '\')"><i class="material-icons">info_outline</i></a></div><div class="card-content"><p class="center-align"><b>' + info.name + info.formatSex + '<br>' + info.birthDate + '</b></p></div><div></div>';
            modal = '<div id="' + info.uid + '-modal" class="modal"><div id="card-' + info.number + '" class="col s12 m7"><div class="card horizontal"><div class="card-image valign-wrapper"><img src="' + info.imageURL + '"></div><div class="card-stacked"><div class="card-content"><h4>' + info.name + '</h4><p><b>Né en ' + info.birthDate + ' - Mâle' + info.formatSex + ' - ' + info.breed + '</b></p><br><p>' + info.description + '</p><br><p id="' + info.uid + '-modal-view">Vue...</p><br><p><b>N°' + info.number + '</b></p><h4 class="red-text accent-4"><b>ADOPTÉ</b></h4></div></div></div></div></div>';
        }
        if (info.sex == 'female') {
            card = '<div id="card-div-' + info.uid + '" class="col s3"><div id="' + info.uid + '" class="card hoverable scale-transition"><div class="card-image valign-wrapper"><img id ="cardImage" src="' + info.imageURL + '"><span class="card-title red-text text-accent-3"><b>ADOPTÉE</b></span><a href="#' + info.uid + '-modal" class="btn-floating halfway-fab waves-effect waves-light blue" onclick="clickOnModal(\'' + info.category + '\', \'' + info.uid + '\', \'' + info.name + '\', \'' + myID + '\')"><i class="material-icons">info_outline</i></a></div><div class="card-content"><p class="center-align"><b>' + info.name + ' ' + info.formatSex + '<br>' + info.birthDate + '</b></p></div><div></div>';
            modal = '<div id="' + info.uid + '-modal" class="modal"><div id="card-' + info.number + '" class="col s12 m7"><div class="card horizontal"><div class="card-image valign-wrapper"><img src="' + info.imageURL + '"></div><div class="card-stacked"><div class="card-content"><h4>' + info.name + '</h4><p><b>Né en ' + info.birthDate + ' - Femelle' + info.formatSex + ' - ' + info.breed + '</b></p><br><p>' + info.description + '</p><br><p id="' + info.uid + '-modal-view">Vue...</p><br><p><b>N°' + info.number + '</b></p><h4 class="red-text accent-4"><b>ADOPTÉE</b></h4></div></div></div></div></div>';
        }
    }
    if (info.adopt == false) {
        if (info.sex == 'male') {
            card = '<div id="card-div-' + info.uid + '" class="col s3"><div id="' + info.uid + '" class="card hoverable scale-transition"><div class="card-image valign-wrapper"><img id ="cardImage" src="' + info.imageURL + '"><a href="#' + info.uid + '-modal" class="btn-floating halfway-fab waves-effect waves-light blue" onclick="clickOnModal(\'' + info.category + '\', \'' + info.uid + '\', \'' + info.name + '\', \'' + myID + '\')"><i class="material-icons">info_outline</i></a></div><div class="card-content"><p class="center-align"><b>' + info.name + ' ' + info.formatSex + '<br>' + info.birthDate + '</b></p></div><div></div>';
            modal = '<div id="' + info.uid + '-modal" class="modal"><div id="card-' + info.number + '" class="col s12 m7"><div class="card horizontal"><div class="card-image valign-wrapper"><img src="' + info.imageURL + '"></div><div class="card-stacked"><div class="card-content"><h4>' + info.name + '</h4><p><b>Né en ' + info.birthDate + ' - ' + info.formatSex + ' - ' + info.breed + '</b></p><br><p>' + info.description + '</p><br><p id="' + info.uid + '-modal-view">Vue...</p><br><p><b>N°' + info.number + '</b></p></div></div></div></div></div>';
        }
        if (info.sex == 'female') {
            card = '<div id="card-div-' + info.uid + '" class="col s3"><div id="' + info.uid + '" class="card hoverable scale-transition"><div class="card-image valign-wrapper"><img id ="cardImage" src="' + info.imageURL + '"><a href="#' + info.uid + '-modal" class="btn-floating halfway-fab waves-effect waves-light blue" onclick="clickOnModal(\'' + info.category + '\', \'' + info.uid + '\', \'' + info.name + '\', \'' + myID + '\')"><i class="material-icons">info_outline</i></a></div><div class="card-content"><p class="center-align"><b>' + info.name + ' ' + info.formatSex + '<br>' + info.birthDate + '</b></p></div><div></div>';
            modal = '<div id="' + info.uid + '-modal" class="modal"><div id="card-' + info.number + '" class="col s12 m7"><div class="card horizontal"><div class="card-image valign-wrapper"><img src="' + info.imageURL + '"></div><div class="card-stacked"><div class="card-content"><h4>' + info.name + '</h4><p><b>Né en ' + info.birthDate + ' - ' + info.formatSex + ' - ' + info.breed + '</b></p><br><p>' + info.description + '</p><br><p id="' + info.uid + '-modal-view">Vue...</p><br><p><b>N°' + info.number + '</b></p></div></div></div></div></div>';
        }
    }

    $('#cards').prepend(card);
    $('#modals').prepend(modal);
    chromeActivate('cardImage', 'materialboxed');
    $('.materialboxed').materialbox();
    $('.modal').modal();
}

function clickOnModal(category, uid, name, userID) {
    socket.emit('clickOnModal', category, uid, name, userID, myID);
    
}
