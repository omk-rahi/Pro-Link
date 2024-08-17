import { promisify } from "node:util";

import jwt from "jsonwebtoken";

import asyncHandler from "../utils/asyncHandler.js";

import User from "../models/User.js";
import Token from "../models/Token.js";
import AppError from "../utils/AppError.js";
import sendMail from "../utils/sendMail.js";

import {
  validateChangePassword,
  validateLogin,
  validateResetPassword,
  validateSignup,
} from "../utils/validators.js";

const sendTokenCookie = (res, accessToken, refreshToken) => {
  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };

  res.cookie("accessToken", accessToken, cookieOptions);
  res.cookie("refreshToken", refreshToken, cookieOptions);
};

export const signup = asyncHandler(async (req, res, next) => {
  // 1. Validate the request body
  const { error, value } = validateSignup(req.body);
  if (error) return next(new AppError(400, error));

  // 2. Check if the email already exits
  const user = await User.findOne({ email: value.email });
  if (user) return next(new AppError(400, "Email already exits"));

  // 3. Save the user
  const { fullName, email, password } = value;
  const newUser = await User.create({ fullName, email, password });

  // 4. Generate token
  const { token } = await Token.create({ userId: newUser.id });
  const verificationLink = `http://localhost:3000/api/auth/verify/${newUser.id}/${token}`;

  //5. Send verification email
  sendMail({
    to: newUser.email,
    subject: "Verify your email address",
    text: `Registration successful, please verify your email.\n${verificationLink}`,
  });

  // 6. Send the response
  res.status(201).send({
    status: "success",
    message: "Registration successful, please verify your email.",
  });
});

export const verify = asyncHandler(async (req, res, next) => {
  try {
    // 1. Parse & Validate the params
    const { userId, token: tokenKey } = req.params;

    if (!userId || !tokenKey) return next(new AppError(400, "Invalid link"));

    // 2. Fetch the token & User
    const user = await User.findById(userId);
    if (!user) return next(new AppError(400, "Invalid link"));

    const token = await Token.findOne({ token: tokenKey, userId });
    if (!token)
      return next(
        new AppError(400, "Your token is expired please request a new token")
      );

    // 3. Mark the account verified
    user.isVerified = true;
    await user.save();

    // 4. Delete the token
    await Token.findByIdAndDelete(token._id);

    // 5. Send the response
    res.status(200).send({ status: "success", message: "Email verified" });
  } catch (err) {
    next(err);
  }
});

export const newVerificationToken = asyncHandler(async (req, res, next) => {
  // 1. Read email from the body
  const { email } = req.body;

  if (!email) return next(new AppError(400, "Please provide your email"));

  // 2. Check if the user exits
  const user = await User.findOne({ email });

  if (!user)
    return next(
      new AppError("Unable to find account associated with the email")
    );

  // 3. Check if the account is already verified
  if (user.isVerified)
    return next(new AppError(400, "Your account is already verified"));

  // 4. Generate token
  const { token } = await Token.create({ userId: user.id });
  const verificationLink = `http://localhost:3000/api/auth/verify/${user.id}/${token}`;

  //5. Send verification email
  sendMail({
    to: user.email,
    subject: "Verify your email address",
    text: `Please verify your email.\n${verificationLink}`,
  });

  // 5. Send Response

  res.status(200).json({
    status: "success",
    message: "Verification email sent to your email address",
  });
});

export const login = asyncHandler(async (req, res, next) => {
  // 1. Validate the request body
  const { error, value } = validateLogin(req.body);
  if (error) return next(new AppError(400, error));

  // 2. Check if the user exits
  const user = await User.findOne({ email: value.email });
  if (!user) return next(new AppError(400, "Given email is not registered"));

  // 3. Check if the account is verified

  if (!user.isVerified)
    return next(new AppError(400, "Please verify your email first"));

  // 4. Validate Password
  const isPasswordValid = await user.validatePassword(
    user.password,
    value.password
  );

  if (!isPasswordValid)
    return next(new AppError("401", "Invalid email or password"));

  // 5. Sign the JWT access token & refress token

  const { accessToken, refreshToken } = user.generateTokens(user.id);

  // 6. Save the refreshToken in Database

  user.refreshToken = refreshToken;
  await user.save();

  // 7. Send Cookies

  sendTokenCookie(res, accessToken, refreshToken);

  // 8. Send the response

  res.status(200).send({
    status: "success",
    data: {
      fullName: user.fullName,
      email: user.email,
      accessToken,
      refreshToken,
    },
  });
});

