const express = require('express');
const router = express.Router();
const MainApp = require('../system/main');
const Student = require('../models/student');
const Course = require('../models/course');
const nodemailer = require("nodemailer");
const axios = require('axios');
require('dotenv').config();

const KEY = process.env.API_KEY || 'WeqAVvJDm35b62Uy4ZvU52K6SDBF0R0H1633465002';
const senderMail = process.env.EMAIL_USER || "richarddanladi7@gmail.com";

const emailTransporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  service: 'gmail',
  secure: true,
  auth: {
    user: senderMail,
    pass: process.env.EMAIL_PASSWORD || 'jwochznpdicmzr'
  },
  logger: true 
});

// Home route
router.get('/', (req, res) => {
  res.render('add-student', { title: 'Express', error: null, success: null });
});

// Send transcript route
router.post('/send-transcript', async (req, res) => {
  try {
    const mailOptions = {
      from: senderMail,
      to: req.body.receiver,
      subject: 'Transcript',
      attachments: [
        {
          filename: 'transcript.pdf',
          path: req.body.file
        }
      ]
    };

    await emailTransporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending transcript:', error);
    res.json({ success: false, error: error.message });
  }
});

// Add student routes
router.get('/add-student', (req, res) => {
  res.render('add-student', { title: 'Express', error: null, success: null });
});

router.post('/add-student', async (req, res) => {
  try {
    let existingStudent;
    try {
      existingStudent = await Student.findByMatric(req.body.matric);
    } catch (err) {
      if (err.kind === "not_found") {
        existingStudent = null;
      } else {
        throw err;
      }
    }
    
    if (existingStudent) {
      return res.render('add-student', { 
        title: 'Express', 
        error: "Student already exists", 
        success: null 
      });
    }

    const resp = await MainApp.createStudent(req.body);
    console.log(resp)
    const student = new Student({
      email: req.body.email,
      name: req.body.name,
      phone: req.body.phone,
      matric: req.body.matric,
      faculty: req.body.faculty,
      department: req.body.department,
      privateKey: resp.privateKey,
      publicKey: resp.address
    });

    const result = await Student.create(student);
    
    if (result) {
      const mailOptions = {
        from: senderMail,
        to: result.email,
        subject: 'Transcript',
        text: `Public key is: ${result.publicKey}`
      };

      await emailTransporter.sendMail(mailOptions);
      res.render('add-student', { 
        title: 'Express', 
        error: null, 
        success: result 
      });
    }
  } catch (error) {
    console.error('Error adding student:', error);
    res.render('add-student', { 
      title: 'Express', 
      error: error.message, 
      success: null 
    });
  }
});

// Add transcript routes
router.get('/add-transcript', async (req, res) => {
  const sessions = [
    '2001/2002', '2002/2003', '2003/2004', '2004/2005', '2005/2006',
    '2006/2007', '2007/2008', '2008/2009', '2009/2010', '2010/2011',
    '2011/2012', '2012/2013', '2013/2014', '2014/2015', '2015/2016',
    '2016/2017', '2017/2018', '2018/2019', '2019/2020', '2020/2021',
    '2021/2022', '2022/2023'
  ];

  try {
    const courses = await Course.getAll();
    res.render('add-transcript', { 
      title: 'Express', 
      error: null, 
      success: null, 
      courses, 
      sessions 
    });
  } catch (error) {
    res.render('add-transcript', { 
      title: 'Express', 
      error: null, 
      success: null, 
      courses: [], 
      sessions 
    });
  }
});

router.post('/add-transcript', async (req, res) => {
  const sessions = [
    '2001/2002', '2002/2003', '2003/2004', '2004/2005', '2005/2006',
    '2006/2007', '2007/2008', '2008/2009', '2009/2010', '2010/2011',
    '2011/2012', '2012/2013', '2013/2014', '2014/2015', '2015/2016',
    '2016/2017', '2017/2018', '2018/2019', '2019/2020', '2020/2021',
    '2021/2022', '2022/2023'
  ];

  try {
    const student = await Student.findByMatric(req.body.matric);
    if (!student) {
      const courses = await Course.getAll();
      return res.render('add-transcript', { 
        title: 'Express', 
        error: "Student not found", 
        success: null, 
        courses, 
        sessions 
      });
    }

    const course = await Course.findById(req.body.course.replace(/\s/g, ''));
    if (!course) {
      const courses = await Course.getAll();
      return res.render('add-transcript', { 
        title: 'Express', 
        error: "Course not found", 
        success: null, 
        courses, 
        sessions 
      });
    }

    await MainApp.createTranscript({
      student,
      course,
      session: req.body.session,
      grade: req.body.grade,
      remark: req.body.remark
    });

    const courses = await Course.getAll();
    res.render('add-transcript', { 
      title: 'Express', 
      error: null, 
      success: 'Operation was successful', 
      courses, 
      sessions 
    });
  } catch (error) {
    console.error('Error adding transcript:', error);
    const courses = await Course.getAll();
    res.render('add-transcript', { 
      title: 'Express', 
      error: error.message, 
      success: null, 
      courses, 
      sessions 
    });
  }
});

// Get transcript routes
router.get('/get-transcript', (req, res) => {
  res.render('get-transcript', { title: 'Express', error: null, success: null });
});

router.post('/get-transcript', async (req, res) => {
  try {
    const student = await Student.findByPublicKey(req.body.publicKey);
    if (!student) {
      return res.render('get-transcript', { 
        title: 'Express', 
        error: 'Invalid key', 
        success: null 
      });
    }

    const data = await MainApp.getTranscript(req.body.publicKey, req.body.institutionAddress);
    res.render('transcript-view', { 
      title: 'Express', 
      error: null, 
      success: null, 
      transcripts: data, 
      phone: student.phone 
    });
  } catch (error) {
    console.error('Error getting transcript:', error);
    res.render('get-transcript', { 
      title: 'Express', 
      error: 'No Transcript Found', 
      success: null 
    });
  }
});

// Add course routes
router.get('/add-course', (req, res) => {
  res.render('add-course', { title: 'Express', error: null, success: null });
});

router.post('/add-course', async (req, res) => {
  try {
    const existingCourse = await Course.findByCode(req.body.code);
    if (existingCourse) {
      return res.render('add-course', { 
        title: 'Express', 
        error: 'Course already exists', 
        success: null 
      });
    }

    const course = new Course({
      code: req.body.code,
      title: req.body.title,
      credit_load: req.body.credit_load
    });

    const result = await Course.create(course);
    if (!result) {
      throw new Error('Failed to add course');
    }

    res.render('add-course', { 
      title: 'Express', 
      error: null, 
      success: 'Course added successfully' 
    });
  } catch (error) {
    console.error('Error adding course:', error);
    res.render('add-course', { 
      title: 'Express', 
      error: error.message, 
      success: null 
    });
  }
});

module.exports = router;
