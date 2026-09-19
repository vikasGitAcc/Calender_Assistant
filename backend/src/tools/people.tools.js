import { google } from "googleapis";
import tokens from "../../credentials.json" with {type:"json"}

const oauth2Client = new google.auth.OAuth2(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	process.env.GOOGLE_REDIRECT_URL,
);

oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
})

const peopleService = google.people({
    version: "v1",
    auth: oauth2Client
})

async function test(){
    const contactList = await peopleService.people.connections.list({resourceName:"people/me", personFields:"addresses,birthdays,emailAddresses,names,nicknames,locations,phoneNumbers"});
    console.log("Contacts: ", JSON.stringify(contactList.data.connections,null,2))
}

test()