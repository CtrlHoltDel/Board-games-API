const format = require('pg-format');
const db = require('../db/connection');

exports.fetchAllData = async (table) => {
  const queryString = format(`SELECT * FROM %I`, table);
  const { rows } = await db.query(queryString);
  return rows;
};

exports.fetchSingleData = async (table, column, criteria) => {
  const queryString = format(`SELECT * FROM %I WHERE %I = $1`, table, column);
  const { rows } = await db.query(queryString, [criteria]);
  return rows[0];
};

exports.fetchCount = async (select, table, column, criteria) => {
  const queryString = format(
    `SELECT COUNT(%L) FROM %I WHERE %I = $1 `,
    select,
    table,
    column
  );

  console.log(queryString);
  const { rows } = await db.query(queryString, [criteria]);
  return rows[0].count;
};
