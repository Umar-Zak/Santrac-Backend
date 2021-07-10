const mongoose = require("mongoose")
const Joi = require("@hapi/joi")


const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 1 },
    description: { type: String, required: true },
    image: { type: String, required: true },
    quantity: { type: Number, required: true },
    lastModified: { type: Date, default: new Date() },
    category:{type:mongoose.Schema.Types.ObjectId,ref:"Category"}
})

function validateProductform(body) {
    const schema = Joi.object({
        name: Joi.string().required().label("Product name"),
        price: Joi.number().min(1).required().label("Product price"),
        description: Joi.string().required().label("Product description"),
        quantity: Joi.number().min(1).required().label("Product quantity"),
        image:Joi.string().required().label("Product image")
    })
    return schema.validate(body)
}

const Product = mongoose.model("Product", productSchema)



module.exports.Product = Product
module.exports.validatePF =validateProductform