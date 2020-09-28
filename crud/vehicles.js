const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// connection with dynamodb
const ddb = new AWS.DynamoDB.DocumentClient();
const tableName = "Vehicles"

exports.handler = async (event) => {
    // TODO implement
    let data;
    try{
        switch (event.httpMethod) {
           
            case 'GET':
                data = await readData(event);
                return {statusCode:200, body:JSON.stringify(data)};
            case 'POST':
                data = await createData(event);
                return {statusCode:200, body:JSON.stringify(data)};
            case 'PUT':
                data = await updateData(event);
                return {statusCode:200, body:JSON.stringify(data)};
            case 'DELETE':
                data = await deleteData(event);
                return {statusCode:200, body:JSON.stringify(data)};
            default:
                return{statusCode:404, body:`Unsupported method "${event.httpMethod}"`};
        }
    }
    catch(err){
        console.log("error has accured: " + err);
    }
    
};
// Get order with uuid provided in url
const readData = async(event) =>{
    let vehicleId = event.pathParameters.id;

    let params = {
        TableName: tableName,
        Key:{
            id:vehicleId
        }
    }
    return ddb.get(params).promise().then(result=>{
        return result.Item;
    });
}
// Post data, returns uuid
const createData = async (event) =>{
    
    let item = JSON.parse(event.body)
    item.id = uuidv4();
    //add 3 day ttl to db
    let params = {
        TableName: tableName,
        Item: item
    }
    return ddb.put(params,(err, data) => {
        if (err) {
            console.error("Unable to add item", params.Item.Id);
            console.error("Error JSON:", JSON.stringify(err));
        }
        else {
            console.log("Vehicle added to talbe: ", params.Item);
            
        }   
    }).promise().then(() =>{
        return params.Item.id
    });
}
//Update data using uuid
const updateData = async (event)=>{
    let vehicleId = event.pathParameters.id;
    let body = JSON.parse(event.body);
    let manufacture = body.Manufacture;
    let model = body.Model;
    let price = body.Price;

    let params = {
        TableName:tableName,
        Key:{
            id:vehicleId
        },
        UpdateExpression: "set Manufacture = :r, Model=:p, Price=:a",
        ExpressionAttributeValues:{
            ":r":manufacture,
            ":p":model,
            ":a":price
        },
        ReturnValues:"UPDATED_NEW"
    };

    return ddb.update(params, function(err, data) {
        if (err) {
            console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Update item succeeded:", JSON.stringify(data, null, 2));
        }
    }).promise();

}

//Delete data function
const deleteData = async (event) =>{
    let vehicleId = event.pathParameters.id;
}