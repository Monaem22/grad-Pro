const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        trim: true,
        required: [true, 'name required'],
      },
      slug: {
        type: String,
        lowercase: true,
      },
      email: {
        type: String,
        required: [true, 'email required'],
        unique: true,
        lowercase: true,
      },
      phone: String,
      profileImg: String,
<<<<<<< HEAD
=======
      isblocked:{type : Boolean , default  : false}, // blocked by admin or self
>>>>>>> f8fff45bae413ff4093f1cd0ff5a66b1373a0836
      password: {
        type: String,
        required: [true, 'password required'],
        minlength: [6, 'Too short password'],
      },
      passwordChangedAt: Date,
      passwordResetCode: String,
      passwordResetExpires: Date,
      passwordResetVerified: Boolean,
      role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student',
      },
      active: {
        type: Boolean,
        default: true,
      },
      addresses: [
        {
          id: { type: mongoose.Schema.Types.ObjectId },
          alias: String,
          details: String,
          phone: String,
          city: String,
          postalCode: String,
        },
      ],
      favourtelist: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'projectwarehouse',
        },
      ],
      notification:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "notification"
      },
      warehouseDB:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "projectwarehouse"
      }],
    },
    { timestamps: true }
  );

  userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    // Hashing user password
    this.password = await bcrypt.hash(this.password, 12);
    next();
  });
  const User = mongoose.model('User', userSchema);
  module.exports = User;