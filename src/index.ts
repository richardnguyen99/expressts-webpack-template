import createApp from "./server";

const app = createApp();

app
  .listen(3000, () => {
    console.log("Server is listening on port 3000");
  })
  .on("error", (error: Error) => {
    // see https://github.com/remy/nodemon?tab=readme-ov-file#controlling-shutdown-of-your-script
    process.once("SIGUSR2", function () {
      process.kill(process.pid, "SIGUSR2");
    });

    process.on("SIGINT", function () {
      process.kill(process.pid, "SIGINT");
    });

    process.on("SIGTERM", function () {
      process.kill(process.pid, "SIGTERM");
    });
  });
