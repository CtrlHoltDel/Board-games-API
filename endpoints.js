exports.endPoints = {
  'GET /api': {
    description:
      'serves up a json representation of all the available endpoints of the api',
  },
  'GET /api/categories': {
    description: 'Serves up an array of all categories',
    'example response': {
      categories: {
        slug: 'strategy',
        description:
          'Strategy-focused board games that prioritise limited-randomness',
      },
    },
  },
  'GET /api/reviews ': {
    description: 'Serves an array of all reviews',
    'example response': {
      reviews: {
        review_id: 13,
        title: "Kerplunk; Don't lose your marbles",
        review_body:
          "Don't underestimate the tension and supsense that can be brought on with a round of Kerplunk! You'll feel the rush and thrill of not disturbing the stack of marbles, and probably utter curse words when you draw the wrong straw. Fanily friendly, and not just for kids! ",
        designer: 'Avery Wunzboogerz',
        review_img_url:
          'https://images.pexels.com/photos/278888/pexels-photo-278888.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        votes: 9,
        category: 'dexterity',
        owner: 'tickle122',
        created_at: '2021-01-25T11:16:54.963Z',
        comment_count: 3,
      },
    },
  },
  'GET /api/reviews/:review_id': {
    description: 'Serves the review specified in the endpoint',
    'example response': {
      review: {
        review_id: 3,
        title: 'Karma Karma Chameleon',
        review_body:
          'Try to trick your friends. If you find yourself being dealt the Chamelean card then the aim of the game is simple; blend in... Meanwhile the other players aim to be as vague as they can to not give the game away ',
        designer: 'Rikki Tahta',
        review_img_url:
          'https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        votes: 5,
        category: 'hidden-roles',
        owner: 'happyamy2016',
        created_at: '2021-01-18T10:01:42.151Z',
        comment_count: 5,
        likes: 1,
      },
    },
  },
  'PATCH /api/reviews/:review_id': {
    description: 'Updates the votes in the review specified in the endpoint',
    'example body': { inc_votes: 'number' },
  },
  'PATCH /api/reviews/:review_id/edit': {
    description: 'Updates the body of the review specified in the endpoint',
    'example body': { body: 'string' },
  },
  'GET /api/reviews/:review_id/comments': {
    description:
      'Serves up a list of comments of the review specified in the endpoint',
    'example response': {
      comments: {
        comment_id: 4,
        author: 'tickle122',
        review_id: 2,
        votes: 16,
        created_at: '2017-11-22T12:36:03.389Z',
        body: 'EPIC board game!',
      },
    },
  },
  'POST /api/reviews/:review_id/comments': {
    description: 'Adds a comment to the review specified in the endpoint',
    'example body': {
      username: 'philippaclaire9',
      body: 'This seems to be the first review for this!',
    },
  },
  'GET /api/reviews/:review_id/likes': {
    description:
      'Serves a list of users who have liked the review specified in the endpoint',
    'example response': {
      users: {
        username: 'tickle122',
        avatar_url:
          'https://www.spiritsurfers.net/monastery/wp-content/uploads/_41500270_mrtickle.jpg',
      },
    },
  },
  'DEL /api/comments/:comment_id': {
    description: 'Deletes the comment specified in the endpoint',
  },
  'PATCH /api/comments/:comment_id': {
    description: 'Updates the votes in the comment specified in the endpoint',
    'example body': { inc_votes: 'number' },
  },
  'PATCH /api/comments/:comment_id/edit': {
    description: 'Updates the comment specified in the endpoint',
    'example body': { body: 'String' },
  },
  'GET /api/users': {
    description: 'Serves an array of a full list of users',
    'example response': {
      users: {
        username: 'grumpy19',
        avatar_url:
          'https://www.tumbit.com/profile-image/4/original/mr-grumpy.jpg',
        name: 'Paul Grump',
        email: 'idej@ratnariantiarno.art',
      },
    },
  },
  'POST /api/users': {
    description: 'Adds a new user to the database',
    'example body': {
      username: 'test_user',
      avatar_url: 'http://image.com/image',
      name: 'test_name',
      email: 'new_email@gmail.com',
    },
  },
  'GET /api/users/:username': {
    description:
      'Responds with information about the user specified in the endpoint',
    'example response': {
      user: {
        username: 'happyamy2016',
        avatar_url:
          'https://vignette1.wikia.nocookie.net/mrmen/images/7/7f/Mr_Happy.jpg/revision/latest?cb=20140102171729',
        name: 'Amy Happy',
        email: '5jonatha_luizo@3kk43.com',
      },
    },
  },
  'GET /api/users/:username/likes': {
    description:
      'Responds with a list of all reviews liked by the user specified in the endpoint',
    'example response': {
      reviews: {
        liked_at: '2021-01-22T11:35:50.936Z',
        title: "Kerplunk; Don't lose your marbles",
        owner: 'tickle122',
        review_body:
          "Don't underestimate the tension and supsense that can be brought on with a round of Kerplunk! You'll feel the rush and thrill of not disturbing the stack of marbles, and probably utter curse words when you draw the wrong straw. Fanily friendly, and not just for kids! ",
        review_img_url:
          'https://images.pexels.com/photos/278888/pexels-photo-278888.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        votes: 9,
        category: 'dexterity',
        created_at: '2021-01-25T11:16:54.963Z',
      },
    },
  },
};
