import createApp from "./server";

const PORT = process.env.PORT || 3000;

createApp()
  .then((app) => {
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error starting server:", error);
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
