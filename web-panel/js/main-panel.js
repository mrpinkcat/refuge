var socket = io(),
    uidUsed,
    alreadyConnected = false,
    typeLog,
    oldInfo,
    ip;

$(document).ready(function() {
    socket.emit('client_admin_connected');
    $('ul.tabs').tabs();
    $('.modal').modal();
    $('.button-collapse').sideNav();
    $.get("https://ipinfo.io", function(response) {
        ip = response.ip;
    }, "jsonp");
    socket.emit('needTypeLog');
    socket.emit('needUserOnSite');
});

function uploadModifyClick(id) {
    socket.emit('startModify', id);
}

function startUploadImg() {
    socket.emit('startUploadImg');
}

function addCatInPanel(catInfo) {
    var collection,
        modal;
    if (catInfo.sex == 'male') {
        if (catInfo.adopt == true) {
            if (catInfo.onSite == true) {
                collection = '<li class="collection-item avatar" id="collection-' + catInfo.uid + '"><img src="' + catInfo.imageURL + '" alt="Photo du chat" class="circle"><span class="title"><b>' + catInfo.name + ' - N°' + catInfo.number + ' - Mâle</b></span><p><span class="green-text"><b>ADOPTÉ LE xx/xx/xxxx</b></span><br><span class="green-text"><b>Affiché sur le site</b></span></p><a href="#modal-' + catInfo.uid + '" class="secondary-content valign-wrapper">Modifier<i class="material-icons">mode_edit</i></a></li>';
                modal = '<div id="modal-' + catInfo.uid + '" class="modal"><div class="modal-content"><h4>Modification :</h4><div id="cat-line1-' + catInfo.uid + '" class="valign-wrapper row"><div class="input-field col s3"><input value="' + catInfo.name + '" id="cat-name-modal-' + catInfo.uid + '" type="text"><label for="cat-name-modal-' + catInfo.uid + '" class="active">Nom</label></div><div class="input-field col s3"><input value="' + catInfo.breed + '" id="cat-breed-modal-' + catInfo.uid + '" type="text"><label class="active" for="cat-breed-modal-' + catInfo.uid + '">Race</label></div><div class="input-field col s4"><input value="' + catInfo.number + '" id="cat-number-modal-' + catInfo.uid + '" type="text"><label class="active" for="cat-number-modal-' + catInfo.uid + '">Numéro de tatouage</label></div><div class="switch center-align"><input name="cat-sex-modal" type="radio" id="cat-male-modal-' + catInfo.uid + '" checked /><label for="cat-male-modal-' + catInfo.uid + '" class="col s1">Mâle</label></div><div class="switch center-align"><input name="cat-sex-modal" type="radio" id="cat-female-modal-' + catInfo.uid + '" /><label for="cat-female-modal-' + catInfo.uid + '" class="col s1">Femelle</label></div><br></div><div id="cat-ligne2-' + catInfo.uid + '" class="valign-wrapper row"><div class="input-field col s12"><textarea id="cat-desc-modal-' + catInfo.uid + '" class="materialize-textarea"></textarea><label class="active" for="cat-desc-modal-' + catInfo.uid + '">Description</label></div></div><div id="cat-ligne3-' + catInfo.uid + '" class="valign-wrapper row"><div class="input-field col s5"><form class="" method="post" enctype="multipart/form-data" action="/panel"><input id="filepath-' + catInfo.uid + '" type="file" name="animal-pic" /><input type="submit" class="btn" onclick="uploadModifyClick(\'' + catInfo.uid + '\');" /></form></div><div class="input-field col s3"><input value="' + catInfo.birthDate + '" id="cat-birthDate-modal-' + catInfo.uid + '" type="text"><label class="active" for="cat-birthDate-modal-' + catInfo.uid + '">Date de naissance</label></div><div class="col s2 center-align"><input type="checkbox" id="cat-show-modal-' + catInfo.uid + '" checked /><label class="active" for="cat-show-modal-' + catInfo.uid + '">Affiché</label></div><div class="col s2 center-align"><input type="checkbox" id="cat-adopt-modal-' + catInfo.uid + '" checked /><label class="active" for="cat-adopt-modal-' + catInfo.uid + '">Adopté</label></div></div><div class="modal-footer"><a class="btn waves-effect waves-light orange" type="submit" name="action" onclick="modifyclick(\'' + catInfo.category + '\', \'' + catInfo.uid + '\');">Modifier<i class="material-icons right">mode_edit</i></a><a class="btn-flat waves-effect waves-light waves-red" onclick="deletecat(\'' + catInfo.uid + '\', \'' + catInfo.name + '\');">Supprimer<i class="modal-action modal-close material-icons right">delete</i></a></div></div></div>';
            }
            if (catInfo.onSite == false) {
                collection = '<li class="collection-item avatar" id="collection-' + catInfo.uid + '"><img src="' + catInfo.imageURL + '" alt="Photo du chat" class="circle"><span class="title"><b>' + catInfo.name + ' - N°' + catInfo.number + ' - Mâle</b></span><p><span class="green-text"><b>ADOPTÉ LE xx/xx/xxxx</b></span><br><span class="red-text"><b>Masqué sur le site</b></span></p><a href="#modal-' + catInfo.uid + '" class="secondary-content valign-wrapper">Modifier<i class="material-icons">mode_edit</i></a></li>';
                modal = '<div id="modal-' + catInfo.uid + '" class="modal"><div class="modal-content"><h4>Modification :</h4><div id="cat-line1-' + catInfo.number + '" class="valign-wrapper row"><div class="input-field col s3"><input value="' + catInfo.name + '" id="cat-name-modal-' + catInfo.uid + '" type="text"><label for="cat-name-modal-' + catInfo.uid + '" class="active">Nom</label></div><div class="input-field col s3"><input value="' + catInfo.breed + '" id="cat-breed-modal-' + catInfo.uid + '" type="text"><label class="active" for="cat-breed-modal-' + catInfo.uid + '">Race</label></div><div class="input-field col s4"><input value="' + catInfo.number + '" id="cat-number-modal-' + catInfo.uid + '" type="text"><label class="active" for="cat-number-modal-' + catInfo.uid + '">Numéro de tatouage</label></div><div class="switch center-align"><input name="cat-sex-modal" type="radio" id="cat-male-modal-' + catInfo.uid + '" checked /><label for="cat-male-modal-' + catInfo.uid + '" class="col s1">Mâle</label></div><div class="switch center-align"><input name="cat-sex-modal" type="radio" id="cat-female-modal-' + catInfo.uid + '" /><label for="cat-female-modal-' + catInfo.uid + '" class="col s1">Femelle</label></div><br></div><div id="cat-ligne2-' + catInfo.uid + '" class="valign-wrapper row"><div class="input-field col s12"><textarea id="cat-desc-modal-' + catInfo.uid + '" class="materialize-textarea"></textarea><label class="active" for="cat-desc-modal-' + catInfo.uid + '">Description</label></div></div><div id="cat-ligne3-' + catInfo.uid + '" class="valign-wrapper row"><div class="input-field col s7"><form class="" method="post" enctype="multipart/form-data" action="/panel"><input id="filepath-' + catInfo.uid + '" type="file" name="animal-pic" /><input type="submit" class="btn"onclick="uploadModifyClick(\'' + catInfo.uid + '\');" /></form></div><div class="input-field col s3"><input value="' + catInfo.birthDate + '" id="cat-birthDate-modal-' + catInfo.uid + '" type="text"><label class="active" for="cat-birthDate-modal-' + catInfo.uid + '">Date de naissance</label></div><div class="col s2 center-align"><input type="checkbox" id="cat-show-modal-' + catInfo.uid + '" /><label class="active" for="cat-show-modal-' + catInfo.uid + '">Affiché</label></div><div class="col s2 center-align"><input type="checkbox" id="cat-adopt-modal-' + catInfo.uid + '" checked /><label class="active" for="cat-adopt-modal-' + catInfo.uid + '">Adopté</label></div></div><div class="modal-footer"><a class="btn waves-effect waves-light orange" type="submit" name="action" onclick="modifyclick(\'' + catInfo.category + '\', \'' + catInfo.uid + '\');">Modifier<i class="material-icons right">mode_edit</i></a><a class="btn-flat waves-effect waves-light waves-red" onclick="deletecat(\'' + catInfo.uid + '\', \'' + catInfo.name + '\');">Supprimer<i class="modal-action modal-close material-icons right">delete</i></a></div></div></div>';
            }
        }
        if (catInfo.adopt == false) {
            if (catInfo.onSite == true) {
                collection = '<li class="collection-item avatar" id="collection-' + catInfo.uid + '"><img src="' + catInfo.imageURL + '" alt="Photo du chat" class="circle"><span class="title"><b>' + catInfo.name + ' - N°' + catInfo.number + ' - Mâle</b></span><p><span class="red-text"><b>Disponible à l\'adoption</b></span><br><span class="green-text"><b>Affiché sur le site</b></span></p><a href="#modal-' + catInfo.uid + '" class="secondary-content valign-wrapper">Modifier<i class="material-icons">mode_edit</i></a></li>';
                modal = '<div id="modal-' + catInfo.uid + '" class="modal"><div class="modal-content"><h4>Modification :</h4><div id="cat-line1-' + catInfo.uid + '" class="valign-wrapper row"><div class="input-field col s3"><input value="' + catInfo.name + '" id="cat-name-modal-' + catInfo.uid + '" type="text"><label for="cat-name-modal-' + catInfo.uid + '" class="active">Nom</label></div><div class="input-field col s3"><input value="' + catInfo.breed + '" id="cat-breed-modal-' + catInfo.uid + '" type="text"><label class="active" for="cat-breed-modal-' + catInfo.uid + '">Race</label></div><div class="input-field col s4"><input value="' + catInfo.number + '" id="cat-number-modal-' + catInfo.uid + '" type="text"><label class="active" for="cat-number-modal-' + catInfo.uid + '">Numéro de tatouage</label></div><div class="switch center-align"><input name="cat-sex-modal" type="radio" id="cat-male-modal-' + catInfo.uid + '" checked /><label for="cat-male-modal-' + catInfo.uid + '" class="col s1">Mâle</label></div><div class="switch center-align"><input name="cat-sex-modal" type="radio" id="cat-female-modal-' + catInfo.uid + '" /><label for="cat-female-modal-' + catInfo.uid + '" class="col s1">Femelle</label></div><br></div><div id="cat-ligne2-' + catInfo.uid + '" class="valign-wrapper row"><div class="input-field col s12"><textarea id="cat-desc-modal-' + catInfo.uid + '" class="materialize-textarea"></textarea><label class="active" for="cat-desc-modal-' + catInfo.uid + '">Description</label></div></div><div id="cat-ligne3-' + catInfo.uid + '" class="valign-wrapper row"><div class="input-field col s7"><form class="" method="post" enctype="multipart/form-data" action="/panel"><input id="filepath-' + catInfo.uid + '" type="file" name="animal-pic" /><input type="submit" class="btn"onclick="uploadModifyClick(\'' + catInfo.uid + '\');" /></form></div><div class="input-field col s3"><input value="' + catInfo.birthDate + '" id="cat-birthDate-modal-' + catInfo.uid + '" type="text"><label class="active" for="cat-birthDate-modal-' + catInfo.uid + '">Date de naissance</label></div><div class="col s2 center-align"><input type="checkbox" id="cat-show-modal-' + catInfo.uid + '" checked /><label class="active" for="cat-show-modal-' + catInfo.uid + '">Affiché</label></div><div class="col s2 center-align"><input type="checkbox" id="cat-adopt-modal-' + catInfo.uid + '" /><label class="active" for="cat-adopt-modal-' + catInfo.uid + '">Adopté</label></div></div><div class="modal-footer"><a class="btn waves-effect waves-light orange" type="submit" name="action" onclick="modifyclick(\'' + catInfo.category + '\', \'' + catInfo.uid + '\');">Modifier<i class="material-icons right">mode_edit</i></a><a class="btn-flat waves-effect waves-light waves-red" onclick="deletecat(\'' + catInfo.uid + '\', \'' + catInfo.name + '\');">Supprimer<i class="modal-action modal-close material-icons right">delete</i></a></div></div></div>';
            }
            if (catInfo.onSite == false) {
                collection = '<li class="collection-item avatar" id="collection-' + catInfo.uid + '"><img src="' + catInfo.imageURL + '" alt="Photo du chat" class="circle"><span class="title"><b>' + catInfo.name + ' - N°' + catInfo.number + ' - Mâle</b></span><p><span class="red-text"><b>Masqué sur le site sans avoir été adopté <i class="fa fa-exclamation-triangle"></i></b></span></p><a href="#modal-' + catInfo.uid + '" class="secondary-content valign-wrapper">Modifier<i class="material-icons">mode_edit</i></a></li>';
                modal = '<div id="modal-' + catInfo.uid + '" class="modal"><div class="modal-content"><h4>Modification :</h4><div id="cat-line1-' + catInfo.uid + '" class="valign-wrapper row"><div class="input-field col s3"><input value="' + catInfo.name + '" id="cat-name-modal-' + catInfo.uid + '" type="text"><label for="cat-name-modal-' + catInfo.uid + '" class="active">Nom</label></div><div class="input-field col s3"><input value="' + catInfo.breed + '" id="cat-breed-modal-' + catInfo.uid + '" type="text"><label class="active" for="cat-breed-modal-' + catInfo.uid + '">Race</label></div><div class="input-field col s4"><input value="' + catInfo.number + '" id="cat-number-modal-' + catInfo.uid + '" type="text"><label class="active" for="cat-number-modal-' + catInfo.uid + '">Numéro de tatouage</label></div><div class="switch center-align"><input name="cat-sex-modal" type="radio" id="cat-male-modal-' + catInfo.uid + '" checked /><label for="cat-male-modal-' + catInfo.uid + '" class="col s1">Mâle</label></div><div class="switch center-align"><input name="cat-sex-modal" type="radio" id="cat-female-modal-' + catInfo.uid + '" /><label for="cat-female-modal-' + catInfo.uid + '" class="col s1">Femelle</label></div><br></div><div id="cat-ligne2-' + catInfo.uid + '" class="valign-wrapper row"><div class="input-field col s12"><textarea id="cat-desc-modal-' + catInfo.uid + '" class="materialize-textarea"></textarea><label class="active" for="cat-desc-modal-' + catInfo.uid + '">Description</label></div></div><div id="cat-ligne3-' + catInfo.uid + '" class="valign-wrapper row"><div class="input-field col s7"><form class="" method="post" enctype="multipart/form-data" action="/panel"><input id="filepath-' + catInfo.uid + '" type="file" name="animal-pic" /><input type="submit" class="btn"onclick="uploadModifyClick(\'' + catInfo.uid + '\');" /></form></div><div class="input-field col s3"><input value="' + catInfo.birthDate + '" id="cat-birthDate-modal-' + catInfo.uid + '" type="text"><label class="active" for="cat-birthDate-modal-' + catInfo.uid + '">Date de naissance</label></div><div class="col s2 center-align"><input type="checkbox" id="cat-show-modal-' + catInfo.uid + '" /><label class="active" for="cat-show-modal-' + catInfo.uid + '">Affiché</label></div><div class="col s2 center-align"><input type="checkbox" id="cat-adopt-modal-' + catInfo.uid + '" /><label class="active" for="cat-adopt-modal-' + catInfo.uid + '">Adopté</label></div></div><div class="modal-footer"><a class="btn waves-effect waves-light orange" type="submit" name="action" onclick="modifyclick(\'' + catInfo.category + '\', \'' + catInfo.uid + '\');">Modifier<i class="material-icons right">mode_edit</i></a><a class="btn-flat waves-effect waves-light waves-red" onclick="deletecat(\'' + catInfo.uid + '\', \'' + catInfo.name + '\');">Supprimer<i class="modal-action modal-close material-icons right">delete</i></a></div></div></div>';
            }
        }
    }
    if (catInfo.sex == 'female') {
        if (catInfo.adopt == true) {
            if (catInfo.onSite == true) {
                collection = '<li class="collection-item avatar" id="collection-' + catInfo.uid + '"><img src="' + catInfo.imageURL + '" alt="Photo du chat" class="circle"><span class="title"><b>' + catInfo.name + ' - N°' + catInfo.number + ' - Femelle</b></span><p><span class="green-text"><b>ADOPTÉE LE xx/xx/xxxx</b></span><br><span class="green-text"><b>Affichée sur le site</b></span></p><a href="#modal-' + catInfo.uid + '" class="secondary-content valign-wrapper">Modifier<i class="material-icons">mode_edit</i></a></li>';
                modal = '<div id="modal-' + catInfo.uid + '" class="modal"><div class="modal-content"><h4>Modification :</h4><div id="cat-line1-' + catInfo.uid + '" class="valign-wrapper row"><div class="input-field col s3"><input value="' + catInfo.name + '" id="cat-name-modal-' + catInfo.uid + '" type="text"><label for="cat-name-modal-' + catInfo.uid + '" class="active">Nom</label></div><div class="input-field col s3"><input value="' + catInfo.breed + '" id="cat-breed-modal-' + catInfo.uid + '" type="text"><label class="active" for="cat-breed-modal-' + catInfo.uid + '">Race</label></div><div class="input-field col s4"><input value="' + catInfo.number + '" id="cat-number-modal-' + catInfo.uid + '" type="text"><label class="active" for="cat-number-modal-' + catInfo.uid + '">Numéro de tatouage</label></div><div class="switch center-align"><input name="cat-sex-modal" type="radio" id="cat-male-modal-' + catInfo.uid + '" /><label for="cat-male-modal-' + catInfo.uid + '" class="col s1">Mâle</label></div><div class="switch center-align"><input name="cat-sex-modal" type="radio" id="cat-female-modal-' + catInfo.uid + '" checked /><label for="cat-female-modal-' + catInfo.uid + '" class="col s1">Femelle</label></div><br></div><div id="cat-ligne2-' + catInfo.uid + '" class="valign-wrapper row"><div class="input-field col s12"><textarea id="cat-desc-modal-' + catInfo.uid + '" class="materialize-textarea"></textarea><label class="active" for="cat-desc-modal-' + catInfo.uid + '">Description</label></div></div><div id="cat-ligne3-' + catInfo.uid + '" class="valign-wrapper row"><div class="input-field col s7"><form class="" method="post" enctype="multipart/form-data" action="/panel"><input id="filepath-' + catInfo.uid + '" type="file" name="animal-pic" /><input type="submit" class="btn"onclick="uploadModifyClick(\'' + catInfo.uid + '\');" /></form></div><div class="input-field col s3"><input value="' + catInfo.birthDate + '" id="cat-birthDate-modal-' + catInfo.uid + '" type="text"><label class="active" for="cat-birthDate-modal-' + catInfo.uid + '">Date de naissance</label></div><div class="col s2 center-align"><input type="checkbox" id="cat-show-modal-' + catInfo.uid + '" /><label class="active" for="cat-show-modal-' + catInfo.uid + '">Affiché</label></div><div class="col s2 center-align"><input type="checkbox" id="cat-adopt-modal-' + catInfo.uid + '" checked /><label class="active" for="cat-adopt-modal-' + catInfo.uid + '">Adoptée</label></div></div><div class="modal-footer"><a class="btn waves-effect waves-light orange" type="submit" name="action" onclick="modifyclick(\'' + catInfo.category + '\', \'' + catInfo.uid + '\');">Modifier<i class="material-icons right">mode_edit</i></a><a class="btn-flat waves-effect waves-light waves-red" onclick="deletecat(\'' + catInfo.uid + '\', \'' + catInfo.name + '\');">Supprimer<i class="modal-action modal-close material-icons right">delete</i></a></div></div></div>';
            }
            if (catInfo.onSite == false) {
                collection = '<li class="collection-item avatar" id="collection-' + catInfo.uid + '"><img src="' + catInfo.imageURL + '" alt="Photo du chat" class="circle"><span class="title"><b>' + catInfo.name + ' - N°' + catInfo.number + ' - Femelle</b></span><p><span class="green-text"><b>ADOPTÉE LE xx/xx/xxxx</b></span><br><span class="red-text"><b>Masqué sur le site</i></b></span></p><a href="#modal-' + catInfo.uid + '" class="secondary-content valign-wrapper">Modifier<i class="material-icons">mode_edit</i></a></li>';
                modal = '<div id="modal-' + catInfo.uid + '" class="modal"><div class="modal-content"><h4>Modification :</h4><div id="cat-line1-' + catInfo.uid + '" class="valign-wrapper row"><div class="input-field col s3"><input value="' + catInfo.name + '" id="cat-name-modal-' + catInfo.uid + '" type="text"><label for="cat-name-modal-' + catInfo.uid + '" class="active">Nom</label></div><div class="input-field col s3"><input value="' + catInfo.breed + '" id="cat-breed-modal-' + catInfo.uid + '" type="text"><label class="active" for="cat-breed-modal-' + catInfo.uid + '">Race</label></div><div class="input-field col s4"><input value="' + catInfo.number + '" id="cat-number-modal-' + catInfo.uid + '" type="text"><label class="active" for="cat-number-modal-' + catInfo.uid + '">Numéro de tatouage</label></div><div class="switch center-align"><input name="cat-sex-modal" type="radio" id="cat-male-modal-' + catInfo.uid + '" /><label for="cat-male-modal-' + catInfo.uid + '" class="col s1">Mâle</label></div><div class="switch center-align"><input name="cat-sex-modal" type="radio" id="cat-female-modal-' + catInfo.uid + '" checked /><label for="cat-female-modal-' + catInfo.uid + '" class="col s1">Femelle</label></div><br></div><div id="cat-ligne2-' + catInfo.uid + '" class="valign-wrapper row"><div class="input-field col s12"><textarea id="cat-desc-modal-' + catInfo.uid + '" class="materialize-textarea"></textarea><label class="active" for="cat-desc-modal-' + catInfo.uid + '">Description</label></div></div><div id="cat-ligne3-' + catInfo.uid + '" class="valign-wrapper row"><div class="input-field col s7"><form class="" method="post" enctype="multipart/form-data" action="/panel"><input id="filepath-' + catInfo.uid + '" type="file" name="animal-pic" /><input type="submit" class="btn"onclick="uploadModifyClick(\'' + catInfo.uid + '\');" /></form></div><div class="input-field col s3"><input value="' + catInfo.birthDate + '" id="cat-birthDate-modal-' + catInfo.uid + '" type="text"><label class="active" for="cat-birthDate-modal-' + catInfo.uid + '">Date de naissance</label></div><div class="col s2 center-align"><input type="checkbox" id="cat-show-modal-' + catInfo.uid + '" /><label class="active" for="cat-show-modal-' + catInfo.uid + '">Affiché</label></div><div class="col s2 center-align"><input type="checkbox" id="cat-adopt-modal-' + catInfo.uid + '" checked /><label class="active" for="cat-adopt-modal-' + catInfo.uid + '">Adoptée</label></div></div><div class="modal-footer"><a class="btn waves-effect waves-light orange" type="submit" name="action" onclick="modifyclick(\'' + catInfo.category + '\', \'' + catInfo.uid + '\');">Modifier<i class="material-icons right">mode_edit</i></a><a class="btn-flat waves-effect waves-light waves-red" onclick="deletecat(\'' + catInfo.uid + '\', \'' + catInfo.name + '\');">Supprimer<i class="modal-action modal-close material-icons right">delete</i></a></div></div></div>';
            }
        }
        if (catInfo.adopt == false) {
            if (catInfo.onSite == true) {
                collection = '<li class="collection-item avatar" id="collection-' + catInfo.uid + '"><img src="' + catInfo.imageURL + '" alt="Photo du chat" class="circle"><span class="title"><b>' + catInfo.name + ' - N°' + catInfo.number + ' - Femelle</b></span><p><span class="red-text"><b>Disponible à l\'adoption</b></span><br><span class="green-text"><b>Affichée sur le site</b></span></p><a href="#modal-' + catInfo.uid + '" class="secondary-content valign-wrapper">Modifier<i class="material-icons">mode_edit</i></a></li>';
                modal = '<div id="modal-' + catInfo.uid + '" class="modal"><div class="modal-content"><h4>Modification :</h4><div id="cat-line1-' + catInfo.uid + '" class="valign-wrapper row"><div class="input-field col s3"><input value="' + catInfo.name + '" id="cat-name-modal-' + catInfo.uid + '" type="text"><label for="cat-name-modal-' + catInfo.uid + '" class="active">Nom</label></div><div class="input-field col s3"><input value="' + catInfo.breed + '" id="cat-breed-modal-' + catInfo.uid + '" type="text"><label class="active" for="cat-breed-modal-' + catInfo.uid + '">Race</label></div><div class="input-field col s4"><input value="' + catInfo.number + '" id="cat-number-modal-' + catInfo.uid + '" type="text"><label class="active" for="cat-number-modal-' + catInfo.uid + '">Numéro de tatouage</label></div><div class="switch center-align"><input name="cat-sex-modal" type="radio" id="cat-male-modal-' + catInfo.uid + '" /><label for="cat-male-modal-' + catInfo.uid + '" class="col s1">Mâle</label></div><div class="switch center-align"><input name="cat-sex-modal" type="radio" id="cat-female-modal-' + catInfo.uid + '" checked /><label for="cat-female-modal-' + catInfo.uid + '" class="col s1">Femelle</label></div><br></div><div id="cat-ligne2-' + catInfo.uid + '" class="valign-wrapper row"><div class="input-field col s12"><textarea id="cat-desc-modal-' + catInfo.uid + '" class="materialize-textarea"></textarea><label class="active" for="cat-desc-modal-' + catInfo.uid + '">Description</label></div></div><div id="cat-ligne3-' + catInfo.uid + '" class="valign-wrapper row"><div class="input-field col s7"><form class="" method="post" enctype="multipart/form-data" action="/panel"><input id="filepath-' + catInfo.uid + '" type="file" name="animal-pic" /><input type="submit" class="btn"onclick="uploadModifyClick(\'' + catInfo.uid + '\');" /></form></div><div class="input-field col s3"><input value="' + catInfo.birthDate + '" id="cat-birthDate-modal-' + catInfo.uid + '" type="text"><label class="active" for="cat-birthDate-modal-' + catInfo.uid + '">Date de naissance</label></div><div class="col s2 center-align"><input type="checkbox" id="cat-show-modal-' + catInfo.uid + '" /><label class="active" for="cat-show-modal-' + catInfo.uid + '">Affiché</label></div><div class="col s2 center-align"><input type="checkbox" id="cat-adopt-modal-' + catInfo.uid + '" /><label class="active" for="cat-adopt-modal-' + catInfo.uid + '">Adoptée</label></div></div><div class="modal-footer"><a class="btn waves-effect waves-light orange" type="submit" name="action" onclick="modifyclick(\'' + catInfo.category + '\', \'' + catInfo.uid + '\');">Modifier<i class="material-icons right">mode_edit</i></a><a class="btn-flat waves-effect waves-light waves-red" onclick="deletecat(\'' + catInfo.uid + '\', \'' + catInfo.name + '\');">Supprimer<i class="modal-action modal-close material-icons right">delete</i></a></div></div></div>';
            }
            if (catInfo.onSite == false) {
                collection = '<li class="collection-item avatar" id="collection-' + catInfo.uid + '"><img src="' + catInfo.imageURL + '" alt="Photo du chat" class="circle"><span class="title"><b>' + catInfo.name + ' - N°' + catInfo.number + ' - Femelle</b></span><p><span class="red-text"><b>Disponible à l\'adoption</b></span><br><span class="red-text"><b>Masquée sur le site</b></span></p><a href="#modal-' + catInfo.uid + '" class="secondary-content valign-wrapper">Modifier<i class="material-icons">mode_edit</i></a></li>';
                modal = '<div id="modal-' + catInfo.uid + '" class="modal"><div class="modal-content"><h4>Modification :</h4><div id="cat-line1-' + catInfo.uid + '" class="valign-wrapper row"><div class="input-field col s3"><input value="' + catInfo.name + '" id="cat-name-modal-' + catInfo.uid + '" type="text"><label for="cat-name-modal-' + catInfo.uid + '" class="active">Nom</label></div><div class="input-field col s3"><input value="' + catInfo.breed + '" id="cat-breed-modal-' + catInfo.uid + '" type="text"><label class="active" for="cat-breed-modal-' + catInfo.uid + '">Race</label></div><div class="input-field col s4"><input value="' + catInfo.number + '" id="cat-number-modal-' + catInfo.uid + '" type="text"><label class="active" for="cat-number-modal-' + catInfo.uid + '">Numéro de tatouage</label></div><div class="switch center-align"><input name="cat-sex-modal" type="radio" id="cat-male-modal-' + catInfo.uid + '" /><label for="cat-male-modal-' + catInfo.uid + '" class="col s1">Mâle</label></div><div class="switch center-align"><input name="cat-sex-modal" type="radio" id="cat-female-modal-' + catInfo.uid + '" checked /><label for="cat-female-modal-' + catInfo.uid + '" class="col s1">Femelle</label></div><br></div><div id="cat-ligne2-' + catInfo.uid + '" class="valign-wrapper row"><div class="input-field col s12"><textarea id="cat-desc-modal-' + catInfo.uid + '" class="materialize-textarea"></textarea><label class="active" for="cat-desc-modal-' + catInfo.uid + '">Description</label></div></div><div id="cat-ligne3-' + catInfo.uid + '" class="valign-wrapper row"><div class="input-field col s7"><form class="" method="post" enctype="multipart/form-data" action="/panel"><input id="filepath-' + catInfo.uid + '" type="file" name="animal-pic" /><input type="submit" class="btn"onclick="uploadModifyClick(\'' + catInfo.uid + '\');" /></form></div><div class="input-field col s3"><input value="' + catInfo.birthDate + '" id="cat-birthDate-modal-' + catInfo.uid + '" type="text"><label class="active" for="cat-birthDate-modal-' + catInfo.uid + '">Date de naissance</label></div><div class="col s2 center-align"><input type="checkbox" id="cat-show-modal-' + catInfo.uid + '" /><label class="active" for="cat-show-modal-' + catInfo.uid + '">Affiché</label></div><div class="col s2 center-align"><input type="checkbox" id="cat-adopt-modal-' + catInfo.uid + '" /><label class="active" for="cat-adopt-modal-' + catInfo.uid + '">Adoptée</label></div></div><div class="modal-footer"><a class="btn waves-effect waves-light orange" type="submit" name="action" onclick="modifyclick(\'' + catInfo.category + '\', \'' + catInfo.uid + '\');">Modifier<i class="material-icons right">mode_edit</i></a><a class="btn-flat waves-effect waves-light waves-red" onclick="deletecat(\'' + catInfo.uid + '\', \'' + catInfo.name + '\');">Supprimer<i class="modal-action modal-close material-icons right">delete</i></a></div></div></div>';
            }
        }
    }

    $('#cat-collection').prepend(collection);
    $('#cat-panel-modals').prepend(modal);
    $('#cat-desc-modal-' + catInfo.uid).val(catInfo.description);
    $('.modal').modal();
}

