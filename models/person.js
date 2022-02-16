const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

console.log('Connecting to', url);

mongoose.connect(url)
  .then(result => {
    console.log('Connected to DB')
  })
  .catch((error) => {
    console.log('Error connecting to DB:, error.message')
  })

  const personSchema = new mongoose.Schema({
    name: {
      type: String,
      minLength: 3
    },
    number: {
      type: String,
      minLength: 8,
      validate: {
        validator: function(value) {
          return /\d{2,3}-\d+/.test(value);
        }
      }
    }
  })

  personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  module.exports = mongoose.model('Person', personSchema)