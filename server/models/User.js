const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, '"name" is a required field.'], trim: true, minlength: [2, '"name" must be at least 2 characters.'] },
    email: {
      type: String,
      required: [true, '"email" is a required field.'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, '"email" must be a valid email address.'],
    },
    password: {
      type: String,
      required: [true, '"password" is a required field.'],
      minlength: [6, '"password" must be at least 6 characters.'],
      select: false, // never returned by queries unless explicitly requested
    },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  },
  {
    timestamps: true,
    toJSON: { versionKey: false, transform: (_doc, ret) => { delete ret.password; return ret; } },
  }
);

// Hash the password with bcrypt (10 salt rounds) before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);
