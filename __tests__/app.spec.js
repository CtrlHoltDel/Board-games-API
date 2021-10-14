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
      const {
        body: { error },
      } = await request(app).get('/invalid_link').expect(404);
      expect(error.message).toBe('Not found');
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
      const {
        body: { categories },
      } = await request(app).get('/api/categories').expect(200);
      categories.forEach((category) => {
        expect(category).toMatchObject({
          slug: expect.any(String),
          description: expect.any(String),
        });
      });
    });
  });
});

describe('/api/reviews/:review_id', () => {
  describe('GET', () => {
    it('200: Responds with a object containing the single review including comment count and likes.', async () => {
      const {
        body: { review },
      } = await request(app).get('/api/reviews/1').expect(200);
      expect(review).toMatchObject({
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
      const {
        body: { error },
      } = await request(app).get('/api/reviews/not_a_number').expect(400);

      expect(error.message).toBe('Bad request');
    });
    it("404: Responds with an error if passed the ID that doesn't relate toa  review", async () => {
      const {
        body: { error },
      } = await request(app).get('/api/reviews/23983').expect(404);

      expect(error.message).toBe('Non-existent review');
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
      const {
        body: { error },
      } = await request(app)
        .patch('/api/reviews/not_an_integer')
        .send({ inc_votes: 1 })
        .expect(400);

      expect(error.message).toBe('Bad request');
    });
    it("404: Responds with an error if passed an id that doesn't relate to a review", async () => {
      const {
        body: { error },
      } = await request(app)
        .patch('/api/reviews/923897')
        .send({ inc_votes: 1 })
        .expect(404);

      expect(error.message).toBe('Non-existent review');
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
  });
});
