function customErrorHandler(error, request, response, next) {
    if (error.status && error.message) {
        response.status(error.status).send({msg: error.message})
    } else {
        next(error);
    };
};

function psqlErrorHandler(error, request, response, next) {
    if (error.code === "22P02") {
        response.status(400).send({msg: "Bad Request"})

    } else if (error.code === "23503"){
        response.status(404).send({msg: "Not Found"})

    } else {
        next(error);
    };
};

module.exports = {customErrorHandler, psqlErrorHandler}