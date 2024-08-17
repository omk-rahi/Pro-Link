import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Schema, model } from "mongoose";

const transform = function (doc, ret, options) {
  const obj = { ...ret, id: ret._id };
  delete obj.__v;
  delete obj._id;
  return obj;
};

const userSchema = new Schema(
  {
    fullName: String,
    email: String,
    password: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: String,
  },
  {
    toObject: {
      transform,
    },
    toJSON: {
      transform,
    },
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();

  const hashedPassword = bcrypt.hashSync(this.password, 12);

  this.password = hashedPassword;

  next();
});

userSchema.methods.validatePassword = async (hashPassword, givenPassword) => {
  return await bcrypt.compare(givenPassword, hashPassword);
};

userSchema.methods.generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE_TIME,
    }
  );
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESS_TOKEN_SECRET,
    {
      expiresIn: process.env.JWT_REFRESS_TOKEN_EXPIRE_TIME,
    }
  );

  return { accessToken, refreshToken };
};

const User = model("User", userSchema);

export default User;
