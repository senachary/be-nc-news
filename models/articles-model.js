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

function newComment(article_id, article_body) {
    
    const formattedComment = [
        article_body.body,
        article_id,
        article_body.author,
        0,
        new Date().toISOString()
    ]

    const queryString = format(
        `INSERT INTO comments
        (body, article_id, author, votes, created_at)
        VALUES %L
        RETURNING *;`, [formattedComment]);
    
    return connection.query(queryString)
        .then(({ rows }) => {
        return rows[0]
    })
}










module.exports = {selectTopics, retrieveArticles, newComment}