const express = require("express")
const bcrypt=require("bcrypt")
const validateBody=require("../middleware/validate-body")
const { validateRF, User, validateLF } = require("../models/user")
const auth = require("../middleware/auth")
const admin = require("../middleware/admin")
const objectId=require("../middleware/object-id")


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



Router.post("/login", validateBody(validateLF),async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ $or: [{ email }, { username: email }] })
    if (!user) return res.status(400).send("Username or password incorrect")
    
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) return res.status(400).send("Username or password incorrect")
    
    user.lastSeen = new Date()
    await user.save()
    res.send(user.genAuthToken())
})



Router.get("/all", [auth,admin], async (req, res) => {
    let users = await User.find()
    users = users.map(({_doc}) => {
        return {..._doc,password:""}
    })
    res.send(users)
})

Router.delete("/:id",[auth,admin,objectId], async (req, res) => {
    const {deletedCount} = await User.deleteOne({_id:req.params.id})
    if (!deletedCount) return res.status(404).send("User unavailable")
    
    res.send("User deleted")
    
})

Router.get("/logout", auth, async (req, res) => {
    await User.updateOne({ email: req.user.email }, { $set: { lastSeen: new Date() } })
    res.send("user logged out")
})

module.exports=Router