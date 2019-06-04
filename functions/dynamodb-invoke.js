const AWS = require('aws-sdk');

AWS.config.update({region: 'ap-northeast-1'});

exports.handler = (event, context, callback) => {

  const lambda = new AWS.Lambda();

  event.Records
    .filter(record => record.eventName === 'INSERT')
    .forEach(record => {

      const item = record.dynamodb.NewImage;

      const albumproperty = item.album_property.S;
      const albumpropertySplitted = albumproperty.split('#');
      if (albumpropertySplitted[0] !== 'user') {
        return null;
      }
      const cognitoUsername = albumpropertySplitted[1];

      lambda.invokeAsync({
        FunctionName: 'grant-authority-cognito',
        Payload: {
          cognitoUsername,
          albumId: item.album_id.S,
          isOwner: item.owner.B,
        },
      });
    });
};

