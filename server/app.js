const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { startScheduler } = require("./utils/claimScheduler");

// Load environment variables
dotenv.config();

// Connect to MongoDB - using direct connection string
mongoose
  .connect(
    "mongodb+srv://rishi:RG8172004@cluster0.u65kq.mongodb.net/pict-lostfound"
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom middleware to log request bodies for debugging
app.use((req, res, next) => {
  if (req.method === "POST" || req.method === "PUT") {
    console.log(`${req.method} ${req.url} - Request body:`, req.body);
  }
  next();
});

// Static files - serve the public directory (removing uploads since using Cloudinary)
app.use(express.static(path.join(__dirname, "public")));

// Route Registration
app.use("/", require("./routes")); // Main API routes

// Root endpoint for quick testing
app.get("/", (req, res) => {
  res.json({
    message: "🚀 PICT Lost & Found Backend is Live!",
    status: "success",
    timestamp: new Date().toISOString(),
    testEndpoint: "/api/test",
  });
});

// Test endpoint
app.get("/api/test", (req, res) => {
  res.json({
    status: "✅ Backend API is working!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    message: "PICT Lost & Found Backend is running successfully",
    endpoints: {
      test: "GET /api/test",
      items: "GET /api/items",
      auth: "POST /api/auth/login",
      addItem: "POST /api/items",
    },
    database: "MongoDB Connected",
    cloudinary: "Integrated for image storage",
  });
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

//debugging code
// Add before app.listen()
console.log("Registered Routes:");
try {
  if (app._router && app._router.stack) {
    app._router.stack.forEach((middleware) => {
      if (middleware.route) {
        console.log(
          `${Object.keys(middleware.route.methods)[0]} ${middleware.route.path}`
        );
      } else if (middleware.name === "router") {
        middleware.handle.stack.forEach((handler) => {
          if (handler.route) {
            console.log(
              `${Object.keys(handler.route.methods)[0]} /api${
                handler.route.path
              }`
            );
          }
        });
      }
    });
  } else {
    console.log("No routes found or router not initialized yet");
  }
} catch (error) {
  console.error("Error inspecting routes:", error);
}
//ends here

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
  console.log(`Server is accessible at http://localhost:${PORT}`);

  // Start the claim scheduler - check every 30 minutes
  startScheduler(30);
});

// Handle server errors
// server.on('error', (error) => {
//   if (error.code === 'EADDRINUSE') {
//     console.error(`Port ${PORT} is already in use`);
//     process.exit(1);
//   }
//   throw error;
// });

// module.exports = app;
