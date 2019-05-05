const AWS = require('aws-sdk');
const sjcl = require('sjcl');
const uuid = require('uuid');

AWS.config.update({region: 'ap-northeast-1'});

exports.handler = (event, context, callback) => {

  console.log(event);

  const claims = event.requestContext.authorizer.claims;
  const albumOwn = claims['custom:album-own'];
  const cognitoUsername = claims.username;
  const cognitoName = claims.name;
  const albumName = event.albumName;
  const relative = event.relative

  if (!cognitoUsername) {
    callback({errorMessage: 'You need sign in.'});
    return;
  }

  if (albumOwn) {
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
        Name: 'custom:album-own',
        Value: albumId,
      },
    ],
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Username: cognitoUsername,
  };

  const dynamodbParam = {
    RequestItems: {
      "mitene-inferior": [
        {
          PutRequest: {
            Item: {
              album_id: albumId,
              album_property: 'basic'
              album_name: albumName,
            }
          }
        },
        {
          PutRequest: {
            Item: {
              album_id: albumId,
              album_property: `user#${cognitoUsername}`
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

  cognito.adminUpdateUserAttributes(params, (err, res) => {
    if (err) {
      callback(err);
      return;
    }
    dynamodb.batchWriteItem(dynamodbParam, (err, res) => {
      if (err) {
        callback(err);
        return;
      }
      callback(null, {status: 'success'});
    });
  });

};



