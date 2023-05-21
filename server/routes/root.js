const express = require('express')
const router = express.Router()
const path = require('path')
const alert =('alert')

router.get('^/$|^/index(.html)?',(req,res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})

module.exports = router
