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
app.use(express.static('build'));

const errorHandler = (error, req, resp, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return resp.status(400).send({ error: 'Malformatted ID' })
  }

  next(error)  
}

const unknownEndpoint = (req, resp) => {
  resp.status(404).send({ error: 'Unknown Endpoint' })
}

//GET DATA
app.get('/info', (req, resp, error) => {
  Person.find({})
  .then(persons => {
    if (persons) {
    let timeStamp = Date()
    `<p>Phonebook has info for ${persons.length} people.
     <p>${timeStamp}</p>`
  } else {
    resp.status(404).end()
  }
  })
  .catch(error => next(error))
})


app.get('/api/persons', (req, resp, next) => {
  Person.find({})
  .then(persons => {
    if (persons) {
      resp.json(persons)
    } else {
      resp.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.get('/api/persons/:id', (req, resp, next) => {
  Person.findById(req.params.id)
  .then(person => {
    if (person) {
      resp.json(person)
    } else {
      resp.status(404).end()
    }
  })
  .catch(error => next(error))
})

//DELETE PERSON
app.delete('/api/persons/:id', (req, resp, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      resp.status(204).end()
    })
    .catch(error => next(error))
})

//ADD PERSON
app.post('/api/persons', (req, resp, next) => {
  const body = req.body

  if (body.name === undefined || body.number === undefined) {
    resp.status(400).end()
  } else {
    const person = new Person({
      name: body.name,
      number: body.number
    })
    person.save().then(savedPerson => {
      resp.json(savedPerson)
    })
    .catch(error => next(error))
  }
})

//UPDATE PERSON
app.put('/api/persons/:id', (req, resp, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
  .then(updatedNote => {
    resp.json(updatedNote)
  })
  .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})