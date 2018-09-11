interface Feedback {
  content: string;
  email?: string;
  userId?: string;
}

export async function handleFeedback(event, context, callback) {
  // const parsedBody: Feedback = {

  // };

  // saveFeedbackTo???
  // alertSlack();

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      SLACK_TOKEN: process.env.SLACK_TOKEN,
      message: "Go Serverless v1.0! Your function executed successfully!",
      env: process.env
    })
  };

  callback(null, response);
}

// POST https://qg6wp4ze48.execute-api.us-east-1.amazonaws.com/prod/feedbacks/new
