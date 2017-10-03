/**
 * For localhost altnames being rejected, set NODE_TLS_REJECT_UNAUTHORIZED=0
 * Modules dependencies
 */

var mocha = require('mocha'),
    figc = require('figc'),
    fs = require("fs"),
    assert = require('chai').assert,
    libPath = process.env['SOLR_CLIENT_COV'] ? '../lib-cov' : '../lib',
    solr = require(libPath + '/solr'),
    sassert = require('./sassert');

// Test suite
var config = figc(__dirname + '/config.json');

var basePath = [config.client.path, config.client.core].join('/').replace(/\/$/, "");

var https = require('https');
const port = 4433;
var serveroptions = {
    key: fs.readFileSync(__dirname + '/ssl/server-key.pem'),
    cert: fs.readFileSync(__dirname + '/ssl/server-crt.pem'),
    ca: fs.readFileSync(__dirname + '/ssl/ca-crt.pem'),
};
var clientoptions = {
    hostname: 'localhost',
    port: port,
    path: '/',
    method: 'GET',
    key: fs.readFileSync(__dirname + '/ssl/client1-key.pem'),
    cert: fs.readFileSync(__dirname + '/ssl/client1-crt.pem'),
    ca: fs.readFileSync(__dirname + '/ssl/ca-crt.pem'),
};

var response = require(__dirname + '/ssl/response.json');

describe('SSLClient', function () {
    var sslserver;
    before(function (done) {
        sslserver = https.createServer(serveroptions, function (req, res) {
            console.log("ssl connect:" + new Date() + ' ' +
                req.connection.remoteAddress + ' ' +
                req.method + ' ' + req.url);
            res.writeHead(200);
            res.end(JSON.stringify(response, null, 2));
        }).listen(port);
        sslserver.on("listening", function () {
            console.log("ssl server started " + port);
            done();
        });
    });

    after(function (done) {
        sslserver.close();
        console.log("ssl server closed " + port);
        done();
    });

    describe('https client ssl connect', function () {
        it('should respond', function (done) {
            var req = https.request(clientoptions, function (res) {
                console.log("client ssl connect on " + port);
                res.on('data', function (data) {
                    assert.ok(data, "Has response");
                    done();
                });
            });
            req.end();
        });
    });




    describe('search ssl', function () {

        let tconfig = { client: Object.assign({}, config.client) };
        tconfig.client.port = 8984;
        tconfig.client.ssl = { key: clientoptions.key, cert: clientoptions.cert, ca: clientoptions.ca };

        it('successfully search with ssl', function (done) {
            let client = solr.createClient(tconfig.client);
            client.search('q=id:missing', function (err, data) {
                sassert.ok(err, data);
                assert.deepEqual({ q: 'id:missing', wt: 'json' }, data.responseHeader.params);
                done();
            });
        });

        it('successfully query search with ssl', function (done) {    

            let client = solr.createClient(tconfig.client);
            var solrQ = client.createQuery()
                    .q("id:missing");
            client.search(solrQ, function (err, data) {
                sassert.ok(err, data);
                assert.deepEqual({ q: 'id:missing', wt: 'json' }, data.responseHeader.params);
                done();
            });
        });

        it('fail search without ssl', function (done) {
            let sconfig = { client: Object.assign({}, config.client) };
            sconfig.client.port = 8984;
            //config.client.ssl = { key: clientoptions.key,  cert: clientoptions.cert,  ca:clientoptions.ca };
            let client = solr.createClient(sconfig.client);
            client.search('q=id:missing', function (err, data) {
                assert.ok(err);
                assert.isNull(data);
                done();
            });
        });
    });
});
