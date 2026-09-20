import { tool } from "@langchain/core/tools";
import { getContacts } from "../toolFunctions/people.toolFunctions.js";
import { getContactsToolSchema } from "../schema/getContacts.schema.js";

const getContactsTool = tool(getContacts, getContactsToolSchema);

export { getContactsTool };
