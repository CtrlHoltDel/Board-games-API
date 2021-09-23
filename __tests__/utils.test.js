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
        expect(objectToArray(testData)).toEqual(expectedResult);
    });
});

describe('Validation', () => {
    describe('Vote incrimenter', () => {
        it('Returns a rejected promise if passed an invalid vote', () => {
            return expect(
                validate.voteUpdater({ in_votes: 1 })
            ).rejects.toEqual({
                status: 400,
                error: 'format to { inc_votes : number }',
            });
        });
        it('Returns undefined when passed a valid vote', () => {
            return expect(validate.voteUpdater({ inc_votes: 5 })).toBe(
                undefined
            );
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
                'amount_of_comments',
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
