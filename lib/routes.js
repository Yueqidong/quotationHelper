import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '/client/layouts/layout.js';
import '/client/layouts/header.js';
import '/client/layouts/addUser.js';
import '/client/layouts/login.js';
import '/client/layouts/register.js';
import '/client/layouts/content.js';
import '/client/layouts/export.js';
import '/client/layouts/changePwd.js';
import '/client/layouts/manage.js';
import '/client/layouts/addProduct.js';
import '/client/layouts/deleteProduct.js';
import '/client/layouts/generateQuotation.js';


FlowRouter.route('/', {
    name: 'home',
    action(){
        BlazeLayout.render('layout');
  }
});

FlowRouter.route('/newUsers', {
    name: 'home',
    action(){
        BlazeLayout.render('layout',{main:'addUser'});
  }
});

FlowRouter.route('/login', {
    name: 'home',
    action(){
        BlazeLayout.render('layout',{main:'login'});
  }
});

FlowRouter.route('/register', {
    name: 'home',
    action(){
        BlazeLayout.render('layout',{main:'register'});
  }
});

FlowRouter.route('/content', {
    name: 'home',
    action(){
        BlazeLayout.render('layout',{main:'content'});
  }
});

FlowRouter.route('/export', {
    name: 'home',
    action(){
        BlazeLayout.render('layout',{main:'export'});
  }
});

FlowRouter.route('/changePwd', {
    name: 'home',
    action(){
        BlazeLayout.render('layout',{main:'changePwd'});
  }
});

FlowRouter.route('/manage', {
    name: 'home',
    action(){
        BlazeLayout.render('layout',{main:'manageUsers'});
  }
});

FlowRouter.route('/addProduct', {
    name: 'home',
    action(){
        BlazeLayout.render('layout',{main:'addProduct'});
  }
});

FlowRouter.route('/deleteProduct', {
    name: 'home',
    action(){
        BlazeLayout.render('layout',{main:'deleteProduct'});
  }
});

FlowRouter.route('/generateQuotation', {
    name: 'home',
    action(){
        BlazeLayout.render('layout',{main:'generateQuotation'});
  }
});
