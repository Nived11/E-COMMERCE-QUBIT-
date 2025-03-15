import express from "express";
import env from "dotenv";
import router from "./router.js";
import cors from "cors";
import connection from "./connection.js";
import bodyParser from "body-parser";

env.config();

const app = express();


app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(cors());
app.use("/api", router);

connection().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`server started http://localhost:${process.env.PORT}`);
    });
});