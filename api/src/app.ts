import express from "express";
import { config } from "dotenv";
import "./dbConfig/dynamo";
import ticketRouter from "./routes/ticket-route";
import { json } from "body-parser";
import cors from "cors";
config();

const PORT = process.env.SERVER_PORT || 4000;

const app = express();
app.use(cors());
app.use(json());
app.use(express.urlencoded({ extended: true }));
app.use("/ticket", ticketRouter);

app.listen(PORT, () => {
  return console.log(
    `Express server is listening at http://localhost:${PORT} 🚀`
  );
});
