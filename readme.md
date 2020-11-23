## **Serverless Customer management Backend**

This is a little project developed as a first contact with Serverless Framework that consists of customers which need CRUD functions to be managed.

### Deployment
Navigate to the service to be deployed and type:

> serverless deploy

This command will deploy the described project in serverless.yml file.

### Implemented requests

Actually, there is implemented the customer CRUD and basic Cognito authentication.

The description of the requests is:

- (GET) Get All Customers: 
> https://domain/{stage}/customers
- (GET) Get a specific customer: 
> https://domain/{stage}/customers/{id}
- (POST) Create a customer - BODY: firstName, lastName
> https://domain/{stage}/customers
- (DELETE) Delete a customer 
> https://domain/{stage}/customers/{id}
- (PUT) Update customer - BODY: The customer attributes to be updated
> https://domain/{stage}/customers/{id}
- (GET) Get URL to upload a customer image to it 
> https://domain/{stage}/images/upload/{imageKey}
- (GET) Get URL of the image of a customer 
> https://domain/{stage}/images/retrieve/{imageKey}
- (POST) Create a user and publish it to cognito - BODY: email, password
> https://domain/{stage}/users/register