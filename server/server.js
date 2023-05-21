require('dotenv').config()
const express = require('express')
const app = express()

const PORT = process.env.PORT || 3500

//Routes
app.use('/',require('./routes/root'))
app.use('/posts',require('./routes/posts'))

app.listen(PORT,()=>console.log(`server running on port ${PORT}`))
