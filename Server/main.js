const express = require('express');
const https = require('https');
const path = require('path');
const fs = require('fs');
const API_PORT = 8080;
//these are temp imports
//const {photoData} = require('./rawPhotoData');
//const {postData} = require('./rawPostData');

const app = express();
const sslServer = https.createServer({
  key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
}, app);

sslServer.listen(API_PORT, () => console.log(`Secure server on port ${API_PORT}...`))

app.get('/', (req, res, next) => {
  res.send('Hello from SSL server');
});