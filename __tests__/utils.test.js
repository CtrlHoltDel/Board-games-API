const { objectToArray } = require('../db/utils/data-manipulation');

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
