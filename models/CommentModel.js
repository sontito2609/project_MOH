var mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Writer",
  },
  comment: String,
  article_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Articles",
  },
  timeCreated: {
    type: Date,
    default: () => Date.now(),
  },
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
