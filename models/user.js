const mongoose = require("mongoose")
const Joi = require("@hapi/joi")
const config = require("config")
const jwt=require("jsonwebtoken")


const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    dateJoined: { type: Date, default: new Date() },
    lastSeen:{type:Date},
    isAdmin:{type:Boolean,default:false}
})


userSchema.methods.genAuthToken = function () {
    return jwt.sign({username:this.username,email:this.email,phone:this.phone,isAdmin:this.isAdmin,_id:this._id},config.get("privatekey"))
}

const User = mongoose.model("User", userSchema)

function validateLoginForm(body) {
    const schema = Joi.object({
        email: Joi.string().trim().required().label("Email or username"),
        password:Joi.string().trim().required().label("Password")
    })

    return schema.validate(body)
}

function validateRegisterationForm(body) {
    const schema = Joi.object({
        username: Joi.string().min(3).trim().required().label("Username"),
        email: Joi.string().email().trim().required().label("Email"),
        password: Joi.string().min(6).trim().required().label("Password"),
        phone:Joi.string().trim().pattern(/[0-9]{10,}/).required().label("Phone Number")
    })


    
    return schema.validate(body)
}




module.exports.User = User;
module.exports.validateRF = validateRegisterationForm
module.exports.validateLF=validateLoginForm