const AWS = require('aws-sdk');

AWS.config.update({region: 'ap-northeast-1'});

exports.handler = (event, context, callback) => {

  const lambda = new AWS.Lambda();

  event.Records
    .filter(record => record.eventName === 'INSERT')
    .forEach(record => {

      const item = record.dynamodb.NewImage;

      const albumproperty = item.S.album_property;
      const albumpropertySplitted = albumproperty.split('#');
      if (albumpropertySplitted[0] !== 'user') {
        return null;
      }
      const cognitoUsername = albumpropertySplitted[1];

      lambda.invokeAsync({
        FunctionName: 'grant-authority-cognito',
        Payload: {
          cognitoUsername,
          albumId: item.S.album_id,
          isOwner: item.B.owner,
        },
      });
    });
};

