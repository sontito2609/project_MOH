var mongoose = require("mongoose");

const ArticlesSchema = new mongoose.Schema({
  name: String,
  desc: String,
  content: String,
  status: {
    type: String,
    enum: ["pending", "publish", "reject"],
    default: "pending",
  },
  views: {
    type: Number,
    default: 0,
  },
  articleImage: {
    type: String,
  },
  timeCreated: {
    type: Date,
    default: () => Date.now(),
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  tag_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Writer",
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});
const Articles = mongoose.model("Articles", ArticlesSchema);

module.exports = Articles;