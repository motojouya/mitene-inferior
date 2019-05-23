const AWS = require('aws-sdk');
const uuid = require('uuid/v4');

AWS.config.update({region: 'ap-northeast-1'});

exports.handler = (event, context, callback) => {

  console.log(event);

  const claims = event.requestContext.authorizer.claims;
  console.log(claims);
  const albumOwn = claims['custom:album_own'];
  const cognitoUsername = claims['cognito:username'];
  const cognitoName = claims.name;
  const requestBody = JSON.parse(event.body);
  const albumName = requestBody.albumName;
  const relative = requestBody.relative

  console.log('got parameters.');

  if (!cognitoUsername) {
    callback({errorMessage: 'You need sign in.'});
    return;
  }

  if (albumOwn && albumOwn.length > 1) {
    callback(null, {warning: 'You have already your own album.'});
    return;
  }

  if (!albumName) {
    callback({errorMessage: 'You need album name.'});
    return;
  }

  const cognito = new AWS.CognitoIdentityServiceProvider();
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  const albumId = uuid();

  const cognitoParam = {
    UserAttributes: [
      {
        Name: 'custom:album_own',
        Value: albumId,
      },
    ],
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Username: cognitoUsername,
  };

  const dynamodbParam = {
    RequestItems: {
      "mitene-inferior2": [
        {
          PutRequest: {
            Item: {
              album_id: albumId,
              album_property: 'basic',
              album_name: albumName,
            }
          }
        },
        {
          PutRequest: {
            Item: {
              album_id: albumId,
              album_property: `user#${cognitoUsername}`,
              user_name: cognitoName,
              relative: relative,
              owner: true,
            }
          }
        },
      ]
    },
    ReturnConsumedCapacity: "TOTAL"
  }

  cognito.adminUpdateUserAttributes(cognitoParam, (err, res) => {
    if (err) {
      callback(err);
      return;
    }
    dynamodb.batchWrite(dynamodbParam, (err, res) => {
      if (err) {
        callback(err);
        return;
      }
      callback(null, {status: 'success'});
    });
  });

};

