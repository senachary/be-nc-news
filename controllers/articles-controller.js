const { selectTopics } = require("../models/articles-model")

function getTopics(req, res, next) {
    selectTopics(req.query)
        .then((topics) => {
            res.status(200).send(topics);
        }).catch((err) => {
            next(err);
        });
};













module.exports = {getTopics}