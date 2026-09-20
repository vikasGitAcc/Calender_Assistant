import z from "zod";
import { createEventAttendeesSchema, createEventBirthdayPropertiesSchema, createEventDesciptionSchema, createEventEventTypeSchema, createEventTitleSchema, createEventTransparencySchema, createEventVisibilitySchema, eventDateSchema } from "./createEvent.schema.js";

const creatorSchema = z.object(
    {
        email: z.email().describe("email of the event creator"),
        displayName: z.string().describe("name of the creator")
    }
)

const organizerSchema = z.object(
    {
        email: z.email().describe("email of the event organizer"),
        displayName: z.string().describe("name of the organizer")
    }
) 

const patchEventToolSchema = {
    name: "Patch_Event_Tool",
    description: "Partially update an existing resource. Use this tool when the user wants to modify one or more specific fields of an existing resource without replacing the entire resource. Only provide the fields that need to be changed.",
    schema: z.object(
        {
            eventId: z.string().describe("id that identifies the event"),
            fields: z.object({
                location: z.string().describe("location or address of the event"),
                start: eventDateSchema,
                end: eventDateSchema,
                summary: createEventTitleSchema,
                birthdayProperties: createEventBirthdayPropertiesSchema,
                eventType: createEventEventTypeSchema,
		        description: createEventDesciptionSchema,
				transparency: createEventTransparencySchema,
		        visibility: createEventVisibilitySchema,
		        attendees: createEventAttendeesSchema,
		        creator: creatorSchema,
		        organizer: organizerSchema,
		        originalStartTime: eventDateSchema
            })
        }
    )
}

export {patchEventToolSchema}