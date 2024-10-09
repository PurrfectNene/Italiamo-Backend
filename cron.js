// Cron job to hit endpoint every 5 min to keep backend alive always
const cron = require("cron");
const http = require("http");

// Load environment variables from .env file
require("dotenv").config();

// Define the backend URL based on the environment
const backendUrl = `http://localhost:${process.env.PORT}/health`

const job = new cron.CronJob("*/5 * * * *", function () {
  // This function will be executed every 5 minutes.
  console.log("Keeping the server alive");

  // Perform an HTTPS GET request to hit any backend api.
  http
    .get(backendUrl, (res) => {
      if (res.statusCode === 200) {
        console.log("Server pinged");
      } else {
        console.error(
          `failed to ping server with status code: ${res.statusCode}`
        );
      }
    })
    .on("error", (err) => {
      console.error("Error during ping:", err);
    });
});

// Export the cron job.
module.exports = job;
