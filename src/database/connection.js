require("dotenv").config();

const knex = require("knex")({
	client: "pg",
	connection: {
		host: process.env.HOST,
		user: process.env.LOCAL_USER,
		password: process.env.LOCAL_PASS,
		database: process.env.LOCAL_DB_NAME
	}
});

module.exports = knex;
