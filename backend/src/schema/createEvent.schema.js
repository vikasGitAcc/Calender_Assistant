import z from "zod";

const timeZoneSchema = z.string().describe("IANA time zone string");

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
		contact: z.string().optional()
			.describe(`Resource name of the contact this birthday event is linked to. Format: "people/c12345". This field is only for anniversary events.   
        `),
		type: z
			.enum(["anniversary", "birthday", "custom", "other", "self"])
			.describe(
				`The type of special event.

                 Use "birthday" when the user asks to create a birthday.
                 Use "anniversary" when the user asks to create an anniversary.
                 Use "custom" for a custom special event.`,
			),
	})
	.superRefine((data, ctx) => {
		if (data.type == "birthday" && data.contact) {
			ctx.addIssue({
				code: "custom",
				path: ["contact"],
				message:
					"Do not provide contact when type is 'birthday'. Contact is only required for 'anniversary'.",
			});
		}

		if (data.type === "anniversary" && !data.contact) {
			ctx.addIssue({
				code: "custom",
				path: ["contact"],
				message: "Contact is required when type is 'anniversary'.",
			});
		}
	});

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

            Use "birthday" only for a birthday events .
            Use "default" for normal meetings, anniversary reminders, discussions, etc. This cannot be modified after the event is created.
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

export {
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
};
