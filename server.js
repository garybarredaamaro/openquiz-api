const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())

app.get('/', (req, res) => {
  res.json({
    message: 'yey'
  })
})

app.listen(3001, () => {
  console.log(`listening on port 3001`)
})