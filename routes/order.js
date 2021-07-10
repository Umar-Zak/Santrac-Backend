const express = require("express")
const {Order,validateOP}=require("../models/order")
const auth = require("../middleware/auth")
const admin = require("../middleware/admin")
const objectId = require("../middleware/object-id")
const validateBody=require("../middleware/validate-body")
const {Product } = require("../models/product")



const Router = express.Router()
Router.get("/", auth, async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).populate("user")
    res.send(orders)
})

Router.get("/all", [auth,admin],async (req, res) => {
    const orders = await Order.find({}).populate("user")
    res.send(orders)
})

Router.get("/get/:id", [auth, objectId], async (req, res) => {
    const order = await Order.findById(req.params.id)
    res.send(order)
})

Router.post("/",[auth,validateBody(validateOP)] ,async (req, res) => {
    const { user, cart, reference, amount } = req.body
    const order = new Order({ user, cart, reference, amount })
    await order.save()
    res.send(order)
    
    for (let i = 0; i < cart.length; i++){
      await  Product.updateOne({_id:cart[i]._id},{$inc:{quantity:-cart[i].quantity}})
    }
})

Router.put("/delivered/:id", [auth,objectId], async (req, res) => {
    await Order.updateOne({ _id: req.params.id }, { $set: { delivered: true } })
    res.send("order delivered")
})



module.exports=Router