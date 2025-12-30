import mongoose from "mongoose";

const usersSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    Gid: {
      type: String,
    },
    userReg: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.model("User", usersSchema);
export default Users;
