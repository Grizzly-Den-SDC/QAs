//import code
import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate } from "k6/metrics";
import { Trend } from "k6/metrics";

//for grafana visualization using influxDb
//k6 run --out influxdb=http://localhost:8086/testDb test.js

//will also need to delete data in influxdb and do something with a tag thingy so that its not so memory expensive


//init code
//stages in instead of duration
export let options = {
  max_vus: 10000,
  vus: 1,
  stages: [
        { duration: '30s', target: 100 },
        { duration: '1m30s', target: 1000},
        { duration: '20s', target: 0 },
      ],
  thresholds: {
    'RTT': ['avg<500']
  }
};

var myRate = new Rate("GET Request ");
var myTrend = new Trend("my_trend");


//vu looping code (while loop)
export default function () {

  //purpsoe is to test beginning, middle and end of db
  //test reponse times

  group('GET Questions And Answers', () => {
    let product_id = Math.floor(Math.random() * 1000000);
    let res = http.get(`http://localhost:8080/qa/questions?product_id=${product_id}`);
    check(res, {
        'GET response code was 201: ': (res) => res.status === 201
      });
      // myRate.add(res.error_code);
      // myTrend.add(res.timings.sending + res.timings.receiving);
  })
  group('POST questions to the server', () => {
    var url = 'http://localhost:8080/qa/questions';
    let product_id = Math.floor(Math.random() * 1000000);
    // recieved q:  { body: 'gdfsg', name: 'dfhdfh', email: 'fdh', product_id: 18216 }

    var payload = JSON.stringify({
      body: 'Hello, there this is a question',
      name: 'gold Glasses',
      email: 'whosgotgoldglasses@yahoo.com',
      product_id: product_id
    })

    var params = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    let res = http.post(url, payload, params);
    check(res, {
      'response code was 202: ': (res) => res.status === 202
    });
  })

  group('POST answers to the server', () => {
    let question_id = Math.floor(Math.random() * 3000000);
    var url = `http://localhost:8080/qa/questions/${question_id}/answers`;
    // recieved q:  { body: 'gdfsg', name: 'dfhdfh', email: 'fdh', question_id: 18216 }

    var payload = JSON.stringify({
      body: 'Hello, there this is an answer',
      name: 'Armchair general',
      email: 'generalArmchair@yahoo.com',
    })

    var params = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    let res = http.post(url, payload, params);
    check(res, {
      'response code was 202: ': (res) => res.status === 202
    });
  })

  group('PUT mark helpful!', () => {
    let question_id = Math.floor(Math.random() * 3000000);
    let answer_id = Math.floor(Math.random() * 11000000);
    var urlQ = `http://localhost:8080/qa/questions/${question_id}/helpful`;
    var urlA = `http://localhost:8080/qa/answers/${answer_id}/helpful`;

    let resQ = http.put(urlQ);
    let resA = http.put(urlA)

    check(resQ, {
      'Question marked helpful succcess 203: ': (resQ) => resQ.status === 203
    });
    check(resA, {
      'Answer marked helpful succcess 203: ': (resA) => resA.status === 203
    });
  })

  group('PUT mark reported!', () => {
    let question_id = Math.floor(Math.random() * 3000000);
    let answer_id = Math.floor(Math.random() * 11000000);
    var urlQ = `http://localhost:8080/qa/questions/${question_id}/report`;
    var urlA = `http://localhost:8080/qa/answers/${answer_id}/report`;

    let resQ = http.put(urlQ);
    let resA = http.put(urlA)

    check(resQ, {
      'Question reported succcess 204: ': (resQ) => resQ.status === 204
    });
    check(resA, {
      'Answer reported succcess 204: ': (resA) => resA.status === 204
    });
  })

  sleep(1);
}