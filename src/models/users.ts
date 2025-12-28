import mongoose from "mongoose";

const usersSchema = new mongoose.Schema(
  {
    name:{
      type:String,
      required:true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    currency:{
      type:String,
      required:true,
      maxLength:3
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
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
