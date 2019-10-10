var chalk = require('chalk'); // For ease of local testing
var db = require("../models");
const cron = require('node-cron');
'use strict';
const nodemailer = require('nodemailer');

//------------//
// Nodemailer //
//------------//


// Call this to send lesson email to all users
function main() {

  // Create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'projectgroupLynx@gmail.com',
      pass: 'project-2'
    }
  });

  // Query the users table for all users
  db.users.findAll({}).then(function (result) {

    // For each user...
    for (let i = 0; i < result.length; i++) {

      let recipientName = result[i].userFirstName;
      let recipientEmail = result[i].email;
      let progress = result[i].lastLessonId;
      let contents = "";

      // Query the guides table for HTML components needed for the user's lesson email.
      db.guide.findAll({
        where: {
          lessonId: result[i].lastLessonId
        }
      }).then(function (res) {

        // For each HTML component...
        for (let j = 0; j < res.length; j++) {

          // Concatenate new component and a line break
          contents += res[j].content + "</br>";

          console.log(chalk.yellow(contents));
          console.log(chalk.red(typeof (contents)));

          // If the final component was concatenated...
          if (j === (res.length - 1)) {

            // TO-DO: Append link to the guide page
            // contents += "<a href='' ";

            // Send mail with defined transport object
            transporter.sendMail({
              from: '"Group Lynx 👻" <projectgroupLynx@gmail.com>', // sender address
              to: recipientEmail,
              cc: 'projectgrouplynx@gmail.com',
              subject: "Today's lesson for " + recipientName,
              html: contents // lesson contents
            });
          }

        } // End loop through email components
      }); // End of the guides table query

      //---------------------------------------------------------//
      // TO-DO: Increment 1 to users table's lastLessonId value. //
      //---------------------------------------------------------//

    } // End of the loop through the users
  })   // End of the users table query
}     // End of main()


// Daily mass transmission task.
// let massSend = function () {
//   main().catch(console.error);
// }

// Immediate send test.
// massSend();
main();

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


