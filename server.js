var express = require("express"),
    app = express(),
    methodOverride = require('method-override'),
    errorHandler = require('errorhandler'),
    port = app.listen(9090);
    start();
    
function start() {
    app.use(methodOverride());
    app.use(express.static(__dirname + '/public'));
    app.use(errorHandler({
        dumpExceptions: true,
        showStack: true
    }));

    console.log("Imito is initializing...");
}