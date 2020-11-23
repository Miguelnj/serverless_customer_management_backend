'use strict'
const AWS = require('aws-sdk');
const responses = require('../common/response');
const cognitoIdentityProvider = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'});

function buildParams(body) {
    return {
        ClientId: process.env.COGNITO_CLIENT_ID,
        Password: body.password,
        Username: body.email,
    };
}

function signUpCognitoUser(params) {
    return cognitoIdentityProvider.signUp(params).promise();
}

module.exports.signUpCognitoUser = async event => {
    if (!event.body) return responses.badRequest();
    let body = JSON.parse(event.body);
    if (!body.email || !body.password) return responses.badRequest();
    let params = buildParams(body);
    let response = await signUpCognitoUser(params);
    return responses.success({body: response})
};

module.exports.preSignUp = (event, context, callback) => {
    event.response.autoConfirmUser = true;
    event.response.autoVerifyEmail = true;
    context.done(null, event);
}