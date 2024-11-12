const { query, text } = require('express');
const {pool, Connection} = require('pg');
require('dotenv').config();

const pool = new pool({
    connectionString: process.env.DATABASE_URL,
})

module.exports = {
    query:(text,params) => pool.query(text,params),
}