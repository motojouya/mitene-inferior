const AWS = require('aws-sdk');
const uuid = require('uuid/v4');

AWS.config.update({region: 'ap-northeast-1'});

exports.handler = (event, context, callback) => {
  const cognito = new AWS.CognitoIdentityServiceProvider();
  const proceedFunc = grantAuthorityToCognito(cognito);

  // all じゃなくて raceにする いや全部okか一部か失敗かする
  Promise.all(
    event.Records
      .filter(record => record.eventName === 'INSERT')
      .map(record => {
        const item = record.dynamodb.NewImage;

        const albumproperty = item.S.album_property;
        const albumpropertySplitted = albumproperty.split('#');
        if (albumpropertySplitted[0] !== 'user') {
          return null;
        }
        const cognitoUsername = albumpropertySplitted[1];
        const albumId = item.S.album_id;
        return proceedFunc(cognitoUsername, albumId);

      })
      .filter(promise => promise !== null)
  ).then(result => {
    callback(null, { message: 'success!' });
  });
};

const grantAuthorityToCognito = cognitoClient => (cognitoUsername, albumId) => {

  return new Promise((resolve, reject) => {

    if (!cognitoUsername || !albumId) {
      reject({ error: 'there is no cognito user name or album id.' });
      return;
    }

    //TODO ここでユーザがいるかどうか確認する必要ある
    // いたら権限移譲、なければ権限つけてユーザ作成
    // それか、ユーザがいるかどうかは一気にとれる？

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

    cognito.adminUpdateUserAttributes(cognitoParam, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ message: 'success!' });
    });
  });
};

