const express = require('express');
const cors = require('cors');
const https = require('https');
const path = require('path');
const fs = require('fs');
const API_PORT = 8080;
//these are temp imports
const { photoData } = require('./rawPhotoData');
const { postData } = require('./rawPostData');

const app = express();
app.use(cors());

app.get('/photos', (req, res, next) => {
  res.send(photoData);
});

app.get('/posts', (req, res, next) => {
  res.send(postData);
});

const sslServer = https.createServer({
  key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
}, app);

sslServer.listen(API_PORT, () => console.log(`Secure server on port ${API_PORT}...`));