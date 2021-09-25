const db = require('../db/connection.js');
const app = require('../app.js');
const request = require('supertest');

const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const { endPoints } = require('../endpoints.js');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('Misc', () => {
    describe('Missing path', () => {
        it("404: When given a path that doesn't exist, returns an error.", async () => {
            const { body } = await request(app).get('/broken_link').expect(404);
            expect(body.error).toBe('route not found');
        });
    });
    describe('/api', () => {
        it('200: Returns an object containing information about current endpoints', async () => {
            const { body } = await request(app).get('/api').expect(200);
            expect(body.endPoints).toEqual(endPoints);
        });
    });
});

describe('Categories', () => {
    describe('/api/categories', () => {
        describe('GET', () => {
            it('200: Returns a list of all categories containing both the "slug" and "description" keys', async () => {
                const { body } = await request(app)
                    .get('/api/categories')
                    .expect(200);
                expect(body.categories).toHaveLength(4);

                body.categories.forEach((category) => {
                    expect(category).toMatchObject({
                        description: expect.any(String),
                        slug: expect.any(String),
                    });
                });
            });
        });
        describe('POST', () => {
            it('201: Returns the created category', async () => {
                const { body } = await request(app)
                    .post('/api/categories')
                    .expect(201)
                    .send({
                        slug: 'legit_category_name',
                        description: 'Description of the category',
                    });

                expect(body.category).toEqual({
                    slug: 'legit_category_name',
                    description: 'Description of the category',
                });

                const { rows } = await db.query(
                    "SELECT slug FROM categories WHERE slug = 'legit_category_name'"
                );

                expect(rows[0].slug).toBe('legit_category_name');
            });
            it('400: Returns an error if passed an invalid body', async () => {
                const expectedResult = {
                    status: expect.any(Number),
                    error: expect.any(String),
                    format: expect.any(String),
                };

                const res1 = await request(app)
                    .post('/api/categories')
                    .expect(400)
                    .send({
                        incorrect_key_name: 'legit_category_name',
                        incorrect_key_name: 'Description of the category',
                    });

                const res2 = await request(app)
                    .post('/api/categories')
                    .expect(400)
                    .send({
                        slug: 1,
                        description: ['not a', 'string'],
                    });

                expect(res1.body.error).toMatchObject(expectedResult);
                expect(res2.body.error).toMatchObject(expectedResult);
            });
        });
    });
});

