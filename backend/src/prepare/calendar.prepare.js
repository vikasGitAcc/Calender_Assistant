import { tool } from "@langchain/core/tools";
import { getEventTool, createEventTool } from "../tools/calendar.tools.js";
import z from "zod";

import {createEventTransparencySchema,createEventVisibilitySchema,createEventRecurrenceSchema,createEventEventTypeSchema,createEventBirthdayPropertiesSchema,createEventAttendeesSchema,createEventLocationSchema,createEventDesciptionSchema,createEventTitleSchema,eventDateSchema} from "../schema/createEvent.schema.js"  

import {getEventTimeMinSchema, getEventTimeMaxSchema, getEventQSchema} from "../schema/getEvent.schema.js"   
	
/**
 * create event tool
 */

export const createEvent = tool(createEventTool, {
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


export const getEvent = tool(getEventTool, {
	name: "get-event",
	description: "tool to get events from the calendar",
	schema: z.object({
		timeMin: getEventTimeMinSchema,
		timeMax: getEventTimeMaxSchema,
		q: getEventQSchema,
	}),
});
