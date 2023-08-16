const { selectTopics, retrieveArticles, removeComment } = require("../models/articles-model")

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










module.exports = {getTopics, getArticles, deleteComment}