const db = require('../db/connection.js');
const app = require('../app.js');
const request = require('supertest');

const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('/', () => {
  describe('GET', () => {
    it('404: Responds with an error when an invalid path is requested', async () => {
      const { body } = await request(app).get('/invalid_link').expect(404);
      expect(body.error.message).toBe('Not found');
    });
  });
});

describe('/api', () => {
  describe('GET', () => {
    it('200: Responds with a JSON object containing information about all the endpoints', async () => {
      const { body } = await request(app).get('/api').expect(200);
      expect(body.endPoints).not.toBeUndefined();
    });
  });
});

describe('/api/categories', () => {
  describe('GET', () => {
    it('200: Responds with an array of category objects', async () => {
      const { body } = await request(app).get('/api/categories').expect(200);
      body.categories.forEach((category) => {
        expect(category).toMatchObject({
          slug: expect.any(String),
          description: expect.any(String),
        });
      });
    });
  });
});

describe('/api/reviews', () => {
  describe('GET', () => {
    describe('Allows sorting by multiple queries. ', () => {
      it('200: votes', async () => {
        const { body } = await request(app)
          .get('/api/reviews?sort_by=votes')
          .expect(200);

        expect(body.reviews[0].review_id).toBe(12);
      });
      it('200: category', async () => {
        const { body } = await request(app)
          .get('/api/reviews?sort_by=category')
          .expect(200);

        expect(body.reviews[0].review_id).toBe(11);
      });
      it('200: comment_count', async () => {
        const { body } = await request(app)
          .get('/api/reviews?sort_by=comment_count')
          .expect(200);

        expect(body.reviews[0].review_id).toBe(3);
        expect(body.reviews[1].review_id).toBe(2);
      });
    });
    it('200:Responds with an array of reviews including comment count and excluding the body defaulted to be ordered in in ascending order by date. Limits the results to a length of 10', async () => {
      const { body } = await request(app).get('/api/reviews').expect(200);

      body.reviews.forEach((review) => {
        expect(review).toMatchObject({
          review_id: expect.any(Number),
          comment_count: expect.any(Number),
          title: expect.any(String),
          review_body: expect.any(String),
          designer: expect.any(String),
          review_img_url: expect.any(String),
          votes: expect.any(Number),
          category: expect.any(String),
          owner: expect.any(String),
          created_at: expect.any(String),
        });
      });

      expect(body.reviews[0].review_id).toBe(7);
      expect(body.reviews[1].review_id).toBe(4);
      expect(body.reviews).toHaveLength(10);
    });
    it('200: Allows searching by specific category', async () => {
      const { body } = await request(app)
        .get('/api/reviews?category=euro_game')
        .expect(200);

      expect(body.reviews).toHaveLength(1);
    });
    it('200: Returns no error for a valid category that returns an empty array', async () => {
      const { body } = await request(app)
        .get('/api/reviews?category=childrens_games')
        .expect(200);

      expect(body.reviews).toHaveLength(0);
    });
    it('200: Accepts an order query in conjunction with other queries', async () => {
      const { body } = await request(app)
        .get('/api/reviews?sort_by=comment_count&order=asc')
        .expect(200);

      expect(body.reviews[0].review_id).toBe(4);
      expect(body.reviews[1].review_id).toBe(7);
    });
    it('200: Works with search queries - searches by title', async () => {
      const { body } = await request(app)
        .get('/api/reviews?search=person')
        .expect(200);

      expect(body.reviews[0].review_id).toBe(11);
    });
    it('200: Works with pagination', async () => {
      const { body } = await request(app)
        .get('/api/reviews?limit=5&p=2')
        .expect(200);

      expect(body.reviews).toHaveLength(5);
      expect(body.reviews[0].review_id).toBe(9);
    });
    it('400: Returns an error for invalid sort_by query', async () => {
      const {
        body: { error },
      } = await request(app)
        .get('/api/reviews?sort_by=invalid_sort_by')
        .expect(400);

      expect(error.message).toBe('Invalid query');
    });
    it('400: Returns an error for invalid order query value', async () => {
      const { body } = await request(app)
        .get('/api/reviews?sort_by=votes&order=not_order')
        .expect(400);

      expect(body.error.message).toBe('Invalid query');
    });
    it('404: Returns an error for non-existent query field', async () => {
      const { body } = await request(app)
        .get('/api/reviews?sort_by=votes&bad_field=12')
        .expect(404);

      expect(body.error.message).toBe('Bad request');
    });
    it('400: Returns an error if limit or page are passed an invalid query value', async () => {
      await request(app).get('/api/reviews?limit=not_a_number').expect(400);

      await request(app)
        .get('/api/reviews?limit=10&p=not_a_number')
        .expect(400);
    });
    it('400: Returns an error if limit or page are not a whole integer ', async () => {
      await request(app).get('/api/reviews?limit=1.25').expect(400);

      await request(app).get('/api/reviews?limit=2&p=1.3').expect(400);
    });
  });
});

