
CREATE DATABASE qa;
\c qa;

DROP TABLE questions CASCADE;
DROP TABLE answers CASCADE;
DROP TABLE photos;

-- CREATE TABLE films (
--     code        char(5) CONSTRAINT firstkey PRIMARY KEY,
--     title       varchar(40) NOT NULL,
--     did         integer NOT NULL,
--     date_prod   date,
--     kind        varchar(10),
--     len         interval hour to minute
-- );

-- questions table
-- id, product_id, body, date_written, asker_name, asker_email, reported, helpful
CREATE TABLE questions (
    question_id serial PRIMARY KEY UNIQUE,
    product_id int NOT NULL,
    question_body varchar(1000),
    question_date date,
    asker_name varchar(60),
    asker_email varchar(60),
    reported boolean,
    question_helpfulness int
);

-- answers table
-- id, question_id, body, date_written, answerer_name, answerer_email, reported, helpful
CREATE TABLE answers (
    answer_id serial PRIMARY KEY UNIQUE,
    question_id int,
    body varchar(1000),
    date date,
    answerer_name varchar(60),
    answerer_email varchar(60),
    reported boolean,
    helpfulness int,
    FOREIGN KEY (question_id) REFERENCES questions
);

-- photos table
-- id, answer_id, url
CREATE TABLE photos (
    photo_id serial PRIMARY KEY UNIQUE,
    answer_id int,
    url varchar,
    FOREIGN KEY (answer_id) REFERENCES answers
);

