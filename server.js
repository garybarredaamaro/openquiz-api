const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const multer = require('multer')
const path = require('path')
const jwt = require('jsonwebtoken')

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

app.post('/user', upload.single('profile'), (req, res) => {
  const data = {
    ...req.body,
    profile: req.file.filename
  }
  const token = jwt.sign({ data }, 'secret')
  res.json({
    success: true,
    data,
    token
  })
})

app.listen(3001, () => {
  console.log(`listening on port 3001`)
})