
const connection = require('./connectDb');

const insertQ = `INSERT INTO questions VALUES (2,1,'HEY THIS IS A WEIRD QUESTION!!!!?','2019-04-28','jbilas','first.last@gmail.com',1,4)`;
const selectQ = `SELECT * FROM questions`;

// connection.insertQuestion(insertQ, (err, res) => {
//   if (err) {
//     console.log(err)
//   }  else {
//     console.log(res)
//   }
// })

// connection.getQuestions(selectQ, (err, res) => {
//     if (err) {
//       console.log(err);
//     } else {
//         console.log(res)
//     }

// })
// arguments are table, dataFile, cb
connection.loadDb('photos', 'photos', (err, result) => {
  if (err) {
    console.log(err);
  } else {
    console.log(result);
  }
})