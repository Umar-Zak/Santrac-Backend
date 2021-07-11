const express = require("express")
const {validatePF,Product,Cart,validateCC}=require("../models/product")
const auth = require("../middleware/auth")
const admin = require("../middleware/admin")
const objectId = require("../middleware/object-id")
const validateBody=require("../middleware/validate-body")
const {Category,validateCF} =require("../models/category")
const Router = express.Router()


Router.get("/all", async (req, res) => {
    const products = await Product.find({}).populate("category")
    res.send(products)
})


Router.get("/cart-items", auth, async (req, res) => {
    const items = await Cart.find({ user: req.user._id })
    res.send(items)
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
    let { name, price, quantity, image, description,category } = req.body
    
    category = await Category.findById(category)
    if(!category)return res.status(404).send("Category unavailable")

    const product = new Product({ name, price, description, image, quantity,category:category._id })
    await product.save()
    res.send(product)
})


Router.post("/add-to-cart", [auth,validateBody(validateCC)], async (req, res) => {
    let items = await Cart.find({ user: req.body.user })
    if (items.length === 0) {
        items = new Cart({ user: req.body.user, items: req.body.items })
        await items.save()
       return  res.send("Items added to cart")
    }

    await Cart.updateOne({ user: req.body.user }, { $set: { items: req.body.items } })
    res.send("Cart updated")
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
    const { name, price, quantity, image, description,category } = req.body
    
    const results = await Product.updateOne({ _id: req.params.id }, { $set: { price, name, quantity,category,image, description,lastModified:new Date() } })
    
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