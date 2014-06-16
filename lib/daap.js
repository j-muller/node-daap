/*
 * node-daap
 * DAAP library for Node.js
 *
 * Copyright (c) 2013 Jeffrey Muller
 * Licensed under the MIT license.
 */

var request   = require('request'),
    urlModule = require('url'),
    parser    = require('./parser.js');

var daap = {

    /* iTunes host */
    host: '127.0.0.1',

    /* iTunes port */
    port: 3689,

    /* Pairing code used to communicate with iTunes (in hexadecimal) */
    pairingCode: null,

    /* Mandatory header to control iTunes */
    headers: {
        'Viewer-Only-Client': '1',
    },

    /*
     * Functions
     */
    apiUrl: function () {
        return 'http://' + daap.host + ':' + daap.port + '/';
    },

    requestProxyCallback: function (url, callback, options) {
        options = {
            parse: (typeof(options) == 'object' && options.parse != undefined) ? options.parse : true
        };

        request.get({
            'url': url,
            'headers': daap.headers,
            encoding: null
        }, function (error, response, body) {
            if (error) {
                if (response.statusCode == 503)
                    callback('Be sure your pairing code is correct.');
                else
                    callback(error);
            } else {
                try {
                    if (options.parse === true)
                        body = parser.parse(body);

                    callback(null, body);
                } catch (error) {
                    callback(error);
                }
            }
        });
    },

    /*
     * DAAP Requests
     */

    /* Provides server information */
    serverInfo: function (callback) {
        daap.requestProxyCallback(daap.apiUrl() + 'server-info', callback);
    },

    /* Provides session information to use */
    login: function (callback) {
        var url = daap.apiUrl() + 'login?pairing-guid=' + daap.pairingCode;

        daap.requestProxyCallback(url, callback);
    },

    /* Get iTunes databases */
    databases: function(sessionId, callback) {
        var url = daap.apiUrl() + 'databases?session-id=' + sessionId;

        daap.requestProxyCallback(url, callback);
    },

    /* Get iTunes containers */
    containers: function(sessionId, databaseId, callback) {
        var url = daap.apiUrl() + 'databases/' + databaseId
                  + '/containers?session-id=' + sessionId;

        daap.requestProxyCallback(url, callback);
    },

    /* Get items from the selected database and container */
    items: function(sessionId, databaseId, containerId, callback, meta) {
        meta = (meta == null) ? 
                'dmap.itemname,dmap.itemid,daap.songartist,daap.songalbumartist,'
                + 'daap.songalbum,daap.songtime,daap.songartistid' : meta.join();

        var url = daap.apiUrl() + 'databases/' + databaseId + '/containers/'
                  + containerId + '/items?session-id=' + sessionId
                  + '&meta=' + meta;

        daap.requestProxyCallback(url, callback);
    },

    /* Enable play button in iTunes */
    play: function(sessionId, songId, callback) {
        var uri = urlModule.parse(daap.apiUrl() + 'ctrl-int/1/playqueue-edit?'
        + 'command=add&query=\'dmap.itemid:' + songId + '\''
        + '&sort=name&mode=1&session-id=' + sessionId);

        /* Decode URI path... Wtf DACP protocol !? */
        uri.path = decodeURIComponent(uri.path);

        daap.requestProxyCallback(uri, callback);
    },

    /* Set one or many properties in iTunes */
    setProperty: function(sessionId, properties, callback) {
        var parameters = '';

        for (var key in properties) {
            parameters += key + '=' + properties[key] + '&';
        }

        var uri = daap.apiUrl() + 'ctrl-int/1/setproperty?' + parameters + 'session-id=' + sessionId;

        daap.requestProxyCallback(uri, callback);
    },

    /* Get one or many properties in iTunes */
    getProperty: function(sessionId, properties, callback) {
        var uri = daap.apiUrl() + 'ctrl-int/1/getproperty?properties='
                    + properties.join() + '&session-id=' + sessionId;

        daap.requestProxyCallback(uri, callback);
    },

    /* Get song cover from iTunes */
    artwork: function(sessionId, databaseId, itemId, callback, options) {
        options = (options == null) ? {} : options;
        options.width = options.width || 200;
        options.height = options.height || 200;
        var uri = daap.apiUrl() + 'databases/' + databaseId + '/items/' + itemId
                    + '/extra_data/artwork?mw=' + options.width
                    + '&mh=' + options.height + '&session-id=' + sessionId;

        daap.requestProxyCallback(uri, callback, {'parse': false});
    },

    /* Pause played current song in iTunes */
    pause: function(sessionId, callback) {
        var uri = daap.apiUrl() + 'ctrl-int/1/pause?session-id=' + sessionId;

        daap.requestProxyCallback(uri, callback);
    },

    /* playPause */
    playPause: function (sessionId, callback) {
        var uri = daap.apiUrl() + 'ctrl-int/1/playpause?session-id=' + sessionId;

        daap.requestProxyCallback(uri, callback);
    },

    /* Get current song information */
    playStatusUpdate: function (sessionId, callback) {
        var uri = daap.apiUrl() + 'ctrl-int/1/playstatusupdate?session-id=' + sessionId;

        daap.requestProxyCallback(uri, callback);
    },

    /* Soon... */
    groups: function(sessionId, databaseId, callback) {
        var uri = daap.apiUrl() + 'databases/' + databaseId + '/groups?'
                    + 'meta=dmap.itemname,dmap.itemid,dmap.persistentid,daap.songartist,daap.groupalbumcount,daap.songartistid&type=music&group-type=artists&sort=album&include-sort-headers=1&query=(\'daap.songartist!:\'+(\'com.apple.itunes.extended-media-kind:1\',\'com.apple.itunes.extended-media-kind:32\'))'
                    + '&session-id=' + sessionId;

        daap.requestProxyCallback(uri, callback);
    },

};

module.exports = daap;
