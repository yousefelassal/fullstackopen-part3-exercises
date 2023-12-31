require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Phonebook = require('./models/phonebook');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('build'));

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/api/persons', (req, res) => {
    Phonebook.find({}).then(phonebook => {
        res.json(phonebook)
    })
})

app.get('/info', (req, res) => {
    const date = new Date()
    Phonebook.find({}).then(phonebook => {
        res.send(`<p>Phonebook has info for ${phonebook.length} people</p><p>${date}</p>`)
    })
})

app.get('/api/persons/:id', (req, res) => {
    Phonebook.findById(req.params.id).then(phonebook => {
        res.json(phonebook)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
  const {name, number} = request.body

  Phonebook.findByIdAndUpdate(
    request.params.id,
    {name, number},
    { new: true, runValidators: true, context: 'query' })
    .then(updatedPhonebook => {
      response.json(updatedPhonebook)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Phonebook.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    const person = new Phonebook({
        name: body.name,
        number: body.number,
    })

    person.save()
        .then(savedPerson => {
            res.json(savedPerson)
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error,request,response,next) => {
  console.error(error.message)

  if(error.name === 'CastError'){
    return response.status(400).send({error:'malformatted id'})
  } else if (error.name === 'ValidationError'){
    return response.status(400).json({error:error.message})
  }
  next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})