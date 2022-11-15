const express = require('express')
const app = express()

app.use(express.json())

let phoneBook = [
    {
        id: 1,
        name: "Arto Hellas ",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]


app.get('/', (request, response) => {
    response.send('<h1>Phone Book</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(phoneBook)
})

let number = 1
app.get('/info', (request, response) => {
    const date = new Date()
    response.send(`<p>Phonebook has info for ${number++} people</p> <p>${date}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const people = phoneBook.find(phone => phone.id === id)
    
    if (people)  response.json(people)
    else response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    phoneBook = phoneBook.filter(phone => phone.id !== id)

    response.status(204).end()
})


app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    for (let phone of phoneBook) {
        if (phone.name.toLowerCase() === body.name.toLowerCase()) {
            return response.status(400).json({
                error: 'name must be unique'
            })
        }
    }

    const people = {
        id: Math.floor(Math.random() * 10000),
        name: body.name,
        number: body.number
    }


    phoneBook = phoneBook.concat(people)

    response.json(people)

})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})