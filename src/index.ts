import createApp from "./server";

const PORT = process.env.PORT || 3000;

createApp()
  .then((app) => {
    app.listen(PORT, () => {
      console.log(`✅ Server is listening on ${process.env.BASE_URL} (Press Ctrl+C to stop)\n`);
      console.log(`\tNODE_ENV: ${process.env.NODE_ENV}`);
      console.log(`\t.env:     ${process.env.ENV_PATH}\n`);
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
