// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// 👇 Start handling routes here
const { isAuthenticated } = require("./middleware/jwt.middleware");

const indexRoutes = require("./routes/index.routes");
const regionRoutes= require("./routes/regions.routes")
const citiesRoutes= require("./routes/cities.routes")
const placesRoutes= require("./routes/places.routes")
const authRoutes= require('./routes/auth.routes')
app.use("/api", indexRoutes);
app.use("/api", regionRoutes)
app.use("/api", citiesRoutes)
app.use("/api", placesRoutes)
app.use("/auth", authRoutes)

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
