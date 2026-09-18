import { google } from "googleapis";
import tokens from "../../credentials.json" with { type: "json" };
import { oauth2Client } from "../../index.js";

oauth2Client.setCredentials(tokens);
const calendar = google.calendar({ version: "v3", auth:oauth2Client });

export const getEventTool = async ({ timeMin,timeMax,q }) => {
	console.log("tool calling....")
	console.log("q: ",q)
    const calendarEventsList = await calendar.events.list({calendarId:"primary",timeMin,timeMax,q})
	console.log("events: ",calendarEventsList.data?.items)

    const events = calendarEventsList.data?.items.map(event=>{
		return {
			id: event.id,
			title: event.summary,
			description: event.description,
			organizer: event.organizer.email,
			start: event.start,
			end: event.end,
			location: event.location,
			attendees: event.attendees,
			status: event.status,
			meetingLink: event.hangoutLink 
		}
	}) 

	return JSON.stringify(events);
};

export const createEventTool = async ({
	title,
	date,
	location,
	timing,
	description,
}) => {
	return "Event added successfully";
};
