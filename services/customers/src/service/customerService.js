const uuid = require('uuid');
const Dynamo = require('../common/dynamo');
const S3 = require("../common/s3");
const responses = require('../common/response');

const inputFormatNotValid = (firstName, lastName) => typeof firstName !== 'string' || typeof lastName !== 'string';

const saveCustomerToDB = customer => Dynamo.write(customer, process.env.CUSTOMERS_TABLE);
const getCustomerFromDB = id => Dynamo.get(id, process.env.CUSTOMERS_TABLE)
const getAllCustomersFromDB = () => Dynamo.getAll(process.env.CUSTOMERS_TABLE);
const deleteCustomerFromDB = id => Dynamo.delete(id, process.env.CUSTOMERS_TABLE);
const updateCustomerToDB = (body, id) => Dynamo.update(body, id, process.env.CUSTOMERS_TABLE);

const buildCustomerInfo = (firstName, lastName, cognitoUser) => {
    const timestamp = new Date().getTime();
    return {
        id: uuid.v4(),
        firstName: firstName,
        lastName: lastName,
        imageKey: process.env.DEFAULT_IMAGE_PATH,
        createdBy: cognitoUser,
        updatedBy: cognitoUser,
        createdAt: timestamp,
        updatedAt: timestamp,
    }
}

const updateCustomer = async (body, id, cognitoUser) => {
    try{
        body.updatedBy = cognitoUser;
        let data = await updateCustomerToDB(body, id);
        return responses.success({body: data});
    }catch(error){
        return responses.failure({error: error});
    }
}

const getCustomerImageURL = async imageKey => {
    let preSignedURL = S3.getPreSignedItemURL(imageKey, process.env.CUSTOMERS_IMAGES_BUCKET);
    if(preSignedURL){
        return responses.success({body: {
                "uploadURL": preSignedURL}});
    }else responses.failure({error: "Could not get a preSigned URL"})
}

module.exports.updateCustomer = updateCustomer;
module.exports.getCustomerImageURL = getCustomerImageURL;

module.exports.deleteCustomer = async id => {
    await deleteCustomerFromDB(id);
    return responses.noContent();
}

module.exports.getAllCustomers = async () => {
    let data = await getAllCustomersFromDB();
    if(!data || !data.Items) return responses.failure({error: "Internal server error"});
    return responses.success({body: data.Items})
};

module.exports.getCustomer = async id => {
    let data = await getCustomerFromDB(id);
    if(!data) return responses.failure({error: "Internal server error"});
    if(!data.Item) return responses.notFound();
    if(data.Item.imageKey) data.Item.imageURL = await S3.getPreSignedItemURL(data.Item.imageKey, process.env.CUSTOMERS_IMAGES_BUCKET);
    return responses.success({body: data.Item})
};

module.exports.createCustomer = async (customerData, cognitoUser) => {
    let firstName = customerData.firstName;
    let lastName = customerData.lastName;
    if (inputFormatNotValid(firstName, lastName)) return responses.badRequest();
    try{
        let data = await saveCustomerToDB(buildCustomerInfo(firstName, lastName, cognitoUser));
        return responses.created({body: data});
    }catch (error){
        return responses.failure({error: error});
    }
};

module.exports.getUploadS3URL = async key => {
    let preSignedURL = S3.getUploadURL(key, process.env.CUSTOMERS_IMAGES_BUCKET, 'image/jpeg')
    if(preSignedURL){
        return responses.success({body: {
                "uploadURL": preSignedURL,
                "photoFilename": key
        }});
    }else responses.failure({error: "Could not get a preSigned URL"})
}

module.exports.assignImageToCustomer = async fileName => {
    let userId = fileName.substring(0, fileName.indexOf("."));
    let dataToUpdate = {imageKey: fileName}
    return updateCustomer(dataToUpdate, userId)
}