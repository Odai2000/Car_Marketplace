const express = require('express')
const router = express()

router.route('/')
    .get()
    .post()
    .patch()
    .delete()

module.exports = router
