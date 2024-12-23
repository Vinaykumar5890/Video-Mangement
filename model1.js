const mongoose = require('mongoose')

let Videoupload = new mongoose.Schema({
  user: String,
  title: String,
  description: String,
  tags: String,
  videoUrl: String,
  date: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Videoupload', Videoupload)
