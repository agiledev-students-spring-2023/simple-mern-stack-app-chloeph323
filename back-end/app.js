require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const express = require('express') // CommonJS import style!
const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const cors = require('cors') // middleware for enabling CORS (Cross-Origin Resource Sharing) requests.
const mongoose = require('mongoose')

const app = express() // instantiate an Express object
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors()) // allow cross-origin resource sharing

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data

// connect to database
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(data => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

// load the dataabase models we want to deal with
const { Message } = require('./models/Message')
const { User } = require('./models/User')

// a route to handle fetching all messages
app.get('/messages', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({})
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle fetching a single message by its id
app.get('/messages/:messageId', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({ _id: req.params.messageId })
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})
// a route to handle logging out users
app.post('/messages/save', async (req, res) => {
  // try to save the message to the database
  try {
    const message = await Message.create({
      name: req.body.name,
      message: req.body.message,
    })
    return res.json({
      message: message, // return the message we just saved
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to save the message to the database',
    })
  }
})

app.get('/about', async (req, res) => {
  try {
    res.json({
      image: "images/me.jpg", 

      txt: '\\n My name is Chloe Hawkins, I am a Junior at NYU Shanghai (displaced to New York due to covid), and in the past year I switched majors to study Computer Science. And, because I made this change a bit late in the game, per say, I’m trying to take computer science classes that will expose me to as many technologies as possible before I graduate (Agile Development and Devopps seems like the perfect class for that). \\n So far, my programming language of choice is Python, CAD projects are my favorite CS projects, and I love using figma for UX design :) I’ve found switching to computer science to be difficult so far because I’ve had to cram courses (to graduate on time) while also preparing for internship interviews - both of which, I’ve learned, eat up quite a bit of time. However, after grinding for the past year I was able to get an internship with Goldman Sachs this summer (which still doesn’t feel real but THANK GOD because I’m running out of time ), though I was just informed that the division I’ll work for will exclusively use Java (ew - time to start learning yet another coding language). \\n Some fun facts about me are that I did karate from 4 -18 years old and in High School went to study it abroad in Japan, also my favorite food is (unsurprisingly) sushi :) '
    })
  }catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve information about me', 
    })
  }
})


// export the express app we created to make it available to other modules
module.exports = app // CommonJS export style!
