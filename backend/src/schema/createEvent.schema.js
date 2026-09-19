import z from "zod"

const timeZoneSchema = z
    .string()
    .describe(
        "IANA time zone string",
    );

const eventDateSchema = z.union([
    z.object({
        dateTime: z
            .string()
            .describe("RFC3339 date-time, e.g. 2026-09-20T15:00:00+05:30"),
        timeZone: timeZoneSchema,
    }),

    z.object({
        date: z.string().describe("All-day event date in YYYY-MM-DD format."),
    }),
]);

const createEventTitleSchema = z
    .string()
    .min(1)
    .describe("Title of the event. It should be in capitalized format.");

const createEventDesciptionSchema = z
    .string()
    .optional()
    .describe("description of the event");

const createEventLocationSchema = z
    .string()
    .optional()
    .describe("Geographic location of the event as free-form text.");

const createEventAttendeesSchema = z
    .array(
        z.object({
            email: z.email().describe("email of the attendee"),
            displayName: z
                .string()
                .optional()
                .describe("The attendee's name, if available. Optional."),
        }),
    )
    .optional()
    .default([]);

const createEventBirthdayPropertiesSchema = z
    .object({
        type: z
            .enum(["anniversary", "birthday", "custom", "other", "self"])
            .default("birthday")
            .describe(`Type of birthday or special event. Possible values are:
            "anniversary" - An anniversary other than birthday.
            "birthday" - A birthday event. This is the default value.
            "custom" - A special date whose label is further specified in the customTypeName field. Always has a contact.
            "other" - A special date which does not fall into the other categories, and does not have a custom label. Always has a contact.
            "self" - Calendar owner's own birthday. Cannot have a contact.`),
    })
    .describe(
        "Birthday or special event data. Only provide this when eventType is birthday.",
    );

const createEventEventTypeSchema = z
    .enum([
        "birthday",
        "default",
        "focusTime",
        "outOfOffice",
        "workingLocation",
    ])
    .default("default").describe(`
            Specific type of the event.

            Use "birthday" only for a birthday/Aniversary events .
            Use "default" for normal meetings, reminders, discussions, etc. This cannot be modified after the event is created.
            Possible values are:

            "birthday" - A special all-day event with an annual recurrence.
            "default" - A regular event or not further specified.
            "focusTime" - A focus-time event.
            "outOfOffice" - An out-of-office event.
            "workingLocation" - A working location event.`); 

const createEventRecurrenceSchema = z.array(z.string()).optional()
.describe(`Recurrence rules for repeating events.
    
            List of RRULE, EXRULE, RDATE and EXDATE lines for a recurring event, as specified in RFC5545. Note that DTSTART and DTEND lines are not allowed in this field; event start and end times are specified in the   start and end fields. This field is omitted for single events or instances of recurring events.

            Use RFC5545 RRULE format.

            Examples:
            - Every day: RRULE:FREQ=DAILY
            - Every week: RRULE:FREQ=WEEKLY
            - Every Monday: RRULE:FREQ=WEEKLY;BYDAY=MO
            - Every month: RRULE:FREQ=MONTHLY
            - Every year: RRULE:FREQ=YEARLY

            Omit this field for a one-time event.
                
            

            for examples:
                1.) My friend birthay is on 21 July create an event on that day?
                       return 'RRULE:FREQ=YEARLY'
                2.) create an aniversary event?
                       return 'RRULE:FREQ=YEARLY'
                3.) Create an event on 6 june related to running it should repeat every weak?
                       return 'RRULE:FREQ=WEEKLY'
                4.) Create an event on 8 May related to fishing it should repeat every month of the same day?
                       return 'RRULE:FREQ=MONTHLY'        
                5.) today is wednesday create a homework enent for daily?
                       return 'RRULE:FREQ=DAILY'  
    `);       
    
const createEventVisibilitySchema = z
    .enum(["default", "public", "private", "confidential"])
    .optional();

const createEventTransparencySchema = z
    .enum(["opaque", "transparent"])
    .optional();
    



export {createEventTransparencySchema,createEventVisibilitySchema,createEventRecurrenceSchema,createEventEventTypeSchema,createEventBirthdayPropertiesSchema,createEventAttendeesSchema,createEventLocationSchema,createEventDesciptionSchema,createEventTitleSchema,eventDateSchema}    