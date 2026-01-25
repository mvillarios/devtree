import mongoose from "mongoose";
import colors from "colors";

export const connectDB = async () => {
  try {
    const url = process.env.MONGO_URI || "";
    const connection = await mongoose.connect(url);
    console.log(colors.magenta.bold("MongoDB connectado"));
  } catch (error) {
    console.error(
      colors.bgRed.white.bold("Error al conectar a MongoDB:"),
      error,
    );
    process.exit(1);
  }
};
