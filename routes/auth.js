const express = require("express")
const validateBody=require("../middleware/validate-body")
const {validateRF,User}=require("../models/user")
const bcrypt=require("bcrypt")

const Router = express.Router()


Router.post("/register", validateBody(validateRF), async(req, res) => {
    const {email,username,password,phone}=req.body
    let user = await User.findOne({ email })
    if (user) return res.status(400).send("Email already in use")
    
    user = new User({ email, username, password, phone })
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
    await user.save()
    res.send(user.genAuthToken())
})



module.exports=Router