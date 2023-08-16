const { request } = require("../app");
const comments = require("../db/data/test-data/comments");
const { selectTopics, retrieveArticles, newComment } = require("../models/articles-model")

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


function postComment(req, res, next) {
    const { article_id } = req.params;
    const { body } = req;
    
    const promises = [
        retrieveArticles(article_id),
        newComment(article_id, body)
    ];

    return Promise.all(promises)
        .then((promisesData) => {
            res.status(201).send({ post: promisesData[1] });
            
        }).catch((err) => {
            next(err);
        });
};








module.exports = {getTopics, getArticles, postComment}