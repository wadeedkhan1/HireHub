exports.formatDate = (date) => {
  return new Date(date).toISOString().split("T")[0]; // yyyy-mm-dd
};
