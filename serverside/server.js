import express from "express";
import env from "dotenv";
import router from "./router.js";
import cors from "cors";
import connection from "./connection.js";
import bodyParser from "body-parser";
import path from "path";

env.config();

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(cors());
app.use("/api", router); 

// Serve React frontend (Vite `dist` folder)
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "..", "clientside", "dist")));

app.get("*", (req, res) => {
   res.sendFile(path.join(__dirname, "..", "clientside", "dist", "index.html"));
});


connection().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server started at http://localhost:${process.env.PORT}`);
  });
});
