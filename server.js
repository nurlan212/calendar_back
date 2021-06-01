const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const cors = require('cors');
const calendars = require('./app/calendars');
const users = require('./app/users');

const app = express();
const PORT = 8000;

const run = async () => {
  await mongoose.connect(config.db.url + config.db.name, {useNewUrlParser: true, useUnifiedTopology: true});

  app.use(express.json());
  app.use(cors());  
  app.use('/users', users);
  app.use('/calendars', calendars);

  app.listen(PORT, () => {
    console.log(`Server started on ${PORT} port`);
  });  
}

run().catch(console.log);