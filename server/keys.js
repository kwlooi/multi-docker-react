module.exports = {
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
  pgUsername: process.env.PGUSERNAME,
  pgPassword: process.env.PGPASSWORD,
  pgHost: process.env.PGHOST,
  pgPort: process.env.PGPORT,
  pgDatabase: process.env.PGDATABASE
};

// select .env, then press CMD-D multiple times to multi-select rows