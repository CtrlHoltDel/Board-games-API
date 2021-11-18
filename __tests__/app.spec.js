const db = require("../db/connection.js");
const app = require("../app.js");
const request = require("supertest");

const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/", () => {
  describe("GET", () => {
    it("404: Responds with an error when an invalid path is requested", async () => {
      const { body } = await request(app).get("/invalid_link").expect(404);
      expect(body.error.message).toBe("Not found");
    });
  });
});

describe("/api", () => {
  describe("GET", () => {
    it("200: Responds with a JSON object containing information about all the endpoints", async () => {
      const { body } = await request(app)
        .get("/api")

        .expect(200);
      expect(body.endPoints).not.toBeUndefined();
    });
    // it('403: Returns an error without authentication', async () => {
    //   await request(app).get('/api').expect(403);
    // });
  });
});

describe("/api/categories", () => {
  describe("GET", () => {
    it("200: Responds with an array of category objects", async () => {
      const { body } = await request(app)
        .get("/api/categories")

        .expect(200);
      body.categories.forEach((category) => {
        expect(category).toMatchObject({
          slug: expect.any(String),
          description: expect.any(String),
        });
      });
    });
  });
});

describe("/api/reviews", () => {
  describe("GET", () => {
    describe("Allows sorting by multiple queries. ", () => {
      it("200: votes", async () => {
        const { body } = await request(app)
          .get("/api/reviews?sort_by=votes")

          .expect(200);

        expect(body.reviews[0].review_id).toBe(12);
      });
      it("200: category", async () => {
        const { body } = await request(app)
          .get("/api/reviews?sort_by=category")

          .expect(200);

        expect(body.reviews[0].review_id).toBe(11);
      });
      it("200: comment_count", async () => {
        const { body } = await request(app)
          .get("/api/reviews?sort_by=comment_count")

          .expect(200);

        expect(body.reviews[0].review_id).toBe(3);
        expect(body.reviews[1].review_id).toBe(2);
      });
      it("200: username", async () => {
        const { body } = await request(app)
          .get("/api/reviews?username=mallionaire")
          .expect(200);

        expect(body.reviews).toHaveLength(10);
        expect(body.count).toBe(11);
      });
    });
    it("200:Responds with an array of reviews including comment count and excluding the body defaulted to be ordered in in ascending order by date. Limits the results to a length of 10", async () => {
      const { body } = await request(app)
        .get("/api/reviews")

        .expect(200);

      body.reviews.forEach((review) => {
        expect(review).toMatchObject({
          review_id: expect.any(Number),
          comment_count: expect.any(Number),
          title: expect.any(String),
          designer: expect.any(String),
          review_img_url: expect.any(String),
          votes: expect.any(Number),
          category: expect.any(String),
          owner: expect.any(String),
          created_at: expect.any(String),
        });
      });

      expect(body.count).toBe(13);

      expect(body.reviews[0].review_id).toBe(7);
      expect(body.reviews[1].review_id).toBe(4);
      expect(body.reviews).toHaveLength(10);
    });
    it("200: Allows searching by specific category", async () => {
      const { body } = await request(app)
        .get("/api/reviews?category=euro_game")

        .expect(200);

      expect(body.count).toBe(1);
      expect(body.reviews).toHaveLength(1);
    });
    it("200: Returns no error for a valid category that returns an empty array", async () => {
      const { body } = await request(app)
        .get("/api/reviews?category=childrens_games")

        .expect(200);

      expect(body.reviews).toHaveLength(0);
    });
    it("200: Accepts an order query in conjunction with other queries", async () => {
      const { body } = await request(app)
        .get("/api/reviews?sort_by=comment_count&order=asc")

        .expect(200);

      expect(body.reviews[0].review_id).toBe(4);
      expect(body.reviews[1].review_id).toBe(7);
    });
    it("200: Works with search queries - searches by title", async () => {
      const { body } = await request(app)
        .get("/api/reviews?search=person")

        .expect(200);

      expect(body.reviews[0].review_id).toBe(11);
    });
    it("200: Works with pagination", async () => {
      const { body } = await request(app)
        .get("/api/reviews?limit=5&p=2")

        .expect(200);

      expect(body.count).toBe(13);
      expect(body.reviews).toHaveLength(5);
      expect(body.reviews[0].review_id).toBe(9);
    });
    it("400: Returns an error for invalid sort_by query", async () => {
      const {
        body: { error },
      } = await request(app)
        .get("/api/reviews?sort_by=invalid_sort_by")

        .expect(400);

      expect(error.message).toBe("Invalid query");
    });
    it("400: Returns an error for invalid order query value", async () => {
      const { body } = await request(app)
        .get("/api/reviews?sort_by=votes&order=not_order")

        .expect(400);

      expect(body.error.message).toBe("Invalid query");
    });
    it("404: Returns an error for non-existent query field", async () => {
      const { body } = await request(app)
        .get("/api/reviews?sort_by=votes&bad_field=12")

        .expect(404);

      expect(body.error.message).toBe("Bad request");
    });
    it("400: Returns an error if limit or page are passed an invalid query value", async () => {
      await request(app)
        .get("/api/reviews?limit=not_a_number")

        .expect(400);

      await request(app)
        .get("/api/reviews?limit=10&p=not_a_number")

        .expect(400);
    });
    it("400: Returns an error if limit or page are not a whole integer ", async () => {
      await request(app)
        .get("/api/reviews?limit=1.25")

        .expect(400);

      await request(app)
        .get("/api/reviews?limit=2&p=1.3")

        .expect(400);
    });
  });
  describe("POST", () => {
    it("201: Adds a review to the database. Returns the review at the time of posting. ", async () => {
      const { body } = await request(app)
        .post("/api/reviews")

        .send({
          title: "New review",
          review_body: "This is the body of the new review",
          designer: "Malto",
          review_img_url:
            "https://assets.dicebreaker.com/lords-of-waterdeep-board-game-layout.jpg/BROK/resize/1920x1920%3E/format/jpg/quality/80/lords-of-waterdeep-board-game-layout.jpg",
          category: "dexterity",
          owner: "dav3rid",
        })
        .expect(201);

      expect(body.review).toMatchObject({
        category: "dexterity",
        created_at: expect.any(String),
        designer: "Malto",
        owner: "dav3rid",
        review_body: "This is the body of the new review",
        review_id: 14,
        review_img_url:
          "https://assets.dicebreaker.com/lords-of-waterdeep-board-game-layout.jpg/BROK/resize/1920x1920%3E/format/jpg/quality/80/lords-of-waterdeep-board-game-layout.jpg",
        title: "New review",
        votes: 0,
      });

      const { rows } = await db.query(
        `SELECT * FROM reviews WHERE title = 'New review'`
      );

      expect(rows).toHaveLength(1);
    });
    it("201: Adds a review to the database if passed a body with a missing review_img_url and returns with the placeholder image", async () => {
      const { body } = await request(app)
        .post("/api/reviews")

        .send({
          title: "New review",
          review_body: "This is the body of the new review",
          designer: "Malto",
          category: "dexterity",
          owner: "dav3rid",
        })
        .expect(201);

      expect(body.review.review_img_url).toBe(
        "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg"
      );
    });
    it("400: Returns an error if the body is missing a key ", async () => {
      const { body } = await request(app)
        .post("/api/reviews")

        .send({
          title: "New review",
          review_body: "This is the body of the new review",
          owner: "dav3rid",
        })
        .expect(400);
      expect(body.error.message).toBe("Invalid body");
    });
    it("400: Returns an error if passed an invalid category", async () => {
      const { body } = await request(app)
        .post("/api/reviews")

        .send({
          title: "New review",
          review_body: "This is the body of the new review",
          designer: "Malto",
          category: "not_a_category",
          owner: "dav3rid",
        })
        .expect(400);

      expect(body.message).toBe("Invalid category");
    });
    it("404: Returns an error if passed an invalid user", async () => {
      const { body } = await request(app)
        .post("/api/reviews")

        .send({
          title: "New review",
          review_body: "This is the body of the new review",
          designer: "Malto",
          category: "dexterity",
          owner: "not_a_user",
        })
        .expect(404);

      expect(body.error.message).toBe("Non-existent user");
    });
  });
});

