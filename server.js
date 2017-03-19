const _PORT = process.env.PORT || 3000;

var fs = require('fs'),
    path = require('path');

var multer = require('multer'),
    storage = multer.diskStorage({
        destination: function(req, file, callback) {
            callback(null, './uploads');
        },
        filename: function(req, file, callback) {
            var name = file.originalname;
            name = name.substring(name[0], name.indexOf('.'));
            name = name.replace(/\s+/g, '-').toLowerCase();

            callback(null, name + '-' + uploadId() + path.extname(file.originalname));
        }
    });

var auth = require('http-auth'),
    express = require('express'),
    app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io')(server);

var basic = auth.basic({
    realm: "Refuge Panel",
    file: __dirname + "/panel.htpasswd"
});

var JsonDB = require('node-json-db'),
    db = new JsonDB("db/refuge", true, false);

var moment = require('moment'),
    colors = require('colors'),
    ip = require('ip'),
    logFileName,
    userID = 0,
    currentMode = 'normal',
    userOnSite = 0;

app.use('/', express.static(__dirname + '/web/index.html'));
app.use('/css', express.static(__dirname + '/web/css/'));
app.use('/js', express.static(__dirname + '/web/js/'));
app.use('/views', express.static(__dirname + '/web/views'));
app.use('/img', express.static(__dirname + '/web/img'));
app.use('/DB', express.static(__dirname + '/DB'));
app.use('/panel/js', express.static(__dirname + '/web-panel/js/'));
app.use('/uploads', express.static(__dirname + '/uploads/'));

app.get('/', (req, res) => {
    res.sendFile('web/index.html', {
        root: __dirname
    });
});
app.get('/panel', auth.connect(basic), (req, res) => {
    res.sendFile('web-panel/index.html', {
        root: __dirname
    });
});

app.post('/panel', function(req, res) { // event serveur quand on clique sur le boutton d'upload
    parseConsole('Upload Starting', 'receving', 'normal', undefined, true);
    io.emit('simpleToast', 'admin', 'Envois du fichier en cours... Veuillez patienter', 'orange', 3000);

    var filename;

    var upload = multer({
        storage: storage
    }).single('animal-pic');

    upload(req, res, function(err) { // event de fin d'upload

        if (req.file == undefined) { // check si un fichier à été selectioné
            parseConsole('Upload fail', 'error', 'normal', undefined, true);
            io.emit('simpleToast', 'admin', 'Echec de l\'envois du ficher (aucun fichier selectioné)<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>', 'red', 10000);
            return res.status(204).end(); // ferme l'upload
        }

        if (err) console.error(err);
        filename = req.file.originalname;
        parseConsole('Upload complete', 'succes', 'normal', undefined, true);
        io.emit('onUploadComplete', filename);
        res.status(204).end(); // ferme l'upload
    });
});

server.listen(_PORT, function() { // quand le serveur démmare
    moment.locale('fr');
    logInit();
    return parseConsole('Server up at ' + ip.address() + ':' + _PORT, 'succes', 'normal', 'server');
});

process.on('SIGINT', function() { // quand le serveur se fait stop par un ctrl+c MARCHE SEULEMENT SOUS LINUX
    parseConsole('Server stoped by console', 'error', 'normal', 'server', false);
    process.exit(); // à ne pas enlever, ça kill le process
});

function logInit() {
    logFileName = 'log_' + moment().format('YYYY-MM-DD_HH-mm');
    var stream = fs.createWriteStream('logs/' + logFileName + '.txt');

    stream.once('open', function(fd) {
        stream.write('=== Création du fichier log le ' + moment().format('dddd d MMM YYYY') + ' à ' + moment().format('HH:mm:ss') + ' ===');
        stream.end();
    });
}

// PARSE CONSOLE

