var fs = require('fs'); 
var https = require('https'); 
const port = 4433;
var options = { 
    hostname: 'localhost', 
    port: port, 
    path: '/', 
    method: 'GET', 
    ca: fs.readFileSync('ca-crt.pem') 
}; 
console.log(`trying ${port}` );
var req = https.request(options, function(res) { 
    res.on('data', function(data) { 
        process.stdout.write(data); 
    }); 
}); 
req.end();