export const authenticate = asyncHandler(async (req, res, next) => {
  // 1. Read the token

  let token = req.cookies.accessToken;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    token = req.headers.authorization.split(" ").at(1);

  if (!token) {
    return next(
      new AppError(401, "You are not logged in. Please log in to get access")
    );
  }

  // 2. Verify the token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_ACCESS_TOKEN_SECRET
  );

  // 3. Check if the user exits
  const user = await User.findById(decoded.id);

  if (!user)
    return next(
      new AppError(
        401,
        "The user with given token does not exit. Please log in again"
      )
    );

  // 4. Allow Access
  req.user = user;

  next();
});

export const logout = asyncHandler(async (req, res, next) => {
  const { user } = req;

  user.refreshToken = null;
  await user.save();

  sendTokenCookie(res, "", "");

  res.status(200).json({ status: "success", message: "Logged out successful" });
});

export const refreshAccessToken = asyncHandler(async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  )
    return next(
      new AppError(401, "You are not logged in. Please log in to get access")
    );

  const token =
    req.headers.authorization.split(" ").at(1) || req.cookie.refreshToken;

  if (!token) {
    return next(
      new AppError(401, "You are not logged in. Please log in to get access")
    );
  }

  // 2. Verify the token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_REFRESS_TOKEN_SECRET
  );

  // 3. Check if the user exits
  const user = await User.findById(decoded.id);

  if (!user)
    return next(
      new AppError(
        401,
        "The user with given token does not exit. Please log in again"
      )
    );

  // 4. Sign the JWT access token & refress token
  const { accessToken, refreshToken } = user.generateTokens(user.id);

  // 5. Save the refreshToken in Database
  user.refreshToken = refreshToken;
  await user.save();

  // 6. Send Cookies
  sendTokenCookie(res, accessToken, refreshToken);

  // 7. Send Response
  res.status(200).send({
    status: "success",
    message: "Access token refreshed",
    data: {
      fullName: user.fullName,
      email: user.email,
      accessToken,
      refreshToken,
    },
  });
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
  // 1. Get email from request body
  const { email } = req.body;
  if (!email) return next(new AppError(400, "Please provide email"));

  // 2. Check if the associated user exits
  const user = await User.findOne({ email });
  if (!user)
    return next(
      new AppError(400, "Unable to find account associated with the email")
    );

  // 3. Generate token
  const { token } = await Token.create({ userId: user.id });
  const resetLink = `http://localhost:3000/api/auth/resetPassword/${user.id}/${token}`;

  //4. Send reset email
  sendMail({
    to: user.email,
    subject: "Reset your password",
    text: `Use this link to reset your password\n${resetLink}`,
  });

  // 5. Send the response
  res.status(200).send({
    status: "success",
    message: "Reset link sent to your email",
  });
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  // 1. Parse & Validate the params
  const { userId, token: tokenKey } = req.params;
  if (!userId || !tokenKey) return next(new AppError(400, "Invalid link"));

  // 2. Fetch the token & User
  const user = await User.findById(userId);
  if (!user) return next(new AppError(400, "Invalid link"));

  const token = await Token.findOne({ token: tokenKey, userId });
  if (!token)
    return next(
      new AppError(400, "Your token is expired please request a new token")
    );

  // 3. Get new password and confirm password from request body
  const { error, value } = validateResetPassword(req.body);
  if (error) return next(new AppError(400, error));

  // 4. Change the password
  user.password = value.password;
  await user.save();

  // 5. Delete the token
  await Token.findByIdAndDelete(token._id);

  // 5. Send the response
  res.status(200).json({
    status: "success",
    message: "Password reset successfully. Please log in",
  });
});

export const changePassword = asyncHandler(async (req, res, next) => {
  // 1. Read current password, newPassword, confirmPassword
  const { error, value } = validateChangePassword(req.body);
  if (error) return next(new AppError(400, error));

  // 2. Validate the current password
  const { user } = req;
  const isPasswordValid = await user.validatePassword(
    user.password,
    value.currentPassword
  );
  if (!isPasswordValid) return next(new AppError(401, "Incorrect Password"));

  // 3. set the new Passworrd
  user.password = value.newPassword;
  await user.save();

  // 4. Send the response
  res
    .status(200)
    .send({ status: "success", message: "Password changed successfully" });
});

export const profile = asyncHandler(async (req, res, next) => {
  const { user } = req;

  const { fullName, email } = user;

  res.send({ status: "success", data: { fullName, email } });
});
