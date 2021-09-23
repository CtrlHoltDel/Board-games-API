exports.endPoints = {
    'GET /api': {
        description:
            'serves up a json representation of all the available endpoints of the api',
    },
    'GET /api/categories': {
        description: 'serves an array of all categories',
        queries: [],
        exampleResponse: {
            categories: [
                {
                    description:
                        "Players attempt to uncover each other's hidden role",
                    slug: 'Social deduction',
                },
            ],
        },
    },
    'GET /api/reviews': {
        description: 'serves an array of all reviews',
        queries: ['category', 'sort_by', 'order', 'limit', 'p'],
        exampleResponse: {
            reviews: [
                {
                    title: 'One Night Ultimate Werewolf',
                    designer: 'Akihisa Okui',
                    owner: 'happyamy2016',
                    review_img_url:
                        'https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
                    category: 'hidden-roles',
                    created_at: 1610964101251,
                    votes: 5,
                },
            ],
        },
    },
    'GET /api/reviews/:review_id': {
        description: 'serves an single review based on id',
        exampleResponse: {
            review: [
                {
                    title: 'One Night Ultimate Werewolf',
                    designer: 'Akihisa Okui',
                    owner: 'happyamy2016',
                    review_img_url:
                        'https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
                    category: 'hidden-roles',
                    created_at: 1610964101251,
                    votes: 5,
                },
            ],
        },
    },
    'GET /api/reviews/:review_id/comments': {
        description: 'Serves a full list of comments based on ID',
        exampleResponse: {
            comments: [
                {
                    body: 'My dog loved this game too!',
                    votes: 13,
                    author: 'mallionaire',
                    comment_id: 4,
                    created_at: '2017-11-22T00:00:00.000Z',
                },
            ],
        },
    },
    'GET /api/users': {
        description: 'Serves a full list of users',
    },
    'GET /api/users/:username': {
        description: 'Serves a user with more detailed information',
        exampleResponse: {
            user: [
                {
                    username: 'cooljmessy',
                    avatar_url: 'http://i.imgur.com/WfX0Neu.jpg',
                    name: 'Peter Messy',
                },
            ],
        },
    },
    'POST /api/reviews/:review_id/comments': {
        description: 'Adds a comment to a review based upon given review id',
        exampleBody: {
            username: 'happyamy2016',
            body: 'This is a comment that will be added to a review',
        },
        exampleResponse: {
            comment: {
                comment_id: 63,
                author: 'happyamy2016',
                review_id: 2,
                votes: 0,
                created_at: '2021-09-22T23:00:00.000Z',
                body: 'This is a comment that will be added to a review',
            },
        },
    },
    'POST /api/reviews': {
        description: 'Adds a review to the database',
        exampleBody: {
            owner: 'jessjelly',
            title: 'random title',
            review_body: 'A review body - not sure what to write',
            designer: 'Akihisa Okui',
            category: 'dexterity',
        },
        exampleResponse: {
            review: {
                review_id: 35,
                title: 'random title',
                review_body: 'A review body - not sure what to write',
                designer: 'Akihisa Okui',
                review_img_url:
                    'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
                votes: 0,
                category: 'dexterity',
                owner: 'jessjelly',
                created_at: '2021-09-22T23:00:00.000Z',
            },
        },
    },
    'POST /api/categories': {
        description: 'Adds a category to the database',
        exampleBody: { slug: 'action', description: 'games about action' },
        exampleResponse: {
            category: {
                slug: 'action',
                description: 'games about action',
            },
        },
    },
    'PATCH /api/reviews/:review_id': {
        description: 'Amends a given reviews votes based upon review ID',
        exampleBody: { inc_votes: 1 },
        exampleResponse: {
            review: {
                review_id: 2,
                title: 'JengARRGGGH!',
                review_body:
                    "Few games are equiped to fill a player with such a defined sense of mild-peril, but a friendly game of Jenga will turn the mustn't-make-it-fall anxiety all the way up to 11! Fiddly fun for all the family, this game needs little explaination. Whether you're a player who chooses to play it safe, or one who lives life on the edge, eventually the removal of blocks will destabilise the tower and all your Jenga dreams come tumbling down.",
                designer: 'Leslie Scott',
                review_img_url:
                    'https://images.pexels.com/photos/4009761/pexels-photo-4009761.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
                votes: 8,
                category: 'dexterity',
                owner: 'grumpy19',
                created_at: '2021-01-18T00:00:00.000Z',
            },
        },
    },
    'PATCH /api/comments/:comment_id': {
        description: 'Amends a given comments votes based upon comment ID',
        exampleBody: { inc_votes: -25 },
        exampleResponse: {
            comment: {
                comment_id: 2,
                author: 'tickle122',
                review_id: 4,
                votes: -22,
                created_at: '2021-01-18T00:00:00.000Z',
                body: 'My dog loved this game too!',
            },
        },
    },
    'DELETE /api/comments/:comment_id': {
        description: 'Deletes a comment based upon given comment id',
    },
    'DELETE /api/reviews/:review_id': {
        description:
            'Deleted a review and associated comments based upon given review id',
    },
};
