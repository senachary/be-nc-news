const connection = require("../db/connection");
const format = require("pg-format");

function selectComments(article_id) {
    return connection.query(`SELECT * from comments
                            WHERE article_id =$1
                            ORDER BY created_at DESC;`, [article_id])
        .then(({ rows }) => {
        return rows
    })
}












module.exports = {selectComments}