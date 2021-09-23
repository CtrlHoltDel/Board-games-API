# Board Games API

## [**Live version**](https://chd-board-games.herokuapp.com/api)

_A full list of endpoints and a description of how to use them is contained within the live version at **/api**._

---

## **Summary**

A server with a database that contains a list of board games reviews written by users, alongside comments for each of those reviews.

---

## **Requirements**

**[Node](https://nodejs.org/en/) 14.x**+

**[Postgres](https://www.postgresql.org/) 8.2**+

---

## **How to install locally on your machine;**

1.  Clone the repo by typing the following into your terminal;

```
$ git clone git@github.com:CtrlHoltDel/board-games-back-end.git
```

2. While in the directory containing the cloned server, enter into the terminal `npm i` to install all dependencies.

3. Create two files in the root directory named `.env.development` and `.env.test`. In the development file you have created enter `PGDATABASE=nc_games`, in the test file enter `PGDATABASE=nc_games_test`. Save both files.

4. Enter the following into the terminal;

`npm run setup-dbs`

`npm run seed`

5. The database and API will should now work on your machine. Check by entering `npm t` - This will run a series of tests.
