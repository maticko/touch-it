var mongoose = require('mongoose');


var Datastore = function(callback){
	var dbURI = 'mongodb://localhost/touch-it'; 

	mongoose.connect(dbURI);
	
	var connectionStatus = { isConnected : false };
	var firstConnect = true;

	// CONNECTION EVENTS
	// When successfully connected	
	mongoose.connection.on('connected',function(){
		console.log('Mongoose connection open');
		if (firstConnect) {
			firstConnect = false;
			callback(mongoose.connection, connectionStatus);
		}
	});

	// If the connection throws an error
	mongoose.connection.on('error',function (err) {
		console.log('Mongoose default connection error: ' + err);
		connectionStatus.isConnected = false;
	});

	// When the connection is disconnected
	mongoose.connection.on('disconnected', function () {
		console.log('Mongoose default connection disconnected');
		connectionStatus.isConnected = false;
	});

	// If the Node process ends, close the Mongoose connection
	process.on('SIGINT', function() {
		mongoose.connection.close(function () {
			console.log('Mongoose default connection disconnected through app termination');
			connectionStatus.isConnected = false;
			process.exit(0);
		});
	});
};

module.exports = Datastore;