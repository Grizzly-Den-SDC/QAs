const express = require('express');
const path = require('path');
const compression = require('compression');
const cors = require('cors');

const PORT = 8080;
const app = express();
app.use(express.json());
app.use(cors());

app.get('/qa/questions', (req, res) => {
  //how to do pagination?
  res.header(201);
  res.send('You\'ve reached the questions API says the wizard of QA\'S');
})

app.get('/qa/questions/:question_id/answers', (req, res) => {
  //how to do pagination?
  res.header(202);
  res.send(`You\'ve reached the answer API with question id: ${req.params.question_id} says the wizard of QA\'S`);
})

app.post('/qa/questions', (req, res) => {
  //req.params pull question out
  res.header(201);
   res.send(`You\'ve reached the question posting API with the question ${req.body} says the wizard of QA\'S`);
})

app.post('/qa/questions/:question_id/answers', (req, res) => {
   //req.params pull answer out
  res.header(201);
   res.send('You\'ve reached the answer posting API says the wizard of QA\'S: ', req.body);
})

app.put('/qa/questions/:question_id/helpful', (req, res) => {
  //req.params pull answer out
 res.header(201);
  res.send('You\'ve reached the mark question helpful API says the wizard of QA\'S');
})

app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  //req.params pull answer out
 res.header(204);
  res.send('You\'ve reached the mark answer helpful API says the wizard of QA\'S');
})

app.put('/qa/questions/:question_id/report', (req, res) => {
  //req.params pull answer out
 res.header(204);
  res.send('You\'ve reached the report question API says the wizard of QA\'S');
})

app.put('/qa/answers/:answer_id/report', (req, res) => {
  //req.params pull answer out
 res.header(204);
  res.send('You\'ve reached the report answer API says the wizard of QA\'S');
})

app.listen(PORT, () => {
  console.log(`Server listening at localhost:${PORT}!`);
});