describe('Reviews', () => {
    describe('/api/reviews', () => {
        describe('POST', () => {
            it('201: When passed a valid body, responds with the newly created review and inserts review', async () => {
                const { body } = await request(app)
                    .post('/api/reviews')
                    .expect(201)
                    .send({
                        owner: 'bainesface',
                        title: 'random title',
                        review_body: 'A review body - not sure what to write',
                        designer: 'Akihisa Okui',
                        category: 'euro game',
                    });
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
                });

                const { rows } = await db.query(
                    `SELECT review_id FROM reviews WHERE title = 'random title'`
                );

                expect(rows[0].review_id).toBe(14);
            });
            it('400: Returns an error if passed an invalid body', async () => {
                const invalidKey = await request(app)
                    .post('/api/reviews')
                    .expect(400)
                    .send({
                        owner: 'bainesface',
                        title: 'random title',
                        review_body: 'A review body - not sure what to write',
                        designer: 'Akihisa Okui',
                        invalid_key: 'euro game',
                    });

                expect(invalidKey.body.error).toEqual({
                    status: 400,
                    error: 'invalid key name or value',
                });

                const invalidValue = await request(app)
                    .post('/api/reviews')
                    .expect(400)
                    .send({
                        owner: 'bainesface',
                        title: 'random title',
                        review_body: 'A review body - not sure what to write',
                        designer: 'Akihisa Okui',
                        category: ['invalid value'],
                    });

                expect(invalidValue.body.error).toEqual({
                    status: 400,
                    error: 'invalid key name or value',
                });
            });
            it("400: Returns an error if passed a user or category that doesn't exist", async () => {
                const { body } = await request(app)
                    .post('/api/reviews')
                    .expect(400)
                    .send({
                        owner: 'not_a ',
                        title: 'random title',
                        review_body: 'A review body - not sure what to write',
                        designer: 'Akihisa Okui',
                        category: 'euro game',
                    });

                expect(body.error).toEqual('Invalid owner');
            });
        });
        describe('GET', () => {
            it('200: returns an array of objects, including count property', async () => {
                const { body } = await request(app)
                    .get('/api/reviews')
                    .expect(200);
                expect(body.reviews[0]).toMatchObject({
                    owner: expect.any(String),
                    title: expect.any(String),
                    review_id: expect.any(Number),
                    review_body: expect.any(String),
                    designer: expect.any(String),
                    review_img_url: expect.any(String),
                    category: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    amount_of_comments: expect.any(String),
                });

                expect(body.count).toBe('13');
            });
            it('200: Returns a review object with the correct properties', async () => {
                const { body } = await request(app)
                    .get('/api/reviews/2')
                    .expect(200);
                expect(body.review).toMatchObject({
                    owner: expect.any(String),
                    title: expect.any(String),
                    review_id: expect.any(Number),
                    review_body: expect.any(String),
                    designer: expect.any(String),
                    review_img_url: expect.any(String),
                    category: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    amount_of_comments: expect.any(String),
                });
            });
            it('400: Returns an error if passed a non-number as a parametric endpoint', async () => {
                const { body } = await request(app)
                    .get('/api/reviews/not_a_number')
                    .expect(400);
                expect(body.error).toEqual({
                    status: 400,
                    error: 'id must be a number',
                });
            });
            it("404: Returns an error if passed a number which doesn't relate to a review", async () => {
                const res = await request(app)
                    .get('/api/reviews/3434')
                    .expect(404);
                expect(res.body.error).toEqual({
                    status: 404,
                    error: 'No reviews with an id of 3434',
                });
            });
        });
        describe('PATCH', () => {
            it('200: Returns the updated item after incrimenting/decrimenting the vote', async () => {
                const res = await request(app)
                    .patch('/api/reviews/2')
                    .expect(200)
                    .send({ inc_votes: 5 });
                expect(res.body.review).toMatchObject({
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
                expect(res.body.review.votes).toBe(10);
            });
            it('200: Also works with negative numbers', async () => {
                const res = await request(app)
                    .patch('/api/reviews/2')
                    .expect(200)
                    .send({ inc_votes: -20 });

                expect(res.body.review.votes).toBe(-15);
            });
            it('400: Returns an error if passed a non-number as a parametric endpoint.', async () => {
                const res = await request(app)
                    .patch('/api/reviews/invalid_id')
                    .expect(400);

                expect(res.body.error).toEqual({
                    status: 400,
                    error: 'id must be a number',
                });
            });
            it("404: Returns an error if passed a number ID that doesn't relate to a review", async () => {
                const res = await request(app)
                    .patch('/api/reviews/233')
                    .expect(404)
                    .send({ inc_votes: -20 });

                expect(res.body.error).toEqual({
                    status: 404,
                    error: 'No reviews with an id of 233',
                });
            });
            it('400: Returns an error if passed an invalid object in the body.', async () => {
                const res = await request(app)
                    .patch('/api/reviews/2')
                    .expect(400)
                    .send({ bad_key: 'not a number' });

                expect(res.body.error).toEqual({
                    status: 400,
                    error: 'format to { inc_votes : number }',
                });
            });
        });
        describe('DELETE', () => {
            it('204: Deletes review and all associated comments based on passed id', async () => {
                await request(app).delete('/api/reviews/2').expect(204);

                const result = await db.query(
                    `SELECT * FROM reviews WHERE review_id = 2;`
                );

                const comments = await db.query(
                    `SELECT * FROM comments WHERE review_id = 2;`
                );
                expect(result.rows).toHaveLength(0);
                expect(comments.rows).toHaveLength(0);
            });
            it('400: Returns an error if passed something that is not a number', async () => {
                await request(app)
                    .delete('/api/reviews/not_a_number')
                    .expect(400);
            });
            it("400: Returns an error if passed the id of a review that doesn'nt exist", async () => {
                const { body } = await request(app)
                    .delete('/api/reviews/248')
                    .expect(400);
                expect(body.error).toEqual({
                    status: 400,
                    error: 'No reviews with this ID',
                });
            });
        });
    });
    describe('/api/reviews?queries=', () => {
        describe('GET', () => {
            it('200: Returns a full list of reviews when passed no queries.', async () => {
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
            it('200: Returns the list in ASC/DESC order of date when passed an order query', async () => {
                const resDesc = await request(app)
                    .get('/api/reviews?order=desc')
                    .expect(200);

                const descOrder = [...resDesc.body.reviews].sort((x, y) => {
                    return new Date(y.created_at) - new Date(x.created_at);
                });

                expect(resDesc.body.reviews).toEqual(descOrder);
            });
            it('200: Returns the a filtered list based upon given category', async () => {
                const res = await request(app)
                    .get('/api/reviews?category=social_deduction')
                    .expect(200);

                const all_check = res.body.reviews.every(
                    (review) => review.category === 'social deduction'
                );
                expect(all_check).toBe(true);
            });
            it('404: Returns an error when passed a valid category but invalid query', async () => {
                const res = await request(app)
                    .get('/api/reviews?category=invalid_query')
                    .expect(404);
                expect(res.body.error).toEqual({
                    status: 404,
                    error: 'Invalid query',
                });
            });
            it("400: Returns an error with a list of valid categories when passed a category that doesn't exist.", async () => {
                const res = await request(app)
                    .get('/api/reviews?not_a_category=me_neither')
                    .expect(400);
                expect(res.body.error).toMatchObject({
                    error: {
                        valid_queries: [
                            'sort_by',
                            'order',
                            'category',
                            'limit',
                            'p',
                        ],
                    },
                    status: 400,
                });
            });
            it('200: Returns all reviews sorted by date if passed an empty sort_by query.', async () => {
                const { body } = await request(app)
                    .get('/api/reviews')
                    .expect(200);

                const test_result = body.reviews.map((review) =>
                    new Date(review.created_at).toString()
                );

                const ordered = [...test_result].sort((x, y) => {
                    return new Date(y) - new Date(x);
                });

                expect(test_result).toEqual(ordered);
            });
            it('200: Returns a list of reviews sorted by column when passed that column as a query', async () => {
                const res = await request(app)
                    .get('/api/reviews?sort_by=amount_of_comments')
                    .expect(200);

                const test_result = res.body.reviews.map(
                    (review) => review.amount_of_comments
                );

                const ordered = test_result.sort((x, y) => {
                    return x - y;
                });

                expect(test_result).toEqual(ordered);
            });

            it('404: Returns an error containing valid_columns when passed a sort_by with invalid column name', async () => {
                const res = await request(app)
                    .get('/api/reviews?sort_by=not_real_column_name')
                    .expect(404);
                expect(res.body.error).toEqual({
                    status: 404,
                    error: {
                        invalid_column: 'not_real_column_name',
                        valid_columns: [
                            'owner',
                            'title',
                            'review_id',
                            'category',
                            'votes',
                            'comment_count',
                        ],
                    },
                });
            });
        });
    });
    describe('/api/reviews/:review_id/comments', () => {
        describe('GET', () => {
            it('400: Returns an error if passed a non-number as a parametric endpoint', async () => {
                const response1 = await request(app)
                    .get('/api/reviews/not_a_number/comments')
                    .expect(400);
                expect(response1.body.error).toEqual({
                    status: 400,
                    error: 'id must be a number',
                });
            });
            it('200: Returns a full list of filtered comments when passed a valid id', async () => {
                const res = await request(app)
                    .get('/api/reviews/2/comments')
                    .expect(200);
                expect(res.body.reviews).toHaveLength(3);
            });
            it("404: Returns an error if passed an number id that doesn't exist", async () => {
                const { body } = await request(app)
                    .get('/api/reviews/23443/comments')
                    .expect(404);
                expect(body.error.error).toBe('Invalid query');
            });
            it('200: If the ID is valid but there is no comments', async () => {
                const { body } = await request(app)
                    .get('/api/reviews/1/comments')
                    .expect(200);
            });
        });
        describe('POST', () => {
            const errorObject = {
                status: 400,
                valid_format: `{ username: string, body: string}`,
            };
            it('400: Returns an error if passed an object with invalid keys ', async () => {
                const res = await request(app)
                    .post('/api/reviews/2/comments')
                    .expect(400)
                    .send({
                        invalid_key: 'invalid username',
                        body: 'valid key',
                    });

                expect(res.body.error).toEqual(errorObject);
            });
            it('400: Returns an error if the object values are not strings', async () => {
                const res = await request(app)
                    .post('/api/reviews/2/comments')
                    .expect(400)
                    .send({
                        username: 1,
                        body: { not_a: 'string ' },
                    });

                expect(res.body.error).toEqual(errorObject);
            });
            it('201: Returns the sent comment after adding it to the database and adds it to the database.', async () => {
                const { body } = await request(app)
                    .post('/api/reviews/2/comments')
                    .expect(201)
                    .send({
                        username: 'bainesface',
                        body: 'Test comment. Not too interesting.',
                    });

                expect(body.comment).toMatchObject({
                    comment_id: expect.any(Number),
                    author: expect.any(String),
                    review_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    body: expect.any(String),
                });

                const { rows } = await db.query(
                    `SELECT * FROM comments WHERE body = 'Test comment. Not too interesting.';`
                );

                expect(rows.length).toBe(1);
                expect(rows[0].body).toBe('Test comment. Not too interesting.');
            });
            it("404: Returns an error if passed a user that does'nt exist", async () => {
                const { body } = await request(app)
                    .post('/api/reviews/2/comments')
                    .expect(404)
                    .send({
                        username: 'non-existent-user',
                        body: "I'm not sure how i'm writing this comment. I don't exist",
                    });
                expect(body.error.error).toEqual(`username does not exist`);
            });
            it("400: Returns an error if passed an ID that doesn't relate to a review", async () => {
                const { body } = await request(app)
                    .post('/api/reviews/23/comments')
                    .expect(400)
                    .send({
                        username: 'bainesface',
                        body: 'This is the body of the comment',
                    });
                expect(body.error).toEqual('Invalid review_id');
            });
            it("400: Returns an error if passed an ID that isn't a number", async () => {
                const { body } = await request(app)
                    .post('/api/reviews/word/comments')
                    .expect(400)
                    .send({
                        username: 'bainesface',
                        body: 'This is the body of the comment',
                    });
                expect(body.error.error).toEqual('id must be a number');
            });
        });
    });
});

describe('Comments', () => {
    describe('/api/comments/:comment_id', () => {
        describe('DELETE', () => {
            it('204: Returns no content and deletes based upon the id in the endpoint', async () => {
                await request(app).delete('/api/comments/3').expect(204);

                const { rows } = await db.query(
                    'SELECT author, review_id FROM comments WHERE comment_id = 3;'
                );

                expect(rows).toHaveLength(0);
            });
            it('400: Returns an error if passed a non-number ID', async () => {
                const res = await request(app)
                    .delete('/api/comments/not_a_number')
                    .expect(400);
                expect(res.body.error).toEqual({
                    status: 400,
                    error: 'id must be a number',
                });
            });
            it('404: Returns an error if passed a non-existent comment id', async () => {
                const res = await request(app)
                    .delete('/api/comments/3084')
                    .expect(404);
                expect(res.body.error).toEqual({
                    status: 404,
                    error: `No comment with an id of 3084`,
                });
            });
        });
        describe('PATCH', () => {
            it('400: Returns an error if given an incorrect body', async () => {
                const { body } = await request(app)
                    .patch('/api/comments/3')
                    .expect(400)
                    .send({ bad_key: 'not a number' });

                expect(body.error).toEqual({
                    status: 400,
                    error: 'format to { inc_votes : number }',
                });
            });
            it("400: Returns an error if endpoint isn't a number", async () => {
                const { body } = await request(app)
                    .patch('/api/comments/not_a_number')
                    .expect(400);

                expect(body.error).toEqual({
                    status: 400,
                    error: 'id must be a number',
                });
            });
            it('404: Returns an error if given a non-existent id', async () => {
                await request(app)
                    .patch('/api/comments/3948')
                    .expect(404)
                    .send({ inc_votes: 20 });
            });
            it('200: Returns the comment altered by the correct amount', async () => {
                const { body } = await request(app)
                    .patch('/api/comments/3')
                    .expect(200)
                    .send({ inc_votes: 20 });

                expect(body.comment).toMatchObject({
                    body: "I didn't know dogs could play games",
                    votes: 30,
                });
            });
            it('200: Also works with negative numbers', async () => {
                const { body } = await request(app)
                    .patch('/api/comments/3')
                    .expect(200)
                    .send({ inc_votes: -20 });

                expect(body.comment).toMatchObject({
                    body: "I didn't know dogs could play games",
                    votes: -10,
                });
            });
        });
    });
});

describe('Users', () => {
    describe('/api/users', () => {
        describe('GET', () => {
            it('200: Returns a full array of Users', async () => {
                const { body } = await request(app)
                    .get('/api/users')
                    .expect(200);
                expect(body.users).toHaveLength(4);
            });
            it('200: Returns a single user when passed with a parametric endpoint', async () => {
                const { body } = await request(app)
                    .get('/api/users/dav3rid')
                    .expect(200);

                expect(body.user).toMatchObject({
                    username: expect.any(String),
                    avatar_url: expect.any(String),
                    name: expect.any(String),
                });
            });
            it("400: Returns an error if a user doesn't exist", async () => {
                const { body } = await request(app)
                    .get('/api/users/non-existent-user')
                    .expect(400);

                expect(body.error.error).toBe('No user with this ID');
            });
        });
    });
});

describe('Pagination', () => {
    describe('/api/reviews', () => {
        it('200: Returns a list of 10 items when not passed a query body', async () => {
            const { body } = await request(app).get('/api/reviews').expect(200);
            expect(body.reviews.length).toBe(10);
        });
        it('200: Returns a list of a specified amount of items when passed a query body', async () => {
            const { body } = await request(app)
                .get('/api/reviews?limit=5')
                .expect(200);
            expect(body.reviews.length).toBe(5);
        });
        it('200: Returns a list of a specified amount when passed with another query - also contains count of full list', async () => {
            const { body } = await request(app)
                .get('/api/reviews?limit=5&category=social deduction')
                .expect(200);
            expect(body.reviews).toHaveLength(5);
            expect(body.count).toBe('11');
        });
        it('200: Returns a list with the specified page', async () => {
            const result1 = await request(app)
                .get('/api/reviews?limit=5&p=2')
                .expect(200);

            expect(result1.body.reviews[0]).toMatchObject({
                owner: 'mallionaire',
                title: 'A truly Quacking Game; Quacks of Quedlinburg',
                review_id: 9,
            });

            const result2 = await request(app)
                .get('/api/reviews?limit=2&p=4')
                .expect(200);

            expect(result2.body.reviews[0].review_id).toBe(10);
        });
        it('400: Returns an error if something other than a number is passed to limit= or p=', async () => {
            const expectedError = {
                status: 400,
                error: {
                    valid_queries: [
                        'sort_by',
                        'order',
                        'category',
                        'limit',
                        'p',
                    ],
                },
            };
            const result1 = await request(app)
                .get('/api/reviews?limit=not_a_number')
                .expect(400);
            expect(result1.body.error).toEqual(expectedError);

            const result2 = await request(app)
                .get('/api/reviews?limit=2&p=not_a_number')
                .expect(400);
            expect(result2.body.error).toEqual(expectedError);
        });
        it('404: Returns an error if passed a page which contains no results', async () => {
            await request(app).get('/api/reviews?p=3').expect(404);
        });
    });
    describe('/api/reviews/:review_id/comments', () => {
        const addComments = async (user, amount) => {
            for (let i = 0; i < amount; i++) {
                await request(app)
                    .post(`/api/reviews/${user}/comments`)
                    .expect(201)
                    .send({
                        username: 'bainesface',
                        body: `${i}`,
                    });
            }
        };

        it('200: returns a list of 10 items when not passed a query body', async () => {
            await addComments(2, 15);

            const { body } = await request(app)
                .get('/api/reviews/2/comments')
                .expect(200);

            expect(body.reviews).toHaveLength(10);
        });
        it('200: Returns a list of a specified amount when passed with another query - also contains count of full list', async () => {
            await addComments(2, 15);

            const { body } = await request(app)
                .get('/api/reviews/2/comments?limit=3&p=5')
                .expect(200);

            expect(body.reviews).toHaveLength(3);
            expect(body.reviews[0].body === '9').toBeTruthy();
        });
        // it("400: Returns an error if passed a page number which doesn't exist", async () => {
        //     const { body } = await request(app)
        //         .get('/api/reviews/2/comments?p=3223')
        //         .expect(404);

        //     expect(body.error).toEqual({
        //         status: 404,
        //         error: 'Invalid query',
        //     });
        // });
    });
});
