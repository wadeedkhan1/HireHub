const { body, validationResult } = require("express-validator");

const validateRegister = [
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  body("user_type").isIn(["applicant", "recruiter"]),
  body("name").notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validateRegister,
};
