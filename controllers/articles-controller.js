const { selectTopics } = require("../models/articles-model")
const endpoints = require("../endpoints.json")

function getTopics(req, res, next) {
    selectTopics(req.query)
        .then((topics) => {
            res.status(200).send(topics);
        }).catch((err) => {
            next(err);
        });
};

function getEndpoints(req, res, next) {
    res.status(200).send(endpoints)
};













module.exports = {getTopics, getEndpoints}