describe("/api/reviews/:review_id", () => {
  describe("GET", () => {
    it("200: Responds with a single review including comment count and likes keys.", async () => {
      const { body } = await request(app)
        .get("/api/reviews/1")

        .expect(200);
      expect(body.review).toMatchObject({
        review_id: expect.any(Number),
        title: expect.any(String),
        review_body: expect.any(String),
        designer: expect.any(String),
        review_img_url: expect.any(String),
        votes: expect.any(Number),
        category: expect.any(String),
        owner: expect.any(String),
        created_at: expect.any(String),
        comment_count: expect.any(Number),
        likes: expect.any(Number),
      });
    });
    it("400: Responds with an error if passed an id that isn't an integer", async () => {
      const { body } = await request(app)
        .get("/api/reviews/not_a_number")

        .expect(400);

      expect(body.error.message).toBe("Bad request");
    });
    it("404: Responds with an error if passed the ID that doesn't relate to a review", async () => {
      const { body } = await request(app)
        .get("/api/reviews/23983")

        .expect(404);

      expect(body.error.message).toBe("Non-existent review");
    });
  });
  describe("PATCH", () => {
    it("200: Responds with the updated review object", async () => {
      const { body: increase } = await request(app)
        .patch("/api/reviews/2")

        .send({ inc_votes: 1 })
        .expect(200);

      expect(increase.review.votes).toBe(6);

      const { body: decrease } = await request(app)
        .patch("/api/reviews/2")

        .send({ inc_votes: -5 })
        .expect(200);

      expect(decrease.review.votes).toBe(1);
    });
    it("400: Responds with an error if passed an id that isn't an integer", async () => {
      const { body } = await request(app)
        .patch("/api/reviews/not_an_integer")

        .send({ inc_votes: 1 })
        .expect(400);

      expect(body.error.message).toBe("Bad request");
    });
    it("400: Responds with an error if passed an invalid body", async () => {
      const {
        body: { error },
      } = await request(app)
        .patch("/api/reviews/3")

        .send({ incorrect_body: 1 })
        .expect(400);

      expect(error.message).toBe("Invalid body");

      const {
        body: { incorrectValue = error },
      } = await request(app)
        .patch("/api/reviews/3")

        .send({ inc_votes: "incorrect value" })
        .expect(400);

      expect(incorrectValue.message).toBe("Invalid body");

      const {
        body: { extraKey = error },
      } = await request(app)
        .patch("/api/reviews/3")

        .send({ inc_votes: 1, surplus_key: "this is an extra key" })
        .expect(400);

      expect(extraKey.message).toBe("Invalid body");
    });
    it("404: Responds with an error if passed an id that doesn't relate to a review", async () => {
      const { body } = await request(app)
        .patch("/api/reviews/923897")

        .send({ inc_votes: 1 })
        .expect(404);

      expect(body.error.message).toBe("Non-existent review");
    });
  });
  describe("DEL", () => {
    it("204: deletes a review from the database", async () => {
      await request(app)
        .del("/api/reviews/2")

        .expect(204);

      const { rows } = await db.query(
        `SELECT * FROM reviews WHERE review_id = 2`
      );

      expect(rows).toHaveLength(0);
    });
    it("400: Responds with an error if passed a non-integer as the id", async () => {
      const { body } = await request(app)
        .del("/api/reviews/not_a_number")

        .expect(400);

      expect(body.error.message).toBe("Bad request");
    });
  });
});

