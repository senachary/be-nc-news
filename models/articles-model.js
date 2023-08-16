const connection = require("../db/connection");
const format = require("pg-format");

function selectTopics() {
    return connection.query(`SELECT * from topics;`)
        .then(({ rows }) => {
        return rows
    })
}

function retrieveArticles(article_id) {
    return connection.query("SELECT * FROM articles WHERE article_id = $1", [article_id])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({status: 404, message: "article does not exist"})
            }
            return rows[0];
    })
}

function removeComment(comment_id) {
    return connection.query(`DELETE FROM comments
                            WHERE comment_id = $1
                            RETURNING *;`, [comment_id])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({status: 404, message: "comment does not exist"})
            } else {
                return Promise.resolve()
            }
    })
}










module.exports = {selectTopics, retrieveArticles, removeComment}