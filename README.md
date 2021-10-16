# Board game RESTful API

## [Live version of the API.](https://chd-board-games.herokuapp.com/api)

**_Hosted on [heroku](https://dashboard.heroku.com/)_**

## Overview

This API is built using the back end portion of the PERN stack.

| Technologies |                                Description                                 |
| :----------- | :------------------------------------------------------------------------: |
| Node.js      | Javascript runtime which our API is built upon. Lightweight and efficient. |
| PosgresQL    |                 An relational database management system.                  |
| Express.js   |              A web application framework built upon node.js.               |

## Minimum requirements

` Node.js v14.0.1`

` PostgreSQL v13`

## Setup

- Firstly clone this repo to your local machine.

- Navigate to the root folder and run the command `$ npm i` to install all dependencies.

- Create the databases by first running the comment `$ npm run setup-dbs`. When run for the first time the terminal should show the following;

```
    > bh-be@1.0.0 setup
    > psql -f ./db/setup.sql

    psql:./db/setup.sql:1: NOTICE:  database "nc_games_test" does not exist, skipping
    DROP DATABASE
    psql:./db/setup.sql:2: NOTICE:  database "nc_games" does not exist, skipping
    DROP DATABASE
    CREATE DATABASE
    CREATE DATABASE
```

- Create .env files in the root folder. One for both test `.env.test` and development `.env.development`

- Within the `.env` files add `PGDATABASE=nc_games` within `.env.development` and `PGDATABASE=nc_games_test` within `.env.test`

- Now the databases and dependencies have been setup you should be able to seed the database using the command `npm run seed`. The terminal should show the following;

```
    > bh-be@1.0.0 seed
    > node db/seeds/run-seed.js
```

- The server will now be ready to launch. This can be done using the command `npm start` from the root folder of this repo.
