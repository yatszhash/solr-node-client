var fs = require('fs'); 
var https = require('https'); 
const port = 4433;
var options = { 
    key: fs.readFileSync('server-key.pem'), 
    cert: fs.readFileSync('server-crt.pem'), 
    ca: fs.readFileSync('ca-crt.pem'), 
}; 
https.createServer(options, function (req, res) { 
    console.log(new Date()+' '+ 
        req.connection.remoteAddress+' '+ 
        req.method+' '+req.url); 
    res.writeHead(200); 
    res.end("hello world\n"); 
}).listen(port);
console.log(`Listening on localhost ${port}`);
