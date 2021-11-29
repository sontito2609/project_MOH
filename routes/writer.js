var express = require("express");
var router = express.Router();

var { isWriter } = require("../middleware/requiresLogin");
var { multerInstance } = require("../middleware/uploadImage");

var writerauth = require("../controllers/WriterController");

//get homepage
router.get("/home", writerauth.getWriterHome);
//list all article
router.get("/list_all_article", writerauth.getListArticle);
//update information account
router.post("/update_profile", multerInstance, writerauth.ChangeProfile);
router.get("/update_profile/:id", writerauth.getChangeProfile);
//update password 
router.put("/update_password", writerauth.ChangePassword);
//add article
router.get("/get_addArticle", writerauth.getArticle);
router.post("/add_Article", multerInstance, writerauth.addArticle);
//article detail
router.get("/writer_blog_detail/:id", writerauth.getDetailArticle_writer);
//update article
router.post("/update_article", multerInstance, writerauth.updateArticle);
router.get("/update_article/:id", writerauth.getUpdateArticle);
//delete article
router.delete("/delete_article", writerauth.deleteArticle);
// do comment 
router.post("/do_comment", writerauth.doComment);
//delete comment
router.delete("/delete_comment", writerauth.deleteComment);
// search
router.get("/do_search", writerauth.doSearch);
// favorite
router.put("/favor_article", writerauth.doFavorite);
// list favorite
router.get("/list_favorite_article", writerauth.getListFavorArticle);
//delete favorite
router.delete("/delete_favorite", writerauth.deleteFavorite);
//list article by category
router.get("/list_articleByCategory/:id", writerauth.getAritcleByCategory);
//list article by tag
router.get("/list_articleByTag/:id", writerauth.getAritcleByTag);
// delete tag
router.delete("/delete_tag", writerauth.deleteTag);
module.exports = router;
