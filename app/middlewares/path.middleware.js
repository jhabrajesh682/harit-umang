module.exports = (req, _, next) => {
  console.log(`${req.method} ${req.path}`);

  next();
};
