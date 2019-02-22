const handler = require('./handler')

handler.privateEndpoint(
  {
    body: `{"user_id": "twitter|15353121", "message": "same code works from local node, not from Lambda 😠"}`,
  },
  null,
  (err, response) => console.log(response)
)
