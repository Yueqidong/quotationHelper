import { Meteor } from 'meteor/meteor';
import { users,clients,Pokemon,quotation } from '../lib/collections.js';
import './lib/config.js';
import { Accounts } from 'meteor/accounts-base';
import { Email } from 'meteor/email';
import { SSR, Template } from 'meteor/meteorhacks:ssr';


//Accounts.config({forbidClientAccountCreation: true});

Meteor.methods({
  createUsers(emailVar,passwordVar){

    var id;
    id = Accounts.createUser({
        email: emailVar,
        password: passwordVar,
        profile:{email:emailVar}
      });
    if (Meteor.roleAssignment.find({ 'user._id': id }).count() === 0) {

      Roles.createRole('admin', {unlessExists: true});

      Roles.addUsersToRoles(id, 'admin');
  }
},
notifyEmail(email,from,subject,text){
  Meteor.defer(()=>{
    Email.send({to:email,
      from:from,
      subject:subject,
      text:text
    });
  });
},
sendPDF(companyEmail,from,subject,text,pdfResult){
  Meteor.defer(()=>{
    Email.send({to:companyEmail,
      from:from,
      subject:subject,
      text:text,
      attachments:[{path:'data:application/pdf;base64,'+ encodeURI(pdfResult)}]
    });
  });
},
approveClients(email,password,from,subject,text){
  var id;
  id = Accounts.createUser({
      email: email,
      password: password,
      profile:{email:email}
    });
  if (Meteor.roleAssignment.find({ 'user._id': id }).count() === 0) {

    Roles.createRole('client', {unlessExists: true});

    Roles.addUsersToRoles(id, 'client');
    }
    Meteor.defer(()=>{
      Email.send({to:email,
        from:from,
        subject:subject,
        text:text
      });
    });
  },
  exportAllContacts(){
    var fields = [
      "userTitle",
      "name",
      "companyName",
      "companyAddress",
      "BusinessRegistrationNo",
      "email",
      "contact"
    ];

    var data = [];
    var record = clients.find().fetch();
    _.each(record,function(c){
      data.push([
        c.userTitle,
        c.name,
        c.companyName,
        c.companyAddress,
        c.BusinessRegistrationNo,
        c.email,
        c.contact
      ]);
    });
    return {fields:fields, data:data};
  },
  updateClient(companyName,companyAddress,companyEmail,companyContact){
    clients.update({email:companyEmail},{$set:{"companyName":companyName,"companyAddress":companyAddress,"contact":companyContact}});

  },
  deleteUsers(email,userID){
    clients.remove({email:email});
    Meteor.users.remove({'emails.address':email});
    Meteor.roleAssignment.remove({'user._id':userID});
  },
  generate_pdf(response){
    var webshot = Npm.require('webshot-node');
    var fs = Npm.require('fs');
    var Future = Npm.require('fibers/future');
    var fut = new Future();
    var fileName = "pokemon-report.pdf";
    var css = Assets.getText('style.css');

    SSR.compileTemplate('layout', Assets.getText('layout.html'));

    Template.layout.helpers({
      getDocType: function() {
        return "<!DOCTYPE html>";
      }
    });

    SSR.compileTemplate('pokemon_report', Assets.getText('pokemon-report.html'));

    Template.pokemon_report.helpers({
      getTotal: function(){
        var doc = quotation.find({quotationID:response}).fetch();
        var totalAmount = 0;
        var arr = doc[0].invoice;
        for(let i = 0; i<arr.length;i++){
          totalAmount += arr[i].subtotal;
        }
        return totalAmount;
      },
      getTax:function(){
        var doc = quotation.find({quotationID:response}).fetch();
        var totalAmount = 0;
        var arr = doc[0].invoice;
        for(let i = 0; i<arr.length;i++){
          totalAmount += arr[i].subtotal;
        }
        var tax = totalAmount * 1.06;
        return tax.toFixed(2);
      },
      getDiscount:function(){
        var doc = quotation.find({quotationID:response}).fetch();
        var percent = doc[0].discount;
        var discount;
        if(percent == "1"){
          discount = "No discount";
        }else if (percent =="0.95"){
          discount = "Discount 5%";
        }else{
          discount = "Discount 15%";
        }
        return discount;
      },
      getDiscountAmount:function(){
        var doc = quotation.find({quotationID:response}).fetch();
        var totalAmount = 0;
        var arr = doc[0].invoice;
        for(let i = 0; i<arr.length;i++){
          totalAmount += arr[i].subtotal;
        }
        var percent = doc[0].discount;
        var discount = 0;
        if(percent == "1"){
          discount = 0;
        }else if (percent =="0.95"){
          discount = 0.05;
        }else{
          discount = 0.15;
        }
        var result = totalAmount * discount;
        return result;
      },
      getFinal:function(){
        var doc = quotation.find({quotationID:response}).fetch();
        var totalAmount = 0;
        var arr = doc[0].invoice;
        for(let i = 0; i<arr.length;i++){
          totalAmount += arr[i].subtotal;
        }
        var tax = totalAmount * 1.06;

        var percent = doc[0].discount;
        var discount = 0;
        if(percent == "1"){
          discount = 0;
        }else if (percent =="0.95"){
          discount = 0.05;
        }else{
          discount = 0.15;
        }
        var result = totalAmount * discount;
        var final = tax - result;
        return final.toFixed(2);
      },
      getDate:function(){
        var today = new Date();
        var date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
        return date;
      }
    });

     // PREPARE DATA
     var pokemon = quotation.find({quotationID:response});
     var data = {
       quotation: pokemon
     }

     var html_string = SSR.render('layout', {
       css: css,
       template: "pokemon_report",
       data: data
     });

     // Setup Webshot options
      var options = {
          //renderDelay: 2000,
          "paperSize": {
              "format": "Letter",
              "orientation": "portrait",
              "margin": "1cm"
          },
          siteType: 'html'
      };
      console.log("Commencing webshot...");
      webshot(html_string, fileName, options, function(err) {
          fs.readFile(fileName, function (err, data) {
              if (err) {
                  return console.log(err);
              }

              fs.unlinkSync(fileName);
              fut.return(data);

          });
      });

      let pdfData = fut.wait();
      let base64String = Buffer.from(pdfData).toString('base64');

      return base64String;
    },
    'addRecord':function(doc) {
      var today = new Date();
      var month = today.getMonth();
      var day = today.getDate().toString();
      var year = today.getFullYear();
      year = year.toString().substr(-2);
      month = (month + 1).toString();
      if (month.length === 1){
        month = "0" + month;
      }

      if (day.length === 1){
        day = "0" + day;

      }
      var date = month + day + year;
      var currentId = quotation.findOne({},{sort:{quotationID:-1}}).quotationID || 1;
      var number = parseInt(currentId)+1;
      doc.quotationID = number + '.'+date;
      quotation.insert(doc);
      return doc.quotationID;
}

});

Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.roleAssignment.find({ 'user._id': this.userId });
  } else {
    this.ready()
  }
});

Meteor.publish("userStatus", function() {
  return Meteor.users.find();
});
