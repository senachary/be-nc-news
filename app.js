const express = require("express");
const app = express();
const {getTopics, getEndpoints} = require("./controllers/articles-controller")


app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);















app.use((err, response, request, next) => {
    console.log(err)
    response.status(500).send({msg: "Server Error"})
})





module.exports = app;