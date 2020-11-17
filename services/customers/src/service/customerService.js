const uuid = require('uuid');
const Dynamo = require('../common/dynamo');
const responses = require('../common/response');

const inputFormatNotValid = (firstName, lastName) => typeof firstName !== 'string' || typeof lastName !== 'string';

const saveCustomerToDB = customer => Dynamo.write(customer, process.env.CUSTOMERS_TABLE);
const getCustomerFromDB = id => Dynamo.get(id, process.env.CUSTOMERS_TABLE)
const getAllCustomersFromDB = () => Dynamo.getAll(process.env.CUSTOMERS_TABLE);
const deleteCustomerFromDB = id => Dynamo.delete(id, process.env.CUSTOMERS_TABLE);
const updateCustomerToDB = (body, id) => Dynamo.update(body, id, process.env.CUSTOMERS_TABLE);

const buildCustomerInfo = (firstName, lastName) => {
    const timestamp = new Date().getTime();
    return {
        id: uuid.v4(),
        firstName: firstName,
        lastName: lastName,
        createdAt: timestamp,
        updatedAt: timestamp,
    }
}

module.exports.updateCustomer = async (body, id) => {
    try{
        let data = await updateCustomerToDB(body, id);
        return responses.success({body: data});
    }catch(error){
        return responses.failure({error: error});
    }
}

module.exports.deleteCustomer = async id => {
    await deleteCustomerFromDB(id);
    return responses.deleted();
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
    else return responses.success({body: data.Item})
};

module.exports.createCustomer = async customerData => {
    let firstName = customerData.firstName;
    let lastName = customerData.lastName;
    if (inputFormatNotValid(firstName, lastName)) return responses.badRequest();
    try{
        let data = await saveCustomerToDB(buildCustomerInfo(firstName, lastName));
        return responses.created({body: data});
    }catch (error){
        return responses.failure({error: error});
    }
};