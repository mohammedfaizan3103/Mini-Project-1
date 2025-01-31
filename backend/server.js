const express = require('express')
const app = express()
const port = 3000
const hostname = '127.0.0.1'

// to allow access to the folder public
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port http://${hostname}:${port}/`)
})