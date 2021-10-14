const sql = require("../database/db");

// constructor
const Student = function(student) {
  this.email = student.email;
  this.name = student.name;
  this.phone = student.phone;
  this.matric = student.matric;
  this.public_key = student.public_key,
  this.private_key = student.private_key,
  this.faculty = student.faculty,
  this.department = student.department
};

Student.create = (newStudent, result) => {
  sql.query("INSERT INTO students SET ?", newStudent, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created student: ", { id: res.insertId, ...newStudent });
    result(null, { id: res.insertId, ...newStudent });
  });
};

Student.findById = (studentId, result) => {
  sql.query(`SELECT * FROM students WHERE id = ${studentId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found student: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Student with the id
    result({ kind: "not_found" }, null);
  });
};


Student.findByMatric = (studentMatric, result) => {
    sql.query(`SELECT * FROM students WHERE matric = ?`,studentMatric, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found student: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found Student with the id
      result({ kind: "not_found" }, null);
    });
  };

  Student.findByPublicKey = (publicKey, result) => {
    sql.query(`SELECT * FROM students WHERE public_key = ?`,publicKey, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found student: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found Student with the id
      result({ kind: "not_found" }, null);
    });
  };

Student.getAll = result => {
  sql.query("SELECT * FROM students", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("students: ", res);
    result(null, res);
  });
};

Student.updateById = (id, student, result) => {
  sql.query(
    "UPDATE students SET email = ?, name = ?, active = ? WHERE id = ?",
    [student.email, student.name, student.active, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Student with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated student: ", { id: id, ...student });
      result(null, { id: id, ...student });
    }
  );
};

Student.remove = (id, result) => {
  sql.query("DELETE FROM students WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Student with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted student with id: ", id);
    result(null, res);
  });
};

Student.removeAll = result => {
  sql.query("DELETE FROM students", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} students`);
    result(null, res);
  });
};

module.exports = Student;