const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// constructor
const Course = function(course) {
  this.code = course.code;
  this.title = course.title;
  this.credit_load = course.credit_load;
};

Course.create = async (newCourse) => {
  try {
    const course = await prisma.course.create({
      data: {
        code: newCourse.code,
        title: newCourse.title,
        credit_load: newCourse.credit_load
      }
    });
    console.log("created course: ", course);
    return course;
  } catch (err) {
    console.log("error: ", err);
    throw err;
  }
};

Course.findById = async (courseId) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) }
    });

    if (course) {
      console.log("found course: ", course);
      return course;
    }

    // not found Course with the id
    throw { kind: "not_found" };
  } catch (err) {
    console.log("error: ", err);
    throw err;
  }
};

Course.findByCode = async (courseCode) => {
  try {
    const course = await prisma.course.findFirst({
      where: { code: courseCode }
    });

    if (course) {
      console.log("found course: ", course);
      return course;
    }

    // not found Course with the code
    throw { kind: "not_found" };
  } catch (err) {
    console.log("error: ", err);
    throw err;
  }
};

Course.getAll = async () => {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { code: 'asc' }
    });
    console.log("courses: ", courses);
    return courses;
  } catch (err) {
    console.log("error: ", err);
    throw err;
  }
};

Course.updateById = async (id, course) => {
  try {
    const updatedCourse = await prisma.course.update({
      where: { id: parseInt(id) },
      data: {
        code: course.code,
        title: course.title,
        credit_load: course.credit_load
      }
    });
    console.log("updated course: ", updatedCourse);
    return updatedCourse;
  } catch (err) {
    if (err.code === 'P2025') {
      // not found Course with the id
      throw { kind: "not_found" };
    }
    console.log("error: ", err);
    throw err;
  }
};

Course.remove = async (id) => {
  try {
    const deletedCourse = await prisma.course.delete({
      where: { id: parseInt(id) }
    });
    console.log("deleted course with id: ", id);
    return deletedCourse;
  } catch (err) {
    if (err.code === 'P2025') {
      // not found Course with the id
      throw { kind: "not_found" };
    }
    console.log("error: ", err);
    throw err;
  }
};

Course.removeAll = async () => {
  try {
    const deletedCourses = await prisma.course.deleteMany();
    console.log(`deleted ${deletedCourses.count} courses`);
    return deletedCourses;
  } catch (err) {
    console.log("error: ", err);
    throw err;
  }
};

module.exports = Course;