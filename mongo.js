const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

if (process.argv.length > 5) {
    console.log('too many arguments')
    process.exit(1)
}

if (process.argv.length === 4) {
    console.log('missing arguments')
    process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://yousef:${password}@cluster0.i8h5t7v.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Phonebook = mongoose.model('Phonebook', phonebookSchema)

if (process.argv.length === 5) {
    const name = process.argv[3]
    const number = process.argv[4]

    const phonebook = new Phonebook({
        name,
        number,
      })
    
    phonebook.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
    })
}

if (process.argv.length === 3) {
    console.log('phonebook:')
    Phonebook.find({}).then(result => {
        result.forEach(phonebook => {
            console.log(phonebook.name, phonebook.number)
        })
        mongoose.connection.close()
    })
}