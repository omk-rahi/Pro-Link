import { nanoid } from "nanoid";
import Link from "../models/Link.js";
import AppError from "../utils/AppError.js";
import { validateCreateLink, validateUpdateLink } from "../utils/validators.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createLink = asyncHandler(async (req, res, next) => {
  //   1. Validate the body
  const { error, value } = validateCreateLink(req.body);
  if (error) return next(new AppError(400, error));

  //   2. Create the Link
  const newLink = await Link.create({
    title: value.title,
    originalUrl: value.originalUrl,
    userId: req.user.id,
    shortUrl: nanoid(12),
  });

  // 3. Return the response
  res.status(201).send({ status: "success", data: { link: newLink } });
});

export const getLinks = asyncHandler(async (req, res, next) => {
  // 1. Fetch the links associated with the user
  const links = await Link.find({ userId: req.user.id });

  // 2. Return the response
  res.json({ status: "success", data: { links } });
});

export const getLink = asyncHandler(async (req, res, next) => {
  // 1. Get the param
  const { id } = req.params;

  // 2. Fetch the link associated with the user
  const link = await Link.findOne({ _id: id, userId: req.user.id });

  // 3. Return the response
  res.json({ status: "success", data: { link } });
});

export const updateLink = asyncHandler(async (req, res, next) => {
  const { error, value } = validateUpdateLink(req.body);

  if (error) return next(new AppError(400, error));

  const { id } = req.params;

  const link = await Link.findOneAndUpdate(
    { _id: id, userId: req.user.id },
    value,
    { new: true }
  );

  res.status(202).json({ status: "success", data: { link } });
});

export const deleteLink = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const link = await Link.findOneAndDelete({ _id: id, userId: req.user.id });

  res.status(204).json({ status: "success", data: { link } });
});
