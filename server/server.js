const express = require('express');
const path = require('path');
const compression = require('compression');
const cors = require('cors');
const db = require('../db/connectDb');
const helper = require('../helpers');

const PORT = 8080;

//middlewear
const app = express();
app.use(compression);
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, '../loader_io')));

// /qa/questions?product_id=18201&count=50
app.get('/qa/questions', (req, res) => {
  //how to do pagination as in question count and questions per page?
  let { product_id, count } = req.query;
  db.getQuestionsAndAnswers(product_id, count, (err, result) => {
    if (err) {
      res.status(501).send(err);
    } else {
      //do some more cooking
      var results = result.map(question => {
        return question.coalesce
      })
      var results = results.filter(question => question.reported === false)
      for (var question of results) {
        var answers = helper.objFilter(question.answers);
        question.answers = answers;
      }

      var obj = {
        product_id,
        results: results
      }

      res.status(201).send(obj);
    }
  })
})

//not used in front end
// app.get('/qa/questions/:question_id/answers', (req, res) => {
//   //how to do pagination?
//   res.header(202) its really res status!;
//   res.send(`You\'ve reached the answer API with question id: ${req.params.question_id} says the wizard of QA\'S`);
// })

app.post('/qa/questions', (req, res) => {
  db.insertQuestion(req.body, (err, response) => {
    if (err) {
      res.status(502);
      res.send('Insertion Error on inserting question')
    } else {
      res.status(202);
      res.send('Successfully added to db');
    }
  })
})

app.post('/qa/questions/:question_id/answers', (req, res) => {
  //assign question_id to the body
  req.body.question_id = req.params.question_id;
  db.insertAnswer(req.body, (err, result) => {
    if (err) {
      res.status(502);
      res.send('Insertion error on inserting answer')
    } else {
      res.status(202);
      res.send(result);
    }
  })
})

app.put('/qa/questions/:question_id/helpful', (req, res) => {
  db.markQuestionHelpful(req.params.question_id, (err, result) => {
    if (err) {
      res.status(503);
      res.send('Could not update question helpfulness');
    } else {
      res.status(203);
      res.send('Successfully incremented the question helpfulness')
    }
  })
})

app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  db.markAnswerHelpful(req.params.answer_id, (err, result) => {
    if (err) {
      res.status(503);
      res.send('Could not update answer helpfulness');
    } else {
      res.status(203);
      res.send('Successfully incremented the answer helpfulness')
    }
  })
})

app.put('/qa/questions/:question_id/report', (req, res) => {
  db.reportQ(req.params.question_id, (err, result) => {
    if (err) {
      res.status(504);
      res.send('could not report question')
    } else {
      res.status(204);
      res.send('reported a q')
    }
  })
})

app.put('/qa/answers/:answer_id/report', (req, res) => {
  db.reportA(req.params.answer_id, (err, result) => {
    if (err) {
      res.status(504);
      res.send('could not report answer')
    } else {
      res.status(204);
      res.send('reported an answer')
    }
  })
})

app.listen(PORT, () => {
  console.log(`Server listening at localhost:${PORT}!`);
});
