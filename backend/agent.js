import { END, MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { model } from "./src/model/llm.model.js";
import { getEvent, createEvent } from "./src/prepare/calendar.prepare.js";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { HumanMessage } from "@langchain/core/messages";

const tools = [getEvent, createEvent]

const LLMWithTools = model.bindTools(tools);

const graph = new StateGraph(MessagesAnnotation)

/**
 * model node
 */

const assistant = async(state) => {
   const response = await LLMWithTools.invoke(state.messages);
   if(!response){
    throw new Error("LLM failed to generate the output")
   }
   return {messages:[response]}   
}

/**
 * Tool Node
 */

const toolNode = new ToolNode(tools);

/**
 * conditional edge decider
 */

async function shouldContinue(state) {
    const lastMessage = state.messages[state.messages.length-1];

    if(lastMessage.tool_calls?.length>0) return "tools"
    
    return "__end__"
}

/**
 * build the graph
 */

graph
.addNode("assistant", assistant)
.addNode("tools", toolNode)
.addEdge("__start__", "assistant")
.addEdge("tools", "assistant")
.addConditionalEdges("assistant", shouldContinue, {"__end__": END, "tools": "tools"})

const app = graph.compile();

(async function main(){
    const res = await app.invoke({messages: new HumanMessage("create a meeting in google calendar with sujoy on 15th sep 2026, meeting goint to held in google meet at 3:00 pm")})

    console.log((res.messages[res.messages.length-1]).content);
})()


