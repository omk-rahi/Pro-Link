import { Router } from "express";

import {
  login,
  signup,
  verify,
  logout,
  authenticate,
  profile,
  changePassword,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
  newVerificationToken,
} from "../controllers/authController.js";

const authRouter = new Router();

authRouter.route("/signup").post(signup);
authRouter.route("/login").post(login);

authRouter.route("/forgotPassword").post(forgotPassword);
authRouter.route("/changePassword").post(authenticate, changePassword);
authRouter.route("/resetPassword/:userId/:token").post(resetPassword);

authRouter.route("/logout").get(authenticate, logout);
authRouter.route("/me").get(authenticate, profile);

authRouter.route("/verify/:userId/:token").get(verify);
authRouter
  .route("/newVerificationToken/:userId/:token")
  .post(newVerificationToken);

authRouter.route("/refreshAccessToken").get(refreshAccessToken);

export default authRouter;
