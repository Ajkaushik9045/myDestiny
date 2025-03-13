import { connectDB, db } from "./config/db.js";
import app from "./app.js";
import dotenv from "dotenv";
import { cloudinaryConnect } from "./config/cloudinary.js";

// Config
dotenv.config();

// Connect to MongoDB
connectDB();

// PORT
const PORT = process.env.PORT || 5500;

cloudinaryConnect();

// Start server if MongoDB is connected
db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});

// Handling Uncaught Exception
// process.on("uncaughtException", (err) => {
//   console.log(`Error: ${err.message}`);
//   console.log(`Shutting server due to uncaught exception`);
//   process.exit(1);
// });

// // // Unhandled Promise Rejection
// process.on("uncaughtException", (err) => {
//   console.log(`Error: ${err.message}`);
//   console.log(`Error stack: ${JSON.stringify(err.stack)}`);
//   console.log(`Shutting server due to uncaught exception`);
//   process.exit(1);
// });
