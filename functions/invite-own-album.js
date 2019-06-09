const AWS = require('aws-sdk');

AWS.config.update({region: 'ap-northeast-1'});

const responseError = (callback, messages, statusCode) => {
  statusCode = statusCode || 500;
  callback({
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(messages),
    isBase64Encoded: false
  });
};

const assignUser = (cognito, userPoolId) => email => {
  return new Promise((resolve, reject) => {
    const searchParam = {
      AttributesToGet: [ 'cognito:username' ],
      filter: `emal = "${email}"`,
      UserPoolId: userPoolId,
    };

    cognito.listUsers(searchParam, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      if (data.Users.length === 0) {
        const createParam = {
          UserAttributes: [
            {
              email: email,
            },
          ],
          UserPoolId: userPoolId,
          Username: email,
          MessageAction: 'RESEND',
          TemporaryPassword: Math.random().toString(36).slice(-10),
        };
        cognito.adminCreateUser(createParam, (res, data) => {
          if (err) {
            reject(err);
            return;
          }
          const cognitoUsername = data.User.Attributes.find(attribute => attribute.Name === 'cognito:username').Value;
          const cognitoName = data.User.Attributes.find(attribute => attribute.Name === 'name').Value;
          resolve({ cognitoUsername, cognitoName });
        });

      } else if (data.Users.length === 1) {
        const cognitoUsername = data.Users[0].Attributes.find(attribute => attribute.Name === 'cognito:username').Value;
        const cognitoName = data.Users[0].Attributes.find(attribute => attribute.Name === 'name').Value;
        resolve({ cognitoUsername, cognitoName });

      } else {
        reject({ message: 'You met strange data that have multi candidates.' });
      }
    });
  });
};

const createRecord = dynamoDB => (albumId, cognitoUsername, cognitoName, relative) => {

  const dynamodbParam = {
    RequestItems: {
      "mitene-inferior2": [
        {
          PutRequest: {
            Item: {
              album_id: albumId,
              album_property: `user#${cognitoUsername}`,
              user_name: cognitoName,
              relative: relative,
              owner: false,
              status: 'pending',
            }
          }
        },
      ]
    },
    ReturnConsumedCapacity: "TOTAL"
  };

  return new Promise((resolve, reject) => {
    dynamoDB.batchWrite(dynamodbParam, (err, res) => {
      if (err) {
        reject(err)
        return;
      }
      resolve({ message: 'success!' });
    });
  });
}

exports.handler = (event, context, callback) => {

  const cognito = new AWS.CognitoIdentityServiceProvider();
  const dynamoDB = new AWS.DynamoDB.DocumentClient();
  const userPoolId = process.env.COGNITO_USER_POOL_ID;

  const claims = event.requestContext.authorizer.claims;
  const albumOwn = claims['custom:album_own'];
  const cognitoUsername = claims['cognito:username'];
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

  const createRecordDynamoDB = createRecord(dynamoDB);
  const assignUserCognito = assignUser(cognito, userPoolId);

  assignUserCognito(email)
    .then(({ cognitoUsername, cognitoName }) => {
      return createRecordDynamoDB(albumId, cognitoUsername, cognitoName, relative)
    })
    .then(data => {
      callback(null, {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ message: 'success!' }),
        isBase64Encoded: false
      });
    })
    .catch(err => {
      responseError(callback, err);
    });
};

