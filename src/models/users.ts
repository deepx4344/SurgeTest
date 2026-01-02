import mongoose from "mongoose";

const usersSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select:false
    },
    verified: {
      type: Boolean,
      default: false,
    },
    paid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.model("User", usersSchema);
export default Users;
