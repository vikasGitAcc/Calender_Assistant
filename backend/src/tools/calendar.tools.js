import { google } from "googleapis";
import tokens from "../../credentials.json" with { type: "json" };

const oauth2Client = new google.auth.OAuth2(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	process.env.GOOGLE_REDIRECT_URL,
);

oauth2Client.setCredentials({
	refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});
const calendar = google.calendar({ version: "v3", auth: oauth2Client });

export const getEventTool = async ({ timeMin, timeMax, q }) => {
	console.log("tool calling....");
	console.log("q: ", q);
	const calendarEventsList = await calendar.events.list({
		calendarId: "primary",
		timeMin,
		timeMax,
		q,
	});
	console.log("events: ", calendarEventsList.data?.items);

	const events = calendarEventsList.data?.items.map((event) => {
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
			meetingLink: event.hangoutLink,
		};
	});

	return JSON.stringify(events);
};

export const createEventTool = async ({
	title,
	location,
	description,
	attendees,
	start,
	end,
	birthdayProperties,
	eventType,
	recurrence,
	visibility,
	transparency,
}) => {
	console.log("Title: ", title);
	console.log("location: ", location);
	console.log("attendees: ", attendees);
	console.log("start: ", start);
	console.log("end: ", end);
	console.log("birthdayProperties: ", birthdayProperties);
	console.log("Event Type: ", eventType);
	console.log("Recurrence: ", recurrence);

	if (recurrence) {
		for (const rule of recurrence) {
			if (!rule.startsWith("RRULE:")) {
				throw new Error("Invalid recurrence rule");
			}
		}
	}

	const isBirthday = eventType.trim().toLowerCase() === "birthday";

	try {
		const response = await calendar.events.insert({
			calendarId: "primary",
			eventLabelVersion: 1,
			conferenceDataVersion: isBirthday ? 0 : 1,
			sendUpdates: "all",
			requestBody: {
				end,
				start,
				attendees: isBirthday ? [] : attendees,
				description,
				summary: title,
				location,
				...(isBirthday?{birthdayProperties}:{}),
				eventType,
				recurrence,
				visibility: isBirthday ? "private" : visibility,
				transparency: isBirthday ? "transparent" : transparency,
				...(isBirthday
					? {}
					: {
							conferenceData: {
								createRequest: {
									requestId: crypto.randomUUID(),
									conferenceSolutionKey: {
										type: "hangoutsMeet",
									},
								},
							},
						}),
			},
		});
		console.log("Response: ", response);

		if (response?.data?.id) {
			return "Event added successfully";
		}
	} catch (err) {
		console.log("ERRR: ", err);
	}

	return "Failed to add event in the calendar";
};
