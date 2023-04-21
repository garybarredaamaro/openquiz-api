const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const multer = require('multer')
const path = require('path')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const User = require('./models/User')
const { hashPasswordAsync, isPasswordMatchAsync, getJwtToken } = require('./utils')

const SECRET_KEY = 'secret'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '/uploads'))
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname)
  }
})
const upload = multer({ storage })

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.get('/', (req, res) => {
  res.json({
    message: 'yey'
  })
})

app.post('/register', upload.single('profile'), async (req, res) => {
  const exists = await User.findOne({ username: req.body.username })
  if (exists) {
    return res.json({
      success: false,
      message: 'username already used'
    })
  }
  const hashedPassword = await hashPasswordAsync(req.body.password)
  const newUser = new User({
    username: req.body.username,
    password: hashedPassword,
    profile: req.file.filename
  })
  newUser.save()
  const token = getJwtToken({ user_id: newUser._id }, SECRET_KEY)
  res.json({
    success: true,
    token
  })
})

app.post('/login', async (req, res) => {
  const user = await User.findOne({ username: req.body.username })
  if (!user) {
    return res.json({
      success: false,
      message: "account doesn't exist"
    })
  }
  const match = await isPasswordMatchAsync(req.body.password, user.password)
  if (!match) {
    return res.json({
      success: false,
      message: "credentials doesn't match"
    })
  }
  const token = getJwtToken({ user_id: user._id }, SECRET_KEY)
  res.json({
    success: true,
    token
  })
})

app.post('/session', async (req, res) => {
  const { token } = req.body
  jwt.verify(token, SECRET_KEY, async (err, decoded) => {
    const user = await User.findById(decoded.user_id).select('username profile')
    res.json({
      success: true,
      data: user
    })
  })
})

mongoose
  .connect('mongodb+srv://garybarredaamaro:Yp5mLtqdaXWEAvg1@cluster0.g8c6xen.mongodb.net/openquiz?retryWrites=true&w=majority')
  .then(() => {
    app.listen(3001, () => {
      console.log(`listening on port 3001`)
    })
  })