const app = require("./app");

const rawPort = process.env.PORT ?? "5000";
const PORT = Number(rawPort);

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});