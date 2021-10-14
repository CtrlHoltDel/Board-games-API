const format = require('pg-format');
const db = require('../db/connection');

exports.pullCount = async (select, table, column, criteria) => {
  const queryString = format(
    `SELECT COUNT(%L) :: INT FROM %I WHERE %I = $1;`,
    select,
    table,
    column
  );

  const { rows } = await db.query(queryString, [criteria]);
  return rows[0].count;
};

exports.pullAllData = async (table) => {
  const queryString = format(`SELECT * FROM %I`, table);
  const { rows } = await db.query(queryString);
  return rows;
};

exports.updateVote = async (amount, id) => {
  const queryString = format(
    `UPDATE reviews SET votes = votes + %s WHERE review_id = $1 RETURNING *;`,
    amount
  );

  const { rows } = await db.query(queryString, [id]);

  return rows[0];
};

exports.pullReviews = async (
  queryBody,
  {
    sort_by = 'created_at',
    order = 'desc',
    category,
    limit = 10,
    p = 0,
    search = '%%',
  }
) => {
  const updatedQueryBody = format(queryBody, sort_by, order);

  if (+p) p = limit * (p - 1);

  const values = [limit, p, `%${search}%`];

  if (category) {
    values.push(category.replace('_', ' '));
  }

  const { rows } = await db.query(updatedQueryBody, values);

  return rows;
};

exports.pullList = async (table, column, criteria, limit = 10, p = 0) => {
  const queryBody = format(
    `
    SELECT * FROM %I 
    WHERE %I = %L
    LIMIT $1 OFFSET $2
    `,
    table,
    column,
    criteria
  );

  const { rows } = await db.query(queryBody, [limit, p]);

  return rows;
};

//Add item
exports.addItem = async (table, values, input) => {
  const queryBody = format(
    `
    INSERT INTO %I
    (%I)
    VALUES
    (%L)
    RETURNING *;
    `,
    table,
    values,
    input
  );

  const { rows } = await db.query(queryBody);

  return rows[0];
};
