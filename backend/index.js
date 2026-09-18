import express from "express";
import fs from "fs"
import { google } from "googleapis";

const app = express();

export const oauth2Client = new google.auth.OAuth2(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	process.env.GOOGLE_REDIRECT_URL,
);

app.get("/auth", (req, res) => {
	const scopes = ["https://www.googleapis.com/auth/calendar"];
	const url = oauth2Client.generateAuthUrl({
		// 'online' (default) or 'offline' (gets refresh_token)
		access_type: "offline",
		prompt: "consent",
		// If you only need one scope, you can pass it as a string
		scope: scopes,
	});

	console.log("URL: ", url);

	res.redirect(url);
});

app.get("/callback", async (req, res) => {
	const code = req.query.code;
	const { tokens } = await oauth2Client.getToken(code);
	console.log("Tokens: ", tokens);
	if(tokens){
		fs.writeFileSync("credentials.json", JSON.stringify(tokens))
	}

	res.send("connected ✅ You can now close this tab");
});

const port = process.env.PORT || 3600;

app.listen(port, () => {
	console.log(`App is listent on port: http://localhost:${port}`);
});
