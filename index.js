const express = require("express")
const mongoose = require("mongoose")
const config=require("config")
const app = express()

app.use(express.json())

mongoose.connect(config.get("db")).then(() => {
    console.log(`Connected to ${config.get("db")}`)
}).catch(err => {
    console.log(`Error: ${err}`)
})

const PORT = process.env.PORT||5000

app.listen(PORT, () => {
    console.log(`Now listening to ${PORT}`)
})