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
