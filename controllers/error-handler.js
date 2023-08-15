function customErrorHandler(error, request, response, next) {
    if (error.status && error.message) {
        response.status(error.status).send({msg: error.message})
    } else {
        next(err);
    };
};

function psqlErrorHandler(error, request, response, next) {
    if (error.code === "22P02") {
        response.status(400).send({msg: "Bad Request"})
    } else {
        next(error);
    };
};

module.exports = {customErrorHandler, psqlErrorHandler}