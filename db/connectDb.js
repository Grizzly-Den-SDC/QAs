const path = require('path');
const { Pool, Client } = require('pg');


const pool = new Pool({
    user: 'ubuntu',
    host: 'localhost',
    database: 'qa',
    password: 'password',
    port: 5432
});

pool.on('error', (err, client) => {
    console.error('Error:', err);
});


const getQuestionsAndAnswers = (product_id, count, cb) => {
  //finds an available client in the pool and uses it, one at a time.
    pool.query(setQandAQuery(product_id), (err, res) => {
      if (err) {
        cb(err, null);
      } else {
        cb(null, res.rows);
      }
    })
}


const insertQuestion = (body, cb) => {
  //finds an available client in the pool and uses it, one at a time.
    pool.query(insertQ(body), (err, res) => {
      if (err) {
        cb(err, null);
      } else {
        cb(null, res);
      }
    })
}

const insertAnswer = (body, cb) => {
  pool.query(insertA(body), (err, res) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, res);
    }
  })
};

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

const indexDb = (table, column, cb) => {
  pool.query(indexer(table, column), (err, result) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, result);
    }
  })
};

const markQuestionHelpful = (question_id, cb) => {
  pool.query(incrementQh(question_id), (err, result) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, result);
    }
  })
};

const markAnswerHelpful = (answer_id, cb) => {
  pool.query(incrementAh(answer_id), (err, result) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, result);
    }
  })
};

const reportQ = (question_id, cb) => {
  pool.query(reportQuestion(question_id), (err, result) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, result);
    }
  })
};

const reportA = (answer_id, cb) => {
  pool.query(reportAnswer(answer_id), (err, result) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, result);
    }
  })
};


module.exports = {
    insertQuestion,
    getQuestionsAndAnswers,
    loadDb,
    indexDb,
    insertAnswer,
    markQuestionHelpful,
    markAnswerHelpful,
    reportQ,
    reportA
}



/***********************************************QUERIES*****************************************/
const setQandAQuery = (product_id) => {

 const query = `select coalesce(json_build_object(
  'question_id', questions.question_id,
  'question_body', questions.question_body,
  'question_date', questions.question_date,
  'asker_name', questions.asker_name,
  'question_helpfulness', questions.question_helpfulness,
  'reported', questions.reported,
  'asker_email', questions.asker_email,
  'answers',
  (select coalesce(json_object_agg(
    answers.answer_id,
    json_build_object(
      'id', answers.answer_id,
      'body', answers.body,
      'date', answers.date,
      'answerer_name', answers.answerer_name,
      'answerer_email', answers.answerer_email,
      'helpfulness', answers.helpfulness,
      'reported', answers.reported,
      'photos',
      (select coalesce(json_agg(
        photos.url
      ), '[]'::json)
       from photos where answers.answer_id=photos.answer_id))), '{}'::json)
      from answers where questions.question_id=answers.question_id)), '[]'::json)
       from questions where questions.product_id=${product_id};`;

  return query;
}

const insertQ = (body) => {
  const q = `INSERT INTO questions (product_id, question_body, asker_name, asker_email, reported, question_helpfulness) VALUES (${body.product_id}, '${body.body}', '${body.name}', '${body.email}', false, 0);`
  return q;
};

const insertA = (body) => {
  const q = `INSERT INTO answers (question_id, body, answerer_name, answerer_email, reported, helpfulness) VALUES (${body.question_id}, '${body.body}', '${body.name}', '${body.email}', false, 0);`
  return q;
}

const indexer = (table, column) => {
  const q = `CREATE INDEX ${column}_idx ON ${table} (${column});`
  return q;
};

const incrementQh = (question_id) => {
  const q = `UPDATE questions SET question_helpfulness= question_helpfulness + 1 WHERE question_id=${question_id};`
  return q;
};

const incrementAh = (answer_id) => {
  const q = `UPDATE answers SET helpfulness= helpfulness + 1 WHERE answer_id=${answer_id};`
  return q;
};

const reportQuestion = (question_id) => {
  const q = `UPDATE questions SET reported=true WHERE question_id=${question_id};`;
  return q;
};

const reportAnswer = (answer_id) => {
  const q = `UPDATE answers SET reported=true WHERE answer_id=${answer_id};`;
  return q;
};

// SELECT json_agg(qa) AS json_object
// FROM (
//     SELECT json_build_object('id', q.id,
//                              'name', q.name,
//                              'content', q.content,
//                              'num_of_flags', q.num_of_flags,
//                              'comments', json_agg(c.j)) AS qa
//     FROM quotes q
//     LEFT JOIN (
//         SELECT quote_id, json_build_object('id', id,
//                                            'comment_content', comment_content,
//                                            'num_of_likes', num_of_likes,
//                                            'quote_id', quote_id) AS j
//         FROM comments) c ON c.quote_id = q.id
//     GROUP BY 1, 2, 3, 4) sub;

//page is number of times to recurse
// LIMIT ${count} OFFSET ${(page - 1) * count};

// select coalesce(json_build_object(
//   'question_id', questions.question_id,
//   'question_body', questions.question_body,
//   'question_date', questions.question_date,
//   'asker_name', questions.asker_name,
//   'question_helpfulness', questions.question_helpfulness,
//   'reported', questions.reported,
//   'asker_email', questions.asker_email,
//   'answers',
//   (select coalesce(json_object_agg(
//     answers.answer_id,
//     json_build_object(
//       'id', answers.answer_id,
//       'body', answers.body,
//       'date', answers.date,
//       'answerer_name', answers.answerer_name,
//       'answerer_email', answers.answerer_email,
//       'helpfulness', answers.helpfulness,
//       'photos',
//       (select coalesce(json_agg(
//         photos.url
//       ), '[]'::json)
//        from photos where answers.answer_id=photos.answer_id))), '{}'::json)
//       from answers where questions.question_id=answers.question_id)), '[]'::json)
//        from questions where questions.product_id=1 LIMIT 5 OFFSET 0;

//hiarchical query
// select json_build_object('product_id', questions.product_id, 'results', json_agg(q))
//           json_build_object(
//             'question_id', questions.question_id,
//             'question_body', questions.question_body,
//             'question_date', questions.question_date,
//             'asker_name', questions.asker_name,
//             'question_helpfulness', questions.question_helpfulness,
//             'reported', questions.reported,
//             'asker_email', questions.asker_email,
//             'answers', answers
//           )
//         )
//       ) questions
//       from questions q
//       left join (
//         select
//               question_id,
//               json_object_agg(
//                 answers.answer_id,
//                 json_build_object(
//                   'id', answers.answer_id,
//                   'body', answers.body,
//                   'date', answers.date,
//                   'answerer_name', answers.answerer_name,
//                   'answerer_email', answers.answerer_email,
//                   'helpfulness', answers.helpfulness,
//                 )
//               ) answers
//         from answers a
//         group by product_id=1)
//         a on q.question_id = a.question_id;







