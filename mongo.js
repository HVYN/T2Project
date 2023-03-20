/*
    03/19/2023
    Separate .js file that handles MongoDB stuff
*/

//	TEST: MONGODB STUFF
const {MongoClient} = require('mongodb');

//	MONGODB CONNECTION STRING (URI)
const mongoConnection = "mongodb+srv://<username>:<password>@t2-project-cluster.yya5asd.mongodb.net/?retryWrites=true&w=majority"

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

//  TEST: DISPLAY TUTOR-APPLICATION DATABASE
async function getAllTutors()
{
    const database = await mongoClient.db('tutor-application')
        .collection('tutors')
        .find();

    const databaseItems = await database.toArray();

    return databaseItems;
}

//	TEST: MONGODB STUFF - LIST ALL DATABASES
async function listDatabases(client)
{
	databasesList = await client.db().admin().listDatabases();

	console.log(databasesList.databases);

}

//  EXPORT THIS SO IT'S USABLE BY index.js
exports.mongoInit = mongoInit;
exports.getAllTutors = getAllTutors;
