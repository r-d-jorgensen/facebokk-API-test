const express = require('express');
//const helmet = require('helmet');
const API_PORT = 8080;
//these are temp imports
const {photoData} = require('./rawPhotoData');
const {postData} = require('./rawPostData');

const app = express();
//app.use(helmet());
app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}...`))

app.get('/api/posts', (req, res) => {
  return res.send(postData);
});

app.post('/api/posts', (req, res) => {
  return res.send();
});

app.get('/api/photos', (req, res) => {
  return res.send(photoData);
});

app.post('/api/photos', (req, res) => {
  return res.send();
});

app.get('/api/images', (req, res) => {
  return res.send();
});

app.post('/api/images', (req, res) => {
  return res.send();
});