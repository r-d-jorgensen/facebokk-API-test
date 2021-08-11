require('dotenv').config({ path: '.env' });
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const https = require('https');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json({limit: '50mb'}));
app.use(cors());

const sslServer = https.createServer({
  key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
}, app);

const WEB_PORT = process.env.WEB_PORT || 8000;
sslServer.listen(WEB_PORT, () => console.log(`Secure server on port ${WEB_PORT}...`));

//there is not nearly enough data checking going on in these calls... security is abysmal
//some quiery escaping should be done for all queries
//may need to implement a pool type connection for post call
//post calls need to be self contained and not bring in data from outside only facebook
const dbConnection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
	database: process.env.DB_DATABASE,
});

//may need to open and close the connection for each call
dbConnection.connect((err) => {
	if (err) {
		console.error("Database connection failed:\n" + err.stack);
		return;
	}
	console.log("Connected to database.");
});

//shift routs to own page
app.get('/facebook/user/:facebookID', (req, res, next) => {
  const query = `select * from users where facebook_id = ${req.params.facebookID}`;
	dbConnection.query(query, (err, data) => {
		if (err) {
			console.error("Failed to get data from the server:\n" + err.stack);
			res.status(500);
			return;
		}
		res.status(200).json(data);
	});
});

app.post('/facebook/user', (req, res, next) => {
  const newUser = req.body.data
	const query = `
		insert into users 
		values (
			default,
			${newUser.user_type_ENUM_id},
			${newUser.facebook_id},
			'${newUser.username}',
			${newUser.user_password},
			'${newUser.email}');`;
		console.log(query)
	dbConnection.query(query, (err, result) => {
		if (err) {
			console.error("Failed to post data to the server:\n" + err.stack);
			res.status(500);
			return;
		}
		newUser["user_id"] = result.insertId;
		res.status(200).json(newUser);
	});
});

app.get('/facebook/posts/:id', (req, res, next) => {
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
		where posts.user_id = ${req.params.id};`
	
	dbConnection.query(query, (err, result) => {
		if (err) {
			console.error("Failed to get data from the DB:\n" + err.stack);
			res.status(500);
			return;
		}
		console.log('Data has been retrieved from the DB');
		res.status(200).json(result);
	});
});

//there are far too many for loops here for my liking but im not sure how to get around it
//this god forsaken mess needs to be refactored
//best idea is to use promises to flaten it out
app.post('/facebook/posts/:id', (req, res, next) => {
	req.body.data.forEach((post) => {
		//insert post and retain id
		const postQuery = `insert into posts values (
			default,
			${req.params.id},
			1,
			1,
			\'${new Date(post.created_at).toISOString().split('T')[0]}}\',
			\'${post.message}\');`
		
		//the begining of the pain
		dbConnection.query(postQuery, (err, result) => {
			if (err) {
				console.error("Failed to post data to DB:\n" + err.stack);
				res.status(500);
				return;
			}
			let post_id = result.insertId;
			//insert all images assosiated with he post using the post_id
			//why call inside... because it wont let post_id out
			post.images.forEach((image) => {
				const imageQuery = `insert into images values (
					default,
					${req.params.id},
					1,
					1,
					\'${image.src_link}\',
					\'${image.width}\',
					\'${image.height}\',
					null,
					null);`
				
				dbConnection.query(imageQuery, (err, result) => {
					if (err) {
						console.error("Failed to post data to DB:\n" + err.stack);
						res.status(500);
						return;
					}
					let image_id = result.insertId;

					//insert a post_attachemnt row with the post_id and image_id
					//ya it won't let image_id out ether.. so just call deeper
					const attachmentQuery = `insert into post_attachments values (
						default,
						${post_id},
						${image_id});`
					
					dbConnection.query(attachmentQuery, (err) => {
						if (err) {
							console.error("Failed to post data to DB:\n" + err.stack);
							res.status(500);
							return;
							//never before have I seen that many sets of exits... and i hope i dont again
						}
					});
				});
			});
		});
	});

	res.status(200);
	console.log('Data has been posted to the DB');
});

app.get('/facebook/photos/:id', (req, res, next) => {
	const query = `
		select
			image_id,
			src_link,
			width,
			height,
			caption,
			created_at
		from images
		where user_id = ${req.params.id}`
	
	dbConnection.query(query, (err, result) => {
		if (err) {
			console.error("Failed to get data from DB:\n" + err.stack);
			res.status(500);
			return;
		}
		console.log('Data has been reterieved from the DB');
		res.status(200).json(result);
	});
});

app.post('/facebook/photos/:id', (req, res, next) => {
	let query = `insert into images values `;
	//user_id needs to be pulled from req.params
	//data needs to be checked BEFORE use
	//should be a limit on how big this insert can get
	req.body.data.forEach((image) => {
		query += `(
			default,
			${req.params.id},
			1,
			2,
			\'${image.images[0].source}\',
			${image.images[0].width},
			${image.images[0].height},
			${null},
			\'${new Date(image.created_time).toISOString().split('T')[0]}\'),`
	});
	query = query.slice(0, -1);

	dbConnection.query(query, (err) => {
		if (err) {
			console.error("Failed to post data to DB:\n" + err.stack);
			res.status(500);
			return;
		}
		console.log('Data has been posted to the DB');
		res.status(200);
	});
});