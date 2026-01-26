import express from "express";
import cors from "cors";
import "dotenv/config";
import router from "./router";
import { connectDB } from "./config/db";
import { corsConfig } from "./config/cors";

const app = express();

// Configurar CORS PRIMERO
app.use(cors(corsConfig));

// Leer datos de formulario
app.use(express.json());

connectDB();

app.use("/", router);

export default app;
