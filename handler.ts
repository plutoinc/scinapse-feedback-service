import axios from "axios";
import * as http from "http";
import { google } from "googleapis";
import { JWT } from "google-auth-library";
import { rejects } from "assert";
import { resolve } from "path";
import { FeedbackTicket } from "@pluto_network/scinapse-feedback";

const SLACK_SCINAPSE_FEEDBACK_WEBHOOK_URL =
  process.env.SLACK_SCINAPSE_FEEDBACK_WEBHOOK_URL;
const GOOGLE_SHEET_CLIENT_EMAIL = process.env.GOOGLE_SHEET_CLIENT_EMAIL;
const GOOGLE_SHEET_PRIVATE_KEY = process.env.GOOGLE_SHEET_PRIVATE_KEY;
const SPREAD_SHEET_ID = "14jL4Lw56018fbcBPMsQCe2wSULW05EMDEmheLElnI90";
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

function mapResource(str: string | undefined | null): string {
  if (typeof str === "string") {
    return str;
  } else {
    return "N/A";
  }
}

// POST https://qg6wp4ze48.execute-api.us-east-1.amazonaws.com/prod/feedbacks/new
export async function handleFeedback(event, context, callback) {
  if (!event.body) {
    throw new Error("Feedback is missing.");
  }

  if (!SLACK_SCINAPSE_FEEDBACK_WEBHOOK_URL) {
    throw new Error("SLACK TOKEN is missing");
  }

  const feedbackTicket: FeedbackTicket = JSON.parse(event.body);

  try {
    await axios.post(SLACK_SCINAPSE_FEEDBACK_WEBHOOK_URL, {
      text: feedbackTicket.content,
    });
  } catch (err) {
    console.error(err);
  }


  const jwtClient = new JWT({
    email: GOOGLE_SHEET_CLIENT_EMAIL,
    key: GOOGLE_SHEET_PRIVATE_KEY!.replace(/\\n/g, "\n").replace(/\u003d/, "="),
    scopes: SCOPES
  });

  await new Promise((resolve, reject) => {
    jwtClient.authorize((err: Error, t: any) => {
      if (err) {
        console.error(err);
        reject();
      }
      resolve();
    });
  });

  const resource = {
    values: [
      [
        mapResource(feedbackTicket.userId),
        mapResource(feedbackTicket.gaId),
        mapResource(feedbackTicket.content),
        Date.now(),
        mapResource(feedbackTicket.email)
      ]
    ]
  };

  const sheets = google.sheets({ version: "v4", jwtClient });
  const request = {
    spreadsheetId: SPREAD_SHEET_ID,
    range: "Sheet1",
    valueInputOption: "RAW",
    resource,
    auth: jwtClient
  };

  sheets.spreadsheets.values.append(request, (err, result) => {
    if (err) {
      console.log("ERROR AT APPENDING");
      console.error(err);
    } else {
      console.log(result);
    }
  });

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      "Access-Control-Allow-Origin": "*",
      success: true
    })
  };

  callback(null, response);
}
