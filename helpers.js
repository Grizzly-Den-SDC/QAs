// the purpose of this file is provide helper functions for this project

//object filter - intake an object of nested objects and construct a new object of nested objects that pass the filter

//IOCE - input is 1 x nested obj, output is 1 x nested obj with obj that pass the filter

var objFilter = (nestedObj) => {
  // init new obj
  var obj = {};
  //consider each obj within the nested obj
  for (var key in nestedObj) {
    var answer = nestedObj[key];
    if (answer.reported === false) {
      obj[key] = answer;
    }
  }
  //return new obj
  return obj;
};

module.exports = {
  objFilter
}





























// INSERT INTO questions VALUES (1,1,'What fabric is the top made of?','2018-01-04','yankeelover','first.last@gmail.com',0,1);

  // db contraints for questions
    //question_id is a unique int
    //product_id is an int
    //question_body is a string < 1000 chars
    //question_date is a string
    //asker_name is a string < 60 chars
    //asker_email is a string < 60 chars
    //reported is a bool
    //question_helpfulness is an int

  // db constraints for answers
    //answer_id is a unique int
    //question_id is an int that exists in the questions.questions_id table
    //body is a string < 1000 chars
    //date is a string
    //answerer_name is a string < 60 chars
    //answerer_email is a string < 60 chars
    //reported is a bool
    //helpfulness is an int

  // db constraints for photos
    //photo_id is a unique int
    //answer_id is a that exists in the answers.answers_id field
    //url is a string