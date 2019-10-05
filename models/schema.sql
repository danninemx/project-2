DROP DATABASE IF EXISTS testdb;
CREATE DATABASE testdb;

USE testdb;

CREATE TABLE Products (
  id INT NOT NULL AUTO_INCREMENT,
  term VARCHAR(65) NOT NULL,
  explanation VARCHAR(1000) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO Products (term, explanation)
VALUES ("var", "Declares a variable"), ("floor(x)", "Returns x rounded down to the nearest integer"), ("abs(x)", "Returns the absolute value of x")

CREATE TABLE Users (
  id INT NOT NULL AUTO_INCREMENT,
  firstName VARCHAR(50) NOT NULL,
  lastName VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL UNIQUE,
  lastLessonId INT(5) NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
);

CREATE TABLE Guides (
  id INT NOT NULL AUTO_INCREMENT,
  chapterId INT(5) NOT NULL,
  chapter VARCHAR(50) NOT NULL,
  lessonId INT(5) NOT NULL,
  lesson VARCHAR(50) NOT NULL,
  tag VARCHAR(100) NOT NULL,
  content VARCHAR(1000) NOT NULL,
  PRIMARY KEY (id)
);
