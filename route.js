/*
    ROUTER/ROUTE HANDLER
*/

//  NEED ACCESS TO MONGODB
const mongo = require('./mongo');

const express = require('express');
const router = express.Router();

//  ROUTE - HOMEPAGE
router.get('/', (req, res) => {

    //  OLD METHOD
    /*
	fs.readFile(__dirname + '/index.html', (err, data) => {
		if(err) {
			res.status(404).end(JSON.stringify(err));
		}	
		
		res.setHeader('Content-Type', 'text/html');
		res.status(200).end(createPage(data));
	})
	*/

    res.render('index');
});
router.get('/newRes', function(req, res, next) {
	res.render('newRes');
});

// POSt /newRes
router.post('/newRes', function(req, res, next) {
	var name = req.body.name;
	var subject = req.body.subject;
	var date = req.body.date;
	var time = req.body.time;
	console.log(req.body);
	res.render('index');
});



router.get('/tutorSignup', function(req, res, next) {
	res.render('tutorSignup');
});

// POST /tutorsignup

router.post('/tutorSignup', function(req, res, next) {
	var name = req.body.name;
	var email = req.body.email;
	var subject = req.body.subject;
	var pw = req.body.pw;
	var pw2 = req.body.pw2;
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

//  ROUTE - TUTORS (DISPLAY ALL TUTORS)
router.get('/tutors', (req, res) => {
    const tutors = mongo.getAllTutors();

    tutors.then(function(result) {
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

//  ROUTE - TUTORS (DISPLAY A SPECIFIC TUTOR)
router.get('/tutors/:id', (req, res) => {
    const { id } = req.params;

    //  GET SPECIFIC TUTOR (tutor-application)
    const tutor = mongo.getTutor(id);

    tutor.then(function(result) {
		console.log(result);

		//	DISPLAY PAGE using pug
		res.render('tutors', { tutors: [result]});

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
router.get('/reservations', (req, res) => {
    //	GET ALL RESERVATIONS (tutor-application -> reservations)
	const reservations = mongo.getAllReservations();

	reservations.then(function(result) {
        //  console.log(result);

		//	DISPLAY PAGE using pug
		res.render('reservations', { reservations: result});
	});
});

//  ROUTE - RESERVATIONS (DISPLAY A SPECIFIC RESERVATION)
router.get('/reservations/:id', (req, res) => {
    const { id } = req.params;

    console.log(id);
	//	GET SPECIFIC RESERVATION
	const reservation = mongo.getReservation(id);

	reservation.then(function(result) {
		//  console.log(result);

		//	DISPLAY PAGE using pug
		res.render('reservations', { reservations: [result]});
	});
});

//  EXPORT SO index.js CAN USE AS ROUTER
module.exports = router;