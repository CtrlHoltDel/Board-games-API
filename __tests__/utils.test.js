const { objectToArray } = require('../db/utils/data-manipulation');
const { limitOffset } = require('../utils/utils');

const validate = require('../utils/validation');

describe('Seed tests', () => {
    it('converts array of objects to be pg-format friendly', () => {
        const testData = [
            {
                slug: 'euro game',
                description: 'Abstact games that involve little luck',
            },
            {
                slug: 'social deduction',
                description:
                    "Players attempt to uncover each other's hidden role",
            },
        ];
        const expectedResult = [
            ['euro game', 'Abstact games that involve little luck'],
            [
                'social deduction',
                "Players attempt to uncover each other's hidden role",
            ],
        ];
        expect(objectToArray(testData, 'category')).toEqual(expectedResult);
    });
    it('Ignores excess keys', () => {
        const testData = [
            {
                slug: 'euro game',
                description: 'Abstact games that involve little luck',
                extra_key: 'this key should be ignored',
            },
            {
                slug: 'social deduction',
                this_is_an_extra_key: 'I should also be ignored',
                description:
                    "Players attempt to uncover each other's hidden role",
            },
        ];
        const expectedResult = [
            ['euro game', 'Abstact games that involve little luck'],
            [
                'social deduction',
                "Players attempt to uncover each other's hidden role",
            ],
        ];
        expect(objectToArray(testData, 'category')).toEqual(expectedResult);
    });
    describe('If passed a body in the wrong order - returns the array in the correct order', () => {
        it('Category', () => {
            const testData = [
                {
                    description: 'Abstact games that involve little luck',
                    slug: 'euro game',
                },
                {
                    slug: 'social deduction',
                    description:
                        "Players attempt to uncover each other's hidden role",
                },
            ];
            const expectedResult = [
                ['euro game', 'Abstact games that involve little luck'],
                [
                    'social deduction',
                    "Players attempt to uncover each other's hidden role",
                ],
            ];
            expect(objectToArray(testData, 'category')).toEqual(expectedResult);
        });
        it('Comments', () => {
            const testData = [
                {
                    body: 'New comment!',
                    author: 'test user',
                    votes: 3,
                    created_at: new Date(1511354613389),
                    review_id: 5,
                },
            ];
            const expectedResult = [
                ['New comment!', 3, 'test user', 5, new Date(1511354613389)],
            ];
            expect(objectToArray(testData, 'comments')).toEqual(expectedResult);
        });
        it('Reviews', () => {
            const testData = [
                {
                    designer: 'Uwe Rosenberg',
                    owner: 'mallionaire',
                    review_body: 'Farmyard fun!',
                    title: 'Agricola',
                    review_img_url:
                        'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                    category: 'euro game',
                    created_at: new Date(1610964020514),
                    votes: 1,
                },
            ];
            const expectedResult = [
                [
                    'Agricola',
                    'Uwe Rosenberg',
                    'mallionaire',
                    'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                    'Farmyard fun!',
                    'euro game',
                    new Date(1610964020514),
                    1,
                ],
            ];
            expect(objectToArray(testData, 'reviews')).toEqual(expectedResult);
        });
        it('Users', () => {
            const testData = [
                {
                    name: 'sarah',
                    avatar_url:
                        'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4',
                    username: 'bainesface',
                },
            ];
            const expectedResult = [
                [
                    'bainesface',
                    'sarah',
                    'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4',
                ],
            ];
            expect(objectToArray(testData, 'users')).toEqual(expectedResult);
        });
    });
});

describe('Validation', () => {
    describe('Vote incrimenter', () => {
        it('Returns a rejected promise if passed an invalid vote', () => {
            return expect(validate.bodyPatch({ in_votes: 1 })).rejects.toEqual({
                status: 400,
                error: 'format to { inc_votes : number }',
            });
        });
        it('Returns undefined when passed a valid vote', () => {
            return expect(validate.bodyPatch({ inc_votes: 5 })).toBe(undefined);
        });
    });
    describe('All reviews', () => {
        const rejectedPromise = {
            error: {
                valid_queries: ['sort_by', 'order', 'category', 'limit', 'p'],
            },
            status: 400,
        };
        it('When passed a valid key name and value returns undefined', () => {
            expect(validate.allReviews({ category: 'cars' })).toBeUndefined();
        });
        it('When passed a query with an invalid key name returns a rejected Promise', () => {
            expect(
                validate.allReviews({ invalid_key_name: 'cars' })
            ).rejects.toEqual(rejectedPromise);
        });
        it("If passed the order keyword - returns false if the value isn't asc/desc", () => {
            expect(validate.allReviews({ order: 'asc' })).toBeUndefined();
            expect(validate.allReviews({ order: 'desc' })).toBeUndefined();
        });
        it('works with asc/desc of both cases', () => {
            expect(validate.allReviews({ order: 'ASC' })).toBeUndefined();
            expect(validate.allReviews({ order: 'DESC' })).toBeUndefined();
        });
        it("If passed the order keyword - returns false if the value isn't asc/desc", () => {
            expect(validate.allReviews({ order: 'not_any' })).rejects.toEqual(
                rejectedPromise
            );
        });
    });
    describe('Sort by', () => {
        it('When passed a valid column to sort by, returns undefined', () => {
            const validColumns = [
                'owner',
                'title',
                'review_id',
                'category',
                'votes',
                'comment_count',
            ];

            validColumns.forEach((column) => {
                expect(validate.sortBy(column)).toBeUndefined();
            });
        });
        it('When passed a sort_by with an invalid column query - returns an rejected promise with error', () => {
            expect(validate.sortBy('invalid_column_type')).rejects.toEqual({
                status: 404,
                error: {
                    invalid_column: 'invalid_column_type',
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
    describe('Add comment', () => {
        it('When passed a parameter with an invalid format, returns a rejected promise', () => {
            const expectedError = {
                status: 400,
                valid_format: `{ username: string, body: string}`,
            };
            expect(
                validate.addComment(undefined, 'not undefined')
            ).rejects.toEqual(expectedError);
            expect(
                validate.addComment('legitimate name', undefined)
            ).rejects.toEqual(expectedError);
        });
        it('Returns undefined when passed 2 strings', () => {
            expect(
                validate.addComment('valid username', 'valid comment body')
            ).toBeUndefined();
        });
    });
});

describe('App utility', () => {
    describe('Limit/offset', () => {
        it('Returns the correct offset based upon page number', () => {
            expect(limitOffset(5, 4)).toEqual({ LIMIT: 5, OFFSET: 15 });
        });
        it('Returns the correct limit and offset if limit or page number are undefined', () => {
            expect(limitOffset(undefined, 4)).toEqual({
                LIMIT: 10,
                OFFSET: 30,
            });
            expect(limitOffset(undefined, undefined)).toEqual({
                LIMIT: 10,
                OFFSET: 0,
            });
        });
    });
});
