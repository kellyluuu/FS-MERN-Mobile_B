const router = require("express").Router()
const User = require("../server.js")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")



router.post("/", async (req, res) => {
    try {
        const { username, password, passwordVerify } = req.body;

        // VALIDATION 
        if (!username || !password || !passwordVerify)
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields", })
        if (password.length < 6)
            return res
                .status(400)
                .json({ errorMessage: "Password must be 6 or more characters", })
        if (password !== passwordVerify)
            return res
                .status(400)
                .json({ errorMessage: "Verified password does not match", })

        const existingUser = await User.findOne({ username })
        if (existingUser)
            return res.status(400)
                .json({ errorMessage: "An account with this user name already exist", })
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt)
        // save new user account to database
        const newUser = new User({
            username, passwordHash
        })
        const savedUser = await newUser.save()
        // sign the token 
        const token = jwt.sign({ user: savedUser._id, }, process.env.JWT_SECRET)
        // send the token in a html cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })
            .send()

    } catch (err) {
        console.error(err)
        res.status(500).send();
    }
})

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        // validate
        if (!username || !password)
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields", })

        const existingUser = await User.findOne({username})
        if (!existingUser)
            return res.status(401).json({errorMessage:"Wrong email or password"})
        const passwordCorrect = await bcrypt.compare(password, existingUser.passwordHash)
        if (!passwordCorrect)
            return res.status(401).json({errorMessage:"Wrong email or password"})
        const token = jwt.sign({ user: existingUser._id, }, process.env.JWT_SECRET)
        // send the token in a html cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })
            .send()

    } catch (err) {
        console.error(err);
        res.status(500).send()
    }
})

router.get("/logout", (req,res)=>{
    res.cookie("token","",{
        httpOnly: true,
        expires: new Date(0)
    })
    .send()
})

module.exports = router;