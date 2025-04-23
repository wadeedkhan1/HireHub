const ratingService = require("../services/rating.service");

exports.createRating = async (req, res, next) => {
  try {
    const senderId = req.body.user_id;
    const { category, receiver_id, rating } = req.body;

    const result = await ratingService.createRating({
      senderId,
      category,
      receiver_id,
      rating,
    });
    res.status(201).json({ message: "Rating submitted", result });
  } catch (err) {
    next(err);
  }
};

exports.getRatingsForUser = async (req, res, next) => {
  try {
    const ratings = await ratingService.getRatingsForUser(req.params.userId);
    res.json(ratings);
  } catch (err) {
    next(err);
  }
};
