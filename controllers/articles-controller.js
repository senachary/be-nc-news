const { selectTopics, selectAllArticles } = require("../models/articles-model")

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












module.exports = {getTopics, getAllArticles}