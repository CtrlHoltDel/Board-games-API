const { objectToArray } = require('../db/utils/data-manipulation');
const { fetchAllReviewsValidate } = require('../utils/validation');

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
    describe('Fetch all reviews', () => {
        it('When passed a valid keyname and value returns true', () => {
            expect(fetchAllReviewsValidate({ category: 'cars' })).toBe(true);
        });
        it('When passed a query with an invalid key name returns false', () => {
            expect(fetchAllReviewsValidate({ invalid_key_name: 'cars' })).toBe(
                false
            );
        });
        it("If passed the order keyword - returns false if the value isn't asc/desc", () => {
            expect(fetchAllReviewsValidate({ order: 'asc' })).toBe(true);
        });
        it("If passed the order keyword - returns false if the value isn't asc/desc", () => {
            expect(fetchAllReviewsValidate({ order: 'not_any' })).toBe(false);
        });
    });
});
