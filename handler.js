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

const createQuiz = async (username, data) => {
  await dynamoDb
    .put({
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        username,
        data
      }
    })
    .promise();
};

module.exports.fetch = async event => {
  console.log(JSON.stringify(event, null, 2));
  const data = await getQuizzes();
  console.log(JSON.stringify(data, null, 2));
  return {
    statusCode: 200,
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
