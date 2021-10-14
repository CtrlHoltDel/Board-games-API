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
      const { body } = await request(app)
        .get('/api/reviews?sort_by=invalid_sort_by')
        .expect(400);

      expect(body.error.message).toBe('Invalid query');
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
    it('200: Responds with a object containing the single review including comment count and likes.', async () => {
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
    it("404: Responds with an error if passed the ID that doesn't relate toa  review", async () => {
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
  it('200: Returns an array of comments for a specific review', async () => {
    const { body } = await request(app)
      .get('/api/reviews/2/comments')
      .expect(200);

    expect(body.comments).toHaveLength(3);
  });
});
