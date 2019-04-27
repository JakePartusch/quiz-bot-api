const DynamoDB = require("aws-sdk/clients/dynamodb");

const dynamoDb = new DynamoDB.DocumentClient();

const getQuizzes = async () => {
  const result = await dynamoDb
    .scan({
      TableName: process.env.DYNAMODB_TABLE
    })
    .promise();

  return result.Items;
};

const createQuiz = async (username, answers) => {
  const result = await dynamoDb
    .get({
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        username
      }
    })
    .promise();
  console.log(JSON.stringify(result.Item, null, 2));
  if (result && result.Item) {
    await dynamoDb
      .put({
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
          ...result.Item,
          answers,
          completionTime: new Date().toISOString()
        }
      })
      .promise();
  } else {
    await dynamoDb
      .put({
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
          username,
          answers,
          startTime: new Date().toISOString()
        }
      })
      .promise();
  }
};

module.exports.fetch = async event => {
  console.log(JSON.stringify(event, null, 2));
  const data = await getQuizzes();
  console.log(JSON.stringify(data, null, 2));
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify(data)
  };
};

module.exports.create = async event => {
  console.log(JSON.stringify(event, null, 2));
  const { body } = event;
  const { id } = event.pathParameters;
  const data = JSON.parse(body);
  await createQuiz(id, data);
  return {
    statusCode: 201
  };
};
