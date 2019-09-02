  const nodemailer = require('nodemailer');
  const sendgridKey = require('./scrt').sendGrid;

  // create reusable transporter object using the default SMTP transport
  module.exports = async function main(email,token, host) {


      let transporter = nodemailer.createTransport({
          host: 'smtp.sendgrid.net',
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
              user: 'apikey',
              pass: sendgridKey.SENDGRID_SECRET
          },
          tls: {
              rejectUnauthorized: false
          }
      });

      // send mail with defined transport object
      let info = await transporter.sendMail({
          from: 'Sendgrid mail <testzasendgrid@outlook.com>', // sender address
          to: email ,
          subject: 'Password reset', // Subject line
          text: 'You are receiving this message because you have requested the reset of the password for your account.' +
              '\nPlease click on the following link or paste this into your browser to complete the process of reseting the password' +
              '\nhttp://' + host + '/reset/' + token // plain text body

      });
      

      console.log(info);
      



  }