const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://fullstack:${password}@cluster0.ydyjvhz.mongodb.net/test`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: Number
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 5) {
    Person
        .find({})
        .then(resp => {
            resp.forEach(person => {
                console.log(person);
            })
            mongoose.connection.close()
        })
} else {
    const name = process.argv[3]
    const number = process.argv[4]

    const newPerson = new Person({
        name,
        number
    })

    newPerson
        .save()
        .then(person => {
            console.log(person)
            mongoose.connection.close()
        })
}