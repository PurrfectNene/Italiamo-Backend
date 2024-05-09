module.exports = (app) => {
  app.use((req, res, next) => {
    // this middleware runs whenever requested page is not available
    res.status(404).json({ message: "This route does not exist" });
  });

  app.use((err, req, res, next) => {
    // whenever you call next(err), this middleware will handle the error
    // always logs the error

    console.error("ERROR", req.method, req.path, err);

    if (err.code == "invalid_token" || err.code === "credentials_required"){
      res.status(401).json({
        message: err.inner.message,
      })
      return;
    }

    if (err) {
      
      res.status(400).json({
        message: err,
      });
      return;
    }
    // only render if the error ocurred before sending the response
    if (!res.headersSent) {
      res.status(500).json({
        message: "Internal server error. Check the server console",
      });
    }
  });
};
