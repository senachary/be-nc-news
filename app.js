const express = require("express");
const app = express();

const {getTopics, getArticles, getEndpoints} = require("./controllers/articles-controller")
const {customErrorHandler, psqlErrorHandler} = require("./controllers/error-handler")


app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticles)





app.use(psqlErrorHandler)

app.use(customErrorHandler)



app.use((err, response, request, next) => {
    response.status(500).send({msg: "Server Error"})
})





module.exports = app;