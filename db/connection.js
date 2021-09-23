const { Pool } = require('pg');
const ENV = process.env.NODE_ENV || 'development';

require('dotenv').config({
    path: `${__dirname}/../.env.${ENV}`,
});

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
    throw new Error('PGDATABASE or DATABASE_URL not set');
}

// console.log(`Currently connected database; \n${process.env.PGDATABASE}\n----`);

const config =
    ENV === 'production'
        ? {
              connectionString: process.env.DATABASE_URL,
              ssl: {
                  rejectUnauthorized: false,
              },
          }
        : {};

console.log(process.env.NODE_ENV, '<<<<<<< NODE_ENV');
console.log(
    `Currently connected database; \n${process.env.DATABASE_URL}\n----`
);

const db = new Pool(config);

module.exports = db;
