const express = require('express')
const router = express.Router()
const Users = require('../models/users')
const verifyUser = require('./verifyToken.js')


// Get all comfirmed meetings (all information for time slot)
router.get('/', verifyUser, async (req, res) => {
    try {
        const meetings = await Users.find().time_slot;
        const totalmeeting;
        for(var i=0;i<meetings.length;i++){
            if(meetings[i].is_booked){
                totalmeeting[totalmeeting.length] = meetings[i];
            }
        }
        res.json(totalmeeting)
    } catch (err) {
        res.json({
            message: err
        })
    }
})

// get all meetings of student (only start time)
router.get('/:postId', async (req, res) => {
    try {
        //console.log(req.params.postId)
        const studentInfo = await Users.findById(req.params.postId).time_slot;
        const meetings = await Users.find().time_slot;
        const studentMeeting;

        for(var i=0;i<meetings.length;i++){
            if(meetings[i].is_booked){
                if(meetings[i].studentToMeet.email==studentInfo.email){
                    studentMeeting[studentMeeting.length]= meetings[i].start_time;
                }
            }
        }

        res.json(studentMeeting)
    } catch (err) {
        res.json({
            message: err
        })
    }

})

// Get all meetings of alumni (all information including in time slot)
router.get('/:postId', async (req, res) => {
    try {
        //console.log(req.params.postId)
        const alumniInfo = await Users.findById(req.params.postId).time_slot;
        const alumniMeeting;

        for(var i=0;i<alumniInfo.length;i++){
            if(alumniInfo[i].is_booked){
                alumniMeeting[alumniMeeting.length]= alumniInfo[i];
            }
        }
                
        res.json(alumniMeeting)
    } catch (err) {
        res.json({
            message: err
        })
    }

})


// for alumni to add a time slot
router.patch('/addTimeSlot', async (req, res) => {
    try {
        const updatedPost = await Users.updateOne({
            _id: req.params.postId
        }, {
            $set: {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                description: req.body.description,
                time_slot: req.body.time_slot
            }
        })
        res.json(updatedPost)
    } catch (err) {
        res.json({
            message: err
        })
    }

})

// for alumni to cancel a time slot
// i guess we can use the find one and remove function but don't know how
router.delete('/cancelTimeSlot', async (req, res) => {
    try {
        const removedPost = await Users.findOneAndRemove({
            _id: req.params.postId,
            time_slot: req.body.time_slot
        })
        res.json(removedPost)
    } catch (err) {
        res.json({
            message: err
        })
    }

})

// for student to book time slot
router.patch('/bookTimeSlot/:postId', async (req, res) => {
    try {
        const updatedPost = await Users.updateOne({
            _id: req.params.postId
        }, {
            $set: {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                description: req.body.description,
                time_slot:[{
                    start_time: req.body.start_time,
                    is_booked: true,
                    studentToMeet: req.body.studentToMeet
                }]
            }
        })
        res.json(updatedPost)
    } catch (err) {
        res.json({
            message: err
        })
    }

})

// for student to cancel time slot
router.patch('/cancelTimeSlot/:postId', async (req, res) => {
    try {
        const updatedPost = await Users.updateOne({
            _id: req.params.postId
        }, {
            $set: {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                description: req.body.description,
                time_slot:[{
                    start_time: req.body.start_time,
                    is_booked: false,
                    studentToMeet: req.body.studentToMeet
                }]
            }
        })
        res.json(updatedPost)
    } catch (err) {
        res.json({
            message: err
        })
    }

})



module.exports = router