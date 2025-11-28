const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   POST api/alarms
// @desc    Create a new alarm
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { destination, radius, ringtone } = req.body;

        const user = await User.findById(req.user.id);
        
        user.alarms.push({
            destination,
            radius,
            ringtone,
            isActive: true
        });

        await user.save();
        
        res.json(user.alarms[user.alarms.length - 1]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/alarms
// @desc    Get all alarms for a user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user.alarms);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/alarms/:id
// @desc    Delete an alarm
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        const alarmIndex = user.alarms.findIndex(
            alarm => alarm._id.toString() === req.params.id
        );

        if (alarmIndex === -1) {
            return res.status(404).json({ msg: 'Alarm not found' });
        }

        user.alarms.splice(alarmIndex, 1);
        await user.save();

        res.json({ msg: 'Alarm removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/alarms/:id
// @desc    Update alarm status
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        const alarm = user.alarms.id(req.params.id);
        if (!alarm) {
            return res.status(404).json({ msg: 'Alarm not found' });
        }

        alarm.isActive = req.body.isActive;
        await user.save();

        res.json(alarm);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;