//
// tests for node-daap
//

var daap = require('../lib/daap.js');

console.log('Make sure your environment is properly configured !!');
console.log('Make sure iTunes is ready.');

/* Edit these if needed */
daap.host = '127.0.0.1';
daap.port = 3689;
daap.pairingCode = '0x98525F88D21A6218';

var sessionId = null;
var databaseId = null;
var containerId = null;

exports.serverInfo = function (test) {
    daap.serverInfo(function (error, response) {
        test.strictEqual(error, null);
        test.strictEqual(response['dmap.serverinforesponse']['dmap.status'], 200);
        test.done();
    });
};

exports.login = function (test) {
    daap.login(function (error, response) {
        test.strictEqual(error, null);
        test.strictEqual(response['dmap.loginresponse']['dmap.status'], 200);

        sessionId = response['dmap.loginresponse']['dmap.sessionid'];

        test.done();
    });
};

exports.databases = function (test) {
    test.notStrictEqual(sessionId, null);

    daap.databases(sessionId, function (error, response) {
        test.strictEqual(error, null);
        test.strictEqual(response['daap.serverdatabases']['dmap.status'], 200);

        if (typeof response['daap.serverdatabases']['dmap.listing'] == 'object') {
            databaseId = response['daap.serverdatabases']['dmap.listing']['dmap.listingitem']['dmap.itemid'];
        } else {
            databaseId = response['daap.serverdatabases']['dmap.listing'][0]['dmap.listingitem']['dmap.itemid'];
        }

        test.done();
    });
};

exports.containers = function (test) {
    test.notStrictEqual(sessionId, null);
    test.notStrictEqual(databaseId, null);

    daap.containers(sessionId, databaseId, function (error, response) {
        test.strictEqual(error, null);
        test.strictEqual(response['daap.databaseplaylists']['dmap.status'], 200);

        containerId = response['daap.databaseplaylists']['dmap.listing'][0]['dmap.listingitem']['dmap.itemid'];
        test.done();
    });
};

exports.items = function (test) {
    test.notStrictEqual(sessionId, null);
    test.notStrictEqual(databaseId, null);
    test.notStrictEqual(containerId, null);

    daap.items(sessionId, databaseId, containerId, function (error, response) {
        test.strictEqual(error, null);
        test.strictEqual(response['daap.playlistsongs']['dmap.status'], 200);

        test.done();
    });
};
