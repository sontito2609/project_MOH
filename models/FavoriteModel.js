var mongoose = require("mongoose");
const FavoriteSchema = new mongoose.Schema({
    article_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Articles",
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Writer",
    },
});
const Favorite = mongoose.model("Favorite", FavoriteSchema);
module.exports = Favorite;
