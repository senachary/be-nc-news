const { selectComments } = require("../models/comments-model")

function getComments(req, res, next) {
    const article_id = req.params.article_id;

    selectComments(article_id)
        .then((comments) => {
            if (comments.length === 0) {
                res.status(404).send({msg: "Not Found"})
            } else {
                res.status(200).send({comments});
        }
    })
        .catch((err) => {
            next(err);
    });
}


module.exports = {getComments}