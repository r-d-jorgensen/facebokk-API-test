require('dotenv').config({ path: '.env' });
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const https = require('https');
const path = require('path');
const fs = require('fs');
const Joi = require('joi');

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(cors());

const sslServer = https.createServer({
	key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
	cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
}, app);

const WEB_PORT = process.env.WEB_PORT || 8000;
sslServer.listen(WEB_PORT, () => console.log(`Secure server on port ${WEB_PORT}...`));

const dbConnection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
	database: process.env.DB_DATABASE,
});

// TODO: May need to open and close the connection for each call
dbConnection.connect((err) => {
	if (err) {
		console.error("Database connection failed:\n" + err.stack);
		return;
	}
	console.log("Connected to database.");
});

app.get('/', (req, res) => {
	res.send("This is a help and doc page response");
});

app.get('/user/facebook/:facebookID', (req, res) => {
	const query = `select * from users where facebook_id = ${req.params.facebookID}`;
	dbConnection.query(query, (err, data) => {
		if (err) {
			console.error("Failed to get user from the DB:\n" + err.stack);
			res.status(500);
			return;
		}
		console.error("Retrieved user from the DB");
		res.status(200).json(data);
	});
});

app.post('/user/facebook', (req, res) => {
	const newUser = req.body.data
	const query = `
		insert into users 
		values (
			default,
			${newUser.user_type_ENUM_id},
			${newUser.facebook_id},
			'${newUser.username}',
			${newUser.user_password},
			'${newUser.email}'
		);`;

	dbConnection.query(query, (err, result) => {
		if (err) {
			console.error("Failed to post user to the server:\n" + err.stack);
			res.status(500);
			return;
		}
		newUser["user_id"] = result.insertId;
		res.status(200).json(newUser);
	});
});

// Delete user from DB and all data assosiated
app.delete('/user/:user_id', (req, res) => {
	console.log(req); // TRACE
	const schema = Joi.object({ user_id: Joi.number().integer().positive().required() });
	const { error, value: user_id } = schema.validate({ user_id: req.params.user_id });
	if (error) {
		console.log(`User has sent bad user_id, ${req.params.user_id}, to server`); // WARN
		console.log(error.details.message) // DEBUG
		console.log(error); // TRACE
		res.status(400).json(error);
		return;
	}

	console.log(`User with id: ${user_id} sent delete query to DB`); // DEBUG
	dbConnection.query("delete from users where user_id = ?;", user_id, (error, results, fields) => {
		if (error) {
			console.log(`Failed to delete user with id ${user_id} to the server`); // ERROR
			console.log(error.stack); // DEBUG
			console.log(error); // TRACE
			res.status(500).send(`DB query failed with error ${error.stack}`);
			return;
		}
		console.log(`User, ${user_id}, has been deleted from the DB`); // INFO
		console.log(results); // DEBUG
		console.log(fields); // TRACE
		res.status(200);
	});
});

app.get('/posts/facebook/:user_id', (req, res) => {
	const query = `
		select
			post_id,
			post_type_ENUM_id,
			posts.created_at,
			posts.message,
			images.src_link,
			images.width,
			images.height
		from posts
		inner join post_attachments using(post_id)
		inner join images using(image_id)
		where
			posts.user_id = ${req.params.user_id} and
			structure_type_ENUM_id = 1;`;

	dbConnection.query(query, (err, result) => {
		if (err) {
			console.error("Failed to get posts from the DB:\n" + err.stack);
			res.status(500);
			return;
		}
		console.log('Posts has been retrieved from the DB');
		res.status(200).json(result);
	});
});

// TODO: Refactor the call using promises to remove the callbacks
app.post('/posts/facebook/:user_id', (req, res) => {
	newSynco(req.params.user_id, req.body.deepest_checkpoint, 1, 1, req.body.passedSyncs);
	if (req.body.posts.length === 0) {
		console.log('No posts recieved');
		res.status(200);
		return
	};

	req.body.posts.forEach((post) => {
		// Insert post and retain id
		const postQuery = `insert into posts
		values (
			default,
			${req.params.user_id},
			1,
			1,
			'${new Date(post.created_at).toISOString()}}',
			'${post.message}'
		);`

		// The begining of the pain
		dbConnection.query(postQuery, (err, result) => {
			if (err) {
				console.error("Failed to post posts to DB:\n" + err.stack);
				res.status(500);
				return;
			}
			let post_id = result.insertId;
			// Insert all images assosiated with he post using the post_id
			// Why call inside... because it wont let post_id out
			post.images.forEach((image) => {
				const imageQuery = `insert into images values (
					default,
					${req.params.user_id},
					1,
					1,
					\'${image.src_link}\',
					\'${image.width}\',
					\'${image.height}\',
					null,
					null);`

				dbConnection.query(imageQuery, (err, result) => {
					if (err) {
						console.error("Failed to post images to DB:\n" + err.stack);
						res.status(500);
						return;
					}
					let image_id = result.insertId;

					// Insert a post_attachemnt row with the post_id and image_id
					// Ya it won't let image_id out ether.. so just call deeper
					const attachmentQuery = `insert into post_attachments values (
						default,
						${post_id},
						${image_id});`

					dbConnection.query(attachmentQuery, (err) => {
						if (err) {
							console.error("Failed to post attachments to DB:\n" + err.stack);
							res.status(500);
							return;
							// Never before have I seen that many sets of exits... and i hope i dont again
						}
					});
				});
			});
		});
	});

	res.status(200);
	console.log('Data has been posted to the DB');
});

