const AWS = require('aws-sdk');
const uuid = require('uuid/v4');

AWS.config.update({region: 'ap-northeast-1'});

const responseError = (callback, messages, statusCode) => {
  statusCode = statusCode || 500;
  callback({
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(message),
    isBase64Encoded: false
  });
};

const assignUser = (cognito, userPoolId) => email => {
  return new Promise((resolve, reject) => {
    const searchParam = {
      UserAttributes: [
        {
          email: email,
        },
      ],
      UserPoolId: userPoolId,
    };

    cognito.listUser(searchParam, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      if (data.length === 0) {
        const createParam = {
          UserAttributes: [
            {
              email: email,
            },
          ],
          UserPoolId: userPoolId,
          username: email
          password: Math.random().toString(36).slice(-10);,
        };
        cognito.createUser(createParam, (res, data) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(data['cognito:username']);
        });

      } else if (data.length === 1) {
        resolve(data[0]['cognito:username']);

      } else {
        reject({ message: 'You met strange data that have multi candidates.' });
      }
    });
  });
};

exports.handler = (event, context, callback) => {

  const userPoolId = process.env.COGNITO_USER_POOL_ID;

  const claims = event.requestContext.authorizer.claims;
  const albumOwn = claims['custom:album_own'];
  const cognitoUsername = claims['cognito:username'];
  const cognitoName = claims.name;
  const requestBody = JSON.parse(event.body);
  const albumId = requestBody.albumId;
  const relative = requestBody.relative;
  const email = requestBody.email;

  if (!cognitoUsername) {
    responseError(callback, {error: 'You need sign in.'}, 400);
    return;
  }

  if (!albumOwn || albumOwn.length === 0) {
    responseError(callback, {error: 'You should have your own album.'}, 400);
    return;
  }

  if (albumId !== albumOwn) {
    responseError(callback, {error: 'You can only invite user to your own album.'}, 400);
    return;
  }

  if (!albumName) {
    responseError(callback, {error: 'You need album name.'}, 400);
    return;
  }

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
              status: 'pending',
            }
          }
        },
      ]
    },
    ReturnConsumedCapacity: "TOTAL"
  };

  new AWS.DynamoDB.DocumentClient().batchWrite(dynamodbParam, (err, res) => {
    if (err) {
      responseError(callback, err);
      return;
    }
    callback(null, {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ message: 'success!' }),
      isBase64Encoded: false
    });
  });

};

