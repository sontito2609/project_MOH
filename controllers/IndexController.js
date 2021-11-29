const AppUser = require("../models/AppUserModel");
const Writer = require("../models/WriterModel");
const Comment = require("../models/commentModel");
const Category = require("../models/CategoryModel");
const Articles = require("../models/ArticlesModel");
const Tag = require("../models/TagModel");

const getHome = async (req, res, next) => {
    const perPage = 4;
    var page = req.query.page || 1;
    try {
        const count = await Articles.countDocuments({status: "publish"});
        const popularArticles = await Articles.find({status: "publish"}).sort({ timeCreated: -1 }).limit(5).populate("author");
        const tags = await Tag.find({});
        const categories = await Category.find({});
        const articles = await Articles.find({status: "publish"}).populate("tag_id").populate("author").skip(perPage * page - perPage)
        .limit(perPage);
        res.render("./index", {
            popularArticles: popularArticles,
            tags: tags,
            categories: categories,
            articles: articles,
            pagination: {
                page: page,
                pageCount: Math.ceil(count / perPage),
              },
        });
    } catch (error) {
        console.log(error);
    }
};
//detail article
const getDetailArticle = async (req, res, next) => {
    const _id = req.params.id;
    try {
        const popularArticles = await Articles.find({status: "publish"}).sort({ timeCreated: -1 }).limit(5).populate("author");
        const categories = await Category.find({});
        const tags = await Tag.find({});
        const article = await Articles.findOne({_id:_id}).populate("author").populate("tag_id");
        const commentInfo = await Comment.find({ article_id: article._id }).populate({path: 'author', populate: {path: 'account_id'}});
        const countComment = await Comment.countDocuments({article_id: article._id});
        return res.render("./blog_detail", {
            popularArticles: popularArticles,
            categories: categories,
            tags: tags,
            commentInfo: commentInfo,
            countComment: countComment,
            article: article,
        });
    } catch (error) {
        console.log(error);
    }
};
const getAritcleByCategory = async (req, res, next) => {
    const _id = req.params.id;
    const perPage = 4;
    var page = req.query.page || 1;
    try {
        const tags = await Tag.find({});
        const popularArticles = await Articles.find({status: "publish"}).sort({ timeCreated: -1 }).limit(5).populate("author");
        const categories = await Category.find({});
        const category = await Category.findOne({ _id: _id });
        const count = await Articles.countDocuments({status: "publish", category_id: category._id});
        const articleInCategory = await Articles.find({ status: "publish", category_id: category._id }).populate("tag_id").populate("author").skip(perPage * page - perPage)
        .limit(perPage);
        const writerAccount = await AppUser.findOne({});
        res.render("./list_articleByCategory", {
            tags: tags,
            popularArticles: popularArticles,
            categories: categories,
            category: category,
            articleInCategory: articleInCategory,
            writerAccount: writerAccount,
            pagination: {
                page: page,
                pageCount: Math.ceil(count / perPage),
            },
        })
    } catch (error) {
        console.log(error);
    }
};
const getAritcleByTag = async (req, res, next) => {
    const _id = req.params.id;
    const perPage = 4;
    var page = req.query.page || 1;
    try {
        const popularArticles = await Articles.find({status: "publish"}).sort({ timeCreated: -1 }).limit(5).populate("author");
        const tags = await Tag.find({});
        const categories = await Category.find({});
        const tag = await Tag.findOne({ _id: _id });
        const count = await Articles.countDocuments({status: "publish", tag_id: tag._id});
        const articleInTag = await Articles.find({status: "publish", tag_id: tag._id }).populate("tag_id").populate("author").skip(perPage * page - perPage)
        .limit(perPage);
        res.render("./list_articleByTag", {
            tags: tags,
            popularArticles: popularArticles,
            categories: categories,
            articleInTag: articleInTag,
            pagination: {
                page: page,
                pageCount: Math.ceil(count / perPage),
            },
        })
    } catch (error) {
        console.log(error);
    }
};
// search
const doSearch = async (req, res, next) => {
    const perPage = 4;
    var page = req.query.page || 1;
    const { search } = req.query;
    const keySearch = req.query.search;
    let re = new RegExp(keySearch, "i");
    try {
        
        const count = await Articles.countDocuments({ name: re });
        const popularArticles = await Articles.find({ status: "publish" }).sort({ timeCreated: -1 }).limit(5).populate("author");
        const tags = await Tag.find({});
        const categories = await Category.find({});
        const searchArticle = await Articles.find({
            $or: [
                { name: re },
            ],
        }).populate("author").skip(perPage * page - perPage).limit(perPage);
            return res.render("./index", {
                popularArticles: popularArticles,
                tags: tags,
                categories: categories,
                articles: searchArticle,
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
    getHome,
    getDetailArticle,
    doSearch,
    getAritcleByCategory,
    getAritcleByTag,
};