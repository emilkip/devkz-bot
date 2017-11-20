const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const FloodersSchema = new Schema({
    userId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    username: {
      type: String,
      require: false
    },
    messageCount: {
      type: Number,
      required: true,
      default: 0
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('Flooders', FloodersSchema);
