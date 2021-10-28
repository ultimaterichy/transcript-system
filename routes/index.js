var express = require('express');
var router = express.Router();
var MainApp = require('../system/main');
const Student = require('../models/student')
const Course = require('../models/course');
const nodemailer = require("nodemailer");
const axios = require('axios')


const KEY = 'WeqAVvJDm35b62Uy4ZvU52K6SDBF0R0H1633465002'


const senderMail = "sboko@yahoo.com";

const emailTransporter = nodemailer.createTransport({
    host: 'smtp.mail.yahoo.com',
    port: 465,
    service:'yahoo',
    secure: false,
    auth: {
        user: senderMail,
        pass: 'wgfkakqprjnnqdgp'
    },
    logger: true 
});

router.get('/', (req, res) => {
  res.render('add-student', { title: 'Express', error: null, success: null });
});

router.post('/send-transcript', (req, res) => {
  var user = req.body.user;
  console.log(user);
  let mailOptions = {
    from: senderMail,
    to: req.body.receiver,
    subject: 'Transcript',
    // attachments: [
    //   {
    //     filename: 'transcript.pdf',
    //     path: req.body.file
    //   }
    // ]
    text: "Hello"
  }

  emailTransporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error)
      res.json({fail: true, success: false});
    } else {
      // send sms
      var smsData = JSON.stringify({
        'username': 'sandbox',
        'to': user,
        'message': 'Transcript forwarded successfully'
      });

      var config = {
        method: 'post',
        url: 'https://fsi.ng/api/v1/africastalking/version1/messaging',
        headers: {
          'sandbox-key': KEY,
          'Content-Type': 'application/json'
        },
        data : smsData
      };

      axios(config)
          .then(function (response) {
            console.log(JSON.stringify(response.data));
            res.json({fail: false, success: true});
          })
          .catch(function (error) {
            console.log(error);
            res.json({fail: false, success: true});
          });
    }
  });
});


/* GET home page. */
router.get('/add-student', function(req, res, next) {
  // MainApp.test();
  res.render('add-student', { title: 'Express', error: null, success: null });
});

router.post('/add-student', (req, res) => {
  // make sure user doesn't exist
  Student.findByMatric(req.body.matric, (err, result) => {
    // if found, return an error
    if(result != null){
      res.render('add-student', { title: 'Express', error: "Student already exist", success: null });
    } else{
      MainApp.createStudent(req.body).then(resp => {
        // create to a student instance
        console.log(resp);
        const student = new Student({
          email: req.body.email,
          name: req.body.name,
          phone: req.body.phone,
          matric: req.body.matric,
          faculty: req.body.faculty,
          department: req.body.department,
          private_key: resp.privateKey,
          public_key: resp.address
        });
        
        // store
        console.log('saving to db')
        Student.create(student, (err, result) => {
          if(result != null){
            let mailOptions = {
              from: senderMail,
              to: result.email,
              subject: 'Transcript',
              text: 'Public key is: '+result.public_key
            }
            emailTransporter.sendMail(mailOptions, function(error, info){
              if (error) {
                res.render('add-student', { title: 'Express', error: err, success: result });
              } else {
                res.render('add-student', { title: 'Express', error: err, success: result });
              }
            });
          } else{
            res.render('add-student', { title: 'Express', error: err, success: result });
          }
          
        });
      })
    }
  });
  
});


router.get('/add-transcript', (req, res) => {
  // sessions
  const sessions = ['2011/2012', '2012/2013', '2013/2014', '2014/2015', '2015/2016', '2016/2017', '2017/2018', '2018/2019', '2019/2020', '2020/2021', '2021/2022', '2022/2023']
  // load course
  Course.getAll((err, result) => {
    if(err == null){
      res.render('add-transcript', { title: 'Express', error: null, success: null, courses: result, sessions: sessions });
    } else{
      res.render('add-transcript', { title: 'Express', error: null, success: null, courses: [], sessions: sessions });
    }
  })
  
});

router.post('/add-transcript', (req, res) => {
  console.log(req.body)
  // sessions
  const sessions = ['2011/2012', '2012/2013', '2013/2014', '2014/2015', '2015/2016', '2016/2017', '2017/2018', '2018/2019', '2019/2020', '2020/2021', '2021/2022', '2022/2023']
  // check for student existence
  Student.findByMatric(req.body.matric, (er, r) => {
    // if successful
    if(r != null){
      // check for course existence
      Course.findById(req.body.course, (err, result) => {
        // if found
        if(result != null){
          // create contract
          MainApp.createTranscript({student: r, course: result, session: req.body.session, grade: req.body.grade, remark: req.body.remark }).then(() => {
            // success
            // load course
            Course.getAll((err, result) => {
              if(err == null){
                console.log("Done...");
                res.render('add-transcript', { title: 'Express', error: null, success: 'Operation was successful', courses: result, sessions: sessions });
              } else{

                res.render('add-transcript', { title: 'Express', error: null, success: 'Operation was successful', courses: [], sessions: sessions });
              }
            })
          });

        } else{
          // return with error
          // load course
          Course.getAll((err, result) => {
            if(err == null){
              res.render('add-transcript', { title: 'Express', error: "Course not found", success: null, courses: result, sessions: sessions });
            } else{
              res.render('add-transcript', { title: 'Express', error: "Course not found", success: null, courses: [], sessions: sessions });
            }
          })
        }
      })
    } else{
      // return with error
      // load course
      Course.getAll((err, result) => {
        if(err == null){
          res.render('add-transcript', { title: 'Express', error: "Student not found", success: null, courses: result, sessions: sessions });
        } else{
          res.render('add-transcript', { title: 'Express', error: "Student not found", success: null, courses: [], sessions: sessions });
        }
      })
    }
  });
});

router.get('/get-transcript', (req, res) => {
  res.render('get-transcript', { title: 'Express', error: null, success: null });
});

router.post('/get-transcript', (req, res) => {
  // user exist
  Student.findByPublicKey(req.body.publicKey, (error, result) => {
    if(error != null){
      res.render('get-transcript', { title: 'Express', error: 'Invalid key', success: null });
    } else{
      // get transcript
      MainApp.getTranscript(req.body.publicKey, req.body.institutionAddress).then(data => {
        // res.send(data);
        console.log(result.phone);
        res.render('transcript-view', { title: 'Express', error: null, success: null, transcripts: data, phone: result.phone });
      }).catch(err => {
        console.log(err)
        res.render('get-transcript', { title: 'Express', error: 'No Transcript Found', success: null });
      })
    }
  })
});
module.exports = router;
