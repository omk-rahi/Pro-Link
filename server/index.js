import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import "dotenv/config";
import mongoose from "mongoose";

import app from "./app.js";
import QRCode from "qrcode";

const PORT = process.env.PORT || 3000;

// try {
//   const MONGO_URI = process.env.MONGO_URI;
//   mongoose.connect(MONGO_URI);
//   console.log("Conneted to database");
// } catch (err) {
//   console.log("Unable to connect to database");
//   process.exit(1);
// }

// app.listen(PORT, () =>
//   console.log(`Server is running on http://localhost:${PORT}`)
// );

// generateQR("https://www.google.com");

// const __dirname = dirname(fileURLToPath(import.meta.url));

// const generateQR = async (text) => {
//   try {
//     console.log(
//       await QRCode.toFile(join(__dirname, "qrcodes", "image.png"), text)
//     );
//   } catch (err) {
//     console.error(err);
//   }
// };

// generateQR("https://www.google.com");