describe("/api/reviews/:review_id/edit", () => {
  describe("PATCH", () => {
    it("200: Edits a review based upon ID, returns that review ", async () => {
      const { body } = await request(app)
        .patch("/api/reviews/2/edit")

        .send({ body: "This review has been updated" })
        .expect(200);

      expect(body.review.review_body).toEqual("This review has been updated");
    });
    it("400: Responds with an error if passed an ID that isn't an integer", async () => {
      const { body } = await request(app)
        .patch("/api/reviews/not_an_integer/edit")

        .send({ body: "This review has been updated" })
        .expect(400);

      expect(body.error.message).toBe("Bad request");
    });
    it("400: Responds with an error if passed an invalid review object", async () => {
      const { body } = await request(app)
        .patch("/api/reviews/3/edit")

        .send({ "invalid name": "This review has been updated" })
        .expect(400);

      expect(body.error.message).toBe("Invalid body");
      const invalidValue = await request(app)
        .patch("/api/reviews/3/edit")

        .send({ body: 122 })
        .expect(400);

      expect(invalidValue.body.error.message).toBe("Invalid body");

      const surplusKeys = await request(app)
        .patch("/api/reviews/3/edit")

        .send({ extra_key: "Surplus key", body: "test" })
        .expect(400);

      expect(surplusKeys.body.error.message).toBe("Invalid body");
    });
    it("404: Responds with an error if passed an id that doesn't relate to a review", async () => {
      const { body } = await request(app)
        .patch("/api/reviews/23455/edit")

        .send({ body: "This review has been updated" })
        .expect(404);

      expect(body.error.message).toBe("Non-existent review");
    });
  });
});