function addDogInPanel(dogInfo) {
    var collection,
        modal;
    if (dogInfo.sex == 'male') {
        if (dogInfo.adopt == true) {
            if (dogInfo.onSite == true) {
                collection = '<li class="collection-item avatar" id="collection-' + dogInfo.uid + '"><img src="' + dogInfo.imageURL + '" alt="Photo du chat" class="circle"><span class="title"><b>' + dogInfo.name + ' - N°' + dogInfo.number + ' - Mâle</b></span><p><span class="green-text"><b>ADOPTÉ LE xx/xx/xxxx</b></span><br><span class="green-text"><b>Affiché sur le site</b></span></p><a href="#modal-' + dogInfo.uid + '" class="secondary-content valign-wrapper">Modifier<i class="material-icons">mode_edit</i></a></li>';
                modal = '<div id="modal-' + dogInfo.uid + '" class="modal"><div class="modal-content"><h4>Modification :</h4><div id="dog-line1-' + dogInfo.uid + '" class="valign-wrapper row"><div class="input-field col s3"><input value="' + dogInfo.name + '" id="dog-name-modal-' + dogInfo.uid + '" type="text"><label for="dog-name-modal-' + dogInfo.uid + '" class="active">Nom</label></div><div class="input-field col s3"><input value="' + dogInfo.breed + '" id="dog-breed-modal-' + dogInfo.uid + '" type="text"><label class="active" for="dog-breed-modal-' + dogInfo.uid + '">Race</label></div><div class="input-field col s4"><input value="' + dogInfo.number + '" id="dog-number-modal-' + dogInfo.uid + '" type="text"><label class="active" for="dog-number-modal-' + dogInfo.uid + '">Numéro de tatouage</label></div><div class="switch center-align"><input name="dog-sex-modal" type="radio" id="dog-male-modal-' + dogInfo.uid + '" checked /><label for="dog-male-modal-' + dogInfo.uid + '" class="col s1">Mâle</label></div><div class="switch center-align"><input name="dog-sex-modal" type="radio" id="dog-female-modal-' + dogInfo.uid + '" /><label for="dog-female-modal-' + dogInfo.uid + '" class="col s1">Femelle</label></div><br></div><div id="dog-ligne2-' + dogInfo.uid + '" class="valign-wrapper row"><div class="input-field col s12"><textarea id="dog-desc-modal-' + dogInfo.uid + '" class="materialize-textarea"></textarea><label class="active" for="dog-desc-modal-' + dogInfo.uid + '">Description</label></div></div><div id="dog-ligne3-' + dogInfo.uid + '" class="valign-wrapper row"><div class="input-field col s5"><form class="" method="post" enctype="multipart/form-data" action="/panel"><input id="filepath-' + dogInfo.uid + '" type="file" name="animal-pic" /><input type="submit" class="btn"onclick="uploadModifyClick(\'' + dogInfo.uid + '\');" /></form></div><div class="input-field col s3"><input value="' + dogInfo.birthDate + '" id="dog-birthDate-modal-' + dogInfo.uid + '" type="text"><label class="active" for="dog-birthDate-modal-' + dogInfo.uid + '">Date de naissance</label></div><div class="col s2 center-align"><input type="checkbox" id="dog-show-modal-' + dogInfo.uid + '" checked /><label class="active" for="dog-show-modal-' + dogInfo.uid + '">Affiché</label></div><div class="col s2 center-align"><input type="checkbox" id="dog-adopt-modal-' + dogInfo.uid + '" checked /><label class="active" for="dog-adopt-modal-' + dogInfo.uid + '">Adopté</label></div></div><div class="modal-footer"><a class="btn waves-effect waves-light orange" type="submit" name="action" onclick="modifyclick(\'' + dogInfo.category + '\', \'' + dogInfo.uid + '\');">Modifier<i class="material-icons right">mode_edit</i></a><a class="btn-flat waves-effect waves-light waves-red" onclick="deletedog(\'' + dogInfo.uid + '\', \'' + dogInfo.name + '\');">Supprimer<i class="modal-action modal-close material-icons right">delete</i></a></div></div></div>';
            }
            if (dogInfo.onSite == false) {
                collection = '<li class="collection-item avatar" id="collection-' + dogInfo.uid + '"><img src="' + dogInfo.imageURL + '" alt="Photo du chat" class="circle"><span class="title"><b>' + dogInfo.name + ' - N°' + dogInfo.number + ' - Mâle</b></span><p><span class="green-text"><b>ADOPTÉ LE xx/xx/xxxx</b></span><br><span class="red-text"><b>Masqué sur le site</b></span></p><a href="#modal-' + dogInfo.uid + '" class="secondary-content valign-wrapper">Modifier<i class="material-icons">mode_edit</i></a></li>';
                modal = '<div id="modal-' + dogInfo.uid + '" class="modal"><div class="modal-content"><h4>Modification :</h4><div id="dog-line1-' + dogInfo.number + '" class="valign-wrapper row"><div class="input-field col s3"><input value="' + dogInfo.name + '" id="dog-name-modal-' + dogInfo.uid + '" type="text"><label for="dog-name-modal-' + dogInfo.uid + '" class="active">Nom</label></div><div class="input-field col s3"><input value="' + dogInfo.breed + '" id="dog-breed-modal-' + dogInfo.uid + '" type="text"><label class="active" for="dog-breed-modal-' + dogInfo.uid + '">Race</label></div><div class="input-field col s4"><input value="' + dogInfo.number + '" id="dog-number-modal-' + dogInfo.uid + '" type="text"><label class="active" for="dog-number-modal-' + dogInfo.uid + '">Numéro de tatouage</label></div><div class="switch center-align"><input name="dog-sex-modal" type="radio" id="dog-male-modal-' + dogInfo.uid + '" checked /><label for="dog-male-modal-' + dogInfo.uid + '" class="col s1">Mâle</label></div><div class="switch center-align"><input name="dog-sex-modal" type="radio" id="dog-female-modal-' + dogInfo.uid + '" /><label for="dog-female-modal-' + dogInfo.uid + '" class="col s1">Femelle</label></div><br></div><div id="dog-ligne2-' + dogInfo.uid + '" class="valign-wrapper row"><div class="input-field col s12"><textarea id="dog-desc-modal-' + dogInfo.uid + '" class="materialize-textarea"></textarea><label class="active" for="dog-desc-modal-' + dogInfo.uid + '">Description</label></div></div><div id="dog-ligne3-' + dogInfo.uid + '" class="valign-wrapper row"><div class="input-field col s7"><form class="" method="post" enctype="multipart/form-data" action="/panel"><input id="filepath-' + dogInfo.uid + '" type="file" name="animal-pic" /><input type="submit" class="btn"onclick="uploadModifyClick(\'' + dogInfo.uid + '\');" /></form></div><div class="input-field col s3"><input value="' + dogInfo.birthDate + '" id="dog-birthDate-modal-' + dogInfo.uid + '" type="text"><label class="active" for="dog-birthDate-modal-' + dogInfo.uid + '">Date de naissance</label></div><div class="col s2 center-align"><input type="checkbox" id="dog-show-modal-' + dogInfo.uid + '" /><label class="active" for="dog-show-modal-' + dogInfo.uid + '">Affiché</label></div><div class="col s2 center-align"><input type="checkbox" id="dog-adopt-modal-' + dogInfo.uid + '" checked /><label class="active" for="dog-adopt-modal-' + dogInfo.uid + '">Adopté</label></div></div><div class="modal-footer"><a class="btn waves-effect waves-light orange" type="submit" name="action" onclick="modifyclick(\'' + dogInfo.category + '\', \'' + dogInfo.uid + '\');">Modifier<i class="material-icons right">mode_edit</i></a><a class="btn-flat waves-effect waves-light waves-red" onclick="deletedog(\'' + dogInfo.uid + '\', \'' + dogInfo.name + '\');">Supprimer<i class="modal-action modal-close material-icons right">delete</i></a></div></div></div>';
            }
        }
        if (dogInfo.adopt == false) {
            if (dogInfo.onSite == true) {
                collection = '<li class="collection-item avatar" id="collection-' + dogInfo.uid + '"><img src="' + dogInfo.imageURL + '" alt="Photo du chat" class="circle"><span class="title"><b>' + dogInfo.name + ' - N°' + dogInfo.number + ' - Mâle</b></span><p><span class="red-text"><b>Disponible à l\'adoption</b></span><br><span class="green-text"><b>Affiché sur le site</b></span></p><a href="#modal-' + dogInfo.uid + '" class="secondary-content valign-wrapper">Modifier<i class="material-icons">mode_edit</i></a></li>';
                modal = '<div id="modal-' + dogInfo.uid + '" class="modal"><div class="modal-content"><h4>Modification :</h4><div id="dog-line1-' + dogInfo.uid + '" class="valign-wrapper row"><div class="input-field col s3"><input value="' + dogInfo.name + '" id="dog-name-modal-' + dogInfo.uid + '" type="text"><label for="dog-name-modal-' + dogInfo.uid + '" class="active">Nom</label></div><div class="input-field col s3"><input value="' + dogInfo.breed + '" id="dog-breed-modal-' + dogInfo.uid + '" type="text"><label class="active" for="dog-breed-modal-' + dogInfo.uid + '">Race</label></div><div class="input-field col s4"><input value="' + dogInfo.number + '" id="dog-number-modal-' + dogInfo.uid + '" type="text"><label class="active" for="dog-number-modal-' + dogInfo.uid + '">Numéro de tatouage</label></div><div class="switch center-align"><input name="dog-sex-modal" type="radio" id="dog-male-modal-' + dogInfo.uid + '" checked /><label for="dog-male-modal-' + dogInfo.uid + '" class="col s1">Mâle</label></div><div class="switch center-align"><input name="dog-sex-modal" type="radio" id="dog-female-modal-' + dogInfo.uid + '" /><label for="dog-female-modal-' + dogInfo.uid + '" class="col s1">Femelle</label></div><br></div><div id="dog-ligne2-' + dogInfo.uid + '" class="valign-wrapper row"><div class="input-field col s12"><textarea id="dog-desc-modal-' + dogInfo.uid + '" class="materialize-textarea"></textarea><label class="active" for="dog-desc-modal-' + dogInfo.uid + '">Description</label></div></div><div id="dog-ligne3-' + dogInfo.uid + '" class="valign-wrapper row"><div class="input-field col s7"><form class="" method="post" enctype="multipart/form-data" action="/panel"><input id="filepath-' + dogInfo.uid + '" type="file" name="animal-pic" /><input type="submit" class="btn"onclick="uploadModifyClick(\'' + dogInfo.uid + '\');" /></form></div><div class="input-field col s3"><input value="' + dogInfo.birthDate + '" id="dog-birthDate-modal-' + dogInfo.uid + '" type="text"><label class="active" for="dog-birthDate-modal-' + dogInfo.uid + '">Date de naissance</label></div><div class="col s2 center-align"><input type="checkbox" id="dog-show-modal-' + dogInfo.uid + '" checked /><label class="active" for="dog-show-modal-' + dogInfo.uid + '">Affiché</label></div><div class="col s2 center-align"><input type="checkbox" id="dog-adopt-modal-' + dogInfo.uid + '" /><label class="active" for="dog-adopt-modal-' + dogInfo.uid + '">Adopté</label></div></div><div class="modal-footer"><a class="btn waves-effect waves-light orange" type="submit" name="action" onclick="modifyclick(\'' + dogInfo.category + '\', \'' + dogInfo.uid + '\');">Modifier<i class="material-icons right">mode_edit</i></a><a class="btn-flat waves-effect waves-light waves-red" onclick="deletedog(\'' + dogInfo.uid + '\', \'' + dogInfo.name + '\');">Supprimer<i class="modal-action modal-close material-icons right">delete</i></a></div></div></div>';
            }
            if (dogInfo.onSite == false) {
                collection = '<li class="collection-item avatar" id="collection-' + dogInfo.uid + '"><img src="' + dogInfo.imageURL + '" alt="Photo du chat" class="circle"><span class="title"><b>' + dogInfo.name + ' - N°' + dogInfo.number + ' - Mâle</b></span><p><span class="red-text"><b>Masqué sur le site sans avoir été adopté <i class="fa fa-exclamation-triangle"></i></b></span></p><a href="#modal-' + dogInfo.uid + '" class="secondary-content valign-wrapper">Modifier<i class="material-icons">mode_edit</i></a></li>';
                modal = '<div id="modal-' + dogInfo.uid + '" class="modal"><div class="modal-content"><h4>Modification :</h4><div id="dog-line1-' + dogInfo.uid + '" class="valign-wrapper row"><div class="input-field col s3"><input value="' + dogInfo.name + '" id="dog-name-modal-' + dogInfo.uid + '" type="text"><label for="dog-name-modal-' + dogInfo.uid + '" class="active">Nom</label></div><div class="input-field col s3"><input value="' + dogInfo.breed + '" id="dog-breed-modal-' + dogInfo.uid + '" type="text"><label class="active" for="dog-breed-modal-' + dogInfo.uid + '">Race</label></div><div class="input-field col s4"><input value="' + dogInfo.number + '" id="dog-number-modal-' + dogInfo.uid + '" type="text"><label class="active" for="dog-number-modal-' + dogInfo.uid + '">Numéro de tatouage</label></div><div class="switch center-align"><input name="dog-sex-modal" type="radio" id="dog-male-modal-' + dogInfo.uid + '" checked /><label for="dog-male-modal-' + dogInfo.uid + '" class="col s1">Mâle</label></div><div class="switch center-align"><input name="dog-sex-modal" type="radio" id="dog-female-modal-' + dogInfo.uid + '" /><label for="dog-female-modal-' + dogInfo.uid + '" class="col s1">Femelle</label></div><br></div><div id="dog-ligne2-' + dogInfo.uid + '" class="valign-wrapper row"><div class="input-field col s12"><textarea id="dog-desc-modal-' + dogInfo.uid + '" class="materialize-textarea"></textarea><label class="active" for="dog-desc-modal-' + dogInfo.uid + '">Description</label></div></div><div id="dog-ligne3-' + dogInfo.uid + '" class="valign-wrapper row"><div class="input-field col s7"><form class="" method="post" enctype="multipart/form-data" action="/panel"><input id="filepath-' + dogInfo.uid + '" type="file" name="animal-pic" /><input type="submit" class="btn"onclick="uploadModifyClick(\'' + dogInfo.uid + '\');" /></form></div><div class="input-field col s3"><input value="' + dogInfo.birthDate + '" id="dog-birthDate-modal-' + dogInfo.uid + '" type="text"><label class="active" for="dog-birthDate-modal-' + dogInfo.uid + '">Date de naissance</label></div><div class="col s2 center-align"><input type="checkbox" id="dog-show-modal-' + dogInfo.uid + '" /><label class="active" for="dog-show-modal-' + dogInfo.uid + '">Affiché</label></div><div class="col s2 center-align"><input type="checkbox" id="dog-adopt-modal-' + dogInfo.uid + '" /><label class="active" for="dog-adopt-modal-' + dogInfo.uid + '">Adopté</label></div></div><div class="modal-footer"><a class="btn waves-effect waves-light orange" type="submit" name="action" onclick="modifyclick(\'' + dogInfo.category + '\', \'' + dogInfo.uid + '\');">Modifier<i class="material-icons right">mode_edit</i></a><a class="btn-flat waves-effect waves-light waves-red" onclick="deletedog(\'' + dogInfo.uid + '\', \'' + dogInfo.name + '\');">Supprimer<i class="modal-action modal-close material-icons right">delete</i></a></div></div></div>';
            }
        }
    }
    if (dogInfo.sex == 'female') {
        if (dogInfo.adopt == true) {
            if (dogInfo.onSite == true) {
                collection = '<li class="collection-item avatar" id="collection-' + dogInfo.uid + '"><img src="' + dogInfo.imageURL + '" alt="Photo du chat" class="circle"><span class="title"><b>' + dogInfo.name + ' - N°' + dogInfo.number + ' - Femelle</b></span><p><span class="green-text"><b>ADOPTÉE LE xx/xx/xxxx</b></span><br><span class="green-text"><b>Affichée sur le site</b></span></p><a href="#modal-' + dogInfo.uid + '" class="secondary-content valign-wrapper">Modifier<i class="material-icons">mode_edit</i></a></li>';
                modal = '<div id="modal-' + dogInfo.uid + '" class="modal"><div class="modal-content"><h4>Modification :</h4><div id="dog-line1-' + dogInfo.uid + '" class="valign-wrapper row"><div class="input-field col s3"><input value="' + dogInfo.name + '" id="dog-name-modal-' + dogInfo.uid + '" type="text"><label for="dog-name-modal-' + dogInfo.uid + '" class="active">Nom</label></div><div class="input-field col s3"><input value="' + dogInfo.breed + '" id="dog-breed-modal-' + dogInfo.uid + '" type="text"><label class="active" for="dog-breed-modal-' + dogInfo.uid + '">Race</label></div><div class="input-field col s4"><input value="' + dogInfo.number + '" id="dog-number-modal-' + dogInfo.uid + '" type="text"><label class="active" for="dog-number-modal-' + dogInfo.uid + '">Numéro de tatouage</label></div><div class="switch center-align"><input name="dog-sex-modal" type="radio" id="dog-male-modal-' + dogInfo.uid + '" /><label for="dog-male-modal-' + dogInfo.uid + '" class="col s1">Mâle</label></div><div class="switch center-align"><input name="dog-sex-modal" type="radio" id="dog-female-modal-' + dogInfo.uid + '" checked /><label for="dog-female-modal-' + dogInfo.uid + '" class="col s1">Femelle</label></div><br></div><div id="dog-ligne2-' + dogInfo.uid + '" class="valign-wrapper row"><div class="input-field col s12"><textarea id="dog-desc-modal-' + dogInfo.uid + '" class="materialize-textarea"></textarea><label class="active" for="dog-desc-modal-' + dogInfo.uid + '">Description</label></div></div><div id="dog-ligne3-' + dogInfo.uid + '" class="valign-wrapper row"><div class="input-field col s7"><form class="" method="post" enctype="multipart/form-data" action="/panel"><input id="filepath-' + dogInfo.uid + '" type="file" name="animal-pic" /><input type="submit" class="btn"onclick="uploadModifyClick(\'' + dogInfo.uid + '\');" /></form></div><div class="input-field col s3"><input value="' + dogInfo.birthDate + '" id="dog-birthDate-modal-' + dogInfo.uid + '" type="text"><label class="active" for="dog-birthDate-modal-' + dogInfo.uid + '">Date de naissance</label></div><div class="col s2 center-align"><input type="checkbox" id="dog-show-modal-' + dogInfo.uid + '" /><label class="active" for="dog-show-modal-' + dogInfo.uid + '">Affiché</label></div><div class="col s2 center-align"><input type="checkbox" id="dog-adopt-modal-' + dogInfo.uid + '" checked /><label class="active" for="dog-adopt-modal-' + dogInfo.uid + '">Adoptée</label></div></div><div class="modal-footer"><a class="btn waves-effect waves-light orange" type="submit" name="action" onclick="modifyclick(\'' + dogInfo.category + '\', \'' + dogInfo.uid + '\');">Modifier<i class="material-icons right">mode_edit</i></a><a class="btn-flat waves-effect waves-light waves-red" onclick="deletedog(\'' + dogInfo.uid + '\', \'' + dogInfo.name + '\');">Supprimer<i class="modal-action modal-close material-icons right">delete</i></a></div></div></div>';
            }
            if (dogInfo.onSite == false) {
                collection = '<li class="collection-item avatar" id="collection-' + dogInfo.uid + '"><img src="' + dogInfo.imageURL + '" alt="Photo du chat" class="circle"><span class="title"><b>' + dogInfo.name + ' - N°' + dogInfo.number + ' - Femelle</b></span><p><span class="green-text"><b>ADOPTÉE LE xx/xx/xxxx</b></span><br><span class="red-text"><b>Masqué sur le site</i></b></span></p><a href="#modal-' + dogInfo.uid + '" class="secondary-content valign-wrapper">Modifier<i class="material-icons">mode_edit</i></a></li>';
                modal = '<div id="modal-' + dogInfo.uid + '" class="modal"><div class="modal-content"><h4>Modification :</h4><div id="dog-line1-' + dogInfo.uid + '" class="valign-wrapper row"><div class="input-field col s3"><input value="' + dogInfo.name + '" id="dog-name-modal-' + dogInfo.uid + '" type="text"><label for="dog-name-modal-' + dogInfo.uid + '" class="active">Nom</label></div><div class="input-field col s3"><input value="' + dogInfo.breed + '" id="dog-breed-modal-' + dogInfo.uid + '" type="text"><label class="active" for="dog-breed-modal-' + dogInfo.uid + '">Race</label></div><div class="input-field col s4"><input value="' + dogInfo.number + '" id="dog-number-modal-' + dogInfo.uid + '" type="text"><label class="active" for="dog-number-modal-' + dogInfo.uid + '">Numéro de tatouage</label></div><div class="switch center-align"><input name="dog-sex-modal" type="radio" id="dog-male-modal-' + dogInfo.uid + '" /><label for="dog-male-modal-' + dogInfo.uid + '" class="col s1">Mâle</label></div><div class="switch center-align"><input name="dog-sex-modal" type="radio" id="dog-female-modal-' + dogInfo.uid + '" checked /><label for="dog-female-modal-' + dogInfo.uid + '" class="col s1">Femelle</label></div><br></div><div id="dog-ligne2-' + dogInfo.uid + '" class="valign-wrapper row"><div class="input-field col s12"><textarea id="dog-desc-modal-' + dogInfo.uid + '" class="materialize-textarea"></textarea><label class="active" for="dog-desc-modal-' + dogInfo.uid + '">Description</label></div></div><div id="dog-ligne3-' + dogInfo.uid + '" class="valign-wrapper row"><div class="input-field col s7"><form class="" method="post" enctype="multipart/form-data" action="/panel"><input id="filepath-' + dogInfo.uid + '" type="file" name="animal-pic" /><input type="submit" class="btn"onclick="uploadModifyClick(\'' + dogInfo.uid + '\');" /></form></div><div class="input-field col s3"><input value="' + dogInfo.birthDate + '" id="dog-birthDate-modal-' + dogInfo.uid + '" type="text"><label class="active" for="dog-birthDate-modal-' + dogInfo.uid + '">Date de naissance</label></div><div class="col s2 center-align"><input type="checkbox" id="dog-show-modal-' + dogInfo.uid + '" /><label class="active" for="dog-show-modal-' + dogInfo.uid + '">Affiché</label></div><div class="col s2 center-align"><input type="checkbox" id="dog-adopt-modal-' + dogInfo.uid + '" checked /><label class="active" for="dog-adopt-modal-' + dogInfo.uid + '">Adoptée</label></div></div><div class="modal-footer"><a class="btn waves-effect waves-light orange" type="submit" name="action" onclick="modifyclick(\'' + dogInfo.category + '\', \'' + dogInfo.uid + '\');">Modifier<i class="material-icons right">mode_edit</i></a><a class="btn-flat waves-effect waves-light waves-red" onclick="deletedog(\'' + dogInfo.uid + '\', \'' + dogInfo.name + '\');">Supprimer<i class="modal-action modal-close material-icons right">delete</i></a></div></div></div>';
            }
        }
        if (dogInfo.adopt == false) {
            if (dogInfo.onSite == true) {
                collection = '<li class="collection-item avatar" id="collection-' + dogInfo.uid + '"><img src="' + dogInfo.imageURL + '" alt="Photo du chat" class="circle"><span class="title"><b>' + dogInfo.name + ' - N°' + dogInfo.number + ' - Femelle</b></span><p><span class="red-text"><b>Disponible à l\'adoption</b></span><br><span class="green-text"><b>Affichée sur le site</b></span></p><a href="#modal-' + dogInfo.uid + '" class="secondary-content valign-wrapper">Modifier<i class="material-icons">mode_edit</i></a></li>';
                modal = '<div id="modal-' + dogInfo.uid + '" class="modal"><div class="modal-content"><h4>Modification :</h4><div id="dog-line1-' + dogInfo.uid + '" class="valign-wrapper row"><div class="input-field col s3"><input value="' + dogInfo.name + '" id="dog-name-modal-' + dogInfo.uid + '" type="text"><label for="dog-name-modal-' + dogInfo.uid + '" class="active">Nom</label></div><div class="input-field col s3"><input value="' + dogInfo.breed + '" id="dog-breed-modal-' + dogInfo.uid + '" type="text"><label class="active" for="dog-breed-modal-' + dogInfo.uid + '">Race</label></div><div class="input-field col s4"><input value="' + dogInfo.number + '" id="dog-number-modal-' + dogInfo.uid + '" type="text"><label class="active" for="dog-number-modal-' + dogInfo.uid + '">Numéro de tatouage</label></div><div class="switch center-align"><input name="dog-sex-modal" type="radio" id="dog-male-modal-' + dogInfo.uid + '" /><label for="dog-male-modal-' + dogInfo.uid + '" class="col s1">Mâle</label></div><div class="switch center-align"><input name="dog-sex-modal" type="radio" id="dog-female-modal-' + dogInfo.uid + '" checked /><label for="dog-female-modal-' + dogInfo.uid + '" class="col s1">Femelle</label></div><br></div><div id="dog-ligne2-' + dogInfo.uid + '" class="valign-wrapper row"><div class="input-field col s12"><textarea id="dog-desc-modal-' + dogInfo.uid + '" class="materialize-textarea"></textarea><label class="active" for="dog-desc-modal-' + dogInfo.uid + '">Description</label></div></div><div id="dog-ligne3-' + dogInfo.uid + '" class="valign-wrapper row"><div class="input-field col s7"><form class="" method="post" enctype="multipart/form-data" action="/panel"><input id="filepath-' + dogInfo.uid + '" type="file" name="animal-pic" /><input type="submit" class="btn"onclick="uploadModifyClick(\'' + dogInfo.uid + '\');" /></form></div><div class="input-field col s3"><input value="' + dogInfo.birthDate + '" id="dog-birthDate-modal-' + dogInfo.uid + '" type="text"><label class="active" for="dog-birthDate-modal-' + dogInfo.uid + '">Date de naissance</label></div><div class="col s2 center-align"><input type="checkbox" id="dog-show-modal-' + dogInfo.uid + '" /><label class="active" for="dog-show-modal-' + dogInfo.uid + '">Affiché</label></div><div class="col s2 center-align"><input type="checkbox" id="dog-adopt-modal-' + dogInfo.uid + '" /><label class="active" for="dog-adopt-modal-' + dogInfo.uid + '">Adoptée</label></div></div><div class="modal-footer"><a class="btn waves-effect waves-light orange" type="submit" name="action" onclick="modifyclick(\'' + dogInfo.category + '\', \'' + dogInfo.uid + '\');">Modifier<i class="material-icons right">mode_edit</i></a><a class="btn-flat waves-effect waves-light waves-red" onclick="deletedog(\'' + dogInfo.uid + '\', \'' + dogInfo.name + '\');">Supprimer<i class="modal-action modal-close material-icons right">delete</i></a></div></div></div>';
            }
            if (dogInfo.onSite == false) {
                collection = '<li class="collection-item avatar" id="collection-' + dogInfo.uid + '"><img src="' + dogInfo.imageURL + '" alt="Photo du chat" class="circle"><span class="title"><b>' + dogInfo.name + ' - N°' + dogInfo.number + ' - Femelle</b></span><p><span class="red-text"><b>Disponible à l\'adoption</b></span><br><span class="red-text"><b>Masquée sur le site</b></span></p><a href="#modal-' + dogInfo.uid + '" class="secondary-content valign-wrapper">Modifier<i class="material-icons">mode_edit</i></a></li>';
                modal = '<div id="modal-' + dogInfo.uid + '" class="modal"><div class="modal-content"><h4>Modification :</h4><div id="dog-line1-' + dogInfo.uid + '" class="valign-wrapper row"><div class="input-field col s3"><input value="' + dogInfo.name + '" id="dog-name-modal-' + dogInfo.uid + '" type="text"><label for="dog-name-modal-' + dogInfo.uid + '" class="active">Nom</label></div><div class="input-field col s3"><input value="' + dogInfo.breed + '" id="dog-breed-modal-' + dogInfo.uid + '" type="text"><label class="active" for="dog-breed-modal-' + dogInfo.uid + '">Race</label></div><div class="input-field col s4"><input value="' + dogInfo.number + '" id="dog-number-modal-' + dogInfo.uid + '" type="text"><label class="active" for="dog-number-modal-' + dogInfo.uid + '">Numéro de tatouage</label></div><div class="switch center-align"><input name="dog-sex-modal" type="radio" id="dog-male-modal-' + dogInfo.uid + '" /><label for="dog-male-modal-' + dogInfo.uid + '" class="col s1">Mâle</label></div><div class="switch center-align"><input name="dog-sex-modal" type="radio" id="dog-female-modal-' + dogInfo.uid + '" checked /><label for="dog-female-modal-' + dogInfo.uid + '" class="col s1">Femelle</label></div><br></div><div id="dog-ligne2-' + dogInfo.uid + '" class="valign-wrapper row"><div class="input-field col s12"><textarea id="dog-desc-modal-' + dogInfo.uid + '" class="materialize-textarea"></textarea><label class="active" for="dog-desc-modal-' + dogInfo.uid + '">Description</label></div></div><div id="dog-ligne3-' + dogInfo.uid + '" class="valign-wrapper row"><div class="input-field col s7"><form class="" method="post" enctype="multipart/form-data" action="/panel"><input id="filepath-' + dogInfo.uid + '" type="file" name="animal-pic" /><input type="submit" class="btn"onclick="uploadModifyClick(\'' + dogInfo.uid + '\');" /></form></div><div class="input-field col s3"><input value="' + dogInfo.birthDate + '" id="dog-birthDate-modal-' + dogInfo.uid + '" type="text"><label class="active" for="dog-birthDate-modal-' + dogInfo.uid + '">Date de naissance</label></div><div class="col s2 center-align"><input type="checkbox" id="dog-show-modal-' + dogInfo.uid + '" /><label class="active" for="dog-show-modal-' + dogInfo.uid + '">Affiché</label></div><div class="col s2 center-align"><input type="checkbox" id="dog-adopt-modal-' + dogInfo.uid + '" /><label class="active" for="dog-adopt-modal-' + dogInfo.uid + '">Adoptée</label></div></div><div class="modal-footer"><a class="btn waves-effect waves-light orange" type="submit" name="action" onclick="modifyclick(\'' + dogInfo.category + '\', \'' + dogInfo.uid + '\');">Modifier<i class="material-icons right">mode_edit</i></a><a class="btn-flat waves-effect waves-light waves-red" onclick="deletedog(\'' + dogInfo.uid + '\', \'' + dogInfo.name + '\');">Supprimer<i class="modal-action modal-close material-icons right">delete</i></a></div></div></div>';
            }
        }
    }

    $('#dog-collection').prepend(collection);
    $('#dog-panel-modals').prepend(modal);
    $('#dog-desc-modal-' + dogInfo.uid).val(dogInfo.description);
    $('.modal').modal();
}

