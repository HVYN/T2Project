// MAIN .JS FILE

const http = require('http');
const fs = require('fs');

const host = 'localhost';
const port = 8000;

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

const server = http.createServer(requestListener);
server.listen(port, host, () => {
	console.log(`Server is running on http://${host}:${port}`);
});