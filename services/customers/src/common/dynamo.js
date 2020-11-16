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
    async get(id, TableName) {
        const params = {
            TableName,
            Key: {
                id,
            },
        };
        return await documentClient.get(params).promise();
    },

    async getAll(TableName) {
        const params = {
            TableName
        }
        return await documentClient.scan(params).promise();
    },

    async write(data, TableName) {
        if (!data.id) throw Error('No ID on the data');
        const params = {
            TableName,
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
};

module.exports = Dynamo;