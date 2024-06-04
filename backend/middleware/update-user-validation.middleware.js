const usermodel = require("../models/User.model")


const updateUserValidation = async (req, res, next) => {
    try {
        if (req.body.password) {
            return res.status(403).send({
                message: "not allowed to edit password"
            })
        }
        const existingEmail = await usermodel.findOne({ email: req.body.email })
        if (existingEmail) {
            return res.status(403).send({
                message: "this email is already used before"
            });
        }
        next()

    } catch (error) {
        res.status(500).send({ message: error.message })
    }

}
module.exports = updateUserValidation;
