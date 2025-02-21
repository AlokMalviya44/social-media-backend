import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "username is required"],
    unique: [true, "username already exists"],
    trim: true,
    lowercase: true,
    minLength: [3, "username must have at least 3 characters"],
    maxLength: [15, "username must have at most 15 characters"],
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email already exists"],
    trim: true,
    lowercase: true,
    minLength: [6, "username must have at least 6 characters"],
    maxLength: [40, "username must have at most 40 characters"],
  },

  profileImage: {
    type: String,
    default:
      "https://media.istockphoto.com/id/1477583639/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=OWGIPPkZIWLPvnQS14ZSyHMoGtVTn1zS8cAgLy1Uh24=",
  },

  password: {
    type: String,
    select: false,
  },
});

userSchema.statics.hashPassword = async function (password) {
  if (!password) {
    throw new Error("Password is required");
  }
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

userSchema.methods.comparePassword = async function (password) {
  if (!password) {
    throw new Error("Password is required");
  }
  if (!this.password) {
    throw new Error("Password is required");
  }
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = async function () {
  const token = jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
    },
    config.JWT_SECRET,
    {
      expiresIn: config.JWT_EXPIRES_IN,
    }
  );
  return token;
};

userSchema.statics.verifyToken = function (token) {
  if (!token) {
    throw new Error("Token is required");
  }
  return jwt.verify(token, config.JWT_SECRET);
};


const userModel = mongoose.model('user', userSchema);

export default userModel;