describe('/api/reviews/:review_id', () => {
  describe('GET', () => {
    it('200: Responds with a single review including comment count and likes keys.', async () => {
      const { body } = await request(app).get('/api/reviews/1').expect(200);
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
        .get('/api/reviews/not_a_number')
        .expect(400);

      expect(body.error.message).toBe('Bad request');
    });
    it("404: Responds with an error if passed the ID that doesn't relate to a review", async () => {
      const { body } = await request(app).get('/api/reviews/23983').expect(404);

      expect(body.error.message).toBe('Non-existent review');
    });
  });
  describe('PATCH', () => {
    it('200: Responds with the updated review object', async () => {
      const { body: increase } = await request(app)
        .patch('/api/reviews/2')
        .send({ inc_votes: 1 })
        .expect(200);

      expect(increase.review.votes).toBe(6);

      const { body: decrease } = await request(app)
        .patch('/api/reviews/2')
        .send({ inc_votes: -5 })
        .expect(200);

      expect(decrease.review.votes).toBe(1);
    });
    it("400: Responds with an error if passed an id that isn't an integer", async () => {
      const { body } = await request(app)
        .patch('/api/reviews/not_an_integer')
        .send({ inc_votes: 1 })
        .expect(400);

      expect(body.error.message).toBe('Bad request');
    });
    it('400: Responds with an error if passed an invalid body', async () => {
      const {
        body: { error },
      } = await request(app)
        .patch('/api/reviews/3')
        .send({ incorrect_body: 1 })
        .expect(400);

      expect(error.message).toBe('Invalid body');

      const {
        body: { incorrectValue = error },
      } = await request(app)
        .patch('/api/reviews/3')
        .send({ inc_votes: 'incorrect value' })
        .expect(400);

      expect(incorrectValue.message).toBe('Invalid body');

      const {
        body: { extraKey = error },
      } = await request(app)
        .patch('/api/reviews/3')
        .send({ inc_votes: 1, surplus_key: 'this is an extra key' })
        .expect(400);

      expect(extraKey.message).toBe('Invalid body');
    });
    it("404: Responds with an error if passed an id that doesn't relate to a review", async () => {
      const { body } = await request(app)
        .patch('/api/reviews/923897')
        .send({ inc_votes: 1 })
        .expect(404);

      expect(body.error.message).toBe('Non-existent review');
    });
  });
});

