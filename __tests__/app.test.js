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

describe('Categories', () => {
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
});

describe('Reviews', () => {
    describe('GET /api/reviews/:id', () => {
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
    });
    describe('PATCH /api/reviews/:id', () => {
        it('200: Updates the votes and returns the updated item', () => {
            return request(app)
                .patch('/api/reviews/2')
                .expect(200)
                .send({ inc_votes: 5 })
                .then((response) => {
                    expect(response.body.updated_review).toMatchObject({
                        review_id: expect.any(Number),
                        title: expect.any(String),
                        review_body: expect.any(String),
                        designer: expect.any(String),
                        review_img_url: expect.any(String),
                        votes: expect.any(Number),
                        category: expect.any(String),
                        owner: expect.any(String),
                        created_at: expect.any(String),
                    });
                    expect(response.body.updated_review.votes).toBe(10);
                });
        });
        it('200: Update also works with negative numbers', () => {
            return request(app)
                .patch('/api/reviews/2')
                .expect(200)
                .send({ inc_votes: -20 })
                .then((response) => {
                    expect(response.body.updated_review.votes).toBe(-15);
                });
        });
        it("400: When the id does'nt end with a number, returns an error.", () => {
            return request(app)
                .patch('/api/reviews/invalid_id')
                .expect(400)
                .then((response) => {
                    expect(response.body.error).toEqual({
                        status: 400,
                        endpoint: '/api/reviews/:id',
                        error: 'id must be a number',
                    });
                });
        });
        it('400: When passed an incorrect object in the body - returns an error', () => {
            return request(app)
                .patch('/api/reviews/2')
                .expect(400)
                .send({ bad_key: 'not a number' })
                .then((response) => {
                    expect(response.body.error).toEqual({
                        status: 400,
                        endpoint: '/api/reviews/:id',
                        error: 'format to { inc_votes : number }',
                    });
                });
        });
    });
    describe('GET /api/reviews?queries=', () => {
        it('200: When passed with no queries, returns the full list of reviews with the correct keys', () => {
            return request(app)
                .get('/api/reviews')
                .expect(200)
                .then((response) => {
                    response.body.reviews.forEach((review) => {
                        expect(review).toMatchObject({
                            owner: expect.any(String),
                            title: expect.any(String),
                            review_id: expect.any(Number),
                            category: expect.any(String),
                            review_img_url: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            amount_of_comments: expect.any(String),
                        });
                    });
                });
        });
        it('200: When passed with ASC/DESC query - correctly orders the reviews by id', () => {
            return request(app)
                .get('/api/reviews?order=asc')
                .expect(200)
                .then((response) => {
                    const order = response.body.reviews.map(
                        (review) => review.review_id
                    );
                    const ascOrder = [...order].sort((x, y) => x - y);
                    expect(order).toEqual(ascOrder);
                });
        });
        it('200: When passed with a category query - correctly returns filtered by that category', () => {
            return request(app)
                .get('/api/reviews?category=social_deduction')
                .expect(200)
                .then((response) => {
                    const all_check = response.body.reviews.every(
                        (review) => review.category === 'social deduction'
                    );
                    expect(all_check).toBe(true);
                });
        });
        it("200: When passed a category that does'nt exist, returns an empty array", () => {
            return request(app)
                .get('/api/reviews?not_a_category=me_neither')
                .expect(400);
        });
    });
});
