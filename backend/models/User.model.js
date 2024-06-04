const mongoose = require("mongoose");
const Autoincrement = require('mongoose-sequence')(mongoose);
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({

    userName: {
        type: String,
        required: true,
        // trim :true ,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
    },
    Gmail_Acc: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },

    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    active: {
        type: Boolean,
        default: true,
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student',
    },
    phone: String,
    bio: String,
    image: {
        type: String,
        trim: true,
        default: '/app/user/defualt.jpg',
    },
    transcript: {
        type: String,
        trim: true,
    },
    age: {
        type: Number,
        default: 18
    },
    addresses: 
    {
            Country: String,
            cityOrTown: String,
            details: String,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    date: {
        type: String,
        default: Date(),
    },
    tokens: [{
        type: String,
        trim: true,
        Expires: {
            type: Date,
            default: Date.now,
            expires: "7h"
        },
    }]
    
},
    { timestamps: { createdAt: 'creationTime', updatedAt: 'lastModified' } }
)

userSchema.plugin(Autoincrement, {
    inc_field: 'id_Numder',
    id: 'ticketNums',
    start_seq: 1
})
userSchema.pre('save', async function (next) {
    const isModified = this.isModified('password');
    if (!isModified) return next();  //Don't re-hash if not modified + it will save empty or default value

    const strongPasswordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,30}$/;
    if (!strongPasswordRegex.test(this.password)) {
        return next(new Error('Password must be at least 8 characters long and include a mix of uppercase, lowercase, and numbers.'));
    }
    this.password = await bcrypt.hash(this.password, 12);
    next();
},
);


const studentDB = mongoose.model("users_table", userSchema)
module.exports = studentDB;

