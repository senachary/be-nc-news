const connection = require("../db/connection");
const format = require("pg-format");

function selectComments(article_id) {

    const article_idInt = parseInt(article_id)

    return connection.query(`SELECT * from comments
                            WHERE article_id =$1
                            ORDER BY created_at DESC;`, [article_idInt])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return []
            }
            return rows
        }).catch((error) => {
            return Promise.reject(error)
        })
}












module.exports = {selectComments}