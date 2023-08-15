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










module.exports = {selectTopics, selectAllArticles}