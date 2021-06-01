const mongoose = require('mongoose');
const idvalidator = require('mongoose-id-validator');

const Schema = mongoose.Schema;

const CalendarSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String
  },
  date: {
    type: Date,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  shares: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ] 
});

CalendarSchema.plugin(idvalidator);
const Calendar = mongoose.model("Calendar", CalendarSchema);

module.exports = Calendar;