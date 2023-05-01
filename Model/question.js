const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ObjectId = Schema.ObjectId;

const questionSchema = new Schema(
  {

    questionAdd: { type: String, default: null },
    answerAdd: { type: String, default: null },
  },
  { timestamps: true }
);
module.exports = mongoose.model("question", questionSchema);
