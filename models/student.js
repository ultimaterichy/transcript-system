const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// constructor
const Student = function(student) {
  this.email = student.email;
  this.name = student.name;
  this.phone = student.phone;
  this.matric = student.matric;
  this.publicKey = student.publicKey;
  this.privateKey = student.privateKey;
  this.faculty = student.faculty;
  this.department = student.department;
};

Student.create = async (newStudent) => {
  console.log("newStudent: ", newStudent);
  try {
    const student = await prisma.student.create({
      data: {
        email: newStudent.email,
        name: newStudent.name,
        phone: newStudent.phone,
        matric: newStudent.matric,
        publicKey: newStudent.publicKey,
        privateKey: newStudent.privateKey,
        faculty: newStudent.faculty,
        department: newStudent.department
      }
    });
    console.log("created student: ", student);
    return student;
  } catch (err) {
    console.log("error: ", err);
    throw err;
  }
};

Student.findById = async (studentId) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });

    if (student) {
      console.log("found student: ", student);
      return student;
    }

    // not found Student with the id
    throw { kind: "not_found" };
  } catch (err) {
    console.log("error: ", err);
    throw err;
  }
};

Student.findByMatric = async (studentMatric) => {
  try {
    const student = await prisma.student.findUnique({
      where: { matric: studentMatric }
    });

    if (student) {
      console.log("found student: ", student);
      return student;
    }

    // not found Student with the matric
    throw { kind: "not_found" };
  } catch (err) {
    console.log("error: ", err);
    throw err;
  }
};

Student.findByPublicKey = async (publicKey) => {
  try {
    const student = await prisma.student.findFirst({
      where: { publicKey: publicKey }
    });

    if (student) {
      console.log("found student: ", student);
      return student;
    }

    // not found Student with the public key
    throw { kind: "not_found" };
  } catch (err) {
    console.log("error: ", err);
    throw err;
  }
};

Student.getAll = async () => {
  try {
    const students = await prisma.student.findMany();
    console.log("students: ", students);
    return students;
  } catch (err) {
    console.log("error: ", err);
    throw err;
  }
};

Student.updateById = async (id, student) => {
  try {
    const updatedStudent = await prisma.student.update({
      where: { id: id },
      data: {
        email: student.email,
        name: student.name,
        phone: student.phone,
        matric: student.matric,
        publicKey: student.public_key,
        privateKey: student.private_key,
        faculty: student.faculty,
        department: student.department
      }
    });

    console.log("updated student: ", updatedStudent);
    return updatedStudent;
  } catch (err) {
    if (err.code === 'P2025') {
      // not found Student with the id
      throw { kind: "not_found" };
    }
    console.log("error: ", err);
    throw err;
  }
};

Student.remove = async (id) => {
  try {
    const deletedStudent = await prisma.student.delete({
      where: { id: id }
    });

    console.log("deleted student with id: ", id);
    return deletedStudent;
  } catch (err) {
    if (err.code === 'P2025') {
      // not found Student with the id
      throw { kind: "not_found" };
    }
    console.log("error: ", err);
    throw err;
  }
};

Student.removeAll = async () => {
  try {
    const deletedStudents = await prisma.student.deleteMany();
    console.log(`deleted ${deletedStudents.count} students`);
    return deletedStudents;
  } catch (err) {
    console.log("error: ", err);
    throw err;
  }
};

module.exports = Student;