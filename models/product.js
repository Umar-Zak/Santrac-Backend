const mongoose = require("mongoose")
const Joi = require("@hapi/joi")
Joi.objectID=require("joi-objectid")(Joi)

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 1 },
    description: { type: String, required: true },
    image: { type: String, required: true },
    quantity: { type: Number, required: true },
    lastModified: { type: Date, default: new Date() },
    category:{type:mongoose.Schema.Types.ObjectId,ref:"Category"}
})

const cartSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items:{type:[],default:[]}
})

const Cart=mongoose.model("Cart",cartSchema)

function validateProductform(body) {
    const schema = Joi.object({
        name: Joi.string().required().label("Product name"),
        price: Joi.number().min(1).required().label("Product price"),
        description: Joi.string().required().label("Product description"),
        quantity: Joi.number().min(1).required().label("Product quantity"),
        image: Joi.string().required().label("Product image"),
        category:Joi.objectID().required().label("Product category")
    })
    return schema.validate(body)
}

function validateCartContent(body) {
    const schema = Joi.object({
        user: Joi.objectID().required().label("User indentity"),
        items:Joi.array().required().label("Cart items")
    })
    return schema.validate(body)
}

const Product = mongoose.model("Product", productSchema)



module.exports.Product = Product
module.exports.validatePF = validateProductform
module.exports.Cart = Cart
module.exports.validateCC=validateCartContent