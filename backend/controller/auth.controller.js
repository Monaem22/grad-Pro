const usermodel = require("../models/User.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto");
const sendEmail = require("../Services/sendEmail");
const sysActionModel = require("../models/system-actions.model")


const authUserController = {

    signUp: async (req, res) => {
        try {
            const data = req.body;
            const existingUser = await usermodel.findOne({ email: data.email });
            if (existingUser) {
                return res.status(403).send({
                    error: "email is already exists..please enter another email"
                });
            }
            const newUserData = await usermodel.create(data)

            await sysActionModel.create({
                action: ` someone signed up with this data : 
                ${newUserData}`,
            });

            res.status(201).send({ message: "signUp is accepted ,you can log in now" })
        } catch (error) {
            res.status(500).send({ message: error.message })
        }

    },
    
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await usermodel.findOne({ email })
            if (!user) {
                return res.status(403).json({ message: " Inavlid email or password" });
            }
            const validPassword = await bcrypt.compare(password, user.password)
            if (!validPassword) {
                return res.status(403).json({ message: " Inavlid email or password" });
            }
            if (user.isBlocked) {
                return res.status(403).json({ message: " you can't login...you are blocked...Contact the admin to help" });
            }

            const token = await jwt.sign({ id: user._id, role: user.role }, process.env.secret_key,
                { expiresIn: '7d' })
            res.cookie("access_token", `barear ${token}`, {
                httpOnly: true,
            })

            user.tokens.push(token )
            await user.save()

            await sysActionModel.create({
                user: user._id,
                action: ` ${user.email} loged in`,
            });

            return res.status(200).json({ message: "logIn is accepted", token })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie("access_token");
            console.log("logedOut");

            await sysActionModel.create({
                user: req.user._id,
                action: ` ${req.user.email} loged out`,
            });

            res.status(200).send("you are loged out")
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    },
    forgetPassword: async (req, res) => {
        try {
            var userDoc = await usermodel.findOne({ email: req.body.email });
            if (!userDoc) {
                return res.status(403).send({ message: "Email not found" });
            }
            const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
            const hashResetCode = crypto.createHash("sha256")
                .update(resetCode)
                .digest("hex");

            userDoc.passwordResetCode = hashResetCode;
            userDoc.passwordResetExpires = Date.now() + 10 * 60 * 1000;
            userDoc.passwordResetVerified = false;
            await userDoc.save();

            var message = ` HI ${userDoc.userName} ,
        we received to rest the password on your graduation_Project account \n
            ${resetCode} thanks `;
            console.log(resetCode);
            await sendEmail({
                email: userDoc.Gmail_Acc,
                subject: `your password reset code(valid for 10 min)`,
                text: message,
            });

            await sysActionModel.create({
                user: userDoc._id,
                action: ` ${userDoc.email} forgot his Password `,
            });

            return res.status(200).json({ status: "Success", message: "mail sent" });
        } catch (error) {
            userDoc.passwordResetCode = undefined;
            userDoc.passwordResetExpires = undefined;
            userDoc.passwordResetVerified = undefined;
            await userDoc.save();

            res.status(500).send({ message: error.message })
        }
    },
    verifyPassResetCode: async (req, res) => {
        const resetCode = req.body.resetCode
        if (!resetCode) {
            return res.status(404).send({ message: "no Reset code entered" });
        }
        const hashedResetCode = crypto
            .createHash("sha256")
            .update(resetCode)
            .digest("hex");

        const user = await usermodel.findOne({
            passwordResetCode: hashedResetCode,
            passwordResetExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(404).send({ message: "Reset code invalid or expired" });
        }
        user.passwordResetVerified = true;
        await user.save();

        await sysActionModel.create({
            user: user._id,
            action: ` ${user.email} forgot his Password and verified reset code : ${resetCode}`,
        });

        res.status(200).json({ status: "Success" });
    },
    resetPassword: async (req, res) => {
        try {
            const user = await usermodel.findOne({ email: req.body.email });
            if (!user) {
                return res.status(404).send({ message: `There is no user with email ${req.body.email}` });
            }
            if (!user.passwordResetVerified) {
                return res.status(404).send({ message: "Reset code not verified" });

            }

            const token = await jwt.sign({ id: user._id }, process.env.secret_key, {
                expiresIn: "7d",
            });
            res.cookie("access_token", `barear ${token}`, {
                httpOnly: true,
            })

            user.password = req.body.newPassword;
            user.passwordResetCode = undefined;
            user.passwordResetExpires = undefined;
            user.passwordResetVerified = undefined;
            user.tokens.push(token)
            await user.save();

            await sysActionModel.create({
                user: user._id,
                action: ` ${user.email} forgot his Password , verified reset code , now changed his pass and loged in`,
            });

            res.status(200).json({ message: "success", token });
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    },
}

module.exports = authUserController;
