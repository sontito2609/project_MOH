var mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  desc: {
    type: String,
    required: true,
  },
  timeCreated: {
    type: Date,
    default: () => Date.now(),
  },
});

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;