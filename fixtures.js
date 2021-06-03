const mongoose = require('mongoose');
const {nanoid} = require('nanoid');
const config = require('./config');

const Calendar = require('./models/Calendar');
const User = require('./models/User');

mongoose.connect(config.db.url + config.db.name, {useNewUrlParser: true, useUnifiedTopology:true});
const db = mongoose.connection;

db.once("open", async()=>{
  try {
    await db.dropCollection("users");
    await db.dropCollection("calendars");
    
  } catch(err) {
    console.log("Collection were not presented. Skipping drop");
  }  

  const [Asan, Arman, Anar] = await User.create({
    username: "Asan",
    password: "123",
    email: "asan@qwe.com",
    token: nanoid()
  }, {
    username: "Arman",
    password: "123",
    email: "arman@qwe.com",
    token: nanoid()
  }, {
    username: "Anar",
    password: "123",
    email: "anar@qwe.com",
    token: nanoid()
  });

  await Calendar.create({
    title: "Контрольная работа",
    text: "Решающая контрольная. Данная контрольная без возможности пересдачи. По результатам определится допуск к ESDP",
    date: new Date('2021.9.9'),
    author: Asan._id
  }, {
    title: "Собеседование",
    text: "Собеседование на позицию 'Frontend разработчик'.",
    date: new Date('2021.7.6'),
    author: Arman._id,
    shares: [Asan._id, Anar._id]
  }, {
    title: "Встреча с друзьями",
    text: "адрес: Кафе Арлан, Толе би, 52",
    date: new Date('2021.2.7'),
    author: Arman._id,
    shares: [Asan._id, Anar._id]
  });

  await db.close();
});