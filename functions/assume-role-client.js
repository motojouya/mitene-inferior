const AWS = require('aws-sdk');
const uuid = require('uuid/v4');

AWS.config.update({region: 'ap-northeast-1'});

const ALBUM_USER_ATTRIBUTES_PREFIX = 'custom:album';
const ALBUM_OWN_USER_ATTRIBUTES = `${ALBUM_USER_ATTRIBUTES_PREFIX}_own`;
const ALBUM_USER_ATTRIBUTES = Array(10).fill().map((_, i) => `${ALBUM_USER_ATTRIBUTES_PREFIX}${i}`);

const getEmptyAlbumIdPlaceholder = (isOwner, userAttributes) => {

  if (isOwner) {
    const hasAlbumOwnIdAttributes = userAttributes
      .map(attribute => attribute.Name)
      .includes(ALBUM_OWN_USER_ATTRIBUTES);
    return !hasAlbumOwnIdAttributes ? ALBUM_OWN_USER_ATTRIBUTES : null;

  } else {
    const albumIdAttributes = userAttributes
      .filter(attribute => attribute.Name.startsWith(ALBUM_USER_ATTRIBUTES_PREFIX))
      .map(attribute => attribute.Name);
    return ALBUM_USER_ATTRIBUTES.find(attribute => !albumIdAttributes.includes(attribute));
  }
};

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

  const sts = new AWS.STS({apiVersion: '2011-06-15'});

  //TODO DynamoDBにアクセスして、policy構築＆ExternalIdとかの定義

  const policy = {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Sid": "Stmt1",
        "Effect": "Allow",
        "Action": "s3:ListAllMyBuckets",
        "Resource": "*"
      }
    ]
  }

  const params = {
    DurationSeconds: 3600,
    ExternalId: 'user固有の感じにするか',
    Policy: JSON.stringify(policy),
    RoleArn: "arn:aws:iam::123456789012:role/demo",
    RoleSessionName: "これもcognito:usernameとかに"
  };
  sts.assumeRole(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
      responseError(callback, err);
      return;
    }

    callback(null, {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ credentials: data.Credentials }),
      isBase64Encoded: false
    });

    /*
    data = {
     AssumedRoleUser: {
      Arn: "arn:aws:sts::123456789012:assumed-role/demo/Bob", 
      AssumedRoleId: "ARO123EXAMPLE123:Bob"
     }, 
     Credentials: {
      AccessKeyId: "AKIAIOSFODNN7EXAMPLE", 
      Expiration: <Date Representation>, 
      SecretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYzEXAMPLEKEY", 
      SessionToken: "AQoDYXdzEPT//////////wEXAMPLEtc764bNrC9SAPBSM22wDOk4x4HIZ8j4FZTwdQWLWsKWHGBuFqwAeMicRXmxfpSPfIeoIYRqTflfKD8YUuwthAx7mSEI/qkPpKPi/kMcGdQrmGdeehM4IC1NtBmUpp2wUE8phUZampKsburEDy0KPkyQDYwT7WZ0wq5VSXDvp75YU9HFvlRd8Tx6q6fE8YQcHNVXAkiY9q6d+xo0rKwT38xVqr7ZD0u0iPPkUL64lIZbqBAz+scqKmlzm8FDrypNC9Yjc8fPOLn9FX9KSYvKTr4rvx3iSIlTJabIQwj2ICCR/oLxBA=="
     }, 
     PackedPolicySize: 6
    }
    */
  });

  const { cognitoUsername, albumId, isOwner } = event;

  const cognito = new AWS.CognitoIdentityServiceProvider();

  if (!cognitoUsername || !albumId) {
    callback({ error: 'There is no cognito user name or album id.' });
    return;
  }

  const userPoolId = process.env.COGNITO_USER_POOL_ID;

  cognito.adminGetUser({
    UserPoolId: userPoolId,
    Username: cognitoUsername,
  }, (err, res) => {
    if (err) {
      callback(err);
      return;
    }

    const albumIdPlaceholder = getEmptyAlbumIdPlaceholder(isOwner, res.UserAttributes);
    if (!albumIdPlaceholder) {
      callback({ error: 'No more album id placeholder.' });
      return;
    }

    const cognitoParam = {
      UserAttributes: [
        {
          Name: albumIdPlaceholder,
          Value: albumId,
        },
      ],
      UserPoolId: userPoolId,
      Username: cognitoUsername,
    };

    cognito.adminUpdateUserAttributes(cognitoParam, (err, res) => {
      if (err) {
        callback(err);
        return;
      }
      callback(null, { message: 'success!' });
    });
  });
};

