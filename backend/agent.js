import { END, MemorySaver, MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { model } from "./src/model/llm.model.js";
import { getEventTool, createEventTool, deleteEventTool, patchEventTool } from "./src/tools/calendar.tools.js";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import readline from "readline/promises";
import {getContactsTool} from "./src/tools/people.tools.js"

const tools = [getEventTool, createEventTool, getContactsTool, deleteEventTool, patchEventTool];

const checkpointer = new MemorySaver();

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const LLMWithTools = model.bindTools(tools);

const graph = new StateGraph(MessagesAnnotation);

/**
 * model node
 */

const assistant = async (state) => {
	const dateTime = new Date().toLocaleString("se-SE").replace(" ","T");
	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	
	const systemMessage = new SystemMessage(`You are a smart personal assistant. Current date and time: ${dateTime}, Current timezone in IANA timezone: ${timezone}`);

	const response = await LLMWithTools.invoke([systemMessage, ...state.messages]);
	if (!response) {
		throw new Error("LLM failed to generate the output");
	}
	return { messages: [response] };
};

/**
 * Tool Node
 */

const toolNode = new ToolNode(tools);

/**
 * conditional edge decider
 */

async function shouldContinue(state) {
	const lastMessage = state.messages[state.messages.length - 1];

	if (lastMessage.tool_calls?.length > 0) return "tools";

	return "__end__";
}

/**
 * build the graph
 */

graph
	.addNode("assistant", assistant)
	.addNode("tools", toolNode)
	.addEdge("__start__", "assistant")
	.addEdge("tools", "assistant")
	.addConditionalEdges("assistant", shouldContinue, {
		__end__: END,
		tools: "tools",
	});

const app = graph.compile({checkpointer});

(async function main() {

    const config = {configurable:{thread_id:"1"}}
	while (true) {
		const question = await rl.question("You: ");
		if (question?.trim().toLowerCase() === "exit"){
            rl.close();
            break;
        };
		const res = await app.invoke({
			messages: [
				
				new HumanMessage(
					question
				),
			],
		},config);

		console.log("AI: ",res.messages[res.messages.length - 1].content);
	}

})();

// create a meeting with sujoy(sujoy@gmail.com) at 7:00 PM to 9:00 PM today about backend discussion
//Do i have an meeting with sujoy
