import mongoose from "mongoose";
import colors from "colors";
import User from "../models/User";

export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URI || "");
    const url = `${connection.host}:${connection.port}`;
    console.log(
      colors.magenta.bold("MongoDB conectado en la URL:"),
      colors.cyan.underline(url),
    );
  } catch (error) {
    console.error(
      colors.bgRed.white.bold("Error al conectar a MongoDB:"),
      error,
    );
    process.exit(1);
  }
};
