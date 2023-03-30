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

//  ROUTE - TUTORS (DISPLAY ALL TUTORS) Michael
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

//var tutor = require('../tutor');

// GET /tutorsignup
router.get('/tutorsignup', function(req, res, next) {

	res.render('tutorsignup');
});

// POST /tutorsignup
router.post('/tutorsignup', function(req, res, next) {
	var name = req.body.name;
	var email = req.body.email;
	var pw = req.body.pw;
	var subject = req.body.subject;

	var data = {
		"name":name,
		"email":email,
		"password":pw,
		"subject":subject
	}

	db.collection('details').insertOne(data,function(err, collection){
        if (err) throw err;
        console.log("Record inserted Successfully");
              
    });
          
    return res.redirect('signupSuccess.pug');
	/*	
	return res.send('Tutor created!');
	if (req.body.email &&
		req.body.name &&
		req.body.subject &&
		req.body.password &&
		req.body.comfirmPassword) {


			// checks if passwords match
			if (req.body.password !== req.body.comfirmPassword) {
				var err = new Error('Passwords do not match.');
				err.status = 400;
				return next(err);
			}
		}
		else{
			var err = new Error('All fields required.');
			err.status = 400;
			return next(err);
		}

}) */
});





/*
//  ROUTE - TUTORS (display signup_)Michael
router.get('/tutorsignup', function(req, res) {
   // const tutors = mongo.getAllTutors();
	res.render('tutorsignup', {tutorsignup: result});
   // tutors.then(function(result) {
		//	DISPLAY PAGE using pug
	//	res.render('tutors', { tutors: result});

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
		
	});
*/

/*
router.get('/handleForm', function(req, res){
	res.send("Handle Form Page....");
})

*/

//  ROUTE - TUTORS (DISPLAY A SPECIFIC TUTOR) Michael
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