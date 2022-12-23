const express = require("express");
const { verifyTokenandAuthorization, verifyTokenandAdmin, verifyToken } = require("../middleware/verifyToken");
const CryptoJS = require("crypto-js");
const User = require("../model/User");
const router = express.Router();

// Update User Data
router.put("/:id", verifyTokenandAuthorization, async(req, res) => {
    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json(err)
    }
});


//Delete User
router.delete("/:id", verifyTokenandAuthorization, async(req, res) => {
    
    try {
        await User.findByIdAndRemove(req.params.id)
        res.status(200).json(`User with id: ${req.params.id} has been deleted`)
    } catch (error) {
        res.status(500).json(error)
    }
})


//Get User
router.get("/find/:id", async(req, res) => {
    
        try {
            const user = await User.findById(req.params.id)
            const { password, ...others } = user._doc;
            res.status(200).json(others)
        } catch (error) {
            res.status(500).json(error)
        }
})


// GET ALL
router.get("/", verifyTokenandAdmin, async (req, res) => {
        const query = req.query.new;
        try {
            const users = query ? await User.find().sort({ _id: -1 }).limit(10) : await User.find();
            res.status(200).json(users);
           } catch (error) {
            res.status(500).json(error);
        };
});



// //Get User Stats
router.get("/stats", verifyTokenandAdmin, async(req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    
    try {
        const data = await User.aggregate([
            {$match: {createdAt: { $gte: lastYear }}},
            {
                $project: {
                    month: { $month: "$createdAt" },
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: {$sum: 1},
                }
            }
        ])
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router