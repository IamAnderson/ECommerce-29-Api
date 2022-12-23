const router = require("express").Router();
const User = require("../model/User");
const CryptoJS = require("crypto-js");
const JWT = require("jsonwebtoken");

//Register
router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    });

    try {
        const savedUser = await newUser.save()
        res.status(200).send(savedUser)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
});


//Login
router.post("/login", async (req, res) => {

    try {
        const user = await User.findOne({username: req.body.username})
        !user && res.status(401).json({"message": "Wrong Credentials"});

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        originalPassword !== req.body.password && res.status(401).json({"message": "Wrong Password"});

        //JWT Sign In
        const accessToken = JWT.sign({
            id: user._id,
            admin: user.isAdmin
        }, process.env.JWT_SEC, {expiresIn: "3d"});
        
        //Send information back without password
        const { password, ...others } = user._doc;
        res.status(200).json({...others, accessToken});

    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;
