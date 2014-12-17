var express = require('express');

var app = express();

app.use('/src', express.static(__dirname + '/src'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/src/index.html');
});

app.get('/api/job/:nfc_id', function(req,res,next){
	// get jobTitle From local DB!
	console.log(req.params.nfc_id);
	res.send({
		'title': 'test-job-title',
		'job_id' : 1337
	});
});

app.post('/api/apply/:nfc_id', function(req, res, next){
	// do the magic with waggle then!
	console.log(req.params.nfc_id);
	res.send({
		success: true
	});
});

var server = app.listen(8080, function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});