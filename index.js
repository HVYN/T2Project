// MAIN .JS FILE

//	USING EXPRESS
const express = require('express');
const expressSession = require('express-session');
const expressApp = express();

//	ROUTER FILE - CONTAINS ALL PATHS
const mainRouter = require('./route');

//	USING MONGODB (Mongoose)
const mongo = require('./mongo');

//	USING AUTH0
const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');

//	PASSPORT.JS
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

//	CONFIGURE .env / process.env
require('dotenv').config();

//	AUTH0 ROUTER
//	const authRouter = require('./auth');

const http = require('http');
const fs = require('fs');
//	const { create } = require('domain');

//	ADDRESS INFORMATION
const host = 'localhost';
const port = 8000;

//	USING EXPRESS - LOAD STATIC FILES
expressApp.use(express.static(__dirname + '/node_modules/bootstrap/dist/css'));
expressApp.use(express.static(__dirname + '/node_modules/bootstrap/dist/js'));
expressApp.use(express.static(__dirname + '/images'));
expressApp.use(express.static(__dirname + '/favicon_io'));
expressApp.use(express.static(__dirname + '/css'));

/*
//	ALL OF OUR ASSETS ARE HERE, INCLUDING IMAGES
const ASSETS = {
	'bootstrap.min.css': { url: '/node_modules/bootstrap/dist/css/bootstrap.min.css', type: 'text/css' },
	'bootstrap.min.css.map': { url: '/node_modules/bootstrap/dist/css/bootstrap.min.css.map', type: 'application/json' },
	'bootstrap.min.js': { url: '/node_modules/bootstrap/dist/js/bootstrap.min.js', type: 'text/javascript' },
	'bootstrap.min.js.map': { url: '/node_modules/bootstrap/dist/js/bootstrap.min.js.map', type: 'application/json' },
	'logo.png' : { url: '/images/logo.png', type: 'image/png'},
	'favicon.ico': { url: '/favicon_io/favicon.ico', type: 'image/x-icon' },
	'stockphoto.png' : { url: '/images/stockphoto.png', type: 'image/png'},
	'grayBg.png' : {url: '/images/grayBg.png', type: 'image/png'},
	'orangeBg.png' : {url: '/images/orangeBg.png', type: 'image/png'},
	'custom.css' : {url: '/custom.css', type: 'text/css'},
	'transparent.png': {url: '/transparent.png', type: 'image/png'}
};
*/

/*
//	CREATEPAGE ALWAYS LOADS FOOTER AND HEADER
//	THE ACTUAL PAGE WILL BE LOADED AS NEEDED
function createPage(content) 
{
	let header = fs.readFileSync(__dirname + '/header.html', 'utf8');
	let footer = fs.readFileSync(__dirname + '/footer.html', 'utf8');

	let page = `<!DOCTYPE html><html>
				${header}${content}${footer}
				</html>`;
	page = page.replaceAll('{{dir}}', __dirname);
	return page;
}
*/

/*
//	WHAT THE USER CLICKS ON, THEIR 'REQUESTS' ARE SENT HERE TO BE
//	INTERPRETED, AND REDIRECTED
const requestListener = function (req, res) {
	let url = req.url.substring(1);

	//	IF THE PAGE NEEDS SOMETHING FORM ASSETS (LIKE AN IMAGE)
	if (url in ASSETS) {
		let asset = ASSETS[url];
		fs.readFile(__dirname + asset.url, (err, data) => {
			if (err) {
				res.writeHead(404);
				res.end(JSON.stringify(err));
				return;
			}
			res.setHeader('Content-Type', asset.type);
			res.writeHead(200);
			res.end(data);
		});
		return;
	}

	//	IF USER IS TRYING TO REACH TUTORS PAGE
	if (url == 'tutors.html')
	{
		fs.readFile(__dirname + '/tutors.html', (err, data) => {
			if (err)
			{
				res.writeHead(404);
				res.end(JSON.stringify(err));
				return;
			}
			res.setHeader('Content-Type', 'text/html');
			res.writeHead(200);
			res.end(createPage(data));
		});
		return;
	}

	//	HOMEPAGE; IF NO SPECIFIC .HTML PAGE, THEN IT'S
	//	ALSO HOMEPAGE
	if (url == '' || url == 'index.html') {
		fs.readFile(__dirname + '/index.html', (err, data) => {
			if (err) {
				res.writeHead(404);
				res.end(JSON.stringify(err));
				return;
			}
			res.setHeader('Content-Type', 'text/html');
			res.writeHead(200);
			res.end(createPage(data));
		});
		return;
	}

	//	IF AN UNKNOWN RESOURCE IS REQUESTED, PRINT
	//	TO CONSOLE
	console.log(`Unknown url: "${url}"`);
};
*/

