import crypto from "node:crypto";

import { Schema, model } from "mongoose";

const tokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    token: String,
  },
  { expireAfterSeconds: 10 * 60, timestamps: true }
);

tokenSchema.pre("save", function (next) {
  this.token = crypto.randomBytes(12).toString("hex");

  next();
});

const Token = model("Token", tokenSchema);

export default Token;