describe("/api/reviews/:review_id/comments", () => {
  describe("GET", () => {
    it("200: Returns an array of comments for a specific review", async () => {
      const { body } = await request(app)
        .get("/api/reviews/2/comments")

        .expect(200);

      expect(body.comments[0]).toMatchObject({
        comment_id: expect.any(Number),
        author: expect.any(String),
        review_id: expect.any(Number),
        title: expect.any(String),
        votes: expect.any(Number),
        created_at: expect.any(String),
        body: expect.any(String),
      });

      expect(body.comments).toHaveLength(3);
      expect(body.count).toBe(3);
    });
    it("200: Returns an empty array if passed an id that exists but is related to no comments", async () => {
      const { body } = await request(app)
        .get("/api/reviews/4/comments")

        .expect(200);

      expect(body.comments).toHaveLength(0);
    });
    it("200: Works with pagination", async () => {
      const { body } = await request(app)
        .get("/api/reviews/2/comments?limit=2")

        .expect(200);

      expect(body.comments).toHaveLength(2);

      const res = await request(app)
        .get("/api/reviews/2/comments?limit=2&p=2")

        .expect(200);

      expect(res.body.comments).toHaveLength(1);
      expect(res.body.comments[0].comment_id).toBe(4);
    });
    it("400: Returns an error when passed a non-integer review_id", async () => {
      const { body } = await request(app)
        .get("/api/reviews/not_an_integer/comments")

        .expect(400);

      expect(body.error.message).toBe("Bad request");
    });
    it("404: Returns an error if passed the id of a non-existent review", async () => {
      const { body } = await request(app)
        .get("/api/reviews/12747/comments")

        .expect(404);

      expect(body.error.message).toBe("Non-existent review");
    });
  });
  describe("POST", () => {
    it("201: Adds a comment to the database when passed a valid ID", async () => {
      const { body } = await request(app)
        .post("/api/reviews/4/comments")

        .send({
          username: "philippaclaire9",
          body: "This seems to be the first review for this!",
        })
        .expect(201);

      expect(body.comment).toEqual({
        comment_id: 7,
        author: "philippaclaire9",
        review_id: 4,
        votes: 0,
        created_at: expect.any(String),
        body: "This seems to be the first review for this!",
      });
    });
    it("201: Adds comment and ignores surplus properties", async () => {
      const { body } = await request(app)
        .post("/api/reviews/4/comments")

        .send({
          username: "philippaclaire9",
          extra_key: "I should just be ignored",
          body: "This seems to be the second comment for this!",
          another: "This should also be ignored",
        })
        .expect(201);

      expect(body.comment).toEqual({
        comment_id: 7,
        author: "philippaclaire9",
        review_id: 4,
        votes: 0,
        created_at: expect.any(String),
        body: "This seems to be the second comment for this!",
      });
    });
    it("400: Returns an error when passed a non-integer review_id", async () => {
      await request(app)
        .post("/api/reviews/not_an_integer/comments")

        .send({
          username: "philippaclaire9",
          body: "This seems to be the first review for this!",
        })
        .expect(400);
    });
    it("404: Returns an error if passed the id of a non-existent review", async () => {
      const { body } = await request(app)
        .post("/api/reviews/12747/comments")

        .send({
          username: "philippaclaire9",
          body: "Now there's a ton of reviews!",
        })
        .expect(404);

      expect(body.error.message).toBe("Non-existent review");
    });
    it("400: Returns an error if the body is missing a key", async () => {
      const { body } = await request(app)
        .post("/api/reviews/3/comments")

        .send({
          username: "philippaclaire9",
        })
        .expect(400);

      expect(body.error.message).toBe("Invalid body");
    });
  });
});

