var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var setOptions = require('./lib/setOptions');

var app = express();

app.use(bodyParser.json());
app.use('/src', express.static(__dirname + '/src'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/src/index.html');
});

app.get('/api/apply/:nfc_id', function(req,res,next){
	// get jobTitle From local DB!
	console.log(req.params.nfc_id);
	res.send({
		'title': 'test-job-title',
		'description': 'this is job description',
		'logo_url': 'src/logo/evil.png',
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

app.get('/api/job/list', function(req, res){
	var url = 'http://waggle.zabdo.me/api/organizations/300/jobfolders?searchParameters=%7B%22offset%22%3A0%2C%22limit%22%3A24%2C%22searchtree%22%3A%7B%22filter%22%3A%7B%22starred%22%3Atrue%2C%22open%22%3Atrue%7D%2C%22query%22%3A%7B%22searchText%22%3A%22%22%7D%7D%7D';
	var options = setOptions(url, 'GET', {}, true);

	request(options).pipe(res);
});

var server = app.listen(8080, function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

// findly cookie
// .FINDLY=9319AF6074A1B48E63E4F8CEA6447FA41B54AE5EFAB1A4C1154CADDB132F9DB6EF5A9AF3F870C526C7FCD5E25BFC5C88ADD4D657F2D5126F491D52504569F7B06ECA662E11BA1066B15A5BABCCD4E64F686531F3C4F5FCC975916ADB859034E590D2B2043B6FE11E3CCF7B8EFFBF7274AB15C61438009AF22FBB494A2F370DCDD2E068E7555215CE230C833A0055EB8DDB9CEF9DF1C00734F7A3CBF541C9A92B2040C3D52E98900833984968B4EC76610BB58A14E2BD1F109D1E1FA958F8DDD80A0C590EC4987D3BDE271F1A4D61202B3A4E4F743D61BEF44ED42720E4C9A04A6CCB10E3DD41D1C1D0247AE5BA329A9DFCA9605F8F486804C59E23F38C0A7BB8C2D485FAEF83152AFF3BCA00CC104AF36ECC1F2AB81189EF4D2D5D6DF3FADD134FEA57BDC3395FB2C77BBA8323E4D393EA30B822901EE7990D3EB40FB1089E773B31CC1204DD99E4F9919FF3EA314A775CFDED534ED9A7EDC1D3C9F6C53BF64CC73FB4F0;