$('#btn-add-cat-submit').click(function() {
    if ($('#cat-breed').val() == '' || $('#cat-number').val() == '' || $('#cat-desc').val() == '' || $('#cat-birthDate').val() == '' || $('#cat-name').val() == '')
        return Materialize.toast('ERREUR ! Un des champs n\'a pas été renseigné <i class="fa fa-exclamation-triangle"></i>', 5000, 'red');

    if (document.getElementById('cat-male').checked == false && document.getElementById('cat-female').checked == false)
        return Materialize.toast('ERREUR ! Un des champs n\'a pas été renseigné <i class="fa fa-exclamation-triangle"></i>', 5000, 'red');

    var sex,
        formatSex,
        id = uidUsed,
        ext,
        name = $('#filepathcat').val().split('\\').pop();
    ext = name.substr(name.indexOf('.'), name.length);

    name = name.substring(name[0], name.indexOf('.'));
    name = name.replace(/\s+/g, '-').toLowerCase();

    if (document.getElementById('cat-male').checked == true) {
        sex = 'male';
        formatSex = '<i class="fa fa-mars blue-text"></i>';
    }
    if (document.getElementById('cat-female').checked == true) {
        sex = 'female';
        formatSex = '<i class="fa fa-venus pink-text"></i>';
    }

    var info = {
        'category': 'cat',
        'name': $('#cat-name').val(),
        'imageURL': 'uploads/' + name + '-' + id + ext,
        'birthDate': $('#cat-birthDate').val(),
        'description': $('#cat-desc').val(),
        'number': $('#cat-number').val(),
        'sex': sex,
        'formatSex': formatSex,
        'breed': $('#cat-breed').val(),
        'adopt': document.getElementById('cat-adopt').checked,
        'adoptDate': null,
        'onSite': true,
        'uid': id,
        'clickOnModal': 0
    };

    socket.emit('addPet', info, false, ip);
    socket.emit('increuid', ip);

    $('#cat-name').val('');
    $('#cat-birthDate').val('');
    $('#cat-desc').val('');
    $('#cat-number').val('');
    $('#cat-breed').val('');
    document.getElementById("filepathcat").value = "";
    $("#cat-female").prop('checked', false);
    $("#cat-male").prop('checked', false);

    if (info.sex == 'male')
        Materialize.toast(info.name + ' à été ajouté dans la base de données <i class="fa fa-check"></i>', 5000, 'green');
    if (info.sex == 'female')
        Materialize.toast(info.name + ' à été ajoutée dans la base de données <i class="fa fa-check"></i>', 5000, 'green');
    if (document.getElementById('cat-adopt').checked == true)
        $("#cat-adopt").prop('checked', false);
});

