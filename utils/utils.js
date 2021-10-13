const format = require('pg-format');
const db = require('../db/connection');

exports.fetchAllData = async (table) => {
  const queryString = format(`SELECT * FROM %I`, table);
  const { rows } = await db.query(queryString);
  return rows;
};

exports.fetchSingleData = async (table, column, criteria) => {
  const queryString = format(`SELECT * FROM %I WHERE %I = $1;`, table, column);
  const { rows } = await db.query(queryString, [criteria]);
  return rows[0];
};

exports.fetchCount = async (select, table, column, criteria) => {
  const queryString = format(
    `SELECT COUNT(%L) :: INT FROM %I WHERE %I = $1;`,
    select,
    table,
    column
  );

  const { rows } = await db.query(queryString, [criteria]);
  return rows[0].count;
};

exports.updateVote = async (amount, id) => {
  const queryString = format(
    `UPDATE reviews SET votes = votes + %s WHERE review_id = $1 RETURNING *;`,
    amount
  );

  const { rows } = await db.query(queryString, [id]);

  return rows[0];
};
