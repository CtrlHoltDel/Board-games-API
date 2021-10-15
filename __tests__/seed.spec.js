const { pgFormatFriendly } = require('../db/utils/data-manipulation');

describe('Seed tests', () => {
  it('converts array of objects to be pg-format friendly', () => {
    const testData = [
      {
        slug: 'euro game',
        description: 'Abstract games that involve little luck',
      },
      {
        slug: 'social deduction',
        description: "Players attempt to uncover each other's hidden role",
      },
    ];
    const expectedResult = [
      ['euro game', 'Abstract games that involve little luck'],
      [
        'social deduction',
        "Players attempt to uncover each other's hidden role",
      ],
    ];
    expect(pgFormatFriendly(testData, 'categories')).toEqual(expectedResult);
  });
  it('Ignores excess keys', () => {
    const testData = [
      {
        slug: 'euro game',
        description: 'Abstract games that involve little luck',
        extra_key: 'this key should be ignored',
      },
      {
        slug: 'social deduction',
        this_is_an_extra_key: 'I should also be ignored',
        description: "Players attempt to uncover each other's hidden role",
      },
    ];
    const expectedResult = [
      ['euro game', 'Abstract games that involve little luck'],
      [
        'social deduction',
        "Players attempt to uncover each other's hidden role",
      ],
    ];
    expect(pgFormatFriendly(testData, 'categories')).toEqual(expectedResult);
  });
  describe('If passed a body in the wrong order - returns the array in the correct order', () => {
    it('Category', () => {
      const testData = [
        {
          description: 'Abstract games that involve little luck',
          slug: 'euro game',
        },
        {
          slug: 'social deduction',
          description: "Players attempt to uncover each other's hidden role",
        },
      ];
      const expectedResult = [
        ['euro game', 'Abstract games that involve little luck'],
        [
          'social deduction',
          "Players attempt to uncover each other's hidden role",
        ],
      ];
      expect(pgFormatFriendly(testData, 'categories')).toEqual(expectedResult);
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
      expect(pgFormatFriendly(testData, 'comments')).toEqual(expectedResult);
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
      expect(pgFormatFriendly(testData, 'reviews')).toEqual(expectedResult);
    });
    it('Users', () => {
      const testData = [
        {
          name: 'sarah',
          avatar_url:
            'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4',
          username: 'bainesface',
          email: 'testemail@gmail.com',
        },
      ];
      const expectedResult = [
        [
          'bainesface',
          'sarah',
          'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4',
          'testemail@gmail.com',
        ],
      ];
      expect(pgFormatFriendly(testData, 'users')).toEqual(expectedResult);
    });
    it('Review_likes', () => {
      const testData = [
        {
          username: 'test_user_1',
          review_id: 3,
          liked_at: new Date(1610964101251),
        },
        {
          review_id: 1,
          username: 'test_user_2',
          liked_at: new Date(1610964101251),
        },
      ];
      const expectedResult = [
        ['test_user_1', 3, new Date(1610964101251)],
        ['test_user_2', 1, new Date(1610964101251)],
      ];
      expect(pgFormatFriendly(testData, 'review_likes')).toEqual(
        expectedResult
      );
    });
  });
});
