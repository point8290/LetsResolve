import { loadEnv } from "./config/env";
import { app } from "./app";

loadEnv();

// PORT is set by hosts like Render; SERVER_PORT is kept for local setups.
const PORT = process.env.PORT || process.env.SERVER_PORT || 4000;

app.listen(PORT, () => {
  console.log(`Express server is listening at http://localhost:${PORT}`);
});