describe('/api/reviews/:review_id/comments', () => {
  describe('GET', () => {
    it('200: Returns an array of comments for a specific review', async () => {
      const { body } = await request(app)
        .get('/api/reviews/2/comments')
        .expect(200);

      expect(body.comments).toHaveLength(3);
    });
    it('200: Returns an empty array if passed an id that exists but is related to no comments', async () => {
      const { body } = await request(app)
        .get('/api/reviews/4/comments')
        .expect(200);

      expect(body.comments).toHaveLength(0);
    });
    it('400: Returns an error when passed a non-integer review_id', async () => {
      const { body } = await request(app)
        .get('/api/reviews/not_an_integer/comments')
        .expect(400);

      expect(body.error.message).toBe('Bad request');
    });
    it('404: Returns an error if passed the id of a non-existent review', async () => {
      const { body } = await request(app)
        .get('/api/reviews/12747/comments')
        .expect(404);

      expect(body.error.message).toBe('Non existent review');
    });
  });
  describe('POST', () => {
    it('201: Adds a comment to the database when passed a valid ID', async () => {
      const { body } = await request(app)
        .post('/api/reviews/4/comments')
        .send({
          username: 'philippaclaire9',
          body: 'This seems to be the first review for this!',
        })
        .expect(201);

      expect(body.comment).toEqual({
        comment_id: 7,
        author: 'philippaclaire9',
        review_id: 4,
        votes: 0,
        created_at: expect.any(String),
        body: 'This seems to be the first review for this!',
      });
    });
    it('201: Adds comment and ignores surplus properties', async () => {
      const { body } = await request(app)
        .post('/api/reviews/4/comments')
        .send({
          username: 'philippaclaire9',
          extra_key: 'I should just be ignored',
          body: 'This seems to be the second comment for this!',
          another: 'This should also be ignored',
        })
        .expect(201);

      expect(body.comment).toEqual({
        comment_id: 7,
        author: 'philippaclaire9',
        review_id: 4,
        votes: 0,
        created_at: expect.any(String),
        body: 'This seems to be the second comment for this!',
      });
    });
    it('400: Returns an error when passed a non-integer review_id', async () => {
      await request(app)
        .post('/api/reviews/not_an_integer/comments')
        .send({
          username: 'philippaclaire9',
          body: 'This seems to be the first review for this!',
        })
        .expect(400);
    });
    it('404: Returns an error if passed the id of a non-existent review', async () => {
      const { body } = await request(app)
        .post('/api/reviews/12747/comments')
        .send({
          username: 'philippaclaire9',
          body: "Now there's a ton of reviews!",
        })
        .expect(404);

      expect(body.error.message).toBe('Non existent review');
    });
    it('400: Returns a 404 if the body is missing a property', async () => {
      const { body } = await request(app)
        .post('/api/reviews/3/comments')
        .send({
          username: 'philippaclaire9',
        })
        .expect(400);

      expect(body.error.message).toBe('Invalid body');
    });
  });
});

describe('/api/comments/:comment_id', () => {
  describe('DEL', () => {
    it('204: Deletes a comment from the database', async () => {
      await request(app).del('/api/comments/3').expect(204);
      const { rows } = await db.query(
        'SELECT * FROM comments WHERE comment_id = 3'
      );
      expect(rows).toHaveLength(0);
    });
    it('400: Returns an error if passed an invalid ID', async () => {
      const { body } = await request(app)
        .del('/api/comments/not_an_integer')
        .expect(400);
      expect(body.error.message).toBe('Bad request');
    });
    it("404: Returns an error if passed an id that doesn't relate to a comment", async () => {
      const { body } = await request(app)
        .del('/api/comments/294747')
        .expect(404);

      expect(body.error.message).toBe('Non-existent comment');
    });
  });
  describe('PATCH', () => {
    it('200: Updates and responds with the updated comment object', async () => {
      const { body } = await request(app)
        .patch('/api/comments/3')
        .send({ inc_votes: 1 })
        .expect(200);

      expect(body.comment.votes).toBe(11);
    });
    it("400: Responds with an error if passed an id that isn't an integer", async () => {
      const { body } = await request(app)
        .patch('/api/comments/not_an_id')
        .send({ inc_votes: 1 })
        .expect(400);

      expect(body.error.message).toBe('Bad request');
    });
    it('400: Responds with an error if passed an invalid body', async () => {
      const {
        body: { error },
      } = await request(app)
        .patch('/api/comments/3')
        .send({ incorrect_body: 1 })
        .expect(400);
      expect(error.message).toBe('Invalid body');

      const {
        body: { invalidType = error },
      } = await request(app)
        .patch('/api/comments/3')
        .send({ inc_votes: 'not an integer' })
        .expect(400);

      expect(invalidType.message).toBe('Invalid body');

      const {
        body: { surplusKey = error },
      } = await request(app)
        .patch('/api/comments/3')
        .send({ first_extra_key: '', inc_votes: 2, another_extra_key: '' })
        .expect(400);

      expect(surplusKey.message).toBe('Invalid body');
    });
    it("404: Responds with an error if passed an id that doesn't relate to a comment", async () => {
      const { body } = await request(app)
        .patch('/api/comments/2034847')
        .send({ inc_votes: 1 })
        .expect(404);

      expect(body.error.message).toBe('Non-existent comment');
    });
  });
});

