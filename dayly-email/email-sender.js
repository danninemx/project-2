var chalk = require('chalk'); // For ease of local testing
var db = require("../models");
const cron = require('node-cron');
'use strict';
const nodemailer = require('nodemailer');
const Sequelize = require("sequelize");
const Op = Sequelize.Op; // Sequelize querying operator

// Deployed site URL for link in email
let deployURL = 'https://immense-ridge-78589.herokuapp.com';

//------------//
// Nodemailer //
//------------//

// Call this to email user who finished all lessons
function maxSend(fn, em) {

  // Create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'projectgroupLynx@gmail.com',
      pass: 'project-2'
    }
  });

  // *** TO-DO: Change the temporarily placed API route to HTML route for study page. *** //
  let contents = `
<h2>Great job, ${fn}!</h2>
</br>
<p>You have completed all of the lessons available at this time.</p>
</br>
<p>We will inform you tomorrow if we have a new lesson for you.</p>
</br>
<p>In the mean time, feel free to explore <a href='${deployURL}/api/js/methods'>these additional resources</a>!</p>
</br>
<p>Sincerely,</p>
<h3>Your friends at <strong>Group Lynx</strong></h3>
`;

  // Send mail with defined transport object
  transporter.sendMail({
    from: '"Group Lynx 👻" <projectgroupLynx@gmail.com>', // sender address
    to: em,
    cc: 'projectgrouplynx@gmail.com',
    subject: "Kudos from Group Lynx!",
    html: contents // message body
  });

} // End of maxSend()



// Call this to send lesson email to all users
function massSend() {

  // Create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'projectgroupLynx@gmail.com',
      pass: 'project-2'
    }
  });

  // Determine the highest lessonId possible
  // SELECT MAX(lessonId) FROM guides;
  db.guide.max('lessonId').then(function (maxId) {
    console.log(chalk.bgYellow('Highest lessonId in guides is :' + maxId));

    // Query the users table for all users
    db.users.findAll({}).then(function (result) {

      // For each user...
      for (let i = 0; i < result.length; i++) {

        // Save user details for later
        let recipientId = result[i].id;
        let recipientName = result[i].userFirstName;
        let recipientEmail = result[i].email;
        let progress = result[i].lastLessonId;
        let contents = "";

        // If user already has highest lesson # available...
        if (progress === maxId) {
          maxSend(recipientName, recipientEmail);

        } else {
          // Query the guides table for HTML components needed for the user's lesson email.
          db.guide.findAll({
            where: {
              lessonId: (progress + 1),
              paragraph: {
                [Op.lt]: 4 // < 4 rows of data.
              }
            }
          }).then(function (res) {

            // For each HTML component...
            for (let j = 0; j < res.length; j++) {

              // Concatenate new component and a line break
              contents += res[j].content + "</br>";

              console.log(chalk.bgWhite(contents));

              // If the final component was concatenated...
              if (j === (res.length - 1)) {

                // Append link to the guide page
                contents += '<a href="' + deployURL + '">Continue Reading</a>';

                // Send mail with defined transport object
                transporter.sendMail({
                  from: '"Group Lynx 👻" <projectgroupLynx@gmail.com>', // sender address
                  to: recipientEmail,
                  cc: 'projectgrouplynx@gmail.com',
                  subject: "Today's lesson for " + recipientName,
                  html: contents // lesson contents
                }); // End email transmission
              } // End concatenation completion check

            } // End loop through email components
          }); // End of the guides table query

          // Increment 1 to this user's table's lastLessonId value.
          // UPDATE users SET lastLessonId = (lastLessonId + 1) WHERE lastLessonId < maxId
          db.users.increment('lastLessonId', {
            where: {
              id: recipientId
            }
          });

        } // End of condition check for maxSend()

      } // End of the loop through the users
    }) // End of the users table query

  }); // End of the MAX(guides.lessonId) query

} // End of massSend()


//----------------//
// Task Scheduler //
//----------------//

// Schedule the daily mass transmission task.
const daily = cron.schedule('0 7 * * *', () => {
  console.log('Running daily job at 07:00 AM');
  massSend();
}, {
    scheduled: true,
    timezone: "America/Chicago" // Use US Central Time
  });

// On load, Node-cron starts the mass transmission schedule.
daily.start();


