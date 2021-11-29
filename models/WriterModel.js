var mongoose = require("mongoose");

const WriterSchema = new mongoose.Schema({
  name: {
    type: String,
    //required: true,
  },
  email: {
    type: String,
    //required: true, 
  },
  avatarImage: {
    type: String,
    default: "default_avatar.jpg",
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Articles",
    },
  ],
  account_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AppUser",
  },
  favorite_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Favorite",
    }
  ]
});

const Writer = mongoose.model("Writer", WriterSchema);

module.exports = Writer;