function parseConsole(text, type, mode, id, panel) {
    function sendingToPanelConsole(formatText) {
        formatText = '<span>' + formatText + '</span><br>';
        io.emit('consoleEntry', formatText);
    }

    function consoleWrite(text, type, id) {
        if (panel)
            switch (type) {
                case 'succes':
                    sendingToPanelConsole('[' + moment().format('HH:mm:ss') + '] <span class="bgBlue">PANEL</span> | <span class="inverse">' + id + '</span> | <span class="bgGreen">' + text + '</span>');
                    console.log('[' + moment().format('HH:mm:ss') + '] ' + colors.bgBlue('PANEL') + ' | ' + colors.inverse(id) + ' | ' + colors.bgGreen(text));
                    break;

                case 'ok':
                    sendingToPanelConsole('[' + moment().format('HH:mm:ss') + '] <span class="bgBlue">PANEL</span> | <span class="inverse">' + id + '</span> | <span class="green">' + text + '</span>');
                    console.log('[' + moment().format('HH:mm:ss') + '] ' + colors.bgBlue('PANEL') + ' | ' + colors.inverse(id) + ' | ' + colors.green(text));
                    break;

                case 'sending':
                    sendingToPanelConsole('[' + moment().format('HH:mm:ss') + '] <span class="bgBlue">PANEL</span> | <span class="inverse">' + id + '</span> | <span class="yellow">' + text + '</span>');
                    console.log('[' + moment().format('HH:mm:ss') + '] ' + colors.bgBlue('PANEL') + ' | ' + colors.inverse(id) + ' | ' + colors.yellow(text));
                    break;

                case 'local':
                    sendingToPanelConsole('[' + moment().format('HH:mm:ss') + '] <span class="bgBlue">PANEL</span> | <span class="inverse">' + id + '</span> | <span class="cyan">' + text + '</span>');
                    console.log('[' + moment().format('HH:mm:ss') + '] ' + colors.bgBlue('PANEL') + ' | ' + colors.inverse(id) + ' | ' + colors.cyan(text));
                    break;

                case 'receving':
                    sendingToPanelConsole('[' + moment().format('HH:mm:ss') + '] <span class="bgBlue">PANEL</span> | <span class="inverse">' + id + '</span> | ' + text);
                    console.log('[' + moment().format('HH:mm:ss') + '] ' + colors.bgBlue('PANEL') + ' | ' + colors.inverse(id) + ' | ' + text);
                    break;

                case 'bad':
                    sendingToPanelConsole('[' + moment().format('HH:mm:ss') + '] <span class="bgBlue">PANEL</span> | <span class="inverse">' + id + '</span> | <span class="red">' + text + '</span>');
                    console.log('[' + moment().format('HH:mm:ss') + '] ' + colors.bgBlue('PANEL') + ' | ' + colors.inverse(id) + ' | ' + colors.red(text));
                    break;

                case 'error':
                    sendingToPanelConsole('[' + moment().format('HH:mm:ss') + '] <span class="bgBlue">PANEL</span> | <span class="inverse">ERR ! ' + id + '</span> | <span class="bgRed">ERR! ' + text + '</span>');
                    console.log('[' + moment().format('HH:mm:ss') + '] ' + colors.bgBlue('PANEL') + ' | ' + colors.inverse(id) + ' | ' + colors.bgRed('ERR! ' + text));
                    break;

                default:
                    sendingToPanelConsole('[' + moment().format('HH:mm:ss') + '] <span class="bgBlue">PANEL</span> | <span class="inverse">' + id + '</span> | ' + text);
                    console.log('[' + moment().format('HH:mm:ss') + '] ' + colors.bgBlue('PANEL') + ' | ' + colors.inverse(id) + ' | ' + colors.inverse(id) + ' | ' + text);
                    break;
            }
        if (id == 'server')
            switch (type) {
                case 'succes':
                    sendingToPanelConsole('[' + moment().format('HH:mm:ss') + '] <span class="bgGreen">' + text + '</span>');
                    console.log('[' + moment().format('HH:mm:ss') + '] ' + colors.bgGreen(text));
                    break;

                case 'ok':
                    sendingToPanelConsole('[' + moment().format('HH:mm:ss') + '] <span class="green">' + text + '</span>');
                    console.log('[' + moment().format('HH:mm:ss') + '] ' + colors.green(text));
                    break;

                case 'sending':
                    sendingToPanelConsole('[' + moment().format('HH:mm:ss') + '] <span class="yellow">' + text + '</span>');
                    console.log('[' + moment().format('HH:mm:ss') + '] ' + colors.yellow(text));
                    break;

                case 'local':
                    sendingToPanelConsole('[' + moment().format('HH:mm:ss') + '] <span class="cyan">' + text + '</span>');
                    console.log('[' + moment().format('HH:mm:ss') + '] ' + colors.cyan(text));
                    break;

                case 'receving':
                    sendingToPanelConsole('[' + moment().format('HH:mm:ss') + '] ' + text);
                    console.log('[' + moment().format('HH:mm:ss') + '] ' + text);
                    break;

                case 'bad':
                    sendingToPanelConsole('[' + moment().format('HH:mm:ss') + '] <span class="red">' + text + '</span>');
                    console.log('[' + moment().format('HH:mm:ss') + '] ' + colors.red(text));
                    break;

                case 'error':
                    sendingToPanelConsole('[' + moment().format('HH:mm:ss') + '] <span class="bgRed">ERR ! ' + text + '</span>');
                    console.log('[' + moment().format('HH:mm:ss') + '] ' + colors.bgRed('ERR! ' + text));
                    break;

                default:
                    sendingToPanelConsole('[' + moment().format('HH:mm:ss') + '] ' + text);
                    console.log('[' + moment().format('HH:mm:ss') + '] ' + colors.inverse(id) + ' | ' + text);
                    break;
            }
        if (id != 'server' && panel != true) {
            switch (type) {
                case 'succes':
                    sendingToPanelConsole('[' + moment().format('HH:mm:ss') + '] <span class="inverse">' + id + '</span> | <span class="bgGreen">' + text + '</span>');
                    console.log('[' + moment().format('HH:mm:ss') + '] ' + colors.inverse(id) + ' | ' + colors.bgGreen(text));
                    break;

                case 'ok':
                    sendingToPanelConsole('[' + moment().format('HH:mm:ss') + '] <span class="inverse">' + id + '</span> | <span class="green">' + text + '</span>');
                    console.log('[' + moment().format('HH:mm:ss') + '] ' + colors.inverse(id) + ' | ' + colors.green(text));
                    break;

                case 'sending':
                    sendingToPanelConsole('[' + moment().format('HH:mm:ss') + '] <span class="inverse">' + id + '</span> | <span class="yellow">' + text + '</span>');
                    console.log('[' + moment().format('HH:mm:ss') + '] ' + colors.inverse(id) + ' | ' + colors.yellow(text));
                    break;

                case 'local':
                    sendingToPanelConsole('[' + moment().format('HH:mm:ss') + '] <span class="inverse">' + id + '</span> | <span class="cyan">' + text + '</span>');
                    console.log('[' + moment().format('HH:mm:ss') + '] ' + colors.inverse(id) + ' | ' + colors.cyan(text));
                    break;

                case 'receving':
                    sendingToPanelConsole('[' + moment().format('HH:mm:ss') + '] <span class="inverse">' + id + '</span> | ' + text);
                    console.log('[' + moment().format('HH:mm:ss') + '] ' + colors.inverse(id) + ' | ' + text);
                    break;

                case 'bad':
                    sendingToPanelConsole('[' + moment().format('HH:mm:ss') + '] <span class="inverse">' + id + '</span> | <span class="red">' + text + '</span>');
                    console.log('[' + moment().format('HH:mm:ss') + '] ' + colors.inverse(id) + ' | ' + colors.red(text));
                    break;

                case 'error':
                    sendingToPanelConsole('[' + moment().format('HH:mm:ss') + '] <span class="inverse">' + id + '</span> | <span class="bgRed">ERR ! ' + text + '</span>');
                    console.log('[' + moment().format('HH:mm:ss') + '] ' + colors.inverse(id) + ' | ' + colors.bgRed('ERR! ' + text));
                    break;

                default:
                    sendingToPanelConsole('[' + moment().format('HH:mm:ss') + '] <span class="inverse">' + id + '</span> | ' + text);
                    console.log('[' + moment().format('HH:mm:ss') + '] ' + colors.inverse(id) + ' | ' + text);
                    break;
            }
        }
    }

    if (id == undefined)
        id = 'X';
    if (currentMode == 'debug') {
        if (mode == 'debug' || mode == 'normal' || mode == undefined) {
            consoleWrite(text, type, id);
        }
    }
    if (currentMode == 'normal') {
        if (mode == 'normal') {
            consoleWrite(text, type, id);
        }
    }

    if (id == 'server')
        return fs.appendFile('logs/' + logFileName + '.txt', '\n' + '[' + moment().format('YYYY-MM-DD HH:mm:ss') + '] ' + text, function(err) { // écris le retour des parseConsole dans les logs
            if (err) throw new Error(err);
        });
    if (panel)
        return fs.appendFile('logs/' + logFileName + '.txt', '\n' + '[' + moment().format('YYYY-MM-DD HH:mm:ss') + '] PANEL | ' + id + ' | ' + text, function(err) { // écris le retour des parseConsole dans les logs
            if (err) throw new Error(err);
        });
    fs.appendFile('logs/' + logFileName + '.txt', '\n' + '[' + moment().format('YYYY-MM-DD HH:mm:ss') + '] ' + id + ' | ' + text, function(err) { // écris le retour des parseConsole dans les logs
        if (err) throw new Error(err);
    });
}

