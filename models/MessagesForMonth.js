const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const MessagesForMonthSchema = new Schema({
    userId: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: false
    },
    username: {
      type: String,
      required: false
    },
    name: {
      type: String,
      required: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('MessagesForMonth', MessagesForMonthSchema);
