exports.pgFormatFriendly = (objects, type) => {
  const returnArray = [];

  if (type === "categories") {
    objects.forEach((object) => {
      const { slug, description } = object;
      returnArray.push([slug, description]);
    });
  } else if (type === "comments") {
    objects.forEach((object) => {
      const { body, votes, author, review_id, created_at } = object;
      returnArray.push([body, votes, author, review_id, created_at]);
    });
  } else if (type === "reviews") {
    objects.forEach((object) => {
      const {
        title,
        designer,
        owner,
        review_img_url,
        review_body,
        category,
        created_at,
        votes,
      } = object;
      returnArray.push([
        title,
        designer,
        owner,
        review_img_url,
        review_body,
        category,
        created_at,
        votes,
      ]);
    });
  } else if (type === "users") {
    objects.forEach((object) => {
      const { username, name, avatar_url, created, id } = object;
      returnArray.push([username, name, avatar_url, created, id]);
    });
  } else if (type === "review_likes") {
    objects.forEach((object) => {
      const { username, review_id, liked_at } = object;
      returnArray.push([username, review_id, liked_at]);
    });
  }

  return returnArray;
};
