import express from "express";
import { config } from "dotenv";
import ticketRouter from "./routes/ticket-route";
import articleRouter from "./routes/article-route";
import userRouter from "./routes/user-route";
import { json } from "body-parser";
import cors from "cors";
config({ path: ".env.local" });
const PORT = process.env.SERVER_PORT || 4000;

const app = express();
app.use(cors());
app.use(json());
app.use(express.urlencoded({ extended: true }));
app.use("/article", articleRouter);
app.use("/ticket", ticketRouter);
app.use("/user", userRouter);

app.listen(PORT, () => {
  return console.log(
    `Express server is listening at http://localhost:${PORT} 🚀`
  );
});
