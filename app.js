var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var dotenv = require('dotenv').load();
var sendgrid = require('sendgrid')(process.env['SENDGRID_USERNAME'], process.env['SENDGRID_PASSWORD']);
var mongoose = require('mongoose');
var validator = require('validator');
var app = express();
var server = require('http').createServer(app);

mongoose.connect('mongodb://localhost/pennapps');

var personSchema = new mongoose.Schema({
  name: String,
  email: String,
  date: { type: Date, default: Date.now}
});

var Person = mongoose.model('Person', personSchema);

app.set('view engine', 'hjs');
app.use(bodyParser());
app.use(multer());

app.get('/yay', function(req, res) {
  res.render('index');
});

app.post('/in', function(req, res) {
  var to = JSON.parse(req.body.envelope)['from'];

  var email = new sendgrid.Email();

  email.to = to;
  email.from = 'taco@cat.limo';
  email.from_name = 'TacoCat';
  email.addHeader('X-AHEAD-YAAAY', process.env['RESHEADER']);
  email.addHeader('X-HINT', 'Think 64');
  email.subject = 'Keep going...';
  email.text = "Looks like you're getting aHEAD!";
  email.html = "Looks like you're getting a<em><b>head</b></em>!<br><br><br><br><br><br><a href='http://en.wikipedia.org/wiki/Email#Message_header'>Stuck?</a>";

  sendgrid.send(email);

  res.status(200).end();
});

app.post('/rad', function(req, res) {
  if (typeof(req.body.email) != "string" || typeof(req.body.name) != "string") {
    res.status(409).send({status: "Not quite"});
    return;
  }

  if (!validator.isEmail(req.body.email)) {
    res.status(409).send({status: "Need a real one!"});
    return;
  }

  Person.findOne({'email': req.body.email}, function(err, person) {
    if (person) {
      res.status(409).send({status: "You are already entered!"});
      // return;
    } else {
      var person = new Person({name: req.body.name, email: req.body.email});
      person.save(function(err) {
        if (err) {
          res.status(500).send({status: "Something went wrong", error: err});
        } else {
          res.send({status: "Way to go! You've been entered into a drawing! Please pass the card to a random person."});
        }
      });
    }
  });
});

app.listen(3000, function() {
  console.log('app running on port 3000');
});
