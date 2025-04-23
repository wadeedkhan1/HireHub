exports.asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

exports.formatDate = (date) => {
  return new Date(date).toISOString().split("T")[0]; // yyyy-mm-dd
};

exports.slugify = (str) => {
  return str
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
};
