let response = {};

response.success = ({ body }) => {
    return {
        body: JSON.stringify(body),
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    }
};

response.created = ({ body }) => {
    return {
        body: JSON.stringify(body),
        statusCode: 201,
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    }
};

response.deleted = () => {
    return {
        statusCode: 204,
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    }
}

response.notFound = () => {
    return {
        body: JSON.stringify("Resource not found"),
        statusCode: 404,
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    }
}

response.badRequest = () => {
    return{
        body: JSON.stringify("Bad Request"),
        statusCode: 400,
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    }
}

response.failure = ({ error }) => {
    return {
        body: JSON.stringify(error),
        statusCode: 500,
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    }
};

module.exports = response;