$('#btn-add-dog-submit').click(function() {
    if ($('#dog-breed').val() == '' || $('#dog-number').val() == '' || $('#dog-desc').val() == '' || $('#dog-birthDate').val() == '' || $('#dog-name').val() == '')
        return Materialize.toast('ERREUR ! Un des champs n\'a pas été renseigné <i class="fa fa-exclamation-triangle"></i>', 5000, 'red');

    var sex,
        formatSex,
        id = uidUsed,
        ext,
        name = $('#filepathdog').val().split('\\').pop();
    ext = name.substr(name.indexOf('.'), name.length);

    name = name.substring(name[0], name.indexOf('.'));
    name = name.replace(/\s+/g, '-').toLowerCase();

    if (document.getElementById('dog-male').checked == true) {
        sex = 'male';
        formatSex = '<i class="fa fa-mars blue-text"></i>';
    }
    if (document.getElementById('dog-female').checked == true) {
        sex = 'female';
        formatSex = '<i class="fa fa-venus pink-text"></i>';
    }

    var info = {
        'category': 'dog',
        'name': $('#dog-name').val(),
        'imageURL': 'uploads/' + name + '-' + id + ext,
        'birthDate': $('#dog-birthDate').val(),
        'description': $('#dog-desc').val(),
        'number': $('#dog-number').val(),
        'sex': sex,
        'formatSex': formatSex,
        'breed': $('#dog-breed').val(),
        'adopt': document.getElementById('dog-adopt').checked,
        'adoptDate': null,
        'onSite': true,
        'uid': id
    };

    socket.emit('addPet', info);
    socket.emit('increuid');

    $('#dog-name').val('');
    $('#dog-birthDate').val('');
    $('#dog-desc').val('');
    $('#dog-number').val('');
    $('#dog-breed').val('');
    document.getElementById("filepathdog").value = "";
    $("#dog-female").prop('checked', false);
    $("#dog-male").prop('checked', false);

    if (info.sex == 'male')
        Materialize.toast(info.name + ' à été ajouté dans la base de données <i class="fa fa-check"></i>', 5000, 'green');
    if (info.sex == 'female')
        Materialize.toast(info.name + ' à été ajoutée dans la base de données <i class="fa fa-check"></i>', 5000, 'green');
    if (document.getElementById('dog-adopt').checked == true)
        $("#dog-adopt").prop('checked', false);
});

