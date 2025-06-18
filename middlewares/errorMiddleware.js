module.exports = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message });
};

// --- middleware/validateMiddleware.js ---
module.exports = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};