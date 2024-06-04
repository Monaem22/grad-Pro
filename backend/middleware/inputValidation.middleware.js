
const validation = require("../Services/inputValidation.service")

function signUpVaIidation(req, res, next) {
    try {
        let { error } = validation.signUpSchema.validate(req.body)
        if (error) {
            let errMsg = error.details[0].message
            return res.status(403).send({ message: errMsg })
        }
        next()
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}
function loginVaIidation(req, res, next) {
    try {
        let { error } = validation.loginSchema.validate(req.body)
        if (error) {
            let errMsg = error.details[0].message
            return res.status(403).send({ message: errMsg })
        }
        next()
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}
function updatePasswordValidation(req, res, next) {
    try {
        let { error } = validation.updatePassword.validate(req.body)
        if (error) {
            let errMsg = error.details[0].message
            return res.status(403).send({ message: errMsg })
        }
        next()
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

module.exports = { loginVaIidation, signUpVaIidation, updatePasswordValidation }

