import app from "./app";
import config from "./config";

const { port } = config;

app.listen(port, () => {
  console.log(`Vehicle Rental System server is running on port: ${port}`);
});
