const db = require('../db/connection.js');
const app = require('../app.js');
const request = require('supertest');

const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('/', () => {
  describe('Invalid path', () => {
    it('404: Returns an error when an invalid path is requested', async () => {
      const { body } = await request(app).get('/invalid_link').expect(404);
    });
  });
});
