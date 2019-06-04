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

      const lambdaParam = {
        FunctionName: 'grant-authority-cognito',
        InvocationType: "Event",
        Payload: JSON.stringify({
          cognitoUsername,
          albumId: item.album_id.S,
          isOwner: item.owner.BOOL,
        }),
      };

      lambda.invoke(lambdaParam, (err, res) => {
        console.log(err, res);
      });
    });
};

