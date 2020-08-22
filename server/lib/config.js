import { Meteor } from 'meteor/meteor';
//Set the environment for mailing service. Mailgun is being used for this function
Meteor.startup(function () {
  process.env.MAIL_URL = '';

});
