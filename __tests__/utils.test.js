const { objectToArray } = require('../db/utils/data-manipulation');
const {
    fetchAllReviewsValidate,
    formatCheckVote,
    validateSortBy,
} = require('../utils/validation');

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
    describe('formatCheckVote', () => {
        it('Returns a rejected promise if passed an invalid vote', () => {
            return expect(formatCheckVote({ in_votes: 1 })).rejects.toEqual({
                status: 400,
                endpoint: '/api/reviews/:id',
                error: 'format to { inc_votes : number }',
            });
        });
        it('Returns undefined when passed a valid vote', () => {
            return expect(formatCheckVote({ inc_votes: 5 })).toBe(undefined);
        });
    });
    describe('Fetch all reviews', () => {
        const rejectedPromise = {
            endpoint: '/api/reviews?category=query',
            error: {
                valid_queries: ['sort_by', 'order', 'category'],
            },
            status: 400,
        };
        it('When passed a valid key name and value returns undefined', () => {
            expect(
                fetchAllReviewsValidate({ category: 'cars' })
            ).toBeUndefined();
        });
        it('When passed a query with an invalid key name returns a rejected Promise', () => {
            expect(
                fetchAllReviewsValidate({ invalid_key_name: 'cars' })
            ).rejects.toEqual(rejectedPromise);
        });
        it("If passed the order keyword - returns false if the value isn't asc/desc", () => {
            expect(fetchAllReviewsValidate({ order: 'asc' })).toBeUndefined();
        });
        it("If passed the order keyword - returns false if the value isn't asc/desc", () => {
            expect(
                fetchAllReviewsValidate({ order: 'not_any' })
            ).rejects.toEqual(rejectedPromise);
        });
    });
    describe('sort by validate', () => {
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
                expect(validateSortBy(column)).toBeUndefined();
            });
        });
        it('When passed a sort_by with an invalid column query - returns an rejected promise with error', () => {
            expect(validateSortBy('invalid_column_type')).rejects.toEqual({
                status: 404,
                endpoint: '/api/reviews?sort_by=column_to_sort_by',
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
});
