/*
    ROUTER/ROUTE HANDLER
*/

//  NEED ACCESS TO MONGODB
const mongo = require('./mongo');

const express = require('express');
const router = express.Router();

//  ROUTE - HOMEPAGE
router.get('/', (req, res) => {
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

//	ROUTE - TUTOR (SIGN UP PAGE)
router.get('/signup', (req, res) => {
	res.render('tutorSignup');
});

//	ROUTE - POST (TUTOR SIGN UP PAGE)
router.post('/signup', (req, res) => {
	console.log(req.body);

	res.redirect('/')
})

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

    //	console.log(id);
	//	GET SPECIFIC RESERVATION
	const reservation = mongo.getReservation(id);

	reservation.then(function(result) {
		//  console.log(result);

		//	DISPLAY PAGE using pug
		res.render('reservations', { reservations: [result]});
	});
});

//  EXPORT - index.js CAN USE AS ROUTER
module.exports = router;