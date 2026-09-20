import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	process.env.GOOGLE_REDIRECT_URL,
);

oauth2Client.setCredentials({
	refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});
const calendar = google.calendar({ version: "v3", auth: oauth2Client });

export const getEvent = async ({ timeMin, timeMax, q }) => {
	console.log("tool calling....");
	console.log("q: ", q);
	try {
		const calendarEventsList = await calendar.events.list({
			calendarId: "primary",
			timeMin,
			timeMax,
			q,
		});

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
	} catch (err) {
		console.log("ERRRR: ", err);
	}

	return "Failed to fetch requested data";
};

export const createEvent = async ({
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
				...(isBirthday ? { birthdayProperties } : {}),
				eventType,
				recurrence,
				visibility: isBirthday ? "private" : visibility,
				transparency: isBirthday ? "transparent" : transparency,
				...(isBirthday || birthdayProperties?.type === "anniversary"
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

		if (response?.data?.id) {
			return "Event added successfully";
		}
	} catch (err) {
		console.log("ERRR: ", err);
	}

	return "Failed to add event in the calendar";
};

export async function deleteEvent({ eventId }) {
	console.log("Id: ", eventId);
	console.log("Delete tool executing...");
	try {
		await calendar.events.delete({
			calendarId: "primary",
			eventId,
		});

		return "Requested event has been successfully deleted";
	} catch (err) {
		console.log("Delete Event ERRR: ", err);
	}

	return "Failed to delete the event";
}

async function patchEvent({ eventId, fields }) {
	const {
		location,
		description,
		start,
		end,
		transparency,
		visibility,
		attendees,
		eventType,
		birthdayProperties,
		creator,
		organizer,
		originalStartTime,
		summary
	} = fields;
    
    console.log("EventID: ",eventId);
    console.log("fields: ",fields);

	if (!eventId) {
		throw new Error("Event Id is missing");
	}

	try {
		const res = await calendar.events.patch({
			calendarId: "primary",
			eventId,
			requestBody: {
				...(location ? { location } : {}),
				...(description ? { description } : {}),
				...(start ? { start } : {}),
				...(end ? { end } : {}),
				...(transparency ? { transparency } : {}),
				...(visibility ? { visibility } : {}),
				...(attendees ? { attendees } : {}),
				...(eventType ? { eventType } : {}),
				...(eventType==="birthay" && birthdayProperties ? { birthdayProperties } : {}),
				...(creator ? { creator } : {}),
				...(organizer ? { organizer } : {}),
				...(originalStartTime ? { originalStartTime } : {}),
				...(summary ? { summary } : {}),

			},
		});

		console.log("Patch Response", res);
		return "Event updated successfully";
	} catch (err) {
		console.log("Patch ERRR: ", err);
	}

	return "failed to update the event"
}


export {patchEvent}
