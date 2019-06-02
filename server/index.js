const keys = require('./keys');

// Express App Setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres Client Setup
const { Pool } = require('pg');
const pgClient = new Pool({
  user: keys.pgUsername,
  password: keys.pgPassword,
  host: keys.pgHost,
  port: keys.pgPort,
  database: keys.pgDatabase
});
pgClient.on('error', () => console.log('Lost PG connection'));

pgClient
  .query('CREATE TABLE IF NOT EXISTS values (number INT)')
  .catch(err => console.log(err));

// Redis Client Setup
const redis = require('redis');
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
const redisPublisher = redisClient.duplicate();

// Express route handlers

app.get('/', (req, res) => {
  res.send('Hi');
});

app.get('/values/all', async (req, res) => {
  // await for query results to come back so that it can be used for sending response in the next line
  const values = await pgClient.query('SELECT * from values');
  res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
  // no await because redis client does not support Promise
  // instead use callback arrow function to send response back
  console.log(keys.redisHost, keys.redisPort)
  redisClient.hgetall('values', (err, values) => {
    res.send(values);
  });
});

app.post('/values', async (req, res) => {
  const index = req.body.index;

  if (parseInt(index) > 40) {
    return res.status(422).send('Index too high');
  }

  // console.log('index', index)
  // values = await pgClient.query('SELECT * from values');
  // console.log('values', values)

  redisClient.hset('values', index, 'Nothing yet!');
  redisPublisher.publish('insert', index, (err, r) => {
  });
  pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

  // response is not awaiting for any async completion of pg or redis client
  res.send({ working: true });
});

app.listen(5000, err => {
  console.log('Listening');
});
