var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var sendgrid = require('sendgrid')(process.env['SENDGRID_USERNAME'], process.env['SENDGRID_PASSWORD']);
var app = express();
var server = require('http').createServer(app);

app.set('view engine', 'hjs');
app.use(bodyParser());
app.use(multer());

app.get('/', function(req, res) {
  res.render('index');
});

app.post('/', function(req, res) {
  var to = JSON.parse(req.body.envelope)['from'];

  var email = new sendgrid.Email();

  email.to = to;
  email.from = 'taco@cat.limo';
  email.addHeader('X-YAAAY', 'You did it!');
  email.subject = 'Keep going...';
  email.text = "Looks like you're getting ahead!";

  sendgrid.send(email);

  res.status(200).end();
});

app.listen(3000, function() {
  console.log('app running on port 3000');
});
