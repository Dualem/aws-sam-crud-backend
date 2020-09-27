const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const ddb = new AWS.DynamoDB.DocumentClient();
const tableName = "Vehicles"

exports.handler = async (event) => {
    // TODO implement
    let data;
    try{
        switch (event.httpMethod) {
           
            case 'GET':
                data = await readData();
                return {statusCode:200, body:JSON.stringify(data)};
            case 'POST':
                data = await createData(event);
                return {statusCode:200, body:JSON.stringify(data)};
            default:
                return{statusCode:404, body:`Unsupported method "${event.httpMethod}"`};
        }
    }
    catch(err){
        console.log("error has accured: " + err);
    }
    
};
const readData = async() =>{
    let params = {
        TableName: tableName
    }
    return ddb.scan(params).promise();
}

const createData = async (event) =>{
    
    let item = JSON.parse(event.body)
    item.id = uuidv4();
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
        return params.Item
    });
}