// pour parceadopt date var array = "12/2015".split("/").map(Number); retrun [12, 2015];

function modifyclick(category, id) { // bugé si on veut réédit sans reload la page
    socket.emit('getDB', category, id);

    var oldInfo;

    socket.on('recevingDB', function(info) {
        oldInfo = info;
        var sex,
            formatSex,
            ext,
            name = $('#filepath-' + id).val().split('\\').pop();
        ext = name.substr(name.indexOf('.'), name.length);

        name = name.substring(name[0], name.indexOf('.'));
        name = name.replace(/\s+/g, '-').toLowerCase();

        if (document.getElementById(category + '-male-modal-' + id).checked == true) {
            sex = 'male';
            formatSex = '<i class="fa fa-mars blue-text"></i>';
        }
        if (document.getElementById(category + '-female-modal-' + id).checked == true) {
            sex = 'female';
            formatSex = '<i class="fa fa-venus pink-text"></i>';
        }

        function checkModifyPhoto(id) {
            if ($('#filepath-' + id).val() == '')
                return oldInfo.imageURL;
            else
                return 'uploads/' + name + '-' + id + ext;
        }

        var newInfo = {
            'category': category,
            'name': $('#' + category + '-name-modal-' + id).val(),
            'imageURL': checkModifyPhoto(id),
            'birthDate': $('#' + category + '-birthDate-modal-' + id).val(),
            'description': $('#' + category + '-desc-modal-' + id).val(),
            'number': $('#' + category + '-number-modal-' + id).val(),
            'sex': sex,
            'formatSex': formatSex,
            'breed': $('#' + category + '-breed-modal-' + id).val(),
            'adopt': document.getElementById(category + '-adopt-modal-' + id).checked,
            'adoptDate': null,
            'onSite': document.getElementById(category + '-show-modal-' + id).checked,
            'uid': id
        };

        $('#modal-0').modal('close');
        socket.emit('addPet', newInfo, true, ip);
    });
}

