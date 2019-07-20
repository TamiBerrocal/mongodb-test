const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DoggoSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  isGoodBoi: {
    type: Boolean,
    default: true
  },
  spottedDate: {
    type: Date,
    default: Date.now()
  }
});

module.exports = Item = mongoose.model('doggo', DoggoSchema);