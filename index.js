require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
const Person = require('./models/person')

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
app.use(express.static('build'))

//GET DATA
app.get('/info', (req, resp) => {
  let timeStamp = Date();
  resp.send(
    `<p>Phonebook has info for ${persons.length} people.
     <p>${timeStamp}</p>`
  );
})

app.get('/api/persons', (req, resp) => {
  Person.find({}).then(persons => {
    resp.json(persons)
  })
})

app.get('/api/persons/:id', (req, resp) => {
  Person.findById(req.params.id).then(person => {
    resp.json(person)
  })
})

//DELETE PERSON
app.delete('/api/persons/:id', (req, resp) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  resp.status(204).end()
})

//ADD PERSON
app.post('/api/persons', (req, resp) => {
  const body = req.body

  if (body.name === undefined || body.number === undefined) {
    return resp.status(400).json({ error: 'Content missing'})
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    resp.json(savedPerson)
  })
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})