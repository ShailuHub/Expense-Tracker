exports.postUser = (req, res, next) => {
  const { username, email, password, confirm_password } = req.body;
  res.status(201).send({ username, email, password, confirm_password });
};
