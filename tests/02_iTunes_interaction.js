//
// tests for node-daap
//

var daap = require('../lib/daap.js');

console.log('Make sure your environment is properly configured !!');
console.log('Make sure iTunes is ready.');

/* Edit these if needed */
daap.host        = '127.0.0.1';
daap.port        = 3689;
daap.pairingCode = '0x98525F88D21A6218';

var sessionId    = null;
var databaseId   = null;
var containerId  = null;
var songId       = null;

exports.play = function (test) {
    daap.login(function (error, response) {
        test.strictEqual(error, null);
        test.strictEqual(response['dmap.loginresponse']['dmap.status'], 200);
        sessionId = response['dmap.loginresponse']['dmap.sessionid'];

        daap.databases(sessionId, function (error, response) {
            test.strictEqual(error, null);
            test.strictEqual(response['daap.serverdatabases']['dmap.status'], 200);

            if (typeof response['daap.serverdatabases']['dmap.listing'] == 'object') {
                databaseId = response['daap.serverdatabases']['dmap.listing']['dmap.listingitem']['dmap.itemid'];
            } else {
                databaseId = response['daap.serverdatabases']['dmap.listing'][0]['dmap.listingitem']['dmap.itemid'];
            }

            daap.containers(sessionId, databaseId, function (error, response) {
                test.strictEqual(error, null);
                test.strictEqual(response['daap.databaseplaylists']['dmap.status'], 200);

                containerId = response['daap.databaseplaylists']['dmap.listing'][0]['dmap.listingitem']['dmap.itemid'];

                daap.items(sessionId, databaseId, containerId, function (error, response) {
                    test.strictEqual(error, null);
                    test.strictEqual(response['daap.playlistsongs']['dmap.status'], 200);

                    songId = response['daap.playlistsongs']['dmap.listing'][0]['dmap.listingitem']['dmap.itemid'];

                    daap.play(sessionId, songId, function (error, response) {
                        test.strictEqual(error, null);
                    });

                    test.done();
                });
            });
        });
    });
};

exports.setProperty = function (test) {
    test.notStrictEqual(sessionId, null);

    daap.setProperty(sessionId, {
        'dmcp.volume': 0
    }, function(error, data) {
        test.strictEqual(error, null);

        test.done();
    });
};

exports.getProperty = function (test) {
    test.notStrictEqual(sessionId, null);

    daap.getProperty(sessionId, [
        'dmcp.volume'
    ], function(error, response) {
        test.strictEqual(error, null);
        test.strictEqual(response['dmcp.getpropertyresponse']['dmap.status'], 200);

        test.done();
    });
};

exports.artwork = function (test) {
    test.notStrictEqual(sessionId, null);

    daap.artwork(sessionId, databaseId, songId, function(error, response) {
        test.strictEqual(error, null);
        test.strictEqual(typeof response, 'object');
        test.done();
    });
};
