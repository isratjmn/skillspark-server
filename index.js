const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const Testimonials = require("./testimonials.json");
const port = process.env.PORT || 7000;

// Middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ocimcqo.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

async function run() {
	try {
		client.connect();

		// Collections Setup
		const coursesCollection = client
			.db("skillSparkDB")
			.collection("courses");
		const galleryCollection = client
			.db("skillSparkDB")
			.collection("gallery");

		// Get Courses Data
		app.get("/courses", async (req, res) => {
			const result = await coursesCollection.find().toArray();
			res.send(result);
		});

		// Cet Gallery Image
		app.get("/gallery", async (req, res) => {
			try {
				const result = await galleryCollection.find().toArray();
				res.send(result);
			} catch (error) {
				res.status(500).send({ error: error.message });
			}
		});

		// Testimonials Get Api
		app.get("/testimonials", (req, res) => {
			res.send(Testimonials);
		});

		await client.db("admin").command({ ping: 1 });
		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!"
		);
	} finally {
		// await client.close();
	}
}
run().catch(console.dir);

app.get("/", (req, res) => {
	res.send("SkillSpark Server is running.....");
});

app.listen(port, () => {
	console.log(`SkillSpark Server is running on port ${port}`);
});
