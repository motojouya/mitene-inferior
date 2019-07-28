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

exports.handler = (event, context, callback) => {

  const claims = event.requestContext.authorizer.claims;
  const albumOwn = claims['custom:album_own'];
  const cognitoUsername = claims['cognito:username'];
  const cognitoName = claims.name;
  const requestBody = JSON.parse(event.body);
  const albumName = requestBody.albumName;
  const relative = requestBody.relative;

  if (!cognitoUsername) {
    responseError(callback, {error: 'You need sign in.'}, 400);
    return;
  }

  if (albumOwn && albumOwn.length > 1) {
    responseError(callback, {warning: 'You have already your own album.'}, 400);
    return;
  }

  if (!albumName) {
    responseError(callback, {error: 'You need album name.'}, 400);
    return;
  }

  const albumId = uuid();

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


  const dynamoDB = new AWS.DynamoDB.DocumentClient();
  //TODO ここでアクセス可能なalbum一覧を取得
  // ここGSI使わないといかんかなー
  dynamoDB.getItem(dynamodbParam, (err, res) => {
    if (err) {
      responseError(callback, err);
      return;
    }
    res.
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

