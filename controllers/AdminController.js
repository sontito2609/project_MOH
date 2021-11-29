const AppUser = require("../models/AppUserModel");
const Writer = require("../models/WriterModel");

const Category = require("../models/CategoryModel");
const Articles = require("../models/ArticlesModel");
const Tag = require("../models/TagModel");

//The processing section for an user account is below
const getHome_admin = async (req, res, next) => {
  try {
    const tags = await Tag.find({});
    const categories = await Category.find({});
    const articles = await Articles.find({});
    res.render("adminViews/admin_home", {
      tags: tags,
      categories: categories,
      articles: articles,
      layout: "adminLayout.hbs",
    });
  } catch (error) {
    console.log(error);
  }
};
//Showing list of user
const getListWriter_admin = async (req, res, next) => {
  const perPage = 4;
  var page = req.query.page || 1;
  const { msg } = req.query;
  try {
    //const title = "List of User";

    const count = await Writer.countDocuments();
    const WriterInfo = await Writer.find({})
      .populate("account_id")
      .skip(perPage * page - perPage)
      .limit(perPage);
    return res.render("adminViews/admin_list_writer", {
      WriterInfo: WriterInfo,
      title: "List of Writer",
      layout: "adminLayout.hbs",
      pagination: {
        page: page,
        pageCount: Math.ceil(count / perPage),
      },
      err: msg,
    });
  } catch (error) {
    console.log(error);
  }
};
// Block account
const blockUser = async (req, res, next) => {
  const { _id } = req.body;
  try {
    const deleteUser = await Writer.findOne({ _id: _id });
    const deleteAcc = await AppUser.findOneAndUpdate(
      { _id: deleteUser.account_id },
      { $set: { role: "block" } }
    );

    const msg = "Block User Success!";
    return res.redirect(`/admin/list_all_writer?msg=${msg}`);
  } catch (error) {
    console.log(error);
  }
};

const unBlockUser = async (req, res, next) => {
  const { _id } = req.body;
  try {
    const deleteUser = await Writer.findOne({ _id: _id });
    const deleteAcc = await AppUser.findOneAndUpdate(
      { _id: deleteUser.account_id },
      { $set: { role: "writer" } }
    );
    const msg = "Unblock User Success!";
    return res.redirect(`/admin/list_all_writer?msg=${msg}`);
  } catch (error) {
    console.log(error);
  }
};
/* ========================================================================================================================================= */
//The processing section for category is below
//Get list of category
const getListCategory_admin = async (req, res, next) => {
  const perPage = 4;
  var page = req.query.page || 1;
  const _id = req.params.id;
  const { msg } = req.query;
  try {
    const count = await Category.countDocuments();
    const category = await Category.find({})
      .skip(perPage * page - perPage)
      .limit(perPage);
    return res.render("adminViews/admin_list_category", {
      category: category,
      _id: _id,
      layout: "adminLayout.hbs",
      pagination: {
        page: page,
        pageCount: Math.ceil(count / perPage),
      },
      err: msg,
    });
  } catch (error) {
    console.log(error);
  }
};
const getCategory_admin = async (req, res, next) => {
  const { msg } = req.query;
  try {
    return res.render("adminViews/admin_add_category", {
      layout: "adminLayout.hbs",
      err: msg,
    });
  } catch (error) {
    console.log(error);
  }
};
//Adding new category
const addCategory_admin = async (req, res, next) => {
  const { name, desc, _id } = req.body;
  Category.findOne({ name: name }).exec((err, value) => {
    if (err) {
      return console.log(err);
    } else if (value) {
      const msg = "This category is already existed !!! Please Try again";
      return res.redirect(`/admin/get_addCategory?msg=${msg}`);
    } else {
      const newCategory = new Category({
        name: name,
        desc: desc,
      });

      newCategory.save();
      console.log(newCategory);
      const msg = "Create Success!!!";
      return res.redirect(`/admin/list_all_category?msg=${msg}`);
    }
  });
};

//Update category
const updateCategory_admin = (req, res, next) => {
  const { name, desc, _id } = req.body;
  const newValue = {};
  if (name) newValue.name = name;
  if (desc) newValue.desc = desc;
  
  Category.findOne({ name: name }).exec((err, value) => {
    if (err) {
      return res.status(400).send(err);
    } else if (value) {
      const msg = "This Category is already existed !!! Please Try again";
      return res.redirect(`/admin/update_category/${_id}?msg=${msg}`);
    } else {
      Category.findOneAndUpdate(
        { _id: _id },
        { $set: newValue },
        { new: true, useFindAndModify: false }
      )
        .exec()
        .then((value) => {
          console.log(value);
          const msg = "Update Success!!!";
          res.redirect(`/admin/list_all_category?msg=${msg}`);
        })
        .catch((err) => {
          res.send(err);
        });
    }
  });
};
const getUpdateCategory_admin = async (req, res, next) => {
  const { msg } = req.query;
  const _id = req.params.id;
  try {
    const category = await Category.findOne({ _id: _id });
    return res.render("./adminViews/admin_update_category", {
      category: category,
      layout: "adminLayout.hbs",
      err: msg,
    });
  } catch (error) {
    console.log(error);
  }
};

