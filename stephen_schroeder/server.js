'use strict';

const app = module.exports = exports = require('express')();
const mongoose = require('mongoose');
const bodyParser = require('body-parser').json();
const jwtAuth = require('./lib/jwt_auth');
const cors = require('cors');

const errorHandle = require(__dirname + '/lib/err_handler');

const dbPort = process.env.MONGOLAB_URI || 'mongodb://localhost/marvel_app_dev';

mongoose.connect(dbPort);

app.use(cors());

const marvelRouter = require(__dirname + '/routes/marvel_routes');
const dcRouter = require(__dirname + '/routes/dc_routes');
const duelRouter = require(__dirname + '/routes/duel_routes');
const authRouter = require(__dirname + '/routes/auth_routes');

app.use('/api', marvelRouter, dcRouter, duelRouter, authRouter);

app.get('/test', (req, res) => {
  res.send('don\'t need a token');
});

app.post('/test', bodyParser, jwtAuth, (req, res) => {
  res.send({ message: 'need a token' });
});

app.use(errorHandle);

app.use((err, res) => {
  res.status(404).json({ message: err.message });
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('server up on port: ' + PORT));