$('#console-send').click(function() {
    var consoleMod;
    if (document.getElementById('debug').checked == true) {
        consoleMod = 'debug';
        socket.emit('changeConsoleMod', consoleMod);
        Materialize.toast('Console mod successfully changed to debug', 5000);
    }
    if (document.getElementById('normal').checked == true) {
        consoleMod = 'normal';
        socket.emit('changeConsoleMod', consoleMod);
        Materialize.toast('Console mod successfully changed to normal', 5000);
    }
});

function deletecat(uid, name) {
    $('#modal-' + uid).modal('close');
    var type = 'cat';
    socket.emit('removePet', uid, name, type, ip);
    $('#modal-' + uid).remove();
    $('#collection-' + uid).remove();
}

function deletedog(uid, name) {
    $('#modal-' + uid).modal('close');
    var type = 'dog';
    socket.emit('removePet', uid, name, type, ip);
    $('#modal-' + uid).remove();
    $('#collection-' + uid).remove();
}

$('#btn-add-cat-previsu').click(function() {
    if ($('#cat-breed').val() == '' || $('#cat-number').val() == '' || $('#cat-desc').val() == '' || $('#cat-birthDate').val() == '' || $('#cat-name').val() == '')
        return Materialize.toast('ERREUR ! Un des champs n\'a pas été renseigné <i class="fa fa-exclamation-triangle"></i>', 5000, 'red');

    if (document.getElementById('cat-male').checked == false && document.getElementById('cat-female').checked == false)
        return Materialize.toast('ERREUR ! Un des champs n\'a pas été renseigné <i class="fa fa-exclamation-triangle"></i>', 5000, 'red');

    var sex,
        formatSex,
        id = uidUsed,
        ext,
        name = $('#filepathcat').val().split('\\').pop();
    ext = name.substr(name.indexOf('.'), name.length);

    name = name.substring(name[0], name.indexOf('.'));
    name = name.replace(/\s+/g, '-').toLowerCase();

    if (document.getElementById('cat-male').checked == true) {
        sex = 'male';
        formatSex = '<i class="fa fa-mars blue-text"></i>';
    }
    if (document.getElementById('cat-female').checked == true) {
        sex = 'female';
        formatSex = '<i class="fa fa-venus pink-text"></i>';
    }

    var info = {
        'category': 'cat',
        'name': $('#cat-name').val(),
        'imageURL': 'uploads/' + name + '-' + id + ext,
        'birthDate': $('#cat-birthDate').val(),
        'description': $('#cat-desc').val(),
        'number': $('#cat-number').val(),
        'sex': sex,
        'formatSex': formatSex,
        'breed': $('#cat-breed').val(),
        'adopt': document.getElementById('cat-adopt').checked,
        'adoptDate': null,
        'onSite': true,
        'uid': id,
        'clickOnModal': 0
    };

    var previsuCard,
        previsuModal;

    if (info.adopt == true) {
        if (info.sex == 'male') {
            previsuCard = '<div id="card-div-cat" class="modal col s3"><div id="' + info.uid + '" class="card hoverable scale-transition"><div class="card-image"><img id ="cardImage" src="' + info.imageURL + '"><span class="card-title red-text text-accent-3"><b>ADOPTÉ</b></span><a href="#cat-modal" class="btn-floating halfway-fab waves-effect waves-light blue"><i class="material-icons">info_outline</i></a></div><div class="card-content"><p class="center-align"><b>' + info.name + info.formatSex + '<br>' + info.birthDate + '</b></p></div><div></div>';
            previsuModal = '<div id="cat-modal" class="modal"><div id="card-' + info.number + '" class="col s12 m7"><div class="card horizontal"><div class="card-image"><img src="' + info.imageURL + '"></div><div id="card-previsu" class="card-stacked"><div class="card-content"><h4>' + info.name + '</h4><p><b>Né en ' + info.birthDate + ' - Mâle' + info.formatSex + ' - ' + info.breed + '</b></p><br><p>' + info.description + '</p><br><p id="cat-modal-view">Vue...</p><br><p><b>N°' + info.number + '</b></p><h4 class="red-text accent-4"><b>ADOPTÉ</b></h4></div></div></div></div></div>';
        }
        if (info.sex == 'female') {
            previsuCard = '<div id="card-div-cat" class="modal col s3"><div id="' + info.uid + '" class="card hoverable scale-transition"><div class="card-image"><img id ="cardImage" src="' + info.imageURL + '"><span class="card-title red-text text-accent-3"><b>ADOPTÉE</b></span><a href="#cat-modal" class="btn-floating halfway-fab waves-effect waves-light blue"><i class="material-icons">info_outline</i></a></div><div class="card-content"><p class="center-align"><b>' + info.name + ' ' + info.formatSex + '<br>' + info.birthDate + '</b></p></div><div></div>';
            previsuModal = '<div id="cat-modal" class="modal"><div id="card-previsu" class="col s12 m7"><div class="card horizontal"><div class="card-image"><img src="' + info.imageURL + '"></div><div class="card-stacked"><div class="card-content"><h4>' + info.name + '</h4><p><b>Né en ' + info.birthDate + ' - Femelle' + info.formatSex + ' - ' + info.breed + '</b></p><br><p>' + info.description + '</p><br><p id="cat-modal-view">Vue...</p><br><p><b>N°' + info.number + '</b></p><h4 class="red-text accent-4"><b>ADOPTÉE</b></h4></div></div></div></div></div>';
        }
    }
    if (info.adopt == false) {
        if (info.sex == 'male') {
            previsuCard = '<div id="card-div-cat" class="modal col s3"><div id="' + info.uid + '" class="card hoverable scale-transition"><div class="card-image"><img id ="cardImage" src="' + info.imageURL + '"><a href="#cat-modal" class="btn-floating halfway-fab waves-effect waves-light blue"><i class="material-icons">info_outline</i></a></div><div class="card-content"><p class="center-align"><b>' + info.name + ' ' + info.formatSex + '<br>' + info.birthDate + '</b></p></div><div></div>';
            previsuModal = '<div id="cat-modal" class="modal"><div id="card-previsu" class="col s12 m7"><div class="card horizontal"><div class="card-image"><img src="' + info.imageURL + '"></div><div class="card-stacked"><div class="card-content"><h4>' + info.name + '</h4><p><b>Né en ' + info.birthDate + ' - ' + info.formatSex + ' - ' + info.breed + '</b></p><br><p>' + info.description + '</p><br><p id="cat-modal-view">Vue...</p><br><p><b>N°' + info.number + '</b></p></div></div></div></div></div>';
        }
        if (info.sex == 'female') {
            previsuCard = '<div id="card-div-cat" class="modal col s3"><div id="' + info.uid + '" class="card hoverable scale-transition"><div class="card-image"><img id ="cardImage" src="' + info.imageURL + '"><a href="#cat-modal" class="btn-floating halfway-fab waves-effect waves-light blue"><i class="material-icons">info_outline</i></a></div><div class="card-content"><p class="center-align"><b>' + info.name + ' ' + info.formatSex + '<br>' + info.birthDate + '</b></p></div><div></div>';
            previsuModal = '<div id="cat-modal" class="modal"><div id="card-previsu" class="col s12 m7"><div class="card horizontal"><div class="card-image"><img src="' + info.imageURL + '"></div><div class="card-stacked"><div class="card-content"><h4>' + info.name + '</h4><p><b>Né en ' + info.birthDate + ' - ' + info.formatSex + ' - ' + info.breed + '</b></p><br><p>' + info.description + '</p><br><p id="cat-modal-view">Vue...</p><br><p><b>N°' + info.number + '</b></p></div></div></div></div></div>';
        }
    }
    $('#previsu-modal').prepend(previsuCard);
    $('#modal-previsu-modal').prepend(previsuModal);
    $('.modal').modal();
    $('#card-div-cat').modal('open');
});

