const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ObjectId = Schema.ObjectId;

const userSchema = new Schema(
  {
    fName: { type: String, default: null },
    lName: { type: String, default: null },
    email: { type: String, default: null },
    password: { type: String, default: null },
    status: { type: String, default: null },
  },
  { timestamps: true }
);
module.exports = mongoose.model("user", userSchema);
