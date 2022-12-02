const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then(resp => { 
        console.log('connected to MongoDB')
    })
    .catch((error) => { 
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: [3, 'Name must be at least 3 characters long']
    },
    number: {
        type: Number,
        required: true,
        min: [10000000, 'Number must be at least 8 digits long'],
        max: [99999999, 'Number too long']
    }
})
personSchema.plugin(uniqueValidator);

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})



module.exports = mongoose.model('Person', personSchema)
