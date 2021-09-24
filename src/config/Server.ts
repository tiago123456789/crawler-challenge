import express from "express"
import dotenv from "dotenv"
import routesApp from "../routes"
dotenv.config();

const app = express();

// Load routes the application
routesApp(app);
 
app.listen(process.env.PORT, () => console.log("Server is running in address: http://localhost:3000"))