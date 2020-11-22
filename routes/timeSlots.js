const express = require('express')
const router = express.Router()
const Users = require('../models/users')
const verifyUser = require('./verifyToken.js')

// Get all time_slots of alumni
router.get('/:postId', async (req, res) => {
    try {
        //console.log(req.params.postId)
        const post = await Users.findById(req.params.postId).time_slot;
        res.json(post)
    } catch (err) {
        res.json({
            message: err
        })
    }

})