function checkDB(type, id) {
    db.reload();

    if (type == 'chat')
        type = 'cat';
    if (type == 'chien')
        type = 'dog';

    var temp;

    try {
        temp = db.getData('/' + type);
    }
    catch (err) {
        parseConsole(type + ' does\'t exist in the database...', 'error', 'normal', id);
        return 'stop-DirDontExist';
    }

    if (Object.keys(temp).length === 0) {
        parseConsole(type + ' is empty...', 'error', 'normal', id);
        return 'stop-DirEmpty';
    }

    return 'ok';
}

function uid(type) {
    db.reload();
    if (type == 'get')
        return db.getData('/uid') + '';
    if (type == '++') {
        var id = db.getData('/uid');
        id++;
        db.push('/uid', id);
    }
}

var idToModify = [false, undefined];

function uploadId() { // ch
    if (idToModify[0] == false) {
        return uid('get');
    }
    if (idToModify[0] == true) {
        return idToModify[1];
    }
}

function addUserOnSite() {
    userOnSite++;
    io.emit('getUserOnSite', userOnSite);
}

// SOCKET IO

io.on('connection', function(socket) {
    /***
     *  CONNECTIONS
     ***/

    socket.on('client_user_waiting_id', function() {
        parseConsole('Receving a new connection', 'receving');
        parseConsole('Sending a new client ID : ' + userID, 'sending', userID);
        socket.emit('getUserID', userID);
        userID++;
        addUserOnSite();
    });

    socket.on('client_user_connect_with_id', function(id) {
        parseConsole('User connected with ID', 'receving', 'normal', id);
    });

    socket.on('disconnect', function() {
        parseConsole('User disconnected', 'bad', 'normal', undefined);
        userOnSite--;
        io.emit('getUserOnSite', userOnSite);
    });

    /***
     *  LOADINGS
     ***/

    // socket.on('loading-navbar', function() {
    //     parseConsole('Receving client request for NAVBAR', 'receving');
    // });

    socket.on('loading-accueil', function(myID) {
        parseConsole('Receving client request for accueil page', 'receving', 'normal', myID);
        socket.emit('init-pralax');
    });

    socket.on('loading-chien', function(myID) {
        parseConsole('Receving client request for dog page', 'receving', 'normal', myID);
        parseConsole('Checking the state of DataBase...', 'local', 'debug', myID);
        var allDogs;

        if (checkDB('chien', myID) == 'stop-DirDontExist')
            return socket.emit('checkingDbFail-dogDirDontExist');
        if (checkDB('chien', myID) == 'stop-DirEmpty')
            return socket.emit('checkingDbFail-dogDirEmpty');
        if (checkDB('chien', myID) == 'ok')
            allDogs = db.getData('/dog');

        parseConsole('Receving Dog DataBase', 'local', 'debug', myID);
        parseConsole('Sending Dog DataBase to client', 'sending', 'debug', myID);

        socket.emit('initDogPage', allDogs);

        parseConsole('Sending successful', 'succes', 'normal', myID);

        socket.emit('init-after-load'); // reinit les modals et les materials boxs car leur init étais load avant l'ajout des nouveaux
    });

    socket.on('loading-chat', function(myID) {
        parseConsole('Receving client request for cat page', 'receving', 'normal', myID);
        parseConsole('Checking the state of DataBase...', 'local', 'debug', myID);

        var allCats;

        if (checkDB('chat') == 'stop-DirDontExist')
            return socket.emit('checkingDbFail-catDirDontExist');
        if (checkDB('chat') == 'stop-DirEmpty')
            return socket.emit('checkingDbFail-catDirEmpty');
        if (checkDB('chat') == 'ok')
            allCats = db.getData('/cat');

        parseConsole('Receving Cat DataBase', 'local', 'debug', myID);
        parseConsole('Sending Cat DataBase to client', 'sending', 'debug', myID);

        socket.emit('initCatPage', allCats);

        parseConsole('Sending successful', 'succes', 'debug', myID);

        socket.emit('init-after-load'); // reinit les modals et les materials boxs car leur init étais load avant l'ajout des nouveaux
    });

    socket.on('loading-not-found', function(myID) { // marche que quand on accede à /not-found
        parseConsole('Receving client request for 404 page', 'bad', 'normal', myID);
    });

    /***
     *  PANEL
     ***/

    socket.on('userLogToPanel', function(ip) {
        parseConsole('Admin connected to panel', 'receving', 'normal', ip, true);

        addUserOnSite();

        parseConsole('Checking the state of cat DataBase...', 'local', 'debug', ip, true);

        var catInfo;

        if (checkDB('chat') == 'stop-DirDontExist')
            return;
        if (checkDB('chat') == 'stop-DirEmpty')
            return;
        if (checkDB('chat') == 'ok')
            catInfo = db.getData('/cat');

        parseConsole('Receving cat DataBase', 'local', 'debug', ip, true);

        parseConsole('Sending cat DataBase to client', 'sending', 'debug', ip, true);
        parseConsole('Checking the state of dog DataBase...', 'local', 'debug', ip, true);

        var dogInfo;

        if (checkDB('chien') == 'stop-DirDontExist')
            return;
        if (checkDB('chien') == 'stop-DirEmpty')
            return;
        if (checkDB('chien') == 'ok')
            dogInfo = db.getData('/dog');

        parseConsole('Receving dog DataBase', 'local', 'debug', ip, true);

        socket.emit('get-panel', dogInfo, catInfo);

        parseConsole('Sending dog DataBase to client', 'sending', 'debug', ip, true);
        parseConsole('Geting UID...', 'local', 'debug', ip, true);

        var uidToSend = uid('get');

        parseConsole('Sending UID...', 'sending', 'debug', ip, true);

        socket.emit('senduid', uidToSend);

        parseConsole('All sending steps are successful', 'succes', 'normal', ip, true);

        socket.emit('init-after-load');
    });

    socket.on('increuid', function(ip) {
        uid('++');
    });

    socket.on('addPet', function(info, ifModify, ip) {
        parseConsole('Receving new ' + info.category, 'receving', 'normal', ip, true);
        parseConsole('Pushing ' + info.category + ' info\'s on DataBase...', 'local', 'debug', ip, true);

        db.push('/' + info.category + '/' + info.uid, info);

        parseConsole('Pushing successful for the ' + info.category + ': ' + info.name + ' N°' + info.number, 'ok', 'debug', ip, true);
        parseConsole('Sending ' + info.name + ' to connected admins', 'sending', 'debug', ip, true);

        if (!ifModify)
            io.emit('addColl' + info.category, info);


        parseConsole('Sending ' + info.name + ' successful', 'ok', 'debug', ip, true);
        parseConsole('Sending ' + info.name + ' to connected users', 'sending', 'debug', ip, true);

        if (!ifModify)
            io.emit('showPet', info);

        parseConsole('Sending ' + info.name + ' successful', 'ok', 'debug', ip, true);
        parseConsole('Pushing ' + info.name + ' on DataBase successful', 'succes', 'normal', ip, true);
    });

    socket.on('removePet', function(uid, name, type, ip) {

        parseConsole('Deteling ' + type + ' ' + name + ' to DataBase...', 'local', 'normal', ip, true);

        db.delete('/' + type + '/' + uid);

        parseConsole('Deteling successful for ' + type + ' ' + uid, 'ok', 'debug', ip, true);
        parseConsole('Sending the remove of ' + uid + ' to connected admins', 'sending', 'debug', ip, true);

        io.emit('removeColl', uid);

        parseConsole('Sending ' + uid + ' successful', 'ok', 'debug', ip, true);
        parseConsole('Sending the remove of ' + uid + ' to connected users', 'sending', 'debug', ip, true);

        io.emit('removeCard', uid);

        parseConsole('Sending ' + uid + ' successful', 'ok', 'debug', ip, true);
        parseConsole('Deteling ' + type + ' ' + name + ' successful', 'succes', 'normal', ip, true);
    });

    socket.on('needTypeLog', function() {
        var typeLog = currentMode;
        socket.emit('getTypeLog', typeLog);
    });

    socket.on('changeConsoleMod', function(consoleMod) {
        currentMode = consoleMod;
    });

    socket.on('needUserOnSite', function() {
        socket.emit('getUserOnSite', userOnSite);
    });

    socket.on('clickOnModal', function(category, uid, name, userID) {
        var numOfClick = db.getData('/' + category + '/' + uid + '/clickOnModal');
        numOfClick++;
        db.push('/' + category + '/' + uid + '/clickOnModal', numOfClick);
        parseConsole('User click on ' + name + ' modal. TOTAL: ' + numOfClick, 'receving', 'normal', userID, false);
        socket.emit('getClickOnModal', uid, numOfClick);
    });

    socket.on('startModify', function(id) {
        idToModify = [true, id];
    });

    socket.on('startUploadImg', function() {
        idToModify = [false, undefined];
    });

    socket.on('getDB', function(category, id) {
        var info = db.getData('/' + category + '/' + id);
        socket.emit('recevingDB', info);
    });
});
