import createApp from "./server";

const app = createApp();

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