describe("/api/reviews/:review_id/likes", () => {
  describe("GET", () => {
    it("200: Responds with a full list of users who have liked the related review with the keys username and avatar url", async () => {
      const { body } = await request(app)
        .get("/api/reviews/11/likes")

        .expect(200);

      expect(body.users).toHaveLength(2);

      body.users.forEach((user) => {
        expect(user).toMatchObject({
          username: expect.any(String),
          avatar_url: expect.any(String),
        });
      });
    });
    it("200: Responds with an empty array if passed a review id that exists but has no likes", async () => {
      const { body } = await request(app)
        .get("/api/reviews/3/likes")

        .expect(200);

      expect(body.users).toHaveLength(0);
    });
    it("200: Works with pagination", async () => {
      const { body } = await request(app)
        .get("/api/reviews/11/likes?limit=1")

        .expect(200);

      expect(body.users).toHaveLength(1);
    });
    it("400: Responds with an error if passed a non-integer as an id", async () => {
      const { body } = await request(app)
        .get("/api/reviews/not_a_number/likes")

        .expect(400);

      expect(body.error.message).toBe("Bad request");
    });
    it("400: Returns an error if passed a non-integer to limit or p", async () => {
      const { body } = await request(app)
        .get("/api/reviews/11/likes?limit=not_an_integer")

        .expect(400);

      expect(body.error.message).toBe("Invalid query");
      const res = await request(app)
        .get("/api/reviews/11/likes?limit=1&p=not_an_integer")

        .expect(400);

      expect(res.body.error.message).toBe("Invalid query");
    });
    it("404: Responds with an error if passed the id of a review that doesn't exist", async () => {
      const { body } = await request(app)
        .get("/api/reviews/2343434/likes")

        .expect(404);

      expect(body.error.message).toBe("Non-existent review");
    });
  });
  describe("PATCH", () => {
    it("201: When passed a user as the body on an unliked review adds a like. Returns the updated result.", async () => {
      const { body } = await request(app)
        .patch("/api/reviews/3/likes")
        .send({ username: "philippaclaire9" })
        .expect(201);

      expect(body.like).toMatchObject({
        rl_p_key: 5,
        username: "philippaclaire9",
        review_id: 3,
        liked_at: expect.any(String),
      });
    });
    it("201: When passed a user who has previously liked a review, removes the like", async () => {
      await request(app)
        .patch("/api/reviews/11/likes")
        .send({ username: "bainesface" })
        .expect(201);

      const { rows } = await db.query(
        `SELECT * FROM review_likes WHERE username = 'bainesface' AND review_id = 11`
      );

      expect(rows).toHaveLength(0);
    });
    it("400: Returns an error if passed an invalid body", async () => {
      const { body } = await request(app)
        .patch("/api/reviews/3/likes")
        .send({ not: "philippaclaire9" })
        .expect(400);

      expect(body.error.message).toBe("Invalid body");
    });
    it("400: Returns an error if passed a non-integer review id", async () => {
      const { body } = await request(app)
        .patch("/api/reviews/not_a_number/likes")
        .send({ username: "bainesface" })
        .expect(400);

      expect(body.error.message).toBe("Bad request");
    });
    it("404: Returns an error if passed the id of a non-existent review", async () => {
      const { body } = await request(app)
        .patch("/api/reviews/2344343/likes")
        .send({ username: "philippaclaire9" })
        .expect(404);

      expect(body.error.message).toBe("Non-existent review");
    });
    it("404: Returns an error if passed an invalid user in the body", async () => {
      const { body } = await request(app)
        .patch("/api/reviews/2/likes")
        .send({ username: "Not_a_user" })
        .expect(404);

      expect(body.error.message).toBe("Non-existent user");
    });
  });
});

