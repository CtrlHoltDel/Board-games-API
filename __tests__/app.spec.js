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
      expect(error).toBe('Not found');
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
      console.log(review);
    });
    it("400: Responds with an error if passed an id that isn't an integer", async () => {});
  });
});
