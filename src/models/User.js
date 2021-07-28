import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  // email_verified: {
  //   type: Boolean,
  //   default: false,
  // },
  // picture: {
  //   type: String,
  // },
  id: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema, "users");

export default User;
