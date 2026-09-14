import { tool } from "@langchain/core/tools";
import { getEventTool, createEventTool } from "../tools/calendar.tools.js";
import z from "zod";

export const createEvent = tool(createEventTool,
    {
        name: "create-event",
        description: "tool to create new events in calendar",
        schema: z.object({
            title: z.string().min(1),
            date: z.string().describe("DD:MM:YY 14th Sep 2026"),
            description: z.string().optional(),
            timing: z.iso.time(),
            location: z.string().min(1)
        })
    })


export const getEvent = tool(getEventTool,
    {
        name: "get-event",
        description: "tool to get events from the calendar",
        schema: z.object({
            date: z.string(),
        })
    })