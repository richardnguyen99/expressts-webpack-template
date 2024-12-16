import Express from "express";

const createApp = () => {
  const app = Express();

  app.use(Express.urlencoded({ extended: true }));

  app.get("/", (_req, res) => {
    res.send("Hello World!\n");
  });

  return app;
};

export default createApp;
