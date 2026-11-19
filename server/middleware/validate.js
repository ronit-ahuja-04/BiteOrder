// Request input validation (express-validator). Each export is an array of rules + the runner.
const { body, validationResult } = require('express-validator');

const CATEGORIES = ['starters', 'mains', 'breads', 'desserts', 'beverages'];

// Runs after the rules: returns 400 with readable messages if anything failed
const run = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  const errors = result.array().map((e) => ({ field: e.path, message: e.msg }));
  res.status(400).json({
    success: false,
    message: `Validation Error: ${errors.map((e) => e.message).join(' ')}`,
    errors,
  });
};

const registerRules = [
  body('name').isString().trim().isLength({ min: 2, max: 60 }).withMessage('"name" must be 2-60 characters.'),
  body('email').isString().trim().isEmail().withMessage('"email" must be a valid email address.').normalizeEmail({ gmail_remove_dots: false }),
  body('password').isString().isLength({ min: 6, max: 72 }).withMessage('"password" must be 6-72 characters.'),
  run,
];

const loginRules = [
  body('email').isString().trim().isEmail().withMessage('"email" must be a valid email address.').normalizeEmail({ gmail_remove_dots: false }),
  body('password').isString().notEmpty().withMessage('"password" is required.'),
  run,
];

const menuFields = (optional) => {
  const w = (chain) => (optional ? chain.optional() : chain);
  return [
    w(body('name')).isString().trim().notEmpty().withMessage('"name" is a required field.'),
    w(body('category')).isString().trim().toLowerCase().isIn(CATEGORIES).withMessage(`"category" must be one of: ${CATEGORIES.join(', ')}.`),
    w(body('price')).isFloat({ min: 1 }).withMessage('"price" must be a positive number.'),
    body('halfPrice').optional().isFloat({ min: 0 }).withMessage('"halfPrice" must be a number.'),
    body('isVeg').optional().isBoolean().withMessage('"isVeg" must be true or false.'),
  ];
};
const menuCreateRules = [...menuFields(false), run];
const menuUpdateRules = [...menuFields(true), run];

const orderRules = [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item.'),
  body('total').optional().isFloat({ min: 0 }).withMessage('"total" must be a number.'),
  body('orderType').optional().isIn(['dine-in', 'takeaway']).withMessage('"orderType" must be dine-in or takeaway.'),
  body('customer.mobile').optional({ values: 'falsy' }).matches(/^[0-9+\-\s]{7,15}$/).withMessage('"mobile" must be a valid phone number.'),
  run,
];

const orderStatusRules = [
  body('status').optional().isIn(['Pending', 'Preparing', 'Ready', 'Served', 'Cancelled']).withMessage('Invalid status. Valid statuses are: Pending, Preparing, Ready, Served, Cancelled'),
  run,
];

module.exports = { registerRules, loginRules, menuCreateRules, menuUpdateRules, orderRules, orderStatusRules };
