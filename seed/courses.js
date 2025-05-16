const Course = require('../models/course');

const courses = [
  {
    code: 'CSC101',
    title: 'Introduction to Computer Science',
    credit_load: 3
  },
  {
    code: 'CSC102',
    title: 'Computer Programming I',
    credit_load: 3
  },
  {
    code: 'CSC201',
    title: 'Data Structures and Algorithms',
    credit_load: 4
  },
  {
    code: 'CSC202',
    title: 'Object-Oriented Programming',
    credit_load: 3
  },
  {
    code: 'CSC301',
    title: 'Database Management Systems',
    credit_load: 3
  },
  {
    code: 'CSC302',
    title: 'Software Engineering',
    credit_load: 3
  },
  {
    code: 'CSC401',
    title: 'Computer Networks',
    credit_load: 3
  },
  {
    code: 'CSC402',
    title: 'Operating Systems',
    credit_load: 3
  },
  {
    code: 'CSC501',
    title: 'Artificial Intelligence',
    credit_load: 3
  },
  {
    code: 'CSC502',
    title: 'Machine Learning',
    credit_load: 3
  }
];

const seedCourses = async () => {
  try {
    for (const course of courses) {
      try {
        await Course.create(course);
        console.log(`Successfully seeded course ${course.code}`);
      } catch (err) {
        if (err.code === 'P2002') {
          console.log(`Course ${course.code} already exists, skipping...`);
        } else {
          throw err;
        }
      }
    }
    console.log('All courses seeded successfully');
  } catch (error) {
    console.error('Error seeding courses:', error);
  } finally {
    process.exit(0);
  }
};

// Run the seeder
seedCourses(); 