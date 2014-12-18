var mongoose = require('mongoose');

var
	Connection,
	connectionCollectionName = 'connection';
var jsonSchema = {
	nfcId : {
		type: String,
		unique: true
	},
	jobID: {
		type: String
	},
	jobTitle: {
		type: String
	}
}

schema = mongoose.Schema(jsonSchema, {collection: connectionCollectionName});

schema.statics.getJobIdForNFCid = function(value){
	return this.findOne({hfcId: value}).execQ();
}

Connection = mongoose.model(connectionCollectionName, schema);

module.exports = Connection;