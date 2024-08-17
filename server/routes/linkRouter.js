import { Router } from "express";
import { authenticate } from "../controllers/authController.js";
import {
  createLink,
  getLinks,
  getLink,
  updateLink,
  deleteLink,
} from "../controllers/linkController.js";

const linkRouter = new Router();

linkRouter.route("/").post(authenticate, createLink);
linkRouter.route("/").get(authenticate, getLinks);

linkRouter.route("/:id").get(authenticate, getLink);
linkRouter.route("/:id").patch(authenticate, updateLink);
linkRouter.route("/:id").delete(authenticate, deleteLink);

export default linkRouter;
