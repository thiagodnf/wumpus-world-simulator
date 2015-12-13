var connect = require('connect');
    serveStatic = require('serve-static');
	port = process.env.PORT || 8080;

connect().use(serveStatic(__dirname)).listen(port);

console.log("Running Wumpus World Simulator");
console.log('The magic happens at http://localhost:' + port);