describe("/api/comments/:comment_id", () => {
  describe("DEL", () => {
    it("204: Deletes a comment from the database", async () => {
      await request(app)
        .del("/api/comments/3")

        .expect(204);
      const { rows } = await db.query(
        "SELECT * FROM comments WHERE comment_id = 3"
      );
      expect(rows).toHaveLength(0);
    });
    it("400: Returns an error if passed an invalid ID", async () => {
      const { body } = await request(app)
        .del("/api/comments/not_an_integer")

        .expect(400);
      expect(body.error.message).toBe("Bad request");
    });
    it("404: Returns an error if passed an id that doesn't relate to a comment", async () => {
      const { body } = await request(app)
        .del("/api/comments/294747")

        .expect(404);

      expect(body.error.message).toBe("Non-existent comment");
    });
  });
  describe("PATCH", () => {
    it("200: Updates and responds with the updated comment object", async () => {
      const { body } = await request(app)
        .patch("/api/comments/3")

        .send({ inc_votes: 1 })
        .expect(200);

      expect(body.comment.votes).toBe(11);
    });
    it("400: Responds with an error if passed an id that isn't an integer", async () => {
      const { body } = await request(app)
        .patch("/api/comments/not_an_id")

        .send({ inc_votes: 1 })
        .expect(400);

      expect(body.error.message).toBe("Bad request");
    });
    it("400: Responds with an error if passed an invalid body", async () => {
      const {
        body: { error },
      } = await request(app)
        .patch("/api/comments/3")

        .send({ incorrect_body: 1 })
        .expect(400);
      expect(error.message).toBe("Invalid body");

      const {
        body: { invalidType = error },
      } = await request(app)
        .patch("/api/comments/3")

        .send({ inc_votes: "not an integer" })
        .expect(400);

      expect(invalidType.message).toBe("Invalid body");

      const {
        body: { surplusKey = error },
      } = await request(app)
        .patch("/api/comments/3")

        .send({ first_extra_key: "", inc_votes: 2, another_extra_key: "" })
        .expect(400);

      expect(surplusKey.message).toBe("Invalid body");
    });
    it("404: Responds with an error if passed an id that doesn't relate to a comment", async () => {
      const { body } = await request(app)
        .patch("/api/comments/2034847")

        .send({ inc_votes: 1 })
        .expect(404);

      expect(body.error.message).toBe("Non-existent comment");
    });
  });
});

describe("/api/comments/:comment_id/edit", () => {
  it("200: Edits a comment based upon ID, returns that comment", async () => {
    const { body } = await request(app)
      .patch("/api/comments/2/edit")
      .send({ body: "This comment has been updated" })
      .expect(200);

    expect(body.comment.body).toEqual("This comment has been updated");
  });
  it("400: Responds with an error if passed an id that isn't an integer", async () => {
    const { body } = await request(app)
      .patch("/api/comments/not_an_id/edit")
      .send({ body: "This comment has been updated" })
      .expect(400);

    expect(body.error.message).toBe("Bad request");
  });
  it("400: Responds with an error if given an invalid body", async () => {
    const { body } = await request(app)
      .patch("/api/comments/3/edit")
      .send({ invalid_key_name: "This comment has been updated" })
      .expect(400);

    expect(body.error.message).toBe("Invalid body");

    const incorrectValue = await request(app)
      .patch("/api/comments/4/edit")

      .send({ body: {} })
      .expect(400);

    expect(incorrectValue.body.error.message).toBe("Invalid body");

    const surplusKeys = await request(app)
      .patch("/api/comments/3/edit")

      .send({ body: "this is allowed", surplus: "key" })
      .expect(400);

    expect(surplusKeys.body.error.message).toBe("Invalid body");
  });
  it("404: Responds with an error if passed a comment id that doesn't relate to a comment", async () => {
    const { body } = await request(app)
      .patch("/api/comments/1232342/edit")

      .send({ body: "This commend has been updated" })
      .expect(404);

    expect(body.error.message).toBe("Non-existent comment");
  });
});

