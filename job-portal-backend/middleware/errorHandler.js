module.exports = (err, req, res, next) => {
  console.error("Error caught:", err.stack || err.message);

  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
