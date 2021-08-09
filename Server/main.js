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

const dbConnection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
	database: process.env.DB_DATABASE,
});

dbConnection.connect((err) => {
	if (err) {
		console.error("Database connection failed:\n" + err.stack);
		return;
	}
	console.log("Connected to database.");
});

//shift routs to own page
app.get('/user', (req, res, next) => {
  const query = `select * from users where user_id = ${req.body.id}`;
	dbConnection.query(query, (err, data) => {
		if (err) {
			console.error("Failed to get data from the server:\n" + err.stack);
			return;
		}
		res.status(200).json(data);
	});
});

app.get('/facebook/posts/:id', (req, res, next) => {
	res.status(200);
});

app.post('/facebook/posts', (req, res, next) => {
	res.status(200);
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
	dbConnection.query(query, (err, data) => {
		if (err) {
			console.error("Failed to get data from DB:\n" + err.stack);
			return;
		}
		console.log('Data has been reterieved from the DB');
		res.status(200).json(data);
	});
});

app.post('/facebook/photos', (req, res, next) => {
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
			return;
		}
		console.log('Data has been posted to the DB');
		res.status(200);
	});
});