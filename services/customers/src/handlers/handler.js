'use strict';

const customerService = require('../service/customerService');
const responses = require('../common/response');

module.exports.getAllCustomers = async event => {
    return await customerService.getAllCustomers();
};

module.exports.getCustomer = async event => {
    if (!event.pathParameters || !event.pathParameters.id) return responses.badRequest();
    return await customerService.getCustomer(event.pathParameters.id);
}

module.exports.deleteCustomer = async event => {
    if (!event.pathParameters || !event.pathParameters.id) return responses.badRequest();
    return await customerService.deleteCustomer(event.pathParameters.id);
}

module.exports.createCustomer = async event => {
    if (!event.body) return responses.badRequest();
    const requestBody = JSON.parse(event.body);
    return await customerService.createCustomer(requestBody);
};

module.exports.updateCustomer = async event => {
    if (!event.pathParameters || !event.pathParameters.id || !event.body) return responses.badRequest();
    const requestBody = JSON.parse(event.body);
    return await customerService.updateCustomer(requestBody, event.pathParameters.id);
}

module.exports.getUploadURL = async event => {
    if(!event.pathParameters || !event.pathParameters.id) return responses.badRequest();
    let key = event.pathParameters.id + ".jpg";
    return customerService.getUploadS3URL(key);
}

module.exports.uploadedCustomerImageToS3 = async event => {
    let fileName = event.Records[0].s3.object.key;
    return await customerService.assignImageToCustomer(fileName);
}

module.exports.getCustomerImageURL = async event => {
    if(!event.pathParameters || !event.pathParameters.id) return responses.badRequest();
    return customerService.getCustomerImageURL(event.pathParameters.id);
}