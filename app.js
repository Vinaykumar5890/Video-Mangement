const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
// Login user Schema
const Registeruser = require('./model')
//Upload Video Schema
const Videoupload = require('./model1')
const app = express()

app.use(express.json())
//Using cors origin for retrieve Data in any location
app.use(cors({origin: '*'}))

//Mongoose connect
mongoose
  .connect(
    'mongodb+srv://vinay:vinay@cluster0.fv2hjsb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  )
  .then(() => console.log('DB Connected'))
  .catch(err => console.log(err))

// Verify User get Jwt Token . Token make Authorized User

function authenticateToken(request, response, next) {
  let jwtToken
  const authHeader = request.headers['authorization']
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(' ')[1]
  }
  if (jwtToken === undefined) {
    response.status(401)
    response.send('Your Not Authorized User')
  } else {
    jwt.verify(jwtToken, 'jwt', async (error, payload) => {
      if (error) {
        response.status(401)
        response.send('Your Not Authorized User')
      } else {
        next()
      }
    })
  }
}

//User Register Using Post Method : /register

app.post('/register', async (req, res) => {
  try {
    const {username, email, password} = req.body
    let exits = await Registeruser.findOne({email})
    if (exits) {
      return res.status(400).send('User Already Exist')
    } else if (!email || !username || !password) {
      return res.status(400).send('All fields are required')
    }
    if (password.length > 6) {
      const hashedPassword = await bcrypt.hash(password, 10)

      let newUser = new Registeruser({
        username,
        email,
        password: hashedPassword,
      })
      await newUser.save()
      res.status(200).send('Register Succesfully')
    } else {
      res.status(400).send('Password Too Short')
    }
  } catch (err) {
    console.log(err)
    return res.status(500).send('Internal Server Error')
  }
})

//User Login Using Post Method : /Login

app.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body
    let exits = await Registeruser.findOne({email})
    if (!exits) {
      return res.status(400).send("User Doesn't Exits")
    } else if (!email || !password) {
      return res.status(400).send('All fields are required')
    } else {
      const isPasswordMatched = await bcrypt.compare(password, exits.password)
      if (isPasswordMatched === true) {
        let payload = {
          user: {
            id: exits.id,
          },
        }
        jwt.sign(payload, 'jwt', (err, jwtToken) => {
          if (err) throw err
          return res.json({jwtToken})
        })
      } else {
        return res.status(400).send('Invalid Password')
      }
    }
  } catch (err) {
    console.log(err)
    res.status(500).send('Server Error')
  }
})

//User Change Password using Put Method  : /changePassword

app.put('/changePassword', async (req, res) => {
  try {
    const {email, oldPassword, newPassword} = req.body
    let exits = await Registeruser.findOne({email})
    const isPasswordCorrect = await bcrypt.compare(oldPassword, exits.password)
    if (!exits) {
      return res.status(400).send("User Doesn't Exits")
    } else if (!email || !oldPassword || !newPassword) {
      return res.status(400).send('All fields are required')
    } else if (oldPassword === newPassword) {
      return res.status(400).send('Passwords are Same')
    } else if (!isPasswordCorrect) {
      return res.status(401).send('Old password is incorrect')
    } else if (newPassword.length < 6) {
      return res.status(401).send('New password is Too Short')
    } else {
      const hashedPassword = await bcrypt.hash(newPassword, 10)

      // Update the user's password in the database

      const updated = await Registeruser.updateOne(
        {email},
        {$set: {password: hashedPassword}},
      )
      return res.status(200).send('Password updated successfully')
    }
  } catch (err) {
    console.log(err)
    res.status(500).send('Server Error')
  }
})

//User Post Data using Post Method : /video

app.post('/video', async (req, res) => {
  const {user, title, description, tags, videoUrl} = req.body
  try {
    let newVideo = new Videoupload({
      user,
      title,
      description,
      tags,
      videoUrl,
    })
    await newVideo.save()
    res.status(201).json('Video uploaded successfully')
  } catch (error) {
    res.status(500).json(error)
  }
})

//Get Videos  Based on User Email
app.get('/video/:user', async (req, res) => {
  const {user} = req.params

  try {
    // Find Videos  where userId matches the provided userId
    const videos = await Videoupload.find({user: user})

    // Check if Video exist for the user
    if (!videos || videos.length === 0) {
      return res.status(404).json({message: 'No Videos found for this user.'})
    }

    // Return the videos if found
    res.status(200).json(videos)
  } catch (error) {
    res.status(500).json({error: 'An error occurred while retrieving Videos.'})
  }
})

// Get Videos  Based on video Id

app.get('/videobyid/:id', async (req, res) => {
  const {id} = req.params
  try {
    const retrieveVideoById = await Videoupload.findById(id)
    return res.status(201).json(retrieveVideoById)
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
})

// Delete Videoa based on video Id

app.delete('/videobyid/:id', async (req, res) => {
  try {
    await Videoupload.findByIdAndDelete(req.params.id)
    return res.status(201).json(await Videoupload.find())
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
})

app.listen(3000, () => {
  console.log('Server Running.....')
})

module.exports = app
