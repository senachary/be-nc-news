const { selectTopics, retrieveArticles } = require("../models/articles-model")

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













module.exports = {getTopics, getArticles}