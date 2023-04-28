/*
    ROUTER/ROUTE HANDLER
*/

//	CONFIGURE .env / process.env
require('dotenv').config();

//	AUTH0
const { auth, requiresAuth } = require('express-openid-connect');

//	PASSPORT.JS
const passport = require('passport');

//  NEED ACCESS TO MONGODB
const mongo = require('./mongo');

const express = require('express');
const router = express.Router();

const expressSession = require('express-session');

//	CONFIG FOR AUTH0
const config = {
	authRequired: false,
	auth0Logout: true,
	secret: process.env.SESSION_SECRET,
	baseURL: 'http://localhost:8000',
	clientID: process.env.AUTH0_CLIENT_ID,
	issuerBaseURL: 'https://dev-fyszmjwlhy8ftgjv.us.auth0.com/',
	clientSecret: process.env.AUTH0_CLIENT_SECRET,
	authorizationParams: {
		response_type: 'code',
		scope: 'openid profile email',
		audience: process.env.AUTH0_AUDIENCE_MNG,
	},
};

/*
  SESSION CONFIGURATION
*/
const session = {
	secret: process.env.SESSION_SECRET,
	cookie: {},
	resave: false,
	saveUninitialized: false,
};

//	EXPRESS SESSION
router.use(expressSession(session));

/*
	PUBLIC ROUTES
*/

//  ROUTE - HOMEPAGE
router.get('/', (req, res) => {
	res.render('index');
});

//	TUTORSIGN UP GET REQ (MICHAEL U.)
router.get('/tutorSignup', function (req, res, next) {
	res.render('tutorSignup');
});

// POST /tutorsignup (MICHAEL U.)
router.post('/tutorSignup', function (req, res, next) {
	var name = req.body.name;
	var email = req.body.email;
	var subject = req.body.subject;
	var pw = req.body.pw;
	var pw2 = req.body.pw2;
	var specialties = req.body.specialties;
	/*
	// error if passwords do not match, rerenders signup page
	if(pw!==pw2)
	{	
		//might want to make tutorSignup dupes with errors so you're not sent back to a blank form without knowing what's wrong
		res.render(tutorSignup);
	}
*/
	console.log(req.body);
	res.render('index');
});

//	ILHAAM S.
router.get('/newRes', function (req, res, next) {
	res.render('newRes');
});

// POST /newRes (Ilhaam S.)
router.post('/newRes', function (req, res, next) {
	var res1={
		student: req.body.student,
		tutor: req.body.tutor,
		subject: req.body.subject,
		time: req.body.datetime,
	}
	console.log(req.body);
	
	mongo.newReservation(res1)
	res.redirect('/reservations');
});

//	TUTORSIGN UP GET REQ (MICHAEL U.)
router.get('/tutorSignup', function (req, res, next) {
	res.render('tutorSignup');
});

/*
	GUARDED ROUTES
*/

//	AUTH0 MIDDLEWARE
router.use(auth(config));

//	EXPRESS / AUTH0 (TEST)
//	NOTE: GUARDED, REQUIRE AUTHENTICATION TO ACCESS
router.get('/profile', requiresAuth(), (req, res) => {
	//	don't know what im doing anymore, get access tokens
	//	const { access_token } = req.oidc.accessToken

	// console.log(req.oidc.accessToken)
	// console.log(req.oidc.user.nickname)

	res.render('profile', { user: req.oidc.user });
});

//	(TEST) TRYING OUT API (BEHIND GUARD)
router.get('/privateButton', requiresAuth(), (req, res) => {
	console.log(req.oidc.accessToken);

	//	TEST
	const request = require('request');

	//	GET ACCESS TOKEN
	const options = {
		method: 'POST',
		url: 'https://dev-fyszmjwlhy8ftgjv.us.auth0.com/oauth/token',
		headers: { 'content-type': 'application/json' },
		body: '{"client_id":"1eB4PPI3CLokdir44cinFxzMllpkW8dd","client_secret":"EeaFRypu19a0icMlyP9JT4o5AmwxJyncaRsWBwM25tfQfeuQBIJhBBnBnUUumWbH","audience":"https://dev-fyszmjwlhy8ftgjv.us.auth0.com/api/v2/","grant_type":"client_credentials"}',
	};

	request(options, function (err, res, body) {
		if (err) throw new Error(err);

		console.log(body);

		parsedBody = body.split('"');

		// console.log(parsedBody[3]);

		/*
		fetch(process.env.SMARTIES_API + '/public', {
			headers: {
				Authorization: 'Bearer ' + parsedBody[3] 
			}
		})
		*/

		fetch(process.env.SMARTIES_API + '/private', {
			headers: {
				Authorization: 'Bearer ' + parsedBody[3],
			},
		});
	});

	//	REDIRECT BACK TO PROFILE
	res.redirect('/profile');
});

