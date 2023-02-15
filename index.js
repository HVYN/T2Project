const http = require('http');
const fs = require('fs');

const host = 'localhost';
const port = 8000;

function createPage(content) {
	let header = fs.readFileSync(__dirname + '/header.html', 'utf8');
	let footer = fs.readFileSync(__dirname + '/footer.html', 'utf8');
	let page = `<!DOCTYPE html><html>${header}${content}${footer}</html>`;
	page = page.replaceAll('{{dir}}', __dirname);
	return page;
}

const requestListener = function (req, res) {
	let url = req.url.substring(1);
	console.log(url);

	if (url == 'bootstrap.min.css') {
		fs.readFile(__dirname + '/node_modules/bootstrap/dist/css/bootstrap.min.css', (err, data) => {
			if (err) {
				res.writeHead(404);
				res.end(JSON.stringify(err));
				return;
			}
			res.setHeader('Content-Type', 'text/css');
			res.writeHead(200);
			res.end(data);
		});
		return;
	}
	if (url == 'bootstrap.min.js') {
		fs.readFile(__dirname + '/node_modules/bootstrap/dist/js/bootstrap.min.js', (err, data) => {
			if (err) {
				res.writeHead(404);
				res.end(JSON.stringify(err));
				return;
			}
			res.setHeader('Content-Type', 'text/css');
			res.writeHead(200);
			res.end(data);
		});
		return;
	}

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
	}
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
	console.log(`Server is running on http://${host}:${port}`);
});
