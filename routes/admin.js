var express = require("express");
var router = express.Router();

var { isAdmin } = require("../middleware/requiresLogin");

var adminauth = require("../controllers/AdminController");
// Admin request

//get homepage
router.get("/home", adminauth.getHome_admin);

//display user accounts/ categories/ articles
router.get("/list_all_writer", adminauth.getListWriter_admin);
router.get("/list_all_category", adminauth.getListCategory_admin);
router.get("/list_all_articles", adminauth.getListArticle_admin);
router.get("/list_all_tag", adminauth.getListTag_admin);
router.get("/admin_blog_detail/:id", adminauth.getDetailArticle_admin);
router.put("/accept_article", adminauth.acceptArticle_admin);
router.put("/reject_article", adminauth.rejectArticle_admin);

//adding new category
router.get("/get_addCategory", adminauth.getCategory_admin);
router.post("/add_category", adminauth.addCategory_admin);

//adding new tag
router.get("/get_addTag", adminauth.getTag_admin);
router.post("/add_tag", adminauth.addTag_admin);
//update category
router.put("/update_category", adminauth.updateCategory_admin);
router.get("/update_category/:id", adminauth.getUpdateCategory_admin);
//update tag
router.put("/update_tag", adminauth.updateTag_admin);
router.get("/update_tag/:id", adminauth.getUpdateTag_admin);
//delete category/ tag/ article
router.delete("/delete_tag", adminauth.deleteTag_admin);
router.delete("/delete_article", adminauth.deleteArticle_admin);
router.delete("/delete_category", adminauth.deleteCategory_admin);
// block user
router.put("/blockUser", adminauth.blockUser);
router.put("/unblockUser", adminauth.unBlockUser);
// search
router.get("/do_search", adminauth.doSearch);
router.get("/search_user", adminauth.searchUser);
router.get("/search_category", adminauth.searchCategory);
router.get("/search_tag", adminauth.searchTag);
module.exports = router;