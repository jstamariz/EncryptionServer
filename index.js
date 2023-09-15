const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const DbService = require("./services/dbService");
dotenv.config();

const port = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (request, response) => {
	response.sendFile(path.join(__dirname, "./pages/index.html"));
});

app.post("/encript", (request, response) => {
	new DbService().save(request.body);
	response.redirect("/");
});

app.get("/data", (request, response) => {
	const data = new DbService().getAll();
	response.status(200).send(data);
});

app.listen(port, () => {
	console.log(`app running! in ${port}`);
});
