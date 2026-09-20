import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	process.env.GOOGLE_REDIRECT_URL,
);

oauth2Client.setCredentials({
	refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const peopleService = google.people({
	version: "v1",
	auth: oauth2Client,
});

async function test(query) {
	
}       

test("");

export async function getContacts({ query }) {
	console.log("get contact tool execute...");
    try {
        await peopleService.people.searchContacts({
			query:"",
			readMask: "names,phoneNumbers,emailAddresses",
		});
		const response = await peopleService.people.searchContacts({
			query,
			readMask: "names,phoneNumbers,relations,emailAddresses,addresses",
		});
        
        const data = response.data.results.map((contact)=>{
            return {
                resourceName: contact.person?.resourceName,
                names: contact.person?.names?.map((name)=>({id: name.metadata.source.id,displayName: name.displayName})),
                phoneNumbers: contact.person?.phoneNumbers?.map((data)=>({id: data.metadata.source.id, value:data.value})),
                emailAddresses: contact.person?.emailAddresses?.map((data)=>({id: data.metadata.source.id, value:data.value})),
                addresses: contact.person?.addresses?.map((data)=>({id: data.metadata.source.id, value:data.formattedValue})),
            }
        })

        console.log("Contacts: ", JSON.stringify(data, null, 2));

        return JSON.stringify(data) 
	} catch (err) {
        console.log("ERRR: ",err)
    }
     
	return "Failed to fetch contacts data";
}



//my friend gurmeet aniversary is on tomorrow create an event for it