const express = require("express")
const mongoose = require("mongoose")
const config = require("config")
const cors = require("cors")
const helmet=require("helmet")
const auth=require("./routes/auth") 

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use("/assets/",express.static("assets"))
app.use("/users",auth)

mongoose.connect(config.get("db")).then(() => {
    console.log(`Connected to ${config.get("db")}`)
}).catch(err => {
    console.log(`Error: ${err}`)
})

const PORT = process.env.PORT||5000

app.listen(PORT, () => {
    console.log(`Now listening to ${PORT}`)
})