import { Schema, model } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/],
  },
  verified: {
    type: Boolean,
    default: false,
  },
  admin: {
    type: Boolean,
    default: false,
  },
});

const User = model("User", userSchema);
export default User;