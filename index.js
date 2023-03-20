// MAIN .JS FILE

//	TEST: USING EXPRESS
const express = require('express');
const expressApp = express();

//	TEST: USING MONGODB (Mongoose)
// import { mongoInit } from './mongo.js';
const mongo = require('./mongo');

const http = require('http');
const fs = require('fs');
const { create } = require('domain');

//	ADDRESS INFORMATION
const host = 'localhost';
const port = 8000;

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

//	TEST: DISPLAY TUTORS FROM /GET REQUEST
function createTutorPage(content)
{
	let header = fs.readFileSync(__dirname + '/header.html', 'utf8');
	let footer = fs.readFileSync(__dirname + '/footer.html', 'utf8');

	let page = `<!DOCTYPE html><html>
				${header}${content}${footer}
				</html>`;
	page = page.replaceAll('{{dir}}', __dirname);
	return page;
}

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

//	TEST: SET TEMPLATE FILE DIRECTORY TO views
expressApp.set('views', './views');

//	TEST: SET VIEW ENGINE TO pug
expressApp.set('view engine', 'pug');

//	TEST: EXPRESS STUFF
expressApp.listen(port, host, () => {
	console.log(`EXPRESS RUNNING: http://${host}:${port}`)
});

//	TEST: USING EXPRESS - LOAD STATIC FILES (CSS)
expressApp.use(express.static(__dirname + '/node_modules/bootstrap/dist/css'));
expressApp.use(express.static(__dirname + '/node_modules/bootstrap/dist/js'));
expressApp.use(express.static(__dirname + '/images'));
//	Need to fix favicon not appearing 
expressApp.use(express.static(__dirname + '/favicon_io'));
expressApp.use(express.static(__dirname + '/css'));

// TEST: EXPRESS - HANDLE HOMEPAGE
expressApp.get('/', (req, res) => {
	fs.readFile(__dirname + '/index.html', (err, data) => {
		if(err) {
			res.status(404).end(JSON.stringify(err));
		}	

		res.setHeader('Content-Type', 'text/html');
		res.status(200).end(createPage(data));
	})
})

// TEST: EXPRESS - HANDLE TUTORS
expressApp.get('/tutors', (req, res) => {

	//	GET ALL DATABASE ITEMS (tutor-application)
	const databaseItems = mongo.getAllTutors();

	databaseItems.then(function(result) {
		console.log(result);

		//	DISPLAY PAGE using pug
		res.render('tutors', { tutors: result});

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

/*
const server = http.createServer(requestListener);

server.listen(port, host, () => {
	console.log(`Server is running on http://${host}:${port}`);
});
*/