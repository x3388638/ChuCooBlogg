var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http').Server(app);

var _userList = {
	admin: {
		username: 'admin',
		password: '123456',
		name: 'JonilaRS',
		gender: 'm',
		address: 'Puli'
	}
};
var _posts = {};

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(express.static('web'));

app.post('/login', function (req, res) {
	var username = req.body.username;
	var password = req.body.password;
	if (username == 'admin' && password == '123456') {
		res.json(_userList[username]);
	} else {
		res.status(401).json({
			msg: 'wrong password'
		})
	}
});

http.listen(65432, function(){
	console.log('listening on 127.0.0.1:65432');
});
