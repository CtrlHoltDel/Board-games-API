const db = require('../connection');
const format = require('pg-format');
const { pgFormatFriendly } = require('./data-manipulation');

exports.fillTables = async ({
  categoryData,
  commentData,
  reviewData,
  userData,
  userLikesData,
}) => {
  const insertData = (table, categories, data) => {
    return format(
      `INSERT INTO %I (%I) VALUES %L`,
      table,
      categories,
      pgFormatFriendly(data, table)
    );
  };

  await db.query(
    insertData('categories', ['slug', 'description'], categoryData)
  );
  await db.query(
    insertData('users', ['username', 'name', 'avatar_url', 'email'], userData)
  );
  await db.query(
    insertData(
      'reviews',
      [
        'title',
        'designer',
        'owner',
        'review_img_url',
        'review_body',
        'category',
        'created_at',
        'votes',
      ],
      reviewData
    )
  );
  await db.query(
    insertData(
      'comments',
      ['body', 'votes', 'author', 'review_id', 'created_at'],
      commentData
    )
  );

  await db.query(
    insertData(
      'review_likes',
      ['username', 'review_id', 'liked_at'],
      userLikesData
    )
  );
};
