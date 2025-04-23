const { runQuery } = require("../db/query");

exports.createRating = async ({ senderId, category, receiver_id, rating }) => {
  return await runQuery(
    `INSERT INTO Ratings (category, receiver_id, sender_id, rating)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE rating = VALUES(rating)`,
    [category, receiver_id, senderId, rating]
  );
};

exports.getRatingsForUser = async (userId) => {
  return await runQuery("SELECT * FROM Ratings WHERE receiver_id = ?", [
    userId,
  ]);
};
