import { tool } from "@langchain/core/tools";
import { getEventTool, createEventTool } from "../tools/calendar.tools.js";
import z from "zod";

export const createEvent = tool(createEventTool, {
	name: "create-event",
	description: "tool to create new events in calendar",
	schema: z.object({
		title: z.string().min(1),
		date: z.string().describe("DD:MM:YY 14th Sep 2026"),
		description: z.string().optional(),
		timing: z.iso.time(),
		location: z.string().min(1),
	}),
});

export const getEvent = tool(getEventTool, {
	name: "get-event",
	description: "tool to get events from the calendar",
	schema: z.object({
		timeMin: z
			.string()
			.describe(
				"Lower bound (exclusive) for an event's end time to filter by. Optional. The default is not to filter by end time. Must be an RFC3339 timestamp with mandatory time zone offset, for example, 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z. Milliseconds may be provided but are ignored. If timeMax is set, timeMin must be smaller than timeMax.",
			),
		timeMax: z
			.string()
			.describe(
				"Upper bound (exclusive) for an event's start time to filter by. Optional. The default is not to filter by start time. Must be an RFC3339 timestamp with mandatory time zone offset, for example, 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z. Milliseconds may be provided but are ignored. If timeMin is set, timeMax must be greater than timeMin",
			),
		q: z.string().optional().describe(`
Text query used to filter Google Calendar events.

IMPORTANT:
- ALWAYS provide a value for "q" when the user is asking to find, search, check, or filter events based on words, names, descriptions, locations, attendees, organizers, or other event information.
- Extract the relevant search keywords directly from the user's request.
- Do NOT leave "q" empty or omit it when the user's request requires a text-based event search.
- If the user asks something like:
  "Do I have any special events?"
  set q to "special".
- "Do I have any meeting with Rahul?"
  set q to "Rahul".
- "Show me events related to project X"
  set q to "project X".
- "Do I have any event at the office?"
  set q to "office".
- "Do I have an event with john@example.com?"
  set q to "john@example.com".

The query can match text in:
- event summary/title
- description
- location
- attendee displayName
- attendee email
- organizer displayName
- organizer email
- workingLocationProperties.officeLocation.buildingId
- workingLocationProperties.officeLocation.deskId
- workingLocationProperties.officeLocation.label
- workingLocationProperties.customLocation.label

If the user is filtering by a specific time period only (for example,
"show my events tomorrow"), do not use "q"; use the appropriate time
parameters instead.

If the user asks for both a time period and a text filter, provide BOTH
the time parameters and "q".
`),
	}),
});
