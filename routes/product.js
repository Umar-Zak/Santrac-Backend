const express = require("express")
const {validatePF,Product}=require("../models/product")
const auth = require("../middleware/auth")
const admin = require("../middleware/admin")
const objectId = require("../middleware/object-id")
const validateBody=require("../middleware/validate-body")

const Router = express.Router()


Router.get("/all", [auth, admin], async (req, res) => {
    const products = await Product.find()
    res.send(products)
})


Router.get("/get/:id", objectId, async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).send("Product unavailable")
    
    res.send(product)
})

Router.post("/add", [auth,admin,validateBody(validatePF)], async (req, res) => {
    const { name, price, quantity, image, description } = req.body
    
    const product = new Product({ name, price, description, image, quantity })
    await product.save()
    res.send(product)
})

Router.put("/:id", [auth, admin, objectId, validateBody(validatePF)], async (req, res) => {
    const { name, price, quantity, image, description } = req.body
    
    const results = await Product.updateOne({ _id: req.params.id }, { $set: { price, name, quantity, image, description } })
    
    if (results.nModified === 0)
        return res.status(404).send("Product unavailable")

    res.send("Product modified")
    
})


Router.delete("/:id", [auth, admin, objectId], async (req, res) => {
    const { deletedCount } = await Product.deleteOne({ _id: req.params.id })
    if (!deletedCount) return res.status(404).send("Product unavailable")
    
    res.send("Product deleted")
})







module.exports=Router