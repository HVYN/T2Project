//	MAIN .JS FILE

//	USING EXPRESS
const express = require('express')
const expressApp = express()

//	const expressSession = require('express-session')

const bodyParser = require('body-parser')

//	ROUTER FILE - CONTAINS ALL PATHS
const mainRouter = require('./route')

//	USING MONGODB (Mongoose)
const mongo = require('./mongo')

//	USING AUTH0
//	const { auth } = require('express-openid-connect')

//	PASSPORT.JS
//	const passport = require('passport')
//	const Auth0Strategy = require('passport-auth0')

//	CONFIGURE .env / process.env
require('dotenv').config()

//	AUTH0 ROUTER
//	const authRouter = require('./auth');

//	const http = require('http')
//	const fs = require('fs')
//	const { create } = require('domain');

//	ADDRESS INFORMATION
const host = 'localhost'
const port = 8000

//	USING EXPRESS - LOAD STATIC FILES
expressApp.use(express.static('./node_modules/bootstrap/dist/css'))
expressApp.use(express.static('./node_modules/bootstrap/dist/js'))
expressApp.use(express.static('./images'))
expressApp.use(express.static('./favicon_io'))
expressApp.use(express.static('./css'))

expressApp.use(bodyParser.json())
expressApp.use(bodyParser.urlencoded({ extended: false }))

/*
//	CONFIG FOR AUTH0
const config = {
	authRequired: false,
	auth0Logout: true,
	secret: process.env.SESSION_SECRET,
	baseURL: 'http://localhost:8000',
	clientID: process.env.AUTH0_CLIENT_ID,
	issuerBaseURL: 'https://dev-fyszmjwlhy8ftgjv.us.auth0.com'
};
*/

/*
  SESSION CONFIGURATION

const session = {
	secret: process.env.SESSION_SECRET,
	cookie: {},
	resave: false,
	saveUninitialized: false
};
*/

/*
	PASSPORT CONFIGURATION

const strategy = new Auth0Strategy(
	{
		domain: process.env.AUTH0_DOMAIN,
		clientID: process.env.AUTH0_CLIENT_ID,
		clientSecret: process.env.AUTH0_CLIENT_SECRET,
		callbackURL: process.env.AUTH0_CALLBACK_URL
	},

	function(accessToken, refreshToken, extraParams, profile, done) {
		console.log(accessToken)
		return done(null, profile);
	}
);
*/

if(expressApp.get('env') === 'production')
{
	session.cookie.secure = true;
}

//	AUTH0 - ATTACHES /login, /logout, and /callback to baseURL
//	expressApp.use(auth(config));

//	SET TEMPLATE FILE DIRECTORY TO views
expressApp.set('views', './views');

//	SET VIEW ENGINE TO pug
expressApp.set('view engine', 'pug');

//	EXPRESS SESSION
//	expressApp.use(expressSession(session));

//	SETUP PASSPORT
/*
passport.use(strategy);
expressApp.use(passport.initialize());
expressApp.use(passport.session());

//	PASSPORT SERIALIZATION
passport.serializeUser((user, done) => {
	done(null, user);
  });
  
passport.deserializeUser((user, done) => {
	done(null, user);
});
*/

//	EXPRESS START, LISTEN TO SPECIFIED HOST:PORT
expressApp.listen(port, host, () => {
	console.log(`EXPRESS RUNNING: http://${host}:${port}`)
});

//	AUTHENTICATION MIDDLEWARE (EXPRESS)
/*
expressApp.use((req, res, next) => {
	res.locals.isAuthenticated = req.isAuthenticated();

	next();
})
*/

//	LOAD PATHS FROM ROUTER FILE
expressApp.use('/', mainRouter);
expressApp.use('/tutors', mainRouter);
expressApp.use('/tutors/:id', mainRouter);
expressApp.use('/tutorSignup', mainRouter);
expressApp.use('/reservations', mainRouter);
expressApp.use('/reservations/:id', mainRouter);
expressApp.use('/login', mainRouter);
expressApp.use('/callback', mainRouter);
expressApp.use('/logout', mainRouter);
expressApp.use('/profile', mainRouter);

//	API TEST
/* expressApp.get('/api/public', function(req, res) {
	res.json({
		message: '(TESTING)'
	})
})
*/

//	FLESH OUT ERROR CATCHING SYSTEM LATER
//	ERROR PAGE TO CATCH BAD REQUESTS
expressApp.all('*', function(req, res) {
	res.render('error');

});

//	ERROR PAGE MIDDLEWARE
expressApp.use((err, req, res, next) => {
	console.log(err);

	res.render('error');
});