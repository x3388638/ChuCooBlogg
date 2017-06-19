var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var http = require('http').Server(app);

var _cookie = null;
var _userInfo = {
	username: 'admin',
	password: '123456',
	name: 'JonilaRS',
	gender: 'm',
	address: 'Puli'
};
var _posts = [];

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('web'));

app.post('/login', function (req, res) {
	var username = req.body.username;
	var password = req.body.password;
	if (username == 'admin' && password == _userInfo.password) {
		var c = ((new Date()) * Math.random()).toString(16).replace(/\./g, Math.round((Math.random() * 1000)).toString(8));
		_cookie = c;
		res.cookie('_nodejs_session', c);
		var user = Object.assign({}, _userInfo);
		delete user.password;
		res.json(user);
	} else {
		res.status(401).json({
			msg: 'wrong password'
		})
	}
});

app.post('/logout', function (req, res) {
	if (isLogin(req.cookies._nodejs_session)) {
		_cookie = null;
		res.json({
			msg: 'logout'
		})
	} else {
		res.status(401).json({
			msg: 'no login'
		})
	}
});

app.get('/authors', function (req, res) {
	if (isLogin(req.cookies._nodejs_session)) {
		var user = Object.assign({}, _userInfo);
		delete user.password;
		res.json({
			user
		});
	} else {
		res.status(401).json({
			msg: 'no login'
		});
	}
});

app.patch('/authors/:id', function (req, res) {
	if (isLogin(req.cookies._nodejs_session)) {
		var {name, gender, address, password} = req.body;
		var username = req.params.id;
		password = password || _userInfo.password;
		_userInfo = Object.assign({}, _userInfo, {name, gender, address, password});
		var user = Object.assign({}, _userInfo);
		delete user.password;
		res.json({
			user
		});
	} else {
		res.status(401).json({
			msg: 'mo login'
		});
	}
});

function isLogin(cookie) {
	return cookie == _cookie;
}

http.listen(65432, function(){
	console.log('listening on http://127.0.0.1:65432');
});