describe("/api/users", () => {
  describe("GET", () => {
    it("200: Returns an array with a full list of users in order of creation.", async () => {
      const { body } = await request(app).get("/api/users").expect(200);

      expect(body.users).toHaveLength(4);
      expect(body.count).toBe("4");
      expect(body.users[0].username).toBe("philippaclaire9");
    });
    it("200: Works with a search query", async () => {
      const { body } = await request(app)
        .get("/api/users?search=alli")
        .expect(200);

      expect(body.users).toHaveLength(1);
      expect(body.count).toBe("1");
    });
    it("200: Works with asc/desc queries", async () => {
      const { body } = await request(app)
        .get("/api/users?order=asc")
        .expect(200);

      expect(body.users).toHaveLength(4);
      expect(body.users[0].username).toBe("bainesface");
    });
    it("200: Works with pagination", async () => {
      const { body } = await request(app)
        .get("/api/users?limit=2&p=2")

        .expect(200);

      expect(body.users).toHaveLength(2);
    });
    it("400: Returns an error if passed an invalid order query value", async () => {
      await request(app).get("/api/users?order=incorrect-query").expect(400);
    });
    it("400: Returns an error if passed a non-integer to limit or p", async () => {
      const { body } = await request(app)
        .get("/api/users?limit=not_a_number")

        .expect(400);
      expect(body.error.message).toBe("Invalid query");
    });
  });
  describe("POST", () => {
    it("200: Adds a user to the database, returns the newly created user", async () => {
      const { body } = await request(app)
        .post("/api/users")

        .send({
          username: "test_user",
          avatar_url: "http://image.com/image",
          name: "test_name",
        })
        .expect(201);

      expect(body.user).toMatchObject({
        username: "test_user",
        avatar_url: "http://image.com/image",
        name: "test_name",

        created: expect.any(String),
      });

      const { rows } = await db.query(
        "SELECT * FROM users WHERE username = 'test_user'"
      );

      expect(rows).toHaveLength(1);
    });
    it("200: Ignores surplus keys", async () => {
      const { body } = await request(app)
        .post("/api/users")

        .send({
          username: "test_user",
          avatar_url: "http://image.com/image",
          name: "test_name",
          surplus_keys: "Ignores me",
        })
        .expect(201);

      expect(body.user).toEqual({
        username: "test_user",
        avatar_url: "http://image.com/image",
        name: "test_name",

        created: expect.any(String),
      });
    });
    it("200: Ignores missing avatar or name key", async () => {
      const { body } = await request(app)
        .post("/api/users")
        .send({
          username: "test_user",
          name: "test_name",
        })
        .expect(201);

      expect(body.user).toEqual({
        username: "test_user",
        avatar_url:
          "https://media.istockphoto.com/vectors/default-placeholder-profile-icon-vector-id666545148?k=6&m=666545148&s=170667a&w=0&h=ycJvJHz6ZMWsErum0XpjVabgZsP8dib2feSIJ5dIWYk=",
        name: "test_name",

        created: expect.any(String),
      });

      const response = await request(app)
        .post("/api/users")

        .send({
          username: "test_user2",
        })
        .expect(201);

      expect(response.body.user).toEqual({
        username: "test_user2",
        avatar_url:
          "https://media.istockphoto.com/vectors/default-placeholder-profile-icon-vector-id666545148?k=6&m=666545148&s=170667a&w=0&h=ycJvJHz6ZMWsErum0XpjVabgZsP8dib2feSIJ5dIWYk=",
        name: "Anon",

        created: expect.any(String),
      });
    });
    it("400: Returns an error if the body is incorrect", async () => {
      const { body } = await request(app)
        .post("/api/users")

        .send({
          incorrect_body: "test_user",
          avatar_url: "http://image.com/image",
          name: "test_name",
        })
        .expect(400);
      expect(body.error.message).toBe("Invalid body");

      const invalidType = await request(app)
        .post("/api/users")

        .send({
          username: "test_user",
          avatar_url: 12,
          name: "test_name",
        })
        .expect(400);

      expect(invalidType.body.error.message).toBe("Invalid body");
    });
    it("400: Returns an error if the username already exists", async () => {
      const { body } = await request(app)
        .post("/api/users")

        .send({
          username: "mallionaire",
          avatar_url: "http://image.com/image",
          name: "test_name",
        })
        .expect(400);

      expect(body.message).toBe("Username already exists");
    });
  });
});

describe("/api/users/:username", () => {
  describe("GET", () => {
    it("200: Responds with a single user object", async () => {
      const { body } = await request(app)
        .get("/api/users/mallionaire")

        .expect(200);
      expect(body.user).toEqual({
        username: "mallionaire",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        name: "haz",

        likes: 1,
        comments: 2,
        reviews: 11,
        created: expect.any(String),
      });
    });
    it("404: Responds with an error if username doesn't relate to a user", async () => {
      const { body } = await request(app)
        .get("/api/users/not_a_user")

        .expect(404);
      expect(body.error.message).toBe("Non-existent user");
    });
  });
  describe("PATCH", () => {
    it("201: Updates the user when passed the correct params", async () => {
      const { body } = await request(app)
        .patch("/api/users/bainesface")

        .expect(201)
        .send({
          avatar_url: "http://image.com/new_url",

          name: "name_change",
        });

      expect(body.user[0]).toMatchObject({
        username: "bainesface",
        avatar_url: "http://image.com/new_url",
        name: "name_change",
      });
    });
    it("400: Returns an error if passed an invalid body", async () => {
      const { body } = await request(app)
        .patch("/api/users/bainesface")

        .expect(400)
        .send({
          avatar_url_incorrect: "http://image.com/new_url",

          name: "name_change",
        });

      expect(body.error.message).toBe("Invalid body");
    });
    it("404: Returns an error if passed an invalid username", async () => {
      await request(app)
        .patch("/api/users/not_a_username")

        .expect(404)
        .send({
          avatar_url: "http://image.com/new_url",
          name: "name_change",
        });
    });
  });
  describe("DELETE", () => {
    it("204: Deletes the specified user from the database ", async () => {
      await request(app)
        .del("/api/users/bainesface")

        .expect(204);
      const { rows } = await db.query(
        `SELECT * FROM users WHERE username = 'bainesface'`
      );
      expect(rows).toHaveLength(0);
    });
  });
});

