const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');

app.use(express.json())
morgan.token('body', function (req, res) { return JSON.stringify(req.body)})
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req,res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.body(req, res)
  ].join(' ')
}))
app.use(cors());

let persons = [
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

app.get('/info', (req, resp) => {
  let timeStamp = Date();
  resp.send(
    `<p>Phonebook has info for ${persons.length} people.
     <p>${timeStamp}</p>`
  );
})

app.get('/api/persons', (req, resp) => {
  resp.json(persons)
})

app.get('/api/persons/:id', (req, resp) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);
  if (person) {
    resp.json(person)
  } else {
    resp.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, resp) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  resp.status(204).end()
})

const generateId = () => {
  const id = Math.floor(Math.random() * 10000);
  return id
}

app.post('/api/persons', (req, resp) => {
  const body = req.body
  console.log(body)

  if (!body.name || !body.number) {
    return resp.status(400).json({
      error: 'Content missing.'
    })
  } else if (persons.some(person => body.name === person.name)) {
    return resp.status(409).json({
      error: 'Name must be unique'
    })
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person)

  resp.json(person)
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})