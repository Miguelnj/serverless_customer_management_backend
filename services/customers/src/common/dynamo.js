const AWS = require('aws-sdk');

let options = {};
if (process.env.IS_OFFLINE) {
    options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
    };
}

const documentClient = new AWS.DynamoDB.DocumentClient(options);

const Dynamo = {
    async get(id, tableName) {
        const params = {
            TableName: tableName,
            Key: {
                id,
            },
        };
        return await documentClient.get(params).promise();
    },

    async getAll(tableName) {
        const params = {
            TableName: tableName
        }
        return await documentClient.scan(params).promise();
    },

    async write(data, tableName) {
        if (!data.id) throw Error('No ID on the data');
        const params = {
            TableName: tableName,
            Item: data,
        };

        const res = await documentClient.put(params).promise();
        if (!res) throw Error('There was an error inserting the element');

        return data;
    },

    async delete(id, TableName){
        const params = {
            TableName,
            Key: {
                id,
            },
        };
        return await documentClient.delete(params).promise();
    },

    async update(data, tableName) {
        if(!data.id) throw Error('No ID on the data');
        let params = buildParamsForPutRequest(data, data.id, tableName);
        const res = await documentClient.update(params).promise();
        if(!res) throw Error('There was an error updating the element');

        return data;
    }
};

function insertUpdateExpressionForUpdatedAt(updateExpression, expressionAttributeValues, expressionAttributeNames) {
    updateExpression += "#updatedAt = :updatedAt ,"
    expressionAttributeValues[":updatedAt"] = new Date().getTime();
    expressionAttributeNames["#updatedAt"] = "updatedAt"
    return updateExpression;
}

function buildParamsForPutRequest(body, identifier, tableName) {
    let updateExpression = "set ";
    let expressionAttributeValues = {};
    let expressionAttributeNames = {};
    for (let attribute in body) {
        if (body.hasOwnProperty(attribute)) {
            if (attribute === "id") continue;
            updateExpression += "#" + attribute + " = :" + attribute + " ,";
            expressionAttributeValues[":" + attribute] = body[attribute];
            expressionAttributeNames["#" + attribute] = attribute;
        }
    }
    updateExpression = insertUpdateExpressionForUpdatedAt(updateExpression, expressionAttributeValues, expressionAttributeNames);
    updateExpression = updateExpression.substring(0, updateExpression.length - 2);

    return {
        TableName: tableName,
        Key: {
            "id": identifier
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ExpressionAttributeNames: expressionAttributeNames,
        ReturnValues: "ALL_NEW"
    };
}

module.exports = Dynamo;