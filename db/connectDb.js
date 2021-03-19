const path = require('path');
const { Pool, Client } = require('pg')


const pool = new Pool({
    user: 'orennelson',
    host: 'localhost',
    database: 'qa',
    port: 5432,
});

pool.on('error', (err, client) => {
    console.error('Error:', err);
});


const getQuestions = (query, cb) => {
  //finds an available client in the pool and uses it, one at a time.
    pool.query(query, (err, res) => {
      if (err) {
        cb(err, null);
      } else {
        cb(null, res.rows);
      }
    })
}

const insertQuestion = (query, cb) => {
  //finds an available client in the pool and uses it, one at a time.
    pool.query(query, (err, res) => {
      if (err) {
        cb(err, null);
      } else {
        cb(null, res);
      }
    })
}

const loadDb = (table, dataFile, cb) => {
  const dataFiles = {
    questions: '/data/questions.csv',
    answers: '/data/answers.csv',
    photos: '/data/answers_photos.csv'
  }
  var dir = path.join(__dirname, '..', dataFiles[dataFile])
  const query = `COPY ${table} FROM '${dir}' DELIMITER ',' CSV HEADER;`;
  pool.query(query, (err, result) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, result);
    }
  })
};



module.exports = {
    insertQuestion,
    getQuestions,
    loadDb
}