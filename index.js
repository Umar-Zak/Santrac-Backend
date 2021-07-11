const express = require("express")
const mongoose = require("mongoose")
const config = require("config")
const cors = require("cors")
const helmet=require("helmet")
const auth = require("./routes/auth")
const product=require("./routes/product")
const order=require("./routes/order")
const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use("/assets/",express.static("assets"))
app.use("/users", auth)
app.use("/products",product)
app.use("/orders",order)
mongoose.connect(config.get("db")).then(() => {
    console.log(`Connected to ${config.get("db")}`)
}).catch(err => {
    console.log(`Error: ${err}`)
})


app.get("/", (req, res) => {
    res.send("This is an API exclusively built for Santrac Groupe. Contact the admin to find out the endpoints if interested")
})

const PORT = process.env.PORT||5000

app.listen(PORT, () => {
    console.log(`Now listening to ${PORT}`)
})