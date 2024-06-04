const jwt = require("jsonwebtoken");
const usermodel = require("../models/User.model")


const authentication = async (req, res, next) => {
    try {
        if (!req.cookies) {
            return res.status(403).send({ message: " unauthorized user...please login " })
        }
        let token = req?.cookies?.access_token?.split(" ")[1]

        let validToken = await jwt.verify(token, process.env.secret_key)
        if (!validToken) {
            console.log( " something wrong in valid token " );
            return res.status(403).send({ message: " unauthorized user...login please " })
        }
        let user = await usermodel.findById(validToken.id)
        if (!user) {
            console.log(" something wrong in bayload of token ");
            return res.status(403).send({ message: " unauthorized user " })
        }
        delete user.password;
        delete user.tokens;
        req.user = user;
        next()
    
    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
}

const adminAuthorization = async (req, res, next) => {
    try {
        authentication(req, res, () => {
            if (req.user.role === "admin") {
                // if(req.user.role ==="student"){
                return next()
            }
            return res.status(403).send({ message: "unauthorized user" })
        })
    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
}



module.exports = { authentication, adminAuthorization };