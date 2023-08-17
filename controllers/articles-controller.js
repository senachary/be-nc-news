

const endpoints = require("../endpoints.json")
const { selectTopics, retrieveArticles, selectAllArticles, removeComment, updateArticle } = require("../models/articles-model")


function getTopics(req, res, next) {
    selectTopics(req.query)
        .then((topics) => {
            res.status(200).send(topics);
        }).catch((err) => {
            next(err);
        });
};

function getAllArticles(req, res, next) {
    selectAllArticles()
        .then((articles) => {
            res.status(200).send({articles});
        }).catch((err) => {
            next(err);
        });
};

function getEndpoints(req, res, next) {
    res.status(200).send(endpoints)

function getArticles(req, res, next) {
    retrieveArticles(req.params.article_id)
        .then((article) => {
            res.status(200).send({article});
        }).catch((err) => {
            next(err);
        });

};


function deleteComment(req, res, next) {
    const { comment_id } = req.params;
    removeComment(comment_id)
    .then(() => {
        res.status(204).send()
    })
    .catch((err) => {
        next(err);
    });
}







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






module.exports = {getTopics, getArticles, getEndpoints, getAllArticles, deleteComment, patchArticle}