$('#btn-add-dog-previsu').click(function() {
    if ($('#dog-breed').val() == '' || $('#dog-number').val() == '' || $('#dog-desc').val() == '' || $('#dog-birthDate').val() == '' || $('#dog-name').val() == '')
        return Materialize.toast('ERREUR ! Un des champs n\'a pas été renseigné <i class="fa fa-exclamation-triangle"></i>', 5000, 'red');

    if (document.getElementById('dog-male').checked == false && document.getElementById('dog-female').checked == false)
        return Materialize.toast('ERREUR ! Un des champs n\'a pas été renseigné <i class="fa fa-exclamation-triangle"></i>', 5000, 'red');

    var sex,
        formatSex,
        id = uidUsed,
        ext,
        name = $('#filepathdog').val().split('\\').pop();
    ext = name.substr(name.indexOf('.'), name.length);

    name = name.substring(name[0], name.indexOf('.'));
    name = name.replace(/\s+/g, '-').toLowerCase();

    if (document.getElementById('dog-male').checked == true) {
        sex = 'male';
        formatSex = '<i class="fa fa-mars blue-text"></i>';
    }
    if (document.getElementById('dog-female').checked == true) {
        sex = 'female';
        formatSex = '<i class="fa fa-venus pink-text"></i>';
    }

    var info = {
        'category': 'dog',
        'name': $('#dog-name').val(),
        'imageURL': 'uploads/' + name + '-' + id + ext,
        'birthDate': $('#dog-birthDate').val(),
        'description': $('#dog-desc').val(),
        'number': $('#dog-number').val(),
        'sex': sex,
        'formatSex': formatSex,
        'breed': $('#dog-breed').val(),
        'adopt': document.getElementById('dog-adopt').checked,
        'adoptDate': null,
        'onSite': true,
        'uid': id,
        'clickOnModal': 0
    };

    var previsuCard,
        previsuModal;

    if (info.adopt == true) {
        if (info.sex == 'male') {
            previsuCard = '<div id="card-div-dog" class="modal col s3"><div id="' + info.uid + '" class="card hoverable scale-transition"><div class="card-image"><img id ="cardImage" src="' + info.imageURL + '"><span class="card-title red-text text-accent-3"><b>ADOPTÉ</b></span><a href="#dog-modal" class="btn-floating halfway-fab waves-effect waves-light blue"><i class="material-icons">info_outline</i></a></div><div class="card-content"><p class="center-align"><b>' + info.name + info.formatSex + '<br>' + info.birthDate + '</b></p></div><div></div>';
            previsuModal = '<div id="dog-modal" class="modal"><div id="card-' + info.number + '" class="col s12 m7"><div class="card horizontal"><div class="card-image"><img src="' + info.imageURL + '"></div><div id="card-previsu" class="card-stacked"><div class="card-content"><h4>' + info.name + '</h4><p><b>Né en ' + info.birthDate + ' - Mâle' + info.formatSex + ' - ' + info.breed + '</b></p><br><p>' + info.description + '</p><br><p id="dog-modal-view">Vue...</p><br><p><b>N°' + info.number + '</b></p><h4 class="red-text accent-4"><b>ADOPTÉ</b></h4></div></div></div></div></div>';
        }
        if (info.sex == 'female') {
            previsuCard = '<div id="card-div-dog" class="modal col s3"><div id="' + info.uid + '" class="card hoverable scale-transition"><div class="card-image"><img id ="cardImage" src="' + info.imageURL + '"><span class="card-title red-text text-accent-3"><b>ADOPTÉE</b></span><a href="#dog-modal" class="btn-floating halfway-fab waves-effect waves-light blue"><i class="material-icons">info_outline</i></a></div><div class="card-content"><p class="center-align"><b>' + info.name + ' ' + info.formatSex + '<br>' + info.birthDate + '</b></p></div><div></div>';
            previsuModal = '<div id="dog-modal" class="modal"><div id="card-previsu" class="col s12 m7"><div class="card horizontal"><div class="card-image"><img src="' + info.imageURL + '"></div><div class="card-stacked"><div class="card-content"><h4>' + info.name + '</h4><p><b>Né en ' + info.birthDate + ' - Femelle' + info.formatSex + ' - ' + info.breed + '</b></p><br><p>' + info.description + '</p><br><p id="dog-modal-view">Vue...</p><br><p><b>N°' + info.number + '</b></p><h4 class="red-text accent-4"><b>ADOPTÉE</b></h4></div></div></div></div></div>';
        }
    }
    if (info.adopt == false) {
        if (info.sex == 'male') {
            previsuCard = '<div id="card-div-dog" class="modal col s3"><div id="' + info.uid + '" class="card hoverable scale-transition"><div class="card-image"><img id ="cardImage" src="' + info.imageURL + '"><a href="#dog-modal" class="btn-floating halfway-fab waves-effect waves-light blue"><i class="material-icons">info_outline</i></a></div><div class="card-content"><p class="center-align"><b>' + info.name + ' ' + info.formatSex + '<br>' + info.birthDate + '</b></p></div><div></div>';
            previsuModal = '<div id="dog-modal" class="modal"><div id="card-previsu" class="col s12 m7"><div class="card horizontal"><div class="card-image"><img src="' + info.imageURL + '"></div><div class="card-stacked"><div class="card-content"><h4>' + info.name + '</h4><p><b>Né en ' + info.birthDate + ' - ' + info.formatSex + ' - ' + info.breed + '</b></p><br><p>' + info.description + '</p><br><p id="dog-modal-view">Vue...</p><br><p><b>N°' + info.number + '</b></p></div></div></div></div></div>';
        }
        if (info.sex == 'female') {
            previsuCard = '<div id="card-div-dog" class="modal col s3"><div id="' + info.uid + '" class="card hoverable scale-transition"><div class="card-image"><img id ="cardImage" src="' + info.imageURL + '"><a href="#dog-modal" class="btn-floating halfway-fab waves-effect waves-light blue"><i class="material-icons">info_outline</i></a></div><div class="card-content"><p class="center-align"><b>' + info.name + ' ' + info.formatSex + '<br>' + info.birthDate + '</b></p></div><div></div>';
            previsuModal = '<div id="dog-modal" class="modal"><div id="card-previsu" class="col s12 m7"><div class="card horizontal"><div class="card-image"><img src="' + info.imageURL + '"></div><div class="card-stacked"><div class="card-content"><h4>' + info.name + '</h4><p><b>Né en ' + info.birthDate + ' - ' + info.formatSex + ' - ' + info.breed + '</b></p><br><p>' + info.description + '</p><br><p id="dog-modal-view">Vue...</p><br><p><b>N°' + info.number + '</b></p></div></div></div></div></div>';
        }
    }
    $('#previsu-modal').prepend(previsuCard);
    $('#modal-previsu-modal').prepend(previsuModal);
    $('.modal').modal();
    $('#card-div-dog').modal('open');
});

