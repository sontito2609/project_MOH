const AppUser = require("../models/AppUserModel");
const Writer = require("../models/WriterModel");
const Category = require("../models/CategoryModel");
const Articles = require("../models/ArticlesModel");
const Comment = require("../models/commentModel");
const Tag = require("../models/TagModel");
const Favorite = require("../models/FavoriteModel");
    
// get homepage
const getWriterHome = async (req, res, next) => {
    const perPage = 4;
    var page = req.query.page || 1;
    try {
        const count = await Articles.countDocuments({ status: "publish" });
        const popularArticles = await Articles.find({ status: "publish" }).sort({ timeCreated: -1 }).limit(5).populate("author");
        const tags = await Tag.find({});
        const categories = await Category.find({});
        const articles = await Articles.find({ status: "publish" }).populate("tag_id").populate("author").skip(perPage * page - perPage).limit(perPage);
        const writerAccount = await AppUser.findOne({});
        const writerInfo = await Writer.findOne({ account_id: req.session.userId }).populate("account_id");
        res.render("writerViews/writer_home", {
            popularArticles: popularArticles,
            tags: tags,
            categories: categories, 
            articles: articles,
            writerAccount: writerAccount,
            writerInfo: writerInfo,
            pagination: {
                page: page,
                pageCount: Math.ceil(count / perPage),
            },
        });
    } catch (error) {
        console.log(error);
    }
};
//list article by category
const getAritcleByCategory = async (req, res, next) => {
    const _id = req.params.id;
    const perPage = 4;
    var page = req.query.page || 1;
    try {
        const tags = await Tag.find({});
        const popularArticles = await Articles.find({ status: "publish" }).sort({ timeCreated: -1 }).limit(5).populate("author");
        const categories = await Category.find({});
        const category = await Category.findOne({ _id: _id });
        const count = await Articles.countDocuments({ status: "publish", category_id: category._id });
        const articleInCategory = await Articles.find({ status: "publish", category_id: category._id }).populate("tag_id").populate("author").skip(perPage * page - perPage)
            .limit(perPage);
        const writerAccount = await AppUser.findOne({});
        const writerInfo = await Writer.findOne({ account_id: req.session.userId }).populate("account_id");
        res.render("writerViews/writer_list_articleByCategory", {
            tags: tags,
            popularArticles: popularArticles,
            categories: categories,
            category: category,
            articleInCategory: articleInCategory,
            writerAccount: writerAccount,
            writerInfo: writerInfo,
            pagination: {
                page: page,
                pageCount: Math.ceil(count / perPage),
            },
        })
    } catch (error) {
        console.log(error);
    }
};
// list article by tag
const getAritcleByTag = async (req, res, next) => {
    const _id = req.params.id;
    const perPage = 4;
    var page = req.query.page || 1;
    try {
        const popularArticles = await Articles.find({ status: "publish" }).sort({ timeCreated: -1 }).limit(5).populate("author");
        const tags = await Tag.find({});
        const categories = await Category.find({});
        const tag = await Tag.findOne({ _id: _id });
        const count = await Articles.countDocuments({ status: "publish", tag_id: tag._id });
        const articleInTag = await Articles.find({ status: "publish", tag_id: tag._id }).populate("tag_id").populate("author").skip(perPage * page - perPage)
            .limit(perPage);
        const writerAccount = await AppUser.findOne({});
        const writerInfo = await Writer.findOne({ account_id: req.session.userId }).populate("account_id");
        res.render("writerViews/writer_list_articleByTag", {
            tag: tag,
            tags: tags,
            categories: categories,
            popularArticles: popularArticles,
            articleInTag: articleInTag,
            writerAccount: writerAccount,
            writerInfo: writerInfo,
            pagination: {
                page: page,
                pageCount: Math.ceil(count / perPage),
            },
        })
    } catch (error) {
        console.log(error);
    }
};
//list all article
const getListArticle = async (req, res, next) => {
    try {
        const tags = await Tag.find({});
        const categories = await Category.find({});
        const writerAccount = await AppUser.findOne({});
        const writerArticle = await Writer.findOne({ account_id: req.session.userId }).populate("account_id");
        const article = await Articles.find({ author: writerArticle._id }).populate('category_id').populate('tag_id');
        return res.render("writerViews/writer_list_article", {
            tags: tags,
            categories: categories,
            writerAccount: writerAccount,
            article: article,
            writerArticle: writerArticle,
        })
    } catch (error) {
        console.log(error);
    }
};
// update infomation account
const getChangeProfile = async (req, res, next) => {
    const { msg } = req.query;
    const _id = req.params.id;
    try {
        const popularArticles = await Articles.find({ status: "publish" }).sort({ timeCreated: -1 }).limit(5).populate("author");
        const tags = await Tag.find({});
        const categories = await Category.find({});
        const writerAccount = await AppUser.findOne({ _id: req.session.userId });
        const writerInfo = await Writer.findOne({ account_id: writerAccount._id }).populate("account_id");
        return res.render("writerViews/writer_update_profile", {
            popularArticles: popularArticles,
            tags: tags,
            categories: categories,
            writerAccount: writerAccount,
            writerInfo: writerInfo,
            err: msg,
        });
    } catch (error) {
        console.log(error);
    }
}
const ChangeProfile = async (req, res, next) => {
    const { name, email, _id } = req.body;
    const newValue = {};
    if (email) newValue.email = email;
    if (req.file) {
        const image = req.file.filename;
        newValue.avatarImage = image;
    }
    if (name) newValue.name = name;
    const writerInfo = await Writer.findOne({ account_id: req.session.userId });
    try {
        await Writer.findOneAndUpdate(
            { _id: _id },
            { $set: newValue },
            { new: true });
        return res.redirect(`/writers/update_profile/${writerInfo._id}`);
    } catch (error) {
        console.log(error);
    };
}
const ChangePassword = async (req, res, next) => {
    const { pwd, pwd2, _id } = req.body;
    const newValue = {};
    if (pwd) newValue.password = pwd;
    const writerAccount = await AppUser.findOne({ _id: req.session.userId });
    console.log(_id);
    console.log(writerAccount._id);
    try {
        console.log('ndwadaw');
        if (pwd && (pwd.length < 8)) {
            console.log('woafnwaf');
            const errorPassword1 = "Password must be at least 8 characters !!!";
            return res.redirect(`/writers/update_profile/${writerAccount._id}?msg=${errorPassword1}`);
        } else if (pwd2 != pwd) {
            console.log('wdfnwaf');
            const errorPassword2 = "Confirm Password Error!";
            return res.redirect(`/writers/update_profile/${writerAccount._id}?msg=${errorPassword2}`);
        }
        const NewPass = await AppUser.findOneAndUpdate(
            { _id: writerAccount._id },
            { $set: newValue },
            { new: true, useFindAndModify: false });
        await NewPass.save();
        console.log("success")
        return res.redirect(`/writers/update_profile/${writerAccount._id}`);
    } catch (error) {
        console.log(error);
    }
}
// upload article
const getArticle = async (req, res, next) => {
    try {
        const tags = await Tag.find({});
        const category = await Category.find({});
        const writerAccount = await AppUser.findOne({});
        const writerInfo = await Writer.findOne({ account_id: req.session.userId }).populate("account_id");
        return res.render("./writerViews/writer_add_article", {
            tags: tags,
            writerAccount: writerAccount,
            writerInfo: writerInfo,
            category: category,
        });
    } catch (error) {
        console.log(error);
    }
};
const addArticle = async (req, res, next) => {
    const { tag_name, tag_id, desc, content, name, category, articleImage } = req.body;
    try {
        const writer = await Writer.findOne({ account_id: req.session.userId });
        const value = await Articles.findOne({ name: name }).exec();
        const obj = {
            name: name,
            desc: desc,
            articleImage: req.file.filename,
            content: content,
            author: writer._id,
            category_id: category,
        };
        const newArticle = await Articles.create(obj);
        const saveArticle = await newArticle.save();
        if (tag_id && tag_name) {
            const newTags = new Tag({
                name: tag_name
            });
            const addTag = await newTags.save();
            const addMoreTag = await Articles.findOneAndUpdate(
                { _id: saveArticle._id },
                { $push: { tag_id: addTag } },
                { new: true },
            );
            //await saveArticle.tag_id.push(tag_id);
            await Articles.findOneAndUpdate(
                {_id: saveArticle._id},
                {$push: {tag_id: tag_id}},
                {new: true},
            );
            await saveArticle.save();
            //const saveArticle = await newArticle.save();
            await writer.posts.push(saveArticle);
            await writer.save();
        } else if (tag_id && !tag_name) {
            const saveArticle = await newArticle.save();
            const pushTag = await Articles.findOneAndUpdate(
                { _id: saveArticle._id },
                { $push: { tag_id: tag_id } },
                { new: true },
            );
            await pushTag.save();
            await writer.posts.push(pushTag);
            await writer.save();
        } else if (tag_name && !tag_id) {
            const newTag = new Tag({
                name: tag_name
            });
            const saveTag = await newTag.save();
            const pushTag = await Articles.findOneAndUpdate(
                { _id: saveArticle._id },
                { $push: { tag_id: saveTag } },
                { new: true },
            );
            //await newArticle.tag_id.push(newTag);
            //const saveArticle = await newArticle.save();
            await writer.posts.push(pushTag);
            await writer.save();
        } else {
            //const saveArticle = await newArticle.save();
            await writer.posts.push(saveArticle);
            await writer.save();
        }

        return res.redirect(`/writers/list_all_article`);
    } catch (err) {
        console.log(err);
    }
};
// view detail article
const getDetailArticle_writer = async (req, res, next) => {
    const _id = req.params.id;
    const demo = {};
    try {
        const popularArticles = await Articles.find({ status: "publish" }).sort({ timeCreated: -1 }).limit(5).populate("author");
        const view = await Articles.findOneAndUpdate({ _id: _id }, { $inc: { views: 1 } });
        const categories = await Category.find({});
        const tags = await Tag.find({});
        const article = await Articles.findOne({ _id: _id }).populate("author").populate("tag_id");
        console.log(article);
        const writerAccount = await AppUser.findOne({});
        const writerInfo = await Writer.findOne({ account_id: req.session.userId }).populate("account_id");
        const commentInfo = await Comment.find({ article_id: article._id }).populate({ path: 'author', populate: { path: 'account_id' } });
        const favorite = await Favorite.findOne({ article_id: _id, author: writerInfo._id });
        const countComment = await Comment.countDocuments({ article_id: article._id });
        if (favorite) {
            const favoriteExists = await Writer.findOne({
                favorite_id: favorite._id,
            });

            if (favoriteExists) {
                demo["favoriteExists"] = favoriteExists;
            }
        }
        return res.render("./writerViews/writer_detail_blog", {
            popularArticles: popularArticles,
            categories: categories,
            countComment: countComment,
            view: view,
            tags: tags,
            demo,
            favorite: favorite,
            article: article,
            commentInfo: commentInfo,
            writerAccount: writerAccount,
            writerInfo: writerInfo,
        });
    } catch (error) {
        console.log(error);
    }
};
// update article
const deleteTag = async (req, res, next) => {
    const { tag_id, article_id } = req.body;
    try {
        const deleteTag = await Articles.findOneAndUpdate(
            { tag_id: tag_id },
            { $pull: { tag_id: tag_id } },
            { new: true });
        await deleteTag.save();
        return res.redirect(`/writers/update_article/${article_id}`);
    } catch {
        console.log(error);
    }
}
const getUpdateArticle = async (req, res, next) => {
    const _id = req.params.id;
    try {
        const tags = await Tag.find({});
        const category = await Category.find({});
        const articleInfo = await Articles.findOne({ _id: _id }).populate("category_id").populate("tag_id");
        const writerAccount = await AppUser.findOne({});
        const writerInfo = await Writer.findOne({ account_id: req.session.userId }).populate("account_id");
        return res.render("./writerViews/writer_update_article", {
            writerAccount: writerAccount,
            writerInfo: writerInfo,
            articleInfo: articleInfo,
            tags: tags,
            category: category,
        });
    } catch (error) {
        console.log(error);
    }
};
const updateArticle = async (req, res, next) => {
    const { tag_id, tag_name, name, desc, content, articleImage, category_id, _id } = req.body;
    const newValue = {};
    if (name) newValue.name = name;
    if (desc) newValue.desc = desc;
    if (req.file) {
        const image = req.file.filename;
        newValue.articleImage = image;
    }
    if (content) newValue.content = content;
    if (category_id) newValue.category_id = category_id;
    const articleInfo = await Articles.findOne({ _id: _id });
    // const tagInfo = await Tag.findOne({tag_id: tag_id});
    // if(tagInfo){
    //     console.log(tagInfo);
    //     const errorTag = "Tag has already exist !!!";
    //   return res.redirect(`/writers/update_article/${_id}?msg=${errorTag}`);
    // }
    try {
        await Articles.findOneAndUpdate(
            { _id: _id },
            { $set: newValue },
            { new: true });
        const putTag = await Articles.findOneAndUpdate(
            { _id: _id },
            { $push: { tag_id: tag_id } },
            { new: true });
        return res.redirect(`/writers/list_all_article`);
    } catch (error) {
        console.log(error);
    }
};
// delete article
const deleteArticle = async (req, res, next) => {
    const { _id } = req.body;
    try {
        const deleteArticle = await Articles.findOneAndDelete({ _id: _id });
        const updateArticle = await Writer.findOneAndUpdate(
            { posts: deleteArticle._id },
            { $pull: { posts: deleteArticle._id } },
            { new: true });
        await updateArticle.save();
        console.log("Success!!!");
        return res.redirect(`/writers/list_all_article`);
    } catch (error) {
        console.log(error);
    }
};
// do comment 
const doComment = async (req, res, next) => {
    const { comment, _id } = req.body;
    try {
        const info = await Writer.findOne({ account_id: req.session.userId });
        const article = await Articles.findOne({ _id: _id });
        var obj = {
            article_id: _id,
            author: info._id,
            comment: comment,
        };
        const item = await Comment.create(obj);
        await item.save();
        await article.comments.push(item);
        await article.save();
        res.redirect("/writers/writer_blog_detail/" + article._id);
    } catch (error) {
        console.log(error);
    }
};
// delete comment
const deleteComment = async (req, res, next) => {
    const { _id } = req.body;
    try {
        const user = await Writer.findOne({ account_id: req.session.userId });
        const deleteComment = await Comment.findOneAndRemove({
            _id: _id,
        });
        const details = await Articles.findOneAndUpdate(
            { comments: _id },
            { $pull: { comments: _id } },
            { new: true }
        );
        return res.redirect(`/writers/writer_blog_detail/${details._id}`);
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
        const count = await Articles.countDocuments({ name: re });
        const popularArticles = await Articles.find({ status: "publish" }).sort({ timeCreated: -1 }).limit(5).populate("author");
        const tags = await Tag.find({});
        const categories = await Category.find({});
        const writerAccount = await AppUser.findOne({});
        const writerInfo = await Writer.findOne({ account_id: req.session.userId }).populate("account_id");
        const searchArticle = await Articles.find({
            $and: [
                { name: re },
            ],
        }).populate("author").skip(perPage * page - perPage).limit(perPage);
        return res.render("writerViews/writer_home", {
            popularArticles: popularArticles,
            tags: tags,
            categories: categories,
            articles: searchArticle,
            search,
            writerAccount: writerAccount,
            writerInfo: writerInfo,
            pagination: {
                page: page,
                pageCount: Math.ceil(count / perPage),
            },
        });
    } catch (error) {
        console.log(error);
    }
};
// favorite articles
const doFavorite = async (req, res, next) => {
    const _id = req.body;
    try {
        const info = await AppUser.findOne({ _id: req.session.userId });
        const writer_id = await Writer.findOne({ account_id: info._id });
        const article = await Articles.findOne({ _id: _id });
        const favorArticle = new Favorite({
            article_id: article._id,
            author: writer_id._id,
        })
        const favorList = await favorArticle.save();
        const favor = await writer_id.favorite_id.push(favorList);
        await writer_id.save();
        return res.redirect("/writers/list_favorite_article");
    } catch (error) {
        console.log(error);
    }
};
// list all favorite article
const getListFavorArticle = async (req, res, next) => {
    try {
        const categories = await Category.find({});
        const writerAccount = await AppUser.findOne({});
        const writerArticle = await Writer.findOne({ account_id: req.session.userId }).populate("account_id");
        const favorArticle = await Favorite.find({ author: writerArticle._id }).populate({ path: 'article_id', populate: { path: 'category_id' } });
        return res.render("writerViews/writer_list_favorite", {
            writerAccount: writerAccount,
            categories: categories,
            favorArticle: favorArticle,
            writerArticle: writerArticle,
        })
    } catch (error) {
        console.log(error);
    }
};
// delete favorite
const deleteFavorite = async (req, res, next) => {
    const { _id } = req.body;
    try {
        const user = await Writer.findOne({ account_id: req.session.userId });
        const deleteFavor = await Favorite.findOneAndRemove({
            _id: _id,
            author: user._id,
        });
        const details = await Writer.findOneAndUpdate(
            { favorite_id: deleteFavor._id },
            { $pull: { favorite_id: deleteFavor._id } }
        );
        return res.redirect("/writers/list_favorite_article");
    } catch (error) {
        console.log(error);
    }
};
module.exports = {
    getWriterHome,
    ChangeProfile,
    ChangePassword,
    getChangeProfile,
    addArticle,
    getArticle,
    getListArticle,
    getDetailArticle_writer,
    getUpdateArticle,
    getListFavorArticle,
    updateArticle,
    deleteArticle,
    doComment,
    deleteComment,
    doSearch,
    deleteFavorite,
    doFavorite,
    getAritcleByCategory,
    getAritcleByTag,
    deleteTag,
};