require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')



morgan.token('body', (req) => JSON.stringify(req.body))
app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status  :response-time ms :body'))
app.get('/', (request, response) => {
    response.send('./build/index.html')
})
app.get('/api/persons', (request, response) => {
    Person.find({})
        .then(persons => {
            response.json(persons)
        })
})


app.get('/info', (request, response) => {

    Person.find({})
        .then(persons => {
            response.send(`Phonebook has info for ${Object.keys(persons).length} people <br> ${new Date()}`)
        })

})

app.get('/api/persons/:id', (request, response, next) => {
    Person
        .findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            next(error)
        })
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person
        .findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})


app.post('/api/persons', (request, response, next) => {
    const body = request.body


    const people = new Person({
        name: body.name,
        number: body.number
    })


    people
        .save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findOneAndUpdate({
        _id: request.params.id
    }, person, {
        new: true,
        runValidators: true
    })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({
        error: 'unknown endpoint'
    })
}

app.use(unknownEndpoint)


const handleError = (error, request, response, next) => {
    console.log(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({
            error: 'malformatted id'
        })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({
            error: error.message
        })
    }
    next(error)
}

app.use(handleError)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})