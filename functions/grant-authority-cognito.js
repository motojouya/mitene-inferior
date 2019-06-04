const AWS = require('aws-sdk');

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

exports.handler = (event, context, callback) => {

  console.log(event);
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
    if (albumIdPlaceholder) {
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

