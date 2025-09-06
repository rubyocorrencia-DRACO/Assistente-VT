import fs from "fs";
import path from "path";
import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const TOKEN_PATH = path.join(process.cwd(), "data/token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf-8"));
const { client_secret, client_id, redirect_uris } = credentials.installed;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

if (fs.existsSync(TOKEN_PATH)) {
  const token = fs.readFileSync(TOKEN_PATH, "utf-8");
  oAuth2Client.setCredentials(JSON.parse(token));
}

export async function createEvent(summary: string, description: string, dateTime: string) {
  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
  const start = new Date(dateTime);
  const end = new Date(start.getTime() + 60 * 60 * 1000); // 1h de duração

  const event = {
    summary,
    description,
    start: { dateTime: start.toISOString(), timeZone: "America/Sao_Paulo" },
    end: { dateTime: end.toISOString(), timeZone: "America/Sao_Paulo" }
  };

  const res = await calendar.events.insert({ calendarId: "primary", requestBody: event });
  return res.data;
}

export async function listEvents(startDateTime: string, endDateTime: string) {
  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin: new Date(startDateTime).toISOString(),
    timeMax: new Date(endDateTime).toISOString(),
    singleEvents: true
  });
  return res.data.items || [];
}

export async function updateEvent(eventId: string, summary: string, description: string, dateTime: string) {
  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
  const start = new Date(dateTime);
  const end = new Date(start.getTime() + 60 * 60 * 1000);

  const res = await calendar.events.update({
    calendarId: "primary",
    eventId,
    requestBody: {
      summary,
      description,
      start: { dateTime: start.toISOString(), timeZone: "America/Sao_Paulo" },
      end: { dateTime: end.toISOString(), timeZone: "America/Sao_Paulo" }
    }
  });
  return res.data;
}

export async function deleteEvent(eventId: string) {
  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
  await calendar.events.delete({ calendarId: "primary", eventId });
}
