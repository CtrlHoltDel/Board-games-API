const jwt = require('jsonwebtoken');
const db = require('../db/connection');
const { use } = require('../routers/categories.router');

exports.login = async (req, res) => {
  const { username } = req.body;

  const { rows } = await db.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);

  if (!rows[0]) {
    res.status(404).send({ message: 'Invalid username' });
    return;
  }

  const accessToken = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET);

  res.json({ accessToken });
};

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token === null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send();
    req.user = user;
    next();
  });
};
