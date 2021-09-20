const db = require('../db/connection.js');
const app = require('../app.js');
const request = require('supertest');

const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('Missing path', () => {
    it("404: When given a path that doesn't exist, returns an error.", () => {
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

describe('/api/reviews/:id', () => {
    it("400: When the parametric endpoint isn't a number - returns an error", () => {
        return request(app)
            .get('/api/reviews/not_a_number')
            .expect(400)
            .then((response) => {
                expect(response.body.error).toEqual({
                    status: 400,
                    endpoint: '/api/reviews/:id',
                    error: 'id must be a number',
                });
            });
    });

    it('200: Returns a review object with the correct properties', () => {
        return request(app)
            .get('/api/reviews/2')
            .expect(200)
            .then((response) => {
                expect(response.body.review).toMatchObject({
                    title: expect.any(String),
                    review_id: expect.any(Number),
                    review_body: expect.any(String),
                    designer: expect.any(String),
                    review_img_url: expect.any(String),
                    category: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                });
            });
    });
});
