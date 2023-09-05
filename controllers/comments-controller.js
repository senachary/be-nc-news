const { selectComments } = require("../models/comments-model")

function getComments(req, res, next) {
    const article_id = req.params.article_id;

    selectComments(article_id)
        .then((comments) => {
            if (comments.length === 0) {
                 res.status(404).send({msg: "Not Found"})
            } else {
                res.status(200).send({comments: comments});
        }
    })
        .catch((err) => {
            if (err.code === "22P02") {
                res.status(400).send({msg: "Bad Request"});
            } else {
                next(err)
            }
    });
}


module.exports = {getComments}