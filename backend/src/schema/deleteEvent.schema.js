import z from "zod";

const deleteEventToolSchema = {
	name: "Delete_Event_Tool",
	description: "Tool that deletes the google calendar events",
	schema: z.object({
		eventId: z.string().describe("Id that identifies the event"),
	}),
};


export {deleteEventToolSchema};