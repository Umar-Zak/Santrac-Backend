const jwt = require("jsonwebtoken")
const config = require("config")


module.exports = (req,res,next) => {
    const token = req.headers("x-auth-token")
    if (!token) return res.status(401).send("Unauthorized to visit this endpoint")
    
    try {
        const user = jwt.verify(token, config.get("privatekey"))
        req.user = user
        next()
    }
    catch (ex) {
        res.status(400).send("Unrecognized token")
    }
}