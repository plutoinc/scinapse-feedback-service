import axios from "axios";

interface Feedback {
  content: string;
  email?: string;
  userId?: string;
}

// POST https://qg6wp4ze48.execute-api.us-east-1.amazonaws.com/prod/feedbacks/new
export async function handleFeedback(event, context, callback) {
  const SLACK_SCINAPSE_FEEDBACK_WEBHOOK_URL =
    process.env.SLACK_SCINAPSE_FEEDBACK_WEBHOOK_URL;

  if (!SLACK_SCINAPSE_FEEDBACK_WEBHOOK_URL) {
    throw new Error("SLACK TOKEN is missing");
  }

  try {
    await axios.post(SLACK_SCINAPSE_FEEDBACK_WEBHOOK_URL, {
      text: "TEST"
    });
  } catch (err) {
    console.error(err);
  }

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
