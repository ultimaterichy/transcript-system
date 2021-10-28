const mysql = require("mysql");
const dbConfig = require("./db.config.js");

// Create a connection to the database
const connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
});

// open the MySQL connection
connection.connect(error => {
  if (error) throw error;
  //
  // let students = `
  //   CREATE TABLE IF NOT EXISTS students (
  //     id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  //     email varchar(255) NOT NULL,
  //     name varchar(255) NOT NULL,
  //     phone varchar(20) NOT NULL,
  //     matric varchar(255) NOT NULL,
  //     department varchar(255) NOT NULL,
  //     faculty varchar(255) NOT NULL,
  //     public_key varchar(255) NOT NULL,
  //     private_key varchar(255) NOT NULL
  //   ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
  // `;
  //
  // let users = `
  //   CREATE TABLE IF NOT EXISTS users(
  //     id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  //     email varchar(255) NOT NULL,
  //     name varchar(255) NOT NULL,
  //     password varchar(255) NOT NULL,
  //     role int(1) DEFAULT 0
  //   ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
  // `;
  //
  // let courses = `
  //   CREATE TABLE IF NOT EXISTS \`courses\` (
  //     id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  //     title varchar(255) NOT NULL,
  //     code varchar(255) NOT NULL,
  //     credit_load int(2) NOT NULL
  //   ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
  // `;

let add = `
  insert into courses (title, code, credit_load) values ('Intro to computer 1', 'CMP111', 2), ('Intro to computer 2', 'CMP121', 2), ('Intro to computer 3', 'CMP211', 2), ('Intro to computer 4', 'CMP121', 2), ('Intro to computer 5', 'CMP311', 2);
`;

  // connection.query(students, function(err, results, fields) {
  //   if (err) {
  //     console.log(err.message);
  //   }
  // });
  //
  // connection.query(users, function(err, results, fields) {
  //   if (err) {
  //     console.log(err.message);
  //   }
  // });
  //
  // connection.query(courses, function(err, results, fields) {
  //   if (err) {
  //     console.log(err.message);
  //   }
  // });

  connection.query(add, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });


  console.log("Successfully connected to the database.");
});

module.exports = connection;