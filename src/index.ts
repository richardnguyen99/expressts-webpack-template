import createApp from "./server";

const PORT = process.env.PORT || 3000;

const app = createApp();

app
  .listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  })
  .on("error", (_error: Error) => {
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
