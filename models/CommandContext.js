const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CommandContextSchema = new Schema({
    type: {
      type: String,
      enum: ['addEvent'],
      required: true
    },
    stage: {
      type: Number,
      required: false,
      default: 0
    },
    entityId: {
      type: String,
      required: false
    },
    completed: {
      type: Boolean,
      require: true,
      default: false
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('CommandContext', CommandContextSchema);
