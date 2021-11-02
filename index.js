const express = require('express')
const app = express()
var morgan = require('morgan')
var cors = require('cors')

morgan.token('strjson', function(req, res) {return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :strjson'))
app.use(express.json())
app.use(cors())
app.use(express.static('build'))


var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

let persons = 
[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>This is back end</h1>')
  })
  
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.write(`<p>Phonebook has info for ${persons.length} people`)
    response.write(`<p>The time making the request is ${date} at ${time}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const found = persons.find(person => person.id === id)
    if(found) response.json(found)
    else response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
    const curId = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if(!body.name) {
      return response.status(400).json({
        error: 'name missing'
      })
    }

    if(!body.number) {
      return response.status(400).json({
        error: 'number missing'
      })
    }

    if(persons.find(person => person.name === body.name))
    {
      return response.status(400).json({
        error: 'the name must be unique'
      })
    }
    
    const person = {
        id : Math.floor(Math.random()*1000+1),
        name : body.name,
        number : body.number
    }
    persons = persons.concat(person)
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
