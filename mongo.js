/*
    03/19/2023
    Separate .js file that handles MongoDB stuff
*/

//  USERNAME AND PASSWORD
username = 'gmaster234'
password = '8OvIsqflM7POC5Dx'

//	TEST: MONGODB STUFF
const {MongoClient} = require('mongodb');

//	MONGODB CONNECTION STRING (URI)
const mongoConnection = `mongodb+srv://${username}:${password}@t2-project-cluster.yya5asd.mongodb.net/?retryWrites=true&w=majority`

const mongoClient = new MongoClient(mongoConnection)

//  EXPORTING FUNCTION
//	TEST: MONGODB STUFF
async function mongoInit()
{
	//	CONNECT TO THE MONGODB CLUSTER
	try
	{
		await mongoClient.connect().then(() => {
			console.log('SUCCESSFULLY CONNECTED TO DATABASE!');
		});
	}
	catch (err)
	{
		console.error(err);
	}
	finally
	{
		await mongoClient.close();
	}

}

//  TEST: DISPLAY ALL TUTORS
async function getAllTutors()
{
    const tutors = await mongoClient.db('tutor-application')
        .collection('tutors')
        .find();

    const tutorsArray = await tutors.toArray();

    return tutorsArray;
}

//	TEST: DISPLAY A SPECIFIC TUTOR
async function getTutor(id)
{
	//	console.log(typeof parseInt(id))
	const tutor = await mongoClient.db('tutor-application')
		.collection('tutors')
		.findOne({ user_id: parseInt(id)});

	// const tutorArray = await tutor.toArray();

	// console.log(tutorArray)

	return tutor;
}

//	TEST: DISPLAY ALL RESERVATIONS
async function getAllReservations()
{
	const reservations = await mongoClient.db('tutor-application')
		.collection('reservations')
		.find();

	const reservationsArray = await reservations.toArray();

	return reservationsArray;
}

//	TEST: DISPLAY SPECIFIC RESERVATION
async function getReservation(id)
{
	const reservation = await mongoClient.db('tutor-application')
		.collection('reservations')
		.findOne({ number: parseInt(id)});

	return reservation;
}

//	TEST: MONGODB STUFF - LIST ALL DATABASES
async function listDatabases(client)
{
	databasesList = await client.db().admin().listDatabases();

	console.log(databasesList.databases);

}

//  EXPORT THIS SO IT'S USABLE BY index.js
exports.getAllTutors = getAllTutors;
exports.getTutor = getTutor;
exports.getAllReservations = getAllReservations;