//	(TEST) USERS ENDPOINT
router.get('/displayUsers', requiresAuth(), (req, res) => {
	// console.log(req.oidc.accessToken);

	//	TEST
	const request = require('request');

	//	GET ACCESS TOKEN
	const options = {
		method: 'POST',
		url: 'https://dev-fyszmjwlhy8ftgjv.us.auth0.com/oauth/token',
		headers: { 'content-type': 'application/json' },
		body: '{"client_id":"1eB4PPI3CLokdir44cinFxzMllpkW8dd","client_secret":"EeaFRypu19a0icMlyP9JT4o5AmwxJyncaRsWBwM25tfQfeuQBIJhBBnBnUUumWbH","audience":"https://dev-fyszmjwlhy8ftgjv.us.auth0.com/api/v2/","grant_type":"client_credentials","scope":"read:users"}',
	};

	request(options, function (err, _, body) {
		if (err) throw new Error(err);

		parsedBody = JSON.parse(body);

		// console.log(parsedBody[3]);
		/*
		fetch(process.env.SMARTIES_API + '/public', {
			headers: {
				Authorization: 'Bearer ' + parsedBody[3] 
			}
		})
		*/

		fetch(process.env.SMARTIES_API + '/privateUsers', {
			headers: {
				Authorization: 'Bearer ' + parsedBody.access_token,
			},
		})
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				console.log(data);
				data = data.map((user) => ({ name: user.nickname, subjects: user.user_metadata.subjects }));

				res.render('tutors', { tutors: data });
			});
	});

	//	REDIRECT BACK TO PROFILE
	// res.redirect('/profile');
});

//  ROUTE - TUTORS (DISPLAY ALL TUTORS)
router.get('/tutors', requiresAuth(), (req, res) => {
	const request = require('request');

	//	GET ACCESS TOKEN
	const options = {
		method: 'POST',
		url: 'https://dev-fyszmjwlhy8ftgjv.us.auth0.com/oauth/token',
		headers: { 'content-type': 'application/json' },
		body: '{"client_id":"1eB4PPI3CLokdir44cinFxzMllpkW8dd","client_secret":"EeaFRypu19a0icMlyP9JT4o5AmwxJyncaRsWBwM25tfQfeuQBIJhBBnBnUUumWbH","audience":"https://dev-fyszmjwlhy8ftgjv.us.auth0.com/api/v2/","grant_type":"client_credentials","scope":"read:users"}',
	};

	request(options, function (err, _, body) {
		if (err) throw new Error(err);

		parsedBody = JSON.parse(body);

		// console.log(parsedBody[3]);
		/*
		fetch(process.env.SMARTIES_API + '/public', {
			headers: {
				Authorization: 'Bearer ' + parsedBody[3] 
			}
		})
		*/

		fetch(process.env.SMARTIES_API + '/privateUsers', {
			headers: {
				Authorization: 'Bearer ' + parsedBody.access_token,
			},
		})
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				console.log(data);
				data = data.map((user) => ({ name: user.nickname, subjects: user.user_metadata?.subjects ?? [] }));

				res.render('tutors', { tutors: data });
			});
	});
});

//  ROUTE - TUTORS (DISPLAY A SPECIFIC TUTOR)
router.get('/tutors/:id', requiresAuth(), (req, res) => {
	const { id } = req.params;

	//  GET SPECIFIC TUTOR (tutor-application)
	const tutor = mongo.getTutor(id);

	tutor.then(function (result) {
		console.log(result);

		//	DISPLAY PAGE using pug
		res.render('tutors', { tutors: [result] });

		/*
		//	DISPLAY PAGE using PREVIOUS METHOD (js, HTML)
		fs.readFile(__dirname + '/tutors.html', (err, data) => {
			if(err) 
			{
				res.status(404).end(JSON.stringify(err));
			}	

			res.setHeader('Content-Type', 'text/html');
			res.status(200).end(createPage(data));
		});
		*/
	});
});

//  ROUTE - RESERVATIONS (DISPLAY ALL RESERVATIONS)
router.get('/reservations', requiresAuth(), (req, res) => {
	//	GET ALL RESERVATIONS (tutor-application -> reservations)
	const reservations = mongo.getAllReservations();

	reservations.then(function (result) {
		//  console.log(result);

		//	DISPLAY PAGE using pug
		res.render('reservations', { reservations: result });
	});
});

//  ROUTE - RESERVATIONS (DISPLAY A SPECIFIC RESERVATION)
router.get('/reservations/:id', requiresAuth(), (req, res) => {
	const { id } = req.params;

	//	console.log(id);
	//	GET SPECIFIC RESERVATION
	const reservation = mongo.getReservation(id);

	reservation.then(function (result) {
		//  console.log(result);

		//	DISPLAY PAGE using pug
		res.render('reservations', { reservations: [result] });
	});
});

//  EXPORT - index.js CAN USE AS ROUTER
module.exports = router;