//Delete category
const deleteCategory_admin = async (req, res, next) => {
  const { _id } = req.body;
  try {
    const deleted = await Category.findOneAndRemove({ _id: _id });
    const deleteArticle = await Articles.findOneAndRemove({
      category_id: deleted._id,
    });
    const updateArticle = await Writer.findOneAndUpdate(
      { posts: _id },
      { $pull: { posts: _id } },
      { new: true }
    );
    const msg = "Delete Success!!!";
    return res.redirect(`/admin/list_all_category?msg=${msg}`);
  } catch (error) {
    console.log(error);
  }
};
//show list of article
const getListArticle_admin = async (req, res, next) => {
  const perPage = 4;
  var page = req.query.page || 1;
  const { msg } = req.query;
  try {
    const count = await Articles.countDocuments();
    const article = await Articles.find({})
      .populate("author")
      .populate("category_id")
      .populate("tag_id")
      .skip(perPage * page - perPage)
      .limit(perPage);
    return res.render("./adminViews/admin_list_article", {
      article: article,
      layout: "adminLayout.hbs",
      pagination: {
        page: page,
        pageCount: Math.ceil(count / perPage),
      },
      err: msg,
    });
  } catch (error) {
    console.log(error);
  }
};
//Accecpt and reject article
const acceptArticle_admin = async (req, res, next) => {
  const { _id } = req.body;
  try {
    await Articles.findOneAndUpdate(
      { _id: _id },
      { $set: { status: "publish" } }
    );
    const msg = "Accept Success!";
    return res.redirect(`/admin/list_all_articles?msg=${msg}`);
  } catch (err) {
    console.log(err);
  }
};
const rejectArticle_admin = async (req, res, next) => {
  const { _id } = req.body;
  try {
    await Articles.findOneAndUpdate(
      { _id: _id },
      { $set: { status: "reject" } }
    );
    const msg = "Reject Success!";
    return res.redirect(`/admin/list_all_articles?msg=${msg}`);
  } catch (err) {
    console.log(err);
  }
};
// view detail article
const getDetailArticle_admin = async (req, res, next) => {
  const _id = req.params.id;
  try {
    const article = await Articles.findOne({ _id: _id });
    return res.render("./adminViews/admin_detail_blog", {
      article: article,
      layout: "adminLayout.hbs",
    });
  } catch (error) {
    console.log(error);
  }
};
// delete article
const deleteArticle_admin = async (req, res, next) => {
  const { _id } = req.body;
  try {
    const deleteArticle = await Articles.findOneAndDelete({ _id: _id });
    const msg = "Delete Success!!!";
    return res.redirect(`/admin/list_all_articles?msg=${msg}`);
  } catch (error) {
    console.log(error);
  }
};
//Get list of tag
const getListTag_admin = async (req, res, next) => {
  const perPage = 4;
  var page = req.query.page || 1;
  const { msg } = req.query;
  const _id = req.params.id;
  try {
    const count = await Tag.countDocuments();
    const tag = await Tag.find({}).skip(perPage * page - perPage).limit(perPage);
    return res.render("adminViews/admin_list_tag", {
      tag: tag,
      _id: _id,
      layout: "adminLayout.hbs",
      pagination: {
        page: page,
        pageCount: Math.ceil(count / perPage),
      },
      err: msg,
    });
  } catch (error) {
    console.log(error);
  }
};
// adding new tag
const getTag_admin = async (req, res, next) => {
  const { msg } = req.query;
  try {
    return res.render("adminViews/admin_add_tag", {
      layout: "adminLayout.hbs",
      err: msg,
    });
  } catch (error) {
    console.log(error);
  }
};
const addTag_admin = async (req, res, next) => {
  const { name, _id } = req.body;
  Tag.findOne({ _id: _id }).exec((err, value) => {
    if (err) {
      return console.log(err);
    } else if (value) {
      const msg = "This tag is already existed !!! Please Try again";
      return res.redirect(`/admin/get_addTag?msg=${msg}`);
    } else {
      const newTag = new Tag({
        name: name,
      });
      newTag.save();
      console.log(newTag);
      const msg = "Create Success!!!";
      return res.redirect(`/admin/list_all_tag?msg=${msg}`);
    }
  });
};
// update tag
const getUpdateTag_admin = async (req, res, next) => {
  const { msg } = req.query;
  const _id = req.params.id;
  try {
    const tag = await Tag.findOne({ _id: _id });
    return res.render("./adminViews/admin_update_tag", {
      tag: tag,
      layout: "adminLayout.hbs",
      err: msg,
    });
  } catch (error) {
    console.log(error);
  }
};
const updateTag_admin = (req, res, next) => {
  const { name, _id } = req.body;
  const newValue = {};
  if (name) newValue.name = name;

  Tag.findOne({ name: name }).exec((err, value) => {
    if (err) {
      return res.status(400).send(err);
    } else if (value) {
      const msg = "This Tag is already exist !!! Please Try again";
      return res.redirect(`/admin/update_tag/${_id}?msg=${msg}`);
    } else {
      Tag.findOneAndUpdate(
        { _id: _id },
        { $set: newValue },
        { new: true, useFindAndModify: false }
      )
        .exec()
        .then((value) => {
          console.log(value);
          const msg = "Update Success!!!";
          res.redirect(`/admin/list_all_tag?msg=${msg}`);
        })
        .catch((err) => {
          res.send(err);
        });
    }
  });
};
// delete tag
const deleteTag_admin = async (req, res, next) => {
  const { _id } = req.body;
  try {
    const deleted = await Tag.findOneAndRemove({ _id: _id });
    const deleteTag = await Articles.findOneAndUpdate(
      { tag_id: _id },
      { $pull: { tag_id: _id } },
      { new: true }
    );
    const msg = "Delete Success!!!";
    return res.redirect(`/admin/list_all_tag?msg=${msg}`);
  } catch (error) {
    console.log(error);
  }
};
const doSearch = async (req, res, next) => {
  const perPage = 4;
  var page = req.query.page || 1;
  const { search } = req.query;
  const keySearch = req.query.search;
  let re = new RegExp(keySearch, "i");
  try {
    const count = await Articles.countDocuments();
    const categories = await Category.find({});
    const searchArticle = await Articles.find({ name: re })
      .populate("author")
      .skip(perPage * page - perPage)
      .limit(perPage);
    return res.render("adminViews/admin_list_article", {
      layout: "adminLayout.hbs",
      categories: categories,
      article: searchArticle,
      search,
      pagination: {
        page: page,
        pageCount: Math.ceil(count / perPage),
      },
    });
  } catch (error) {
    console.log(error);
  }
};
const searchUser = async (req, res, next) => {
  const perPage = 4;
  var page = req.query.page || 1;
  const { search } = req.query;
  const keySearch = req.query.search;
  let re = new RegExp(keySearch, "i");
  try {
    const count = await Writer.countDocuments();
    const categories = await Category.find({});
    const searchUser = await Writer.find({ name: re })
      .populate("account_id")
      .skip(perPage * page - perPage)
      .limit(perPage);
    return res.render("adminViews/admin_list_writer", {
      layout: "adminLayout.hbs",
      categories: categories,
      WriterInfo: searchUser,
      search,
      pagination: {
        page: page,
        pageCount: Math.ceil(count / perPage),
      },
    });
  } catch (error) {
    console.log(error);
  }
};
const searchCategory = async (req, res, next) => {
  const perPage = 4;
  var page = req.query.page || 1;
  const { search } = req.query;
  const keySearch = req.query.search;
  let re = new RegExp(keySearch, "i");
  try {
    const count = await Category.countDocuments();
    const searchCategory = await Category.find({ name: re })
      .skip(perPage * page - perPage)
      .limit(perPage);
    return res.render("adminViews/admin_list_category", {
      layout: "adminLayout.hbs",
      category: searchCategory,
      search,
      pagination: {
        page: page,
        pageCount: Math.ceil(count / perPage),
      },
    });
  } catch (error) {
    console.log(error);
  }
};
const searchTag = async (req, res, next) => {
  const perPage = 4;
  var page = req.query.page || 1;
  const { search } = req.query;
  const keySearch = req.query.search;
  let re = new RegExp(keySearch, "i");
  try {
    const count = await Tag.countDocuments();
    const searchTag = await Tag.find({ name: re })
      .skip(perPage * page - perPage)
      .limit(perPage);
    return res.render("adminViews/admin_list_tag", {
      layout: "adminLayout.hbs",
      tag: searchTag,
      search,
      pagination: {
        page: page,
        pageCount: Math.ceil(count / perPage),
      },
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  getHome_admin,
  getCategory_admin,
  getTag_admin,
  getListWriter_admin,
  getListCategory_admin,
  getListTag_admin,
  getListArticle_admin,
  getUpdateCategory_admin,
  getUpdateTag_admin,
  addCategory_admin,
  addTag_admin,
  getTag_admin,
  updateTag_admin,
  updateCategory_admin,
  deleteCategory_admin,
  deleteArticle_admin,
  deleteTag_admin,
  acceptArticle_admin,
  rejectArticle_admin,
  getDetailArticle_admin,
  doSearch,
  searchUser,
  searchCategory,
  searchTag,
  blockUser,
  unBlockUser,
};
