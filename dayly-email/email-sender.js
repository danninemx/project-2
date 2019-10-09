var chalk = require('chalk');
var db = require("../models");
const cron = require('node-cron');
'use strict';
const nodemailer = require('nodemailer');


//------------//
// Nodemailer //
//------------//

db.users.findAll({}).then(function (result) {

  // async..await is not allowed in global scope, must use a wrapper
  function main() {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'projectgroupLynx@gmail.com',
        pass: 'project-2'
      }
    });

    for (var i = 0; i < result.length; i++) {

      let recipient = result[i].email;
      let progress = result[i].lastLessonId;
      let contents = "";

      // Query guides table for elements of lesson email.
      db.guide.findAll({
        where: {
          lessonId: result[i].lastLessonId
        }
      }).then(function (res) {

        // Loop through guide contents
        for (var i = 0; i < res.length; i++) {

          // Concatenate new element and add a line break.
          contents += res[i].content + "</br>";
          // contents += res[i].content;

          console.log(chalk.yellow(contents));
          console.log(chalk.red(typeof (contents)));
          transporter.sendMail({
            from: '"Group Lynx 👻" <projectgroupLynx@gmail.com>', // sender address
            to: recipient, // list of receivers
            cc: 'projectgrouplynx@gmail.com', // copy self
            subject: "Today's Javascript lesson for ", // Subject line
            html: contents // lesson contents
          });
        }
      });
      // send mail with defined transport object

      // End of loop through users.

      //---------------------------------------------------------//
      // TO-DO: Increment 1 to users table's lastLessonId value. //
      //---------------------------------------------------------//

      // console.log('Message sent: %s', info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    } // End of the loop through the users list.
  }

  // Daily mass transmission task.
  let massSend = function () {
    main().catch(console.error);
  }

  // Immediate send test.
  massSend();

  //--------------------------------------------------------------------//
  // TO-DO: ADD A ONE-TIME EMAIL TEMPLATE TO BE SENT UPON USER SIGN-UP. //
  //--------------------------------------------------------------------//

  //----------------//
  // Task Scheduler //
  //----------------//


  // Schedule the daily mass transmission task.
  const daily = cron.schedule('0 7 * * *', () => {
    //'0 7 * * *'
    console.log('Running daily job at 07:00');
    massSend();
  }, {
      scheduled: true
    });

  // On load, Node-cron starts the mass transmission schedule.
  daily.start();



});