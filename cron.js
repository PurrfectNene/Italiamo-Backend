// Cron job to hit endpoint every 5 min to keep backend alive always
const cron = require("cron");
const http = require("http");
const https = require("https");

// Load environment variables from .env file
require("dotenv").config();

// Determine if the environment is development or production
const isDev = process.env.NODE_ENV === "development";

// Define the backend URL based on the environment
const backendUrl = isDev
  ? `http://localhost:${process.env.PORT}/health`
  : "https://localhost/health";

const job = new cron.CronJob("*/5 * * * *", function () {
  // This function will be executed every 5 minutes.
  console.log("Keeping the server alive");

  // Use http for dev (localhost) and https for production (your domain)
  const client = isDev ? http : https;

  // Perform an HTTPS GET request to hit any backend api.
  client
    .get(backendUrl, (res) => {
      if (res.statusCode === 200) {
        console.log("Server pinged");
      } else {
        console.error(
          "failed to ping server with status code: ${res.statusCode}"
        );
      }
    })
    .on("error", (err) => {
      console.error("Error during ping:", err);
    });
});

// Export the cron job.
module.exports = job;