// SOCKET

socket.on('connect', function() {
    socket.emit('userLogToPanel', ip);
    console.info('Successfully connected to server.');
});

socket.on('senduid', function(uidToSend) {
    uidUsed = uidToSend;
});

socket.on('init-after-load', function() {
    $('.button-collapse').sideNav();
    $('.modal').modal();
});

socket.on('consoleEntry', function(text) {
    $('#console').prepend(text);
});

socket.on('get-panel', function(dogInfo, catInfo) {
    if (!alreadyConnected) {
        $.each(dogInfo, function(i, dog) {
            addDogInPanel(dog);
        });
        $.each(catInfo, function(i, cat) {
            addCatInPanel(cat);
        });
        $('#progressLogo').remove();
        alreadyConnected = true;
        return;
    }
    console.warn('The connection between you and the server was interrupted. This error was handled by the server.');
});

socket.on('addCollcat', function(info) {
    addCatInPanel(info);
});

socket.on('addColldog', function(info) {
    addDogInPanel(info);
});

socket.on('removeColl', function(uid) {
    $('#collection-' + uid).remove();
});

socket.on('getTypeLog', function(typeLog) {
    if (typeLog == 'debug')
        document.getElementById('debug').checked = true;
    if (typeLog == 'normal')
        document.getElementById('normal').checked = true;
});

socket.on('getUserOnSite', function(userOnSite) {
    console.log('User actually on site : ' + userOnSite);
});

socket.on('simpleToast', function(clientOrAdmin, text, classs, time) {
    if (clientOrAdmin == 'admin')
        Materialize.toast(text, time, classs);
});

socket.on('onUploadComplete', function(filename) {
    Materialize.toast('Le fichier ' + filename + ' a bien été envoyé', 5000, 'green');
    if ($('#tab-cat').hasClass('active'))
        $('#btn-add-cat-submit').removeClass('disabled');
    if ($('#tab-dog').hasClass('active'))
        $('#btn-add-dog-submit').removeClass('disabled');
});
