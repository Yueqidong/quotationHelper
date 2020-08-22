import '../lib/routes.js';
import { clients } from '../lib/collections.js';
import { Accounts } from 'meteor/accounts-base';
import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import swal from 'sweetalert';
import moment from 'moment';

//To enable the user account package
//Accounts.ui.config({
  //passwordSignupFields: 'USERNAME_ONLY'
//});
Meteor.subscribe('roleAssignment');
Meteor.subscribe('userStatus');
