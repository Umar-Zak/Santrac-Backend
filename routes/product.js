const express = require("express")
const {validatePF,Product}=require("../models/product")
const auth = require("../middleware/auth")
const admin = require("../middleware/admin")
const objectId = require("../middleware/object-id")
const validateBody=require("../middleware/validate-body")
const {Category,validateCF} =require("../models/category")
const Router = express.Router()


Router.get("/all", async (req, res) => {
    const products = await Product.find()
    res.send(products)
})

Router.get("/all/categories", async (req, res) => {
    const categories = await Category.find()
    res.send(categories)
})

Router.get("/get/:id", objectId, async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).send("Product unavailable")
    
    res.send(product)
})


Router.get("/get/category/:id", objectId, async (req, res) => {
    const category = await Category.findById(req.params.id)
    if (!category) return res.status(404).send("Category unavailable")
    
    res.send(category)
})

Router.post("/add", [auth,admin,validateBody(validatePF)], async (req, res) => {
    const { name, price, quantity, image, description } = req.body
    
    const product = new Product({ name, price, description, image, quantity })
    await product.save()
    res.send(product)
})



Router.post("/add/categories", [auth, admin, validateBody(validateCF)], async (req, res) => {
    const category= new Category({name:req.body.name})
    await category.save()
    res.send(category)
})


Router.put("/category/:id", [auth, admin, objectId, validateBody(validateCF)], async (req, res) => {
    const {nModified} = await Category.updateOne({ _id: req.params.id }, { $set: { name: req.body.name } })
    if (nModified === 0) return res.status(404).send("Category unavailable")
    
    res.send("Category modified")
})

Router.put("/:id", [auth, admin, objectId, validateBody(validatePF)], async (req, res) => {
    const { name, price, quantity, image, description } = req.body
    
    const results = await Product.updateOne({ _id: req.params.id }, { $set: { price, name, quantity, image, description,lastModified:new Date() } })
    
    if (results.nModified === 0)
        return res.status(404).send("Product unavailable")

    res.send("Product modified")
    
})


Router.delete("/:id", [auth, admin, objectId], async (req, res) => {
    const { deletedCount } = await Product.deleteOne({ _id: req.params.id })
    if (!deletedCount) return res.status(404).send("Product unavailable")
    
    res.send("Product deleted")
})


Router.delete("/category/:id", [auth, admin, objectId], async (req, res) => {
    const { deletedCount } = await Category.deleteOne({ _id: req.params.id })
    if (!deletedCount) return res.status(404).send("Category unavailable")
    
    res.send("Category deleted");
})






module.exports=Router