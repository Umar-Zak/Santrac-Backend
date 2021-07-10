const mongoose = require("mongoose")
const Joi = require("@hapi/joi")



const categorySchema = mongoose.Schema({
    name:{type:String,required:true}
})

function validateCategoryForm(body) {
    const schema = Joi.object({
        name:Joi.string().required().label("Category name")
    })

    return schema.validate(body)
}

const Category = mongoose.model("Category", categorySchema)

module.exports.Category = Category
module.exports.validateCF=validateCategoryForm
