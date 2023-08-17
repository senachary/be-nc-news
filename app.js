const express = require("express");
const app = express();
const {getTopics} = require("./controllers/articles-controller")
const { getComments } = require("./controllers/comments-controller")
const {customErrorHandler, psqlErrorHandler} = require("./controllers/error-handler")

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id/comments", getComments)







app.use(customErrorHandler)

app.use(psqlErrorHandler)

app.use((err, response, request, next) => {
    response.status(500).send({msg: "Server Error"})
})









module.exports = app;