app.get('/photos/facebook/:user_id', (req, res) => {
	const query = `
		select
			image_id,
			src_link,
			width,
			height,
			caption,
			created_at
		from images
		where
			user_id = ${req.params.user_id} and
			structure_type_ENUM_id = 2`;
	dbConnection.query(query, (err, result) => {
		if (err) {
			console.error("Failed to get photos from DB:\n" + err.stack);
			res.status(500);
			return;
		}
		console.log('Photos has been retrieved from the DB');
		res.status(200).json(result);
	});
});

// TODO: Needs to return the posted photos with thier corisponding photo_id's
app.post('/photos/facebook/:user_id', (req, res) => {
	newSynco(req.params.user_id, req.body.deepest_checkpoint, 1, 2);
	if (req.body.photos.length === 0) {
		console.log('No photos recieved');
		res.status(200);
		return
	};

	req.body.photos.forEach((photo) => {
		const inserts = [
			'default',
			req.params.user_id,
			1,
			2,
			photo.src_link,
			photo.width,
			photo.height,
			photo.caption,
			photo.created_at
		];
		//const query = "insert into images value";
		dbConnection.query("insert into images values ( ? )", [inserts], (err) => {
			if (err) {
				console.error("Failed to photos data to DB:\n" + err.stack);
				res.status(500);
				return;
			}
			return;
		});
	});
	console.log('Photos has been posted to the DB');
	res.status(200);
});

app.get('/sync/:structure_type_ENUM/facebook/:user_id', (req, res) => {
	// TODO: Change to joins to make more legible and expandable
	let structure_type_ENUM_id = 0;
	if (req.params.structure_type_ENUM === 'post') structure_type_ENUM_id = 1;
	else if (req.params.structure_type_ENUM === 'photo') structure_type_ENUM_id = 2;
	else {
		console.log(`Format type ${req.params.structure_type_ENUM} is not supported`)
		res.status(400);
	}
	const query = `
	select
		sync_id,
		synced_at,
		deepest_checkpoint
	from syncs
	where
		user_id = ${req.params.user_id} and
		structure_type_ENUM_id = ${structure_type_ENUM_id}`;
	dbConnection.query(query, (err, result) => {
		if (err) {
			console.error("Failed to retrieved syncs from the DB:\n" + err.stack);
			return;
		}
		console.log('Sync has been retrieved from the DB');
		res.status(200).json(result);
	});
});

// Creates sync entity when user makes calls to outside locations
// TODO: Should look into making this a midleware for post queries
// TODO: Return value for checking success of failure
function newSynco(user_id, deepest_checkpoint, origin_ENUM_id, structure_type_ENUM_id, passedSyncs) {
	if (deepest_checkpoint === 'floor') {
		// TODO: update the latest sync not delete then return
		const syncQuery = `
		delete from syncs
		where
			origin_ENUM_id = ${origin_ENUM_id} and
			structure_type_ENUM_id = ${structure_type_ENUM_id}`;

		dbConnection.query(syncQuery, (err) => {
			if (err) {
				console.error("Failed to remove Sync from the DB:\n" + err.stack);
				return;
			}
			console.log('Sync has been removed from the DB');
		});
	} else {
		passedSyncs.forEach((sync_id) => {
			dbConnection.query(`delete from syncs where sync_id = ${sync_id}`, (err) => {
				if (err) {
					console.error("Failed to removed Sync to the DB:\n" + err.stack);
					return;
				}
				console.log('Sync has been removed to the DB');
			});
		});
	}
	const syncQuery = `
	insert into syncs
	values (
		default,
		${user_id},
		${origin_ENUM_id},
		${structure_type_ENUM_id},
		'${new Date().toISOString()}',
		'${deepest_checkpoint}'
	)`;

	dbConnection.query(syncQuery, (err) => {
		if (err) {
			console.error("Failed to post Sync to the DB:\n" + err.stack);
			return;
		}
		console.log('Sync has been posted to the DB');
	});
}