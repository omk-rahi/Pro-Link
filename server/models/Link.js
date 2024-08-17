import { Schema, model } from "mongoose";

const transform = function (doc, ret, options) {
  const obj = { ...ret, id: ret._id };
  delete obj.__v;
  delete obj._id;
  return obj;
};

const linkSchema = new Schema(
  {
    title: String,
    originalUrl: String,
    shortUrl: String,

    clicks: {
      type: Number,
      default: 0,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toObject: {
      transform,
    },
    toJSON: {
      transform,
    },
  }
);

const Link = model("Link", linkSchema);

export default Link;
