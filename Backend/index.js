import {app} from "./app.js";
import dotenv from "dotenv";
import connectDB from "./src/db/index.js";



dotenv.config({
  path: "./.env",
});



const port = process.env.PORT || 8000;

connectDB()
.then(() => {
    app.listen(port, () => {
      console.log(`server is listening on http://localhost:${port}`);
    });
  }).catch((error) => {
    console.log("Failed to connect to the database", error);
    process.exit(1);
  }
);

