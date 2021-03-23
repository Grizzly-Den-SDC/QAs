// this is to make things blasingly fast and create binary trees on the sql friction points i.e foreign keys where tables come together. Primary unique keys are already indexed
const connection = require('./connectDb');


const asycIndexDb = () => {
  connection.indexDb('questions', 'product_id', (err, result) => {
    if (err) {
      console.log('issues indexing questions product_id');
    } else {
      console.log('indexing questions product_id sucesss');
      connection.indexDb('answers', 'question_id', (err, result) => {
        if (err) {
          console.log('issues indexing answers question_id');
        } else {
          console.log('indexing answers question_id success');
          connection.indexDb('photos', 'answer_id', (err, result) => {
            if (err) {
              console.log('issues indexing photos answer_id');
            } else {
              console.log('indexing photos answer_id success');
              console.log('successful indexing');
            }
          })
        }
      })
    }
  })
}

asycIndexDb();