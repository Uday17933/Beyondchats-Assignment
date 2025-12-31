import app from "./app.js";
import dotenv from "dotenv";
import connectdb from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectdb();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
