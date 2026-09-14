import { StateGraph } from "@langchain/langgraph";
import { model } from "./src/model/llm.model.js";
import { getEvent, createEvent } from "./src/prepare/calendar.prepare.js";

const tools = [getEvent, createEvent]

const LLMWithTools = model.bindTools(tools);

(async function main(){
    const res = await LLMWithTools.invoke("create a meeting in google calendar with sujoy on 15th sep 2026, meeting goint to held in google meet at 3:00 pm")

    console.log(res)
})()

// const graph = new StateGraph()

