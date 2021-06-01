const express = require('express');
const Calendar = require('../models/Calendar');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async(req, res)=>{
  try{
    const calendars = await Calendar.find({$or: [{author: req.user._id}, {shares: req.user._id}]}).populate('author', 'username');
    res.send(calendars);
  } catch(err) {
    res.status(500).send(err);
  }
});

router.post('/', auth, async(req, res)=>{
  const calendar = new Calendar(req.body);
  calendar.author = req.user._id;

  try {
    await Calendar.save(calendar);
    res.send(calendar);
  } catch(err) {
    res.status(500).send(err);
  }

});

router.delete('/:id', auth, async(req, res) => {
  try {
    await Calendar.findByIdAndDelete(req.params.id);
    res.send({message: "Successfully deleted"});
  } catch(err) {
    res.status(500).send(err);
  }
});

router.put('/:id', auth, async(req, res) => {
  try {
    const calendar = await Calendar.findById(req.params.id);
    calendar.title = req.body.title;
    calendar.text = req.body.text;
    calendar.date = req.body.date;
    await Calendar.save(calendar);
    res.send(calendar);
  } catch(err) {
    res.status(500).send(err);
  }
});

module.exports = router;