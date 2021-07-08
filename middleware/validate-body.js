
module.exports = validtor => {
    return (req, res, next) => {
        const { error } = validtor(req.body)
        if (error) return res.status(400).send(error.details[0].message)
        
        next()
    }
}