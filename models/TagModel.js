var mongoose = require("mongoose");

const TagSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  timeCreated: {
    type: Date,
    default: () => Date.now(),
  },
});

const Tag = mongoose.model("Tag", TagSchema);

module.exports = Tag;