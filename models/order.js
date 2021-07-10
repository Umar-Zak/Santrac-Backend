const mongoose = require("mongoose")
const Joi=require("@hapi/joi")
Joi.objectId=require("joi-objectid")(Joi)

const orderSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    cart: { type: [] },
    dateOrdered: { type: Date, default: new Date() },
    amount: { type: Number, required: true },
    reference: { type: String, required: true },
    delivered:{type:Boolean,default:false}
})


function validateOrderPayload(body) {
    const schema = Joi.object({
        user: Joi.objectId().required().label("User Identity"),
        cart: Joi.array().required().label("Items in stock"),
        amount: Joi.number().min(1).required().label("Amount payable"),
        reference: Joi.string().required().label("Order reference"),
        
    })
    return schema.validate(body)
}

const Order = mongoose.model("Order", orderSchema);


module.exports.Order = Order
module.exports.validateOP=validateOrderPayload
