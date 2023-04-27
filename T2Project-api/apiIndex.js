//  TEST: USE MANAGEMENT API

const port = 3000;
const host = 'localhost';

const express = require('express');
const expressApp = express();

const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');

const testScope = requiredScopes('read:users');

//  MIDDLEWARE
const checkJwt = auth({
	audience: 'https://dev-fyszmjwlhy8ftgjv.us.auth0.com/api/v2/',
	issuerBaseURL: `https://dev-fyszmjwlhy8ftgjv.us.auth0.com/`,
	scope: 'openid profile email',
});

expressApp.get('/public', function (req, res) {
	console.log('HELLO');
	res.json({
		message: '[!] PUBLIC ENDPOINT TEST [!]',
	});
});

expressApp.get('/private', checkJwt, function (req, res) {
	console.log('PRIVATE HELLO');
	res.json({
		message: '[!] PRIVATE ENDPOINT REACHED [!]',
	});
});

expressApp.get('/privateUsers', checkJwt, testScope, function (req, res) {
	console.log('PRIVATE USERS ENDPOINT');

	var axios = require('axios').default;

	console.log(req.auth.token);

	var options = {
		method: 'GET',
		url: 'https://dev-fyszmjwlhy8ftgjv.us.auth0.com/api/v2/users',
		params: { search_engine: 'v3' },
		headers: { authorization: `Bearer ${req.auth.token}` },
	};

	axios
		.request(options)
		.then(function (response) {
			res.json(response.data);
		})
		.catch(function (error) {
			console.error(error);
		});
});

//  SERVER
expressApp.listen(port, host, () => {
	console.log(`(API INDEX) EXPRESS RUNNING: http://${host}:${port}`);
});