describe("/api/users/:username/likes", () => {
  describe("GET", () => {
    it("200: Returns a list of all the reviews that have been liked by the specified user", async () => {
      const { body } = await request(app)
        .get("/api/users/bainesface/likes")

        .expect(200);

      expect(body.reviews[0].review_id).toBe(2);
      expect(body.reviews[1].review_id).toBe(11);
      expect(body.count).toBe(2);
    });
    it("200: Returns an empty array if user does exist but has no related likes", async () => {
      const { body } = await request(app)
        .get("/api/users/dav3rid/likes")

        .expect(200);

      expect(body.reviews).toHaveLength(0);
    });
    it("200: Works with pagination", async () => {
      const { body } = await request(app)
        .get("/api/users/bainesface/likes?limit=1&p=2")

        .expect(200);

      expect(body.reviews).toHaveLength(1);
    });
    it("400: Returns an error if passed a non-integer limit or p", async () => {
      const { body } = await request(app)
        .get("/api/users/bainesface/likes?limit=not_an_integer")
        .expect(400);

      expect(body.error.message).toBe("Invalid query");
      const res = await request(app)
        .get("/api/users/bainesface/likes?limit=1&p=not_an_integer")
        .expect(400);

      expect(res.body.error.message).toBe("Invalid query");
    });
    it("400: Returns an error if passed an invalid order query", async () => {
      await request(app)
        .get("/api/users/bainesface/likes?order=invalid_query")
        .expect(400);
    });
    it("404: Responds with an error if the username doesn't relate to a user", async () => {
      const { body } = await request(app)
        .get("/api/users/not_a_user/likes")

        .expect(404);

      expect(body.error.message).toBe("Non-existent user");
    });
  });
});

describe("/api/users/:username/likes/:review_id", () => {
  describe("GET", () => {
    it("200: Returns an object containing a boolean depending on if a user has liked a comment.", async () => {
      const { body: truthy } = await request(app)
        .get("/api/users/bainesface/likes/11")
        .expect(200);

      expect(truthy.liked).toBeTruthy();

      const { body: falsy } = await request(app)
        .get("/api/users/bainesface/likes/1")
        .expect(200);

      expect(falsy.liked).toBeFalsy();
    });
    it("404: Returns an error if passed a non-existent user", async () => {
      await request(app).get("/api/users/not_a_user/likes/22").expect(404);
    });
    it("404: Returns an error if passed an id that doesn't relate to a review", async () => {
      await request(app).get("/api/users/bainesface/likes/23938").expect(404);
    });
    it("400: Returns an error if passed a non-numeric review_id", async () => {
      await request(app)
        .get("/api/users/bainesface/likes/not_a_number")
        .expect(400);
    });
  });
});

describe("/api/users/:username/comments", () => {
  it("200: Returns a list of all comments made by a specific user", async () => {
    const { body } = await request(app)
      .get("/api/users/bainesface/comments")
      .expect(200);

    expect(body.comments).toHaveLength(2);
    expect(body.count).toBe(2);
  });
  it("200: Returns an empty array if user does exist but has no related comments", async () => {
    const { body } = await request(app)
      .get("/api/users/dav3rid/comments")
      .expect(200);

    expect(body.comments).toEqual([]);
  });
  it("200: Works with pagination", async () => {
    const { body } = await request(app)
      .get("/api/users/bainesface/comments?limit=1&p=2")
      .expect(200);

    expect(body.comments).toHaveLength(1);
    expect(body.comments[0].comment_id).toBe(4);
  });
  it("400: Returns an error if passed a non-integer limit or p", async () => {
    await request(app)
      .get("/api/users/bainesface/comments?limit=not_an_integer&p=2")
      .expect(400);
  });
  it("404: Returns an error if passed a non-existent user", async () => {
    await request(app).get("/api/users/not_a_user/comments").expect(404);
  });
});
