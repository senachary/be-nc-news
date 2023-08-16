const { selectTopics, retrieveArticles, updateArticle } = require("../models/articles-model")

function getTopics(req, res, next) {
    selectTopics(req.query)
        .then((topics) => {
            res.status(200).send(topics);
        }).catch((err) => {
            next(err);
        });
};

function getArticles(req, res, next) {
    retrieveArticles(req.params.article_id)
        .then((article) => {
            res.status(200).send({article});
        }).catch((err) => {
            next(err);
        });
};







function patchArticle(req, res, next) {
    const { article_id } = req.params
    const { body } = req
    
    updateArticle(article_id, body)
        .then((updatedData) => {
        res.status(200).send({updatedArticle: updatedData})
    }).catch((err) => {
        next(err);
    });
}





module.exports = {getTopics, getArticles, patchArticle}