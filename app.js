var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var setOptions = require('./lib/setOptions');
var Datastore = require('./lib/datastore');

var Connection = require('./lib/connect');

var app = express();

Datastore(function(){
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use('/src', express.static(__dirname + '/src'));

	app.get('/', function(req, res){
		res.sendFile(__dirname + '/src/index.html');
	});

	app.get('/api/apply/:nfc_id', function(req,res,next){
		var nfc_id = req.params.nfc_id;
		Connection.findOne({nfcId: nfc_id}, function(err, result){
			if (err){
				res.send(err);
			} else {
				res.send({
					'title': result.jobTitle,
					'logo_url': '/src/logo/evil.png',
					'job_id' : result.jobID
				});
			}
		});
	});

	app.post('/api/apply/:nfc_id', function(req, res, next){
		var email = req.body.profile_email;
		var prof_id = req.body.profile_id;
		var nfc_id = req.params.nfc_id;

		Connection.findOne({nfcId:nfc_id}, function(err, conn){
			if (err){
				console.log('error!');
				res.send(err);
			} else {
				var jobfolderID = conn.jobID;

				var addToOrgUrl = 'http://waggle.zabdo.me/api/organizations/300/prospect';
				var addToFolderUrl = "http://waggle.zabdo.me/api/organizations/300/profiles/byProfileId/"+prof_id;
				var options = setOptions(addToOrgUrl, 'POST', {"personalDetail":{"email":email}}, true);
				var folderIDbody = {"jobFolderIds":[jobfolderID]};
				var opts2 = setOptions(addToFolderUrl, 'PUT', folderIDbody, true, 'application/findly.AddToJobFolderProfileCommand+json');

				// Add prospect to org 
				request(options, function(error, response, body){
					// add prospect to jobfolder
					request(opts2, function(err, rponse, body2){
						res.send({
							success: true
						});
					});
				});	
			}
		});
	});

	app.get('/api/nfc/list', function(req, res, next){
		var conn = Connection;
		conn.find(function(err, results){
			res.send(results); 
		});
	});

	app.put('/api/nfc/:nfc_id', function(req, res, next){
		var nfc_id = req.params.nfc_id,
		job_id = req.body.job_id,
		job_title = req.body.job_title;

		if(!job_id){
			Connection.findOneAndRemove({nfcId:nfc_id},function(err, result){
				res.send({success:true});
			});
		} else {
			Connection.findOne({nfcId: nfc_id}, function(err, result){
				if (err || !result){
					var newConnection = new Connection({nfcId: nfc_id, jobID: job_id, jobTitle: job_title});
					newConnection.save(function(err,newconn){
						if (err){
							res.send({success: false});
						} else {
							res.send({success: true});
						}
					});
				} else {
					result.jobID = job_id;
					result.jobTitle = job_title;
					result.save(function(err,updatedConn){
						if (err){
							res.send({success: false});
						} else {
							res.send({success: true});
						}
					});
				}
			});
		}
	});

	app.get('/api/job/list', function(req, res){
		var url = 'http://waggle.zabdo.me/api/organizations/300/jobfolders?searchParameters=%7B%22offset%22%3A0%2C%22limit%22%3A24%2C%22searchtree%22%3A%7B%22filter%22%3A%7B%22starred%22%3Atrue%2C%22open%22%3Atrue%7D%2C%22query%22%3A%7B%22searchText%22%3A%22%22%7D%7D%7D';
		var options = setOptions(url, 'GET', {}, true);

		request(options).pipe(res);
	});

	app.post('/api/job/new', function(req, res){
		var org_id = 300,
		body = {
			"organizationId":org_id,
			"id":null,
			"checked":false,
			"jobTitle":req.body.title,
			"jobReference":"",
			"location":{"address":"Auckland, New Zealand","coordinates":[174.76333150000005,-36.8484597],"city":"Auckland","country":"NZ","state":"Auckland","postCode":""},
			"open":true,
			"starred":true,
			"stateCounts":null,
			"dateClosed":null,
			"candidateCount":0,
			"ancestorOrigins":{"length":0},
			"search":"",
			"protocol":"http:"
		},
		options = setOptions('http://waggle.zabdo.me/api/organizations/300/jobfolders/', 'POST', body, true);
		request(options).pipe(res);
	});

	var server = app.listen(8080, function(){
		var host = server.address().address;
		var port = server.address().port;

		console.log('Example app listening at http://%s:%s', host, port);
	});
});
