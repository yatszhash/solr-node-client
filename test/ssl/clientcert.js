var fs = require('fs'); 
var https = require('https'); 
const port = 4433;
var options = { 
    hostname: 'localhost', 
    port: port, 
    path: '/', 
    method: 'GET', 
    key: fs.readFileSync('client1-key.pem'), 
    cert: fs.readFileSync('client1-crt.pem'), 
    ca: fs.readFileSync('ca-crt.pem') }; 

console.log(`Attempting client1 cert on port ${port}`);

var req = https.request(options, function(res) { 
    res.on('data', function(data) { 
        process.stdout.write(data); 
    }); 
}); 
req.end(); 
req.on('error', function(e) { 
    console.error(e); 
});
