const express = require('express');
const Calendar = require('../models/Calendar');
const auth = require('../middleware/auth');

const router = express.Router();



router.get('/', auth, async(req, res)=>{
  const dateNow = new Date();
  try{
    const calendars = await Calendar.find({date: {$gte: dateNow},  $or: [{author: req.user._id}, {shares: req.user._id}] })
                            .populate('author', 'username')
                            .sort({date: -1});
    res.send(calendars);
  } catch(err) {
    res.status(500).send(err);
  }
});

router.get('/:id', auth, async(req, res)=>{
  try{
    const calendar = await Calendar.findById(req.params.id);
    res.send(calendar);
  } catch(err) {
    res.status(500).send(err);
  }
});

router.post('/', auth, async(req, res)=>{
  const calendar = new Calendar(req.body);
  calendar.author = req.user._id;
  try {
    await calendar.save();
    res.send(calendar);
  } catch(err) {
    res.status(500).send(err);
  }

});

router.delete('/:id', auth, async(req, res) => {
  try {
    let calendar = await Calendar.findById(req.params.id);
    if(req.user._id !== calendar.author._id) {
      await Calendar.findByIdAndDelete(req.params.id);
      res.send({message: "Successfully deleted"});
    } else {
      res.status(401).send({error: "Access denied!"});
    }    
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
    await calendar.save();
    res.send(calendar);
  } catch(err) {
    res.status(500).send(err);
  }
});

module.exports = router;