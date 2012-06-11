
var http = require('http'),
    fs = require('fs'),
    url = require('url'),
    sdc = require('statsd-client'),
    SDC = new sdc('localhost', {port: 3200});

var gif = fs.readFileSync('./transparent.gif');

http.createServer(function (req, res) {
    var qs = url.parse(req.url, true).query;

    var end = function () {
        res.setHeader("Content-Type", "image/gif");
        res.end(gif, "binary");
    };

    if (qs.b === undefined ||
        qs.t === undefined ||
        qs.v === undefined) {
        return end();
    }

    switch (qs.t) {
        case 'c': SDC.increment(qs.t, qs.v); break;
        case 't': SDC.timing(qs.t, qs.v); break;
        case 'g': SDC.gauge(qs.t, qs.v); break;
    }

    SDC.increment('js_proxy.requests');

    end();
}).listen(3202, 'localhost');


// send data to statsd
// ?b=<bucket>&t=<type: c|g|t>&v=<value>
