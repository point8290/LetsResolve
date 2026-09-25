import { loadEnv } from "./config/env";
import { app } from "./app";

loadEnv();

const PORT = process.env.SERVER_PORT || 4000;

app.listen(PORT, () => {
  console.log(`Express server is listening at http://localhost:${PORT}`);
});
