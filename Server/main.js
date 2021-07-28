const express = require('express');
const helmet = require('helmet');

//these are temp imports
const {photoData} = require('./rawPhotoData');
const {postData} = require('./rawPostData');

const app = express();
//for use latter app.use(helmet());
app.listen(process.env.PORT, () => console.log('Listening on port 3000...'))

app.get('/', (req, res) => {
  return res.status(200).send();
});