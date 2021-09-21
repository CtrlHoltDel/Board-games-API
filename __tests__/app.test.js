const db = require('../db/connection.js');
const app = require('../app.js');
const request = require('supertest');

const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('Missing path', () => {
    it("404: When given a path that doesn't exist, returns an error.", async () => {
        const res = await request(app).get('/broken_link').expect(404);
        expect(res.body.error).toBe('route not found');
    });
});

describe('Categories', () => {
    describe('/api/categories', () => {
        it('200: Returns a list of all categories containing both the "slug" and "description" key', async () => {
            const res = await request(app).get('/api/categories').expect(200);
            expect(res.body.categories).toHaveLength(4);
            res.body.categories.forEach((category) => {
                expect(category).toMatchObject({
                    description: expect.any(String),
                    slug: expect.any(String),
                });
            });
        });
    });
});

describe('Reviews', () => {
    describe('GET /api/reviews/:id', () => {
        it('200: Returns a review object with the correct properties', async () => {
            const res = await request(app).get('/api/reviews/2').expect(200);
            expect(res.body.review).toMatchObject({
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
        it("400: When the parametric endpoint isn't a number - returns an error", async () => {
            const res = await request(app)
                .get('/api/reviews/not_a_number')
                .expect(400);
            expect(res.body.error).toEqual({
                status: 400,
                endpoint: '/api/reviews/:id',
                error: 'id must be a number',
            });
        });
    });
    describe('PATCH /api/reviews/:id', () => {
        it('200: Updates the votes and returns the updated item', async () => {
            const res = await request(app)
                .patch('/api/reviews/2')
                .expect(200)
                .send({ inc_votes: 5 });
            expect(res.body.updated_review).toMatchObject({
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
            expect(res.body.updated_review.votes).toBe(10);
        });
        it('200: Update also works with negative numbers', async () => {
            const res = await request(app)
                .patch('/api/reviews/2')
                .expect(200)
                .send({ inc_votes: -20 });

            expect(res.body.updated_review.votes).toBe(-15);
        });
        it("400: When the id does'nt end with a number, returns an error.", async () => {
            const res = await request(app)
                .patch('/api/reviews/invalid_id')
                .expect(400);

            expect(res.body.error).toEqual({
                status: 400,
                endpoint: '/api/reviews/:id',
                error: 'id must be a number',
            });
        });
        it('400: When passed an incorrect object in the body - returns an error', async () => {
            const res = await request(app)
                .patch('/api/reviews/2')
                .expect(400)
                .send({ bad_key: 'not a number' });

            expect(res.body.error).toEqual({
                status: 400,
                endpoint: '/api/reviews/:id',
                error: 'format to { inc_votes : number }',
            });
        });
    });
    describe('GET /api/reviews?queries=', () => {
        it('200: When passed with no queries, returns the full list of reviews with the correct keys', async () => {
            const res = await request(app).get('/api/reviews').expect(200);
            res.body.reviews.forEach((review) => {
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
        it('200: When passed with ASC/DESC order query - correctly orders the reviews by id', async () => {
            const resAsc = await request(app)
                .get('/api/reviews?order=asc')
                .expect(200);
            const asc = resAsc.body.reviews.map((review) => review.review_id);
            const ascOrder = [...asc].sort((x, y) => x - y);
            expect(asc).toEqual(ascOrder);

            const resDesc = await request(app)
                .get('/api/reviews?order=desc')
                .expect(200);
            const desc = resDesc.body.reviews.map((review) => review.review_id);
            const descOrder = [...desc].sort((x, y) => y - x);
            expect(desc).toEqual(descOrder);
        });
        it('200: When passed with a category query - correctly returns filtered by that category', async () => {
            const res = await request(app)
                .get('/api/reviews?category=social_deduction')
                .expect(200);

            const all_check = res.body.reviews.every(
                (review) => review.category === 'social deduction'
            );
            expect(all_check).toBe(true);
        });
        it('404: When passed a valid category but invalid query, returns an error', async () => {
            const res = await request(app)
                .get('/api/reviews?category=invalid_query')
                .expect(404);
            expect(res.body.error).toEqual({
                status: 404,
                endpoint: '/api/reviews?category=query',
                error: 'Invalid query',
            });
        });
        it("400: When passed a category that does'nt exist, returns an error", async () => {
            const res = await request(app)
                .get('/api/reviews?not_a_category=me_neither')
                .expect(400);
            expect(res.body.error).toMatchObject({
                endpoint: '/api/reviews?category=query',
                error: { valid_queries: ['sort_by', 'order', 'category'] },
                status: 400,
            });
        });
        // it('200: If passed an empty sort_by query, returns all the reviews sorted by date.', async () => {
        //     const res = await request(app)
        //         .get('/api/reviews?sort_by')
        //         .expect(200);
        // });
    });
});
