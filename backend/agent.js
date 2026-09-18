import { END, MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { model } from "./src/model/llm.model.js";
import { getEvent, createEvent } from "./src/prepare/calendar.prepare.js";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

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

console.log("Current Date: ",Date());

(async function main(){
    const res = await app.invoke({messages: [new SystemMessage(`You are a helpfull personal assistant for creating and fetching event from the google calendar. cuurent date is ${Date()}`)
         ,new HumanMessage("create a meeting with sujoy(sujoy@gmail.com) at 7:00 PM to 9:00 PM for tomorrow about backend discussion")]})

    console.log((res.messages[res.messages.length-1]).content);
})()

// create a meeting with sujoy(sujoy@gmail.com) at 7:00 PM to 9:00 PM today about backend discussion
//Do i have an meeting with sujoy