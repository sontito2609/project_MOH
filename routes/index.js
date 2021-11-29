var express = require('express');
var router = express.Router();
var indexauth = require("../controllers/IndexController");
 

/* GET home page. */
router.get('/', indexauth.getHome);
router.get('/blog_detail/:id', indexauth.getDetailArticle);
// search
router.get("/do_search", indexauth.doSearch);
//list article by category
router.get("/list_articleByCategory/:id", indexauth.getAritcleByCategory);
//list article by tag
router.get("/list_articleByTag/:id", indexauth.getAritcleByTag);
module.exports = router;