describe('/api/users', () => {
  describe('GET', () => {
    it('200: Returns an array with a full list of users', async () => {
      const { body } = await request(app).get('/api/users').expect(200);
      expect(body.users).toHaveLength(4);
    });
  });
  describe('POST', () => {
    it('200: Adds a user to the database, returns the newly created user', async () => {
      const { body } = await request(app)
        .post('/api/users')
        .send({
          username: 'test_user',
          avatar_url: 'http://image.com/image',
          name: 'test_name',
          email: 'new_email@gmail.com',
        })
        .expect(201);

      expect(body.user).toEqual({
        username: 'test_user',
        avatar_url: 'http://image.com/image',
        name: 'test_name',
        email: 'new_email@gmail.com',
      });
    });
    it('400: Returns an error if the body is incorrect', async () => {
      const { body } = await request(app)
        .post('/api/users')
        .send({
          incorrect_body: 'test_user',
          avatar_url: 'http://image.com/image',
          name: 'test_name',
          email: 'new_email@gmail.com',
        })
        .expect(400);
      expect(body.error.message).toBe('Invalid body');

      const invalidType = await request(app)
        .post('/api/users')
        .send({
          username: 'test_user',
          avatar_url: 12,
          name: 'test_name',
          email: 'new_email@gmail.com',
        })
        .expect(400);

      expect(invalidType.body.error.message).toBe('Invalid body');

      const surplusKeys = await request(app)
        .post('/api/users')
        .send({
          username: 'test_user',
          avatar_url: 'http://google.com/image',
          extra_key: 'An extra key',
          name: 'test_name',
          email: 'new_email@gmail.com',
        })
        .expect(400);

      expect(surplusKeys.body.error.message).toBe('Invalid body');
    });
    it('400: Returns an error if the username or email already exists', async () => {
      const { body } = await request(app)
        .post('/api/users')
        .send({
          username: 'mallionaire',
          avatar_url: 'http://image.com/image',
          email: 'new_email@gmail.com',
          name: 'test_name',
        })
        .expect(400);

      expect(body.message).toBe('Username already exists');

      const result = await request(app).post('/api/users').send({
        username: 'new_user',
        avatar_url: 'http://image.com/image',
        email: '7not.foun@codb.site',
        name: 'test_name',
      });

      expect(result.body.message).toBe('Email already exists');
    });
  });
});

describe('/api/users/:username', () => {
  describe('GET', () => {
    it('200: Responds with a single user object', async () => {
      const { body } = await request(app)
        .get('/api/users/mallionaire')
        .expect(200);
      expect(body.user).toEqual({
        username: 'mallionaire',
        avatar_url:
          'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
        name: 'haz',
        email: '7not.foun@codb.site',
      });
    });
    it("404: Responds with an error if username doesn't relate to a user", async () => {
      const { body } = await request(app)
        .get('/api/users/not_a_user')
        .expect(404);
      expect(body.error.message).toBe('Non-existent user');
    });
  });
});
