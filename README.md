node-daap
=========

node-daap is a Node.js helper library for [Apple DAAP](http://en.wikipedia.org/wiki/Digital_Audio_Access_Protocol "Apple DAAP") protocol. DAAP protocol has been built over HTTP. Apple doesn't provide a proper documentation for his protocol, that's why it is difficult to get some efficient information about the protocol. Almost all of the work that has been done, has been made by sniffing the network between my computer and [official Apple Remote app](https://itunes.apple.com/fr/app/remote/id284417350?mt=8). I will update the documentation as soon as I have some new information.

The library uses [request](https://github.com/mikeal/request "Node Request") to handle some interaction between user and iTunes.  It has been designed to be as easiest as possible to use !

###Options

* __host__ : IP address or domain name where iTunes is located ;
* __port__ : Port which iTunes uses _(default : 3689)_
* __pairingCode__ : pairing code used to connect to iTunes the first time. I will provide a tool with a proper documentation, soon.

###Implementation

All the methods are built in the same way : they are all asynchronous, and every callbacks are composed with the same parameters. Here is an example :

```JavaScript
var daap = require('daap');

daap.serverInfo(function (error, response) {
    // error = null, if everything is fine
    // response = JS object, parsed from web request response
});
```

Here are the methods which are currently in node-daap.

####serverInfo

- __Description__ : Provides information about what the server supports or not.
- __Parameters__ :
  - _None_

####login

- __Description__ : Provides session information for the next requests.
- __Parameters__ :
  - _None_

####databases

- __Description__ : Provides list of databases served up by the server.
- __Parameters__ :
  - __sessionId__ : Session token get from the _login_ request.

####containers

- __Description__ : Provides list of playlists which are in the user provided database.
- __Parameters__ :
  - __sessionId__ : Session token get from the _login_ request.
  - __databaseId__ : Database ID get from the _databases_ request.

####items

- __Description__ : Provides items (_songs_) that are in the user provided container.
- __Parameters__ :
  - __sessionId__ : Session token get from the _login_ request.
  - __databaseId__ : Database ID get from the _databases_ request.
  - __containerId__ : Container ID get from the _containers_ request

####play

- __Description__ : Play the user provided song.
- __Parameters__ :
  - __sessionId__ : Session token get from the _login_ request.
  - __songId__ : Song ID get from the _items_ request.

####setProperty

- __Description__ : Set one or many property (such as volume, for example) in iTunes.
- __Parameters__ :
  - __sessionId__ : Session token get from the _login_ request.
  - __properties__ : Simple JS object with the properties to set. 

####getProperty

- __Description__ : Get one or many property (such as volume, for example) in iTunes.
- __Parameters__ :
  - __sessionId__ : Session token get from the _login_ request.
  - __properties__ : Simple JS array with the properties to get. 

####artwork

- __Description__ : Get cover image for a song.
- __Parameters__ :
  - __sessionId__ : Session token get from the _login_ request.
  - __databaseId__ : Database ID get from the _databases_ request.
  - __songId__ : Song ID get from the _items_ request.

###Testing

Every methods have been tested using [Nodeunit](https://github.com/caolan/nodeunit). You can try yourself and get some examples in the "_tests_" directory.

```Bash
koinkoin:/Users/jeffrey/Repositories/node-daap jeffrey$ nodeunit tests/01_music_fetcher.js 
Make sure your environment is properly configured !!
Make sure iTunes is ready.

01_music_fetcher.js
✔ serverInfo
✔ login
✔ databases
✔ containers
✔ items

OK: 16 assertions (937ms)
```

###Inspiration

This project has found inspiration thanks to great projects and great papers. Here are relevant links to understand how DAAP works :

* http://daap.sourceforge.net/index.html
* http://dacp.jsharkey.org/
* http://blog.mycroes.nl/2008/08/pairing-itunes-remote-app-with-your-own.html
* http://jinxidoru.blogspot.fr/2009/06/itunes-remote-pairing-code.html
* https://code.google.com/p/tunesremote-plus/
* ...

###License

node-daap is freely distributable under the terms of the MIT license.

```
Copyright (c) 2012 - 2013 Jeffrey Muller <jeffrey.muller92@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/j-muller/node-daap/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/j-muller/node-daap/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

