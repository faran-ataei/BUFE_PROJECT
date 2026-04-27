import { Schema, model } from "mongoose";

const verifyEmailSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiresDate: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 60 * 60 * 1000),
    index: { expires: "1s" },
  }
});

const VerifyEmail = model("VerifyEmail", verifyEmailSchema);

export default VerifyEmail;