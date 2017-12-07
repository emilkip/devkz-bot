const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const EventsSchema = new Schema({
    title: {
      type: String,
      required: false,
      default: ''
    },
    description: {
      type: String,
      required: false,
      default: ''
    },
    date: {
      type: Date,
      required: false
    },
    ready: {
      type: Boolean,
      default: false
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('Events', EventsSchema);
