const AWS = require('aws-sdk');

AWS.config.update({region: 'ap-northeast-1'});

const ALBUM_USER_ATTRIBUTES_PREFIX = 'custom:album';
const ALBUM_OWN_USER_ATTRIBUTES = `${ALBUM_USER_ATTRIBUTES_PREFIX}_own`;
const ALBUM_USER_ATTRIBUTES = Array(10).fill().map((_, i) => `${ALBUM_USER_ATTRIBUTES_PREFIX}${i}`);

const getEmptyAlbumIdPlaceholder = (isOwner, userAttributes) => {

  if (isOwner) {
    const hasAlbumOwnIdAttributes = userAttributes
      .map(attribute => attribute.Name);
      .includes(ALBUM_OWN_USER_ATTRIBUTES)
    return !hasAlbumOwnIdAttributes ? ALBUM_OWN_USER_ATTRIBUTES : null;

  } else {
    const albumIdAttributes = res.UserAttributes
      .filter(attribute => attribute.Name.startWith(ALBUM_USER_ATTRIBUTES_PREFIX))
      .map(attribute => attribute.Name);
    return ALBUM_USER_ATTRIBUTES.first(attribute => !albumAttributes.includes(attribute));
  }
};

exports.handler = (event, context, callback) => {

  const { cognitoUsername, albumId, isOwner } = event;

  const cognito = new AWS.CognitoIdentityServiceProvider();

  if (!cognitoUsername || !albumId) {
    callback({ error: 'There is no cognito user name or album id.' });
    return;
  }

  cognito.adminGetUser({
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
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
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: cognitoUsername,
    };

    cognito.adminUpdateUserAttributes(cognitoParam, (err, res) => {
      if (err) {
        callback(err);
        return;
      }
      callback(null, { message: 'success!' });
    });
  })
};

