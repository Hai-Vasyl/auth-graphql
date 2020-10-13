const { Schema, model, Types } = require("mongoose")

const schema = new Schema({
  completed: { type: Boolean, required: true },
  task: { type: String, required: true },
  owner: { type: Types.ObjectId, ref: "User", required: true },
})

module.exports = model("Todo", schema)
