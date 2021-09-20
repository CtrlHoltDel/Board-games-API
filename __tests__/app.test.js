const db = require('../db/connection.js');
const app = require('../app.js');
const request = require('supertest');

const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('Missing path', () => {
    it("404: When given a path that doesn'nt exist, returns an error.", () => {
        return request(app)
            .get('/broken_link')
            .expect(404)
            .then((response) => {
                expect(response.body.error).toBe('route not found');
            });
    });
});

describe('/api/categories', () => {
    it('200: Returns a list of all categories containing both the "slug" and "description" key', () => {
        return request(app)
            .get('/api/categories')
            .expect(200)
            .then((response) => {
                expect(response.body.categories).toHaveLength(4);
                response.body.categories.forEach((category) => {
                    expect(category).toMatchObject({
                        description: expect.any(String),
                        slug: expect.any(String),
                    });
                });
            });
    });
});
