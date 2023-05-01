const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const otpSchema = new Schema({
    otp: { type: String, default: null },
    email: { type: String, default: null },
    createdAt: { type: Date, default: null },
    status: { type: String, default: "Y" },

});

module.exports = mongoose.model("otp", otpSchema)

