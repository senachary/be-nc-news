const express = require("express");
const app = express();
const {getTopics, getArticles, patchArticle} = require("./controllers/articles-controller")
const {customErrorHandler, psqlErrorHandler} = require("./controllers/error-handler")

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticles)



app.patch("/api/articles/:article_id", patchArticle)

app.use(psqlErrorHandler)

app.use(customErrorHandler)

app.use((err, response, request, next) => {
    response.status(500).send({msg: "Server Error"})
})





module.exports = app;