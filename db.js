
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',             // 설치할 때 설정한 사용자 이름
  host: 'localhost',
  database: 'alice_app',
  password: '0429',
  port: 5432,
});

module.exports = pool;
