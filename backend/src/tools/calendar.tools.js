import { tool } from "@langchain/core/tools";
import { getEvent, createEvent, deleteEvent, patchEvent} from "../toolFunctions/calendar.toolFunctions.js";
import z from "zod";

import {
	createEventTransparencySchema,
	createEventVisibilitySchema,
	createEventRecurrenceSchema,
	createEventEventTypeSchema,
	createEventBirthdayPropertiesSchema,
	createEventAttendeesSchema,
	createEventLocationSchema,
	createEventDesciptionSchema,
	createEventTitleSchema,
	eventDateSchema,
} from "../schema/createEvent.schema.js";

import {
	getEventTimeMinSchema,
	getEventTimeMaxSchema,
	getEventQSchema,
} from "../schema/getEvent.schema.js";
import { deleteEventToolSchema } from "../schema/deleteEvent.schema.js";
import { patchEventToolSchema } from "../schema/patchEvent.schema.js";

/**
 * create event tool
 */

export const createEventTool = tool(createEvent, {
	name: "create-event",
	description: "tool to create new events in calendar",
	schema: z.object({
		title: createEventTitleSchema,
		description: createEventDesciptionSchema,
		location: createEventLocationSchema,
		attendees: createEventAttendeesSchema,
		birthdayProperties: createEventBirthdayPropertiesSchema,
		eventType: createEventEventTypeSchema,
		recurrence: createEventRecurrenceSchema,
		visibility: createEventVisibilitySchema,
		transparency: createEventTransparencySchema,

		start: eventDateSchema.describe("Starting date/time of the event"),
		end: eventDateSchema.describe("Ending date/time of the event"),
	}),
});

/**
 * Get Event tool
 */

export const getEventTool = tool(getEvent, {
	name: "get-event",
	description: "tool to get events from the calendar",
	schema: z.object({
		timeMin: getEventTimeMinSchema,
		timeMax: getEventTimeMaxSchema,
		q: getEventQSchema,
	}),
});



/**
 * delete Event tool
 */


export const deleteEventTool = tool(deleteEvent, deleteEventToolSchema);  

export const patchEventTool = tool(patchEvent, patchEventToolSchema);