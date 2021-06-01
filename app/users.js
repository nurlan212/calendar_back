const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.post('/', async(req, res) => {
  try{
    let user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });
    user.generateToken();
    await user.save();
    res.send(user);
  } catch(err) {
    res.status(400).send(err);
  }
});

router.post('/sessions', async(req, res) => {
  try{
    let user = await User.findOne({username: req.body.username});
    if(!user) return res.status(401).send({error: "Username or password are wrong!"});

    const isMatch = await user.checkPassword(req.body.password);
    if(!isMatch) return res.status(401).send({error: "Username or password are wrong!"});

    user.generateToken();
    await user.save();
    res.send(user);
  } catch(err) {
    res.status(500).send(err);
  }
})

router.delete('/sessions', async(req, res) => {
  const success = {message: 'Success!'};
  let token = req.get('Authenticate');
  if(!token) return res.send(success);

  const user = await User.findOne({token});
  if(!user) return res.send(success);

  user.generateToken();
  try {
    await user.save({validateBeforeSave: false});
    res.send(success);
  } catch(err) {
    res.status(500).send(err);
  }
})

module.exports = router;