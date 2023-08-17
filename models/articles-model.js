const connection = require("../db/connection");
const format = require("pg-format");

function selectTopics() {
    return connection.query(`SELECT * from topics;`)
        .then(({ rows }) => {
        return rows
    })
}


function selectAllArticles() {
    return connection.query(`SELECT 
                            articles.author,
                            articles.title,
                            articles.article_id,
                            articles.topic,
                            articles.created_at,
                            articles.votes,
                            articles.article_img_url,
                            CAST(COUNT(comments.article_id) AS INT) AS comment_count
                            from articles
                            LEFT OUTER JOIN comments ON articles.article_id = comments.article_id
                            GROUP BY articles.article_id
                            ORDER BY created_at DESC;`)
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


function updateArticle(article_id, article_body) {
    return connection.query(`
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;`, [article_body.inc_votes, article_id])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({status: 404, message: "article does not exist"})
            }
        return rows[0]
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












module.exports = {selectTopics, retrieveArticles, selectAllArticles, removeComment, updateArticle}