//	CONFIG FOR AUTH0
const config = {
	authRequired: false,
	auth0Logout: true,
	secret: 'e059c36d6b0f159ab28a74835ca3267c52166cb39a8ae3f52c2192a539192bdd',
	baseURL: 'http://localhost:8000',
	clientID: process.env.AUTH0_CLIENT_ID,
	issuerBaseURL: 'https://dev-fyszmjwlhy8ftgjv.us.auth0.com'
  };

/*
  SESSION CONFIGURATION
*/
const session = {
	secret: process.env.SESSION_SECRET,
	cookie: {},
	resave: false,
	saveUnitialized: false
};

/*
	PASSPORT CONFIGURATION
*/
const strategy = new Auth0Strategy(
	{
		domain: process.env.AUTH0_DOMAIN,
		clientID: process.env.AUTH0_CLIENT_ID,
		clientSecret: process.env.AUTH0_CLIENT_SECRET,
		callbackURL: process.env.AUTH0_CALLBACK_URL
	},

	function(accessToken, refreshToken, extraParams, profile, done) {
		return done(null, profile);
	}
);

if(expressApp.get('env') === 'production')
{
	session.cookie.secure = true;
}

//	AUTH0 - ATTACHES /login, /logout, and /callback to baseURL
expressApp.use(auth(config));

//	SET TEMPLATE FILE DIRECTORY TO views
expressApp.set('views', './views');

//	SET VIEW ENGINE TO pug
expressApp.set('view engine', 'pug');

//	EXPRESS SESSION
expressApp.use(expressSession(session));

//	SETUP PASSPORT
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

//	EXPRESS START, LISTEN TO SPECIFIED HOST:PORT
expressApp.listen(port, host, () => {
	console.log(`EXPRESS RUNNING: http://${host}:${port}`)
});

//	AUTHENTICATION MIDDLEWARE (EXPRESS)
expressApp.use((req, res, next) => {
	res.locals.isAuthenticated = req.isAuthenticated();

	next();
})

//	LOAD PATHS FROM ROUTER FILE
expressApp.use('/', mainRouter);
expressApp.use('/tutors', mainRouter);
expressApp.use('/tutors/:id', mainRouter);
expressApp.use('/reservations', mainRouter);

//	EXPRESS / AUTH0 (TEST)
expressApp.get('/profile', requiresAuth(), (req, res) => {
	res.send(JSON.stringify(req.oidc.user));
});

//	EXPRESS/AUTH0 - LOGIN
expressApp.get('/login', passport.authenticate('auth0', {
	scope: 'openid email profile'
}),
(req, res) => {
	res.redirect('/');
});

//	EXPRESS/AUTH0 - CALLBACK
expressApp.get('/callback', (req, res, next) => {
	passport.authenticate('auth0', (err, user, info) => {
		if(err) {
			return next(err);
		}

		if(!user) {
			return res.redirect('/login');
		}

		req.logIn(user, (err) => {
			if(err) {
				return next(err);
			}

			const returnTo = req.session.returnTo;
			delete req.session.returnTo;

			res.redirect(returnTo || '/');
		});

	})(req, res, next);
});

//	EXPRESS/AUTH0 - LOGOUT
expressApp.get('/logout', (req, res) => {
	req.logOut();
});

//	FLESH OUT ERROR CATCHING SYSTEM LATER
//	ERROR PAGE TO CATCH BAD REQUESTS
expressApp.all('*', function(req, res) {
	res.render('error');

});

//	ERROR PAGE MIDDLEWARE
expressApp.use((err, req, res, next) => {
	res.render('error');
});

/*
const server = http.createServer(requestListener);

server.listen(port, host, () => {
	console.log(`Server is running on http://${host}:${port}`);
});
*/