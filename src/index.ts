import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import cookieSession from "cookie-session";
import requestIp from "request-ip";
import { connectDB } from "./config/db.config";
import { log, rateLimiter, notFound, errorHandler } from "./middlewares";
import API from "./routes"
import { generateResponse } from "./utils/helpers";

// initialize environment variables
dotenv.config();

// initialize express app
const app: Application = express();

// connect to database
connectDB();

// // set port
const PORT: Number = +(process.env.PORT as string) || 5000;

// initialize http server
const httpServer = createServer(app);

// set up middlewares
app.use(requestIp.mw());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieSession({
    name: 'session',
    keys: [process.env.COOKIE_KEY as string],
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
}));
app.use(cors({ origin: "*", credentials: true }));
app.use(rateLimiter);

app.get('/', (req, res) => generateResponse(null, `Welcome to ${process.env.APP_NAME}!`, res));

app.use(log);
new API(app).registerGroups();
app.use(notFound);
app.use(errorHandler);

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});