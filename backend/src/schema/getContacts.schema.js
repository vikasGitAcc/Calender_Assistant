import z from "zod"

const getContactsToolSchema = {
    name: "Get_Contacts_tool",
    description: "Retrieves contacts from the user's Google Contacts. Use this tool when you need to find or look up a person's contact information, such as their name, email address, phone number, or other available contact details. Use the contact information returned by this tool when performing actions such as scheduling a Google Calendar event with a contact.",
    schema : z.object({
        query: z.string().describe(`text string that searches the contact on the basis of name, nickname, email address,  The query is used to match prefix phrases of the fields on a person. For example, a person with name "foo name" matches queries such as "f", "fo", "foo", "foo n", "nam", etc., but not "oo n".`)
    })
}

export {getContactsToolSchema}