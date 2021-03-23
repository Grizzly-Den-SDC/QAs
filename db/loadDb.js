
const connection = require('./connectDb');


const AsyncLoadDb = () => {
// arguments are table, dataFile, cb
connection.loadDb('questions', 'questions', (err, result) => {
  if (err) {
    console.log('error loading questions');
  } else {
    console.log('succesful loading of questions');
    connection.loadDb('answers', 'answers', (err, result) => {
      if (err) {
        console.log('err loading answers')
      } else {
        console.log('succesful loading of answers');
        connection.loadDb('photos', 'photos', (err, result) => {
          if (err) {
            console.log('err loading photos');
          } else {
            console.log('successful loading of photos. Finished loading db');

          }
        })
      }
    })
  }
})
}

AsyncLoadDb();