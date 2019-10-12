//--------------//
// Dependencies //
//--------------//
var chalk = require('chalk'); // For ease of local testing
var db = require("../models");
const cron = require('node-cron');
'use strict';
const nodemailer = require('nodemailer');
const Sequelize = require("sequelize");
const Op = Sequelize.Op; // Sequelize querying operator

// Deployed site URL for link in email
let deployURL = 'https://immense-ridge-78589.herokuapp.com/js/methods';



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

  // Message body
  let contents = `
<h2>Great job, ${fn}!</h2>
</br>
<p>You have completed all of the lessons available at this time.</p>
</br>
<p>We will inform you tomorrow if we have a new lesson for you.</p>
</br>
<p>In the mean time, feel free to explore <a href='${deployURL}'>these additional resources</a>!</p>
</br>
<p>Sincerely,</p>
<h3>Your friends at <strong>Group Lynx</strong></h3>
`;

  // Send mail with defined transport object
  transporter.sendMail({
    from: '"Group Lynx 🐱" <projectgroupLynx@gmail.com>', // sender address
    to: em,
    bcc: 'projectgrouplynx@gmail.com',
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

  // Determine the highest id possible
  // SELECT MAX(id) FROM jsMethodsData;
  db.jsMethodsData.max('id').then(function (maxId) {
    console.log(chalk.bgBlue('Highest id in jsMethodsData is :' + maxId));

    // Query the users table for all users
    db.users.findAll({}).then(function (result) {

      // For each user...
      for (let i = 0; i < result.length; i++) {

        // Save user details for later
        let recipientId = result[i].id;
        let recipientName = result[i].userFirstName;
        let recipientEmail = result[i].email;
        let progress = result[i].lastLessonId;
        let contents = "<h3>Javascript methods of the day</h3></br>";

        // If user finished all available lessons, notify by email.
        if (progress === maxId) {
          maxSend(recipientName, recipientEmail);

        } else { // Otherwise query 3 rows of JS methods data applicable to the user
          db.jsMethodsData.findAll({
            where: {
              id: {
                [Op.between]: [(progress + 1), (progress + 3)]
              }
            }
          }).then((res) => {

            // For each method...
            for (let j = 0; j < res.length; j++) {

              // Concatenate new method data and a line break
              contents += `<h2 style="font-size:2em">${res[j].method}</h2>
<p style="font-size:1.5rem">${res[j].descriptions}</p>
</br></br>
`;
              // console.log(chalk.green(contents));

              // If the final method was concatenated...
              if (j === (res.length - 1)) {

                // Append link to the website
                contents += '<a href="' + deployURL + '">View More</a>';

                // Send mail with defined transport object
                transporter.sendMail({
                  from: '"Group Lynx 🐱" <projectgroupLynx@gmail.com>', // sender address
                  to: recipientEmail,
                  bcc: 'projectgrouplynx@gmail.com',
                  subject: "Today's lesson for " + recipientName,
                  html: contents // lesson contents
                }); // End email transmission
              } // End concatenation completion check

            } // End loop through email components
          }); // End of the jsMethodsData table query

          // Increment 1 to this user's table's lastLessonId value.
          // UPDATE users SET lastLessonId = (lastLessonId + 3) WHERE lastLessonId < maxId
          db.users.increment('lastLessonId', {
            by: 3,
            where: {
              id: recipientId
            }
          });

        } // End of condition check for maxSend()

      } // End of the loop through the users
    }) // End of the users table query

  }); // End of the jsMethodsData query

} // End of massSend()


//----------------//
// Task Scheduler //
//----------------//

// Schedule the daily mass transmission task.
const daily = cron.schedule('0 6 * * *', () => {
  console.log('Running daily mass email job');
  massSend();
}, {
    scheduled: true,
    timezone: "America/Chicago" // Use US Central Time
  });

// On load, Node-cron starts the mass transmission schedule.
daily.start();


