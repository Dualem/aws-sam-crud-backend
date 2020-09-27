const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient();
const tableName = "VehicleOrders";

exports.handler = async (event) => {
    // TODO implement
    let data;
    try{
        switch (event.httpMethod) {
           
            case 'GET':
                data = await readData();
                return {statusCode:200, body:JSON.stringify(data)};
            case 'POST':
                data = await createData();

                console.log(data);
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

const createData = async () =>{
    
    let params = {
        TableName: tableName,
        Item:{
            id: 312123,
            TimeStamp: 112123,
            Manufacture: "seat",
            Mode: "ibiza",
            Price: 1000
        }
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
